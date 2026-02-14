type EndpointType = {
  [key: string]: string;
};

export const AdminTeacherEndpoints: EndpointType = {
  LIST_TEACHER: "/teacher",
  TEACHER_ACTION: "/teacher",
  SUBJECT_ASSIGN_LIST: "/subject/subject-list",
  ASSIGN_SUBJECT: "/teacher/assign-subject",
  GET_TEACHER_REPORT: "/teacher/report",
};
