import React, { useMemo, useState } from "react";
import { Card, Button, Badge, Spinner } from "react-bootstrap";
import {
  FaHistory,
  FaGraduationCap,
  FaUser,
  FaChartLine,
} from "react-icons/fa";
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

  const queryParams = useMemo(
    () => ({
      type: "promotion",
      page: currentPage,
      limit: itemsPerPage,
    }),
    [currentPage, itemsPerPage],
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
    // const now = new Date();
    // const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    // if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    // if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    // if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3 border-bottom">
          <div className="d-flex justify-content-between align-items-center">
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
            <div className="d-flex gap-2">
              <Button
                variant="success"
                size="sm"
                onClick={handlePromoteClick}
                className="d-flex align-items-center gap-1"
              >
                <FaGraduationCap size={14} />
                <span>Promote Students</span>
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleRefresh}
                disabled={isFetching}
                className="d-flex align-items-center gap-1"
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
                <div className="text-center py-5">
                  <FaHistory size={40} className="text-muted mb-3 opacity-50" />
                  <p className="text-muted">No logs found</p>
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
