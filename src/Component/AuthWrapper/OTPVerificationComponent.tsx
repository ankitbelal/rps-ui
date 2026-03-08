import React, { useRef, KeyboardEvent, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import "./css/auth.css";
import { useVerifyOTPMutation } from "../../features/auth/authApi";
import { useVerifyEmailMutation } from "../../features/auth/authApi";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OTPVerificationComponentProps {
  email: string;
  onVerifyOTP: (otp: string) => void;
  onBack: () => void;
}

interface OTPFormData {
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  otp5: string;
  otp6: string;
}

// ---------------------------------------------------------------------------
// Yup schema — every field must be exactly one digit (0-9)
// ---------------------------------------------------------------------------

const otpSchema = yup.object({
  otp1: yup
    .string()
    .matches(/^\d$/, "Must be a digit")
    .required("Required"),
  otp2: yup
    .string()
    .matches(/^\d$/, "Must be a digit")
    .required("Required"),
  otp3: yup
    .string()
    .matches(/^\d$/, "Must be a digit")
    .required("Required"),
  otp4: yup
    .string()
    .matches(/^\d$/, "Must be a digit")
    .required("Required"),
  otp5: yup
    .string()
    .matches(/^\d$/, "Must be a digit")
    .required("Required"),
  otp6: yup
    .string()
    .matches(/^\d$/, "Must be a digit")
    .required("Required"),
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const OTPVerificationComponent: React.FC<OTPVerificationComponentProps> = ({
  email,
  onVerifyOTP,
  onBack,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: yupResolver(otpSchema),
    defaultValues: {
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      otp5: "",
      otp6: "",
    },
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpValues = watch();

  // Timer state — 10 minutes = 600 seconds
  const [timeLeft, setTimeLeft] = useState(600);
  const [isTimerExpired, setIsTimerExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsTimerExpired(true);
      return;
    }
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation();
  const [resendOTP, { isLoading: resending }] = useVerifyEmailMutation();

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const onSubmit: SubmitHandler<OTPFormData> = async (data) => {
    const otp = `${data.otp1}${data.otp2}${data.otp3}${data.otp4}${data.otp5}${data.otp6}`;
    try {
      const res = await verifyOTP({ email, otp }).unwrap();
      if (res.statusCode === 200 || res.success) {
        toast.success(res?.message || "OTP verified successfully.");
        onVerifyOTP(otp);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to verify OTP.");
    }
  };

  // ---------------------------------------------------------------------------
  // Helpers — keep react-hook-form state AND the real DOM input value in sync
  // ---------------------------------------------------------------------------

  /** Write a single digit into field + DOM, then optionally move focus. */
  const setDigit = (index: number, digit: string) => {
    const fieldName = `otp${index + 1}` as keyof OTPFormData;
    setValue(fieldName, digit, { shouldValidate: true, shouldDirty: true });

    // Also update the actual DOM value so the browser shows the character.
    const el = inputRefs.current[index];
    if (el) el.value = digit;
  };

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleChange = (index: number, value: string) => {
    // Allow only a single digit
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1); // take last char if somehow >1
    setDigit(index, digit);

    // Auto-advance
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    const fieldName = `otp${index + 1}` as keyof OTPFormData;

    if (e.key === "Backspace") {
      if (otpValues[fieldName]) {
        // Clear current field
        setDigit(index, "");
      } else if (index > 0) {
        // Move back and clear previous field
        setDigit(index - 1, "");
        inputRefs.current[index - 1]?.focus();
      }
      e.preventDefault();
    }
  };

  /**
   * handlePaste — the original bug was that only setValue() was called but the
   * real DOM <input> value was never updated, so what the user saw in each box
   * didn't change.  We now:
   *   1. Call setDigit() (which updates both RHF state AND the DOM node).
   *   2. Call trigger() once after all digits are set to run Yup validation.
   *   3. Move focus to the correct box.
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      setDigit(i, pastedData[i]);
    }

    // Run validation after all values are set
    trigger();

    // Focus the next empty box, or the last filled one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // ---------------------------------------------------------------------------
  // Resend
  // ---------------------------------------------------------------------------

  const handleResendOTP = async () => {
    try {
      const res = await resendOTP({ email }).unwrap();
      if (res?.statusCode === 200 || res?.status) {
        toast.success(res?.message || "OTP sent successfully.");
        // Clear all inputs (RHF state + DOM)
        reset();
        inputRefs.current.forEach((el) => {
          if (el) el.value = "";
        });
        setTimeLeft(600);
        setIsTimerExpired(false);
      }
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send OTP.");
    }
  };

  // OTP is complete when every watched field has exactly one character
  const isOTPComplete = Object.values(otpValues).every((val) => val !== "");

  // ---------------------------------------------------------------------------
  // Expired screen
  // ---------------------------------------------------------------------------

  if (isTimerExpired) {
    return (
      <form className="sign-in-form">
        <div className="mobile-logo-header">
          <div className="mobile-logo-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <h2 className="mobile-logo-text">IES</h2>
          <p className="mobile-logo-subtitle">Internal Evaluation System</p>
        </div>

        <h2 className="title">OTP Expired</h2>
        <p
          style={{
            fontSize: "0.95rem",
            color: "#e74c3c",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Your OTP has expired. Please request a new one.
        </p>

        <input
          type="button"
          value={resending ? "Resending…" : "Resend OTP"}
          className="btn-auth"
          onClick={handleResendOTP}
          disabled={resending}
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
            color: "#888",
          }}
        >
          Back
        </button>
      </form>
    );
  }

  // ---------------------------------------------------------------------------
  // Main OTP form
  // ---------------------------------------------------------------------------

  // Determine if there is a validation error to show (any digit field failed)
  const hasError = Object.values(errors).some(Boolean);

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

      <h2 className="title">Verify OTP</h2>
      <p
        style={{
          fontSize: "0.95rem",
          color: "#666",
          marginBottom: "0.5rem",
          textAlign: "center",
        }}
      >
        Enter the 6-digit code sent to{" "}
        <strong style={{ color: "#5995fd" }}>{email}</strong>
      </p>

      {/* Timer */}
      <div className={`otp-timer ${timeLeft < 60 ? "warning" : "normal"}`}>
        <i className="fas fa-clock"></i>
        {formatTime(timeLeft)}
      </div>

      {/* OTP Inputs */}
      <div className="otp-container">
        {([0, 1, 2, 3, 4, 5] as const).map((index) => {
          const fieldName = `otp${index + 1}` as keyof OTPFormData;
          return (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={`otp-input${errors[fieldName] && otpValues[fieldName] === "" ? " otp-input--error" : ""}`}
              {...register(fieldName)}
              ref={(el) => {
                // Merge RHF ref with our own ref array
                const { ref: rhfRef } = register(fieldName);
                inputRefs.current[index] = el;
                if (typeof rhfRef === "function") rhfRef(el);
              }}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              autoFocus={index === 0}
              autoComplete="one-time-code"
            />
          );
        })}
      </div>

      {/* Validation error message */}
      {hasError && (
        <span className="error-text">
          Please enter all 6 digits of your OTP.
        </span>
      )}

      {/* Submit */}
      <input
        type="submit"
        value={isVerifying ? "Verifying…" : "Verify OTP"}
        className="btn-auth"
        disabled={isVerifying || !isOTPComplete}
      />

      {/* Resend — disabled while timer is still running to prevent spam */}
      <input
        type="button"
        className="forgot-link"
        onClick={handleResendOTP}
        value={resending ? "Resending…" : "Resend OTP"}
        disabled={resending}
        style={{
          background: "none",
          border: "none",
          cursor: resending ? "not-allowed" : "pointer",
          marginTop: "0.5rem",
          opacity: resending ? 0.6 : 1,
        }}
      />

      <button
        type="button"
        className="forgot-link"
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          marginTop: "0.3rem",
          color: "#888",
        }}
      >
        Back
      </button>
    </form>
  );
};

export default OTPVerificationComponent;