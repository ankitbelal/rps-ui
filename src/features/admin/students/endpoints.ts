type EndpointType = {
  [key: string]: string;
};

export const AdminStudentEndpoints: EndpointType = {
  GET_STUDENTS: "/students",
  GET_STUDENTS_REPORT: "/students/report",
  GET_STUDENT_BY_ID: "/students",
  GET_STUDENT_BY_USER_ID: "/students/student-details",

  PROGRAM_LIST: "/programs/program-list",
  FACULTY_LIST: "/faculties/faculty-list",
  STUDENT_ACTION: "/students",
  STUDENT_RESTORE: "students/restore",
  TEACHER_LIST: "/teacher/teacher-list",
  SUBJECT_LIST: "/subject/students-subject-eval-param",
  STUDENT_MARKS: "/result/student-marks",
  ADD_MARKS: "/result/add-marks",
  PUBLISHED_RESULT: "/result/get-published-result",
};

export default AdminStudentEndpoints;
