import * as yup from 'yup';

export const editStudentSchema = yup.object({
  firstName: yup
    .string()
    .optional()
    .matches(/^[A-Za-z\s]*$/, 'First name can only contain letters and spaces')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters'),
  
  lastName: yup
    .string()
    .optional()
    .matches(/^[A-Za-z]*$/, 'Last name can only contain letters')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters'),
  
  email: yup
    .string()
    .optional()
    .email('Invalid email address')
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Email format is invalid.'
    ),
  
  phone: yup
    .string()
    .optional()
    .matches(/^[0-9]{10,15}$/, 'Phone number must be 10 digits')
    .transform((value) => value?.replace(/[^\d]/g, '')),
  
  rollNumber: yup
    .string()
    .optional()
    .min(3, 'Roll number must be at least 3 characters')
    .max(20, 'Roll number cannot exceed 20 characters'),
  
  registrationNumber: yup
    .string()
    .optional()
    .min(3, 'Registration number must be at least 3 characters')
    .max(20, 'Registration number cannot exceed 20 characters'),
  
  enrollmentDate: yup
    .string()
    .optional()
    .test('is-valid-date', 'Invalid date format', (value) => {
      if (!value || value.trim() === '') return true;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test('not-future-date', 'Enrollment date cannot be in the future', (value) => {
      if (!value || value.trim() === '') return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate <= today;
    }),
  
  currentSemester: yup
    .number()
    .optional()
    .nullable()
    .transform((value, originalValue) => 
      originalValue === '' ? null : value
    )
    .min(1, 'Semester must be at least 1')
    .max(10, 'Semester cannot exceed 10')
    .integer('Semester must be a whole number'),
  
  programId: yup
    .number()
    .optional()
    .nullable()
    .transform((value, originalValue) => 
      originalValue === '' ? null : value
    )
    .min(1, 'Please select a valid program')
    .integer('Invalid program selection'),
  
  gender: yup
    .mixed<'M' | 'F' | 'O'>()
    .optional()
    .oneOf(['M', 'F', 'O'], 'Invalid gender selection'),
  
  DOB: yup
    .string()
    .optional()
    .nullable()
    .test('is-valid-date', 'Invalid date format', (value) => {
      if (!value || value.trim() === '') return true;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test('past-date', 'Date of birth must be in the past', (value) => {
      if (!value || value.trim() === '') return true;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate < today;
    })
    .test('valid-age', 'Student must be at least 16 years old', (value) => {
      if (!value || value.trim() === '') return true;
      const dob = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return age >= 16;
    }),
  
  address1: yup
    .string()
    .optional()
    .min(3, 'Address must be at least 10 characters')
    .max(200, 'Address cannot exceed 200 characters'),

});

export type EditStudentFormData = yup.InferType<typeof editStudentSchema>;