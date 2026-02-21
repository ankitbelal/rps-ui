// components/admin/evaluations/EvaluationParameterModal.tsx
import React, { useEffect } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { evaluationParameterSchema } from '../validation/evaluationParameterSchema'; 
import { EvaluationParameterFormData } from '../../../../features/admin/params/utils'; 

interface EvaluationParameterModalProps {
    show: boolean;
    onHide: () => void;
    onSubmit: (data: EvaluationParameterFormData) => void;
    isLoading: boolean;
}

const EvaluationParameterModal: React.FC<EvaluationParameterModalProps> = ({
    show,
    onHide,
    onSubmit,
    isLoading,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EvaluationParameterFormData>({
        resolver: yupResolver(evaluationParameterSchema),
        defaultValues: {
            code: '',
            name: '',
        }
    });

    // Reset form when modal opens
    useEffect(() => {
        if (show) {
            reset({
                code: '',
                name: '',
            });
        }
    }, [show, reset]);

    const handleFormSubmit = (data: EvaluationParameterFormData) => {
        onSubmit(data);
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
            backdrop="static"
        >
            <Modal.Header closeButton className="border-bottom-0 pb-0">
                <Modal.Title className="fw-bold w-100">
                    <div className="d-flex align-items-center gap-3 mb-2">
                        <div className="bg-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
                             style={{ width: '44px', height: '44px' }}>
                            <i className="fas fa-sliders-h text-white fs-5"></i>
                        </div>
                        <div>
                            <h5 className="mb-0">Add Evaluation Parameter</h5>
                            <small className="text-muted">
                                Create a new evaluation parameter for assessments
                            </small>
                        </div>
                    </div>
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit(handleFormSubmit)}>
                <Modal.Body className="pt-0">
                    {/* Evaluation Parameter Form */}
                    <div className="mb-4">
                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center me-3">
                                <i className="fas fa-clipboard-list text-primary"></i>
                            </div>
                            <h6 className="fw-bold mb-0">Parameter Information</h6>
                        </div>

                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">
                                        Parameter Code <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register('code')}
                                        isInvalid={!!errors.code}
                                        placeholder="Enter Evaluation Parameter Code"
                                        className="py-2 border-0 bg-light"
                                        maxLength={10}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.code?.message}
                                    </Form.Control.Feedback>
                                    <Form.Text className="text-muted">
                                        Unique code (2-10 characters, uppercase letters and numbers only)
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">
                                        Parameter Name <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register('name')}
                                        isInvalid={!!errors.name}
                                        placeholder="Enter Evaluation Parameter Name"
                                        className="py-2 border-0 bg-light"
                                        maxLength={50}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name?.message}
                                    </Form.Control.Feedback>
                                    <Form.Text className="text-muted">
                                        Descriptive name (3-50 characters, letters and spaces only)
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
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
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Creating...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-plus me-2"></i>
                                Add Parameter
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EvaluationParameterModal;