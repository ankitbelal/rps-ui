import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../api/apislice";
import { ManagementApiEndpoints } from "./endpoints";
import {
  ListGradeResponse,
  PromotionApiResponse,
  Params,
  publishResultPayload,
} from "./utils";

export const managementApi = createApi({
  reducerPath: "managementApi",
  baseQuery,
  tagTypes: ["grades", "promotionLogs"],
  endpoints: (builder) => ({
    getGradeRange: builder.query<ListGradeResponse, void>({
      query: () => ({
        url: ManagementApiEndpoints.LIST_GRADE_RANGE,
        method: "GET",
      }),
      providesTags: ["grades"],
    }),
    addGradeRange: builder.mutation({
      query: (data) => ({
        url: ManagementApiEndpoints.ADD_GRADINGS,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result) => (result?.success ? ["grades"] : []),
    }),
    promoteStudent: builder.mutation({
      query: (data) => ({
        url: ManagementApiEndpoints.PROMOTE_STUDENT,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result) => (result?.success ? ["promotionLogs"] : []),
    }),
    getAuditLogs: builder.query<PromotionApiResponse, Params>({
      query: (QueryParams) => ({
        url: ManagementApiEndpoints.PROMOTION_LOGS,
        method: "GET",
        params: QueryParams,
      }),
      providesTags: ["promotionLogs"],
    }),

    bulkPublishResult: builder.mutation({
      query: (data) => ({
        url: ManagementApiEndpoints.BULK_PUBLISH_RESULT,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result) => (result?.success ? ["promotionLogs"] : []),
    }),

    bulkPublishMissingReport: builder.query<Blob, publishResultPayload>({
      query: (data) => ({
        url: ManagementApiEndpoints.BULK_PUBLISH_RESULT_REPORT,
        method: "GET",
        params: {
          programId: data.programId,
          semesters: data.semesters,
          examTerm: data.examTerm,
          withReport: true,
        },
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetGradeRangeQuery,
  useAddGradeRangeMutation,
  usePromoteStudentMutation,
  useGetAuditLogsQuery,
  useBulkPublishResultMutation,
  useLazyBulkPublishMissingReportQuery,
} = managementApi;
