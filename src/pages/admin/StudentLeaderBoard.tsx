import React, { useState, useRef } from "react";
import { Card } from "react-bootstrap";
import "./StudentLeaderBoard.css";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const programs = [
  {
    id: "all",
    code: "ALL",
    label: "All Programs",
    color: "#6366f1",
    bg: "#eef2ff",
  },
  {
    id: "bca",
    code: "BCA",
    label: "Bachelor of Computer Applications",
    color: "#0ea5e9",
    bg: "#e0f2fe",
  },
  {
    id: "bba",
    code: "BBA",
    label: "Bachelor of Business Administration",
    color: "#f59e0b",
    bg: "#fef3c7",
  },
  {
    id: "bsc",
    code: "B.Sc",
    label: "Bachelor of Science",
    color: "#10b981",
    bg: "#d1fae5",
  },
  {
    id: "bcom",
    code: "B.Com",
    label: "Bachelor of Commerce",
    color: "#8b5cf6",
    bg: "#ede9fe",
  },
  {
    id: "btech",
    code: "B.Tech",
    label: "Bachelor of Technology",
    color: "#ef4444",
    bg: "#fee2e2",
  },
  {
    id: "mca",
    code: "MCA",
    label: "Master of Computer Applications",
    color: "#06b6d4",
    bg: "#cffafe",
  },
  {
    id: "mba",
    code: "MBA",
    label: "Master of Business Administration",
    color: "#f97316",
    bg: "#ffedd5",
  },
  {
    id: "msc",
    code: "M.Sc",
    label: "Master of Science",
    color: "#84cc16",
    bg: "#ecfccb",
  },
  {
    id: "llb",
    code: "LLB",
    label: "Bachelor of Laws",
    color: "#ec4899",
    bg: "#fce7f3",
  },
  {
    id: "bfa",
    code: "BFA",
    label: "Bachelor of Fine Arts",
    color: "#a78bfa",
    bg: "#f5f3ff",
  },
];

interface Student {
  name: string;
  id: string;
  program: string;
  sem: number;
  gpa: number;
  score: number;
}

const allStudents: Student[] = [
  {
    name: "Aisha Mehta",
    id: "2401",
    program: "bca",
    sem: 6,
    gpa: 4.0,
    score: 98.4,
  },
  {
    name: "Ryu Tanaka",
    id: "2308",
    program: "bba",
    sem: 4,
    gpa: 3.97,
    score: 97.1,
  },
  {
    name: "Sofia Reyes",
    id: "2219",
    program: "btech",
    sem: 8,
    gpa: 3.95,
    score: 96.5,
  },
  {
    name: "Luca Ferreira",
    id: "2407",
    program: "mca",
    sem: 3,
    gpa: 3.92,
    score: 95.2,
  },
  {
    name: "Priya Sharma",
    id: "2315",
    program: "bsc",
    sem: 5,
    gpa: 3.9,
    score: 94.8,
  },
  {
    name: "Omar El-Amin",
    id: "2122",
    program: "mba",
    sem: 2,
    gpa: 3.88,
    score: 94.1,
  },
  {
    name: "Elena Kovacs",
    id: "2430",
    program: "bcom",
    sem: 4,
    gpa: 3.86,
    score: 93.7,
  },
  {
    name: "James Okafor",
    id: "2211",
    program: "llb",
    sem: 6,
    gpa: 3.84,
    score: 93.0,
  },
  {
    name: "Mei-Ling Wu",
    id: "2329",
    program: "msc",
    sem: 3,
    gpa: 3.82,
    score: 92.6,
  },
  {
    name: "Arjun Patel",
    id: "2418",
    program: "bfa",
    sem: 5,
    gpa: 3.8,
    score: 92.1,
  },
  {
    name: "Natalie Brooks",
    id: "2501",
    program: "bba",
    sem: 3,
    gpa: 3.98,
    score: 97.8,
  },
  {
    name: "Vikram Singh",
    id: "2502",
    program: "btech",
    sem: 7,
    gpa: 3.99,
    score: 98.7,
  },
  {
    name: "Linh Nguyen",
    id: "2503",
    program: "msc",
    sem: 4,
    gpa: 4.0,
    score: 99.1,
  },
  {
    name: "Charlotte Dupont",
    id: "2504",
    program: "llb",
    sem: 5,
    gpa: 3.97,
    score: 97.6,
  },
  {
    name: "Miriam Santos",
    id: "2505",
    program: "bfa",
    sem: 6,
    gpa: 3.96,
    score: 97.2,
  },
  {
    name: "Kwame Asante",
    id: "2506",
    program: "bba",
    sem: 4,
    gpa: 3.95,
    score: 96.9,
  },
  {
    name: "Zara Ahmed",
    id: "2507",
    program: "btech",
    sem: 6,
    gpa: 3.96,
    score: 97.3,
  },
  {
    name: "Samuel Oduya",
    id: "2508",
    program: "mca",
    sem: 2,
    gpa: 3.98,
    score: 98.0,
  },
  {
    name: "Rohan Verma",
    id: "2509",
    program: "llb",
    sem: 3,
    gpa: 3.94,
    score: 96.7,
  },
  {
    name: "Kenji Watanabe",
    id: "2510",
    program: "bfa",
    sem: 5,
    gpa: 3.93,
    score: 96.4,
  },
  {
    name: "Hana Yoshida",
    id: "2511",
    program: "bba",
    sem: 2,
    gpa: 3.87,
    score: 94.7,
  },
  {
    name: "Chidinma Eze",
    id: "2512",
    program: "btech",
    sem: 5,
    gpa: 3.89,
    score: 95.1,
  },
  {
    name: "Anna Petrov",
    id: "2513",
    program: "msc",
    sem: 3,
    gpa: 3.96,
    score: 97.4,
  },
  {
    name: "Fatou Diop",
    id: "2514",
    program: "llb",
    sem: 4,
    gpa: 3.92,
    score: 96.0,
  },
  {
    name: "Amira Benali",
    id: "2515",
    program: "bfa",
    sem: 3,
    gpa: 3.91,
    score: 95.8,
  },
  {
    name: "Tom Christiansen",
    id: "2516",
    program: "bca",
    sem: 4,
    gpa: 3.88,
    score: 95.0,
  },
  {
    name: "Yuki Nakamura",
    id: "2517",
    program: "btech",
    sem: 4,
    gpa: 3.91,
    score: 95.9,
  },
  {
    name: "Ibrahim Khalil",
    id: "2518",
    program: "mca",
    sem: 4,
    gpa: 3.93,
    score: 96.2,
  },
  {
    name: "Diego Romero",
    id: "2519",
    program: "bba",
    sem: 5,
    gpa: 3.9,
    score: 95.5,
  },
  {
    name: "Priyanka Reddy",
    id: "2520",
    program: "bsc",
    sem: 6,
    gpa: 3.86,
    score: 94.3,
  },
];

const avatarGradients = [
  ["#667eea", "#764ba2"],
  ["#f093fb", "#f5576c"],
  ["#4facfe", "#00f2fe"],
  ["#43e97b", "#38f9d7"],
  ["#fa709a", "#fee140"],
  ["#a18cd1", "#fbc2eb"],
  ["#fccb90", "#d57eeb"],
  ["#a1c4fd", "#c2e9fb"],
  ["#fd7043", "#ff8a65"],
  ["#26c6da", "#00acc1"],
];

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

function getProgram(id: string) {
  return programs.find((p) => p.id === id) ?? programs[0];
}

function semLabel(s: number): string {
  const sfx = ["st", "nd", "rd", "th", "th", "th", "th", "th"];
  return `${s}${sfx[s - 1]} Sem`;
}

function scoreColor(s: number): string {
  if (s >= 97) return "#10b981";
  if (s >= 95) return "#6366f1";
  if (s >= 93) return "#f59e0b";
  return "#9ca3af";
}

function medal(i: number): string | null {
  if (i === 0) return "🥇";
  if (i === 1) return "🥈";
  if (i === 2) return "🥉";
  return null;
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const StudentLeaderboard: React.FC = () => {
  const [active, setActive] = useState("all");
  const pillsRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ on: false, startX: 0, scrollL: 0 });

  const filtered = (
    active === "all"
      ? [...allStudents]
      : allStudents.filter((s) => s.program === active)
  )
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const prog = getProgram(active);

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

  return (
    <div className="slb-wrap">
      <Card className="slb-card h-100">
        {/* ── Card Header ── */}
        <Card.Header className="slb-card-header">
          {/* Title row */}
          <div className="slb-title-row">
            <h5 className="slb-title">
              Student <span>Leaderboard</span>
            </h5>
            <div className="slb-header-badges">
              <span className="slb-badge-sem">Sem VI · 2024–25</span>
              <span className="slb-badge-ay">AY 2024–25</span>
            </div>
          </div>

          {/* Active program strip */}
          <div
            className="slb-prog-strip"
            style={{
              background: prog.bg,
              borderColor: prog.color + "30",
            }}
          >
            <div className="slb-strip-dot" style={{ background: prog.color }} />
            <span className="slb-strip-code" style={{ color: prog.color }}>
              {prog.code}
            </span>
            <span className="slb-strip-label">{prog.label}</span>
            <span
              className="slb-strip-tag"
              style={{ background: prog.color + "18", color: prog.color }}
            >
              Sem VI
            </span>
            <span
              className="slb-strip-tag"
              style={{ background: prog.color + "12", color: prog.color }}
            >
              {filtered.length} students
            </span>
          </div>

          {/* Program pills */}
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
              {programs.map((p) => {
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
              })}
            </div>
            <button className="slb-scroll-btn" onClick={() => scroll(1)}>
              ›
            </button>
          </div>
        </Card.Header>

        {/* ── Table Head ── */}
        <div className="slb-thead">
          <div className="slb-th">#</div>
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
            {filtered.length === 0 ? (
              <div className="slb-empty">
                📭 No students found for this program.
              </div>
            ) : (
              filtered.map((s, i) => {
                const sp = getProgram(s.program);
                const grad = avatarGradients[i % avatarGradients.length];
                const barW = Math.max(
                  0,
                  Math.round(((s.score - 88) / 12) * 100),
                );
                const sc = scoreColor(s.score);
                const m = medal(i);
                const topCls =
                  i === 0 ? "t1" : i === 1 ? "t2" : i === 2 ? "t3" : "";

                return (
                  <div
                    key={s.id + i}
                    className={`slb-row ${topCls}`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {/* Rank */}
                    <div className="slb-rank">
                      {m ? (
                        <span className="slb-medal">{m}</span>
                      ) : (
                        <span className="slb-rnum">{i + 1}</span>
                      )}
                    </div>

                    {/* Student info */}
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
                          <span className="slb-sid">#{s.id}</span>
                          <span
                            className="slb-stag"
                            style={{ background: sp.bg, color: sp.color }}
                          >
                            {sp.code}
                          </span>
                          <span className="slb-ssem">{semLabel(s.sem)}</span>
                        </div>
                      </div>
                    </div>

                    {/* GPA */}
                    <div className="slb-gpa">{s.gpa.toFixed(2)}</div>

                    {/* Score */}
                    <div className="slb-score" style={{ color: sc }}>
                      {s.score.toFixed(1)}%
                    </div>

                    {/* Bar */}
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
          <div className="slb-fl">Top {filtered.length} · By Score</div>
          <div className="slb-fr">
            <div className="slb-live" />
            Live
            <span className="slb-sep">·</span>
            Sem VI 2024–25
            <span className="slb-sep">·</span>
            {prog.code}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentLeaderboard;
