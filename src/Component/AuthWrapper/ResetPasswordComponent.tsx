import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./css/auth.css";
import { toast } from "react-toastify";
import { useResetPasswordMutation } from "../../features/auth/authApi";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ResetPasswordComponentProps {
  email: string;
  onResetPassword: (password: string) => void;
}

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

// ---------------------------------------------------------------------------
// Yup schema
// ---------------------------------------------------------------------------

const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character (@$!%*?&#)"
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ResetPasswordComponent: React.FC<ResetPasswordComponentProps> = ({
  email,
  onResetPassword,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [resetPassword, { isLoading: isReseting }] = useResetPasswordMutation();

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    try {
      const formData = { ...data, email };
      const res = await resetPassword(formData).unwrap();
      if (res.statusCode === 200 || res.success) {
        toast.success(res?.message || "Password changed successfully.");
        onResetPassword(data.password);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="sign-in-form">
      {/* Mobile Logo Header */}
      <div className="mobile-logo-header">
        <div className="mobile-logo-icon">
          <i className="fas fa-graduation-cap"></i>
        </div>
        <h2 className="mobile-logo-text">IES</h2>
        <p className="mobile-logo-subtitle">Internal Evaluation System</p>
      </div>

      <h2 className="title">Reset Password</h2>
      <p
        style={{
          fontSize: "0.95rem",
          color: "#666",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        Enter your new password
      </p>

      {/* New Password */}
      <div className={`input-field${errors.password ? " input-field--error" : ""}`}>
        <i className="fas fa-lock"></i>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          {...register("password")}
        />
        <i
          className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
          onClick={() => setShowPassword(!showPassword)}
        ></i>
      </div>
      {errors.password && (
        <span className="error-text">{errors.password.message}</span>
      )}

      {/* Confirm Password */}
      <div className={`input-field${errors.confirmPassword ? " input-field--error" : ""}`}>
        <i className="fas fa-lock"></i>
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          {...register("confirmPassword")}
        />
        <i
          className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        ></i>
      </div>
      {errors.confirmPassword && (
        <span className="error-text">{errors.confirmPassword.message}</span>
      )}

      <input
        type="submit"
        value={isReseting ? "Resetting..." : "Reset Password"}
        className="btn-auth"
        disabled={isReseting}
      />
    </form>
  );
};

export default ResetPasswordComponent;