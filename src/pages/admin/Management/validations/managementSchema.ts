import * as yup from 'yup';

export const gradeRangeSchema = yup.object().shape({
  gradeRanges: yup
    .array()
    .of(
      yup.object().shape({
        minGPA: yup
          .number()
          .typeError('Minimum GPA must be a number')
          .min(0, 'Minimum GPA cannot be less than 0')
          .max(4, 'Maximum GPA cannot exceed 4')
          .required('Minimum GPA is required')
          .transform((value) => (isNaN(value) ? undefined : value)),
        maxGPA: yup
          .number()
          .typeError('Maximum GPA must be a number')
          .min(0, 'Minimum GPA cannot be less than 0')
          .max(4, 'Maximum GPA cannot exceed 4')
          .required('Maximum GPA is required')
          .transform((value) => (isNaN(value) ? undefined : value))
          .test(
            'is-greater-than-min',
            'Max GPA must be greater than Min GPA',
            function(value) {
              const { minGPA } = this.parent;
              return !minGPA || !value || value > minGPA;
            }
          ),
        grade: yup
          .string()
          .matches(
            /^(A\+|A|A-|B\+|B|B-|C\+|C|C-|F)$/,
            'Grade must be valid (e.g., A+, A, A-, B+, B, B-, C+, C, C-, F)'
          )
          .required('Grade is required'),
        remarks: yup
          .string()
          .max(100, 'Remarks cannot exceed 100 characters')
          .required('Remarks are required'),
      })
    )
    .test('no-duplicate-grades', 'Grades must be unique', function(ranges) {
      if (!ranges || ranges.length === 0) return true;

      const grades = ranges.map(r => r.grade).filter(g => g);
      const uniqueGrades = new Set(grades);
      
      if (grades.length !== uniqueGrades.size) {
        const duplicates = grades.filter((item, index) => grades.indexOf(item) !== index);
        return this.createError({
          message: `Duplicate grades found: ${[...new Set(duplicates)].join(', ')}`,
        });
      }
      return true;
    }),
});