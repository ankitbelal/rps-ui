// MarksEntryPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Row,
  Col,
  Form,
  Card,
  Accordion,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { Save, Clock, Edit, BarChart2 } from "lucide-react";
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
import StudentResultTimeline from "../../pages/admin/StudentManagement/partials/StudentResultTimeline";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { setPageTitle } from "../../features/ui/uiSlice";
import { getRoleByType } from "../../helper";

interface SubjectMarks {
  theory: string;
  [key: string]: string; // For dynamic evaluation parameters
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
  const [viewMode, setViewMode] = useState<"entry" | "timeline">("entry"); // Toggle state
  const location = useLocation();
  const studentData = location.state.item as Student;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [userRole, setUserRole] = useState<string>("");

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

  const params = useMemo(
    () => ({
      examTerm: selectedTerminal,
      semester: studentData.currentSemester!,
      studentId: studentData.id!,
    }),
    [studentData.id, studentData.currentSemester, selectedTerminal],
  );

  const { data: subjectsResponse, isLoading } = useGetStudentSubjectListQuery(
    {
      programId: studentData.program.id!,
      semester: studentData.currentSemester,
      studentId: studentData.id,
    },
    { skip: !studentData, refetchOnMountOrArgChange: true },
  );

  const { data: studentMarksResponse } = useGetStudentMarksQuery(params);
  const [addStudentMarks, { isLoading: isAddingMarks }] =
    useAddStudentMarksMutation();

  const subjects = useMemo(
    () => subjectsResponse?.data || [],
    [subjectsResponse?.data],
  );
  const existingMarks = useMemo(
    () => studentMarksResponse?.data || [],
    [studentMarksResponse?.data],
  );

  // Initialize marks data when subjects are loaded and existing marks are available
  useEffect(() => {
    if (subjects.length > 0) {
      const initialMarks: Record<number, SubjectMarks> = {};

      subjects.forEach((subject) => {
        // Find existing marks for this subject
        const subjectExistingMarks = existingMarks.find(
          (mark) => mark.subjectId === subject.id,
        );

        // Initialize with theory field
        const subjectMarks: SubjectMarks = {
          theory: subjectExistingMarks?.obtainedMarks?.toString() || "",
        };

        // Initialize evaluation parameters
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
    // Get the subject to find max marks for validation
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return;

    // Get the field configuration
    const fieldConfig = getMarkFieldsForSubject(subject).find(
      (f) => f.name === field,
    );
    if (!fieldConfig) return;

    // Validate the input
    const numericValue = parseFloat(value);

    if (value === "") {
      // Allow empty input
      setMarksData((prev) => ({
        ...prev,
        [subjectId]: {
          ...prev[subjectId],
          [field]: value,
        },
      }));
    } else if (!isNaN(numericValue) && numericValue >= 0) {
      // Check if value exceeds max marks
      if (numericValue > fieldConfig.maxMarks) {
        toast.error(
          `Marks cannot exceed ${fieldConfig.maxMarks} for ${fieldConfig.label}`,
        );
        // Set to max marks
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
          [subjectId]: {
            ...prev[subjectId],
            [field]: value,
          },
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
      console.log("Transformed submission data for subject:", submissionData);
      try {
        const response = await toast.promise(
          addStudentMarks(submissionData).unwrap(),
          {
            loading: "Adding Marks...",
          },
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

    console.log("Transformed submission data for all:", submissionData);
    try {
      const response = await toast.promise(
        addStudentMarks(submissionData).unwrap(),
        {
          loading: "Adding Marks...",
        },
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
        });
      }
    });

    if (theoryMarks > 0 || parameters.length > 0) {
      return {
        studentId: studentData.id,
        semester: studentData.currentSemester,
        examTerm: selectedTerminal,
        marks: [
          {
            subjectId,
            obtainedMarks: theoryMarks,
            parameters,
          },
        ],
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
            });
          }
        });

        if (theoryMarks > 0 || parameters.length > 0) {
          marks.push({
            subjectId,
            obtainedMarks: theoryMarks,
            parameters,
          });
        }
      }
    });

    return {
      studentId: studentData.id,
      semester: studentData.currentSemester,
      examTerm: selectedTerminal,
      marks,
    };
  };

  const filteredSubjects = useMemo(() => {
    if (!selectedSubject || selectedSubject === "") {
      return subjects;
    }
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
                link: `${userRole === "admin" || userRole == "superadmin" ? "/admin" : "/teacher"}/dashboard`,
                icon: <FaTachometerAlt />,
              },
              {
                label: "Student Management",
                link: `${userRole === "admin" || userRole === "superadmin" ? "/admin" : "/teacher"}/students`,
                icon: <FaUserGraduate />,
              },
              {
                label: viewMode === "entry" ? "Marks Entry" : "Result Timeline",
                active: true,
              },
            ]}
          />
        </div>
        {/* Student Information Card with Toggle */}
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
                  id="result timeline"
                  variant="success"
                  value="timeline"
                  className="d-flex align-items-center gap-2"
                  onClick={() =>
                    navigate("/admin/students/result", {
                      state: { id: studentData.id }, // Pass your student ID here
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
        {/* Conditional Rendering based on viewMode */}
        <>
          {/* Filter Section */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <Row>
                <Col md={6} className="mb-3 mb-md-0">
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
                <Col md={6}>
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
            </Card.Body>
          </Card>

          {/* Loading State */}
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
              {/* Subject Cards - Each Accordion operates independently */}
              <div className="mb-4">
                {filteredSubjects.map((subject: StudentSubjectData) => {
                  const subjectMarks = getSubjectMarks(subject.id);
                  const markFields = getMarkFieldsForSubject(subject);

                  return (
                    // Each subject has its own independent Accordion
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
                                      className="bg-white"
                                      min="0"
                                      max={field.maxMarks}
                                      step="0.01"
                                    />
                                  </Form.Group>
                                </Col>
                              ))}
                            </Row>

                            <div className="d-flex justify-content-end mt-4">
                              <Button
                                variant="success"
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
                                    Save Marks
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

              {/* Save All Button - Only show when viewing all subjects */}
              {(!selectedSubject || selectedSubject === "") && (
                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
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
                        Save All Marks
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      </div>
    </>
  );
};

export default MarksEntryPage;
