import React, { useState, useEffect, useMemo } from "react";
import {
  Row,
  Col,
  Form,
  Card,
  Accordion,
  Button,
  Alert,
} from "react-bootstrap";
import { Save, BarChart2, AlertTriangle } from "lucide-react";
import CommonBreadCrumb from "../common/BreadCrumb";
import { FaTachometerAlt, FaUserGraduate } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  useGetStudentSubjectListQuery,
  useGetStudentMarksQuery,
  useAddStudentMarksMutation,
} from "../../features/admin/students/studentApi";
import { StudentSubjectData } from "../../features/admin/students/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { Student } from "../../features/admin/students/utils";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { setPageTitle } from "../../features/ui/uiSlice";
import { getRoleByType } from "../../helper";
import { useSinglePublishResultMutation } from "../../features/admin/management/mamagementApi";

interface SubjectMarks {
  theory: string;
  [key: string]: string;
}

interface MarkField {
  id: string;
  name: string;
  label: string;
  maxMarks: number;
  isEvaluationParam: boolean;
  paramCode?: string;
  paramId?: number;
}

interface SubmissionParameter {
  parameterId: number;
  mark: number;
  fullMarks: number;
}

interface SubmissionSubject {
  subjectId: number;
  obtainedMarks: number;
  parameters: SubmissionParameter[];
}

interface SubmissionData {
  studentId: number;
  semester: number;
  examTerm: string;
  marks: SubmissionSubject[];
}

const MarksEntryPage: React.FC = () => {
  const [selectedTerminal, setSelectedTerminal] = useState("F");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [marksData, setMarksData] = useState<Record<number, SubjectMarks>>({});

  // ─── Separate loading states for each publish button ───────────────────────
  const [isPublishingFinal, setIsPublishingFinal] = useState(false);
  const [isPublishingTerminal, setIsPublishingTerminal] = useState(false);

  const location = useLocation();
  const studentData = location.state.item as Student;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [userRole, setUserRole] = useState<string>("");

  const [selectedSemester, setSelectedSemester] = useState<number>(
    studentData.currentSemester!,
  );

  const isAdminOrSuperAdmin = useMemo(
    () => userRole === "admin" || userRole === "superadmin",
    [userRole],
  );

  const isOlderSemester = useMemo(
    () => selectedSemester < (studentData.currentSemester ?? 0),
    [selectedSemester, studentData.currentSemester],
  );

  useEffect(() => {
    dispatch(
      setPageTitle({
        title: "Result Management",
        subtitle: "Manage student result and Marks",
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setUserRole(getRoleByType(user.UserType));
    }
  }, [user]);

  useEffect(() => {
    setSelectedSubject("");
    setMarksData({});
  }, [selectedSemester]);

  const params = useMemo(
    () => ({
      examTerm: selectedTerminal,
      semester: selectedSemester,
      studentId: studentData.id!,
    }),
    [studentData.id, selectedSemester, selectedTerminal],
  );

  const { data: subjectsResponse, isLoading } = useGetStudentSubjectListQuery(
    {
      programId: studentData.program.id!,
      semester: selectedSemester,
      studentId: studentData.id,
    },
    { skip: !studentData, refetchOnMountOrArgChange: true },
  );

  const { data: studentMarksResponse } = useGetStudentMarksQuery(params);
  const [addStudentMarks, { isLoading: isAddingMarks }] =
    useAddStudentMarksMutation();
  // ─── Remove isLoading from mutation — we manage it manually per button ──────
  const [publishSingleResult] = useSinglePublishResultMutation();

  const subjects = useMemo(
    () => subjectsResponse?.data || [],
    [subjectsResponse?.data],
  );
  const existingMarks = useMemo(
    () => studentMarksResponse?.data || [],
    [studentMarksResponse?.data],
  );

  useEffect(() => {
    if (subjects.length > 0) {
      const initialMarks: Record<number, SubjectMarks> = {};

      subjects.forEach((subject) => {
        const subjectExistingMarks = existingMarks.find(
          (mark) => mark.subjectId === subject.id,
        );

        const subjectMarks: SubjectMarks = {
          theory: subjectExistingMarks?.obtainedMarks?.toString() || "",
        };

        subject.evaluationParameters.forEach((param) => {
          const paramKey = `param_${param.id}`;
          const paramMarks = subjectExistingMarks?.extraParametersMarks?.find(
            (ep) => ep.evaluationParameterId === param.id,
          );
          subjectMarks[paramKey] = paramMarks?.obtainedMarks?.toString() || "";
        });

        initialMarks[subject.id] = subjectMarks;
      });

      setMarksData(initialMarks);
    }
  }, [subjects, existingMarks]);

  const handleMarkChange = (
    subjectId: number,
    field: string,
    value: string,
  ) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return;

    const fieldConfig = getMarkFieldsForSubject(subject).find(
      (f) => f.name === field,
    );
    if (!fieldConfig) return;

    const numericValue = parseFloat(value);

    if (value === "") {
      setMarksData((prev) => ({
        ...prev,
        [subjectId]: { ...prev[subjectId], [field]: value },
      }));
    } else if (!isNaN(numericValue) && numericValue >= 0) {
      if (numericValue > fieldConfig.maxMarks) {
        toast.error(
          `Marks cannot exceed ${fieldConfig.maxMarks} for ${fieldConfig.label}`,
        );
        setMarksData((prev) => ({
          ...prev,
          [subjectId]: {
            ...prev[subjectId],
            [field]: fieldConfig.maxMarks.toString(),
          },
        }));
      } else {
        setMarksData((prev) => ({
          ...prev,
          [subjectId]: { ...prev[subjectId], [field]: value },
        }));
      }
    }
  };

  const handleSaveSubject = async (subjectId: number, subjectName: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return;

    const subjectMarks = marksData[subjectId];
    if (!subjectMarks) {
      toast.error(`No marks data found for ${subjectName}`);
      return;
    }

    const markFields = getMarkFieldsForSubject(subject);
    let hasErrors = false;

    markFields.forEach((field) => {
      const value = subjectMarks[field.name];
      if (value.trim() !== "") {
        const numericValue = parseFloat(value);
        if (numericValue > field.maxMarks) {
          hasErrors = true;
          toast.error(
            `${field.label} exceeds maximum allowed marks of ${field.maxMarks}`,
          );
        }
      }
    });

    if (hasErrors) {
      toast.error(
        `Cannot save ${subjectName} - some marks exceed maximum allowed`,
      );
      return;
    }

    const submissionData = prepareSubmissionDataForSubject(subjectId);

    if (submissionData && submissionData.marks.length > 0) {
      try {
        const response = await toast.promise(
          addStudentMarks(submissionData).unwrap(),
          { loading: "Saving Marks..." },
        );
        if (response.success) {
          toast.success(response.message);
        }
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to save marks");
      }
    } else {
      toast.error(`No valid marks to save for ${subjectName}`);
    }
  };

  const handleSaveAll = async () => {
    const submissionData = prepareSubmissionDataForAll();

    if (submissionData.marks.length === 0) {
      toast.error("No marks entered to save");
      return;
    }

    let hasErrors = false;

    submissionData.marks.forEach((subjectMark) => {
      const subject = subjects.find((s) => s.id === subjectMark.subjectId);
      if (subject) {
        const markFields = getMarkFieldsForSubject(subject);
        markFields.forEach((field) => {
          if (field.name === "theory") {
            if (subjectMark.obtainedMarks > field.maxMarks) {
              hasErrors = true;
              toast.error(
                `${subject.name}: Theory marks exceed maximum of ${field.maxMarks}`,
              );
            }
          } else if (field.paramId) {
            const param = subjectMark.parameters.find(
              (p) => p.parameterId === field.paramId,
            );
            if (param && param.mark > field.maxMarks) {
              hasErrors = true;
              toast.error(
                `${subject.name}: ${field.label} exceeds maximum of ${field.maxMarks}`,
              );
            }
          }
        });
      }
    });

    if (hasErrors) {
      toast.error("Cannot save - some marks exceed maximum allowed");
      return;
    }

    try {
      const response = await toast.promise(
        addStudentMarks(submissionData).unwrap(),
        { loading: "Saving All Marks..." },
      );
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save marks");
    }
  };

  const getSubjectMarks = (subjectId: number): SubjectMarks => {
    return marksData[subjectId] || { theory: "" };
  };

  const getMarkFieldsForSubject = (
    subject: StudentSubjectData,
  ): MarkField[] => {
    const fields: MarkField[] = [
      {
        id: "theory",
        name: "theory",
        label: "Theory",
        maxMarks: 100,
        isEvaluationParam: false,
      },
    ];

    subject.evaluationParameters.forEach((param) => {
      fields.push({
        id: `param_${param.id}`,
        name: `param_${param.id}`,
        label: param.name,
        maxMarks: param.weight,
        isEvaluationParam: true,
        paramCode: param.code,
        paramId: param.id,
      });
    });

    return fields;
  };

  const prepareSubmissionDataForSubject = (
    subjectId: number,
  ): SubmissionData | null => {
    const subjectMarks = marksData[subjectId];
    if (!subjectMarks) return null;

    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return null;

    const theoryMarks = parseFloat(subjectMarks.theory) || 0;
    const parameters: SubmissionParameter[] = [];

    subject.evaluationParameters.forEach((param) => {
      const paramKey = `param_${param.id}`;
      const paramValue = parseFloat(subjectMarks[paramKey]) || 0;

      if (paramValue > 0) {
        parameters.push({
          parameterId: param.id,
          mark: paramValue,
          fullMarks: param.weight,
        });
      }
    });

    if (theoryMarks > 0 || parameters.length > 0) {
      return {
        studentId: studentData.id,
        semester: selectedSemester,
        examTerm: selectedTerminal,
        marks: [{ subjectId, obtainedMarks: theoryMarks, parameters }],
      };
    }

    return null;
  };

  const prepareSubmissionDataForAll = (): SubmissionData => {
    const marks: SubmissionSubject[] = [];

    Object.keys(marksData).forEach((subjectIdStr) => {
      const subjectId = parseInt(subjectIdStr);
      const subjectMarks = marksData[subjectId];
      const subject = subjects.find((s) => s.id === subjectId);

      if (subject && subjectMarks) {
        const theoryMarks = parseFloat(subjectMarks.theory) || 0;
        const parameters: SubmissionParameter[] = [];

        subject.evaluationParameters.forEach((param) => {
          const paramKey = `param_${param.id}`;
          const paramValue = parseFloat(subjectMarks[paramKey]) || 0;

          if (paramValue > 0) {
            parameters.push({
              parameterId: param.id,
              mark: paramValue,
              fullMarks: param.weight,
            });
          }
        });

        if (theoryMarks > 0 || parameters.length > 0) {
          marks.push({ subjectId, obtainedMarks: theoryMarks, parameters });
        }
      }
    });

    return {
      studentId: studentData.id,
      semester: selectedSemester,
      examTerm: selectedTerminal,
      marks,
    };
  };

  // ─── Split into separate handlers with independent loading state ────────────
  const handlePublish = async (publishFinal: boolean) => {
    const termToPublish = publishFinal ? "FINAL" : selectedTerminal;

    if (publishFinal) setIsPublishingFinal(true);
    else setIsPublishingTerminal(true);

    try {
      const response = await publishSingleResult({
        studentId: studentData.id,
        semester: selectedSemester,
        examTerm: termToPublish,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Result published successfully");
        // ─── return immediately after navigate to stop further execution ───
        // navigate("/admin/students/result", { state: { id: studentData.id } });
        // return;
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to publish result");
    } finally {
      // ─── Always reset the correct button's loading state ─────────────────
      if (publishFinal) setIsPublishingFinal(false);
      else setIsPublishingTerminal(false);
    }
  };

  const filteredSubjects = useMemo(() => {
    if (!selectedSubject || selectedSubject === "") return subjects;
    return subjects.filter(
      (subject) => subject.id.toString() === selectedSubject,
    );
  }, [subjects, selectedSubject]);

  return (
    <>
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <CommonBreadCrumb
            items={[
              {
                label: "Dashboard",
                link: `${
                  userRole === "admin" || userRole === "superadmin"
                    ? "/admin"
                    : "/teacher"
                }/dashboard`,
                icon: <FaTachometerAlt />,
              },
              {
                label: "Student Management",
                link: `${
                  userRole === "admin" || userRole === "superadmin"
                    ? "/admin"
                    : "/teacher"
                }/students`,
                icon: <FaUserGraduate />,
              },
              { label: "Marks Entry", active: true },
            ]}
          />
        </div>
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <Row>
              <Col md={8}>
                <h5 className="mb-3 fw-semibold">Student Information</h5>
                <Row>
                  <Col md={3} className="mb-3 mb-md-0">
                    <div>
                      <small className="text-muted d-block mb-1">
                        Student Name
                      </small>
                      <strong>{`${studentData?.firstName} ${studentData?.lastName}`}</strong>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3 mb-md-0">
                    <div>
                      <small className="text-muted d-block mb-1">
                        Roll Number
                      </small>
                      <strong>{studentData?.rollNumber}</strong>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3 mb-md-0">
                    <div>
                      <small className="text-muted d-block mb-1">
                        Current Semester
                      </small>
                      <strong>{studentData?.currentSemester}</strong>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div>
                      <small className="text-muted d-block mb-1">
                        Registration Number
                      </small>
                      <strong>{studentData?.registrationNumber}</strong>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col
                md={4}
                className="d-flex align-items-center justify-content-md-end mt-3 mt-md-0"
              >
                <Button
                  variant="success"
                  className="d-flex align-items-center gap-2"
                  onClick={() =>
                    navigate("/admin/students/result", {
                      state: { id: studentData.id },
                    })
                  }
                >
                  <BarChart2 size={16} />
                  <span>View Result</span>
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <Row className="g-3">
              {isAdminOrSuperAdmin && (
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Semester</Form.Label>
                    <Form.Select
                      value={selectedSemester}
                      onChange={(e) =>
                        setSelectedSemester(parseInt(e.target.value))
                      }
                      className="bg-light border-0"
                    >
                      {Array.from(
                        { length: studentData.currentSemester! },
                        (_, i) => i + 1,
                      ).map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                          {sem === studentData.currentSemester
                            ? " (Current)"
                            : ""}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              )}
              <Col md={isAdminOrSuperAdmin ? 4 : 6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Terminal</Form.Label>
                  <Form.Select
                    value={selectedTerminal}
                    onChange={(e) => setSelectedTerminal(e.target.value)}
                    className="bg-light border-0"
                  >
                    <option value="">Select Terminal</option>
                    <option value="F">Terminal 1</option>
                    <option value="S">Terminal 2</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={isAdminOrSuperAdmin ? 4 : 6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Subject</Form.Label>
                  <Form.Select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="bg-light border-0"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            {isAdminOrSuperAdmin && isOlderSemester && (
              <Alert
                variant="warning"
                className="mt-3 mb-0 d-flex align-items-start gap-2"
              >
                <AlertTriangle size={18} className="flex-shrink-0 mt-1" />
                <span>
                  You are viewing a{" "}
                  <strong className="text-danger">
                    previous semester (Semester {selectedSemester})
                  </strong>{" "}
                  record. Kindly use this feature to change marks only for{" "}
                  <strong className="text-danger">
                    reconciliation or correction purposes
                  </strong>
                  . Changes made here may affect old recorded data and published
                  results.
                </span>
              </Alert>
            )}
          </Card.Body>
        </Card>
        {isLoading ? (
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading subjects...</p>
            </Card.Body>
          </Card>
        ) : filteredSubjects.length === 0 ? (
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="text-center py-5">
              <i className="fas fa-book fa-2x text-muted mb-3"></i>
              <p className="text-muted">No subjects found for this student</p>
            </Card.Body>
          </Card>
        ) : (
          <>
            <div className="mb-4">
              {filteredSubjects.map((subject: StudentSubjectData) => {
                const subjectMarks = getSubjectMarks(subject.id);
                const markFields = getMarkFieldsForSubject(subject);

                return (
                  <Accordion
                    key={subject.id}
                    className="mb-3"
                    defaultActiveKey=""
                  >
                    <Card className="border-0 shadow-sm">
                      <Accordion.Item
                        eventKey={subject.id.toString()}
                        className="border-0"
                      >
                        <Accordion.Header className="bg-white">
                          <div className="w-100 d-flex justify-content-between align-items-center pe-3">
                            <div>
                              <span className="fw-semibold">
                                {subject.name}
                              </span>
                              <span className="text-muted ms-2">
                                {subject.code}
                              </span>
                              <span className="badge bg-secondary ms-2">
                                Semester {subject.semester}
                              </span>
                              <span className="badge bg-light text-dark ms-2">
                                {subject.type}
                              </span>
                              {subject.subjectTeacher === null && (
                                <span className="badge bg-warning ms-2">
                                  <i className="fas fa-exclamation-triangle me-1"></i>
                                  No Teacher Assigned
                                </span>
                              )}
                            </div>
                            <div className="text-muted small">
                              {subject.evaluationParameters.length > 0 && (
                                <span>
                                  <i className="fas fa-sliders-h me-1"></i>
                                  {subject.evaluationParameters.length}{" "}
                                  Evaluation Parameters
                                </span>
                              )}
                            </div>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body className="bg-light">
                          <Row className="g-4">
                            {markFields.map((field) => (
                              <Col md={6} lg={4} key={field.id}>
                                <Form.Group>
                                  <Form.Label className="fw-semibold d-flex align-items-center justify-content-between">
                                    <span>
                                      {field.label}
                                      {field.isEvaluationParam &&
                                        field.paramCode && (
                                          <span className="text-muted small ms-1">
                                            ({field.paramCode})
                                          </span>
                                        )}
                                    </span>
                                    <span className="badge bg-info">
                                      Max: {field.maxMarks}
                                    </span>
                                  </Form.Label>
                                  <Form.Control
                                    type="number"
                                    placeholder="Enter marks"
                                    value={subjectMarks[field.name] || ""}
                                    onChange={(e) =>
                                      handleMarkChange(
                                        subject.id,
                                        field.name,
                                        e.target.value,
                                      )
                                    }
                                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                    className="bg-white"
                                    min="0"
                                    max={field.maxMarks}
                                    step="0.01"
                                  />
                                </Form.Group>
                              </Col>
                            ))}
                          </Row>

                          <div className="d-flex justify-content-end mt-3">
                            <Button
                              variant={isOlderSemester ? "warning" : "success"}
                              onClick={() =>
                                handleSaveSubject(subject.id, subject.name)
                              }
                              className="d-flex align-items-center gap-2"
                              disabled={isAddingMarks}
                            >
                              {isAddingMarks ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2"></span>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save size={18} />
                                  {isOlderSemester
                                    ? "Save (Old Semester)"
                                    : "Save Marks"}
                                </>
                              )}
                            </Button>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Card>
                  </Accordion>
                );
              })}
            </div>
            {(!selectedSubject || selectedSubject === "") && (
              <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap">
                {isAdminOrSuperAdmin && (
                  // ─── Publish Final Result — uses isPublishingFinal only ───
                  <Button
                    variant="success"
                    onClick={() => handlePublish(true)}
                    className="d-flex align-items-center gap-2"
                    disabled={isPublishingFinal}
                  >
                    {isPublishingFinal ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-trophy"></i>
                        Publish Final Result
                      </>
                    )}
                  </Button>
                )}
                {isAdminOrSuperAdmin && (
                  // ─── Publish Terminal — uses isPublishingTerminal only ────
                  <Button
                    variant="success"
                    onClick={() => handlePublish(false)}
                    className="d-flex align-items-center gap-2"
                    disabled={isPublishingTerminal}
                  >
                    {isPublishingTerminal ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle"></i>
                        Publish{" "}
                        {selectedTerminal === "F"
                          ? "Terminal 1"
                          : "Terminal 2"}{" "}
                        Result
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant={isOlderSemester ? "warning" : "primary"}
                  onClick={handleSaveAll}
                  className="d-flex align-items-center gap-2"
                  disabled={isAddingMarks}
                >
                  {isAddingMarks ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving All Marks...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      {isOlderSemester
                        ? "Save All (Old Semester)"
                        : "Save All Marks"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MarksEntryPage;
