import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Badge, Spinner } from "react-bootstrap";
import {
  FaHistory,
  FaUser,
  FaChartLine,
  FaBullhorn,
  FaInbox,
  FaEye,
} from "react-icons/fa";
import {
  useGetAuditLogsQuery,
  useBulkPublishResultMutation,
} from "../../../../features/admin/management/mamagementApi";
import PaginationComponent from "../../../../Component/common/Pagination";
import toast from "react-hot-toast";
import ResultPublishModal from "./ResultPublishModal";
import { publishResultPayload } from "../../../../features/admin/management/utils";

const ResultPublishLogs: React.FC = () => {
  const [showPromoteModal, showPublishModal] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  /* ── Date range filter ── */
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // Only these committed values are sent to the API (search fires when both are filled)
  const [appliedFrom, setAppliedFrom] = useState<string>("");
  const [appliedTo, setAppliedTo] = useState<string>("");
  const isFiltered = !!(appliedFrom || appliedTo);

  // When both dates are filled, commit them to the query
  useEffect(() => {
    if (dateFrom && dateTo) {
      setAppliedFrom(dateFrom);
      setAppliedTo(dateTo);
      setCurrentPage(1);
    }
  }, [dateFrom, dateTo]);

  const queryParams = useMemo(
    () => ({
      type: "result",
      page: currentPage,
      limit: itemsPerPage,
      ...(appliedFrom && { dateFrom: appliedFrom }),
      ...(appliedTo && { dateTo: appliedTo + "T23:59:59" }),
    }),
    [currentPage, itemsPerPage, appliedFrom, appliedTo],
  );

  const [publishResult, { isLoading: isPromoting }] =
    useBulkPublishResultMutation();
  const {
    data: logsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAuditLogsQuery(queryParams);
  const logs = logsData?.data || [];

  let startIndex = 0;
  let endIndex = 0;
  let totalCount = 0;
  if (logsData) {
    startIndex =
      logsData?.total === 0 ? 0 : (logsData?.page - 1) * logsData?.limit + 1;
    endIndex = Math.min(logsData?.page * logsData?.limit, logsData?.total);
    totalCount = logsData?.total;
  }

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

  /* Refresh also clears date filters */
  const handleRefresh = () => {
    setDateFrom("");
    setDateTo("");
    setAppliedFrom("");
    setAppliedTo("");
    setCurrentPage(1);
    refetch();
  };

  const handlePublishClick = () => {
    showPublishModal(true);
  };
  const handleCloseModal = () => {
    showPublishModal(false);
  };

  const handleConfirmPublish = async (
    programId: string,
    semesters: number[],
    examTerm: string,
  ) => {
    if (!programId || !semesters.length || !examTerm) return;

    try {
      const examTermValue = examTerm as "F" | "S" | "FINAL";

      const data: publishResultPayload = {
        programId: programId,
        semesters: semesters,
        withReport: false,
        examTerm: examTermValue,
      };

      const promise = publishResult(data).unwrap();

      toast.promise(promise, {
        loading: "Publishing results...",
        success: "Results published successfully!",
        error: (err) => {
          return (
            err?.data?.message || err?.message || "Failed to publish results"
          );
        },
      });

      // Wait for the promise to complete
      const response = await promise;

      if (response.success) {
        showPublishModal(false);
        refetch();
      }
    } catch (error: any) {
      // This catch block might not be needed if toast.promise handles it
      // But it's good as a fallback
      console.error("Publish error:", error);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <>
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3 border-bottom">
          <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
            {/* ── Left: title ── */}
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary bg-opacity-10 p-2 rounded">
                <FaHistory className="text-primary" size={20} />
              </div>
              <div>
                <h5 className="mb-0 fw-bold">Result Publish History</h5>
                <small className="text-muted">
                  {logs.length} total activities
                </small>
              </div>
            </div>

            {/* ── Right: date filters + action buttons ── */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {/* From date */}
              <div className="d-flex align-items-center gap-1">
                <small
                  className="text-muted fw-semibold"
                  style={{ fontSize: "11.5px", whiteSpace: "nowrap" }}
                >
                  From
                </small>
                <input
                  type="date"
                  value={dateFrom}
                  max={dateTo || today}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDateFrom(val);
                    if (!val) {
                      setDateTo("");
                      setAppliedFrom("");
                      setAppliedTo("");
                      setCurrentPage(1);
                    }
                  }}
                  style={{
                    fontSize: "12.5px",
                    border: `1px solid ${isFiltered ? "#93c5fd" : "#d0d5dd"}`,
                    borderRadius: "7px",
                    padding: "4px 8px",
                    color: "#344054",
                    outline: "none",
                    backgroundColor: isFiltered ? "#eff6ff" : "#fff",
                    cursor: "pointer",
                    height: "30px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* To date */}
              <div className="d-flex align-items-center gap-1">
                <small
                  className="fw-semibold"
                  style={{
                    fontSize: "11.5px",
                    whiteSpace: "nowrap",
                    color: dateFrom ? "#6b7280" : "#c0c0c0",
                  }}
                >
                  To
                </small>
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom || undefined}
                  max={today}
                  disabled={!dateFrom}
                  onChange={(e) => setDateTo(e.target.value)}
                  style={{
                    fontSize: "12.5px",
                    border: `1px solid ${isFiltered ? "#93c5fd" : dateFrom ? "#d0d5dd" : "#e9ecef"}`,
                    borderRadius: "7px",
                    padding: "4px 8px",
                    color: dateFrom ? "#344054" : "#adb5bd",
                    outline: "none",
                    backgroundColor: isFiltered
                      ? "#eff6ff"
                      : dateFrom
                        ? "#fff"
                        : "#f8f9fa",
                    cursor: dateFrom ? "pointer" : "not-allowed",
                    height: "30px",
                    boxSizing: "border-box",
                    opacity: dateFrom ? 1 : 0.6,
                  }}
                />
              </div>

              {/* Divider */}
              <div
                style={{
                  width: "1px",
                  height: "22px",
                  background: "#e5e7eb",
                  flexShrink: 0,
                }}
              />

              {/* Preview Results */}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => navigate("/admin/result")}
                className="d-flex align-items-center gap-1"
                style={{
                  borderRadius: "8px",
                  borderColor: "#0f50b9",
                  color: "#143b80",
                }}
              >
                <FaEye size={13} />
                <span>Preview Results</span>
              </Button>

              {/* Publish Result */}
              <Button
                variant="success"
                size="sm"
                onClick={handlePublishClick}
                className="d-flex align-items-center gap-1"
              >
                <FaBullhorn size={13} />
                <span>Publish Result</span>
              </Button>

              {/* Refresh — also clears filters */}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleRefresh}
                disabled={isFetching}
                className="d-flex align-items-center gap-1"
                title={isFiltered ? "Clear filters & refresh" : "Refresh"}
              >
                {isFetching ? (
                  <>
                    <Spinner size="sm" animation="border" />
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-sync-alt"></i>
                    <span>Refresh</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {isLoading || isFetching ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading History...</p>
            </div>
          ) : (
            <div
              className="logs-container"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 border-bottom position-relative"
                  >
                    <div className="d-flex gap-3">
                      <div className="flex-shrink-0">
                        <div
                          className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <FaChartLine />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 className="fw-bold mb-0">{log.action}</h6>
                        </div>
                        <p className="text-muted small mb-2">{log.comment}</p>
                        <div className="d-flex align-items-center gap-3">
                          <small className="text-muted">
                            <i className="far fa-clock me-1"></i>
                            {getRelativeTime(log.createdAt)}
                          </small>
                          <small className="text-muted d-flex align-items-center gap-1">
                            <FaUser size={10} />
                            {log.user.name}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                /* ── Empty state ── */
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "56px 24px",
                    gap: "12px",
                  }}
                >
                  <div style={{ position: "relative", marginBottom: "4px" }}>
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaInbox size={32} color="#94a3b8" />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 2,
                        right: 2,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "#e2e8f0",
                        border: "2px solid #fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaBullhorn size={10} color="#94a3b8" />
                    </div>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#374151",
                        marginBottom: "4px",
                      }}
                    >
                      {isFiltered
                        ? "No results in this date range"
                        : "No publish history yet"}
                    </div>
                    <div
                      style={{
                        fontSize: "12.5px",
                        color: "#9ca3af",
                        maxWidth: "240px",
                        lineHeight: 1.5,
                      }}
                    >
                      {isFiltered
                        ? "Try a different range or hit Refresh to clear filters"
                        : "Results you publish will appear here as a log entry"}
                    </div>
                  </div>

                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handlePublishClick}
                    style={{
                      borderRadius: "8px",
                      fontSize: "12.5px",
                      padding: "6px 16px",
                      marginTop: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <FaBullhorn size={12} />
                    Publish your first result
                  </Button>
                </div>
              )}
            </div>
          )}

          {!isLoading && !isFetching && logs.length > 0 && (
            <Card.Footer className="bg-white py-2 border-top">
              <PaginationComponent
                itemsPerPage={itemsPerPage}
                isLoading={isLoading || isFetching}
                startIndex={startIndex}
                endIndex={endIndex}
                total={totalCount}
                lastPage={logsData?.lastPage ?? 0}
                page={logsData?.page ?? 1}
                handlePageChange={handlePageChange}
                handleItemsPerPageChange={handleItemsPerPageChange}
              />
            </Card.Footer>
          )}
        </Card.Body>
      </Card>

      <ResultPublishModal
        show={showPromoteModal}
        onHide={handleCloseModal}
        onConfirm={handleConfirmPublish}
        isLoading={isPromoting}
      />
    </>
  );
};

export default ResultPublishLogs;
