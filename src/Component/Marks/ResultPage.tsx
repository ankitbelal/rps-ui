import React, { useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import CommonBreadCrumb from "../common/BreadCrumb";
import { FaPencilAlt, FaTachometerAlt, FaUserGraduate } from "react-icons/fa";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import StudentResultTimeline from "../../pages/admin/StudentManagement/partials/StudentResultTimeline";
import { Student } from "../../features/admin/students/utils";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { setPageTitle } from "../../features/ui/uiSlice";

import { getRoleByType } from "../../helper";

import {
  useGetStudentByIdQuery,
  useGetStudentByuserIdQuery,
} from "../../features/admin/students/studentApi";

const StudentResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state: RootState) => state.auth);

  const userRole = user ? getRoleByType(user.UserType) : "";

  const studentId = location.state?.id;

  useEffect(() => {
    dispatch(
      setPageTitle({
        title: "Result Management",
        subtitle: "Manage student result and Marks",
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (userRole !== "student" && !studentId) {
      toast.error("No student selected");
      navigate(-1);
    }
  }, [studentId, userRole, navigate]);

  const {
    data: studentByIdResp,
    isLoading: isByIdLoading,
    isFetching: isByIdFetching,
  } = useGetStudentByIdQuery(studentId, {
    skip: !studentId || userRole === "student",
  });

  const {
    data: selfStudentResp,
    isLoading: isSelfLoading,
    isFetching: isSelfFetching,
  } = useGetStudentByuserIdQuery(undefined, {
    skip: userRole !== "student",
  });

  const studentData =
    userRole === "student"
      ? (selfStudentResp?.data[0] as Student | undefined)
      : (studentByIdResp?.data?.[0] as Student | undefined);

  const isLoading = isByIdLoading || isSelfLoading;
  const isFetching = isByIdFetching || isSelfFetching;

  if (userRole !== "student" && !studentId) return null;

  if (isLoading || isFetching) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
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
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <CommonBreadCrumb
          items={[
            {
              label: "Dashboard",
              link: `${
                userRole === "admin" || userRole === "superadmin"
                  ? "/admin"
                  : "/teacher"
              }/dashboard`,
              icon: <FaTachometerAlt />,
            },
            {
              label: "Student Management",
              link: `${
                userRole === "admin" || userRole === "superadmin"
                  ? "/admin"
                  : "/teacher"
              }/students`,
              icon: <FaUserGraduate />,
            },
            {
              label: "Result Timeline",
              active: true,
            },
          ]}
        />
      </div>

      {/* Student Info */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <Row>
            <Col md={8}>
              <h5 className="mb-3 fw-semibold">Student Information</h5>

              <Row>
                <Col md={3}>
                  <small className="text-muted d-block mb-1">
                    Student Name
                  </small>
                  <strong>
                    {studentData.firstName} {studentData.lastName}
                  </strong>
                </Col>

                <Col md={3}>
                  <small className="text-muted d-block mb-1">Roll Number</small>
                  <strong>{studentData.rollNumber}</strong>
                </Col>

                <Col md={3}>
                  <small className="text-muted d-block mb-1">
                    Current Semester
                  </small>
                  <strong>{studentData.currentSemester}</strong>
                </Col>

                <Col md={3}>
                  <small className="text-muted d-block mb-1">
                    Registration Number
                  </small>
                  <strong>{studentData.registrationNumber}</strong>
                </Col>
              </Row>
            </Col>
          {userRole !=="student" && (
            <Col className="d-flex align-items-center justify-content-md-end mt-3 mt-md-0">
              <Button
                variant="success"
                className="d-flex align-items-center gap-2"
                onClick={() =>
                  navigate("/admin/students/marks-entry", {
                    state: { id: studentData.id, item: studentData },
                  })
                }
              >
                <FaPencilAlt size={16} />
                Marks Entry
              </Button>
            </Col>
          )}
          </Row>
        </Card.Body>
      </Card>

      {/* Timeline */}
      <StudentResultTimeline
        studentId={studentData.id}
        currentSemester={studentData.currentSemester}
      />
    </div>
  );
};

export default StudentResult;
