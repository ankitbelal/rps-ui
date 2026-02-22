import { useState, useEffect, CSSProperties } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// ── Types ──────────────────────────────────────────────────────────────────
interface SemesterEntry {
  semester: number;
  subjectCount: number;
}

interface ProgramSemesterDashboard {
  programId: number;
  programName: string;
  programCode: string;
  semesters: SemesterEntry[];
}

interface RingBubbleProps {
  semNum: number;
  subjectCount: number;
  visible: boolean;
}

interface ProgramRowProps {
  program: ProgramSemesterDashboard;
  index: number;
}

// ── Constants ──────────────────────────────────────────────────────────────
const RING_COLORS: string[] = [
  "#16a85a",
  "#3b6ef5",
  "#e07b2a",
  "#9b3fda",
  "#e03060",
  "#0aa8c0",
];

const TOTAL_SEMESTERS = 10;

const MOCK_DATA: ProgramSemesterDashboard[] = [
  {
    programId: 1,
    programName: "Bachelor of Computer Application",
    programCode: "BCA",
    semesters: [
      { semester: 1, subjectCount: 1 },
      { semester: 3, subjectCount: 3 },
      { semester: 5, subjectCount: 2 },
      { semester: 7, subjectCount: 4 },
    ],
  },
  {
    programId: 2,
    programName: "Bachelor of Business Administration",
    programCode: "BBA",
    semesters: [
      { semester: 2, subjectCount: 2 },
      { semester: 4, subjectCount: 1 },
    ],
  },
  {
    programId: 3,
    programName: "Bachelor of Engineering",
    programCode: "BE",
    semesters: [
      { semester: 1, subjectCount: 3 },
      { semester: 3, subjectCount: 2 },
      { semester: 5, subjectCount: 5 },
      { semester: 9, subjectCount: 1 },
    ],
  },
];

// ── Skeleton Rows ──────────────────────────────────────────────────────────
function SkeletonProgramRow() {
  return (
    <div style={{
      background: "#faf9f7",
      border: "1px solid #ede9e1",
      borderRadius: 14,
      padding: "1.1rem 1.3rem",
    }}>
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <Skeleton width={48} height={26} borderRadius={8} />
        <Skeleton width={220} height={14} borderRadius={6} />
        <div style={{ marginLeft: "auto" }}>
          <Skeleton width={90} height={12} borderRadius={6} />
        </div>
      </div>
      {/* Bubble row: label + circle stacked */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <Skeleton width={30} height={10} borderRadius={4} />
            <Skeleton width={32} height={32} borderRadius={999} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonHeader() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 20,
      paddingBottom: 16,
      borderBottom: "1px solid #ede9e1",
      flexWrap: "wrap",
    }}>
      <Skeleton width={38} height={38} borderRadius={10} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Skeleton width={150} height={14} borderRadius={6} />
        <Skeleton width={110} height={10} borderRadius={6} />
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <Skeleton width={28} height={18} borderRadius={6} />
              <Skeleton width={52} height={10} borderRadius={4} />
            </div>
            {i < 2 && <div style={{ width: 1, height: 28, background: "#ede9e1" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonLegend() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <Skeleton width={160} height={26} borderRadius={8} />
      <Skeleton width={1} height={18} />
      <Skeleton width={90} height={12} borderRadius={6} />
      <div style={{ display: "flex", gap: 8 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} width={32} height={12} borderRadius={6} />
        ))}
      </div>
      <div style={{ marginLeft: "auto" }}>
        <Skeleton width={110} height={12} borderRadius={6} />
      </div>
    </div>
  );
}

// ── RingBubble ─────────────────────────────────────────────────────────────
function RingBubble({ semNum, subjectCount, visible }: RingBubbleProps) {
  const BASE = 32;
  const GAP = 9;
  const total = subjectCount > 0 ? BASE + (subjectCount - 1) * GAP * 2 : BASE;

  const colStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
    flexShrink: 0,
  };

  if (!visible) {
    return (
      <div style={colStyle}>
        <span style={{ fontSize: 10, fontFamily: "DM Mono, monospace", color: "#c4bdb5", letterSpacing: "0.01em" }}>
          Sem {semNum}
        </span>
        <div
          title={`Semester ${semNum}: not assigned`}
          style={{
            width: BASE, height: BASE, borderRadius: "50%",
            background: "#f0ede8", border: "1.5px solid #ddd8d0",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontFamily: "DM Mono, monospace", color: "#c4bdb5",
            boxSizing: "border-box",
          }}
        >
          {semNum}
        </div>
      </div>
    );
  }

  return (
    <div style={colStyle} title={`Semester ${semNum}: ${subjectCount} subject${subjectCount !== 1 ? "s" : ""}`}>
      <span style={{ fontSize: 10, fontFamily: "DM Mono, monospace", color: RING_COLORS[0], fontWeight: 600, letterSpacing: "0.01em" }}>
        Sem {semNum}
      </span>
      <div style={{ position: "relative", width: total, height: total, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {Array.from({ length: subjectCount }, (_, i) => {
          const ringIndex = subjectCount - 1 - i;
          const size = BASE + ringIndex * GAP * 2;
          const color = RING_COLORS[ringIndex] ?? RING_COLORS[RING_COLORS.length - 1];
          return (
            <div key={ringIndex} style={{
              position: "absolute", width: size, height: size,
              borderRadius: "50%", border: `2.5px solid ${color}`,
              opacity: 0.55 + ringIndex * 0.08, boxSizing: "border-box",
            }} />
          );
        })}
        <div style={{
          position: "relative", zIndex: 10, width: BASE, height: BASE,
          borderRadius: "50%", background: "#edfaf4", border: `2px solid ${RING_COLORS[0]}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontFamily: "DM Mono, monospace", fontWeight: 700,
          color: RING_COLORS[0], boxSizing: "border-box",
        }}>
          {semNum}
        </div>
        <div style={{
          position: "absolute", top: -4, right: -4, zIndex: 20,
          width: 15, height: 15, borderRadius: "50%",
          background: RING_COLORS[Math.min(subjectCount - 1, RING_COLORS.length - 1)],
          color: "#fff", fontSize: 8, fontFamily: "DM Mono, monospace", fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1.5px solid #fff",
        }}>
          {subjectCount}
        </div>
      </div>
    </div>
  );
}

// ── ProgramRow ─────────────────────────────────────────────────────────────
function ProgramRow({ program, index }: ProgramRowProps) {
  const semMap = new Map<number, number>(program.semesters.map((s) => [s.semester, s.subjectCount]));
  const maxSem = Math.max(TOTAL_SEMESTERS, ...program.semesters.map((s) => s.semester));

  return (
    <div style={{
      background: "#faf9f7", border: "1px solid #ede9e1",
      borderRadius: 14, padding: "1.1rem 1.3rem",
      animation: `slideIn 0.35s ease ${index * 0.07}s both`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <span style={{
          fontFamily: "DM Mono, monospace", fontSize: 12, fontWeight: 500,
          color: "#3b6ef5", background: "#eef2ff", border: "1px solid #c5d2fc",
          borderRadius: 8, padding: "4px 10px", flexShrink: 0,
        }}>
          {program.programCode}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1e1c19" }}>{program.programName}</span>
        <span style={{ marginLeft: "auto", fontSize: 11, fontFamily: "DM Mono, monospace", color: "#7a7167", whiteSpace: "nowrap" }}>
          <span style={{ color: "#16a85a", fontWeight: 700 }}>{program.semesters.length}</span>/{maxSem} sems assigned
        </span>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
        {Array.from({ length: maxSem }, (_, i) => {
          const sem = i + 1;
          const count = semMap.get(sem) ?? 0;
          return <RingBubble key={sem} semNum={sem} subjectCount={count} visible={count > 0} />;
        })}
      </div>
    </div>
  );
}

// ── LegendRings ────────────────────────────────────────────────────────────
function LegendRings() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {RING_COLORS.slice(0, 5).map((color, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontFamily: "DM Mono, monospace", color: "#7a7167" }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", border: `2px solid ${color}`, background: `${color}22`, flexShrink: 0 }} />
          {i + 1}{i === 4 ? "+" : ""}
        </div>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function AssignedPrograms() {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ProgramSemesterDashboard[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_DATA);
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const totalAssigned = data.reduce((acc, p) => acc + p.semesters.length, 0);
  const totalSubjects = data.reduce(
    (acc, p) => acc + p.semesters.reduce((s, sem) => s + sem.subjectCount, 0), 0
  );

  return (
    <SkeletonTheme baseColor="#ede9e1" highlightColor="#f5f2ee">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700&display=swap');
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <div style={{
        background: "#fff", border: "1px solid #e4e0d8", borderRadius: 20,
        padding: "1.8rem 2rem", fontFamily: "Sora, sans-serif",
        boxShadow: "0 4px 24px rgba(60,50,30,0.07)",
        animation: "fadeIn 0.4s ease both",
      }}>
        {/* Header */}
        {loading ? <SkeletonHeader /> : (
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            marginBottom: 20, paddingBottom: 16,
            borderBottom: "1px solid #ede9e1", flexWrap: "wrap",
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "#edfaf4", border: "1px solid #a3e6c5",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 17, flexShrink: 0,
            }}>📚</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1e1c19" }}>My Classes</div>
              <div style={{ fontSize: 11, color: "#7a7167", marginTop: 2, fontFamily: "DM Mono, monospace" }}>
                rings = subjects per semester
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
              {[
                { value: data.length,    label: "programs",  color: "#16a85a" },
                { value: totalAssigned,  label: "semesters", color: "#3b6ef5" },
                { value: totalSubjects,  label: "subjects",  color: "#e07b2a" },
              ].map((stat, i, arr) => (
                <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: stat.color, fontFamily: "DM Mono, monospace" }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: 10, color: "#7a7167", fontFamily: "DM Mono, monospace" }}>
                      {stat.label}
                    </div>
                  </div>
                  {i < arr.length - 1 && <div style={{ width: 1, height: 28, background: "#ede9e1" }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Program rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {loading
            ? [0, 1, 2].map((i) => <SkeletonProgramRow key={i} />)
            : data.map((program, i) => (
                <ProgramRow key={program.programId} program={program} index={i} />
              ))
          }
        </div>

        {/* Legend */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          marginTop: 18, paddingTop: 14,
          borderTop: "1px solid #ede9e1", flexWrap: "wrap",
        }}>
          {loading ? <SkeletonLegend /> : (
            <>
              <div style={{
                display: "flex", alignItems: "center", gap: 7,
                background: "#fffbf0", border: "1px solid #f0e4b0",
                borderRadius: 8, padding: "4px 10px",
                fontSize: 11, fontFamily: "DM Mono, monospace", color: "#7a7167",
              }}>
                <div style={{
                  width: 12, height: 12, borderRadius: "50%",
                  background: "conic-gradient(#16a85a 0deg 120deg, #3b6ef5 120deg 240deg, #e07b2a 240deg 360deg)",
                  flexShrink: 0,
                }} />
                each <strong style={{ color: "#1e1c19", margin: "0 3px" }}>ring</strong> = 1 subject
              </div>
              <div style={{ width: 1, height: 18, background: "#ede9e1", flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontFamily: "DM Mono, monospace", color: "#7a7167" }}>subject count →</span>
              <LegendRings />
              <div style={{ width: 1, height: 18, background: "#ede9e1", flexShrink: 0 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontFamily: "DM Mono, monospace", color: "#b0a99e" }}>
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#f0ede8", border: "1.5px solid #d8d3ca" }} />
                not assigned
              </div>
              <div style={{ marginLeft: "auto", fontSize: 11, fontFamily: "DM Mono, monospace", color: "#7a7167" }}>
                <span style={{ color: "#16a85a", fontWeight: 700 }}>{totalAssigned}</span>{" "}
                semester{totalAssigned !== 1 ? "s" : ""} assigned
              </div>
            </>
          )}
        </div>
      </div>
    </SkeletonTheme>
  );
}