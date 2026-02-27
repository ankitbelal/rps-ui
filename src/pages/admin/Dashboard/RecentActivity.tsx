import React from "react";
import {
  FaCheck,
  FaExclamation,
  FaUserPlus,
  FaChartLine,
} from "react-icons/fa";

interface ActivityItem {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: string;
  type: "success" | "warning" | "info";
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getIcon = (iconName: string, type: string) => {
    const iconClass = `activity-icon ${type}`;

    switch (iconName) {
      case "check":
        return (
          <div className={iconClass}>
            <FaCheck />
          </div>
        );
      case "exclamation":
        return (
          <div className={iconClass}>
            <FaExclamation />
          </div>
        );
      case "user-plus":
        return (
          <div className={iconClass}>
            <FaUserPlus />
          </div>
        );
      case "chart-line":
        return (
          <div className={iconClass}>
            <FaChartLine />
          </div>
        );
      default:
        return (
          <div className={iconClass}>
            <FaCheck />
          </div>
        );
    }
  };

  return (
    <div className="activity-list">
      {activities.map((activity) => (
        <div key={activity.id} className="activity-item">
          {getIcon(activity.icon, activity.type)}
          <div className="activity-details">
            <h6 className="fw-bold mb-1">{activity.title}</h6>
            <p className="text-muted mb-0 small">{activity.description}</p>
          </div>
          <div className="activity-time text-muted small">{activity.time}</div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
