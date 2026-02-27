import React, { useState, useRef, useMemo } from "react";
import { Card } from "react-bootstrap";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetTopStudentsQuery } from "../../../features/admin/dashboard/dahboardApi";
import { useGetProgramsQuery } from "../../../features/admin/students/studentApi";
import "./css/StudentLeaderBoard.css";
import { StudentWithResult } from "../../../features/admin/dashboard/utils";
import { ProgramList } from "../../../features/admin/students/utils";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface Program {
  id: string;
  apiId: number | null;
  code: string;
  label: string;
  color: string;
  bg: string;
}

type ExamTermOption = "F" | "S" | "FINAL";

const EXAM_TERMS: { id: ExamTermOption; label: string }[] = [
  { id: "F", label: "First Term" },
  { id: "S", label: "Second Term" },
  { id: "FINAL", label: "Final" },
];

const GOLDEN_RATIO = 0.618033988749895;

function generateProgramColor(index: number): { color: string; bg: string } {
  const hue = Math.round(((index * GOLDEN_RATIO) % 1) * 360);
  return {
    color: `hsl(${hue}, 70%, 45%)`,
    bg: `hsl(${hue}, 80%, 95%)`,
  };
}

function generateAvatarGradient(id: number): [string, string] {
  const hue1 = Math.round(((id * GOLDEN_RATIO) % 1) * 360);
  const hue2 = (hue1 + 40) % 360;
  return [`hsl(${hue1}, 75%, 55%)`, `hsl(${hue2}, 80%, 40%)`];
}

const ALL_PROGRAM: Program = {
  id: "all",
  apiId: null,
  code: "ALL",
  label: "All Programs",
  color: "#6366f1",
  bg: "#eef2ff",
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function semLabel(s: number): string {
  const sfx = ["st", "nd", "rd", "th", "th", "th", "th", "th"];
  return `${s}${sfx[s - 1]} Sem`;
}

function scoreColor(s: number): string {
  if (s >= 85) return "#10b981";
  if (s >= 70) return "#6366f1";
  if (s >= 55) return "#f59e0b";
  return "#9ca3af";
}

function termLabel(t: ExamTermOption): string {
  if (t === "F") return "First Term";
  if (t === "S") return "Second Term";
  return "Final Term";
}

/* ─────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────── */
const EmptyState: React.FC = () => (
  <div className="slb-empty-state">
    <div className="slb-empty-icon">
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Graduation cap */}
        <ellipse cx="40" cy="38" rx="22" ry="6" fill="#e0e7ff" />
        <polygon points="40,18 66,32 40,38 14,32" fill="#c7d2fe" />
        <polygon points="40,18 66,32 40,26 14,32" fill="#a5b4fc" />
        <rect x="63" y="32" width="3" height="14" rx="1.5" fill="#a5b4fc" />
        <circle cx="64.5" cy="47" r="3" fill="#6366f1" />
        {/* X marks */}
        <line
          x1="28"
          y1="54"
          x2="34"
          y2="60"
          stroke="#d1d5db"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="34"
          y1="54"
          x2="28"
          y2="60"
          stroke="#d1d5db"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="46"
          y1="54"
          x2="52"
          y2="60"
          stroke="#d1d5db"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="52"
          y1="54"
          x2="46"
          y2="60"
          stroke="#d1d5db"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
    <p className="slb-empty-title">No students found</p>
    <p className="slb-empty-sub">Try selecting a different program or term</p>
  </div>
);

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const StudentLeaderboard: React.FC = () => {
  const [active, setActive] = useState("all");
  const [examTerm, setExamTerm] = useState<ExamTermOption>("FINAL");

  const pillsRef = useRef<HTMLDivElement>(null);
  const termPillRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ on: false, startX: 0, scrollL: 0 });

  /* ── Programs API ── */
  const { data: programsRes, isLoading: programsLoading } =
    useGetProgramsQuery();

  /* ── Build program list dynamically ── */
  const programs = useMemo<Program[]>(() => {
    const apiList: ProgramList[] = programsRes?.data ?? [];
    const dynamic: Program[] = apiList.map((ap, index) => ({
      id: ap.code.toLowerCase(),
      apiId: ap.id,
      code: ap.code,
      label: ap.name,
      ...generateProgramColor(index),
    }));
    return [ALL_PROGRAM, ...dynamic];
  }, [programsRes]);

  /* ── Active program object ── */
  const prog = useMemo(
    () => programs.find((p) => p.id === active) ?? ALL_PROGRAM,
    [programs, active],
  );

  /* ── Top Students API ── */
  const { data: topStudentsRes, isLoading: studentsLoading } =
    useGetTopStudentsQuery(
      {
        ...(active !== "all" && prog.apiId ? { programId: prog.apiId } : {}),
        examTerm,
      },
      { skip: programsLoading },
    );

  const students: StudentWithResult[] = topStudentsRes?.data ?? [];

  /* ── Lookup program by apiId ── */
  const getProgramByApiId = (apiId: number): Program =>
    programs.find((p) => p.apiId === apiId) ?? ALL_PROGRAM;

  /* ── Scroll + drag ── */
  const scroll = (dir: number) =>
    pillsRef.current?.scrollBy({ left: dir * 150, behavior: "smooth" });

  const onMD = (e: React.MouseEvent) => {
    if (!pillsRef.current) return;
    drag.current = {
      on: true,
      startX: e.pageX - pillsRef.current.offsetLeft,
      scrollL: pillsRef.current.scrollLeft,
    };
  };
  const onMM = (e: React.MouseEvent) => {
    if (!drag.current.on || !pillsRef.current) return;
    e.preventDefault();
    pillsRef.current.scrollLeft =
      drag.current.scrollL -
      (e.pageX - pillsRef.current.offsetLeft - drag.current.startX);
  };
  const onMU = () => {
    drag.current.on = false;
  };

  const isLoading = programsLoading || studentsLoading;

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e9eaf0">
      <div className="slb-wrap">
        <Card className="slb-card h-100">
          {/* ── Card Header ── */}
          <Card.Header className="slb-card-header">
            {/* Title row */}
            <div className="slb-title-row">
              <h5 className="slb-title">
                Student <span>Leaderboard</span>
              </h5>
              {programsLoading ? (
                <Skeleton width={80} height={22} borderRadius={100} />
              ) : (
                <span className="slb-badge-sem">{termLabel(examTerm)}</span>
              )}
            </div>

            {/* Active program strip */}
            {programsLoading ? (
              <div style={{ marginBottom: 12 }}>
                <Skeleton height={38} borderRadius={10} />
              </div>
            ) : (
              <div
                className="slb-prog-strip"
                style={{ background: prog.bg, borderColor: prog.color + "30" }}
              >
                <div
                  className="slb-strip-dot"
                  style={{ background: prog.color }}
                />
                <span className="slb-strip-code" style={{ color: prog.color }}>
                  {prog.code}
                </span>
                <span className="slb-strip-label">{prog.label}</span>
                <span
                  className="slb-strip-tag"
                  style={{ background: prog.color + "18", color: prog.color }}
                >
                  {termLabel(examTerm)}
                </span>
                <span
                  className="slb-strip-tag"
                  style={{ background: prog.color + "12", color: prog.color }}
                >
                  {students.length} students
                </span>
              </div>
            )}

            {/* ── Exam Term pills ── */}
            <div className="slb-pills-row" style={{ marginBottom: 8 }}>
              {programsLoading ? (
                <div style={{ display: "flex", gap: 6 }}>
                  {[1, 2, 3].map((k) => (
                    <Skeleton
                      key={k}
                      width={80}
                      height={26}
                      borderRadius={100}
                    />
                  ))}
                </div>
              ) : (
                <div
                  ref={termPillRef}
                  className="slb-pills-track"
                  style={{ flex: "unset" }}
                >
                  {EXAM_TERMS.map((t) => {
                    const isActive = examTerm === t.id;
                    return (
                      <button
                        key={t.id}
                        className="slb-pill"
                        style={
                          isActive
                            ? {
                                background: "#6366f1",
                                color: "#fff",
                                borderColor: "#6366f1",
                                boxShadow: "0 3px 10px #6366f138",
                                transform: "translateY(-1px)",
                              }
                            : {}
                        }
                        onClick={() => setExamTerm(t.id)}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Program pills ── */}
            <div className="slb-pills-row">
              <button className="slb-scroll-btn" onClick={() => scroll(-1)}>
                ‹
              </button>
              <div
                className="slb-pills-track"
                ref={pillsRef}
                onMouseDown={onMD}
                onMouseMove={onMM}
                onMouseUp={onMU}
                onMouseLeave={onMU}
              >
                {programsLoading ? (
                  <>
                    {[52, 48, 60, 44, 56].map((w, k) => (
                      <Skeleton
                        key={k}
                        width={w}
                        height={26}
                        borderRadius={100}
                      />
                    ))}
                  </>
                ) : (
                  programs.map((p) => {
                    const isActive = active === p.id;
                    return (
                      <button
                        key={p.id}
                        className="slb-pill"
                        style={
                          isActive
                            ? {
                                background: p.color,
                                color: "#fff",
                                borderColor: p.color,
                                boxShadow: `0 3px 10px ${p.color}38`,
                                transform: "translateY(-1px)",
                              }
                            : {}
                        }
                        onClick={() => setActive(p.id)}
                      >
                        {p.code}
                      </button>
                    );
                  })
                )}
              </div>
              <button className="slb-scroll-btn" onClick={() => scroll(1)}>
                ›
              </button>
            </div>
          </Card.Header>

          {/* ── Table Head ── */}
          <div className="slb-thead">
            <div className="slb-th">Student</div>
            <div className="slb-th r">GPA</div>
            <div className="slb-th r">Score</div>
            <div className="slb-th r">Perf.</div>
          </div>

          {/* ── Body ── */}
          <Card.Body
            className="p-0"
            style={{ overflowY: "auto", maxHeight: 380 }}
          >
            <div className="slb-body">
              {isLoading ? (
                /* ── Row skeletons ── */
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="slb-row">
                    <div className="slb-student">
                      <Skeleton width={36} height={36} borderRadius={10} />
                      <div>
                        <Skeleton
                          width={130}
                          height={13}
                          borderRadius={4}
                          style={{ marginBottom: 6 }}
                        />
                        <Skeleton width={90} height={10} borderRadius={4} />
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Skeleton width={34} height={13} borderRadius={4} />
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Skeleton width={44} height={13} borderRadius={4} />
                    </div>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Skeleton width={48} height={4} borderRadius={3} />
                    </div>
                  </div>
                ))
              ) : students.length === 0 ? (
                <EmptyState />
              ) : (
                students.map((s, i) => {
                  const sp = getProgramByApiId(s.programId);
                  const grad = generateAvatarGradient(s.studentId);
                  const barW = Math.max(
                    0,
                    Math.round(((s.percentage - 50) / 50) * 100),
                  );
                  const sc = scoreColor(s.percentage);

                  return (
                    <div
                      key={s.studentId}
                      className="slb-row"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <div className="slb-student">
                        <div
                          className="slb-avatar"
                          style={{
                            background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
                          }}
                        >
                          {getInitials(s.name)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div className="slb-sname">{s.name}</div>
                          <div className="slb-smeta">
                            <span className="slb-sid">#{s.rollNumber}</span>
                            <span
                              className="slb-stag"
                              style={{ background: sp.bg, color: sp.color }}
                            >
                              {sp.code}
                            </span>
                            <span className="slb-ssem">
                              {semLabel(s.semester)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="slb-gpa">
                        {s.gpa != null ? s.gpa.toFixed(2) : "—"}
                      </div>

                      <div className="slb-score" style={{ color: sc }}>
                        {s.percentage.toFixed(1)}%
                      </div>

                      <div className="slb-bar">
                        <div className="slb-bar-track">
                          <div
                            className="slb-bar-fill"
                            style={{ width: `${barW}%`, background: sc }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card.Body>

          {/* ── Footer ── */}
          <div className="slb-footer">
            <div className="slb-fl">Top {students.length} · By GPA</div>
            <div className="slb-fr">
              {termLabel(examTerm)}
              <span className="slb-sep">·</span>
              {prog.code}
            </div>
          </div>
        </Card>
      </div>
    </SkeletonTheme>
  );
};

export default StudentLeaderboard;
