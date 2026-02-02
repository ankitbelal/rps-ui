type EndpointType = {
  [key: string]: string;
};


export const AdminStudentEndpoints: EndpointType = {
  GET_STUDENTS:"/students",
  GET_STUDENT_BY_ID:"/students",
  PROGRAM_LIST:"/programs/program-list",
  FACULTY_LIST:"/faculties/faculty-list",
  STUDENT_ACTION:"/students",
  TEACHER_LIST:"/teacher/teacher-list",
  SUBJECT_LIST:"/subject/students-subject-eval-param",
  STUDENT_MARKS:"/result/student-marks",
  ADD_MARKS:"/result/add-marks"
}

export default AdminStudentEndpoints;