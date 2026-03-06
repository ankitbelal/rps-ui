import { useState } from "react";
import type React from "react";

type ExamTerm = "FINAL" | "SECOND" | "FIRST";

interface SubjectBreakdown {
  code: string;
  name: string;
  fullMarks: number;
  obtained: number;
  grade: string;
}

interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  rollNumber: string;
  registrationNumber: string;
  currentSemester: number;
  semester: number;
  examTerm: ExamTerm;
  program: string;
  totalObtained: number;
  totalFull: number;
  percentage: number;
  gpa: number;
  publishedAt: string;
  subjectBreakdown: SubjectBreakdown[];
}

const mockStudents: Student[] = [
  {
    studentId: 1,
    firstName: "Aarav",
    lastName: "Sharma",
    rollNumber: "077BCT001",
    registrationNumber: "2077-1-01-0001",
    currentSemester: 5,
    semester: 5,
    examTerm: "FINAL",
    program: "BCT",
    totalObtained: 412,
    totalFull: 500,
    percentage: 82.4,
    gpa: 3.7,
    publishedAt: "2024-12-15T10:00:00Z",
    subjectBreakdown: [
      {
        code: "BCT501",
        name: "Database Management",
        fullMarks: 100,
        obtained: 88,
        grade: "A",
      },
      {
        code: "BCT502",
        name: "Computer Networks",
        fullMarks: 100,
        obtained: 79,
        grade: "B+",
      },
      {
        code: "BCT503",
        name: "Software Engineering",
        fullMarks: 100,
        obtained: 85,
        grade: "A",
      },
      {
        code: "BCT504",
        name: "Operating Systems",
        fullMarks: 100,
        obtained: 76,
        grade: "B+",
      },
      {
        code: "BCT505",
        name: "Numerical Methods",
        fullMarks: 100,
        obtained: 84,
        grade: "A",
      },
    ],
  },
  {
    studentId: 2,
    firstName: "Priya",
    lastName: "Thapa",
    rollNumber: "077BCT002",
    registrationNumber: "2077-1-01-0002",
    currentSemester: 5,
    semester: 5,
    examTerm: "FINAL",
    program: "BCT",
    totalObtained: 445,
    totalFull: 500,
    percentage: 89.0,
    gpa: 3.9,
    publishedAt: "2024-12-15T10:00:00Z",
    subjectBreakdown: [
      {
        code: "BCT501",
        name: "Database Management",
        fullMarks: 100,
        obtained: 94,
        grade: "A+",
      },
      {
        code: "BCT502",
        name: "Computer Networks",
        fullMarks: 100,
        obtained: 88,
        grade: "A",
      },
      {
        code: "BCT503",
        name: "Software Engineering",
        fullMarks: 100,
        obtained: 90,
        grade: "A+",
      },
      {
        code: "BCT504",
        name: "Operating Systems",
        fullMarks: 100,
        obtained: 85,
        grade: "A",
      },
      {
        code: "BCT505",
        name: "Numerical Methods",
        fullMarks: 100,
        obtained: 88,
        grade: "A",
      },
    ],
  },
  {
    studentId: 3,
    firstName: "Bikram",
    lastName: "Karki",
    rollNumber: "077BCT003",
    registrationNumber: "2077-1-01-0003",
    currentSemester: 5,
    semester: 5,
    examTerm: "FINAL",
    program: "BCT",
    totalObtained: 361,
    totalFull: 500,
    percentage: 72.2,
    gpa: 3.2,
    publishedAt: "2024-12-15T10:00:00Z",
    subjectBreakdown: [
      {
        code: "BCT501",
        name: "Database Management",
        fullMarks: 100,
        obtained: 71,
        grade: "B",
      },
      {
        code: "BCT502",
        name: "Computer Networks",
        fullMarks: 100,
        obtained: 68,
        grade: "B",
      },
      {
        code: "BCT503",
        name: "Software Engineering",
        fullMarks: 100,
        obtained: 74,
        grade: "B+",
      },
      {
        code: "BCT504",
        name: "Operating Systems",
        fullMarks: 100,
        obtained: 72,
        grade: "B",
      },
      {
        code: "BCT505",
        name: "Numerical Methods",
        fullMarks: 100,
        obtained: 76,
        grade: "B+",
      },
    ],
  },
  {
    studentId: 4,
    firstName: "Sunita",
    lastName: "Rai",
    rollNumber: "077BCT004",
    registrationNumber: "2077-1-01-0004",
    currentSemester: 3,
    semester: 3,
    examTerm: "SECOND",
    program: "BCT",
    totalObtained: 390,
    totalFull: 500,
    percentage: 78.0,
    gpa: 3.5,
    publishedAt: "2024-10-10T10:00:00Z",
    subjectBreakdown: [
      {
        code: "BCT301",
        name: "Data Structures",
        fullMarks: 100,
        obtained: 80,
        grade: "A",
      },
      {
        code: "BCT302",
        name: "Discrete Math",
        fullMarks: 100,
        obtained: 75,
        grade: "B+",
      },
      {
        code: "BCT303",
        name: "Electronics",
        fullMarks: 100,
        obtained: 82,
        grade: "A",
      },
      {
        code: "BCT304",
        name: "Statistics",
        fullMarks: 100,
        obtained: 78,
        grade: "B+",
      },
      {
        code: "BCT305",
        name: "OOP in Java",
        fullMarks: 100,
        obtained: 75,
        grade: "B+",
      },
    ],
  },
  {
    studentId: 5,
    firstName: "Roshan",
    lastName: "Gurung",
    rollNumber: "077BCT005",
    registrationNumber: "2077-1-01-0005",
    currentSemester: 5,
    semester: 5,
    examTerm: "FINAL",
    program: "BCT",
    totalObtained: 328,
    totalFull: 500,
    percentage: 65.6,
    gpa: 2.9,
    publishedAt: "2024-12-15T10:00:00Z",
    subjectBreakdown: [
      {
        code: "BCT501",
        name: "Database Management",
        fullMarks: 100,
        obtained: 64,
        grade: "C+",
      },
      {
        code: "BCT502",
        name: "Computer Networks",
        fullMarks: 100,
        obtained: 61,
        grade: "C+",
      },
      {
        code: "BCT503",
        name: "Software Engineering",
        fullMarks: 100,
        obtained: 70,
        grade: "B",
      },
      {
        code: "BCT504",
        name: "Operating Systems",
        fullMarks: 100,
        obtained: 67,
        grade: "B",
      },
      {
        code: "BCT505",
        name: "Numerical Methods",
        fullMarks: 100,
        obtained: 66,
        grade: "B",
      },
    ],
  },
  {
    studentId: 6,
    firstName: "Anjali",
    lastName: "Basnet",
    rollNumber: "077BCT006",
    registrationNumber: "2077-1-01-0006",
    currentSemester: 5,
    semester: 5,
    examTerm: "FINAL",
    program: "BCT",
    totalObtained: 458,
    totalFull: 500,
    percentage: 91.6,
    gpa: 4.0,
    publishedAt: "2024-12-15T10:00:00Z",
    subjectBreakdown: [
      {
        code: "BCT501",
        name: "Database Management",
        fullMarks: 100,
        obtained: 96,
        grade: "A+",
      },
      {
        code: "BCT502",
        name: "Computer Networks",
        fullMarks: 100,
        obtained: 91,
        grade: "A+",
      },
      {
        code: "BCT503",
        name: "Software Engineering",
        fullMarks: 100,
        obtained: 93,
        grade: "A+",
      },
      {
        code: "BCT504",
        name: "Operating Systems",
        fullMarks: 100,
        obtained: 88,
        grade: "A",
      },
      {
        code: "BCT505",
        name: "Numerical Methods",
        fullMarks: 100,
        obtained: 90,
        grade: "A+",
      },
    ],
  },
  {
    studentId: 7,
    firstName: "Nisha",
    lastName: "Maharjan",
    rollNumber: "077BCA001",
    registrationNumber: "2077-2-01-0001",
    currentSemester: 5,
    semester: 5,
    examTerm: "FINAL",
    program: "BCA",
    totalObtained: 430,
    totalFull: 500,
    percentage: 86.0,
    gpa: 3.8,
    publishedAt: "2024-12-18T10:00:00Z",
    subjectBreakdown: [
      {
        code: "BCA501",
        name: "Web Technology",
        fullMarks: 100,
        obtained: 88,
        grade: "A",
      },
      {
        code: "BCA502",
        name: "Mobile Computing",
        fullMarks: 100,
        obtained: 85,
        grade: "A",
      },
      {
        code: "BCA503",
        name: "AI Fundamentals",
        fullMarks: 100,
        obtained: 90,
        grade: "A+",
      },
      {
        code: "BCA504",
        name: "Project Management",
        fullMarks: 100,
        obtained: 82,
        grade: "A",
      },
      {
        code: "BCA505",
        name: "Cloud Computing",
        fullMarks: 100,
        obtained: 85,
        grade: "A",
      },
    ],
  },
  {
    studentId: 8,
    firstName: "Dipesh",
    lastName: "Shrestha",
    rollNumber: "077BCA002",
    registrationNumber: "2077-2-01-0002",
    currentSemester: 5,
    semester: 5,
    examTerm: "FINAL",
    program: "BCA",
    totalObtained: 355,
    totalFull: 500,
    percentage: 71.0,
    gpa: 3.1,
    publishedAt: "2024-12-18T10:00:00Z",
    subjectBreakdown: [
      {
        code: "BCA501",
        name: "Web Technology",
        fullMarks: 100,
        obtained: 70,
        grade: "B",
      },
      {
        code: "BCA502",
        name: "Mobile Computing",
        fullMarks: 100,
        obtained: 68,
        grade: "B",
      },
      {
        code: "BCA503",
        name: "AI Fundamentals",
        fullMarks: 100,
        obtained: 75,
        grade: "B+",
      },
      {
        code: "BCA504",
        name: "Project Management",
        fullMarks: 100,
        obtained: 72,
        grade: "B",
      },
      {
        code: "BCA505",
        name: "Cloud Computing",
        fullMarks: 100,
        obtained: 70,
        grade: "B",
      },
    ],
  },
  {
    studentId: 9,
    firstName: "Kabita",
    lastName: "Poudel",
    rollNumber: "077BCA003",
    registrationNumber: "2077-2-01-0003",
    currentSemester: 3,
    semester: 3,
    examTerm: "FINAL",
    program: "BCA",
    totalObtained: 398,
    totalFull: 500,
    percentage: 79.6,
    gpa: 3.5,
    publishedAt: "2024-11-05T10:00:00Z",
    subjectBreakdown: [
      {
        code: "BCA301",
        name: "Database Systems",
        fullMarks: 100,
        obtained: 82,
        grade: "A",
      },
      {
        code: "BCA302",
        name: "Computer Graphics",
        fullMarks: 100,
        obtained: 76,
        grade: "B+",
      },
      {
        code: "BCA303",
        name: "System Analysis",
        fullMarks: 100,
        obtained: 80,
        grade: "A",
      },
      {
        code: "BCA304",
        name: "Networking Basics",
        fullMarks: 100,
        obtained: 78,
        grade: "B+",
      },
      {
        code: "BCA305",
        name: "Java Programming",
        fullMarks: 100,
        obtained: 82,
        grade: "A",
      },
    ],
  },
];

const gradeColor = (g: string): string => {
  if (g.startsWith("A")) return "#22c55e";
  if (g.startsWith("B")) return "#3b82f6";
  if (g.startsWith("C")) return "#f59e0b";
  return "#ef4444";
};

interface GpaColor {
  bg: string;
  text: string;
  bar: string;
}
const gpaColor = (gpa: number): GpaColor => {
  if (gpa >= 3.7) return { bg: "#dcfce7", text: "#15803d", bar: "#22c55e" };
  if (gpa >= 3.3) return { bg: "#dbeafe", text: "#1d4ed8", bar: "#3b82f6" };
  if (gpa >= 2.7) return { bg: "#fef9c3", text: "#a16207", bar: "#eab308" };
  return { bg: "#fee2e2", text: "#b91c1c", bar: "#ef4444" };
};

interface TermBadge {
  bg: string;
  text: string;
  label: string;
}
const termBadge = (term: string): TermBadge =>
  ({
    FINAL: { bg: "#ede9fe", text: "#6d28d9", label: "Final" },
    SECOND: { bg: "#dbeafe", text: "#1d4ed8", label: "Second" },
    FIRST: { bg: "#fce7f3", text: "#be185d", label: "First" },
  })[term] ?? { bg: "#f3f4f6", text: "#374151", label: term };

const selectStyle: React.CSSProperties = {
  padding: "0.52rem 2.1rem 0.52rem 0.85rem",
  border: "1.5px solid #e2e8f0",
  borderRadius: "0.6rem",
  fontSize: "0.8rem",
  fontFamily: "'Sora', sans-serif",
  color: "#1e293b",
  background: "#f8fafc",
  cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%2394a3b8' d='M5 7L0 2h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.7rem center",
};

interface SubjectModalProps {
  student: Student | null;
  onClose: () => void;
}

const SubjectModal: React.FC<SubjectModalProps> = ({ student, onClose }) => {
  if (!student) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "1rem",
        animation: "fadeIn 0.15s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "1.25rem",
          width: "100%",
          maxWidth: "560px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
          animation: "slideUp 0.2s ease",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            padding: "1.5rem 1.75rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "0.72rem",
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "0.1em",
                  marginBottom: "0.3rem",
                }}
              >
                SUBJECT BREAKDOWN
              </div>
              <div
                style={{
                  color: "#fff",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                {student.firstName} {student.lastName}
              </div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "0.8rem",
                  marginTop: "0.2rem",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {student.rollNumber} · {student.program} · Sem{" "}
                {student.semester} · {termBadge(student.examTerm).label}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "#fff",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.25rem" }}>
            {[
              {
                label: "Total",
                value: `${student.totalObtained}/${student.totalFull}`,
              },
              { label: "Percentage", value: `${student.percentage}%` },
              { label: "GPA", value: student.gpa.toFixed(2) },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "0.68rem",
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: "0.08em",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: "1rem",
                    fontWeight: 700,
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            padding: "1.25rem 1.75rem 1.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {student.subjectBreakdown.map((sub) => {
            const pct = Math.round((sub.obtained / sub.fullMarks) * 100);
            const gc = gradeColor(sub.grade);
            return (
              <div
                key={sub.code}
                style={{
                  background: "#f8fafc",
                  borderRadius: "0.75rem",
                  padding: "0.875rem 1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontFamily: "'DM Mono', monospace",
                        color: "#94a3b8",
                        marginRight: "0.5rem",
                      }}
                    >
                      {sub.code}
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#1e293b",
                        fontFamily: "'Sora', sans-serif",
                      }}
                    >
                      {sub.name}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "#1e293b",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {sub.obtained}
                      <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                        /{sub.fullMarks}
                      </span>
                    </span>
                    <span
                      style={{
                        background: `${gc}18`,
                        color: gc,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "0.15rem 0.5rem",
                        borderRadius: "999px",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {sub.grade}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    height: "4px",
                    background: "#e2e8f0",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: gc,
                      borderRadius: "999px",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ResultListing: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("FINAL");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const programs = Array.from(
    new Set(mockStudents.map((s) => s.program)),
  ).sort();
  const semesters = Array.from(
    new Set(mockStudents.map((s) => s.semester)),
  ).sort((a, b) => a - b);

  const filtered = mockStudents.filter((s) => {
    const q = search.toLowerCase();
    return (
      (!q ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.registrationNumber.toLowerCase().includes(q) ||
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)) &&
      (selectedTerm === "" || s.examTerm === selectedTerm) &&
      (selectedProgram === "" || s.program === selectedProgram) &&
      (selectedSemester === "" || s.semester === Number(selectedSemester))
    );
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f1f5f9; }
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        .row-hover { transition: background 0.12s ease, transform 0.12s ease; cursor: pointer; }
        .row-hover:hover { background: #f0f9ff !important; transform: translateX(3px); }
        .search-input:focus, select:focus { outline: none; border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        .term-btn { cursor: pointer; transition: all 0.12s ease; border: none; }
        .term-btn:hover { opacity: 0.82; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#f1f5f9",
          fontFamily: "'Sora', sans-serif",
          padding: "2rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          {/* Page header */}
          <div style={{ marginBottom: "1.75rem" }}>
            <div
              style={{
                color: "#6366f1",
                fontSize: "0.72rem",
                fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.12em",
                marginBottom: "0.4rem",
              }}
            >
              PUBLISHED RESULTS
            </div>
            <h1
              style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a" }}
            >
              Class Results
            </h1>
            <p
              style={{
                color: "#64748b",
                fontSize: "0.875rem",
                marginTop: "0.3rem",
              }}
            >
              Grouped by publish batch · Latest first · Current semester only
            </p>
          </div>

          {/* Filter bar */}
          <div
            style={{
              background: "#fff",
              borderRadius: "1rem",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Search */}
            <input
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, roll no, reg no…"
              style={{
                flex: 1,
                minWidth: "180px",
                padding: "0.52rem 0.9rem",
                border: "1.5px solid #e2e8f0",
                borderRadius: "0.6rem",
                fontSize: "0.8rem",
                fontFamily: "'Sora', sans-serif",
                color: "#1e293b",
                background: "#f8fafc",
              }}
            />

            {/* Program dropdown */}
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Programs</option>
              {programs.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {/* Semester dropdown */}
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Semesters</option>
              {semesters.map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>

            {/* Term pill buttons */}
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {["FINAL", "SECOND", "FIRST"].map((t) => {
                const active = selectedTerm === t;
                return (
                  <button
                    key={t}
                    className="term-btn"
                    onClick={() => setSelectedTerm(t)}
                    style={{
                      padding: "0.48rem 0.8rem",
                      borderRadius: "0.6rem",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      fontFamily: "'DM Mono', monospace",
                      background: active ? "#6366f1" : "#f1f5f9",
                      color: active ? "#fff" : "#64748b",
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Flat result table */}
          <div
            style={{
              background: "#fff",
              borderRadius: "1rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Column headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2rem 1fr 1fr 5rem 5.5rem 6rem 5rem",
                padding: "0.7rem 1.25rem",
                background: "#f8fafc",
                borderBottom: "1.5px solid #e2e8f0",
              }}
            >
              {[
                "#",
                "Student",
                "Roll / Reg",
                "GPA",
                "Percentage",
                "Marks",
                "Details",
              ].map((h) => (
                <div
                  key={h}
                  style={{
                    fontSize: "0.64rem",
                    fontWeight: 600,
                    color: "#94a3b8",
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: "0.08em",
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div
                style={{
                  padding: "3.5rem",
                  textAlign: "center",
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                }}
              >
                No results match the selected filters
              </div>
            ) : (
              filtered.map((s, i) => {
                const gc = gpaColor(s.gpa);
                return (
                  <div
                    key={s.studentId}
                    className="row-hover"
                    onClick={() => setSelectedStudent(s)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2rem 1fr 1fr 5rem 5.5rem 6rem 5rem",
                      padding: "0.85rem 1.25rem",
                      alignItems: "center",
                      background: "#fff",
                      borderBottom:
                        i < filtered.length - 1 ? "1px solid #f8fafc" : "none",
                    }}
                  >
                    {/* # */}
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "#cbd5e1",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {i + 1}
                    </div>

                    {/* Name */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.65rem",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${gc.bar}33, ${gc.bar}66)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: gc.text,
                          flexShrink: 0,
                        }}
                      >
                        {s.firstName[0]}
                        {s.lastName[0]}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "#1e293b",
                          }}
                        >
                          {s.firstName} {s.lastName}
                        </div>
                        <div
                          style={{
                            fontSize: "0.67rem",
                            color: "#94a3b8",
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          ID #{s.studentId}
                        </div>
                      </div>
                    </div>

                    {/* Roll / Reg */}
                    <div>
                      <div
                        style={{
                          fontSize: "0.77rem",
                          fontFamily: "'DM Mono', monospace",
                          color: "#334155",
                          fontWeight: 500,
                        }}
                      >
                        {s.rollNumber}
                      </div>
                      <div
                        style={{
                          fontSize: "0.67rem",
                          fontFamily: "'DM Mono', monospace",
                          color: "#94a3b8",
                        }}
                      >
                        {s.registrationNumber}
                      </div>
                    </div>

                    {/* GPA */}
                    <div>
                      <span
                        style={{
                          background: gc.bg,
                          color: gc.text,
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          padding: "0.22rem 0.55rem",
                          borderRadius: "0.4rem",
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {s.gpa.toFixed(2)}
                      </span>
                    </div>

                    {/* Percentage */}
                    <div>
                      <div
                        style={{
                          fontSize: "0.77rem",
                          fontWeight: 600,
                          color: "#1e293b",
                          marginBottom: "0.22rem",
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {s.percentage}%
                      </div>
                      <div
                        style={{
                          height: "3px",
                          background: "#e2e8f0",
                          borderRadius: "999px",
                          width: "60px",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${s.percentage}%`,
                            background: gc.bar,
                            borderRadius: "999px",
                          }}
                        />
                      </div>
                    </div>

                    {/* Marks */}
                    <div
                      style={{
                        fontSize: "0.77rem",
                        fontFamily: "'DM Mono', monospace",
                        color: "#475569",
                      }}
                    >
                      {s.totalObtained}
                      <span style={{ color: "#94a3b8" }}>/{s.totalFull}</span>
                    </div>

                    {/* View */}
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(s);
                        }}
                        style={{
                          background: "#6366f1",
                          color: "#fff",
                          border: "none",
                          borderRadius: "0.5rem",
                          padding: "0.32rem 0.65rem",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontSize: "0.71rem",
              color: "#94a3b8",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {filtered.length} student{filtered.length !== 1 ? "s" : ""} found
          </div>
        </div>
      </div>

      <SubjectModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </>
  );
};

export default ResultListing;
