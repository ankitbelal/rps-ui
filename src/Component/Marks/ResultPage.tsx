import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import CommonBreadCrumb from "../common/BreadCrumb";
import { FaPencilAlt, FaTachometerAlt, FaUserGraduate } from "react-icons/fa";
import toast from "react-hot-toast";

import { useLocation, useNavigate } from "react-router-dom";
import { Student } from "../../features/admin/students/utils";
import StudentResultTimeline from "../../pages/admin/StudentManagement/partials/StudentResultTimeline";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { setPageTitle } from "../../features/ui/uiSlice";
import { getRoleByType } from "../../helper";
import { useGetStudentByIdQuery } from "../../features/admin/students/studentApi";

const StudentResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const studentId = location.state?.id;

  useEffect(() => {
    if (!studentId) {
      toast.error("No student selected");
      navigate(-1);
    }
  }, [studentId, navigate]);

  const {
    data: studentDataResp,
    isLoading,
    isFetching,
  } = useGetStudentByIdQuery(studentId, {
    skip: !studentId,
  });

  const studentData = studentDataResp?.data?.[0] as Student | undefined;

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    dispatch(
      setPageTitle({
        title: "Result Management",
        subtitle: "Manage student result and Marks",
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setUserRole(getRoleByType(user.UserType));
    }
  }, [user]);

  if (!studentId) {
    return null;
  }

  if (isLoading || isFetching) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="text-center py-5">
        <div className="text-muted">
          <FaUserGraduate size={48} />
          <p className="mb-2 mt-3">Student not found</p>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <CommonBreadCrumb
            items={[
              {
                label: "Dashboard",
                link: `${userRole === "admin" || userRole == "superadmin" ? "/admin" : "/teacher"}/dashboard`,
                icon: <FaTachometerAlt />,
              },
              {
                label: "Student Management",
                link: `${userRole === "admin" || userRole === "superadmin" ? "/admin" : "/teacher"}/students`,
                icon: <FaUserGraduate />,
              },
              {
                label: "Result Timeline",
                active: true,
              },
            ]}
          />
        </div>
        {/* Student Information Card with Toggle */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <Row>
              <Col md={8}>
                <h5 className="mb-3 fw-semibold">Student Information</h5>
                <Row>
                  <Col md={3} className="mb-3 mb-md-0">
                    <div>
                      <small className="text-muted d-block mb-1">
                        Student Name
                      </small>
                      <strong>{`${studentData.firstName} ${studentData.lastName}`}</strong>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3 mb-md-0">
                    <div>
                      <small className="text-muted d-block mb-1">
                        Roll Number
                      </small>
                      <strong>{studentData.rollNumber}</strong>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3 mb-md-0">
                    <div>
                      <small className="text-muted d-block mb-1">
                        Current Semester
                      </small>
                      <strong>{studentData.currentSemester}</strong>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div>
                      <small className="text-muted d-block mb-1">
                        Registration Number
                      </small>
                      <strong>{studentData.registrationNumber}</strong>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col
                md={4}
                className="d-flex align-items-center justify-content-md-end mt-3 mt-md-0"
              >
                <Button
                  id="result timeline"
                  variant="success"
                  value="timeline"
                  className="d-flex align-items-center gap-2"
                  onClick={() =>
                    navigate("/admin/students/marks-entry", {
                      state: { id: studentData.id, item: studentData },
                    })
                  }
                >
                  <FaPencilAlt size={16} />
                  <span>Marks Entry</span>
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <StudentResultTimeline
          studentId={studentData.id}
          currentSemester={studentData.currentSemester}
        />
      </div>
    </>
  );
};

export default StudentResult;
