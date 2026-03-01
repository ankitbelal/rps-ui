import React, { useState } from 'react';
import { Button, Row, Col, Form, Alert, Card, Badge } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { gradeRangeSchema } from '../validations/managementSchema';
import { FaPlus, FaTrash, FaExclamationTriangle, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAddGradeRangeMutation } from '../../../../features/admin/management/mamagementApi';

// Interface for grade range form data
interface GradeRangeFormData {
  gradeRanges: {
    minGPA: number | undefined;
    maxGPA: number | undefined;
    grade: string;
    remarks: string;
  }[];
}

interface GradeRangeFormProps {
  onCancel: () => void;
}

const GradeRangeForm: React.FC<GradeRangeFormProps> = ({
  onCancel
}) => {
  // const [isLoading, setIsLoading] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [createGradeRange, {isLoading:isAddingGrades}] = useAddGradeRangeMutation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm<GradeRangeFormData>({
    resolver: yupResolver(gradeRangeSchema as any),
    defaultValues: {
      gradeRanges: [
        {
          minGPA: undefined,
          maxGPA: undefined,
          grade: '',
          remarks: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'gradeRanges',
  });

  const watchGradeRanges = watch('gradeRanges');

  // Validate individual range on change
  const validateRange = (index: number) => {
    const range = watchGradeRanges?.[index];
    if (!range) return;

    // Check for duplicate grades
    if (range.grade) {
      const duplicateIndex = watchGradeRanges?.findIndex(
        (r, i) => i !== index && r.grade && r.grade.toLowerCase() === range.grade?.toLowerCase()
      );
      
      if (duplicateIndex !== undefined && duplicateIndex !== -1) {
        setDuplicateError(`Duplicate grade "${range.grade}" found in ranges ${index + 1} and ${duplicateIndex + 1}`);
        setError(`gradeRanges.${index}.grade`, {
          type: 'manual',
          message: 'Grade must be unique',
        });
      } else {
        // Check if there are any other duplicates
        const allGrades = watchGradeRanges?.map(r => r.grade).filter(g => g);
        const hasDuplicates = allGrades?.some((g, i) => allGrades.indexOf(g) !== i);
        if (!hasDuplicates) {
          setDuplicateError(null);
        }
        clearErrors(`gradeRanges.${index}.grade`);
      }
    }
  };

  const handleFormSubmit = async (data: GradeRangeFormData) => {
    // Filter out any incomplete ranges before submitting
    const validData = {
      gradeRanges: data.gradeRanges.filter(
        r => r.minGPA !== undefined && r.maxGPA !== undefined && r.grade && r.remarks
      ),
    };
    
    if (validData.gradeRanges.length === 0) {
      setError('gradeRanges', {
        type: 'manual',
        message: 'At least one complete grade range is required',
      });
      return;
    }

    // Check for duplicate grades
    const grades = validData.gradeRanges.map(r => r.grade);
    const uniqueGrades = new Set(grades);
    if (grades.length !== uniqueGrades.size) {
      const duplicate = grades.find((val, i) => grades.indexOf(val) !== i);
      setDuplicateError(`Duplicate grade found: ${duplicate}`);
      return;
    }

    try {
      setDuplicateError(null);

      const response = await toast.promise(createGradeRange(data).unwrap(),{
        loading:"Creating grade range..."
      })
      
      if(response.success){
        toast.success(response.message);
        reset({
          gradeRanges: [
            {
              minGPA: undefined,
              maxGPA: undefined,
              grade: '',
              remarks: '',
            },
          ],
        });
        onCancel();
      }
    } catch (error: any) {
      const apiErrors = error?.data?.errors;
      if (apiErrors) {
        Object.entries(apiErrors).forEach(([field, message]) => {
          setError(field as keyof GradeRangeFormData, {
            type: "server",
            message: message as string,
          });
        });
      } else {
        toast.error(error?.data?.message);
      }
    }
  };

  // Get grade color for visual feedback
  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'success';
    if (grade.includes('B')) return 'info';
    if (grade.includes('C')) return 'warning';
    if (grade === 'F') return 'danger';
    return 'secondary';
  };

  // Check if all grades are filled
  const allGradesFilled = watchGradeRanges?.every(r => r.grade && r.minGPA && r.maxGPA && r.remarks) || false;
  
  // Get filled grades count
  const filledGradesCount = watchGradeRanges?.filter(r => r.grade && r.minGPA && r.maxGPA && r.remarks).length || 0;

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white py-3 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary bg-opacity-10 p-2 rounded">
            <i className="fas fa-graduation-cap text-primary"></i>
          </div>
          <div>
            <h5 className="mb-0 fw-bold">Configure Grade Ranges</h5>
            <small className="text-muted">
              Fill in the details for each grade range
            </small>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Validation Rules Alert */}
          <Alert variant="info" className="d-flex align-items-center gap-2 mb-4">
            <i className="fas fa-info-circle"></i>
            <div>
              <strong>Grading Rules:</strong>
              <ul className="mb-0 mt-1 ps-3">
                <li>minGPA must be less than maxGPA</li>
                <li>All GPA values must be between 0 and 4</li>
                <li>Each grade must be unique (e.g., A+, A, A-, etc.)</li>
                <li>All fields are required</li>
              </ul>
            </div>
          </Alert>

          {/* Progress indicator */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <span className="fw-semibold">Progress: </span>
              <span className="text-muted">{filledGradesCount} of {fields.length} ranges completed</span>
            </div>
          </div>

          {/* Duplicate Error Alert */}
          {duplicateError && (
            <Alert variant="warning" className="mb-4 d-flex align-items-center gap-2">
              <FaExclamationTriangle />
              <span>{duplicateError}</span>
            </Alert>
          )}

          {/* Dynamic Grade Range Fields */}
          {fields.map((field, index) => {
            const currentGrade = watchGradeRanges?.[index]?.grade;
            const gradeColor = currentGrade ? getGradeColor(currentGrade) : 'secondary';
            
            return (
              <div key={field.id} className="mb-4 pb-4 border-bottom position-relative">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center">
                      <span className="fw-bold text-primary">{index + 1}</span>
                    </div>
                    <h6 className="fw-bold mb-0">Grade Range {index + 1}</h6>
                    {currentGrade && (
                      <Badge bg={gradeColor} className="ms-2">
                        {currentGrade}
                      </Badge>
                    )}
                  </div>
                  {fields.length > 1 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => remove(index)}
                      className="d-flex align-items-center gap-1"
                      disabled={isAddingGrades}
                    >
                      <FaTrash size={12} />
                      <span>Remove</span>
                    </Button>
                  )}
                </div>

                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Grade <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        {...register(`gradeRanges.${index}.grade`)}
                        isInvalid={!!errors.gradeRanges?.[index]?.grade}
                        placeholder="e.g., A+, B, C-"
                        className="py-2 border-0 bg-light"
                        onChange={(e) => {
                          register(`gradeRanges.${index}.grade`).onChange(e);
                          validateRange(index);
                        }}
                        disabled={isAddingGrades}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.gradeRanges?.[index]?.grade?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Min GPA <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        {...register(`gradeRanges.${index}.minGPA`)}
                        isInvalid={!!errors.gradeRanges?.[index]?.minGPA}
                        placeholder="0.00"
                        className="py-2 border-0 bg-light"
                        onChange={(e) => {
                          register(`gradeRanges.${index}.minGPA`).onChange(e);
                          validateRange(index);
                        }}
                        disabled={isAddingGrades}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.gradeRanges?.[index]?.minGPA?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Max GPA <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        {...register(`gradeRanges.${index}.maxGPA`)}
                        isInvalid={!!errors.gradeRanges?.[index]?.maxGPA}
                        placeholder="0.00"
                        className="py-2 border-0 bg-light"
                        onChange={(e) => {
                          register(`gradeRanges.${index}.maxGPA`).onChange(e);
                          validateRange(index);
                        }}
                        disabled={isAddingGrades}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.gradeRanges?.[index]?.maxGPA?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Remarks <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        {...register(`gradeRanges.${index}.remarks`)}
                        isInvalid={!!errors.gradeRanges?.[index]?.remarks}
                        placeholder="e.g., Excellent, Very Good, Average"
                        className="py-2 border-0 bg-light"
                        disabled={isAddingGrades}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.gradeRanges?.[index]?.remarks?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Preview of the range */}
                {watchGradeRanges?.[index]?.minGPA && watchGradeRanges?.[index]?.maxGPA && (
                  <div className="mt-2 small">
                    <i className="fas fa-chart-line me-1 text-muted"></i>
                    <span className="text-muted">Range: </span>
                    <span className="fw-semibold">{watchGradeRanges[index].minGPA}</span>
                    <span className="text-muted mx-1">—</span>
                    <span className="fw-semibold">{watchGradeRanges[index].maxGPA}</span>
                    {watchGradeRanges[index].minGPA >= watchGradeRanges[index].maxGPA && (
                      <span className="text-danger ms-2">
                        <FaExclamationTriangle size={12} className="me-1" />
                        Min must be less than Max
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Another Range Button */}
          <div className="text-center mt-3">
            <Button
              variant="outline-primary"
              onClick={() =>
                append({
                  minGPA: undefined,
                  maxGPA: undefined,
                  grade: '',
                  remarks: '',
                })
              }
              className="d-inline-flex align-items-center gap-2 px-4"
              disabled={isAddingGrades}
            >
              <FaPlus size={12} />
              <span>Add Another Grade Range</span>
            </Button>
          </div>

          {/* Global Error Display */}
          {errors.gradeRanges?.message && (
            <Alert variant="danger" className="mt-4 d-flex align-items-center gap-2">
              <FaExclamationTriangle />
              <span>{errors.gradeRanges.message}</span>
            </Alert>
          )}

          {/* Form Actions */}
          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <Button
              variant="outline-secondary"
              onClick={onCancel}
              disabled={isAddingGrades}
              className="d-flex align-items-center gap-2 px-4"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isAddingGrades || !allGradesFilled || duplicateError !== null}
              className="d-flex align-items-center gap-2 px-4"
              size="lg"
            >
              {isAddingGrades ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Save Grade Ranges</span>
                </>
              )}
            </Button>
          </div>

          {/* Info message when not all grades are filled */}
          {fields.length > 0 && !allGradesFilled && (
            <Alert variant="warning" className="mt-3">
              <FaExclamationTriangle className="me-2" />
              Please fill in all fields for each grade range. {filledGradesCount} of {fields.length} ranges completed.
            </Alert>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default GradeRangeForm;