export interface StudentDistribution {
  [programName: string]: number;
}

export interface StatisticsAPiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    faculties: number;
    programs: number;
    subjects: number;
    teachers: number;
    students: {
      active: number;
      passed: number;
      total: number;
    };
    studentsDistributions: StudentDistribution;
  };
}

export interface TopStudentsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: StudentWithResult[];
}

export interface StudentWithResult {
  studentId: number;
  name: string;
  rollNumber: number;
  programId: number;
  semester: number;
  examTerm: "FINAL" | "F" | "S";
  gpa: number;
  percentage: number;
  totalObtained: number;
  totalFull: number;
}

export interface TopStudentQuery {
  programId?: number;
  examTerm?: "F" | "S" | "FINAL";
}
export interface Params {
  year:string
}

export interface StudentGraphData {
  year:number;
  new:number;
  passed:number;
  disabled:number;
  total:number;
}


export interface GraphApiResponse {
  success:boolean;
  statusCode:number;
  message:string;
  data:StudentGraphData[];
}