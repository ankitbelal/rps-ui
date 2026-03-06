import React from "react";
import { Form } from "react-bootstrap";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

interface PaginationProps {
  itemsPerPage: number;
  isLoading: boolean;
  startIndex: number;
  endIndex: number;
  total: number;
  lastPage: number;
  page: number;
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  handleItemsPerPageChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 50];

const PaginationComponent: React.FC<PaginationProps> = ({
  itemsPerPage,
  isLoading,
  startIndex,
  endIndex,
  total,
  lastPage,
  page,
  handlePageChange,
  handleItemsPerPageChange,
}) => {
  return (
    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 border-top pt-3">
      {/* Left: Items per page + showing info */}
      <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-sm-start gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small">Show:</span>
          <Form.Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            size="sm"
            className="w-auto"
            style={{ width: "80px" }}
            disabled={isLoading}
          >
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
          <span className="text-muted small">per page</span>
        </div>
        <span className="text-muted small">
          Showing {startIndex}–{endIndex} of {total}
        </span>
      </div>

      {/* Right: Pagination controls */}
      <Stack spacing={2}>
        <Pagination
          count={lastPage}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          color="primary"
          showFirstButton
          showLastButton
          size="medium"
          sx={{
            "& .MuiPaginationItem-root": {
              fontSize: "0.875rem",
            },
            "& .MuiPaginationItem-page.Mui-selected": {
              backgroundColor: "#0d6efd",
              color: "white",
              "&:hover": {
                backgroundColor: "#0b5ed7",
              },
            },
          }}
        />
      </Stack>
    </div>
  );
};

export default PaginationComponent;
