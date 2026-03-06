import { useEffect, useMemo, useState } from "react";
import type React from "react";
import { Row, Col, Card, Button, Table, Badge, Form } from "react-bootstrap";
import { FaUserGraduate, FaTachometerAlt } from "react-icons/fa";
import CommonBreadCrumb from "../../../../Component/common/BreadCrumb";
import { useGetProgramsQuery } from "../../../../features/admin/students/studentApi";
import { useGetBulkResultQuery } from "../../../../features/admin/management/mamagementApi";
import PaginationComponent from "../../../../Component/common/Pagination";
import { StudentData } from "../../../../features/admin/management/utils";
import { ProgramList } from "../../../../features/admin/students/utils";
import { useAppDispatch } from "../../../../app/hooks";
import { setPageTitle } from "../../../../features/ui/uiSlice";


const getProgramCode = (programData: ProgramList[], programId: number) => {
  if (!programData || !programId) return "N/A";
  const code = programData.filter((p) => p.id === programId);
  return code[0].code || "N/A";
};

const getGradeBadge = (grade: string) => {
  if (grade.startsWith("A+")) return { variant: "success", label: "A+" };
  if (grade.startsWith("A")) return { variant: "success", label: "A" };
  if (grade.startsWith("B+")) return { variant: "primary", label: "B+" };
  if (grade.startsWith("B")) return { variant: "primary", label: "B" };
  if (grade.startsWith("C+")) return { variant: "warning", label: "C+" };
  if (grade.startsWith("C")) return { variant: "warning", label: "C" };
  return { variant: "danger", label: grade };
};

const getGpaBadge = (gpa: number) => {
  if (gpa >= 3.7) return { variant: "success", label: gpa.toFixed(2) };
  if (gpa >= 3.3) return { variant: "primary", label: gpa.toFixed(2) };
  if (gpa >= 2.7) return { variant: "warning", label: gpa.toFixed(2) };
  return { variant: "danger", label: gpa.toFixed(2) };
};

const getTermBadge = (term: string) => {
  switch (term) {
    case "FINAL":
      return { variant: "info", label: "Final" };
    case "S":
      return { variant: "primary", label: "Second" };
    case "F":
      return { variant: "secondary", label: "First" };
    default:
      return { variant: "secondary", label: term };
  }
};

interface SubjectModalProps {
  student: StudentData | null;
  programData: ProgramList[];
  onClose: () => void;
}

const SubjectModal: React.FC<SubjectModalProps> = ({
  student,
  programData,
  onClose,
}) => {
  if (!student) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              Subject Breakdown - {student.firstName} {student.lastName}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-4">
              <Row className="g-3">
                <Col md={3}>
                  <small className="text-muted d-block">Roll Number</small>
                  <strong>{student.rollNumber}</strong>
                </Col>
                <Col md={3}>
                  <small className="text-muted d-block">Registration</small>
                  <strong>{student.registrationNumber}</strong>
                </Col>
                <Col md={2}>
                  <small className="text-muted d-block">Program</small>
                  <strong>
                    {getProgramCode(programData, student.programId)}
                  </strong>
                </Col>
                <Col md={2}>
                  <small className="text-muted d-block">Semester</small>
                  <strong>{student.semester}</strong>
                </Col>
                <Col md={2}>
                  <small className="text-muted d-block">Term</small>
                  <Badge bg={getTermBadge(student.examTerm).variant}>
                    {getTermBadge(student.examTerm).label}
                  </Badge>
                </Col>
              </Row>
            </div>

            <div className="mb-4">
              <Row className="g-3">
                <Col md={4}>
                  <Card bg="light" className="border-0">
                    <Card.Body className="text-center">
                      <small className="text-muted d-block">Total Marks</small>
                      <h4 className="mb-0">
                        {student.totalObtained}/{student.totalFull}
                      </h4>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card bg="light" className="border-0">
                    <Card.Body className="text-center">
                      <small className="text-muted d-block">Percentage</small>
                      <h4 className="mb-0">{student.percentage}%</h4>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card bg="light" className="border-0">
                    <Card.Body className="text-center">
                      <small className="text-muted d-block">GPA</small>
                      <h4 className="mb-0">
                        <Badge
                          bg={getGpaBadge(student.gpa).variant}
                          className="fs-6"
                        >
                          {student.gpa.toFixed(2)}
                        </Badge>
                      </h4>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>

            <h6 className="mb-3">Subject-wise Performance</h6>
            <div className="table-responsive">
              <Table hover size="sm">
                <thead className="table-light">
                  <tr>
                    <th>Code</th>
                    <th>Subject</th>
                    <th className="text-center">Full Marks</th>
                    <th className="text-center">Obtained</th>
                    <th className="text-center">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {student.subjectBreakdown.map((subject) => {
                    const gradeBadge = getGradeBadge(subject.grade);
                    return (
                      <tr key={subject.subjectCode}>
                        <td>
                          <code>{subject.subjectCode}</code>
                        </td>
                        <td>{subject.subjectName}</td>
                        <td className="text-center">100</td>
                        <td className="text-center">
                          <strong>{subject.finalMarkOutOf100}</strong>
                        </td>
                        <td className="text-center">
                          <Badge bg={gradeBadge.variant}>
                            {gradeBadge.label}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
          <div className="modal-footer">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultListing: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setPageTitle({
        title: "Result",
        subtitle: "View student result and Marks",
      }),
    );
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<string>("FINAL");
  const [programFilter, setProgramFilter] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      programId: Number(programFilter),
      semester: Number(selectedSemester),
      examTerm: selectedTerm,
      page: currentPage,
      limit: itemsPerPage,
    }),
    [
      debouncedSearch,
      programFilter,
      selectedSemester,
      selectedTerm,
      itemsPerPage,
      currentPage,
    ],
  );

  const { data: programData, isLoading: isProgramsLoading } =
    useGetProgramsQuery(undefined, { refetchOnMountOrArgChange: true });
  const {
    data: studentsData,
    isLoading: isResultLoading,
    isFetching,
  } = useGetBulkResultQuery(queryParams, { refetchOnMountOrArgChange: true });

  // Calculate pagination
  let startIndex = 0;
  let endIndex = 0;
  let totalCount = 0;
  if (studentsData) {
    startIndex =
      studentsData?.total === 0
        ? 0
        : (studentsData?.page - 1) * studentsData?.limit + 1;
    endIndex = Math.min(
      studentsData?.page * studentsData?.limit,
      studentsData?.total,
    );
    totalCount = studentsData?.total;
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, programFilter, selectedSemester, itemsPerPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(event.target.value));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTerm("FINAL");
    setProgramFilter("");
    setSelectedSemester("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <CommonBreadCrumb
            items={[
              {
                label: "Dashboard",
                link: "/admin/dashboard",
                icon: <FaTachometerAlt />,
              },
              {
                label: "Results",
                active: true,
              },
            ]}
          />
        </div>

        {/* Search and Filters Section */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-3">
            <Row className="g-3">
              {/* Search Bar */}
              <Col md={5}>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-light"
                    placeholder="Search by name, roll no, reg no..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Col>

              {/* Program Filter */}
              <Col md={2}>
                <Form.Select
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                  className="bg-light border-0"
                  disabled={isProgramsLoading}
                >
                  <option value="">All Programs</option>
                  {programData?.data.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.code}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              {/* Semester Filter */}
              <Col md={2}>
                <Form.Select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="bg-light border-0"
                >
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              {/* Term Filter */}
              <Col md={2}>
                <Form.Select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="bg-light border-0"
                >
                  <option value="FINAL">Final Term</option>
                  <option value="S">Second Term</option>
                  <option value="F">First Term</option>
                </Form.Select>
              </Col>
            </Row>

            {/* Clear Filters Button */}
            {(searchTerm ||
              selectedTerm !== "FINAL" ||
              programFilter !== "" ||
              selectedSemester !== "") && (
              <div className="mt-3">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={clearFilters}
                  className="d-flex align-items-center gap-1"
                >
                  <i className="fas fa-times"></i>
                  Clear Filters
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Results Table */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3">
            <PaginationComponent
              itemsPerPage={itemsPerPage}
              isLoading={isResultLoading || isFetching}
              startIndex={startIndex}
              endIndex={endIndex}
              total={totalCount}
              lastPage={studentsData?.totalPages ?? 0}
              page={studentsData?.page ?? 1}
              handlePageChange={handlePageChange}
              handleItemsPerPageChange={handleItemsPerPageChange}
            />
          </Card.Header>
          <Card.Body className="p-0">
            {isResultLoading || isFetching ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>SN</th>
                      <th>Student</th>
                      <th>Roll/Reg No</th>
                      <th>Program</th>
                      <th>Semester</th>
                      <th>Term</th>
                      <th>GPA</th>
                      <th>Percentage</th>
                      <th>Published Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsData?.data && studentsData?.data?.length > 0 ? (
                      studentsData?.data.map((student, index) => {
                        const serialNumber =
                          (currentPage - 1) * itemsPerPage + index + 1;
                        const gpaBadge = getGpaBadge(student.gpa);
                        const termBadge = getTermBadge(student.examTerm);

                        return (
                          <tr
                            key={student.studentId}
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedStudent(student)}
                          >
                            <td className="fw-semibold">{serialNumber}.</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2">
                                  <i className="fas fa-user-graduate text-primary"></i>
                                </div>
                                <div className="fw-semibold">
                                  {student.firstName} {student.lastName}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="fw-semibold">
                                  {student.rollNumber}
                                </div>
                                <small className="text-muted">
                                  {student.registrationNumber}
                                </small>
                              </div>
                            </td>
                            <td>
                              <Badge bg="info" className="px-2">
                                {getProgramCode(
                                  programData?.data || [],
                                  student.programId,
                                )}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg="secondary">
                                Sem {student.semester}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={termBadge.variant}>
                                {termBadge.label}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={gpaBadge.variant} className="px-2">
                                {gpaBadge.label}
                              </Badge>
                            </td>
                            <td>
                              <div>
                                <span className="fw-semibold">
                                  {student.percentage}%
                                </span>
                                <div
                                  className="progress"
                                  style={{ height: "4px", width: "60px" }}
                                >
                                  <div
                                    className={`progress-bar bg-${gpaBadge.variant}`}
                                    style={{ width: `${student.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <small>{formatDate(student.publishedAt)}</small>
                            </td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStudent(student);
                                }}
                              >
                                <i className="fas fa-eye me-1"></i>
                                View Details
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={10} className="text-center py-5">
                          <div className="text-muted">
                            <FaUserGraduate size={40} className="mb-3" />
                            <p className="mb-2">No results found</p>
                            <small>
                              Try adjusting your search or filter criteria
                            </small>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
          <Card.Footer className="bg-white py-3">
            <PaginationComponent
              itemsPerPage={itemsPerPage}
              isLoading={isResultLoading || isFetching}
              startIndex={startIndex}
              endIndex={endIndex}
              total={totalCount}
              lastPage={studentsData?.totalPages ?? 0}
              page={studentsData?.page ?? 1}
              handlePageChange={handlePageChange}
              handleItemsPerPageChange={handleItemsPerPageChange}
            />
          </Card.Footer>
        </Card>
      </div>

      {/* Subject Details Modal */}
      {selectedStudent && (
        <SubjectModal
          student={selectedStudent}
          programData={programData?.data || []}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  );
};

export default ResultListing;
