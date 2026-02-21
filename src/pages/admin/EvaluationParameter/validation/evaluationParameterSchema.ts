import * as yup from 'yup';

export const evaluationParameterSchema = yup.object({
    code: yup.string()
        .required('Parameter code is required')
        .min(2, 'Parameter code must be at least 2 characters')
        .max(10, 'Parameter code cannot exceed 10 characters')
        .matches(/^[A-Z0-9]+$/, 'Parameter code can only contain uppercase letters and numbers'),
    
    name: yup.string()
        .required('Parameter name is required')
        .min(3, 'Parameter name must be at least 3 characters')
        .max(50, 'Parameter name cannot exceed 50 characters')
        .matches(/^[a-zA-Z\s]+$/, 'Parameter name can only contain letters and spaces'),
});