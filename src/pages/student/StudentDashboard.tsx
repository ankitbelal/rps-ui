import { useState, FC } from "react";

interface Student {
  id: string;
  registrationNumber: string;
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  department: string;
  course: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const studentData: Student = {
  id: "STU-2024-0042",
  registrationNumber: "REG/2024/CSE/0042",
  rollNumber: "24CSE042",
  name: "Aryan Mehta",
  email: "aryan.mehta@university.edu",
  phone: "+91 98765 43210",
  dateOfBirth: "15 March 2004",
  department: "Computer Science & Engineering",
  course: "B.Tech (CSE)",
  address: "204, Shree Residency, Near City Mall",
  city: "Ahmedabad",
  state: "Gujarat",
  pincode: "380015",
};

interface InfoFieldProps {
  label: string;
  value: string;
  accent?: boolean;
}

const InfoField: FC<InfoFieldProps> = ({ label, value, accent = false }) => (
  <div className="info-field">
    <span className="info-label">{label}</span>
    <span className={`info-value ${accent ? "accent" : ""}`}>{value}</span>
  </div>
);

const StudentDashboard: FC = () => {
  const [student] = useState<Student>(studentData);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Root fills entire parent — no max-width, no centering */
        .dashboard-root {
          width: 100%;
          height: 100%;
          min-height: 100vh;
          background: #f1f5f9;
          padding: 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
        }

        /* Card stretches to fill all remaining space */
        .card {
          width: 100%;
          flex: 1;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 1.25rem;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
        }

        /* ── Hero ── */
        .card-hero {
          background: linear-gradient(135deg, #eff6ff 0%, #f8faff 60%, #f0f9ff 100%);
          padding: 2rem 2.5rem 0;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .card-hero::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 280px; height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .card-hero::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #bfdbfe 40%, #bfdbfe 60%, transparent);
        }

        .hero-inner {
          display: flex;
          align-items: flex-end;
          gap: 2rem;
          position: relative;
          z-index: 1;
        }

        .avatar-wrap {
          flex-shrink: 0;
          position: relative;
          padding-bottom: 1.8rem;
        }

        .avatar-ring {
          width: 88px; height: 88px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(135deg, #2563eb, #60a5fa);
          box-shadow: 0 4px 20px rgba(37,99,235,0.2);
        }

        .avatar-img {
          width: 100%; height: 100%;
          border-radius: 50%;
          background: #dbeafe;
          display: block;
          object-fit: cover;
        }

        .avatar-status {
          position: absolute;
          bottom: 1.95rem; right: 2px;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid #fff;
          box-shadow: 0 0 6px rgba(34,197,94,0.5);
        }

        .hero-text {
          padding-bottom: 1.8rem;
          flex: 1;
        }

        .hero-tag {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #2563eb;
          margin-bottom: 0.35rem;
        }

        .hero-name {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 2rem;
          color: #0f172a;
          line-height: 1.15;
          margin-bottom: 0.55rem;
        }

        .hero-meta {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .hero-chip {
          font-size: 0.74rem;
          color: #475569;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 0.28rem 0.8rem;
          border-radius: 999px;
        }

        /* ── ID Strip ── */
        .id-strip {
          display: flex;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
          flex-shrink: 0;
        }

        .id-item {
          flex: 1;
          padding: 1rem 2.5rem;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .id-item:last-child { border-right: none; }

        .id-label {
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          font-weight: 500;
        }

        .id-value {
          font-family: 'Syne', sans-serif;
          font-size: 0.92rem;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 0.03em;
        }

        /* ── Body grid — flex:1 fills remaining height ── */
        .card-body {
          padding: 2rem 2.5rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem 3rem;
          flex: 1;
          align-content: start;
        }

        .section { display: flex; flex-direction: column; }

        .section-title {
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #94a3b8;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, #e2e8f0, transparent);
        }

        .info-field {
          display: flex;
          flex-direction: column;
          padding: 0.65rem 0;
          border-bottom: 1px solid #f1f5f9;
          gap: 0.18rem;
        }

        .info-field:last-child { border-bottom: none; }

        .info-label {
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
          font-weight: 500;
        }

        .info-value {
          font-size: 0.92rem;
          color: #475569;
          font-weight: 400;
          line-height: 1.4;
        }

        .info-value.accent {
          color: #0f172a;
          font-weight: 600;
        }

        .full-width { grid-column: 1 / -1; }

        .address-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0 2rem;
        }

        /* ── Footer ── */
        .card-footer {
          padding: 1rem 2.5rem;
          border-top: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fafbfc;
          flex-shrink: 0;
        }

        .footer-note {
          font-size: 0.72rem;
          color: #94a3b8;
          letter-spacing: 0.04em;
        }

        .footer-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #2563eb;
          opacity: 0.35;
        }

        @media (max-width: 768px) {
          .dashboard-root { padding: 1rem; }
          .card-hero { padding: 1.5rem 1.5rem 0; }
          .hero-name { font-size: 1.5rem; }
          .card-body { grid-template-columns: 1fr; padding: 1.5rem; gap: 1.5rem; }
          .full-width { grid-column: 1; }
          .address-grid { grid-template-columns: 1fr 1fr; }
          .id-item { padding: 0.8rem 1rem; }
          .card-footer { padding: 0.8rem 1.5rem; }
          .avatar-ring { width: 68px; height: 68px; }
        }
      `}</style>

      <div className="dashboard-root">
        <div className="card">
          {/* Hero */}
          <div className="card-hero">
            <div className="hero-inner">
              <div className="avatar-wrap">
                <div className="avatar-ring">
                  <img
                    className="avatar-img"
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan&backgroundColor=dbeafe"
                    alt={student.name}
                  />
                </div>
                <div className="avatar-status" title="Active" />
              </div>
              <div className="hero-text">
                <div className="hero-name">{student.name}</div>
                <div className="hero-meta">
                  <span className="hero-chip">{student.course}</span>
                  <span className="hero-chip">{student.department}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ID Strip */}
          <div className="id-strip">
            <div className="id-item">
              <span className="id-label">Student ID</span>
              <span className="id-value">{student.id}</span>
            </div>
            <div className="id-item">
              <span className="id-label">Registration No.</span>
              <span className="id-value">{student.registrationNumber}</span>
            </div>
            <div className="id-item">
              <span className="id-label">Roll Number</span>
              <span className="id-value">{student.rollNumber}</span>
            </div>
          </div>

          {/* Body */}
          <div className="card-body">
            <div className="section">
              <div className="section-title">Personal Info</div>
              <InfoField label="Full Name" value={student.name} accent />
              <InfoField label="Date of Birth" value={student.dateOfBirth} />
              <InfoField label="Email Address" value={student.email} />
              <InfoField label="Phone Number" value={student.phone} />
            </div>

            <div className="section">
              <div className="section-title">Academic Info</div>
              <InfoField label="Course" value={student.course} accent />
              <InfoField label="Department" value={student.department} />
              <InfoField
                label="Registration No."
                value={student.registrationNumber}
              />
              <InfoField label="Roll Number" value={student.rollNumber} />
            </div>

            <div className="section full-width">
              <div className="section-title">Address</div>
              <InfoField label="Street Address" value={student.address} />
              <div className="address-grid">
                <InfoField label="City" value={student.city} />
                <InfoField label="State" value={student.state} />
                <InfoField label="Pincode" value={student.pincode} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="card-footer">
            <span className="footer-note">Last updated: March 2026</span>
            <div className="footer-dot" />
            <span className="footer-note">Profile verified ✓</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
