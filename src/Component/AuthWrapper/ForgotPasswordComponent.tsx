import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useVerifyEmailMutation } from "../../features/auth/authApi";
import "./css/auth.css";
import { toast } from "react-toastify";

interface ForgotPasswordComponentProps {
  onSendOTP: (email: string) => void;
  onBack: () => void;
}

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordComponent: React.FC<ForgotPasswordComponentProps> = ({
  onSendOTP,
  onBack,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const [sendOTP, { isLoading: isSending }] = useVerifyEmailMutation();

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    try {
      const res = await sendOTP(data).unwrap();
      if (res.statusCode == 200 || res.success) {
        toast.success(res.message || "OTP sent successfully.");
        onSendOTP(data.email);
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to Send OTP.";
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="sign-in-form">
      {/* Mobile Logo Header */}
      <div className="mobile-logo-header">
        <div className="mobile-logo-icon">
          <i className="fas fa-graduation-cap"></i>
        </div>
        <h2 className="mobile-logo-text">RPS</h2>
        <p className="mobile-logo-subtitle">Result Processing System</p>
      </div>

      <h2 className="title">Forgot Password</h2>
      <p
        style={{
          fontSize: "0.95rem",
          color: "#666",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        Enter your email address and we'll send you a verification code
      </p>

      <div className="input-field">
        <i className="fas fa-envelope"></i>
        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          disabled={isSending}
        />
      </div>
      {errors.email && (
        <span className="error-text">{errors.email.message}</span>
      )}

      <input
        type="submit"
        value={isSending ? "Sending..." : "Send OTP"}
        className="btn-auth"
        disabled={isSending}
      />

      <button
        type="button"
        className="forgot-link"
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          marginTop: "0.5rem",
        }}
        disabled={isSending}
      >
        Back to Login
      </button>
    </form>
  );
};

export default ForgotPasswordComponent;
