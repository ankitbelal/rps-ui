type EndpointType = {
  [key: string]: string;
};

const AdminEndpoints: EndpointType = {
  DASHBOARD_STATISTICS: "/dashboard",
  TOP_STUDENTS: "/result/top-students",
};

export default AdminEndpoints;
