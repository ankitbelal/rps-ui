import React, { useEffect } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { ProgramFormData } from '../../../../features/admin/programs/utils';
import { programSchema } from '../validations/programSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetFacultiesQuery } from '../../../../features/admin/students/studentApi';
import { useGetHodListQuery } from '../../../../features/admin/programs/programApi';
import { HODList } from '../../../../features/admin/programs/utils';
import { FacultyList } from '../../../../features/admin/students/utils';

interface ProgramFormModalProps {
    show: boolean;
    onHide: () => void;
    onSubmit: (data: ProgramFormData) => void;
    isLoading: boolean;
}

const ProgramFormModal: React.FC<ProgramFormModalProps> = ({
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
    } = useForm<ProgramFormData>({
        resolver: yupResolver(programSchema as any), // Cast to any to avoid type issues
        defaultValues: {
            name: '',
            code: '',
            facultyId: '',
            totalSemesters: 8,
            totalSubjects: 48,
            totalCredits: 130,
            durationInYears: 4,
            hodId: '',
        }
    });

    const { data: facultiesData, isLoading: isFacultiesLoading } = useGetFacultiesQuery(undefined,{refetchOnMountOrArgChange:true});

    const { data: teachersData, isLoading: isTeachersLoading } = useGetHodListQuery(undefined,{refetchOnMountOrArgChange:true});

    const handleFormSubmit = (data: ProgramFormData) => {
        onSubmit(data);
    };

    // Reset form when modal opens
    useEffect(() => {
        if (show) {
            reset({
                name: '',
                code: '',
                facultyId: '',
                totalSemesters: 8,
                totalSubjects: 48,
                totalCredits: 130,
                durationInYears: 4,
                hodId: '',
            });
        }
    }, [show, reset]);

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
                            <i className="fas fa-graduation-cap text-white fs-5"></i>
                        </div>
                        <div>
                            <h5 className="mb-0">Add New Program</h5>
                            <small className="text-muted">
                                Fill in the details to add a new academic program
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
                                <i className="fas fa-book text-primary"></i>
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
                                        {...register('name')}
                                        isInvalid={!!errors.name}
                                        placeholder="e.g., Bachelor of Computer Science"
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
                                        {...register('code')}
                                        isInvalid={!!errors.code}
                                        placeholder="e.g., CS"
                                        className="py-2 border-0 bg-light"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.code?.message}
                                    </Form.Control.Feedback>
                                    <Form.Text className="text-muted">
                                        Unique code (2-4 characters, uppercase)
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">
                                        Faculty <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        {...register('facultyId')}
                                        isInvalid={!!errors.facultyId}
                                        className="py-2 border-0 bg-light"
                                        disabled={isFacultiesLoading}
                                    >
                                        <option value="">Select Faculty</option>
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
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">
                                        Head of Department (HOD) <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        {...register('hodId')}
                                        isInvalid={!!errors.hodId}
                                        className="py-2 border-0 bg-light"
                                        disabled={isTeachersLoading}
                                    >
                                        <option value="">Select HOD</option>
                                        {teachersData?.data?.map((teacher: HODList) => (
                                            <option key={teacher.id} value={String(teacher.id)}>
                                                {teacher.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.hodId?.message}
                                    </Form.Control.Feedback>
                                    {isTeachersLoading && (
                                        <small className="text-muted">Loading teachers...</small>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    {/* Program Details Section */}
                    <div className="mb-4">
                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center me-3">
                                <i className="fas fa-cogs text-primary"></i>
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
                                        {...register('durationInYears', { valueAsNumber: true })}
                                        isInvalid={!!errors.durationInYears}
                                        min={1}
                                        max={10}
                                        className="py-2 border-0 bg-light"
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
                                        {...register('totalSemesters', { valueAsNumber: true })}
                                        isInvalid={!!errors.totalSemesters}
                                        min={1}
                                        max={20}
                                        className="py-2 border-0 bg-light"
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
                                        {...register('totalSubjects', { valueAsNumber: true })}
                                        isInvalid={!!errors.totalSubjects}
                                        min={1}
                                        max={200}
                                        className="py-2 border-0 bg-light"
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
                                        {...register('totalCredits', { valueAsNumber: true })}
                                        isInvalid={!!errors.totalCredits}
                                        min={1}
                                        max={500}
                                        step="0.5"
                                        className="py-2 border-0 bg-light"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.totalCredits?.message}
                                    </Form.Control.Feedback>
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
                        disabled={isLoading || isFacultiesLoading || isTeachersLoading}
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
                                Add Program
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ProgramFormModal;