import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Form,
  Button,
} from "react-bootstrap";
import { FaStar, FaChevronDown } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetPublishedResultQuery } from "../../../../features/admin/students/studentApi";
import { ResultData } from "../../../../features/admin/students/utils";
import { Clock, Edit } from "lucide-react";

interface StudentResultTimelineProps {
  studentId?: number;
  currentSemester?: number;
}

const StudentResultTimeline: React.FC<StudentResultTimelineProps> = ({
  studentId,
  currentSemester,
}) => {
  const [openSemesterId, setOpenSemesterId] = useState<number | null>(null);
  const [selectedTerminal, setSelectedTerminal] = useState("FINAL");
  const [semesterFilter, setSemesterFilter] = useState<string | number>("");
  const [viewMode, setViewMode] = useState<"all" | "current">("all");

  const queryParams = useMemo(
    () => ({
      studentId: studentId!,
      examTerm: selectedTerminal,
      semester: semesterFilter,
    }),
    [studentId, selectedTerminal, semesterFilter],
  );

  const {
    data: resultData,
    isLoading,
    isFetching,
  } = useGetPublishedResultQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (viewMode === "all") {
      setSemesterFilter("");
      setSelectedTerminal("FINAL");
    } else if (viewMode === "current") {
      setSemesterFilter(currentSemester!);
      setSelectedTerminal("");
    }
  }, [currentSemester, viewMode]);

  const toggleSemester = (id: number) => {
    setOpenSemesterId(openSemesterId === id ? null : id);
  };

  const getGradeClass = (grade: string): string => {
    if (grade.startsWith("A")) return "success";
    if (grade.startsWith("B")) return "info";
    if (grade.startsWith("C")) return "warning";
    if (grade.startsWith("D")) return "secondary";
    return "danger";
  };

  const getComputedTerminal = (term: string): string => {
    switch (term) {
      case "F":
        return "1st Terminal";
      case "S":
        return "2nd Terminal";
      case "FINAL":
        return "Final Result";
      default:
        return "";
    }
  };

  const getBarColor = (grade: string): string => {
    if (grade.startsWith("A")) return "#198754";
    if (grade.startsWith("B")) return "#0dcaf0";
    if (grade.startsWith("C")) return "#ffc107";
    if (grade.startsWith("D")) return "#81807d";
    return "#dc3545";
  };

  const getGpaPercentage = (gpa: number): string => {
    return ((gpa / 4.0) * 100).toFixed(0);
  };

  // Dynamic color driven by GPA — mirrors the grade colour scheme
  const getGpaColor = (gpa: number): string => {
    if (gpa >= 3.7) return "#198754"; // A → green
    if (gpa >= 3.0) return "#0dcaf0"; // B → cyan
    if (gpa >= 2.0) return "#ffc107"; // C → yellow
    if (gpa >= 1.0) return "#81807d"; // D → grey
    return "#dc3545"; // F → red
  };

  const getGpaBg = (gpa: number): string => {
    if (gpa >= 3.7) return "rgba(25,135,84,0.10)";
    if (gpa >= 3.0) return "rgba(13,202,240,0.10)";
    if (gpa >= 2.0) return "rgba(255,193,7,0.10)";
    if (gpa >= 1.0) return "rgba(129,128,125,0.10)";
    return "rgba(220,53,69,0.10)";
  };

  // ── Group semesters by year ──────────────────────────────────────────────
  const groupedByYear: { [key: number]: ResultData[] } = {};
  resultData?.data.forEach((sem) => {
    const year = new Date(sem.publishedAt).getFullYear();
    if (!groupedByYear[year]) groupedByYear[year] = [];
    groupedByYear[year].push(sem);
  });

  // ── Skeleton loaders ─────────────────────────────────────────────────────
  const SkeletonSemester = () => (
    <div className="ms-5 ps-3 mb-3 position-relative">
      <div
        className="position-absolute"
        style={{
          left: "-28px",
          top: "24px",
          width: "24px",
          height: "1px",
          background: "#dee2e6",
        }}
      />
      <Card className="border-0 shadow-sm">
        <div className="bg-info rounded-top" style={{ height: "4px" }} />
        <div className="p-3 d-flex align-items-center gap-3">
          <div style={{ width: "40px", height: "40px" }}>
            <Skeleton circle width={40} height={40} />
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Skeleton width={150} height={20} />
            </div>
            <div className="small text-muted mt-1">
              <Skeleton width={100} height={15} />
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="text-end">
              <Skeleton width={40} height={24} />
              <Skeleton width={30} height={12} />
              <div className="mt-1">
                <Skeleton width={50} height={4} />
              </div>
            </div>
            <Skeleton circle width={24} height={24} />
          </div>
        </div>
      </Card>
    </div>
  );

  const SkeletonYearNode = () => (
    <div className="d-flex align-items-center gap-3 py-3 position-relative">
      <Skeleton circle width={16} height={16} style={{ marginLeft: "24px" }} />
      <Skeleton width={60} height={16} />
    </div>
  );

  return (
    <div className="bg-light min-vh-100 py-4">
      <Container fluid className="px-4">
        {/* ── Filter Bar ── */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group>
                  <Form.Label className="fw-semibold">View Mode</Form.Label>
                  <Button
                    variant={viewMode === "all" ? "primary" : "outline-primary"}
                    onClick={() =>
                      setViewMode(viewMode === "all" ? "current" : "all")
                    }
                    className="d-flex align-items-center justify-content-center gap-2 w-100"
                    style={{ height: "38px" }}
                  >
                    {viewMode === "all" ? (
                      <>
                        <Clock size={16} />
                        <span>Show Current Semester</span>
                      </>
                    ) : (
                      <>
                        <Edit size={16} />
                        <span>Show All Semesters</span>
                      </>
                    )}
                  </Button>
                </Form.Group>
              </Col>

              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group>
                  <Form.Label className="fw-semibold">Terminal</Form.Label>
                  <Form.Select
                    value={selectedTerminal}
                    onChange={(e) => setSelectedTerminal(e.target.value)}
                    className="bg-light border-0"
                  >
                    <option value="F">Terminal 1</option>
                    <option value="S">Terminal 2</option>
                    <option value="FINAL">Final</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group
                  style={{ display: viewMode === "current" ? "none" : "block" }}
                >
                  <Form.Label className="fw-semibold">Semester</Form.Label>
                  <Form.Select
                    value={semesterFilter}
                    onChange={(e) => setSemesterFilter(e.target.value)}
                    className="bg-light border-0"
                    disabled={isLoading || isFetching}
                  >
                    <option value="">All Semesters</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* ── Timeline ── */}
        <div className="position-relative">
          {/* Vertical spine */}
          <div
            className="position-absolute start-0 top-0 bottom-0"
            style={{ width: "2px", left: "31px", background: "#dee2e6" }}
          />

          {isLoading || isFetching ? (
            <>
              {[1, 2, 3].map((yearGroup) => (
                <div key={yearGroup} className="mb-2">
                  <SkeletonYearNode />
                  {[1, 2].map((sem) => (
                    <SkeletonSemester key={`${yearGroup}-${sem}`} />
                  ))}
                </div>
              ))}
            </>
          ) : (
            Object.entries(groupedByYear).map(([year, sems]) => {
              return (
                <div key={year} className="mb-2">
                  {/* ── Year Node ── */}
                  <div className="d-flex align-items-center gap-3 py-3 position-relative">
                    <div
                      className="bg-white border rounded-circle"
                      style={{
                        width: "16px",
                        height: "16px",
                        borderColor: "#adb5bd",
                        zIndex: 1,
                        marginLeft: "24px",
                      }}
                    />
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="text-muted small fw-semibold text-uppercase">
                        {year}
                      </span>
                      <span className="text-muted small">·</span>

                      {viewMode === "current" ? (
                        // Current mode: show semester number once using sems[0].semester
                        <span
                          className="badge rounded-pill"
                          style={{
                            background: "#e7f5ff",
                            color: "#0c63e4",
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "3px 9px",
                            border: "1px solid #b6d4fe",
                          }}
                        >
                          Semester {sems[0].semester}
                        </span>
                      ) : (
                        // All mode: show the terminal label at the year node level
                        <span
                          className="badge rounded-pill"
                          style={{
                            background: "#f0f4ff",
                            color: "#4263eb",
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "3px 9px",
                            border: "1px solid #bac8ff",
                          }}
                        >
                          {getComputedTerminal(sems[0].examTerm)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ── Semester Cards ── */}
                  {sems.map((sem) => {
                    const avgMarks = (
                      sem.subjectBreakdown.reduce(
                        (acc, sub) => acc + sub.finalMarkOutOf100,
                        0,
                      ) / sem.subjectBreakdown.length
                    ).toFixed(1);
                    const isOpen = openSemesterId === sem.id;
                    const gpaColor = getGpaColor(sem.gpa);
                    const gpaBg = getGpaBg(sem.gpa);

                    return (
                      <div
                        key={sem.id}
                        className="ms-5 ps-3 mb-3 position-relative"
                      >
                        {/* Horizontal connector */}
                        <div
                          className="position-absolute"
                          style={{
                            left: "-28px",
                            top: "24px",
                            width: "24px",
                            height: "1px",
                            background: "#dee2e6",
                          }}
                        />

                        <Card
                          className={`border-0 shadow-sm ${isOpen ? "shadow" : ""}`}
                        >
                          {/* Accent strip — GPA colour */}
                          <div
                            className="rounded-top"
                            style={{ height: "4px", backgroundColor: gpaColor }}
                          />

                          {/* Card header */}
                          <div
                            className="p-3 d-flex align-items-center gap-3"
                            onClick={() => toggleSemester(sem.id)}
                            style={{ cursor: "pointer" }}
                          >
                            {/* Icon badge — GPA colour */}
                            <div
                              className="rounded d-flex align-items-center justify-content-center"
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: gpaBg,
                              }}
                            >
                              <span
                                className="fw-bold small"
                                style={{ color: gpaColor }}
                              >
                                S{sem.semester}
                              </span>
                            </div>

                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-2 flex-wrap">
                                {viewMode === "current" ? (
                                  // Current mode: just show terminal name, semester already shown at year node
                                  <span className="fw-semibold">
                                    {getComputedTerminal(sem.examTerm)}
                                  </span>
                                ) : (
                                  // All mode: just semester number — terminal already shown at year node
                                  <span className="fw-semibold">
                                    Semester {sem.semester}
                                  </span>
                                )}
                              </div>
                              <div className="small text-muted">
                                {new Date(sem.publishedAt).getFullYear()} ·{" "}
                                {sem.subjectBreakdown.length} subjects
                              </div>
                            </div>

                            <div className="d-flex align-items-center gap-3">
                              <div className="text-end">
                                {/* GPA value — GPA colour */}
                                <div
                                  className="fw-bold"
                                  style={{ color: gpaColor }}
                                >
                                  {sem.gpa}
                                </div>
                                <div className="small text-muted">GPA</div>
                                {/* Mini progress bar — GPA colour */}
                                <div
                                  className="bg-light rounded-pill"
                                  style={{ width: "50px", height: "4px" }}
                                >
                                  <div
                                    className="rounded-pill"
                                    style={{
                                      width: `${getGpaPercentage(sem.gpa)}%`,
                                      height: "100%",
                                      backgroundColor: gpaColor,
                                    }}
                                  />
                                </div>
                              </div>
                              <FaChevronDown
                                className="text-muted"
                                style={{
                                  transform: isOpen ? "rotate(180deg)" : "none",
                                  transition: "transform 0.2s",
                                }}
                              />
                            </div>
                          </div>

                          {/* Expandable body */}
                          {isOpen && (
                            <div className="border-top">
                              {/* Stats row */}
                              <Row className="g-0 bg-light">
                                <Col className="p-3 text-center border-end">
                                  <div
                                    className="fw-bold"
                                    style={{ color: gpaColor }}
                                  >
                                    {sem.gpa}
                                  </div>
                                  <div className="small text-muted">GPA</div>
                                </Col>
                                <Col className="p-3 text-center border-end">
                                  <div className="fw-bold">{avgMarks}</div>
                                  <div className="small text-muted">
                                    Avg Marks
                                  </div>
                                </Col>
                                <Col className="p-3 text-center">
                                  <div className="fw-bold">
                                    {sem.subjectBreakdown.length}
                                  </div>
                                  <div className="small text-muted">
                                    Subjects
                                  </div>
                                </Col>
                              </Row>

                              {/* Subjects list */}
                              <div className="p-3">
                                <Row className="g-0 mb-2 px-2">
                                  <Col xs={2} className="small text-muted">
                                    Code
                                  </Col>
                                  <Col xs={4} className="small text-muted">
                                    Subject Name
                                  </Col>
                                  <Col
                                    xs={2}
                                    className="small text-muted text-center"
                                  >
                                    Marks
                                  </Col>
                                  <Col
                                    xs={2}
                                    className="small text-muted text-center"
                                  >
                                    Grade
                                  </Col>
                                  <Col
                                    xs={2}
                                    className="small text-muted text-center"
                                  >
                                    Progress
                                  </Col>
                                </Row>

                                {sem.subjectBreakdown.map((subject, idx) => (
                                  <Row
                                    key={idx}
                                    className="g-0 align-items-center py-2 px-2 rounded"
                                  >
                                    <Col xs={2}>
                                      <span className="text-primary small fw-semibold">
                                        {subject.subjectCode}
                                      </span>
                                    </Col>
                                    <Col xs={4}>
                                      <span
                                        className="small"
                                        title={subject.subjectName}
                                      >
                                        {subject.subjectName}
                                      </span>
                                    </Col>
                                    <Col xs={2} className="text-center">
                                      <span className="small fw-medium">
                                        {subject.finalMarkOutOf100}
                                        <sub className="text-muted">/100</sub>
                                      </span>
                                    </Col>
                                    <Col xs={2} className="text-center">
                                      <Badge
                                        bg={getGradeClass(
                                          subject.grade ?? "N/A",
                                        )}
                                      >
                                        {subject.grade ?? "N/A"}
                                      </Badge>
                                    </Col>
                                    <Col xs={2}>
                                      <div className="d-flex align-items-center gap-2">
                                        <div
                                          className="flex-grow-1 bg-light rounded-pill"
                                          style={{ height: "6px" }}
                                        >
                                          <div
                                            className="rounded-pill"
                                            style={{
                                              width: `${subject.finalMarkOutOf100}%`,
                                              height: "100%",
                                              backgroundColor: getBarColor(
                                                subject.grade ?? "N/A",
                                              ),
                                            }}
                                          />
                                        </div>
                                        <span className="small text-muted">
                                          {subject.finalMarkOutOf100}%
                                        </span>
                                      </div>
                                    </Col>
                                  </Row>
                                ))}
                              </div>
                            </div>
                          )}
                        </Card>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Mobile hint */}
        {!isLoading && resultData?.data && resultData.data.length > 0 && (
          <div className="d-block d-md-none text-center mt-4">
            <small className="text-muted fst-italic">
              ↓ Click any semester to expand results
            </small>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!resultData?.data || resultData.data.length === 0) && (
          <div className="text-center py-5">
            <p className="text-muted">
              No result data available for this student
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default StudentResultTimeline;
