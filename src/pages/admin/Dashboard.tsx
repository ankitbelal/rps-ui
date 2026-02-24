import React, { useState, useEffect } from "react";
import { Row, Col, Card, Tooltip, OverlayTrigger } from "react-bootstrap";
import {
  FaUsers,
  FaBook,
  FaChalkboardTeacher,
  FaUniversity,
} from "react-icons/fa";
import PerformanceChart from "./PerformanceChart";
import StudentDistributionChart from "./StudentDistributionChart";
import RecentActivity from "./RecentActivity";
import "./Dashboard.css";
import { useGetStatisticsQuery } from "../../features/admin/dashboard/dahboardApi";
import { useAppDispatch } from "../../app/hooks";
import { clearPageTitle } from "../../features/ui/uiSlice";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import StudentLeaderboard from "./StudentLeaderBoard";

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear page title to show default welcome message in Topbar
    dispatch(clearPageTitle());
  }, [dispatch]);

  const [performanceData] = useState([
    { course: "Mathematics", score: 85 },
    { course: "Science", score: 78 },
    { course: "English", score: 92 },
    { course: "History", score: 75 },
    { course: "Computer Science", score: 88 },
    { course: "Physics", score: 80 },
  ]);

  const [distributionData, setDistributionData] = useState<
    { program: string; students: number; color: string }[]
  >([]);

  const generateColor = (index: number) => {
    const hue = (index * 137.508) % 360; // golden angle
    return `hsl(${hue}, 65%, 55%)`;
  };

  const {
    data: statisticsData,
    isLoading,
    isFetching,
  } = useGetStatisticsQuery(undefined, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (!statisticsData?.data?.studentsDistributions) return;

    const mappedData = Object.entries(
      statisticsData.data.studentsDistributions,
    ).map(([program, students], index) => ({
      program,
      students,
      color: generateColor(index + 1),
    }));

    setDistributionData(mappedData);
  }, [statisticsData]);

  const stats = [
    {
      title: "Total Students",
      value: statisticsData?.data.students.total || 0,
      icon: <FaUsers />,
      color: "primary",
      id: "totalStudents",
      route: "/admin/students",
    },
    {
      title: "Total Programs",
      value: statisticsData?.data.programs || 0,
      icon: <FaBook />,
      color: "success",
      id: "totalPrograms",
      route: "/admin/programs",
    },
    {
      title: "Total Teachers",
      value: statisticsData?.data.teachers || 0,
      icon: <FaChalkboardTeacher />,
      color: "info",
      id: "totalTeachers",
      route: "/admin/teachers",
    },
    {
      title: "Total Faculties",
      value: statisticsData?.data.faculties || 0,
      icon: <FaUniversity />,
      color: "warning",
      id: "totalFaculties",
      route: "/admin/faculties",
    },
  ];

  const [activities] = useState([
    {
      id: 1,
      title: "Results published for Mathematics 101",
      description: "Results for the final exam have been published",
      time: "2 hours ago",
      icon: "check",
      type: "success" as const,
    },
    {
      id: 2,
      title: "3 results pending review",
      description: "Require attention from the examination committee",
      time: "5 hours ago",
      icon: "exclamation",
      type: "warning" as const,
    },
    {
      id: 3,
      title: "15 new students enrolled",
      description: "New batch of students added to the system",
      time: "1 day ago",
      icon: "user-plus",
      type: "info" as const,
    },
    {
      id: 4,
      title: "Performance report generated",
      description: "Monthly performance report is ready for download",
      time: "2 days ago",
      icon: "chart-line",
      type: "success" as const,
    },
  ]);

  return (
    /* Main Dashboard Content - No header here */
    <div className="dashboard-content">
      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        {stats.map((stat, index) => (
          <Col xs={12} sm={6} lg={3} key={index}>
            <Card className="border-0 shadow-sm stat-card">
              {isLoading || isFetching ? (
                <Card.Body>
                  <div className="d-flex align-items-center">
                    {/* Skeleton for icon */}
                    <Skeleton circle width={56} height={56} className="me-3" />
                    <div className="stat-info flex-grow-1">
                      {/* Skeleton for value */}
                      <Skeleton width={70} height={28} className="mb-2" />
                      {/* Skeleton for title */}
                      <Skeleton width="50%" height={20} />
                    </div>
                  </div>
                </Card.Body>
              ) : (
                <Card.Body>
                  <div className="d-flex align-items-center">
                    {/* Clickable icon with tooltip */}
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-${stat.id}`}>
                          Go to {stat.title}
                        </Tooltip>
                      }
                    >
                      <div
                        className={`stat-icon ${stat.color}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(stat.route)}
                      >
                        {stat.icon}
                      </div>
                    </OverlayTrigger>

                    {/* Stat text */}
                    <div className="stat-info ms-3">
                      <h4 className="fw-bold mb-1">
                        {stat.value.toLocaleString()}
                      </h4>
                      <p className="text-muted mb-0">{stat.title}</p>
                    </div>
                  </div>
                </Card.Body>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3 mb-4">
        {/* Distribution chart — left half */}
        <Col lg={6} className="mb-4 mb-lg-0">
          <StudentDistributionChart
            data={distributionData}
            Loading={isLoading}
          />
        </Col>

        {/* Leaderboard — right half */}
        <Col lg={6} className="mb-4 mb-lg-0">
          <StudentLeaderboard />
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col lg={12}>
          <Card className="border-0 shadow-sm activity-card">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Recent Activity</h5>
            </Card.Header>
            <Card.Body>
              <RecentActivity activities={activities} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
