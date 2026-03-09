import { FC, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import {
  FaUserGraduate,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useGetStudentByuserIdQuery } from "../../features/admin/students/studentApi";
import { useAppDispatch } from "../../app/hooks";
import { setPageTitle } from "../../features/ui/uiSlice";

interface InfoFieldProps {
  label: string;
  value: string;
  accent?: boolean;
  icon?: React.ReactNode;
}

const InfoField: FC<InfoFieldProps> = ({
  label,
  value,
  accent = false,
  icon,
}) => (
  <div className="mb-3 pb-2 border-bottom border-light">
    <div className="d-flex align-items-center mb-1">
      {icon && (
        <span className="text-primary me-2" style={{ fontSize: "0.8rem" }}>
          {icon}
        </span>
      )}
      <small
        className="text-muted text-uppercase"
        style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}
      >
        {label}
      </small>
    </div>
    <div
      className={accent ? "fw-semibold text-dark" : "text-secondary"}
      style={{ fontSize: "0.92rem" }}
    >
      {value}
    </div>
  </div>
);

const StudentDashboard: FC = () => {
  const { data, isLoading } = useGetStudentByuserIdQuery();
  const studentData = data?.data[0];
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      setPageTitle({
        title: "",
        subtitle: "",
      }),
    );
  }, [dispatch]);

  return (
    <div className="p-3 p-md-4 bg-light min-vh-100">
      <Card className="border-0 shadow-sm overflow-hidden">
        {/* Hero Section with Gradient */}
        <div className="bg-gradient-primary p-4 p-md-5 pb-0 position-relative">
          <div
            className="position-absolute top-0 end-0 w-50 h-100 opacity-10"
            style={{
              background:
                "radial-gradient(circle at top right, rgba(255,255,255,0.8) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <Row className="align-items-end g-4">
            <Col xs="auto">
              <div className="position-relative">
                <div className="bg-white p-1 rounded-circle shadow-sm">
                  <div
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <FaUserGraduate size={40} className="text-white" />
                  </div>
                </div>
                {/* <div 
                  className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-2 border-white"
                  style={{ width: "14px", height: "14px" }}
                /> */}
              </div>
            </Col>

            <Col>
              <h1 className="display-6 fw-bold mb-2 text-dark">
                {studentData?.firstName} {studentData?.lastName}
              </h1>
              {/* <div className="d-flex flex-wrap gap-2 mb-3">
                <Badge bg="light" text="dark" className="px-3 py-2 rounded-pill">
                  {"Test course"}
                </Badge>
                <Badge bg="light" text="dark" className="px-3 py-2 rounded-pill">
                  {"Test Department"}
                </Badge>
              </div> */}
            </Col>
          </Row>
        </div>

        {/* ID Strip */}
        <Row className="g-0 bg-light border-top border-bottom">
          <Col
            xs={12}
            sm={4}
            className="p-3 text-center text-sm-start border-end-sm"
          >
            <small
              className="text-muted text-uppercase d-block"
              style={{ fontSize: "0.7rem" }}
            >
              Registration No.
            </small>
            <span className="fw-bold text-primary">
              {studentData?.registrationNumber}
            </span>
          </Col>
          <Col xs={12} sm={4} className="p-3 text-center text-sm-start">
            <small
              className="text-muted text-uppercase d-block"
              style={{ fontSize: "0.7rem" }}
            >
              Roll Number
            </small>
            <span className="fw-bold text-primary">
              {studentData?.rollNumber}
            </span>
          </Col>
        </Row>

        {/* Main Content */}
        <Card.Body className="p-4 p-md-5">
          <Row className="g-4 g-md-5">
            {/* Personal Info */}
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <h6
                  className="text-uppercase text-muted mb-0"
                  style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                >
                  Personal Information
                </h6>
                <hr className="flex-grow-1 ms-3 mb-0" />
              </div>

              <InfoField
                label="Full Name"
                value={`${studentData?.firstName} ${studentData?.lastName}`}
                accent
                icon={<FaUserGraduate />}
              />
              <InfoField
                label="Date of Birth"
                value={studentData?.DOB ?? "N/A"}
                icon={<FaCalendarAlt />}
              />
              <InfoField
                label="Email Address"
                value={studentData?.email ?? "N/A"}
                icon={<FaEnvelope />}
              />
              <InfoField
                label="Phone Number"
                value={studentData?.phone ?? "N/A"}
                icon={<FaPhone />}
              />
            </Col>

            {/* Academic Info */}
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <h6
                  className="text-uppercase text-muted mb-0"
                  style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                >
                  Academic Information
                </h6>
                <hr className="flex-grow-1 ms-3 mb-0" />
              </div>

              <InfoField
                label="Program"
                value={studentData?.program?.name ?? "N/A"}
                accent
              />
              <InfoField
                label="Registration No."
                value={studentData?.registrationNumber ?? "N/A"}
              />
              <InfoField
                label="Roll Number"
                value={studentData?.rollNumber ?? "N/A"}
              />
              <InfoField
                label="Current Semester"
                value={`Semester ${studentData?.currentSemester}`}
              />
              <InfoField
                label="Enrollment Date"
                value={studentData?.enrollmentDate??"N/A"}
              />
            </Col>

            {/* Address - Full Width */}
            <Col xs={12}>
              <div className="d-flex align-items-center mb-3">
                <h6
                  className="text-uppercase text-muted mb-0"
                  style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                >
                  Address
                </h6>
                <hr className="flex-grow-1 ms-3 mb-0" />
              </div>

              <InfoField
                label="Street Address"
                value={studentData?.address1 ?? "N/A"}
                icon={<FaMapMarkerAlt />}
              />
            </Col>
          </Row>
        </Card.Body>

        {/* Footer
        <Card.Footer className="bg-light px-4 px-md-5 py-3 d-flex justify-content-between align-items-center">
          <small className="text-muted">Last updated: March 2026</small>
          <span className="text-primary opacity-50">•</span>
          <small className="text-muted">Profile verified ✓</small>
        </Card.Footer> */}
      </Card>

      {/* Custom CSS for gradient */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .bg-gradient-primary {
            background: linear-gradient(135deg, #eff6ff 0%, #f8faff 60%, #f0f9ff 100%);
          }
          .border-end-sm {
            border-right: none;
          }
          @media (min-width: 576px) {
            .border-end-sm {
              border-right: 1px solid #dee2e6 !important;
            }
          }
        `,
        }}
      />
    </div>
  );
};

export default StudentDashboard;
