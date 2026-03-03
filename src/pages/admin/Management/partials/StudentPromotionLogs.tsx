import React, { useMemo, useState, useEffect } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import {
  FaHistory,
  FaGraduationCap,
  FaUser,
  FaChartLine,
  FaInbox,
} from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import PromoteStudentsModal from "./PromoteStudentsModal";
import {
  useGetAuditLogsQuery,
  usePromoteStudentMutation,
} from "../../../../features/admin/management/mamagementApi";
import PaginationComponent from "../../../../Component/common/Pagination";
import toast from "react-hot-toast";

const StudentPromotionLogs: React.FC = () => {
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);

  const [appliedFrom, setAppliedFrom] = useState<string>("");
  const [appliedTo, setAppliedTo] = useState<string>("");
  const isFiltered = !!(appliedFrom || appliedTo);

  useEffect(() => {
    if (dateFrom && dateTo) {
      setAppliedFrom(dateFrom.format("YYYY-MM-DD"));
      setAppliedTo(dateTo.format("YYYY-MM-DD"));
      setCurrentPage(1);
    }
  }, [dateFrom, dateTo]);

  const queryParams = useMemo(
    () => ({
      type: "promotion",
      page: currentPage,
      limit: itemsPerPage,
      ...(appliedFrom && { dateFrom: appliedFrom }),
      ...(appliedTo && { dateTo: appliedTo + "T23:59:59" }),
    }),
    [currentPage, itemsPerPage, appliedFrom, appliedTo],
  );

  const [promoteStudent, { isLoading: isPromoting }] =
    usePromoteStudentMutation();
  const {
    data: logsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAuditLogsQuery(queryParams);
  const logs = logsData?.data || [];

  // Calculate pagination
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

  const handleRefresh = () => {
    setDateFrom(null);
    setDateTo(null);
    setAppliedFrom("");
    setAppliedTo("");
    setCurrentPage(1);
    refetch();
  };

  const handlePromoteClick = () => {
    setShowPromoteModal(true);
  };

  const handleCloseModal = () => {
    setShowPromoteModal(false);
  };

  const handleConfirmPromotion = async (id: string) => {
    if (!id) return;

    try {
      const data = {
        programId: Number(id),
      };

      console.log("request body: ", data);

      const response = await toast.promise(promoteStudent(data).unwrap(), {
        loading: "Promoting students...",
      });
      if (response.success) {
        toast.success(response.message);
        setShowPromoteModal(false);
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to promote students.";
      toast.error(errorMessage);
    }
  };

  // Format date to relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <>
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3 border-bottom">
          <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
            {/* Left: title */}
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary bg-opacity-10 p-2 rounded">
                <FaHistory className="text-primary" size={20} />
              </div>
              <div>
                <h5 className="mb-0 fw-bold">Student Promotion Logs</h5>
                <small className="text-muted">
                  {logs.length} total activities
                </small>
              </div>
            </div>

            {/* Right: date filters + action buttons */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {/* From date */}
              <div className="d-flex align-items-center gap-1">
                <small
                  className="text-muted fw-semibold"
                  style={{ fontSize: "11.5px", whiteSpace: "nowrap" }}
                >
                  From
                </small>
                <div
                  style={{
                    height: "30px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "7px",
                    border: `1px solid ${isFiltered ? "#93c5fd" : "#d0d5dd"}`,
                    backgroundColor: isFiltered ? "#eff6ff" : "#fff",
                    width: 140,
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dateFrom}
                      onChange={(newValue) => {
                        setDateFrom(newValue);
                        if (!newValue) {
                          setDateTo(null);
                          setAppliedFrom("");
                          setAppliedTo("");
                          setCurrentPage(1);
                        }
                      }}
                      maxDate={dateTo ?? dayjs()}
                      slotProps={{
                        textField: {
                          size: "small",
                          sx: {
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              fontSize: "12.5px",
                              backgroundColor: "transparent",
                              "& fieldset": { border: "none" },
                            },
                            "& .MuiOutlinedInput-input": {
                              padding: "0 0 0 8px",
                              fontSize: "12.5px",
                              color: "#344054",
                            },
                            "& .MuiIconButton-root": {
                              padding: "0 4px",
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
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
                <div
                  style={{
                    height: "30px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "7px",
                    border: `1px solid ${isFiltered ? "#93c5fd" : dateFrom ? "#d0d5dd" : "#e9ecef"}`,
                    backgroundColor: isFiltered
                      ? "#eff6ff"
                      : dateFrom
                        ? "#fff"
                        : "#f8f9fa",
                    width: 140,
                    opacity: dateFrom ? 1 : 0.6,
                    pointerEvents: dateFrom ? "auto" : "none",
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dateTo}
                      onChange={(newValue) => setDateTo(newValue)}
                      minDate={dateFrom ?? undefined}
                      maxDate={dayjs()}
                      disabled={!dateFrom}
                      slotProps={{
                        textField: {
                          size: "small",
                          sx: {
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              fontSize: "12.5px",
                              backgroundColor: "transparent",
                              "& fieldset": { border: "none" },
                            },
                            "& .MuiOutlinedInput-input": {
                              padding: "0 0 0 8px",
                              fontSize: "12.5px",
                              color: dateFrom ? "#344054" : "#adb5bd",
                            },
                            "& .MuiIconButton-root": {
                              padding: "0 4px",
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </div>

              {/* Promote Students */}
              <Button
                variant="success"
                size="sm"
                onClick={handlePromoteClick}
                className="d-flex align-items-center gap-1"
              >
                <FaGraduationCap size={14} />
                <span>Promote Students</span>
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
          {/* Loader while fetching */}
          {isLoading || isFetching ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading logs...</p>
            </div>
          ) : (
            /* Logs List */
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
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div
                          className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <FaChartLine />
                        </div>
                      </div>

                      {/* Content */}
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
                /* Empty state */
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
                      <FaGraduationCap size={10} color="#94a3b8" />
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
                        ? "No promotions in this date range"
                        : "No promotion history yet"}
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
                        : "Student promotions you run will appear here as a log entry"}
                    </div>
                  </div>

                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handlePromoteClick}
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
                    <FaGraduationCap size={12} />
                    Promote your first batch
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Footer with pagination */}
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

      {/* Promote Students Modal */}
      <PromoteStudentsModal
        show={showPromoteModal}
        onHide={handleCloseModal}
        onConfirm={handleConfirmPromotion}
        isLoading={isPromoting}
      />
    </>
  );
};

export default StudentPromotionLogs;