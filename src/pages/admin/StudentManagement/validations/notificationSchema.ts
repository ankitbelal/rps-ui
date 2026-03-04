import * as yup from 'yup';
export const notificationSchema = yup.object().shape({
  subject: yup
    .string()
    .required("Subject is required")
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject cannot exceed 200 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters"),
  sendEmail: yup.boolean().default(false),
});