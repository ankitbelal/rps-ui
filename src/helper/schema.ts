import * as yup from 'yup';

export const profileSchema = yup.object({
    // Profile Information
    firstName: yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name cannot exceed 50 characters'),
    
    lastName: yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name cannot exceed 50 characters'),
    
    email: yup.string()
        .required('Email is required')
        .email('Please enter a valid email address'),
    
    phone: yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
    
    gender: yup.string()
        .required('Gender is required')
        .oneOf(['M', 'F', 'O'], 'Please select a valid gender'),
    
    DOB: yup.string()
        .required('Date of birth is required')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    
    address1: yup.string()
        .required('Address is required')
        .min(5, 'Address must be at least 5 characters')
        .max(200, 'Address cannot exceed 200 characters'),
    
    address2: yup.string()
        .nullable()
        .transform((value) => value || null)
        .max(200, 'Address cannot exceed 200 characters'),
});

export const passwordSchema = yup.object({
    currentPassword: yup.string()
        .required('Current password is required'),
    
    password: yup.string()
        .required('New password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[@$!%*?&#]/, 'Password must contain at least one special character (@$!%*?&#)'),
    
    confirmPassword: yup.string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password')], 'Passwords must match'),
});

export const combinedProfileSchema = profileSchema.concat(passwordSchema);