// src/pages/teacher/components/WelcomeSection.tsx
import React from "react";
import { Card } from "react-bootstrap";

interface WelcomeSectionProps {
  teacherName: string;
  date: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  teacherName,
  date,
}) => {
  return (
    <Card
      className="border-0 rounded-4 mb-4 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}
    >
      <Card.Body className="p-4">
        <div className="d-flex align-items-center mb-3">
          <div
            className="rounded-circle bg-white bg-opacity-25 p-3 me-3"
            style={{ width: "60px", height: "60px" }}
          >
            <span className="fs-1 d-flex align-items-center justify-content-center">
              👨‍🏫
            </span>
          </div>
          <div>
            <h1 className="h2 mb-1">Welcome back, {teacherName}!</h1>
            <p className="mb-0 opacity-75">
              Here's what's happening with your courses today.
            </p>
          </div>
        </div>
        <div className="mt-3">
          <span className="badge bg-white bg-opacity-25 text-white py-2 px-3 rounded-pill">
            <i className="bi bi-calendar3 me-2"></i>
            {date}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default WelcomeSection;
