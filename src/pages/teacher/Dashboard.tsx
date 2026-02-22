import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import StatCards from "./StatsCards";
import AssignedPrograms from "./AssignedPrograms";
import { DashboardStats, Subject } from "./types";

const TeacherDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setStats({
          activeCourses: 12,
          totalStudents: 384,
          activeCoursesTrend: "+2",
          totalStudentsTrend: "+24",
        });

        setSubjects([
          {
            id: "1",
            name: "Data Structures & Algorithms",
            code: "CS-201",
            program: "BSCS",
            semester: "4th",
            studentsCount: 45,
            schedule: "Mon/Wed 09:00-10:30",
          },
          {
            id: "2",
            name: "Linear Algebra",
            code: "MATH-301",
            program: "BS Mathematics",
            semester: "5th",
            studentsCount: 32,
            schedule: "Tue/Thu 11:30-13:00",
          },
        ]);

        setError(null);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Alert variant="danger" className="text-center p-4">
              <Alert.Heading>Error Loading Dashboard</Alert.Heading>
              <p>{error}</p>
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
                className="mt-3"
              >
                Retry
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="py-4 px-lg-4"
      style={{ backgroundColor: "#f4f2ee", minHeight: "100vh" }}
    >
      {/* Stat Cards — always render, skeleton shows until data arrives */}
      <Row className="g-4 mb-4">
        <Col xs={12} sm={6} xl={3}>
          <StatCards
            title="ACTIVE COURSES"
            value={stats?.activeCourses ?? 0}
            trend={stats?.activeCoursesTrend ?? ""}
            variant="primary"
            icon="book"
            loading={loading}
          />
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <StatCards
            title="TOTAL STUDENTS"
            value={stats?.totalStudents ?? 0}
            trend={stats?.totalStudentsTrend ?? ""}
            variant="info"
            icon="people"
            loading={loading}
          />
        </Col>
      </Row>

      {/* Assigned Programs — has its own internal skeleton */}
      <Row>
        <Col xs={12}>
          <AssignedPrograms />
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherDashboard;
