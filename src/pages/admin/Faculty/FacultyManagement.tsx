import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Card, Button, Table, Badge } from "react-bootstrap";
import {
  useGetFacultiesQuery,
  useAddFacultyMutation,
  useEditFacultyMutation,
  useDeleteFacultyMutation,
} from "../../../features/admin/faculty/facultyApi";
import toast from "react-hot-toast";
import FacultyEditModal from "./partials/FacultyEditModal";
import FacultyFormModal from "./partials/AddFacultyModal";
import DeleteConfirmationModal from "./partials/DeleteConfirmationModal";
import { Faculty } from "../../../features/admin/faculty/utils";
import { useAppDispatch } from "../../../app/hooks";
import { setPageTitle } from "../../../features/ui/uiSlice";
import CommonBreadCrumb from "../../../Component/common/BreadCrumb";
import { FaTachometerAlt } from "react-icons/fa";
import PaginationComponent from "../../../Component/common/Pagination";


const FacultyManagement: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setPageTitle({
        title: "Faculty Management",
        subtitle: "Manage faculty information and associated programs",
      }),
    );
  }, [dispatch]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingFaculty, setDeletingFaculty] = useState<Faculty | null>(null);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [debouncedSearch, setDebouncedSearch] = useState("");

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
    }),
    [debouncedSearch, currentPage, itemsPerPage],
  );

  const {
    data: facultyData,
    isLoading: isFacultyLoading,
    isFetching,
  } = useGetFacultiesQuery(queryParams,{refetchOnMountOrArgChange:true});
  const [addFaculty, { isLoading: isAddingFaculty }] = useAddFacultyMutation();
  const [editFaculty, { isLoading: isUpdatingFaculty }] =
    useEditFacultyMutation();
  const [deleteFaculty, { isLoading: isDeleting }] = useDeleteFacultyMutation();

  // Calculate pagination
  let startIndex = 0;
  let endIndex = 0;

  if (facultyData) {
    startIndex =
      facultyData?.total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    endIndex = Math.min(currentPage * itemsPerPage, facultyData?.total);
  }

  // Reset to first page when filters or items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const handleAddNew = () => {
    setShowFormModal(true);
  };

  const handleFormSubmit = async (data: {
    name: string;
    description: string;
  }) => {
    try {
      const response = await addFaculty(data).unwrap();
      if (response.success) {
        toast.success(response.message);
        setShowFormModal(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add faculty");
    }
  };

  const handleEditClick = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (data: {
    name: string;
    description: string;
  }) => {
    if (!editingFaculty) return;
    try {
      const response = await editFaculty({
        data,
        id: editingFaculty.id,
      }).unwrap();
      if (response.success) {
        toast.success(response.message);
        setShowEditModal(false);
        setEditingFaculty(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update faculty");
    }
  };

  const handleDeleteClick = (faculty: Faculty) => {
    setDeletingFaculty(faculty);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingFaculty) return;
    try {
      const response = await deleteFaculty(deletingFaculty.id).unwrap();
      if (response.success) {
        toast.success(response.message);
        setShowDeleteModal(false);
        setDeletingFaculty(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete faculty");
    }
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingFaculty(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingFaculty(null);
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
  };

  // Get badge color based on number of programs
  const getProgramsBadgeColor = (count: number) => {
    if (count === 0) return "secondary";
    if (count <= 3) return "success";
    if (count <= 6) return "info";
    if (count <= 10) return "warning";
    return "danger";
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
                label: "Faculty Management",
                active: true,
              },
            ]}
          />
          <Button
            variant="primary"
            onClick={handleAddNew}
            className="d-flex align-items-center gap-2 mb-4"
            disabled={isFacultyLoading || isFetching}
          >
            <i className="fas fa-plus"></i>
            Add Faculty
          </Button>
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
                    placeholder="Search faculties by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isFacultyLoading}
                  />
                </div>
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

        {/* Faculties Table */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3">
            <div className="px-3 pb-3">
              <PaginationComponent
                itemsPerPage={itemsPerPage}
                isLoading={isFacultyLoading || isFetching}
                startIndex={startIndex}
                endIndex={endIndex}
                total={facultyData?.total??0}
                lastPage={facultyData?.lastPage??0}
                page={facultyData?.page??0}
                handlePageChange={handlePageChange}
                handleItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {isFacultyLoading || isFetching ? (
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
                        <th>Faculty Information</th>
                        <th>Total Programs</th>
                        <th>Programs</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facultyData?.data && facultyData?.data.length > 0 ? (
                        facultyData.data.map((item, index) => {
                          const serialNumber =
                            (currentPage - 1) * itemsPerPage + index + 1;
                          const programsCount = item.program?.length || 0;
                          const badgeColor =
                            getProgramsBadgeColor(programsCount);

                          return (
                            <tr key={item.id}>
                              <td className="fw-semibold">{serialNumber}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-3">
                                    <i className="fas fa-university text-primary"></i>
                                  </div>
                                  <div>
                                    <div className="fw-semibold fs-6">
                                      {item.name}
                                    </div>
                                    <div className="text-muted small mt-1">
                                      ID: {item.id}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <Badge
                                  bg={badgeColor}
                                  className="fs-6 px-3 py-2"
                                >
                                  {programsCount}{" "}
                                  {programsCount === 1 ? "Program" : "Programs"}
                                </Badge>
                              </td>
                              <td>
                                {programsCount > 0 ? (
                                  <div className="d-flex flex-wrap gap-1">
                                    {item.program.map((program) => (
                                      <Badge
                                        key={program.id}
                                        bg="light"
                                        text="dark"
                                        className="border px-2 py-1"
                                      >
                                        {program.code}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted small">
                                    No programs assigned
                                  </span>
                                )}
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleEditClick(item)}
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
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-5">
                            <div className="text-muted">
                              <i className="fas fa-university fa-2x mb-3"></i>
                              <p className="mb-2">No faculties found</p>
                              {searchTerm ? (
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={clearFilters}
                                  className="mt-2"
                                >
                                  Clear search to see all faculties
                                </Button>
                              ) : (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={handleAddNew}
                                  className="mt-2"
                                >
                                  <i className="fas fa-plus me-1"></i>
                                  Add First Faculty
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
            <div className="px-3 pb-3">
              <PaginationComponent
                itemsPerPage={itemsPerPage}
                isLoading={isFacultyLoading || isFetching}
                startIndex={startIndex}
                endIndex={endIndex}
                total={facultyData?.total??0}
                lastPage={facultyData?.lastPage??0}
                page={facultyData?.page??0}
                handlePageChange={handlePageChange}
                handleItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Add Faculty Modal */}
      <FacultyFormModal
        show={showFormModal}
        onHide={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        isLoading={isAddingFaculty}
      />

      {/* Edit Faculty Modal */}
      <FacultyEditModal
        show={showEditModal}
        onHide={handleCloseEditModal}
        onSubmit={handleEditSubmit}
        isLoading={isUpdatingFaculty}
        faculty={editingFaculty}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        facultyName={deletingFaculty?.name || ""}
        isLoading={isDeleting}
      />
    </>
  );
};

export default FacultyManagement;
