// src/layouts/DashboardLayout.tsx
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { clearCredentials } from "../features/auth/authSlice";
import Sidebar from "../Component/layouts/Sidebar";
import Topbar from "../Component/layouts/Topbar";
import { getRoleByType } from "../helper";
import { useLogoutMutation } from "../features/auth/authApi";
import toast from "react-hot-toast";
import './DashboardLayout.css';
interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Initialize based on current screen size
    return typeof window !== 'undefined' ? window.innerWidth >= 992 : true;
  });
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 992 : false;
  });
  
  // Use ref to track previous width to avoid stale closures
  const previousWidthRef = useRef<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  // Handle resize with proper width tracking
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const currentWidth = window.innerWidth;
        const prevWidth = previousWidthRef.current;
        
        const wasMobile = prevWidth < 992;
        const isMobileNow = currentWidth < 992;
        
        // Update mobile state
        setIsMobile(isMobileNow);
        
        // Only auto-close when crossing FROM desktop TO mobile
        if (!wasMobile && isMobileNow) {
          setSidebarOpen(false);
        }
        // Never auto-open - user must manually open
        
        // Update the ref for next comparison
        previousWidthRef.current = currentWidth;
      }, 15);
    };

    // Initialize
    previousWidthRef.current = window.innerWidth;

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await toast.promise(logout(user?.email).unwrap(),{
        loading:"Logging out.."
      });
      if (res?.statusCode == 200) {
        toast.success(res?.data?.message || "Logged out Successfully");
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Something went wrong.";
      toast.error(errorMessage);
    } finally {
      dispatch(clearCredentials());
      window.location.href = "/";
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user) {
    return null;
  }

  const userRole = getRoleByType(user.UserType) as
    | "admin"
    | "teacher"
    | "student";

  // Calculate margin based on screen size and sidebar state
  const getMarginLeft = () => {
    if (isMobile) {
      return "0";
    }
    return sidebarOpen ? "250px" : "70px";
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Sidebar
        role={userRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div 
        className="flex-grow-1 d-flex flex-column position-relative" 
        style={{ 
          marginLeft: getMarginLeft(),
          transition: "margin-left 0.3s ease",
          width: "100%",
          minHeight: "100vh"
        }}
      >
        <Topbar
          user={{
            name: user.name || "User",
            email: user.email || "",
            role: userRole,
          }}
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
        />
        
        <main 
          className="flex-grow-1 p-3 p-md-4 overflow-auto" 
          style={{ 
            backgroundColor: "#f8f9fa",
            minHeight: "calc(100vh - 80px)"
          }}
        >
          {children}
        </main>
      </div>

      {/* Mobile overlay - only show on small screens when sidebar is open */}
      {sidebarOpen && isMobile && (
        <div
          className="sidebar-overlay active"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;