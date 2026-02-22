import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../api/apislice";
import { TeacherDashboardEndpoints } from "./endpoints";
import { TeacherDashboardResponse } from "./utils";

export const teacherDashboardApi = createApi({
  reducerPath: "teacherDashboardApi",
  baseQuery,
  tagTypes: [],
  endpoints: (builder) => ({
    getDashboardData: builder.query<TeacherDashboardResponse, void>({
      query: () => ({
        url: TeacherDashboardEndpoints.DASHBORD,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardDataQuery } = teacherDashboardApi;
