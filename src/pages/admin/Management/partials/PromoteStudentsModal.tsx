import React from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { FaGraduationCap, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { useGetProgramsQuery } from "../../../../features/admin/students/studentApi";

// Interface for program data
export interface Program {
  id: string;
  name: string;
  code: string;
}

// Interface for modal props
interface PromoteStudentsModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: (programId: string) => void;
  isLoading?: boolean;
}

const PromoteStudentsModal: React.FC<PromoteStudentsModalProps> = ({
  show,
  onHide,
  onConfirm,
  isLoading = false,
}) => {
  const { data: programData, isLoading: isProgramLoading } = useGetProgramsQuery();
  const [selectedProgram, setSelectedProgram] = React.useState<string>("");
  const programs = programData?.data;

  // Find selected program details
  const selectedProgramDetails = React.useMemo(() => {
    if (!selectedProgram || !programs) return null;
    return programs.find(p => p.id === Number(selectedProgram));
  }, [selectedProgram, programs]);

  React.useEffect(() => {
    if (!show) {
      setSelectedProgram("");
    }
  }, [show]);

  const handleConfirm = () => {
    if (!selectedProgram) return;
    onConfirm(selectedProgram);
  };

  const handleClose = () => {
    setSelectedProgram("");
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      centered
      size="lg"
    >
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold">
          <FaGraduationCap className="text-primary me-2" size={24} />
          Promote Students
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="pt-3">
        <Alert variant="warning" className="d-flex align-items-center gap-2">
          <FaExclamationTriangle size={20} />
          <div>
            <strong>Warning:</strong> This action cannot be undone. Once confirmed, all eligible students from the selected program will be promoted to the next academic level. Final semester students will be labeled as Passed.
          </div>
        </Alert>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Select Program <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="py-2"
              disabled={isProgramLoading || isLoading}
            >
              <option value="">-- Choose a program --</option>
              {programs?.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name} ({program.code})
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Select the program whose students you want to promote
            </Form.Text>
          </Form.Group>

          {selectedProgramDetails && (
            <div className="bg-light p-3 rounded">
              <div className="d-flex align-items-center gap-2">
                <FaCheckCircle className="text-success" />
                <span className="text-muted">
                  You have selected: <strong>{selectedProgramDetails.name}</strong>
                </span>
              </div>
              <div className="mt-2 small text-muted">
                <span className="me-3">Code: {selectedProgramDetails.code}</span>
              </div>
            </div>
          )}
        </Form>
      </Modal.Body>
      
      <Modal.Footer className="border-top-0">
        <Button 
          variant="outline-secondary" 
          onClick={handleClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleConfirm}
          disabled={!selectedProgram || isLoading}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" />
              Promoting...
            </>
          ) : (
            <>
              <FaGraduationCap className="me-2" />
              Confirm Promotion
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PromoteStudentsModal;