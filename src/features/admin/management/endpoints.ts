type EndPointType = {
  [key: string]: string;
};

export const ManagementApiEndpoints: EndPointType = {
  LIST_GRADE_RANGE: "/result/grading-system",
  ADD_GRADINGS: "/result/add-grading",
  PROMOTION_LOGS: "/audit-trail",
  PROMOTE_STUDENT: "/students/promote-students",
  BULK_PUBLISH_RESULT: "result/bulk-publish",
  BULK_PUBLISH_RESULT_REPORT: "result/bulk-publish-missing-report",
  SINGLE_PUBLISH_RESULT: "result/single-publish",
  SINGLE_USER_NOTICE: "/notice/single-user",
  NOTICE_MAIN: "/notice",
  NOTICE_MARK_READ: "/notice/mark-as-read",
  GET_BULK_RESULT: "/result/bulk-result",
  GET_RESULT_LEDGER:"/result/ledger"
};
