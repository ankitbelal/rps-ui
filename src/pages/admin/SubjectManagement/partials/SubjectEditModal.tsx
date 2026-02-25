import React from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ProgramList } from "../../../../features/admin/students/utils";
import { Teacher } from "../../../../features/admin/students/utils";
import { Subject } from "../../../../features/admin/subjects/utils";
import { subjectSchema } from "../validations/subjectSchema";
import { yupResolver } from "@hookform/resolvers/yup";

export interface SubjectFormData {
  name: string;
  code: string;
  credits: number;
  semester: number;
  type: string;
  programId: number;
  teacherId: number;
}

interface SubjectEditProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: SubjectFormData) => void;
  isLoading: boolean;
  programs: ProgramList[];
  teachers: Teacher[];
  subjectData: Subject | null;
}

const SubjectEditModal: React.FC<SubjectEditProps> = ({
  show,
  onHide,
  onSubmit,
  isLoading,
  programs,
  teachers,
  subjectData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SubjectFormData>({
    resolver: yupResolver(subjectSchema as any),
  });

  const handleFormSubmit = (data: SubjectFormData) => {
    onSubmit(data);
  };

  React.useEffect(() => {
    if (show && subjectData) {
      reset({
        name: subjectData.name,
        code: subjectData.code,
        credits: subjectData.credits,
        semester: subjectData.semester,
        type: subjectData.type,
        programId: subjectData.program.id,
        teacherId: subjectData.subjectTeacher?.id || 0,
      });
    }
  }, [show, subjectData, reset]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title className="fw-bold w-100">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div
              className="bg-warning rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: "44px", height: "44px" }}
            >
              <i className="fas fa-book text-white fs-5"></i>
            </div>
            <div>
              <h5 className="mb-0">Update Subject</h5>
              <small className="text-muted">
                Modify the details to Update subject
              </small>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Modal.Body>
          {/* Subject Information */}
          <div className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-light rounded-circle p-2 me-3">
                <i className="fas fa-book text-warning"></i>
              </div>
              <h6 className="fw-bold mb-0">Subject Information</h6>
            </div>

            <Row className="g-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Subject Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    {...register("name")}
                    isInvalid={!!errors.name}
                    placeholder="Subject"
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Subject Code <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    {...register("code")}
                    isInvalid={!!errors.code}
                    placeholder="SUB 123"
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.code?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Credits <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    {...register("credits", { valueAsNumber: true })}
                    isInvalid={!!errors.credits}
                    className="py-2 no-spinner"
                    min="0"
                    step="1"
                    onWheel={(e) => {
                      // Prevent changing value with mouse wheel
                      (e.target as HTMLInputElement).blur();
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.credits?.message}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Enter a non-negative number
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Semester <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    {...register("semester", { valueAsNumber: true })}
                    isInvalid={!!errors.semester}
                    className="py-2 no-spinner"
                    min="1"
                    max="10"
                    step="1"
                    onWheel={(e) => {
                      // Prevent changing value with mouse wheel
                      (e.target as HTMLInputElement).blur();
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.semester?.message}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Enter between 1 and 10
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Type <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    {...register("type")}
                    className="py-2"
                    isInvalid={!!errors.type}
                  >
                    <option value="theory">Theory</option>
                    <option value="practical">Practical</option>
                    <option value="hybrid">Hybrid</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.type?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Assignment Section */}
          <div className="mb-3">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-light rounded-circle p-2 me-3">
                <i className="fas fa-link text-warning"></i>
              </div>
              <h6 className="fw-bold mb-0">Assignment</h6>
            </div>

            <Row className="g-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Program <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    {...register("programId", { valueAsNumber: true })}
                    isInvalid={!!errors.programId}
                    className="py-2"
                  >
                    <option value={0}>Select Program</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        ({program.code})
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.programId?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Teacher <span className="text-muted">(Optional)</span>
                  </Form.Label>
                  <Form.Select
                    {...register("teacherId", { valueAsNumber: true })}
                    isInvalid={!!errors.teacherId}
                    className="py-2"
                  >
                    <option value={0}>Select Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.teacherId?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-top-0">
          <Button variant="outline-secondary" onClick={onHide} className="px-4">
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
                <span className="spinner-border spinner-border-sm me-2" />
                Updating...
              </>
            ) : (
              <>
                <i className="fas fa-plus me-2"></i>
                Update Subject
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>

      <style>
        {`
          /* Hide the arrow spinners in number inputs */
          .no-spinner::-webkit-outer-spin-button,
          .no-spinner::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          
          .no-spinner {
            -moz-appearance: textfield;
          }
        `}
      </style>
    </Modal>
  );
};

export default SubjectEditModal;
