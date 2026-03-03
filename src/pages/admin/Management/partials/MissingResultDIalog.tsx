import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import {
  FaExclamationTriangle,
  FaFileExcel,
  FaTimes,
  FaDownload,
} from "react-icons/fa";

interface MissingReportModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  message: string;
  isLoading?: boolean;
}

const MissingReportModal: React.FC<MissingReportModalProps> = ({
  show,
  onHide,
  onConfirm,
  message,
  isLoading = false,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header
        closeButton
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #f0f0f0",
          backgroundColor: "#fff3e0",
        }}
      >
        <Modal.Title
          style={{
            fontSize: "16px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#b85c00",
          }}
        >
          <span
            style={{
              background: "#ffe5b4",
              borderRadius: "8px",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaExclamationTriangle size={18} color="#b85c00" />
          </span>
          Missing Results Detected
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "24px" }}>
        <div
          style={{
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
            border: "1px solid #e9ecef",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "#495057",
              marginBottom: "8px",
              fontWeight: 500,
            }}
          >
            {message}
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#6c757d",
              marginBottom: 0,
            }}
          >
            Some students are missing their results for the selected criteria.
            Would you like to download a report of the missing results?
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            backgroundColor: "#e7f3ff",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <FaFileExcel size={24} color="#1e7e34" />
          <div>
            <div
              style={{ fontWeight: 600, fontSize: "13px", color: "#0a3622" }}
            >
              Missing Results Report
            </div>
            <div style={{ fontSize: "12px", color: "#2d6a4f" }}>
              Excel file listing all students with missing results
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer
        style={{
          borderTop: "1px solid #f0f0f0",
          padding: "16px 24px",
          gap: "12px",
        }}
      >
        <Button
          variant="outline-secondary"
          onClick={onHide}
          disabled={isLoading}
          style={{
            borderRadius: "8px",
            fontSize: "13.5px",
            padding: "8px 20px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FaTimes size={12} />
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={onConfirm}
          disabled={isLoading}
          style={{
            borderRadius: "8px",
            fontSize: "13.5px",
            padding: "8px 22px",
            fontWeight: 600,
            backgroundColor: "#198754",
            borderColor: "#198754",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" animation="border" />
              Downloading...
            </>
          ) : (
            <>
              <FaDownload size={13} />
              Download Missing Report
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MissingReportModal;
