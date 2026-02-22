// src/pages/teacher/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import WelcomeSection from "./WelcomeSection";
import StatCards from "./StatsCards";
import SubjectsList from "./SubjectList";
import { Subject, DashboardStats } from "./types";
import AssignedPrograms from "./AssignedPrograms";

const TeacherDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Mock data fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock data
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
          {
            id: "3",
            name: "Database Systems",
            code: "CS-301",
            program: "BSCS",
            semester: "5th",
            studentsCount: 38,
            schedule: "Mon/Wed 14:00-15:30",
          },
          {
            id: "4",
            name: "Computer Architecture",
            code: "CS-202",
            program: "BSCS",
            semester: "4th",
            studentsCount: 42,
            schedule: "Tue/Thu 09:00-10:30",
          },
          {
            id: "5",
            name: "Probability & Statistics",
            code: "STAT-201",
            program: "BS Statistics",
            semester: "3rd",
            studentsCount: 28,
            schedule: "Wed/Fri 13:00-14:30",
          },
          {
            id: "6",
            name: "Quantum Physics",
            code: "PHY-401",
            program: "BS Physics",
            semester: "7th",
            studentsCount: 18,
            schedule: "Mon/Thu 15:00-16:30",
          },
        ]);

        setError(null);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Error fetching dashboard data:", err);
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
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      {/* Stats Cards */}
      {stats && (
        <Row className="g-4 mb-4">
          <Col xs={12} sm={6} xl={3}>
            <StatCards
              title="ACTIVE COURSES"
              value={stats.activeCourses}
              trend={stats.activeCoursesTrend}
              variant="primary"
              icon="book"
            />
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <StatCards
              title="TOTAL STUDENTS"
              value={stats.totalStudents}
              trend={stats.totalStudentsTrend}
              variant="info"
              icon="people"
            />
          </Col>
        </Row>
      )}

      {/* Subjects List */}
      {/* <SubjectsList subjects={subjects} /> */}
      <AssignedPrograms/>
    </Container>
  );
};

export default TeacherDashboard;
