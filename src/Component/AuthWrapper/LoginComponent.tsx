import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "./css/auth.css";
import { setCredentials } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../app/hooks";
import { useLoginUserMutation } from "../../features/auth/authApi";
import toast from "react-hot-toast";
interface LoginComponentProps {
  onForgotPassword: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const LoginComponent: React.FC<LoginComponentProps> = ({
  onForgotPassword,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const [login,{isLoading:isLogginIn}] = useLoginUserMutation();



  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    console.log("Login data:", data);
    try{
      const user_type="A";
      const formData = {...data,user_type}
      const res = await toast.promise(login(formData).unwrap(),{
        loading:"Logging in..."
      })
      if (res.success) {
        dispatch(setCredentials({ user: res.userDetails }));
        toast.success(res.message || "Login successful!",{
          icon:"😎",
        });
      }
    }catch(error:any){
      console.log("Failed to login: ", error);
      const errorMessage = error?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

      <h2 className="title">Sign in</h2>

      <div className="input-field">
        <i className="fas fa-user"></i>
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
        />
      </div>
      {errors.email && (
        <span className="error-text">{errors.email.message}</span>
      )}

      <div className="input-field">
        <i className="fas fa-lock"></i>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        <i
          className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
          onClick={togglePasswordVisibility}
          style={{ cursor: "pointer" }}
        ></i>
      </div>
      {errors.password && (
        <span className="error-text">{errors.password.message}</span>
      )}

      <input
        type="submit"
        value={isLogginIn ? "Logging in..." : "Login"}
        className="btn-auth"
        disabled={isLogginIn}
      />

      <button
        type="button"
        className="forgot-link"
        onClick={onForgotPassword}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          marginTop: "0.5rem",
        }}
      >
        Forgot Password?
      </button>
    </form>
  );
};

export default LoginComponent;
