import React, { useState, useEffect, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  Badge,
  Dropdown,
} from "react-bootstrap";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import {
  useGetProgramsQuery,
  useGetTeacherListQuery,
} from "../../../features/admin/students/studentApi";
import {
  useGetSubjectsQuery,
  useAddSubjectMutation,
  useAssignParametersMutation,
  useEditSubjectMutation,
  useDeleteSubjectMutation,
} from "../../../features/admin/subjects/subjectApi";
import SubjectFormModal from "./partials/SubjectFormModal";
import { SubjectFormData } from "./partials/SubjectFormModal";
import EvaluationParameterModal from "./partials/EvaluationParameterModal";
import { params } from "./partials/EvaluationParameterModal";
import SubjectEditModal from "./partials/SubjectEditModal";
import { Subject } from "../../../features/admin/subjects/utils";
import DeleteConfirmationModal from "../../../Component/DeleteModal/DeleteConfirmationModal";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setPageTitle } from "../../../features/ui/uiSlice";
import CommonBreadCrumb from "../../../Component/common/BreadCrumb";
import { FaTachometerAlt } from "react-icons/fa";
import { RootState } from "../../../app/store";
import { getRoleByType } from "../../../helper";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 50];

const SubjectManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(
      setPageTitle({
        title: "Subject Management",
        subtitle: "Manage academic Subjects and information",
      }),
    );
  }, [dispatch]);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [programFilter, setProgramFilter] = useState<string>("");
  const [semesterFilter, setSemesterFilter] = useState<string>("");
  const [editingSubject, SetEditingSubject] = useState<Subject | null>(null);
  const [userRole,setUserRole] = useState<string>("")

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //   });
  // };

  useEffect(()=>{
    if(user){
      setUserRole(getRoleByType(user.UserType));
    }
  },[user])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      programId: programFilter || "",
      semester: Number(semesterFilter),
      page: currentPage,
      limit: itemsPerPage,
    }),
    [debouncedSearch, programFilter, semesterFilter, currentPage, itemsPerPage],
  );

  const {
    data: subjectData,
    isLoading: isSubjectLoading,
    isFetching,
  } = useGetSubjectsQuery(queryParams,{refetchOnMountOrArgChange:true});

  const { data: programData, isLoading: isProgramLoading } = useGetProgramsQuery(undefined,{refetchOnMountOrArgChange:true});
  const { data: TeachersData, isLoading: isTeachersLoading } = useGetTeacherListQuery(undefined,{refetchOnMountOrArgChange:true});
  const [addSubject, { isLoading: isAddingStudent }] = useAddSubjectMutation();
  const [assignParams, { isLoading: isAssigning }] = useAssignParametersMutation();
  const [editSubject, { isLoading: isEditing }] = useEditSubjectMutation();
  const [deleteSubject, { isLoading: isDeleting }] = useDeleteSubjectMutation();

  // Calculate pagination
  let startIndex = 0;
  let endIndex = 0;

  if (subjectData) {
    startIndex =
      subjectData?.total === 0
        ? 0
        : (subjectData?.page - 1) * subjectData?.limit + 1;
    endIndex = Math.min(
      subjectData?.page * subjectData?.limit,
      subjectData?.total,
    );
  }

  // Reset to first page when filters or items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, programFilter, semesterFilter, itemsPerPage]);

  const handleOpenEvaluationModal = (
    subjectId: number,
    subjectName: string,
  ) => {
    setSelectedSubject({ id: subjectId, name: subjectName });
    setShowEvaluationModal(true);
  };

  const handleCloseEvaluationModal = () => {
    setShowEvaluationModal(false);
    setSelectedSubject(null);
  };

  const handleSaveEvaluationParameters = async (parameters: params[]) => {
    try {
      const payload = {
        subjectId: selectedSubject?.id,
        parameters: parameters,
      };
      const response = await toast.promise(assignParams(payload).unwrap(), {
        loading: "Saving...",
        error: "Could not save.",
      });
      if (response.success) {
        toast.success(
          response.message || "Evaluation parameters saved successfully!",
        );
        handleCloseEvaluationModal();
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to save evaluation parameters",
      );
    }
  };

  const onSubmit = async (data: SubjectFormData) => {
    if (!data) return;
    try {
      const response = await addSubject(data).unwrap();
      if (response.success) {
        toast.success(response.message);
        setShowFormModal(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  const handleEdit = (subjectData: Subject) => {
    SetEditingSubject(subjectData);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    SetEditingSubject(null);
    setShowEditModal(false);
  };

  const handleUpdateProgram = async (data: SubjectFormData) => {
    // if (!data) return;
    try {
      const response = await toast.promise(
        editSubject({ id: editingSubject?.id, data }).unwrap(),
        {
          loading: "Editing...",
          error: "Failed to Update",
        },
      );
      if (response.success) {
        toast.success(response.message);
        handleCloseEditModal();
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to update subject";
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (subjectId: number, subjectName: string) => {
    setSelectedSubject({ id: subjectId, name: subjectName });
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedSubject(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSubject) return;
    try {
      const response = await toast.promise(
        deleteSubject(selectedSubject.id).unwrap(),
        {
          loading: "Deleting...",
          error: "Failed to delete subject",
        },
      );
      if (response.success) {
        toast.success(response.message);
        handleCloseDeleteModal();
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to delete program";
      toast.error(errorMessage);
    }
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const handleAddNew = () => {
    setShowFormModal(true);
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
    setProgramFilter("");
    setSemesterFilter("");
  };

  // Render pagination controls component (reusable)
  const renderPaginationControls = () => (
    <div
      className={`d-flex justify-content-between align-items-center border-top pt-3`}
    >
      {/* Items per page and showing info */}
      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small">Show:</span>
          <Form.Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            size="sm"
            className="w-auto"
            style={{ width: "80px" }}
          >
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
          <span className="text-muted small ms-2">per page</span>
        </div>
        <span className="text-muted">
          Showing {startIndex + 1}-{endIndex} of {subjectData?.total} programs
        </span>
      </div>

      {/* Material-UI Pagination */}
      {subjectData && subjectData?.total > 1 && (
        <Stack spacing={2}>
          <Pagination
            count={subjectData?.lastPage}
            page={subjectData?.page}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            color="primary"
            showFirstButton
            showLastButton
            size={"medium"}
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "0.875rem",
              },
              "& .MuiPaginationItem-page.Mui-selected": {
                backgroundColor: "#0d6efd",
                color: "white",
                "&:hover": {
                  backgroundColor: "#0b5ed7",
                },
              },
            }}
          />
        </Stack>
      )}
    </div>
  );

  return (
    <>
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <CommonBreadCrumb
            items={[
              {
                label: "Dashboard",
                link: `${userRole==="admin"?"/admin":"/teacher"}/dashboard`,
                icon: <FaTachometerAlt />,
              },
              {
                label: "Subject Management",
                active: true,
              },
            ]}
          />
          {(userRole==="admin")&&
            <Button
              variant="primary"
              onClick={handleAddNew}
              className="d-flex align-items-center gap-2 mb-4"
            >
              <i className="fas fa-plus"></i>
              Add Subjects
            </Button>
          }
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
                    placeholder="Search subjects by name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isSubjectLoading}
                  />
                </div>
              </Col>

              <Col md={3}>
                <Form.Select
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                  className="bg-light border-0"
                  disabled={isProgramLoading || isFetching || isSubjectLoading}
                >
                  <option value="">
                    {isProgramLoading ? "Loading..." : "All Programs"}
                  </option>
                  {programData?.data.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.code}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              {/* Semester Filter */}
              <Col md={3}>
                <Form.Select
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value)}
                  className="bg-light border-0"
                  disabled={isSubjectLoading || isFetching}
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
            {searchTerm && (
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

        {/* Programs Table */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3">
            <div className="px-3 pb-3">{renderPaginationControls()}</div>
          </Card.Header>
          <Card.Body className="p-0">
            {isSubjectLoading || isFetching ? (
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
                        <th>Subject Code</th>
                        <th>Subject Name</th>
                        {(userRole==="admin")&&<th>Teacher</th>}
                        <th>Details</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectData?.data && subjectData?.data.length > 0 ? (
                        subjectData.data.map((item, key) => {
                          const serialNumber =
                            (currentPage - 1) * itemsPerPage + key + 1;
                          return (
                            <tr key={key}>
                              <td className="fw-semibold">{serialNumber}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2">
                                    <i className="fas fa-book text-primary"></i>
                                  </div>
                                  <div className="fw-semibold">
                                    {item.code}
                                    {/* <small className="text-muted d-block mt-1">
                                      {item.type}
                                    </small> */}
                                    <small className="text-muted d-block mt-1">
                                      <Badge bg="primary">{item.type}</Badge>
                                    </small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="fw-semibold">
                                  {item.name}
                                  <small className="text-muted d-block mt-1">
                                    Program: {item?.program?.code}
                                  </small>
                                </div>
                              </td>
                            {(userRole==="admin")&&
                              <td>
                                {item?.subjectTeacher ? (
                                  <>
                                    <div className="fw-semibold">
                                      {item.subjectTeacher.firstName +
                                        " " +
                                        item.subjectTeacher.lastName}
                                    </div>
                                    <div>
                                      <a
                                        href={`mailto:${item.subjectTeacher.email}`}
                                        className="text-decoration-none d-block"
                                      >
                                        <i className="fas fa-envelope me-1"></i>
                                        {item.subjectTeacher.email}
                                      </a>
                                    </div>
                                  </>
                                ) : (
                                  <span className="badge bg-danger">
                                    Not Assigned
                                  </span>
                                )}
                              </td>
                            }

                              <td>
                                <div>
                                  <small className="d-block mt-1">
                                    semester: {item?.semester}
                                  </small>
                                  <div className="d-flex align-items-center gap-2 mt-1">
                                    <Badge bg="success">
                                      Credits: {item.credits}
                                    </Badge>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  {/* Edit Button */}
                                {(userRole==="admin")&&
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleEdit(item)}
                                    title="Edit"
                                    className="d-flex align-items-center"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </Button>
                                }
                                  {/* Evaluation Parameters Button */}
                                  <Button
                                    variant="outline-info"
                                    size="sm"
                                    onClick={() =>
                                      handleOpenEvaluationModal(
                                        item.id,
                                        item.name,
                                      )
                                    }
                                    title="Evaluation Parameters"
                                    className="d-flex align-items-center"
                                  >
                                    <i className="fas fa-sliders-h"></i>
                                  </Button>

                                  {/* Delete Button */}
                                {(userRole==="admin")&& 
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteClick(item.id, item.name)
                                    }
                                    title="Delete"
                                    className="d-flex align-items-center"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </Button>
                                }
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            <div className="text-muted">
                              <i className="fas fa-inbox fa-2x mb-2"></i>
                              <p>No subjects found</p>
                              {searchTerm && (
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={clearFilters}
                                >
                                  Clear search
                                </Button>
                              )}
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
            <div className="px-3 pb-3">{renderPaginationControls()}</div>
          </Card.Body>
        </Card>
      </div>

      {selectedSubject && (
        <EvaluationParameterModal
          show={showEvaluationModal}
          onHide={handleCloseEvaluationModal}
          subjectId={selectedSubject.id}
          subjectName={selectedSubject.name}
          onSave={handleSaveEvaluationParameters}
          isSaving={isAssigning}
        />
      )}

      {/* Form Modal */}
      <SubjectFormModal
        show={showFormModal}
        onHide={handleCloseFormModal}
        onSubmit={onSubmit}
        isLoading={isAddingStudent}
        programs={programData?.data || []}
        teachers={TeachersData?.data || []}
      />

      {/* Edit Modal */}
      <SubjectEditModal
        show={showEditModal}
        onHide={handleCloseEditModal}
        onSubmit={handleUpdateProgram}
        isLoading={isEditing}
        programs={programData?.data || []}
        teachers={TeachersData?.data || []}
        subjectData={editingSubject}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        name={selectedSubject?.name}
        type="Subject"
        isLoading={isDeleting}
      />
    </>
  );
};

export default SubjectManagement;
