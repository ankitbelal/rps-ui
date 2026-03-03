export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rollNumber: string;
  currentSemester: number;
  status: "A" | "P" | "S";
  registrationNumber: string;
  gender: "F" | "M" | "O";
  DOB: string;
  address1: string;
  address2?: string;
  enrollmentDate: string;
  programId: number;
  program: {
    id?: number;
    name: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface studentListParams {
  search?: string;
  page?: number;
  limit?: number;
  currentSemester?: number;
  programId?: number;
  status?: string;
}

export interface StudentListApiReponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Student[];
  total: number;
  page: number;
  lastPage: number;
  limit: number;
}

export interface ProgramList {
  id: number;
  code: string;
  name: string;
  totalSemesters: number;
}

export interface ProgramListApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ProgramList[];
}

export interface FacultyList {
  id: number;
  name: string;
}

export interface FacultyListApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: FacultyList[];
}

export interface StudentDetailApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Student[];
}

export interface Teacher {
  id: number;
  name: string;
}

export interface TeacherList {
  success: boolean;
  statusCode: number;
  message: string;
  data: Teacher[];
}

export interface StudentForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rollNumber: string;
  enrollmentDate: string;
  currentSemester: number;
  registrationNumber: string;
  gender: "M" | "F" | "O";
  DOB: string;
  address1: string;
  programId: number;
}

interface EvaluationParameter {
  weight: number;
  id: number;
  code: string;
  name: string;
  assigned: number;
}

export interface StudentSubjectData {
  id: number;
  name: string;
  code: string;
  semester: number;
  type: string;
  subjectTeacher: null;
  evaluationParameters: EvaluationParameter[];
}

export interface StudentSubjectResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: StudentSubjectData[];
}

export interface Param {
  programId: number;
  semester: number;
  studentId?: number;
}

export interface ResultParam {
  semester: number;
  examTerm: string;
  studentId: number;
}

export interface ExtraParameter {
  id: number;
  subjectId: number;
  evaluationParameterId: number;
  obtainedMarks: number;
  fullMarks: number;
}
export interface MarksData {
  id: number;
  studentId: number;
  subjectId: number;
  examTerm: string;
  semester: number;
  obtainedMarks: number;
  fullMarks: number;
  extraParametersMarks: ExtraParameter[];
  createdAt: string;
}

export interface StudentMarksResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: MarksData[];
}

export interface SubjectData {
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  firstTermMark: number;
  secondTermMark: number;
  finalMarkOutOf100: number;
  subjectObtainedOutOf50: number;
  extraParamObtainedOutOf50: number;
  grade: string;
}

export interface ResultData {
  id: number;
  studentId: number;
  programId: number;
  semester: number;
  examTerm: string;
  totalObtained: number;
  totalFull: number;
  percentage: number;
  gpa: number;
  subjectBreakdown: SubjectData[];
  publishedBy: string;
  publishedAt: string;
  updatedAt: string;
}

export interface ResultApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ResultData[];
}

export interface FinalResultParam {
  studentId: number;
  examTerm: string;
  semester: number | string;
}
