import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button, Form, Spinner, Row, Col, Badge } from "react-bootstrap";
import toast from "react-hot-toast";
import { useGetEvaluationParamtersQuery } from "../../../../features/admin/subjects/subjectApi";
import { EvalParams } from "../../../../features/admin/subjects/utils";

export interface params {
  evaluationParameterId: number;
  weight: number;
  assigned: number;
}

interface EvaluationParameterModalProps {
  show: boolean;
  onHide: () => void;
  subjectId: number;
  subjectName: string;
  onSave: (parameters: params[]) => void;
  isSaving?: boolean;
}

const EvaluationParameterModal: React.FC<EvaluationParameterModalProps> = ({
  show,
  onHide,
  subjectId,
  subjectName,
  onSave,
  isSaving = false,
}) => {
  const [paramWeights, setParamWeights] = useState<Record<number, number>>({});
  const [selectedParams, setSelectedParams] = useState<number[]>([]);
  const [hadInitialAssignments, setHadInitialAssignments] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [weightErrors, setWeightErrors] = useState<Record<number, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (show) {
      setSelectedParams([]);
      setParamWeights({});
      setWeightErrors({});
      setHadInitialAssignments(false);
    }
  }, [show]);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      subjectId,
      type: statusFilter === "all" ? null : statusFilter,
    }),
    [debouncedSearch, statusFilter, subjectId],
  );

  const {
    data: evalParamsData,
    isLoading: isEvalParamaLoading,
    isFetching,
  } = useGetEvaluationParamtersQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (evalParamsData?.data && show) {
      const assignedIds = evalParamsData.data
        .filter((param: EvalParams) => param.assigned === 1)
        .map((param: EvalParams) => param.id);

      setSelectedParams(assignedIds);
      setHadInitialAssignments(assignedIds.length > 0);

      const initialWeights: Record<number, number> = {};
      evalParamsData.data.forEach((param: EvalParams) => {
        if (param.assigned === 1) {
          initialWeights[param.id] = param.weight;
        }
      });
      setParamWeights(initialWeights);
    }
  }, [evalParamsData, show]);

  const handleParameterToggle = (paramId: number) => {
    setSelectedParams((prev) => {
      const current = prev || [];
      if (current.includes(paramId)) {
        // Simply remove from array + clean up weight & error
        setParamWeights((w) => {
          const updated = { ...w };
          delete updated[paramId];
          return updated;
        });
        setWeightErrors((e) => {
          const updated = { ...e };
          delete updated[paramId];
          return updated;
        });
        return current.filter((id) => id !== paramId);
      } else {
        // Add with default weight from param
        const param = evalParamsData?.data.find(
          (p: EvalParams) => p.id === paramId,
        );
        setParamWeights((w) => ({
          ...w,
          [paramId]: param?.weight ?? 0,
        }));
        return [...current, paramId];
      }
    });
  };

  const handleWeightChange = (paramId: number, weight: string) => {
    if (!/^\d{0,3}$/.test(weight)) return;
    let value = Number(weight);
    if (weight === "") value = 0;
    if (value > 100) value = 100;

    if (value <= 0) {
      setWeightErrors((prev) => ({
        ...prev,
        [paramId]: "Weight must be greater than 0",
      }));
    } else {
      setWeightErrors((prev) => {
        const updated = { ...prev };
        delete updated[paramId];
        return updated;
      });
    }

    setParamWeights((prev) => ({ ...prev, [paramId]: value }));
  };

  const handleSave = () => {
    // Block only if nothing selected AND no prior assignments existed
    // If user had prior assignments and unchecked all → allow (unassign all)
    if (selectedParams.length === 0 && !hadInitialAssignments) {
      toast.error("Please select at least one parameter");
      return;
    }

    // Block if any selected param has invalid weight
    const invalidParams = selectedParams.filter(
      (id) => !paramWeights[id] || paramWeights[id] <= 0,
    );

    if (invalidParams.length > 0) {
      const newErrors: Record<number, string> = { ...weightErrors };
      invalidParams.forEach((id) => {
        newErrors[id] = "Weight must be greater than 0";
      });
      setWeightErrors(newErrors);
      toast.error("Please fix weight errors before saving");
      return;
    }

    const parameters = selectedParams.map((id) => ({
      evaluationParameterId: id,
      weight: paramWeights[id] ?? 0,
      assigned: 1,
    }));

    onSave(parameters);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <i className="fas fa-sliders-h me-2"></i>
          Assign Evaluation Parameters
          <div className="small mt-1">Subject: {subjectName}</div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Search and Filter Section */}
        <Row className="mb-4">
          <Col md={8}>
            <div className="input-group">
              <span className="input-group-text bg-light border-0">
                <i className="fas fa-search"></i>
              </span>
              <Form.Control
                type="text"
                placeholder="Search parameters by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-light"
              />
            </div>
          </Col>
          <Col md={4}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border-0 bg-light"
            >
              <option value="all">All Parameters</option>
              <option value="assigned">Assigned Only</option>
              <option value="unassigned">Unassigned Only</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Parameters List */}
        {isEvalParamaLoading || isFetching ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <div className="mt-3">Loading evaluation parameters...</div>
          </div>
        ) : evalParamsData?.data.length === 0 ? (
          <div className="text-center py-4">
            <i className="fas fa-search fa-2x text-muted mb-3"></i>
            <p className="text-muted">No parameters found</p>
            {searchTerm && (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <div
            className="parameter-list"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {evalParamsData?.data.map((param: EvalParams) => {
              const isSelected = selectedParams?.includes(param.id) ?? false;

              return (
                <div
                  key={param.id}
                  className="card mb-3 border-start border-primary border-3"
                >
                  <div className="card-body">
                    <Row className="align-items-center">
                      <Col xs={1}>
                        <Form.Check
                          type="checkbox"
                          checked={Boolean(isSelected)}
                          onChange={() => handleParameterToggle(param.id)}
                          id={`param-${param.id}`}
                        />
                      </Col>
                      <Col xs={7}>
                        <Form.Label
                          htmlFor={`param-${param.id}`}
                          className="fw-bold mb-1 cursor-pointer"
                        >
                          {param.name}
                          {param.assigned === 1 && (
                            <Badge bg="success" className="ms-2 small">
                              Assigned
                            </Badge>
                          )}
                        </Form.Label>
                      </Col>
                      <Col xs={4}>
                        <div className="input-group">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className={`form-control ${
                              weightErrors[param.id] ? "is-invalid" : ""
                            }`}
                            value={paramWeights[param.id] ?? param.weight}
                            onChange={(e) =>
                              handleWeightChange(param.id, e.target.value)
                            }
                            disabled={!isSelected}
                          />
                          <span className="input-group-text">%</span>
                        </div>
                        {weightErrors[param.id] && (
                          <div className="text-danger small mt-1">
                            <i className="fas fa-exclamation-circle me-1"></i>
                            {weightErrors[param.id]}
                          </div>
                        )}
                      </Col>
                    </Row>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSaving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                className="me-2"
              />
              Saving...
            </>
          ) : (
            <>
              <i className="fas fa-save me-2"></i>
              Save Configuration
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EvaluationParameterModal;
