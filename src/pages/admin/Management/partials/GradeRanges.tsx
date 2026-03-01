import React, { useState } from "react";
import { Card, Button, Table, Badge } from "react-bootstrap";
import { FaPlus, FaStar, FaArrowLeft } from "react-icons/fa";
import { useGetGradeRangeQuery } from "../../../../features/admin/management/mamagementApi";
import GradeRangeForm from "./GradeRangeForm";

const GradeRanges: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const { data: gradeData, isLoading, isFetching, refetch } = useGetGradeRangeQuery();
  const gradeRanges = gradeData?.data || [];

  const handleAddGradeRange = () => {
    setShowForm(true);
  };

  const handleBackToList = () => {
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const getGradeBadgeVariant = (grade: string) => {
    if (grade.includes("A")) return "success";
    if (grade.includes("B")) return "info";
    if (grade.includes("C")) return "warning";
    return "danger";
  };

  // Show loading state
  if (isLoading || isFetching) {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading grade ranges...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      {showForm ? (
        // Form View
        <div>
          <div className="d-flex align-items-center gap-3 mb-4">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleBackToList}
              className="d-flex align-items-center gap-1"
            >
              <FaArrowLeft size={12} />
              <span>Back to List</span>
            </Button>
          </div>
          <GradeRangeForm onCancel={handleCancel} />
        </div>
      ) : (
        // Listing View
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3 border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0 fw-bold">Grade Ranges</h5>
                <small className="text-muted">
                  {gradeRanges.length} grade ranges configured
                </small>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddGradeRange}
                className="d-flex align-items-center gap-1"
              >
                <FaPlus size={12} />
                <span>Add Grade Range</span>
              </Button>
            </div>
          </Card.Header>

          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0" style={{ minWidth: "600px" }}>
                <thead className="table-light">
                  <tr>
                    <th className="fw-semibold ps-4">Grade</th>
                    <th className="fw-semibold">GPA Range</th>
                    <th className="fw-semibold">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {gradeRanges && gradeRanges.length > 0 ? (
                    gradeRanges.map((range: any) => (
                      <tr key={range.id}>
                        <td className="ps-4">
                          <Badge
                            bg={getGradeBadgeVariant(range.grade)}
                            className="px-3 py-2"
                            style={{ fontSize: "0.9rem", minWidth: "50px" }}
                          >
                            {range.grade}
                          </Badge>
                        </td>
                        <td>
                          <span className="fw-semibold">{range.minGPA}</span>
                          <span className="mx-2 text-muted">—</span>
                          <span className="fw-semibold">{range.maxGPA}</span>
                        </td>
                        <td className="text-muted">{range.remarks}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-5">
                        <div className="text-muted">
                          <FaStar size={30} className="mb-2 opacity-50" />
                          <p className="mb-2">No Grade Range Configured</p>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={handleAddGradeRange}
                            className="d-inline-flex align-items-center gap-1 mt-2"
                          >
                            <FaPlus size={12} />
                            <span>Add Your First Grade Range</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            
            {/* Simple footer with total count */}
            {gradeRanges.length > 0 && (
              <Card.Footer className="bg-white py-3 border-top">
                <div className="d-flex justify-content-between align-items-center px-3">
                  <small className="text-muted">
                    Showing all {gradeRanges.length} grade ranges
                  </small>
                  <Badge bg="light" text="dark" className="px-3 py-2">
                    Last updated:{" "}
                    {new Date(gradeRanges[0]?.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              </Card.Footer>
            )}
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default GradeRanges;