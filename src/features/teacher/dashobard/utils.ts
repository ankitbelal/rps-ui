export interface SemesterEntry {
  semester: number;
  subjectCount: number;
}

export interface ProgramSemesterDashboard {
  programId: number;
  programName: string;
  programCode: string;
  semesters: SemesterEntry[];
}

export interface TeacherDashboardResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    students: number;
    subjects: number;
    assignedPrograms: ProgramSemesterDashboard[];
  };
}
