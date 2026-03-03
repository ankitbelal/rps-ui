import React, { useEffect } from "react";
import { Modal, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import { ProgramList } from "../../../../features/admin/students/utils";
import { useForm, UseFormSetError } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SearchableDropdown, {
  DropdownOption,
} from "../../../../Component/common/SearchableDropdown";
import { studentSchema } from "../validations/studentSchema";
import { StudentForm } from "../../../../features/admin/students/utils";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface StudentFormModalProps {

  show: boolean;
  onHide: () => void;
  // setError is passed so parent can map API errors back to fields
  onSubmit: (data: StudentForm, setError: UseFormSetError<StudentForm>) => void;
  isLoading: boolean;
  programs: ProgramList[];
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({
  show,
  onHide,
  onSubmit,
  isLoading,
  programs,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<StudentForm>({
    resolver: yupResolver(studentSchema as any),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      rollNumber: "",
      enrollmentDate: new Date().toISOString().split("T")[0],
      currentSemester: 1,
      registrationNumber: "",
      gender: "M",
      DOB: "",
      address1: "",
      programId: 0,
    },
  });

  const programOptions: DropdownOption<number>[] = [
    { value: 0, label: "Select Program" },
    ...programs.map((program) => ({
      value: program.id,
      label: `${program.code}`,
    })),
  ];

  const semesterOptions: DropdownOption<number>[] = Array.from(
    { length: 10 },
    (_, i) => ({
      value: i + 1,
      label: `Semester ${i + 1}`,
    }),
  );

  // Pass setError to parent so API errors can be mapped to fields
  const handleFormSubmit = (data: StudentForm) => {
    onSubmit(data, setError);
  };

  // Additional validation for program selection
  useEffect(() => {
    const programId = watch("programId");
    if (programId === 0 || programId === null) {
      setError("programId", {
        type: "manual",
        message: "Please select a program",
      });
    } else {
      clearErrors("programId");
    }
  }, [watch("programId"), setError, clearErrors]);
  // ─── Shared phone key restriction handler ─────────────────────────────────────
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

  // Reset form when modal opens
  React.useEffect(() => {
    if (show) {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        rollNumber: "",
        enrollmentDate: new Date().toISOString().split("T")[0],
        currentSemester: 1,
        registrationNumber: "",
        gender: "M",
        DOB: "",
        address1: "",
        programId: 0,
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
              <h5 className="mb-0">Register New Student</h5>
              <small className="text-muted">
                Fill in the details to register a new student
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
                  <Form.Text className="text-muted">
                    Letters and spaces only
                  </Form.Text>
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
                  <Form.Text className="text-muted">
                    Letters only, no spaces
                  </Form.Text>
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
                    placeholder="student@university.edu"
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
                      placeholder="Enter 10 digits phone number"
                      className="py-2"
                      maxLength={10}
                      onKeyDown={phoneKeyDown}
                      onInput={phoneInput}
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
                  <Form.Text className="text-muted">
                    10 digits only
                  </Form.Text>
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

          {/* Academic Information Section */}
          <div className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center me-3">
                <i className="fas fa-graduation-cap text-primary"></i>
              </div>
              <h6 className="fw-bold mb-0">Academic Information</h6>
            </div>

            <Row className="g-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Roll Number <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...register("rollNumber")}
                    isInvalid={!!errors.rollNumber}
                    placeholder="Enter roll number"
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.rollNumber?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Registration Number <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...register("registrationNumber")}
                    isInvalid={!!errors.registrationNumber}
                    placeholder="Enter registration number"
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.registrationNumber?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Enrollment Date <span className="text-danger">*</span>
                  </Form.Label>
                  {/* <Form.Control
                    type="date"
                    {...register("enrollmentDate")}
                    isInvalid={!!errors.enrollmentDate}
                    className="py-2"
                    max={new Date().toISOString().split("T")[0]}
                  /> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                       <DatePicker
                                         value={watch("enrollmentDate") ? dayjs(watch("enrollmentDate")) : null}
                                         onChange={(newValue) =>
                                           setValue(
                                             "enrollmentDate",
                                             newValue ? newValue.format("YYYY-MM-DD") : "",
                                             { shouldValidate: true }
                                           )
                                         }
                                         maxDate={dayjs()}
                                         slotProps={{
                                           textField: {
                                             fullWidth: true,
                                             error: !!errors.enrollmentDate,
                                             helperText: errors.enrollmentDate?.message,
                                             size: "small",
                                           },
                                         }}
                                       />
                                     </LocalizationProvider>
                  {/* <Form.Control.Feedback type="invalid">
                    {errors.enrollmentDate?.message}
                  </Form.Control.Feedback> */}
                  <Form.Text className="text-muted">
                    Cannot be a future date
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Current Semester <span className="text-danger">*</span>
                  </Form.Label>
                  <SearchableDropdown
                    options={semesterOptions}
                    value={watch("currentSemester") || 1}
                    onChange={(value) => setValue("currentSemester", value)}
                    placeholder="Select Semester"
                    required
                    enableSearch={false}
                    error={errors.currentSemester?.message}
                    className="mb-3"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Program <span className="text-danger">*</span>
                  </Form.Label>
                  <SearchableDropdown
                    options={programOptions}
                    value={watch("programId") || 0}
                    onChange={(value) => {
                      setValue("programId", value || 0);
                      if (value && value !== 0) {
                        clearErrors("programId");
                      }
                    }}
                    placeholder="Select Program"
                    required
                    enableSearch={programs.length > 5}
                    searchPlaceholder="Search programs..."
                    error={errors.programId?.message}
                    className="mb-3"
                  />
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
          <Button
            variant="outline-secondary"
            onClick={onHide}
            className="px-4"
            disabled={isLoading}
          >
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
                Register Student
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default StudentFormModal;
