import React from 'react';
import { Modal, Button, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { AdminFormData } from '../../../../features/admin/admins/utils';
import { adminSchema } from '../validation/adminSchema';
import { yupResolver } from '@hookform/resolvers/yup';

interface AdminFormModalProps {
    show: boolean;
    onHide: () => void;
    onSubmit: (data: AdminFormData) => void;
    isLoading: boolean;
}

const AdminFormModal: React.FC<AdminFormModalProps> = ({
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
    } = useForm<AdminFormData>({
        resolver:yupResolver(adminSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address1: '',
            gender: 'M',
            DOB: '',
        }
    });

    const handleFormSubmit = (data: AdminFormData) => {
        onSubmit(data);
    };

    // Reset form when modal opens
    React.useEffect(() => {
        if (show) {
            reset({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address1: '',
                gender: 'M',
                DOB: '',
            });
        }
    }, [show, reset]);

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton className="border-bottom-0">
                <Modal.Title className="fw-bold w-100">
                    <div className="d-flex align-items-center gap-3 mb-2">
                        <div className="bg-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
                             style={{ width: '44px', height: '44px' }}>
                            <i className="fas fa-user-plus text-white fs-5"></i>
                        </div>
                        <div>
                            <h5 className="mb-0">Add New Admin</h5>
                            <small className="text-muted">
                                Fill in the details to add a new admin
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
                                        {...register('firstName')}
                                        isInvalid={!!errors.firstName}
                                        placeholder="Enter first name"
                                        className="py-2"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.firstName?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">
                                        Last Name <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register('lastName')}
                                        isInvalid={!!errors.lastName}
                                        placeholder="Enter last name"
                                        className="py-2"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.lastName?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">
                                        Email <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        {...register('email')}
                                        isInvalid={!!errors.email}
                                        placeholder="admin@university.edu"
                                        className="py-2"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Phone Number <span className="text-danger">*</span></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text className="bg-light">
                                            <i className="fas fa-phone"></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="tel"
                                            {...register('phone')}
                                            isInvalid={!!errors.phone}
                                            placeholder="1234567890"
                                            className="py-2"
                                        />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phone?.message}
                                    </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">
                                        Gender <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        {...register('gender')}
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
                                    <Form.Control
                                        type="date"
                                        {...register('DOB')}
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
                                {...register('address1')}
                                isInvalid={!!errors.address1}
                                placeholder="Street address, P.O. box, company name"
                                className="py-2"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.address1?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* <Form.Group>
                            <Form.Label className="fw-semibold">
                                Address Line 2 (Optional)
                            </Form.Label>
                            <Form.Control
                                type="text"
                                {...register('address2')}
                                placeholder="Apartment, suite, unit, building, floor, etc."
                                className="py-2"
                            />
                        </Form.Group> */}
                    </div>
                </Modal.Body>

                <Modal.Footer className="border-top-0">
                    <Button
                        variant="outline-secondary"
                        onClick={onHide}
                        className="px-4"
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
                                Add Admin
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AdminFormModal;