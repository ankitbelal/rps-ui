// src/pages/teacher/components/SubjectsList.tsx
import React, { useState } from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";
import { Subject } from "./types";

interface SubjectsListProps {
  subjects: Subject[];
}

const SubjectsList: React.FC<SubjectsListProps> = ({ subjects }) => {
  const [activeFilter, setActiveFilter] = useState("All Subjects");

  // Get unique programs for filters
  const programs = ["All Subjects", ...new Set(subjects.map((s) => s.program))];

  const filteredSubjects =
    activeFilter === "All Subjects"
      ? subjects
      : subjects.filter((s) => s.program === activeFilter);

  const handleSubjectClick = (subject: Subject) => {
    console.log("Navigating to subject:", subject);
    // In real app: navigate to subject details
    alert(`Navigating to ${subject.name} details page`);
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="m-0">
          <i className="bi bi-book text-primary me-2"></i>
          My Assigned Subjects
        </h4>
        <a
          href="#"
          className="text-decoration-none"
          onClick={(e) => e.preventDefault()}
        >
          View Full Schedule <i className="bi bi-arrow-right ms-1"></i>
        </a>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {programs.map((program) => (
          <button
            key={program}
            className={`btn btn-sm rounded-pill px-3 ${
              activeFilter === program
                ? "btn-primary"
                : "btn-outline-secondary bg-white"
            }`}
            onClick={() => setActiveFilter(program)}
          >
            {program}
          </button>
        ))}
      </div>

      {/* Subjects List */}
      <Row className="g-3">
        {filteredSubjects.map((subject) => (
          <Col xs={12} key={subject.id}>
            <Card
              className="border-0 shadow-sm rounded-4 overflow-hidden"
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
              onClick={() => handleSubjectClick(subject)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateX(5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateX(0)")
              }
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-primary bg-opacity-10 rounded-3 p-3">
                    <i className="bi bi-book fs-3 text-primary"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-semibold mb-0">{subject.name}</h5>
                      <Badge bg="primary" pill className="px-3 py-2">
                        {subject.code}
                      </Badge>
                    </div>
                    <div className="d-flex flex-wrap gap-4">
                      <small className="text-secondary">
                        <i className="bi bi-mortarboard text-primary me-1"></i>
                        <strong>Program:</strong> {subject.program}
                      </small>
                      <small className="text-secondary">
                        <i className="bi bi-layers text-primary me-1"></i>
                        <strong>Semester:</strong> {subject.semester}
                      </small>
                      <small className="text-secondary">
                        <i className="bi bi-people text-primary me-1"></i>
                        <strong>Students:</strong> {subject.studentsCount}
                      </small>
                      <small className="text-secondary">
                        <i className="bi bi-calendar-week text-primary me-1"></i>
                        <strong>Schedule:</strong> {subject.schedule}
                      </small>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SubjectsList;
