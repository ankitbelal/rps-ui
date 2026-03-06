import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import NotFound from "../Component/NotFound";
import AuthFlow from "../Component/AuthWrapper/AuthFlow";
import AdminDashboard from "../pages/admin/Dashboard/Dashboard";
import StudentManagement from "../pages/admin/StudentManagement/StudentManagement";
import TeacherManagement from "../pages/admin/TeacherManagement/TeacherManagement";
import MarksEntry from "../pages/teacher/MarksEntry";
import StudentResults from "../pages/student/Results";
import { getRoleByType } from "../helper";
import DashboardLayout from "../layouts/DashboardLayout";
import TeacherDashboard from "../pages/teacher/Dashboard";
import ProgramManagement from "../pages/admin/Program management/Programs";
import FacultyManagement from "../pages/admin/Faculty/FacultyManagement";
import SubjectManagement from "../pages/admin/SubjectManagement/Subject";
import AdminManagement from "../pages/admin/Administration/AdminManagement";
import MarksEntryPage from "../Component/Marks/MarksEntryPage";
import Parameter from "../pages/admin/EvaluationParameter/Parameter";
import ProfilePage from "../Component/common/ProfilePage";
import TabbedComponent from "../pages/admin/Management/TabbedComponent";
import { RootState } from "../app/store";
import StudentResult from "../Component/Marks/ResultPage";
import ResultListing from "../pages/admin/StudentManagement/ResultManagement/ResultListing";
const AppRouter = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);

  const isAuthenticated = !!user;
  const currentRole = getRoleByType(user?.UserType);

  const ProtectedRoute: React.FC<{
    children: React.ReactNode;
    requiredRole?: string | string[];
  }> = ({ children, requiredRole }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    if (requiredRole) {
      const allowed = Array.isArray(requiredRole)
        ? requiredRole.includes(currentRole)
        : currentRole === requiredRole;

      if (!allowed) {
        return (
          <Navigate
            to={`/${currentRole == "superadmin" ? "admin" : currentRole}/dashboard`}
            replace
          />
        );
      }
    }
    return <>{children}</>;
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <AuthFlow />
            ) : (
              <Navigate
                to={`/${currentRole == "superadmin" ? "admin" : currentRole}/dashboard`}
                replace
              />
            )
          }
        />
        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole={["admin", "superadmin"]}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/administration"
          element={
            <ProtectedRoute requiredRole={["admin", "superadmin"]}>
              <DashboardLayout>
                <AdminManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/eval-param"
          element={
            <ProtectedRoute requiredRole={["admin", "superadmin"]}>
              <DashboardLayout>
                <Parameter />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute requiredRole={["admin", "superadmin"]}>
              <DashboardLayout>
                <StudentManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/result"
          element={
            <ProtectedRoute requiredRole={["admin", "superadmin"]}>
              <DashboardLayout>
                <ResultListing />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/teachers"
          element={
            <ProtectedRoute requiredRole={["admin", "superadmin"]}>
              <DashboardLayout>
                <TeacherManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/programs"
          element={
            <ProtectedRoute requiredRole={["admin", "superadmin"]}>
              <DashboardLayout>
                <ProgramManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/faculties"
          element={
            <ProtectedRoute requiredRole={["admin", "superadmin"]}>
              <DashboardLayout>
                <FacultyManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/management"
          element={
            <ProtectedRoute requiredRole={["admin", "superadmin"]}>
              <DashboardLayout>
                <TabbedComponent />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute requiredRole={["admin", "superadmin"]}>
              <DashboardLayout>
                <SubjectManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* 🔥 Dual role example (admin + teacher allowed) */}
        <Route
          path="/admin/students/marks-entry"
          element={
            <ProtectedRoute requiredRole={["admin", "teacher", "superadmin"]}>
              <DashboardLayout>
                <MarksEntryPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students/result"
          element={
            <ProtectedRoute requiredRole={["admin", "teacher", "superadmin"]}>
              <DashboardLayout>
                <StudentResult />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Teacher routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute requiredRole="teacher">
              <DashboardLayout>
                <TeacherDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/subjects"
          element={
            <ProtectedRoute requiredRole="teacher">
              <DashboardLayout>
                <SubjectManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/marks"
          element={
            <ProtectedRoute requiredRole="teacher">
              <DashboardLayout>
                <MarksEntry />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/students"
          element={
            <ProtectedRoute requiredRole="teacher">
              <DashboardLayout>
                <StudentManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Student routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <DashboardLayout>
                <div>Comin soon</div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/students/results"
          element={
            <ProtectedRoute requiredRole="student">
              <DashboardLayout>
                <StudentResults />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              requiredRole={["teacher", "student", "admin", "superadmin"]}
            >
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
