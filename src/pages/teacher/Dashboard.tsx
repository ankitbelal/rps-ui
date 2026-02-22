import React from "react";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import StatCards from "./StatsCards";
import AssignedPrograms from "./AssignedPrograms";
import { useGetDashboardDataQuery } from "../../features/teacher/dashobard/dashboardApi";
import toast from "react-hot-toast";

const TeacherDashboard: React.FC = () => {
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetDashboardDataQuery();

  const stats = response?.data;

  if (isError) {
    toast.error("Something went wrong");
    // return (
    //   <Container className="py-5">
    //     <Row className="justify-content-center">
    //       <Col md={6}>
    //         <Alert variant="danger" className="text-center p-4">
    //           <Alert.Heading>Error Loading Dashboard</Alert.Heading>
    //           <p>Failed to load dashboard data. Please try again.</p>
    //           <Button variant="primary" onClick={refetch} className="mt-3">
    //             Retry
    //           </Button>
    //         </Alert>
    //       </Col>
    //     </Row>
    //   </Container>
    // );
  }

  // derive program count from assignedPrograms array length
  const programCount = stats?.assignedPrograms?.length ?? 0;

  return (
    <Container
      fluid
      className="py-4 px-lg-4"
      style={{ backgroundColor: "#f4f2ee", minHeight: "100vh" }}
    >
      {/* Stat Cards */}
      <Row className="g-4 mb-4">
        <Col xs={12} sm={6} xl={3}>
          <StatCards
            title="PROGRAMS"
            value={programCount}
            trend={`${programCount} active`}
            variant="info"
            icon="program"
            loading={isLoading}
          />
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <StatCards
            title="Total Students"
            value={stats?.students ?? 0}
            trend={`${stats?.students ?? 0} assigned`}
            variant="primary"
            icon="people"
            loading={isLoading}
          />
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <StatCards
            title="ACTIVE SUBJECTS"
            value={stats?.subjects ?? 0}
            trend={`${stats?.subjects ?? 0} assigned`}
            variant="primary"
            icon="book"
            loading={isLoading}
          />
        </Col>
      </Row>

      {/* Assigned Programs */}
      <Row>
        <Col xs={12}>
          <AssignedPrograms
            data={stats?.assignedPrograms}
            loading={isLoading}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherDashboard;
