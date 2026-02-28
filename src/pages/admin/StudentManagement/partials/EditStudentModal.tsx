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
import {
  ProgramList,
  Student,
} from "../../../../features/admin/students/utils";
import { useForm, UseFormSetError } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SearchableDropdown, {
  DropdownOption,
} from "../../../../Component/common/SearchableDropdown";
import { EditStudentFormData } from "../validations/editStudentSchema";
import { studentSchema } from "../validations/studentSchema";

interface StudentEditModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (
    data: EditStudentFormData,
    setError: UseFormSetError<EditStudentFormData>,
  ) => void;
  isLoading: boolean;
  isGettingData: boolean;
  programs: ProgramList[];
  studentData?: Student;
}

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

const StudentEditModal: React.FC<StudentEditModalProps> = ({
  show,
  onHide,
  onSubmit,
  isLoading,
  isGettingData,
  programs,
  studentData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors, isDirty },
  } = useForm<EditStudentFormData>({
    resolver: yupResolver(studentSchema as any),
    mode: "onChange",
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

  // Reset form when modal opens with student data
  useEffect(() => {
    if (show && studentData) {
      const student = studentData;

      const enrollmentDate = student.enrollmentDate
        ? new Date(student.enrollmentDate).toISOString().split("T")[0]
        : new Date(student.createdAt).toISOString().split("T")[0];

      const dob = student.DOB
        ? new Date(student.DOB).toISOString().split("T")[0]
        : "";

      reset({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        phone: student.phone || "",
        rollNumber: student.rollNumber || "",
        enrollmentDate: enrollmentDate,
        currentSemester: student.currentSemester || 1,
        registrationNumber: student.registrationNumber || "",
        gender: student.gender || "M",
        DOB: dob || "",
        address1: student.address1 || "",
        programId: student.program?.id || 0,
      });
    } else if (show) {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        rollNumber: "",
        enrollmentDate: "",
        currentSemester: null,
        registrationNumber: "",
        gender: "M",
        DOB: "",
        address1: "",
        programId: null,
      });
    }
  }, [show, studentData, reset]);

  // Pass setError to parent so API errors can be mapped to fields
  const handleFormSubmit = (data: EditStudentFormData) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined,
      ),
    );
    onSubmit(filteredData as EditStudentFormData, setError);
  };

  if (isGettingData) {
    return (
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton className="border-bottom-0">
          <Modal.Title>Loading Student Details...</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Fetching student information...</p>
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
              className="bg-warning rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: "44px", height: "44px" }}
            >
              <i className="fas fa-user-edit text-white fs-5"></i>
            </div>
            <div>
              <h5 className="mb-0">Edit Student Profile</h5>
              <small className="text-muted">Update student information</small>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Modal.Body>
          {/* Personal Information Section */}
          <div className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-warning rounded-circle p-2 d-flex align-items-center justify-content-center me-3">
                <i className="fas fa-user text-white"></i>
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
                      placeholder="9876543210"
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
                  <Form.Text className="text-muted">10 digits only</Form.Text>
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
                    <option value="">Select Gender (Optional)</option>
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
                  <Form.Control
                    type="date"
                    {...register("DOB")}
                    isInvalid={!!errors.DOB}
                    className="py-2"
                    max={new Date().toISOString().split("T")[0]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.DOB?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Academic Information Section */}
          <div className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-warning rounded-circle p-2 d-flex align-items-center justify-content-center me-3">
                <i className="fas fa-graduation-cap text-white"></i>
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
                  <Form.Control
                    type="date"
                    {...register("enrollmentDate")}
                    isInvalid={!!errors.enrollmentDate}
                    className="py-2"
                    max={new Date().toISOString().split("T")[0]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.enrollmentDate?.message}
                  </Form.Control.Feedback>
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
                    placeholder="Select Semester (Optional)"
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
                    onChange={(value) => setValue("programId", value)}
                    placeholder="Select Program (Optional)"
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
              <div className="bg-warning rounded-circle p-2 d-flex align-items-center justify-content-center me-3">
                <i className="fas fa-home text-white"></i>
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
            variant="warning"
            type="submit"
            disabled={isLoading || !isDirty}
            className="px-4"
          >
            {isLoading ? (
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
                Update Student
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default StudentEditModal;
