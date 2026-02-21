// src/pages/teacher/components/StatCards.tsx
import React from "react";
import { Card } from "react-bootstrap";

interface StatCardsProps {
  title: string;
  value: number;
  trend: string;
  variant: "primary" | "info";
  icon: "book" | "people";
}

const StatCards: React.FC<StatCardsProps> = ({
  title,
  value,
  trend,
  variant,
  icon,
}) => {
  const iconMap = {
    book: "📚",
    people: "👨‍🎓",
  };

  return (
    <Card
      className={`border-0 rounded-4 shadow-sm h-100`}
      style={{ transition: "transform 0.2s" }}
    >
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className={`display-6 mb-3 text-${variant}`}>
              {iconMap[icon]}
            </div>
            <h2 className="fw-bold mb-1">{value}</h2>
            <p className="text-muted small text-uppercase mb-0">{title}</p>
          </div>
          <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
            <i className="bi bi-arrow-up me-1"></i>
            {trend}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCards;
