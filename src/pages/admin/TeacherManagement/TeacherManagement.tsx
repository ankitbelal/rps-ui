import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Card, Button, Table, Badge, Form } from "react-bootstrap";
import TeacherFormModal from "./Partials/TeacherFormModal";
import DeleteConfirmationModal from "./Partials/DeleteConfirmationModal";
import TeacherEditModal from "./Partials/TeacherEditModal";
import {
  useGetTeacherQuery,
  useGetTeacherByIdQuery,
  useAddTeacherMutation,
  useDeleteTeacherMutation,
  useEditTeacherMutation,
  useLazyTeacherReportQuery,
} from "../../../features/admin/teacher/teacherApi";
import { Teacher } from "../../../features/admin/teacher/utils";
import ViewTeacherDetailsModal from "./Partials/TeacherDetailsModal";
import { TeacherFormData } from "../../../features/admin/teacher/utils";
import toast from "react-hot-toast";
import { FaChalkboardTeacher, FaTachometerAlt } from "react-icons/fa";
import { setPageTitle } from "../../../features/ui/uiSlice";
import { useAppDispatch } from "../../../app/hooks";
import CommonBreadCrumb from "../../../Component/common/BreadCrumb";
import AssignSubjectsModal from "./Partials/AssignSubjects";
import PaginationComponent from "../../../Component/common/Pagination";


const TeacherManagement: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setPageTitle({
        title: "Teacher Management",
        subtitle: "Manage teacher profiles and information",
      }),
    );
  }, [dispatch]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacherId, setViewingTeacherId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [isExporting, setIsExporting] = useState(false);

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
      gender: genderFilter,
    }),
    [debouncedSearch, currentPage, itemsPerPage, genderFilter],
  );

  const {
    data: teacherData,
    isLoading: isTeacherLoading,
    isFetching,
  } = useGetTeacherQuery(queryParams,{refetchOnMountOrArgChange:true});
  const [addTeacher, { isLoading: isAddingTeacher }] = useAddTeacherMutation();
  const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation();
  const [editTeacher, { isLoading: isUpdatingTeacher }] =
    useEditTeacherMutation();
  const [exportTeacherReport] = useLazyTeacherReportQuery();

  // Fetch teacher details for view modal
  const {
    data: teacherDetailsData,
    isLoading: isLoadingDetails,
    isFetching: isFetchingDetails,
  } = useGetTeacherByIdQuery(viewingTeacherId!, {
    skip: !viewingTeacherId,
  });

  // Calculate pagination
  let startIndex = 0;
  let endIndex = 0;

  if (teacherData) {
    startIndex =
      teacherData?.total === 0
        ? 0
        : (teacherData?.page - 1) * teacherData?.limit + 1;
    endIndex = Math.min(
      teacherData?.page * teacherData?.limit,
      teacherData?.total,
    );
  }

  // Reset to first page when filters or items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, genderFilter, itemsPerPage]);

  const onSubmit = async (data: TeacherFormData) => {
    if (!data) return;
    try {
      const response = await addTeacher(data).unwrap();
      if (response.success) {
        toast.success(response.message);
        setShowFormModal(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setViewingTeacherId(teacher.id);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };
  const handleUpdateTeacher = async (data: TeacherFormData) => {
    if (!data) return;
    try {
      const response = await editTeacher({
        data,
        id: viewingTeacherId,
      }).unwrap();
      if (response.success) {
        toast.success(response.message);
        setViewingTeacherId(null);
        setShowEditModal(false);
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to edit techer";
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (teacher: Teacher) => {
    setDeletingTeacher(teacher);
    setShowDeleteModal(true);
  };

  const handleViewDetails = (teacher: Teacher) => {
    setViewingTeacherId(teacher.id);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setViewingTeacherId(null);
    setShowViewModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTeacher) return;
    try {
      const response = await deleteTeacher(deletingTeacher.id).unwrap();
      if (response.success) {
        toast.success(response.message);
        setShowDeleteModal(false);
        setDeletingTeacher(null);
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to delete techer";
      toast.error(errorMessage);
    }
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingTeacher(null);
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
    setGenderFilter("all");
  };

  const handleAssignClick = (teacherId: number, teacherName: string) => {
    setSelectedTeacher({ id: teacherId, name: teacherName });
    setShowAssignModal(true);
  };

  return (
    <>
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <CommonBreadCrumb
            items={[
              {
                label: "Dashboard",
                link: "/admin/dashboard",
                icon: <FaTachometerAlt />,
              },
              {
                label: "Teacher Management",
                active: true,
              },
            ]}
          />

          <div className="d-flex gap-2">
            {/* Export Button */}
            {/* Export Button - Fixed with correct Teacher filters */}
            <Button
              variant="success"
              disabled={isExporting || isTeacherLoading || isFetching}
              className="d-flex align-items-center gap-2 mb-4"
              style={{ backgroundColor: "#198754", borderColor: "#198754" }}
              onClick={async () => {
                setIsExporting(true);
                try {
                  // Use the correct Teacher query params
                  const blob = await exportTeacherReport({
                    search: debouncedSearch,
                    gender: genderFilter !== "all" ? genderFilter : undefined, // Fix: Use genderFilter
                    page: currentPage, // Optional: include current pagination
                    limit: itemsPerPage, // Optional: include current limit
                  }).unwrap();

                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `TeacherReport_${new Date().toISOString().split("T")[0]}.xlsx`;
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
              disabled={isTeacherLoading || isFetching}
            >
              <i className="fas fa-plus"></i>
              Add Teacher
            </Button>
          </div>
        </div>

        {/* Search and Filters Section */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-3">
            <Row className="g-3">
              {/* Search Bar */}
              <Col md={6}>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-light"
                    placeholder="Search teachers by name, email or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isTeacherLoading}
                  />
                </div>
              </Col>

              {/* Gender Filter */}
              <Col md={3}>
                <Form.Select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="bg-light border-0"
                  disabled={isTeacherLoading || isFetching}
                >
                  <option value="all">All Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </Form.Select>
              </Col>
            </Row>

            {/* Clear Filters Button */}
            {(searchTerm || genderFilter !== "all") && (
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

        {/* Teachers Table */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3">
            <div className="px-3 pb-3">
              <PaginationComponent 
                itemsPerPage={itemsPerPage}
                isLoading={isTeacherLoading || isFetching}
                startIndex={startIndex}
                endIndex={endIndex}
                total={teacherData?.total??0}
                lastPage={teacherData?.lastPage??0}
                page={teacherData?.page??0}
                handlePageChange={handlePageChange}
                handleItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {isTeacherLoading || isFetching ? (
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
                        <th>Teacher Information</th>
                        <th>Contact</th>
                        <th>Address</th>
                        <th>Joined On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teacherData?.data && teacherData?.data.length > 0 ? (
                        teacherData.data.map((item, key) => {
                          const genderConfig = getGenderBadge(item.gender);
                          const serialNumber =
                            (currentPage - 1) * itemsPerPage + key + 1;
                          return (
                            <tr key={key}>
                              <td className="fw-semibold">{serialNumber}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2">
                                    <i className="fas fa-user text-primary"></i>
                                  </div>
                                  <div>
                                    <div className="fw-semibold">
                                      {item.firstName} {item.lastName}
                                    </div>
                                    <div className="mt-1">
                                      <Badge bg={genderConfig.variant}>
                                        {genderConfig.label}
                                      </Badge>
                                    </div>
                                  </div>
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
                              <td>{item.address1}</td>
                              <td>{formatDate(item.createdAt)}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleEdit(item)}
                                    title="Edit"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDeleteClick(item)}
                                    title="Delete"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </Button>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() =>
                                      handleAssignClick(
                                        item.id,
                                        `${item.firstName} ${item.lastName}`,
                                      )
                                    }
                                    title="Assign Subjects"
                                  >
                                    <i className="fas fa-book"></i>
                                  </Button>
                                  <Button
                                    variant="outline-info"
                                    size="sm"
                                    title="View Details"
                                    onClick={() => handleViewDetails(item)}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-5">
                            <div className="text-muted">
                              <FaChalkboardTeacher />
                              <p className="mb-2">No teachers found</p>
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
                isLoading={isTeacherLoading || isFetching}
                startIndex={startIndex}
                endIndex={endIndex}
                total={teacherData?.total??0}
                lastPage={teacherData?.lastPage??0}
                page={teacherData?.page??0}
                handlePageChange={handlePageChange}
                handleItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Form Modal */}
      <TeacherFormModal
        show={showFormModal}
        onHide={handleCloseFormModal}
        onSubmit={onSubmit}
        isLoading={isAddingTeacher}
      />

      <TeacherEditModal
        show={showEditModal}
        onHide={handleCloseEditModal}
        onSubmit={handleUpdateTeacher}
        isLoading={isLoadingDetails || isFetchingDetails}
        teacherData={teacherDetailsData?.data?.[0]}
        isUpdating={isUpdatingTeacher}
      />

      <ViewTeacherDetailsModal
        show={showViewModal}
        onHide={handleCloseViewModal}
        teacherId={viewingTeacherId}
      />

      {selectedTeacher && (
        <AssignSubjectsModal
          show={showAssignModal}
          onHide={() => {
            setShowAssignModal(false);
            setSelectedTeacher(null);
          }}
          teacherId={selectedTeacher.id}
          teacherName={selectedTeacher.name}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        teacherName={
          deletingTeacher
            ? `${deletingTeacher.firstName} ${deletingTeacher.lastName}`
            : ""
        }
        isLoading={isDeleting}
      />
    </>
  );
};

export default TeacherManagement;
