export interface Subject {
  id: string;
  name: string;
  code: string;
  program: string;
  semester: string;
  studentsCount: number;
  schedule: string;
}

export interface DashboardStats {
  activeCourses: number;
  totalStudents: number;
  activeCoursesTrend: string;
  totalStudentsTrend: string;
}
