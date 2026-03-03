import * as yup from 'yup';

export const studentSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .matches(/^[A-Za-z\s]+$/, 'First name can only contain letters and spaces')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters'),
  
  lastName: yup
    .string()
    .required('Last name is required')
    .matches(/^[A-Za-z]+$/, 'Last name can only contain letters')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address')
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Email format is invalid.'
    ),
  
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9]{10,15}$/, 'Phone number must be 10 digits')
    .transform((value) => value?.replace(/[^\d]/g, '')), // Remove non-digits
  
  rollNumber: yup
    .string()
    .required('Roll number is required')
    .min(3, 'Roll number must be at least 3 characters')
    .max(20, 'Roll number cannot exceed 20 characters'),
  
  registrationNumber: yup
    .string()
    .required('Registration number is required')
    .min(3, 'Registration number must be at least 3 characters')
    .max(20, 'Registration number cannot exceed 20 characters'),
  
  enrollmentDate: yup
    .string()
    .required('Enrollment date is required')
    .test('is-valid-date', 'Invalid date format', (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test('not-future-date', 'Enrollment date cannot be in the future', (value) => {
      if (!value) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate <= today;
    }),
  
  currentSemester: yup
    .number()
    .required('Current semester is required')
    .min(1, 'Semester must be at least 1')
    .max(10, 'Semester cannot exceed 10')
    .integer('Semester must be a whole number'),
  
  programId: yup
    .number()
    .required('Program is required')
    .min(1, 'Please select a program')
    .integer('Invalid program selection'),
  
  gender: yup
    .mixed<'M' | 'F' | 'O'>() // Use mixed with specific values
    .required('Gender is required')
    .oneOf(['M', 'F', 'O'], 'Invalid gender selection'),
  
DOB: yup
    .string()
    .required()
    .test('past-date', 'Date of birth must be in the past.', (value) => {
        if (!value || value.trim() === '') return true; // optional field
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate < today;
    }),

  address1: yup
    .string()
    .required('Address is required')
    .min(3, 'Address must be at least 3 characters')
    .max(200, 'Address cannot exceed 200 characters'),

});
