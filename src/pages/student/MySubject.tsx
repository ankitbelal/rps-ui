import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Card, Button, Table, Form, Badge } from "react-bootstrap";

import CommonBreadCrumb from "../../Component/common/BreadCrumb";
import { FaTachometerAlt } from "react-icons/fa";
import { RootState } from "../../app/store";
import { getRoleByType } from "../../helper";
import PaginationComponent from "../../Component/common/Pagination";
import { setPageTitle } from "../../features/ui/uiSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useGetSubjectsQuery } from "../../features/admin/subjects/subjectApi";
import { useGetStudentByuserIdQuery } from "../../features/admin/students/studentApi";
import { skipToken } from "@reduxjs/toolkit/query";

const StudentSubjects: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetStudentByuserIdQuery();
  const studentData = data?.data[0];
  const { user } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(
      setPageTitle({
        title: "My Subjects",
        subtitle: "View Subjects, lecturer, credits and codes",
      }),
    );
  }, [dispatch]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [userRole, setUserRole] = useState<string>("");

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //   });
  // };

  useEffect(() => {
    if (user) {
      const role = getRoleByType(user.UserType);
      setUserRole(role === "superadmin" ? "admin" : role);
    }
  }, [user]);

  const queryParams = useMemo(
    () => ({
      programId: studentData?.program.id,
      semester: Number(studentData?.currentSemester),
      page: currentPage,
      limit: itemsPerPage,
    }),
    [studentData, currentPage, itemsPerPage],
  );

  const {
    data: subjectData,
    isLoading: isSubjectLoading,
    isFetching,
  } = useGetSubjectsQuery(
    studentData
      ? {
          ...queryParams,
        }
      : skipToken,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  // Calculate pagination
  let startIndex = 0;
  let endIndex = 0;

  if (subjectData) {
    startIndex =
      subjectData?.total === 0
        ? 0
        : (subjectData?.page - 1) * subjectData?.limit + 1;
    endIndex = Math.min(
      subjectData?.page * subjectData?.limit,
      subjectData?.total,
    );
  }

  // Reset to first page when filters or items per page change

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

  return (
    <>
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <CommonBreadCrumb
            items={[
              {
                label: "Dashboard",
                link: `${userRole === "admin" ? "/admin" : "/teacher"}/dashboard`,
                icon: <FaTachometerAlt />,
              },
              {
                label: "Subject Management",
                active: true,
              },
            ]}
          />
        </div>

        {/* Programs Table */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3">
            <div className="px-3 pb-3">
              <PaginationComponent
                itemsPerPage={itemsPerPage}
                isLoading={isSubjectLoading || isFetching}
                startIndex={startIndex}
                endIndex={endIndex}
                total={subjectData?.total ?? 0}
                lastPage={subjectData?.lastPage ?? 0}
                page={subjectData?.page ?? 0}
                handlePageChange={handlePageChange}
                handleItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {isSubjectLoading || isFetching || isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>SN</th>
                        <th>Subject Code</th>
                        <th>Subject Name</th>
                        <th>Teacher</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectData?.data && subjectData?.data.length > 0 ? (
                        subjectData.data.map((item, key) => {
                          const serialNumber =
                            (currentPage - 1) * itemsPerPage + key + 1;
                          return (
                            <tr key={key}>
                              <td className="fw-semibold">{serialNumber}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2">
                                    <i className="fas fa-book text-primary"></i>
                                  </div>
                                  <div className="fw-semibold">
                                    {item.code}
                                    {/* <small className="text-muted d-block mt-1">
                                      {item.type}
                                    </small> */}
                                    <small className="text-muted d-block mt-1">
                                      <Badge bg="primary">{item.type}</Badge>
                                    </small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="fw-semibold">
                                  {item.name}
                                  <small className="text-muted d-block mt-1">
                                    Program: {item?.program?.code}
                                  </small>
                                </div>
                              </td>
                              <td>
                                {item?.subjectTeacher ? (
                                  <>
                                    <div className="fw-semibold">
                                      {item.subjectTeacher.firstName +
                                        " " +
                                        item.subjectTeacher.lastName}
                                    </div>
                                    <div>
                                      <a
                                        href={`mailto:${item.subjectTeacher.email}`}
                                        className="text-decoration-none d-block"
                                      >
                                        <i className="fas fa-envelope me-1"></i>
                                        {item.subjectTeacher.email}
                                      </a>
                                    </div>
                                  </>
                                ) : (
                                  <span className="badge bg-danger">
                                    Not Assigned
                                  </span>
                                )}
                              </td>

                              <td>
                                <div>
                                  <small className="d-block mt-1">
                                    semester: {item?.semester}
                                  </small>
                                  <div className="d-flex align-items-center gap-2 mt-1">
                                    <Badge bg="success">
                                      Credits: {item.credits}
                                    </Badge>
                                  </div>
                                </div>
                              </td>
                              <td></td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            <div className="text-muted">
                              <i className="fas fa-inbox fa-2x mb-2"></i>
                              <p>No subjects found</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </>
            )}
            {/* Bottom pagination controls */}
            <div className="px-3 pb-3">
              <PaginationComponent
                itemsPerPage={itemsPerPage}
                isLoading={isSubjectLoading || isFetching}
                startIndex={startIndex}
                endIndex={endIndex}
                total={subjectData?.total ?? 0}
                lastPage={subjectData?.lastPage ?? 0}
                page={subjectData?.page ?? 0}
                handlePageChange={handlePageChange}
                handleItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default StudentSubjects;
