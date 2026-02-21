import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface DeleteConfirmationModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
    name?:string;
    type?:string;
    programName?: string;
    teacherName?: string;
    facultyName?: string;
    subjectName?:string;
    isLoading: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    show,
    onHide,
    onConfirm,
    name,
    type,
    isLoading,
}) => {

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
            backdrop="static"
        >
            <Modal.Header closeButton className="border-bottom-0 pb-0">
                <Modal.Title className="fw-bold">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
                             style={{ width: '44px', height: '44px' }}>
                            <i className="fas fa-trash-alt text-white fs-5"></i>
                        </div>
                        <div>
                            <h5 className="mb-0">Confirm Delete</h5>
                        </div>
                    </div>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="pt-3">
                <div className="text-center mb-4">
                    <div className="bg-danger bg-opacity-10 rounded-circle p-4 d-inline-block mb-3">
                        <i className="fas fa-exclamation-triangle text-danger fa-2x"></i>
                    </div>
                    <h6 className="fw-bold">Are you sure?</h6>
                    <p className="text-muted mb-0">
                        You are about to delete <strong>"{name}"</strong>. 
                       The paramater may be in use.
                    </p>
                </div>
            </Modal.Body>

            <Modal.Footer className="border-top-0">
                <Button
                    variant="outline-secondary"
                    onClick={onHide}
                    className="px-4"
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    variant="danger"
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="px-4"
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Deleting...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-trash me-2"></i>
                            Delete {type}
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmationModal;