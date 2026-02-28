import React from "react";
import { Modal, Button } from "react-bootstrap";

interface DeleteConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  studentName: string;
  status: "A" | "P" | "S"; // Active, Passed, Suspended (S = soft deleted)
  isLoading: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  show,
  onHide,
  onConfirm,
  studentName,
  status,
  isLoading,
}) => {
  // Determine if this is a restore action
  const isRestore = status === "S";

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isRestore ? "Confirm Restore" : "Confirm Deletion"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="text-center mb-4">
          <div
            className={`rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3 ${
              isRestore ? "bg-success" : "bg-danger"
            }`}
          >
            <i
              className={`fas ${
                isRestore
                  ? "fa-undo text-white"
                  : "fa-exclamation-triangle text-white"
              } fs-4`}
            ></i>
          </div>

          <h5>{isRestore ? "Restore Student" : "Delete Student"}</h5>
          <p className="text-muted">
            Are you sure you want to{" "}
            <strong>
              {isRestore ? "restore" : "delete"} {studentName}
            </strong>
            ?
          </p>

          {!isRestore && (
            <p className="text-danger small">
              <i className="fas fa-exclamation-circle me-1"></i>
              This action cannot be undone and all associated data will be lost.
            </p>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={onHide}
          disabled={isLoading}
        >
          <i className="fas fa-times me-2"></i>
          Cancel
        </Button>

        <Button
          variant={isRestore ? "success" : "danger"}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              {isRestore ? "Restoring..." : "Deleting..."}
            </>
          ) : (
            <>
              <i
                className={`fas ${isRestore ? "fa-undo" : "fa-trash"} me-2`}
              ></i>
              {isRestore ? "Restore Student" : "Delete Student"}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
