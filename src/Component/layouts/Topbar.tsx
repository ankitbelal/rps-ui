import React from "react";
import { Navbar, Nav, Dropdown, Badge, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

interface TopbarProps {
  onToggleSidebar: () => void;
  onLogout: () => void;
  user: { name: string; email: string; role: string };
}

const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar, onLogout, user }) => {
  const navigate = useNavigate();
  const { title, subtitle } = useAppSelector((state) => state.ui);

  // Format role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "teacher":
        return "Teacher";
      case "student":
        return "Student";
      default:
        return "User";
    }
  };

  // Get dashboard title based on user role
  const getDashboardTitle = (role: string) => {
    switch (role) {
      case "admin":
        return "Result Management Dashboard";
      case "teacher":
        return "Teacher Dashboard";
      case "student":
        return "Student Dashboard";
      default:
        return "Dashboard";
    }
  };

  // Get dashboard subtitle based on user role
  const getDashboardSubtitle = (role: string) => {
    switch (role) {
      case "admin":
        return "Here's an overview of your LMS performance";
      case "teacher":
        return "Manage your courses and students";
      case "student":
        return "Track your progress and results";
      default:
        return "Welcome to your dashboard";
    }
  };

  const displayTitle = title || getDashboardTitle(user.role);
  const displaySubtitle =
    subtitle ||
    `Welcome back, ${user.name}. ${getDashboardSubtitle(user.role)}`;

  // Get current date for teacher view
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Teacher-specific welcome section in navbar with gradient background
  const renderTeacherWelcome = () => (
    <div className="d-flex align-items-center">
      <button
        className="btn btn-link text-white p-0 me-3"
        onClick={onToggleSidebar}
        title="Toggle Sidebar"
        style={{
          width: "24px",
          height: "24px",
          border: "none",
          background: "none",
        }}
      >
        <i
          className="fas fa-bars"
          style={{ fontSize: "20px", color: "white" }}
        ></i>
      </button>
      <div className="d-flex align-items-center">
        <div
          className="rounded-circle bg-white p-2 me-3 d-flex align-items-center justify-content-center"
          style={{
            width: "48px",
            height: "48px",
            background: "white",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          <span className="fs-3">👨‍🏫</span>
        </div>
        <div className="d-flex flex-column">
          <h1
            className="fw-bold mb-0 text-white"
            style={{ fontSize: "24px", lineHeight: "1.2" }}
          >
            Welcome back, {user.name}!
          </h1>
          <div className="d-flex align-items-center">
            <span
              className="badge bg-white text-primary py-1 px-2 rounded-pill me-2 fw-semibold"
              style={{ fontSize: "12px" }}
            >
              <i className="bi bi-calendar3 me-1"></i>
              {getCurrentDate()}
            </span>
            <p
              className="text-white mb-0 d-none d-md-block"
              style={{ fontSize: "14px", opacity: 0.9 }}
            >
              Here's what's happening with your courses today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Regular welcome section for other roles (white background)
  const renderRegularWelcome = () => (
    <div className="d-flex align-items-center">
      <button
        className="btn btn-link text-dark p-0 me-3"
        onClick={onToggleSidebar}
        title="Toggle Sidebar"
        style={{
          width: "24px",
          height: "24px",
          border: "none",
          background: "none",
        }}
      >
        <i className="fas fa-bars" style={{ fontSize: "20px" }}></i>
      </button>
      <div className="d-flex flex-column justify-content-center">
        <h1
          className="fw-bold mb-1 text-dark"
          style={{ fontSize: "28px", lineHeight: "1.2" }}
        >
          {displayTitle}
        </h1>
        <p
          className="text-muted mb-0 d-none d-md-block"
          style={{ fontSize: "16px", lineHeight: "1.2" }}
        >
          {displaySubtitle}
        </p>
      </div>
    </div>
  );

  return (
    <Navbar
      className={`shadow-sm border-bottom position-sticky top-0 ${
        user.role === "teacher" ? "border-0" : "bg-white"
      }`}
      style={{
        zIndex: 1020,
        height: "80px",
        minHeight: "80px",
        background:
          user.role === "teacher"
            ? "linear-gradient(90deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"
            : "white",
      }}
    >
      <Container fluid className="px-4 h-100">
        <div className="d-flex align-items-center justify-content-between w-100 h-100">
          {/* Left Side - Toggle Button and Welcome Section */}
          {user.role === "teacher"
            ? renderTeacherWelcome()
            : renderRegularWelcome()}

          {/* Right Side - User Info and Notifications */}
          <Nav className="align-items-center">
            {/* Notification Bell */}
            {/* <div className="position-relative me-3">
              <button
                className={`btn p-2 rounded-circle border-0 ${
                  user.role === "teacher" ? "bg-white" : "btn-light"
                }`}
                title="Show Notifications"
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    user.role === "teacher"
                      ? "0 2px 8px rgba(0,0,0,0.15)"
                      : "none",
                  transition: "all 0.3s ease",
                }}
              >
                <i
                  className={`fas fa-bell ${
                    user.role === "teacher" ? "text-primary" : "text-dark"
                  }`}
                  style={{ fontSize: "18px" }}
                ></i>
              </button>
              <Badge
                pill
                bg="danger"
                className="position-absolute"
                style={{
                  fontSize: "0.65rem",
                  padding: "0.25em 0.5em",
                  minWidth: "18px",
                  top: "0",
                  right: "0",
                  transform: "translate(25%, -25%)",
                  border: "2px solid white",
                }}
              >
                3
              </Badge>
            </div> */}

            {/* User Dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle
                id="user-dropdown"
                className={`d-flex align-items-center px-2 py-1 border-0 ${
                  user.role === "teacher" ? "bg-white" : ""
                }`}
                style={{
                  minHeight: "40px",
                  backgroundColor:
                    user.role === "teacher" ? "white" : "transparent",
                  borderRadius: "40px",
                  transition: "all 0.3s ease",
                  boxShadow:
                    user.role === "teacher"
                      ? "0 4px 12px rgba(0,0,0,0.15)"
                      : "none",
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center me-2 rounded-circle text-white fw-bold"
                  style={{
                    width: "36px",
                    height: "36px",
                    background:
                      user.role === "teacher"
                        ? "linear-gradient(135deg, #4158D0, #C850C0)"
                        : "linear-gradient(135deg, #4a6fa5, #166088)",
                    fontSize: "16px",
                    fontWeight: "600",
                    flexShrink: 0,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-start d-none d-lg-block">
                  <div
                    className={`fw-bold ${
                      user.role === "teacher" ? "text-dark" : "text-dark"
                    }`}
                    style={{ fontSize: "14px", lineHeight: "1.3" }}
                  >
                    {user.name}
                  </div>
                  <div
                    className={`${
                      user.role === "teacher" ? "text-secondary" : "text-muted"
                    }`}
                    style={{ fontSize: "12px", lineHeight: "1.3" }}
                  >
                    {getRoleDisplayName(user.role)}
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="shadow border-0"
                style={{
                  minWidth: "280px",
                  borderRadius: "12px",
                  marginTop: "8px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              >
                <Dropdown.Header className="text-muted small py-3 px-3 bg-light bg-opacity-50">
                  Signed in as
                  <br />
                  <span className="fw-bold text-dark">{user.email}</span>
                </Dropdown.Header>
                <Dropdown.Divider className="my-1" />
                <Dropdown.Item className="d-flex align-items-center py-2 px-3">
                  <i
                    className="fas fa-user me-3 text-primary"
                    style={{ width: "20px" }}
                  ></i>
                  <div>
                    <div className="fw-semibold">Profile</div>
                    <small className="text-muted">View your profile</small>
                  </div>
                </Dropdown.Item>

                {/* Show Administration only for admin role */}
                {user.role === "superadmin" && (
                  <Dropdown.Item
                    className="d-flex align-items-center py-2 px-3"
                    onClick={() => navigate("/admin/administration")}
                  >
                    <i
                      className="fas fa-user-gear me-3 text-warning"
                      style={{ width: "20px" }}
                    ></i>
                    <div>
                      <div className="fw-semibold">Administration</div>
                      <small className="text-muted">Manage your admins</small>
                    </div>
                  </Dropdown.Item>
                )}

                <Dropdown.Divider className="my-1" />
                <Dropdown.Item
                  onClick={onLogout}
                  className="d-flex align-items-center py-2 px-3 text-danger"
                >
                  <i
                    className="fas fa-sign-out-alt me-3"
                    style={{ width: "20px" }}
                  ></i>
                  <div>
                    <div className="fw-semibold">Logout</div>
                    <small>Sign out from system</small>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>

      {/* Add custom CSS for dropdown arrow */}
      <style>
        {`
          .dropdown-toggle::after {
            color: ${user.role === "teacher" ? "#6c757d" : "#6c757d"};
            opacity: 1;
            margin-left: 8px;
          }
          
          .btn-check:checked+.btn, .btn.active, .btn.show, .btn:first-child:active, :not(.btn-check)+.btn:active {
            background-color: ${user.role === "teacher" ? "white" : "transparent"};
            border-color: transparent;
          }
          
          .dropdown-toggle:focus {
            box-shadow: none !important;
          }
        `}
      </style>
    </Navbar>
  );
};

export default Topbar;
