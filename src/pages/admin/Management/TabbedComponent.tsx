import React, { useState, useEffect, ReactNode } from "react";
import { Card, Button } from "react-bootstrap";
import { useAppDispatch } from "../../../app/hooks";
import { setPageTitle } from "../../../features/ui/uiSlice";
import CommonBreadCrumb from "../../../Component/common/BreadCrumb";
import { FaTachometerAlt } from "react-icons/fa";
import StudentPromotionLogs from "./partials/StudentPromotionLogs";
import GradeRanges from "./partials/GradeRanges";
import ResultPublishLogs from "./partials/ResultPublishLogs";

// Generic Tab interface for better type safety
export interface TabConfig {
  id: string;
  title: string;
  icon?: ReactNode;
  component: ReactNode;
  disabled?: boolean;
}

interface TabbedContainerProps {
  title: string;
  subtitle?: string;
  tabs: TabConfig[];
  defaultTabId?: string;
  breadcrumbItems?: Array<{
    label: string;
    link?: string;
    icon?: ReactNode;
    active?: boolean;
  }>;
}

const TabbedContainer: React.FC<TabbedContainerProps> = ({
  title,
  subtitle,
  tabs,
  defaultTabId,
  breadcrumbItems,
}) => {
  const dispatch = useAppDispatch();
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultTabId || (tabs.length > 0 ? tabs[0].id : ""),
  );

  useEffect(() => {
    dispatch(
      setPageTitle({
        title: title || "Tabbed Interface",
        subtitle: subtitle || "Switch between different components",
      }),
    );
  }, [dispatch, title, subtitle]);

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const activeComponent = tabs.find((tab) => tab.id === activeTabId)?.component;

  // Default breadcrumb if not provided
  const defaultBreadcrumb = [
    {
      label: "Dashboard",
      link: "/admin/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      label: title || "Tabbed Interface",
      active: true,
    },
  ];

  return (
    <div className="mb-4">
      <CommonBreadCrumb items={breadcrumbItems || defaultBreadcrumb} />

      {/* ProfilePage-style Tabs */}
      <Card className="border-0 shadow-sm mb-0 rounded-bottom-0">
        <Card.Body className="p-0">
          <div
            className="d-flex border-bottom bg-white overflow-auto"
            style={{ scrollbarWidth: "thin" }}
          >
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="link"
                disabled={tab.disabled}
                className={`
                  text-decoration-none px-4 py-3 position-relative 
                  d-flex align-items-center gap-2
                  ${
                    activeTabId === tab.id
                      ? "text-primary fw-bold"
                      : "text-muted"
                  }
                  ${tab.disabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
                onClick={() => !tab.disabled && handleTabChange(tab.id)}
                style={{
                  borderBottom:
                    activeTabId === tab.id
                      ? "2px solid var(--bs-primary)"
                      : "none",
                  marginBottom: "-1px",
                  borderRadius: 0,
                  minWidth: "fit-content",
                }}
              >
                {tab.icon && <span className="fs-5">{tab.icon}</span>}
                <span>{tab.title}</span>

                {activeTabId === tab.id && (
                  <div
                    className="position-absolute bottom-0 start-0 w-100"
                    style={{
                      height: "2px",
                      backgroundColor: "var(--bs-primary)",
                    }}
                  />
                )}
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Active Component Content */}
      <Card className="border-0 shadow-sm rounded-top-0">
        <Card.Body className="p-4">{activeComponent}</Card.Body>
      </Card>
    </div>
  );
};

// Usage example component
const TabbedComponent: React.FC = () => {
  // Define your tabs statically
  const tabs: TabConfig[] = [
    {
      id: "result",
      title: "Result Publish",
      icon: <i className="fas fa-bullhorn"></i>,
      component: <ResultPublishLogs />,
    },
    {
      id: "logs",
      title: "Student Promotion",
      icon: <i className="fas fa-table"></i>,
      component: <StudentPromotionLogs />,
    },
    {
      id: "grades",
      title: "Grade Management",
      icon: <i className="fas fa-star"></i>,
      component: <GradeRanges />,
    },
  ];

  return (
    <TabbedContainer
      title="Management List"
      subtitle="Multi-tab management section"
      tabs={tabs}
      defaultTabId="result"
    />
  );
};

export default TabbedComponent;
