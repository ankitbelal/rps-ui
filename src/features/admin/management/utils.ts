export interface GradeRange {
  id: number;
  minGPA: string;
  maxGPA: string;
  grade: string;
  remarks: string;
  createdAt: string;
}

export interface ListGradeResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: GradeRange[];
}

interface User {
  name: string;
}

export interface PromotionLogs {
  id: number;
  actCode: string;
  action: string;
  comment: string;
  user: User;
  createdAt: string;
}

export interface PromotionApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PromotionLogs[];
  total: number;
  page: number;
  lastPage: number;
  limit: number;
}

export interface Params {
  type: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  limit: number;
}

export interface publishResultPayload {
  programId: string;
  semesters: number[];
  withReport: boolean;
  examTerm: "F" | "S" | "FINAL";
}

export interface SubjectData {
  grade: string;
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  firstTermMark: number;
  secondTermMark: number;
  finalMarkOutOf100: number;
  subjectObtainedOutOf50: number;
  extraParamObtainedOutOf50: number;
}

export interface StudentData {
  studentId: number;
  firstName: string;
  lastName: string;
  rollNumber: string;
  registrationNumber: string;
  currentSemester: number;
  semester: number;
  programId: number;
  examTerm: string;
  totalObtained: number;
  totalFull: number;
  percentage: number;
  gpa: number;
  publishedAt: string;
  subjectBreakdown: SubjectData[];
}

export interface BulkResultApiResponse {
  success: boolean;
  statusCode: number;
  message: number;
  data: StudentData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BulkApiParams {
  search: string;
  programId: number;
  semester: number;
  examTerm: string;
  page: number;
  limit: number;
}

//notification part

/* ── Enums (mirror backend) ── */
export enum NoticeFilter {
  ALL = "all",
  UNREAD = "unread",
  ADMIN = "admin",
  TEACHER = "teacher",
}

export enum SingleNoticeStatus {
  READ = "R",
  UNREAD = "U",
}

export enum NoticeUserType {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

/* ── Publisher (joined relation) ── */
export interface NoticePublisher {
  id: number;
  name: string;
  email: string;
}

/* ── Single notice item returned in data[] ── */
export interface SingleNotice {
  id: number;
  subject: string;
  description: string;
  status: SingleNoticeStatus;
  publisherType: NoticeUserType;
  recipientType: NoticeUserType;
  expireAt: string | null; // ISO date string
  createdAt: string; // ISO date string
  publisher: NoticePublisher;
}

/* ── Pill counts ── */
export interface NoticeCounts {
  all: number;
  unread: number;
  admin: number;
  teacher: number;
  student:number;
}

/* ── Full paginated response ── */
export interface GetNoticesResponse {
  data: SingleNotice[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
  counts: NoticeCounts;
}

/* ── Query params sent to API ── */
export interface NoticeQueryParams {
  userId: number;
  page?: number;
  limit?: number;
  filter?: NoticeFilter;
}
