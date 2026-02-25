import React, { useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Faculty } from "../../../../features/admin/faculty/utils";
import * as yup from "yup";

interface FacultyFormData {
  name: string;
  description: string;
}

interface FacultyEditModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: FacultyFormData) => void;
  isLoading: boolean;
  faculty: Faculty | null;
}

const facultySchema = yup.object({
  name: yup
    .string()
    .required("Faculty name is required")
    .min(2, "Faculty name must be at least 2 characters")
    .max(50, "Faculty name cannot exceed 50 characters"),

  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description cannot exceed 200 characters"),
});

const FacultyEditModal: React.FC<FacultyEditModalProps> = ({
  show,
  onHide,
  onSubmit,
  isLoading,
  faculty,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FacultyFormData>({
    resolver: yupResolver(facultySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (show && faculty) {
      reset({
        name: faculty.name,
        description: faculty.description,
      });
    }
  }, [show, faculty, reset]);

  const handleFormSubmit = (data: FacultyFormData) => {
    onSubmit(data);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold">
          <div className="d-flex align-items-center gap-3">
            <div
              className="bg-warning rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: "44px", height: "44px" }}
            >
              <i className="fas fa-edit text-white fs-5"></i>
            </div>
            <div>
              <h5 className="mb-0">Edit Faculty</h5>
              <small className="text-muted">Update faculty information</small>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Modal.Body className="pt-0">
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              Faculty Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              {...register("name")}
              isInvalid={!!errors.name}
              placeholder="e.g., Faculty of Science"
              className="py-2 border-0 bg-light"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Description <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register("description")}
              isInvalid={!!errors.description}
              placeholder="Brief description of the faculty's purpose..."
              className="py-2 border-0 bg-light"
              style={{ resize: "none" }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description?.message}
            </Form.Control.Feedback>
          </Form.Group>
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
                Update Faculty
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FacultyEditModal;
