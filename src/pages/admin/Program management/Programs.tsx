import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Card, Button, Table, Form, Badge } from "react-bootstrap";
import {
  useGetProgramsQuery,
  useAddProgramMutation,
  useDeleteProgramMutation,
  useEditProgramMutation,
} from "../../../features/admin/programs/programApi";
import toast from "react-hot-toast";
import { useGetFacultiesQuery } from "../../../features/admin/students/studentApi";
import { ProgramFormData } from "../../../features/admin/programs/utils";
import ProgramFormModal from "./Partials/ProgramFormModal";
import DeleteConfirmationModal from "./Partials/DeleteConfirmationModal";
import ProgramEditModal from "./Partials/ ProgramEditModal";
import { Program } from "../../../features/admin/programs/utils";
import { useAppDispatch } from "../../../app/hooks";
import { setPageTitle } from "../../../features/ui/uiSlice";
import CommonBreadCrumb from "../../../Component/common/BreadCrumb";
import { FaTachometerAlt } from "react-icons/fa";
import PaginationComponent from "../../../Component/common/Pagination";


const ProgramManagement: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setPageTitle({
        title: "Program Management",
        subtitle: "Manage academic programs and information",
      }),
    );
  }, [dispatch]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingProgram, setDeletingProgram] = useState<Program | null>(null);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [facultyFilter, setFacultyFilter] = useState<string>("");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      facultyId: facultyFilter || "",
      page: currentPage,
      limit: itemsPerPage,
    }),
    [debouncedSearch, facultyFilter, currentPage, itemsPerPage],
  );

  const {
    data: programData,
    isLoading: isProgramLoading,
    isFetching,
  } = useGetProgramsQuery(queryParams,{refetchOnMountOrArgChange:true});

  const { data: facultyData, isLoading: isFacultyLoading, isFetching:isFacultyFetching } =
    useGetFacultiesQuery(undefined,{refetchOnMountOrArgChange:true});
  const [addProgram, { isLoading: isAddingProgram }] = useAddProgramMutation();
  const [deleteProgram, { isLoading: isDeleting }] = useDeleteProgramMutation();
  const [editProgram, { isLoading: isUpdatingProgram }] =
    useEditProgramMutation();

  // Calculate pagination
  let startIndex = 0;
  let endIndex = 0;

  if (programData) {
    startIndex =
      programData?.total === 0
        ? 0
        : (programData?.page - 1) * programData?.limit + 1;
    endIndex = Math.min(
      programData?.page * programData?.limit,
      programData?.total,
    );
  }

  // Reset to first page when filters or items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, facultyFilter, itemsPerPage]);

  const onSubmit = async (data: ProgramFormData) => {
    if (!data) return;
    try {
      const response = await addProgram(data).unwrap();
      if (response.success) {
        toast.success(response.message);
        setShowFormModal(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingProgram(null);
  };

  const handleUpdateProgram = async (data: Partial<ProgramFormData>) => {
    try {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => {
          return value !== undefined && value !== null && value !== "";
        }),
      );

      if (Object.keys(filteredData).length === 0) {
        toast.error("Please fill at least one field to update");
        return;
      }

      const response = await editProgram({
        data: filteredData,
        id: editingProgram?.id,
      }).unwrap();

      if (response.success) {
        toast.success(response.message);
        setEditingProgram(null);
        setShowEditModal(false);
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to edit program";
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (program: Program) => {
    setDeletingProgram(program);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProgram) return;
    try {
      const response = await deleteProgram(deletingProgram.id).unwrap();
      if (response.success) {
        toast.success(response.message);
        setShowDeleteModal(false);
        setDeletingProgram(null);
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to delete program";
      toast.error(errorMessage);
    }
  };
  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingProgram(null);
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
    setFacultyFilter("");
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
                label: "Program Management",
                active: true,
              },
            ]}
          />
          <Button
            variant="primary"
            onClick={handleAddNew}
            className="d-flex align-items-center gap-2 mb-4"
            disabled={isProgramLoading || isFetching}
          >
            <i className="fas fa-plus"></i>
            Add Program
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
                    placeholder="Search programs by name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isProgramLoading}
                  />
                </div>
              </Col>

              <Col md={3}>
                <Form.Select
                  value={facultyFilter}
                  onChange={(e) => setFacultyFilter(e.target.value)}
                  className="bg-light border-0"
                  disabled={isFacultyLoading || isFetching || isProgramLoading || isFacultyFetching}
                >
                  <option value="">
                    All Faculties
                  </option>
                  {facultyData?.data.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
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
            <div className="px-3 pb-3">
              <PaginationComponent
                itemsPerPage={itemsPerPage}
                isLoading={isProgramLoading || isFetching}
                startIndex={startIndex}
                endIndex={endIndex}
                total={programData?.total??0}
                lastPage={programData?.lastPage??0}
                page={programData?.page??0}
                handlePageChange={handlePageChange}
                handleItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {isProgramLoading || isFetching ? (
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
                        <th>Program Code</th>
                        <th>Program Name</th>
                        <th>HOD</th>
                        <th>Details</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {programData?.data && programData?.data.length > 0 ? (
                        programData.data.map((item, key) => {
                          const serialNumber =
                            (currentPage - 1) * itemsPerPage + key + 1;
                          return (
                            <tr key={key}>
                              <td className="fw-semibold">{serialNumber}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2">
                                    <i className="fas fa-graduation-cap text-primary"></i>
                                  </div>
                                  <div className="fw-semibold">
                                    {item.code}
                                    <small className="text-muted d-block mt-1">
                                      {item.totalSubjects} subjects
                                    </small>
                                    <small className="text-muted d-block mt-1">
                                      <Badge bg="secondary">
                                        {item.totalSemesters} semesters
                                      </Badge>
                                    </small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="fw-semibold">
                                  {item.name}
                                  <small className="text-muted d-block mt-1">
                                    Started: {formatDate(item.createdAt)}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div className="fw-semibold">
                                  {item?.hod?.name}
                                </div>
                                <div>
                                  <a
                                    href={`mailto:${item?.hod?.email}`}
                                    className="text-decoration-none d-block"
                                  >
                                    <i className="fas fa-envelope me-1"></i>
                                    {item?.hod?.email}
                                  </a>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <small className="d-block mt-1">
                                    Faculty: {item?.faculty?.name}
                                  </small>
                                  <div className="d-flex align-items-center gap-2 mt-1">
                                    <Badge bg="success">
                                      Credits: {item.totalCredits}
                                    </Badge>
                                  </div>
                                  <div className="d-flex align-items-center gap-2 mt-1">
                                    <small className="d-block mt-1">
                                      Duration: {item.durationInYears} years
                                    </small>
                                  </div>
                                </div>
                              </td>
                              {/* <td>
                                <div className="fw-semibold">
                                  {item?.faculty?.name}
                                </div>
                              </td> */}
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
                              <p>No programs found</p>
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
            <div className="px-3 pb-3">
              <PaginationComponent
                itemsPerPage={itemsPerPage}
                isLoading={isProgramLoading || isFetching}
                startIndex={startIndex}
                endIndex={endIndex}
                total={programData?.total??0}
                lastPage={programData?.lastPage??0}
                page={programData?.page??0}
                handlePageChange={handlePageChange}
                handleItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Form Modal */}
      <ProgramFormModal
        show={showFormModal}
        onHide={handleCloseFormModal}
        onSubmit={onSubmit}
        isLoading={isAddingProgram}
      />
      {/* Edit Modal */}
      <ProgramEditModal
        show={showEditModal}
        onHide={handleCloseEditModal}
        onSubmit={handleUpdateProgram}
        programData={editingProgram}
        isUpdating={isUpdatingProgram}
      />

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        name={
          deletingProgram
            ? `${deletingProgram.name} (${deletingProgram.code})`
            : ""
        }
        type="Program"
        isLoading={isDeleting}
      />
    </>
  );
};

export default ProgramManagement;
