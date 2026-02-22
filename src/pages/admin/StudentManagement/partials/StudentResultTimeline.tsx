// components/admin/results/StudentResultTimeline.tsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import CommonBreadCrumb from '../../../../Component/common/BreadCrumb';
import { FaTachometerAlt, FaStar, FaChevronDown } from 'react-icons/fa';
import { Semester } from '../../../../features/admin/students/utils';

// Mock data for when no props are provided
const MOCK_STUDENT_INFO = {
    name: "John Doe",
    program: "B.Sc Computer Science",
    duration: "2021 – 2024",
    cgpa: 3.74,
    totalSemesters: 8,
    status: 'Active' as const
};

const MOCK_SEMESTERS: Semester[] = [
    {
        id: 1,
        year: 2021,
        season: 'fall',
        gpa: 3.8,
        subjects: [
            { code: 'CS101', name: 'Programming Fundamentals', marks: 85, grade: 'A' },
            { code: 'MATH201', name: 'Calculus II', marks: 78, grade: 'B+' },
            { code: 'PHY101', name: 'Physics', marks: 82, grade: 'A-' }
        ]
    },
    {
        id: 2,
        year: 2021,
        season: 'spring',
        gpa: 3.9,
        isStarred: true,
        subjects: [
            { code: 'CS201', name: 'Data Structures', marks: 88, grade: 'A-' },
            { code: 'MATH202', name: 'Linear Algebra', marks: 92, grade: 'A' },
            { code: 'STAT101', name: 'Statistics', marks: 79, grade: 'B+' }
        ]
    },
    {
        id: 3,
        year: 2022,
        season: 'fall',
        gpa: 3.5,
        subjects: [
            { code: 'CS301', name: 'Algorithms', marks: 76, grade: 'B+' },
            { code: 'CS302', name: 'Operating Systems', marks: 81, grade: 'A-' },
            { code: 'ENG201', name: 'Technical Writing', marks: 87, grade: 'A-' },
            { code: 'MATH301', name: 'Discrete Mathematics', marks: 72, grade: 'B' }
        ]
    },
    {
        id: 4,
        year: 2022,
        season: 'spring',
        gpa: 3.7,
        subjects: [
            { code: 'CS401', name: 'Database Systems', marks: 90, grade: 'A' },
            { code: 'CS402', name: 'Computer Networks', marks: 84, grade: 'A-' },
            { code: 'CS403', name: 'Software Engineering', marks: 77, grade: 'B+' }
        ]
    },
    {
        id: 5,
        year: 2023,
        season: 'fall',
        gpa: 3.6,
        subjects: [
            { code: 'CS501', name: 'Machine Learning', marks: 83, grade: 'A-' },
            { code: 'CS502', name: 'Computer Vision', marks: 75, grade: 'B+' },
            { code: 'CS503', name: 'Distributed Systems', marks: 79, grade: 'B+' }
        ]
    },
    {
        id: 6,
        year: 2023,
        season: 'spring',
        gpa: 4.0,
        isStarred: true,
        subjects: [
            { code: 'CS601', name: 'Advanced AI', marks: 97, grade: 'A' },
            { code: 'CS602', name: 'Deep Learning', marks: 94, grade: 'A' },
            { code: 'CS603', name: 'Cloud Computing', marks: 91, grade: 'A' }
        ]
    },
    {
        id: 7,
        year: 2024,
        season: 'fall',
        gpa: 3.8,
        subjects: [
            { code: 'CS701', name: 'Blockchain Technology', marks: 86, grade: 'A-' },
            { code: 'CS702', name: 'Cybersecurity', marks: 88, grade: 'A-' },
            { code: 'CS703', name: 'IoT Systems', marks: 82, grade: 'A-' },
            { code: 'CS704', name: 'Research Methods', marks: 79, grade: 'B+' }
        ]
    },
    {
        id: 8,
        year: 2024,
        season: 'spring',
        gpa: 3.9,
        isStarred: true,
        subjects: [
            { code: 'CS801', name: 'Capstone Project', marks: 95, grade: 'A' },
            { code: 'CS802', name: 'Ethics in Computing', marks: 89, grade: 'A-' },
            { code: 'CS803', name: 'Advanced Topics in CS', marks: 91, grade: 'A' }
        ]
    }
];

interface StudentResultTimelineProps {
    studentInfo?: {
        name: string;
        program: string;
        duration: string;
        cgpa: number;
        totalSemesters: number;
        status: 'Active' | 'Completed' | 'On Hold';
    };
    semesters?: Semester[];
}

const StudentResultTimeline: React.FC<StudentResultTimelineProps> = ({
    studentInfo = MOCK_STUDENT_INFO,
    semesters = MOCK_SEMESTERS
}) => {
    const [openSemesterId, setOpenSemesterId] = useState<number | null>(null);

    const toggleSemester = (id: number) => {
        setOpenSemesterId(openSemesterId === id ? null : id);
    };

    const getGradeClass = (grade: string): string => {
        if (grade.startsWith('A')) return 'success';
        if (grade.startsWith('B')) return 'info';
        if (grade.startsWith('C')) return 'warning';
        return 'danger';
    };

    const getBarColor = (grade: string): string => {
        if (grade.startsWith('A')) return '#198754';
        if (grade.startsWith('B')) return '#0dcaf0';
        if (grade.startsWith('C')) return '#ffc107';
        return '#dc3545';
    };

    const getGpaPercentage = (gpa: number): string => {
        return ((gpa / 4.0) * 100).toFixed(0);
    };

    const getSeasonColor = (season: string): string => {
        return season === 'fall' ? 'warning' : 'info';
    };

    // Group semesters by year
    const groupedByYear: { [key: number]: Semester[] } = {};
    semesters.forEach(sem => {
        if (!groupedByYear[sem.year]) {
            groupedByYear[sem.year] = [];
        }
        groupedByYear[sem.year].push(sem);
    });

    return (
        <div className="bg-light min-vh-100 py-4">
            <Container fluid className="px-4">
                {/* Student Info Bar */}
                {/* <Card className="border-0 shadow-sm mb-4">
                    <Card.Body>
                        <Row className="align-items-center">
                            <Col md={6}>
                                <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                                    <div className="bg-light rounded-pill px-3 py-2 d-flex align-items-center gap-2">
                                        <span className="bg-warning rounded-circle" style={{ width: '8px', height: '8px' }}></span>
                                        <span className="small fw-medium">CGPA {studentInfo.cgpa}</span>
                                    </div>
                                    <div className="bg-light rounded-pill px-3 py-2 d-flex align-items-center gap-2">
                                        <span className="bg-secondary rounded-circle" style={{ width: '8px', height: '8px' }}></span>
                                        <span className="small fw-medium">{studentInfo.totalSemesters} Semesters</span>
                                    </div>
                                    <div className="bg-light rounded-pill px-3 py-2 d-flex align-items-center gap-2">
                                        <span className={`bg-${studentInfo.status === 'Active' ? 'success' : 'secondary'} rounded-circle`} style={{ width: '8px', height: '8px' }}></span>
                                        <span className="small fw-medium">{studentInfo.status}</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card> */}

                {/* Legend */}
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Body>
                        <Row>
                            <Col>
                                <div className="d-flex align-items-center gap-4 flex-wrap">
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="bg-warning rounded-circle" style={{ width: '12px', height: '12px' }}></span>
                                        <span className="small text-muted">Fall Semester</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="bg-info rounded-circle" style={{ width: '12px', height: '12px' }}></span>
                                        <span className="small text-muted">Spring Semester</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <FaStar className="text-warning" size={12} />
                                        <span className="small text-muted">Notable Performance</span>
                                    </div>
                                    <span className="small text-muted fst-italic ms-auto d-none d-md-block">
                                        ↓ Click any semester to expand results
                                    </span>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Timeline */}
                <div className="position-relative">
                    {/* Vertical Line */}
                    <div className="position-absolute start-0 top-0 bottom-0" style={{ width: '2px', left: '31px', background: '#dee2e6' }}></div>

                    {Object.entries(groupedByYear).map(([year, sems], yearIndex) => (
                        <div key={year} className="mb-2">
                            {/* Year Node */}
                            <div className="d-flex align-items-center gap-3 py-3 position-relative">
                                <div className="bg-white border rounded-circle" style={{ width: '16px', height: '16px', borderColor: '#adb5bd', zIndex: 1, marginLeft: '24px' }}></div>
                                <div className="text-muted small fw-semibold text-uppercase">{year}</div>
                            </div>

                            {/* Semesters */}
                            {sems.map((sem) => {
                                const avgMarks = (sem.subjects.reduce((acc, sub) => acc + sub.marks, 0) / sem.subjects.length).toFixed(1);
                                const highestMarks = Math.max(...sem.subjects.map(s => s.marks));
                                const isOpen = openSemesterId === sem.id;
                                const seasonColor = getSeasonColor(sem.season);

                                return (
                                    <div key={sem.id} className="ms-5 ps-3 mb-3 position-relative">
                                        {/* Horizontal Connector */}
                                        <div className="position-absolute" style={{ left: '-28px', top: '24px', width: '24px', height: '1px', background: '#dee2e6' }}></div>

                                        <Card className={`border-0 shadow-sm ${isOpen ? 'shadow' : ''}`}>
                                            {/* Season Accent Strip */}
                                            <div className={`bg-${seasonColor} rounded-top`} style={{ height: '4px' }}></div>
                                            
                                            {/* Card Header - Click to toggle */}
                                            <div 
                                                className="p-3 d-flex align-items-center gap-3 cursor-pointer"
                                                onClick={() => toggleSemester(sem.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className={`bg-${seasonColor} bg-opacity-10 rounded d-flex align-items-center justify-content-center`} style={{ width: '40px', height: '40px' }}>
                                                    <span className={`text-${seasonColor} fw-bold small`}>S{sem.id}</span>
                                                </div>
                                                
                                                <div className="flex-grow-1">
                                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                                        <span className="fw-semibold">
                                                            Semester {sem.id} · {sem.season.charAt(0).toUpperCase() + sem.season.slice(1)}
                                                        </span>
                                                        {sem.isStarred && (
                                                            <Badge bg="warning" text="dark" className="d-flex align-items-center gap-1">
                                                                <FaStar size={10} />
                                                                Notable
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="small text-muted">
                                                        {sem.year} · {sem.subjects.length} subjects
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="text-end">
                                                        <div className={`fw-bold text-${seasonColor}`}>{sem.gpa}</div>
                                                        <div className="small text-muted">GPA</div>
                                                        <div className="bg-light rounded-pill" style={{ width: '50px', height: '4px' }}>
                                                            <div 
                                                                className={`bg-${seasonColor} rounded-pill`}
                                                                style={{ width: `${getGpaPercentage(sem.gpa)}%`, height: '100%' }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <FaChevronDown 
                                                        className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                                        style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Expandable Body */}
                                            {isOpen && (
                                                <div className="border-top">
                                                    {/* Stats Row */}
                                                    <Row className="g-0 bg-light">
                                                        <Col className="p-3 text-center border-end">
                                                            <div className="fw-bold">{sem.gpa}</div>
                                                            <div className="small text-muted">GPA</div>
                                                        </Col>
                                                        <Col className="p-3 text-center border-end">
                                                            <div className="fw-bold">{avgMarks}</div>
                                                            <div className="small text-muted">Avg Marks</div>
                                                        </Col>
                                                        <Col className="p-3 text-center border-end">
                                                            <div className="fw-bold">{highestMarks}</div>
                                                            <div className="small text-muted">Highest</div>
                                                        </Col>
                                                        <Col className="p-3 text-center">
                                                            <div className="fw-bold">{sem.subjects.length}</div>
                                                            <div className="small text-muted">Subjects</div>
                                                        </Col>
                                                    </Row>

                                                    {/* Subjects List */}
                                                    <div className="p-3">
                                                        {/* Header */}
                                                        <Row className="g-0 mb-2 px-2">
                                                            <Col xs={2} className="small text-muted">Code</Col>
                                                            <Col xs={4} className="small text-muted">Subject Name</Col>
                                                            <Col xs={2} className="small text-muted text-center">Marks</Col>
                                                            <Col xs={2} className="small text-muted text-center">Grade</Col>
                                                            <Col xs={2} className="small text-muted text-center">Progress</Col>
                                                        </Row>

                                                        {/* Subject Rows */}
                                                        {sem.subjects.map((subject, idx) => (
                                                            <Row key={idx} className="g-0 align-items-center py-2 px-2 rounded hover-bg-light">
                                                                <Col xs={2}>
                                                                    <span className="text-primary small fw-semibold">{subject.code}</span>
                                                                </Col>
                                                                <Col xs={4}>
                                                                    <span className="small" title={subject.name}>
                                                                        {subject.name}
                                                                    </span>
                                                                </Col>
                                                                <Col xs={2} className="text-center">
                                                                    <span className="small fw-medium">
                                                                        {subject.marks}<sub className="text-muted">/100</sub>
                                                                    </span>
                                                                </Col>
                                                                <Col xs={2} className="text-center">
                                                                    <Badge bg={getGradeClass(subject.grade)}>
                                                                        {subject.grade}
                                                                    </Badge>
                                                                </Col>
                                                                <Col xs={2}>
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <div className="flex-grow-1 bg-light rounded-pill" style={{ height: '6px' }}>
                                                                            <div 
                                                                                className="rounded-pill"
                                                                                style={{ 
                                                                                    width: `${subject.marks}%`, 
                                                                                    height: '100%',
                                                                                    backgroundColor: getBarColor(subject.grade)
                                                                                }}
                                                                            ></div>
                                                                        </div>
                                                                        <span className="small text-muted">{subject.marks}%</span>
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
                    ))}
                </div>

                {/* Mobile Hint */}
                <div className="d-block d-md-none text-center mt-4">
                    <small className="text-muted fst-italic">↓ Click any semester to expand results</small>
                </div>
            </Container>
        </div>
    );
};

export default StudentResultTimeline;