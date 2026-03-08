import React, { useEffect } from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Admin } from "../../../../features/admin/admins/utils";
import { AdminFormData } from "../../../../features/admin/admins/utils";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { adminSchema } from "../validation/adminSchema";
import { yupResolver } from "@hookform/resolvers/yup";

interface AdminEditModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: AdminFormData) => void;
  isLoading: boolean;
  adminData?: Admin; // Data for editing
  isUpdating?: boolean;
}

const AdminEditModal: React.FC<AdminEditModalProps> = ({
  show,
  onHide,
  onSubmit,
  isLoading,
  adminData,
  isUpdating = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<AdminFormData>({resolver:yupResolver(adminSchema)});

  // Reset form when modal opens/closes or adminData changes
  useEffect(() => {
    if (show && adminData) {
      // Pre-fill form with Admin data for editing
      const admin = adminData;
      const dob =
        admin.DOB || admin.DOB
          ? new Date(admin.DOB).toISOString().split("T")[0]
          : "";

      reset({
        firstName: admin.firstName || "",
        lastName: admin.lastName || "",
        email: admin.email || "",
        phone: admin.phone || "",
        address1: admin.address1 || "",
        gender: admin.gender || "M",
        DOB: dob,
      });
    }
  }, [show, adminData, reset]);

  const phoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey) return;
    const allowed = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
      "Enter",
    ];
    if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const phoneInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, "").slice(0, 10);
  };


  const handleFormSubmit = (data: AdminFormData) => {
    onSubmit(data);
  };

  if (isLoading) {
    return (
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton className="border-bottom-0">
          <Modal.Title>Loading Admin Details...</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Fetching Admin information...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title className="fw-bold w-100">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div
              className="bg-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: "44px", height: "44px" }}
            >
              <i className="fas fa-user-edit text-white fs-5"></i>
            </div>
            <div>
              <h5 className="mb-0">Edit Admin Profile</h5>
              <small className="text-muted">Update Admin information</small>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Modal.Body>
          {/* Personal Information Section */}
          <div className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center me-3">
                <i className="fas fa-user text-primary"></i>
              </div>
              <h6 className="fw-bold mb-0">Personal Information</h6>
            </div>

            <Row className="g-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">First Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    {...register("firstName")}
                    isInvalid={!!errors.firstName}
                    placeholder="Enter first name"
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Last Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    {...register("lastName")}
                    isInvalid={!!errors.lastName}
                    placeholder="Enter last name"
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    {...register("email")}
                    isInvalid={!!errors.email}
                    placeholder="admin@email.edu"
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Phone Number <span className="text-danger">*</span></Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light">
                      <i className="fas fa-phone"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="tel"
                      {...register("phone")}
                      isInvalid={!!errors.phone}
                      placeholder="Enter 10 digits phone number"
                      className="py-2"
                      onKeyDown={phoneKeyDown}
                      onInput={phoneInput}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone?.message}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Gender <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    {...register("gender")}
                    isInvalid={!!errors.gender}
                    className="py-2"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.gender?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Date of Birth <span className="text-danger">*</span></Form.Label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={watch("DOB") ? dayjs(watch("DOB")) : null}
                        onChange={(newValue) =>
                          setValue(
                            "DOB",
                            newValue ? newValue.format("YYYY-MM-DD") : "",
                            { shouldValidate: true }
                          )
                        }
                        maxDate={dayjs()}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.DOB,
                            helperText: errors.DOB?.message,
                            size: "small",
                          },
                        }}
                      />
                    </LocalizationProvider>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Address Information Section */}
          <div className="mb-3">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center me-3">
                <i className="fas fa-home text-primary"></i>
              </div>
              <h6 className="fw-bold mb-0">Address Information</h6>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Address Line 1 <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                {...register("address1")}
                isInvalid={!!errors.address1}
                placeholder="Street address, P.O. box, company name"
                className="py-2"
              />
              <Form.Control.Feedback type="invalid">
                {errors.address1?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-top-0">
          <Button
            variant="outline-secondary"
            onClick={onHide}
            className="px-4"
            disabled={isUpdating}
          >
            <i className="fas fa-times me-2"></i>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isUpdating }
            className="px-4"
          >
            {isUpdating ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Updating...
              </>
            ) : (
              <>
                <i className="fas fa-save me-2"></i>
                Update Admin
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AdminEditModal;
