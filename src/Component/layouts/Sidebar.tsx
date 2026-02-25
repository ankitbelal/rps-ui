import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaBookOpen,
  FaChartBar,
  FaCalendarAlt,
  FaCog,
  FaUsers,
  FaChalkboardTeacher,
  FaClipboardList,
  FaBuilding,
  FaBook,
  FaGraduationCap,
  FaSlidersH,
} from "react-icons/fa";
import "./Sidebar.css";

interface SidebarProps {
  role: "superadmin" | "admin" | "teacher" | "student";
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, isOpen = true, onClose }) => {
  // Navigation items based on role
  const getNavItems = () => {
    const commonItems = [
      {
        id: 1,
        label: "Dashboard",
        icon: <FaTachometerAlt />,
        path: "/admin/dashboard",
      },
    ];

    switch (role) {
      case "admin":
      case "superadmin":
        return [
          ...commonItems,
          {
            id: 2,
            label: "Students",
            icon: <FaUserGraduate />,
            path: "/admin/students",
          },
          {
            id: 3,
            label: "Teachers",
            icon: <FaChalkboardTeacher />,
            path: "/admin/teachers",
          },
          {
            id: 4,
            label: "Faculties",
            icon: <FaBuilding />,
            path: "/admin/Faculties",
          },
          {
            id: 5,
            label: "Programs",
            icon: <FaBookOpen />,
            path: "/admin/programs",
          },
          {
            id: 6,
            label: "Subjects",
            icon: <FaBook />,
            path: "/admin/subjects",
          },
          {
            id: 7,
            label: "Evaluation Param",
            icon: <FaSlidersH />,
            path: "/admin/eval-param",
          },
          {
            id: 8,
            label: "Management",
            icon: <FaClipboardList />,
            path: "/admin/management",
          },
          { id: 9, label: "Settings", icon: <FaCog />, path: "/settings" },
          {
            id: 10,
            label: "Attendance",
            icon: <FaClipboardList />,
            path: "/attendance",
          },
          { id: 11, label: "Exams", icon: <FaBookOpen />, path: "/exams" },
        ];

      case "teacher":
        return [
          ...commonItems,
          {
            id: 2,
            label: "My Students",
            icon: <FaUsers />,
            path: "/teacher/students",
          },
          {
            id: 3,
            label: "My Subjects",
            icon: <FaBookOpen />,
            path: "/teacher/subjects",
          },
          { id: 4, label: "Marks Entry", icon: <FaChartBar />, path: "/marks" },
          {
            id: 5,
            label: "Schedule",
            icon: <FaCalendarAlt />,
            path: "/schedule",
          },
          {
            id: 6,
            label: "Reports",
            icon: <FaClipboardList />,
            path: "/reports",
          },
          {
            id: 7,
            label: "Attendance",
            icon: <FaClipboardList />,
            path: "/attendance",
          },
          {
            id: 8,
            label: "Assignments",
            icon: <FaClipboardList />,
            path: "/assignments",
          },
        ];

      case "student":
        return [
          ...commonItems,
          {
            id: 2,
            label: "My Courses",
            icon: <FaBookOpen />,
            path: "/my-courses",
          },
          {
            id: 3,
            label: "Results",
            icon: <FaChartBar />,
            path: "/my-results",
          },
          {
            id: 4,
            label: "Schedule",
            icon: <FaCalendarAlt />,
            path: "/schedule",
          },
          {
            id: 5,
            label: "Profile",
            icon: <FaUserGraduate />,
            path: "/profile",
          },
          {
            id: 6,
            label: "Attendance",
            icon: <FaClipboardList />,
            path: "/attendance",
          },
          {
            id: 7,
            label: "Assignments",
            icon: <FaClipboardList />,
            path: "/assignments",
          },
          { id: 8, label: "Grades", icon: <FaChartBar />, path: "/grades" },
        ];

      default:
        return commonItems;
    }
  };

  const navItems = getNavItems();

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="logo-container">
          <div className="logo">
            <FaGraduationCap size={24} />
          </div>
          <div className="logo-text">Result Portal</div>
        </div>

        {/* Scrollable Menu Container */}
        <div className="nav-menu-container">
          <Nav className="flex-column nav-menu">
            {navItems.map((item) => (
              <Nav.Link
                key={item.id}
                as={Link}
                to={item.path}
                className={`nav-link-custom ${
                  window.location.pathname === item.path ? "active" : ""
                }`}
                data-tooltip={item.label}
                onClick={() => {
                  if (window.innerWidth < 768 && onClose) {
                    onClose();
                  }
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Nav.Link>
            ))}
          </Nav>
        </div>

        {/* Optional Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="text-center small text-white-50">
            {role === "admin" || role == "superadmin"
              ? "Admin Portal"
              : role === "teacher"
                ? "Teacher Portal"
                : "Student Portal"}
          </div>
        </div>
      </div>

      {isOpen && window.innerWidth < 768 && (
        <div className="sidebar-overlay active" onClick={onClose} />
      )}
    </>
  );
};

export default Sidebar;
