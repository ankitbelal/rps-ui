import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Table, Badge, Form } from "react-bootstrap";
import StudentFormModal from "./partials/StudentFormModal";
import DeleteConfirmationModal from "./partials/DeleteConfirmationModal";
import ViewStudentDetailsModal from "./partials/StudentDetailsModal";
import StudentEditModal from "./partials/EditStudentModal";
import {
  useGetStudentsQuery,
  useGetProgramsQuery,
  useDeleteStudentMutation,
  useAddStudentMutation,
  useGetStudentByIdQuery,
  useEditStudentMutation,
  useLazyStudentReportQuery,
} from "../../../features/admin/students/studentApi";
import { Student } from "../../../features/admin/students/utils";
import toast from "react-hot-toast";
import { StudentForm } from "../../../features/admin/students/utils";
import { FaTachometerAlt, FaUserGraduate } from "react-icons/fa";
import { EditStudentFormData } from "./validations/editStudentSchema";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setPageTitle } from "../../../features/ui/uiSlice";
import CommonBreadCrumb from "../../../Component/common/BreadCrumb";
import { RootState } from "../../../app/store";
import { getRoleByType } from "../../../helper";
import PaginationComponent from "../../../Component/common/Pagination";
import { UseFormSetError } from "react-hook-form";

const StudentManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(
      setPageTitle({
        title: "Student Management",
        subtitle: "Manage student registrations and information",
      }),
    );
  }, [dispatch]);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [viewingStudentId, setViewingStudentId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [programFilter, setProgramFilter] = useState<string>("");
  const [semesterFilter, setSemesterFilter] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    if (user) {
      const role = getRoleByType(user.UserType);
      setUserRole(role === "superadmin" ? "admin" : role);
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
      currentSemester: Number(semesterFilter),
      programId: Number(programFilter),
      status: statusFilter,
    }),
    [
      currentPage,
      itemsPerPage,
      debouncedSearch,
      semesterFilter,
      programFilter,
      statusFilter,
    ],
  );

  const {
    data: studentsData,
    isLoading,
    isFetching,
  } = useGetStudentsQuery(queryParams, { refetchOnMountOrArgChange: true });
  const { data: programData } = useGetProgramsQuery();
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
  const [addStudent, { isLoading: isAddingStudent }] = useAddStudentMutation();
  const [editStudent, { isLoading: isUpdatingStudent }] =
    useEditStudentMutation();

  // Fetch student details for view modal
  const {
    data: studentDetailsData,
    isLoading: isLoadingDetails,
    isFetching: isStudentDetailsFetching,
  } = useGetStudentByIdQuery(viewingStudentId!, {
    skip: !viewingStudentId,
  });

  const [exportStudentReport] = useLazyStudentReportQuery();

  // Calculate pagination
  let startIndex = 0;
  let endIndex = 0;
  let totalCount = 0;
  if (studentsData) {
    startIndex =
      studentsData?.total === 0
        ? 0
        : (studentsData?.page - 1) * studentsData?.limit + 1;
    endIndex = Math.min(
      studentsData?.page * studentsData?.limit,
      studentsData?.total,
    );
    totalCount = studentsData?.total;
  }

  // Reset to first page when filters or items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, programFilter, semesterFilter, itemsPerPage]);

  const onSubmit = async (
    data: StudentForm,
    setError: UseFormSetError<StudentForm>,
  ) => {
    if (!data) return;
    try {
      const response = await addStudent(data).unwrap();
      if (response.success) {
        toast.success(response.message);
        setShowFormModal(false);
      }
    } catch (error: any) {
      const apiErrors = error?.data?.errors;
      if (apiErrors) {
        Object.entries(apiErrors).forEach(([field, message]) => {
          setError(field as keyof StudentForm, {
            type: "server",
            message: message as string,
          });
        });
      } else {
        toast.error(error?.data?.message);
      }
    }
  };

  const handleEditModalOpen = (student: Student) => {
    setViewingStudentId(student.id);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setViewingStudentId(null);
  };

  const handleEditConfirm = async (
    data: EditStudentFormData,
    setError: UseFormSetError<EditStudentFormData>,
  ) => {
    if (!data) return;
    try {
      const response = await editStudent({
        data,
        id: viewingStudentId,
      }).unwrap();
      if (response.success) {
        toast.success(response.message);
        setShowEditModal(false);
        setViewingStudentId(null);
      }
    } catch (error: any) {
      const apiErrors = error?.data?.errors;
      if (apiErrors) {
        Object.entries(apiErrors).forEach(([field, message]) => {
          setError(field as keyof EditStudentFormData, {
            type: "server",
            message: message as string,
          });
        });
      } else {
        toast.error(error?.data?.message);
      }
    }
  };

  const handleDeleteClick = (student: Student) => {
    setDeletingStudent(student);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    try {
      const response = await deleteStudent(deletingStudent.id).unwrap();
      if (response.success) {
        toast.success(response.message);
        handleCloseDeleteModal();
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingStudent(null);
  };

  const handleViewDetails = (student: Student) => {
    setViewingStudentId(student.id);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingStudentId(null);
  };

  const handleAddNew = () => {
    setShowFormModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: "A" | "P" | "S") => {
    switch (status) {
      case "A":
        return <Badge bg="success">Active</Badge>;
      case "P":
        return <Badge bg="warning">Passed</Badge>;
      case "S":
        return <Badge bg="secondary">Suspended</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getGenderBadge = (gender: "M" | "F" | "O") => {
    const config = {
      M: { label: "Male", variant: "primary" },
      F: { label: "Female", variant: "danger" },
      O: { label: "Other", variant: "info" },
    };
    return config[gender];
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(event.target.value));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setProgramFilter("");
    setSemesterFilter("");
  };

  return (
    <>
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <CommonBreadCrumb
            items={[
              {
                label: "Dashboard",
                link: `${userRole === "admin" ? "/admin" : "/teacher"}/dashboard`,
                icon: <FaTachometerAlt />,
              },
              {
                label: "Student Management",
                active: true,
              },
            ]}
          />
          {userRole === "admin" && (
            <div className="d-flex gap-2">
              {/* Export Button */}
              <Button
                variant="success"
                disabled={isExporting || isLoading || isFetching}
                className="d-flex align-items-center gap-2 mb-4"
                style={{ backgroundColor: "#198754", borderColor: "#198754" }}
                onClick={async () => {
                  setIsExporting(true);
                  try {
                    const blob = await exportStudentReport({
                      search: debouncedSearch,
                      programId: programFilter
                        ? Number(programFilter)
                        : undefined,
                      currentSemester: semesterFilter
                        ? Number(semesterFilter)
                        : undefined,
                      status: statusFilter || undefined,
                    }).unwrap();

                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "StudentReport.xlsx"; // dynamic filename if needed
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);

                    toast.success("Report downloaded!");
                  } catch (err: any) {
                    const errorMsg = err?.data?.message;
                    toast.error(errorMsg || "Failed to export report.");
                  } finally {
                    setIsExporting(false);
                  }
                }}
              >
                {isExporting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Exporting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-export"></i>
                    Export Data
                  </>
                )}
              </Button>

              {/* Add Student Button */}
              <Button
                variant="primary"
                onClick={handleAddNew}
                className="d-flex align-items-center gap-2 mb-4"
                disabled={isLoading || isFetching}
              >
                <i className="fas fa-plus"></i>
                Add Student
              </Button>
            </div>
          )}
        </div>

        {/* Search and Filters Section */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-3">
            <Row className="g-3">
              {/* Search Bar */}
              <Col md={4}>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-light"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </Col>

              {/* Status Filter */}
              <Col md={2}>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-light border-0"
                  disabled={isLoading || isFetching}
                >
                  <option value="">All Status</option>
                  <option value="A">Active</option>
                  <option value="P">Passed</option>
                  <option value="S">Suspended</option>
                </Form.Select>
              </Col>

              {/* Program Filter */}
              <Col md={2}>
                <Form.Select
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                  className="bg-light border-0"
                  disabled={isLoading || isFetching}
                >
                  <option value="">All Programs</option>
                  {programData?.data.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.code}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              {/* Semester Filter */}
              <Col md={2}>
                <Form.Select
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value)}
                  className="bg-light border-0"
                  disabled={isLoading || isFetching}
                >
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            {/* Clear Filters Button */}
            {(searchTerm ||
              statusFilter !== "" ||
              programFilter !== "" ||
              semesterFilter !== "") && (
              <div className="mt-3">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={clearFilters}
                  className="d-flex align-items-center gap-1"
                >
                  <i className="fas fa-times"></i>
                  Clear Filters
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Students Table */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3">
            <div className="px-3 pb-3">
              <PaginationComponent
                itemsPerPage={itemsPerPage}
                isLoading={isLoading || isFetching}
                startIndex={startIndex}
                endIndex={endIndex}
                total={totalCount}
                lastPage={studentsData?.lastPage ?? 0}
                page={studentsData?.page ?? 1}
                handlePageChange={handlePageChange}
                handleItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {isLoading || isFetching ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>SN</th>
                        <th>Name</th>
                        <th>Reg-No</th>
                        <th>Roll-No</th>
                        <th>Program</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsData?.data && studentsData?.data?.length > 0 ? (
                        studentsData.data.map((item, key) => {
                          const genderConfig = getGenderBadge(item.gender);
                          const serialNumber =
                            (currentPage - 1) * itemsPerPage + key + 1;
                          return (
                            <tr key={key}>
                              <td className="fw-semibold">{serialNumber}.</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2">
                                    <i className="fas fa-user-graduate text-primary"></i>
                                  </div>
                                  <div>
                                    <div className="fw-semibold">
                                      {item.firstName} {item.lastName}
                                    </div>
                                    <div className="mt-1">
                                      <Badge
                                        bg={genderConfig.variant}
                                        className="me-1"
                                      >
                                        {genderConfig.label}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="fw-semibold">
                                  {item.registrationNumber}
                                </div>
                              </td>
                              <td>
                                <div className="fw-semibold">
                                  {item.rollNumber}
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div className="fw-semibold">
                                    {item.program.name}
                                  </div>
                                  <div className="d-flex align-items-center gap-2 mt-1">
                                    <span className="badge bg-light text-dark">
                                      Semester {item.currentSemester}
                                    </span>
                                  </div>
                                  <small className="text-muted d-block mt-1">
                                    Enrolled:{" "}
                                    {formatDate(
                                      item.enrollmentDate || item.createdAt,
                                    )}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <a
                                    href={`mailto:${item.email}`}
                                    className="text-decoration-none d-block"
                                  >
                                    <i className="fas fa-envelope me-1"></i>
                                    {item.email}
                                  </a>
                                  {item.phone && (
                                    <a
                                      href={`tel:${item.phone}`}
                                      className="text-decoration-none d-block mt-1"
                                    >
                                      <i className="fas fa-phone me-1"></i>
                                      {item.phone}
                                    </a>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex flex-column gap-1">
                                  {getStatusBadge(item.status)}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  {userRole === "admin" && (
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() => handleEditModalOpen(item)}
                                      title="Edit"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </Button>
                                  )}
                                  {userRole === "admin" && (
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      onClick={() => handleDeleteClick(item)}
                                      title="Delete"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline-info"
                                    size="sm"
                                    onClick={() => handleViewDetails(item)}
                                    title="View Details"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </Button>
                                  <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() =>
                                      navigate("/admin/students/marks-entry", {
                                        state: { id: item.id, item },
                                      })
                                    }
                                    title="Marks Entry"
                                  >
                                    <i className="fas fa-file-alt"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center py-5">
                            <div className="text-muted">
                              <FaUserGraduate />
                              <p className="mb-2">No students found</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </>
            )}
            {/* Bottom pagination controls */}
            <div className="px-3 pb-3">
              <PaginationComponent
                itemsPerPage={itemsPerPage}
                isLoading={isLoading || isFetching}
                startIndex={startIndex}
                endIndex={endIndex}
                total={totalCount}
                lastPage={studentsData?.lastPage ?? 0}
                page={studentsData?.page ?? 1}
                handlePageChange={handlePageChange}
                handleItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Form Modal */}
      <StudentFormModal
        show={showFormModal}
        onHide={handleCloseFormModal}
        onSubmit={onSubmit}
        isLoading={isAddingStudent}
        programs={programData?.data || []}
      />

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        studentName={
          deletingStudent
            ? `${deletingStudent.firstName} ${deletingStudent.lastName}`
            : ""
        }
        isLoading={isDeleting}
      />

      <ViewStudentDetailsModal
        show={showViewModal}
        onHide={handleCloseViewModal}
        student={studentDetailsData?.data?.[0]}
        isLoading={isLoadingDetails || isStudentDetailsFetching}
      />
      <StudentEditModal
        show={showEditModal}
        onHide={handleCloseEditModal}
        onSubmit={handleEditConfirm}
        isLoading={isUpdatingStudent}
        isGettingData={isLoadingDetails || isStudentDetailsFetching}
        programs={programData?.data || []}
        studentData={studentDetailsData?.data?.[0]}
      />
    </>
  );
};

export default StudentManagement;
