import React from "react";
import { Modal, Button, Alert, Spinner } from "react-bootstrap";
import {
  FaGraduationCap,
  FaExclamationTriangle,
  FaCheckCircle,
  FaLayerGroup,
  FaFileAlt,
} from "react-icons/fa";
import { useGetProgramsQuery } from "../../../../features/admin/students/studentApi";

export interface Program {
  id: string;
  name: string;
  code: string;
  totalSemesters: number;
}

interface PromoteStudentsModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: (programId: string, semesters: number[], examTerm: string) => void;
  isLoading?: boolean;
}

const ResultPublishModal: React.FC<PromoteStudentsModalProps> = ({
  show,
  onHide,
  onConfirm,
  isLoading = false,
}) => {
  const { data: programData, isLoading: isProgramLoading } =
    useGetProgramsQuery();

  const [selectedProgram, setSelectedProgram] = React.useState<string>("");
  const [selectedSemesters, setSelectedSemesters] = React.useState<number[]>(
    [],
  );
  const [examTerm, setExamTerm] = React.useState<string>("");

  const programs = programData?.data;

  const selectedProgramDetails = React.useMemo(() => {
    if (!selectedProgram || !programs) return null;
    return programs.find((p) => p.id === Number(selectedProgram));
  }, [selectedProgram, programs]);

  const semesterList = React.useMemo(() => {
    if (!selectedProgramDetails) return [];
    return Array.from(
      { length: selectedProgramDetails.totalSemesters },
      (_, i) => i + 1,
    );
  }, [selectedProgramDetails]);

  React.useEffect(() => {
    setSelectedSemesters([]);
  }, [selectedProgram]);
  React.useEffect(() => {
    if (!show) {
      setSelectedProgram("");
      setSelectedSemesters([]);
      setExamTerm("");
    }
  }, [show]);

  const toggleSemester = (sem: number) =>
    setSelectedSemesters((prev) =>
      prev.includes(sem) ? prev.filter((s) => s !== sem) : [...prev, sem],
    );

  const allSelected =
    semesterList.length > 0 && selectedSemesters.length === semesterList.length;
  const toggleAll = () =>
    setSelectedSemesters(allSelected ? [] : [...semesterList]);

  const handleConfirm = () => {
    if (!selectedProgram || !selectedSemesters.length || !examTerm) return;
    onConfirm(
      selectedProgram,
      [...selectedSemesters].sort((a, b) => a - b),
      examTerm,
    );
  };

  const handleClose = () => {
    setSelectedProgram("");
    setSelectedSemesters([]);
    setExamTerm("");
    onHide();
  };

  /* reusable label style */
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontWeight: 600,
    fontSize: "13px",
    color: "#344054",
    marginBottom: "6px",
  };

  /* reusable hint style */
  const hintStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#667085",
    marginTop: "5px",
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      {/* ── Header ── */}
      <Modal.Header
        closeButton
        style={{ padding: "18px 28px 16px", borderBottom: "1px solid #f0f0f0" }}
      >
        <Modal.Title
          style={{
            fontSize: "16px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              background: "#e7f1ff",
              borderRadius: "8px",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FaFileAlt size={16} color="#0d6efd" />
          </span>
          Publish Result
        </Modal.Title>
      </Modal.Header>

      {/* ── Body ── */}
      <Modal.Body style={{ padding: "20px 28px 20px" }}>
        {/* Warning */}
        <Alert
          variant="warning"
          style={{
            borderRadius: "10px",
            padding: "11px 14px",
            marginBottom: "22px",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            fontSize: "13px",
          }}
        >
          <FaExclamationTriangle
            size={15}
            style={{ marginTop: "1px", flexShrink: 0, color: "#856404" }}
          />
          <span>
            <strong>Note:</strong> Plese Ensure all marks (or Terminal result if
            publishing final result) are finalized before publishing.An email
            notification will be triggered to students as well as publisher,
            once the job is completed.
          </span>
        </Alert>

        {/* ── All sections full-width, no Bootstrap Form wrapper ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Program + Result Type — side by side */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {/* Program */}
            <div>
              <label style={labelStyle}>
                Program <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                disabled={isProgramLoading || isLoading}
                style={{
                  display: "block",
                  width: "100%",
                  fontSize: "13.5px",
                  borderRadius: "8px",
                  border: "1px solid #d0d5dd",
                  padding: "9px 12px",
                  backgroundColor: "#fff",
                  color: "#344054",
                  outline: "none",
                  cursor:
                    isProgramLoading || isLoading ? "not-allowed" : "pointer",
                  boxSizing: "border-box",
                  appearance: "auto",
                }}
              >
                <option value="">— Choose a program —</option>
                {programs?.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name} ({program.code})
                  </option>
                ))}
              </select>
              <div style={hintStyle}>
                {isProgramLoading
                  ? "Loading programs…"
                  : "Program to publish results for"}
              </div>
            </div>

            {/* Result Type */}
            <div>
              <label style={labelStyle}>
                Result Type <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <select
                value={examTerm}
                onChange={(e) => setExamTerm(e.target.value)}
                disabled={isLoading}
                style={{
                  display: "block",
                  width: "100%",
                  fontSize: "13.5px",
                  borderRadius: "8px",
                  border: "1px solid #d0d5dd",
                  padding: "9px 12px",
                  backgroundColor: "#fff",
                  color: examTerm ? "#344054" : "#9ca3af",
                  outline: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  boxSizing: "border-box",
                  appearance: "auto",
                }}
              >
                <option value="">— Choose result type —</option>
                <option value="F">First Terminal</option>
                <option value="S">Second Terminal</option>
                <option value="FINAL">Final Result</option>
              </select>
              <div style={hintStyle}>Examination term to publish</div>
            </div>
          </div>

          {/* Program info chip — full width */}
          {selectedProgramDetails && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "10px",
                padding: "13px 16px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <FaCheckCircle
                size={18}
                color="#16a34a"
                style={{ flexShrink: 0 }}
              />
              <div>
                <div
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 700,
                    color: "#166534",
                  }}
                >
                  {selectedProgramDetails.name}
                  <span
                    style={{
                      fontWeight: 500,
                      color: "#86efac",
                      marginLeft: "6px",
                      fontSize: "12px",
                    }}
                  >
                    ({selectedProgramDetails.code})
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#15803d",
                    marginTop: "3px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <FaLayerGroup size={11} />
                  {selectedProgramDetails.totalSemesters} semesters total
                </div>
              </div>
            </div>
          )}

          {/* Semester picker — show as soon as program selected */}
          {semesterList.length > 0 && (
            <div>
              {/* Label row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <label style={{ ...labelStyle, marginBottom: 0 }}>
                  Semesters <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <button
                  type="button"
                  onClick={toggleAll}
                  disabled={isLoading}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#0d6efd",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {allSelected ? "Deselect All" : "Select All"}
                </button>
              </div>

              {/* Picker box — full width */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "14px",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                {/* Count */}
                <div
                  style={{
                    fontSize: "12px",
                    color: "#667085",
                    marginBottom: "10px",
                  }}
                >
                  {selectedSemesters.length === 0
                    ? "No semesters selected"
                    : `${selectedSemesters.length} of ${semesterList.length} selected`}
                </div>

                {/* 4-column grid pills */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                    width: "100%",
                  }}
                >
                  {semesterList.map((sem) => {
                    const active = selectedSemesters.includes(sem);
                    return (
                      <button
                        key={sem}
                        type="button"
                        onClick={() => toggleSemester(sem)}
                        disabled={isLoading}
                        style={{
                          padding: "8px 0",
                          borderRadius: "999px",
                          border: `1.5px solid ${active ? "#0d6efd" : "#cbd5e1"}`,
                          backgroundColor: active ? "#dbeafe" : "#ffffff",
                          color: active ? "#1d4ed8" : "#475569",
                          fontWeight: active ? 600 : 500,
                          fontSize: "12.5px",
                          cursor: isLoading ? "not-allowed" : "pointer",
                          transition:
                            "border-color 0.12s, background-color 0.12s, color 0.12s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "5px",
                          boxShadow: active
                            ? "0 0 0 3px rgba(13,110,253,0.12)"
                            : "0 1px 2px rgba(0,0,0,0.04)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {active && (
                          <FaCheckCircle size={10} style={{ flexShrink: 0 }} />
                        )}
                        Sem {sem}
                      </button>
                    );
                  })}
                </div>

                {/* Selected summary */}
                {selectedSemesters.length > 0 && (
                  <div
                    style={{
                      marginTop: "12px",
                      paddingTop: "10px",
                      borderTop: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#667085",
                        fontWeight: 500,
                      }}
                    >
                      Publishing for:
                    </span>
                    {[...selectedSemesters]
                      .sort((a, b) => a - b)
                      .map((s) => (
                        <span
                          key={s}
                          style={{
                            background: "#dbeafe",
                            color: "#1d4ed8",
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "2px 9px",
                            borderRadius: "999px",
                            border: "1px solid #bfdbfe",
                          }}
                        >
                          Sem {s}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <div style={hintStyle}>
                You can select multiple semesters at once
              </div>
            </div>
          )}
        </div>
      </Modal.Body>

      {/* ── Footer ── */}
      <Modal.Footer
        style={{
          borderTop: "1px solid #f0f0f0",
          padding: "14px 28px",
          gap: "10px",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="outline-secondary"
          onClick={handleClose}
          disabled={isLoading}
          style={{
            borderRadius: "8px",
            fontSize: "13.5px",
            padding: "8px 20px",
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={
            !selectedProgram ||
            !selectedSemesters.length ||
            !examTerm ||
            isLoading
          }
          style={{
            borderRadius: "8px",
            fontSize: "13.5px",
            padding: "8px 22px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" animation="border" />
              Publishing...
            </>
          ) : (
            <>
              <FaGraduationCap size={14} />
              Publish Result
              {selectedSemesters.length > 0 && (
                <span
                  style={{
                    background: "rgba(255,255,255,0.25)",
                    borderRadius: "999px",
                    fontSize: "11px",
                    padding: "1px 8px",
                    fontWeight: 700,
                  }}
                >
                  {selectedSemesters.length} sem
                </span>
              )}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResultPublishModal;
