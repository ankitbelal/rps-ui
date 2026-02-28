type EndpointType = {
  [key: string]: string;
};

const AdminEndpoints: EndpointType = {
  DASHBOARD_STATISTICS: "/dashboard",
  TOP_STUDENTS: "/result/top-students",
  STUDENT_GRAPH: "/students/student-report",
  AUDIT_LOGS: "audit-trail",
};

export default AdminEndpoints;
