import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../api/apislice";
import AdminEndpoints from "./endpoints";
import {
  StatisticsAPiResponse,
  TopStudentQuery,
  TopStudentsApiResponse,
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
  }),
});

export const { useGetStatisticsQuery, useGetTopStudentsQuery } = dashboardApi;
