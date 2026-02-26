import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Card, Button, Table, Badge, Form } from "react-bootstrap";
import AdminFormModal from "./Partials/AdminFormModal";
import DeleteConfirmationModal from "./Partials/DeleteConfirmationModal";
import AdminEditModal from "./Partials/AdminEditModal";
import CommonBreadCrumb from "../../../Component/common/BreadCrumb";
import {
  useGetAdminByIdQuery,
  useAddAdminMutation,
  useDeleteAdminMutation,
  useEditAdminMutation,
  useGetAdminQuery,
} from "../../../features/admin/admins/adminApi";
import ViewAdminDetailsModal from "./Partials/AdminDetailsModal";
import { AdminFormData } from "../../../features/admin/admins/utils";
import toast from "react-hot-toast";
import { FaUserCog, FaTachometerAlt } from "react-icons/fa";
import { Admin } from "../../../features/admin/admins/utils";
import { useAppDispatch } from "../../../app/hooks";
import { setPageTitle } from "../../../features/ui/uiSlice";
import PaginationComponent from "../../../Component/common/Pagination";


const AdminManagement: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setPageTitle({
        title: "User Management",
        subtitle: "Manage Admins, Users and Login",
      }),
    );
  }, [dispatch]);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null);
  const [viewingAdminId, setViewingAdminId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [genderFilter, setGenderFilter] = useState<string>("all");
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
      gender: genderFilter,
    }),
    [debouncedSearch, currentPage, itemsPerPage, genderFilter],
  );

  const {
    data: adminData,
    isLoading: isAdminLoading,
    isFetching,
  } = useGetAdminQuery(queryParams,{refetchOnMountOrArgChange:true});
  const [addAdmin, { isLoading: isAddingAdmin }] = useAddAdminMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();
  const [editAdmin, { isLoading: isUpdatingAdmin }] = useEditAdminMutation();

  const {
    data: AdminDetailsData,
    isLoading: isLoadingDetails,
    isFetching: isFetchingDetails,
  } = useGetAdminByIdQuery(viewingAdminId!, {
    skip: !viewingAdminId,
  });

  // Calculate pagination
  let startIndex = 0;
  let endIndex = 0;

  if (adminData) {
    startIndex =
      adminData?.total === 0 ? 0 : (adminData?.page - 1) * adminData?.limit + 1;
    endIndex = Math.min(adminData?.page * adminData?.limit, adminData?.total);
  }

  // Reset to first page when filters or items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, genderFilter, itemsPerPage]);

  const onSubmit = async (data: AdminFormData) => {
    if (!data) return;
    try {
      const response = await addAdmin(data).unwrap();
      if (response.success) {
        toast.success(response.message);
        setShowFormModal(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  const handleEdit = (admin: Admin) => {
    setViewingAdminId(admin.id);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };
  const handleUpdateAdmin = async (data: AdminFormData) => {
    if (!data) return;
    try {
      const response = await editAdmin({
        data,
        id: viewingAdminId,
      }).unwrap();
      if (response.success) {
        toast.success(response.message);
        setViewingAdminId(null);
        setShowEditModal(false);
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to edit techer";
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (admin: Admin) => {
    setDeletingAdmin(admin);
    setShowDeleteModal(true);
  };

  const handleViewDetails = (admin: Admin) => {
    setViewingAdminId(admin.id);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setViewingAdminId(null);
    setShowViewModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAdmin) return;
    try {
      const response = await deleteAdmin(deletingAdmin.id).unwrap();
      if (response.success) {
        toast.success(response.message);
        setShowDeleteModal(false);
        setDeletingAdmin(null);
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
    setDeletingAdmin(null);
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
                label: "User Management",
                active: true,
              },
            ]}
          />
          <Button
            variant="primary"
            onClick={handleAddNew}
            className="d-flex align-items-center gap-2 mb-4"
          >
            <i className="fas fa-plus"></i>
            Add Admin
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
                    placeholder="Search admin by name, email or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Col>

              {/* Gender Filter */}
              <Col md={3}>
                <Form.Select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="bg-light border-0"
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

        {/* admins Table */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3">
            <div className="px-3 pb-3">
              <PaginationComponent 
                itemsPerPage={itemsPerPage}
                isLoading={isAdminLoading || isFetching}
                startIndex={startIndex}
                endIndex={endIndex}
                total={adminData?.total || 0}
                lastPage={adminData?.lastPage || 0}
                page={adminData?.page || 1}
                handlePageChange={handlePageChange}
                handleItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {isAdminLoading || isFetching ? (
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
                        <th>Information</th>
                        <th>Contact</th>
                        <th>Address</th>
                        <th>Added Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminData?.data && adminData?.data.length > 0 ? (
                        adminData.data.map((item, key) => {
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
                              <FaUserCog />
                              <p className="mb-2">No admin found</p>
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
                isLoading={isAdminLoading || isFetching}
                startIndex={startIndex}
                endIndex={endIndex}
                total={adminData?.total || 0}
                lastPage={adminData?.lastPage || 0}
                page={adminData?.page || 1}
                handlePageChange={handlePageChange}
                handleItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Form Modal */}
      <AdminFormModal
        show={showFormModal}
        onHide={handleCloseFormModal}
        onSubmit={onSubmit}
        isLoading={isAddingAdmin}
      />

      <AdminEditModal
        show={showEditModal}
        onHide={handleCloseEditModal}
        onSubmit={handleUpdateAdmin}
        isLoading={isLoadingDetails || isFetchingDetails}
        adminData={AdminDetailsData?.data?.[0]}
        isUpdating={isUpdatingAdmin}
      />

      <ViewAdminDetailsModal
        show={showViewModal}
        onHide={handleCloseViewModal}
        isLoading={isLoadingDetails || isFetchingDetails}
        admin={AdminDetailsData?.data?.[0]}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        AdminName={
          deletingAdmin
            ? `${deletingAdmin.firstName} ${deletingAdmin.lastName}`
            : ""
        }
        isLoading={isDeleting}
      />
    </>
  );
};

export default AdminManagement;
