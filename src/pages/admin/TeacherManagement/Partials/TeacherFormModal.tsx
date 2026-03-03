import React from "react";
import { Modal, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import { useForm, UseFormSetError } from "react-hook-form";
import { TeacherFormData } from "../../../../features/admin/teacher/utils";
import { teacherSchema } from "../validation/teacherSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface TeacherFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (
    data: TeacherFormData,
    setError: UseFormSetError<TeacherFormData>,
  ) => void;
  isLoading: boolean;
}

const TeacherFormModal: React.FC<TeacherFormModalProps> = ({
  show,
  onHide,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: yupResolver(teacherSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address1: "",
      gender: "M",
      DOB: "",
    },
  });

  // Pass setError to parent so API errors can be mapped to fields
  const handleFormSubmit = (data: TeacherFormData) => {
    onSubmit(data, setError);
  };

  React.useEffect(() => {
    if (show) {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address1: "",
        gender: "M",
        DOB: "",
      });
    }
  }, [show, reset]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title className="fw-bold w-100">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div
              className="bg-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: "44px", height: "44px" }}
            >
              <i className="fas fa-user-plus text-white fs-5"></i>
            </div>
            <div>
              <h5 className="mb-0">Add New Teacher</h5>
              <small className="text-muted">
                Fill in the details to add a new teacher
              </small>
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
                  <Form.Label className="fw-semibold">
                    First Name <span className="text-danger">*</span>
                  </Form.Label>
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
                  <Form.Label className="fw-semibold">
                    Last Name <span className="text-danger">*</span>
                  </Form.Label>
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
                  <Form.Label className="fw-semibold">
                    Email <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    {...register("email")}
                    isInvalid={!!errors.email}
                    placeholder="teacher@university.edu"
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Phone Number <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light">
                      <i className="fas fa-phone"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="tel"
                      {...register("phone")}
                      isInvalid={!!errors.phone}
                      placeholder="Enter 10 digits phone number."
                      className="py-2"
                      maxLength={10}
                      onKeyDown={(e) => {
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
                      }}
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        input.value = input.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                      }}
                    />
                  </InputGroup>
                  {errors.phone && (
                    <div
                      className="text-danger"
                      style={{ fontSize: "0.875em", marginTop: "0.25rem" }}
                    >
                      {errors.phone.message}
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Gender <span className="text-danger">*</span>
                  </Form.Label>
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
                  <Form.Label className="fw-semibold">
                    Date of Birth <span className="text-danger">*</span>
                  </Form.Label>
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
              <Form.Label className="fw-semibold">
                Address Line 1 <span className="text-danger">*</span>
              </Form.Label>
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
          <Button variant="outline-secondary" onClick={onHide} className="px-4">
            <i className="fas fa-times me-2"></i>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
            className="px-4"
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Creating...
              </>
            ) : (
              <>
                <i className="fas fa-plus me-2"></i>
                Add Teacher
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TeacherFormModal;
