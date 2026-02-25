import React, { useEffect } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { PartialProgramFormData } from "../../../../features/admin/programs/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetFacultiesQuery } from "../../../../features/admin/students/studentApi";
import { useGetHodListQuery } from "../../../../features/admin/programs/programApi";
import { HODList } from "../../../../features/admin/programs/utils";
import { FacultyList } from "../../../../features/admin/students/utils";
import { Program } from "../../../../features/admin/programs/utils";
import { programSchema } from "../validations/programSchema";

interface ProgramEditModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: PartialProgramFormData) => void;
  isUpdating: boolean;
  programData: Program | null;
}

const ProgramEditModal: React.FC<ProgramEditModalProps> = ({
  show,
  onHide,
  onSubmit,
  isUpdating,
  programData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
  } = useForm<PartialProgramFormData>({
    resolver: yupResolver(programSchema as any),
    mode: "onChange",
    defaultValues: {
      name: "",
      code: "",
      facultyId: "",
      totalSemesters: undefined,
      totalSubjects: undefined,
      totalCredits: undefined,
      durationInYears: undefined,
      hodId: "",
    },
  });

  const { data: facultiesData, isLoading: isFacultiesLoading } =
    useGetFacultiesQuery();
  const { data: teachersData, isLoading: isTeachersLoading } =
    useGetHodListQuery();

  const handleFormSubmit = (data: PartialProgramFormData) => {
    const apiData: any = { ...data };

    if (data.facultyId !== undefined && data.facultyId !== "") {
      apiData.facultyId = Number(data.facultyId);
    }

    if (data.hodId !== undefined && data.hodId !== "") {
      apiData.hodId = Number(data.hodId);
    }

    onSubmit(apiData);
  };

  useEffect(() => {
    if (show && programData) {
      reset({
        name: programData.name || "",
        code: programData.code || "",
        facultyId: programData.faculty?.id
          ? String(programData.faculty.id)
          : "",
        totalSemesters: programData.totalSemesters || undefined,
        totalSubjects: programData.totalSubjects || undefined,
        totalCredits: programData.totalCredits || undefined,
        durationInYears: programData.durationInYears || undefined,
        hodId: programData.hod?.id ? String(programData.hod.id) : "",
      });
    } else if (show) {
      reset({
        name: "",
        code: "",
        facultyId: "",
        totalSemesters: undefined,
        totalSubjects: undefined,
        totalCredits: undefined,
        durationInYears: undefined,
        hodId: "",
      });
    }
  }, [show, programData, reset]);

  const currentFacultyId = watch("facultyId");
  const currentHodId = watch("hodId");

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold w-100">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div
              className="bg-warning rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: "44px", height: "44px" }}
            >
              {" "}
              {/* Fixed height typo */}
              <i className="fas fa-edit text-white fs-5"></i>
            </div>
            <div>
              <h5 className="mb-0">Edit Program</h5>
              <small className="text-muted">
                Update program information (fill only what you want to change)
              </small>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Modal.Body className="pt-0">
          {/* Program Basic Information Section */}
          <div className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center me-3">
                <i className="fas fa-book text-warning"></i>
              </div>
              <h6 className="fw-bold mb-0">Program Information</h6>
            </div>

            <Row className="g-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Program Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...register("name")}
                    isInvalid={!!errors.name}
                    placeholder={`Current: ${programData?.name || "N/A"}`}
                    className="py-2 border-0 bg-light"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Program Code <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...register("code")}
                    isInvalid={!!errors.code}
                    placeholder={`Current: ${programData?.code || "N/A"}`}
                    className="py-2 border-0 bg-light"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.code?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Faculty <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={currentFacultyId || ""}
                    {...register("facultyId")}
                    isInvalid={!!errors.facultyId}
                    className="py-2 border-0 bg-light"
                    disabled={isFacultiesLoading}
                  >
                    <option value="">No change</option>
                    {facultiesData?.data?.map((faculty: FacultyList) => (
                      <option key={faculty.id} value={String(faculty.id)}>
                        {faculty.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.facultyId?.message}
                  </Form.Control.Feedback>
                  {isFacultiesLoading && (
                    <small className="text-muted">Loading faculties...</small>
                  )}
                  <Form.Text className="text-muted">
                    Current: {programData?.faculty?.name || "N/A"}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Head of Department (HOD){" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={currentHodId || ""}
                    {...register("hodId")}
                    isInvalid={!!errors.hodId}
                    className="py-2 border-0 bg-light"
                    disabled={isTeachersLoading}
                  >
                    <option value="">No change</option>
                    {teachersData?.data?.map((teacher: HODList) => (
                      <option key={teacher.id} value={String(teacher.id)}>
                        {teacher.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.hodId?.message}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Current:{" "}
                    {programData?.hod?.name
                      ? `${programData?.hod?.name || ""}`
                      : "N/A"}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Program Details Section */}
          <div className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center me-3">
                <i className="fas fa-cogs text-warning"></i>
              </div>
              <h6 className="fw-bold mb-0">Program Details</h6>
            </div>

            <Row className="g-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Duration (Years) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    {...register("durationInYears", {
                      setValueAs: (v) => (v === "" ? undefined : Number(v)),
                    })}
                    isInvalid={!!errors.durationInYears}
                    min={1}
                    max={10}
                    className="py-2 border-0 bg-light"
                    placeholder={`Current: ${programData?.durationInYears || "N/A"}`}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.durationInYears?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Total Semesters <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    {...register("totalSemesters", {
                      setValueAs: (v) => (v === "" ? undefined : Number(v)),
                    })}
                    isInvalid={!!errors.totalSemesters}
                    min={1}
                    max={20}
                    className="py-2 border-0 bg-light"
                    placeholder={`Current: ${programData?.totalSemesters || "N/A"}`}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.totalSemesters?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Total Subjects <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    {...register("totalSubjects", {
                      setValueAs: (v) => (v === "" ? undefined : Number(v)),
                    })}
                    isInvalid={!!errors.totalSubjects}
                    min={1}
                    max={200}
                    className="py-2 border-0 bg-light"
                    placeholder={`Current: ${programData?.totalSubjects || "N/A"}`}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.totalSubjects?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Total Credits <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    {...register("totalCredits", {
                      setValueAs: (v) => (v === "" ? undefined : Number(v)),
                    })}
                    isInvalid={!!errors.totalCredits}
                    min={1}
                    max={500}
                    step="0.5"
                    className="py-2 border-0 bg-light"
                    placeholder={`Current: ${programData?.totalCredits || "N/A"}`}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.totalCredits?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Validation Summary */}
          {errors.root?.message && (
            <div className="alert alert-danger mb-3">
              <i className="fas fa-exclamation-circle me-2"></i>
              {errors.root.message}
            </div>
          )}
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
            variant="warning"
            type="submit"
            disabled={isUpdating || !isDirty}
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
                Update Program
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProgramEditModal;
