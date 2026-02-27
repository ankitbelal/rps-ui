import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../api/apislice";
import AdminEndpoints from "./endpoints";
import {
  StatisticsAPiResponse,
  TopStudentQuery,
  TopStudentsApiResponse,
  Params,
  GraphApiResponse,
} from "./utils";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery,
  endpoints: (builder) => ({
    getStatistics: builder.query<StatisticsAPiResponse, void>({
      query: () => ({
        url: AdminEndpoints.DASHBOARD_STATISTICS,
        method: "GET",
      }),
    }),
    getTopStudents: builder.query<TopStudentsApiResponse, TopStudentQuery>({
      query: (params) => ({
        url: AdminEndpoints.TOP_STUDENTS,
        method: "GET",
        params,
      }),
    }),
    getStudentReportGraph: builder.query<GraphApiResponse, void>({
      query: () => ({
        url: AdminEndpoints.STUDENT_GRAPH,
        method: "GET",
        // params:queryParams
      }),
    }),
  }),
});

export const {
  useGetStatisticsQuery,
  useGetTopStudentsQuery,
  useGetStudentReportGraphQuery,
} = dashboardApi;
