import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../api/apislice";
import { AdminTeacherEndpoints } from "./endpoints";
import {
  TeacherListResponse,
  TeacherListParams,
  TeacherDetailResponseById,
  SubjectAssignListResponse,
  Params,
} from "./utils";

export const adminTeacherApi = createApi({
  reducerPath: "adminTeacherApi",
  tagTypes: ["Teacher"],
  baseQuery,
  endpoints: (builder) => ({
    getTeacher: builder.query<TeacherListResponse, TeacherListParams>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.search && params.search.trim()) {
          queryParams.append("search", params.search.trim());
        }

        if (params.limit) {
          queryParams.append("limit", params.limit.toString());
        }

        if (params.page) {
          queryParams.append("page", params.page.toString());
        }

        if (params.gender && params.gender !== "all") {
          queryParams.append("gender", params.gender);
        }

        const queryString = queryParams.toString();

        return {
          url: `${AdminTeacherEndpoints.LIST_TEACHER}${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Teacher"],
    }),

    addTeacher: builder.mutation({
      query: (data) => ({
        url: AdminTeacherEndpoints.TEACHER_ACTION,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result) => (result?.success ? ["Teacher"] : []),
    }),

    editTeacher: builder.mutation({
      query: ({ data, id }) => ({
        url: `${AdminTeacherEndpoints.TEACHER_ACTION}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result) => (result?.success ? ["Teacher"] : []),
    }),

    deleteTeacher: builder.mutation({
      query: (id) => ({
        url: `${AdminTeacherEndpoints.TEACHER_ACTION}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => (result?.success ? ["Teacher"] : []),
    }),

    getTeacherById: builder.query<TeacherDetailResponseById, number>({
      query: (id) => ({
        url: `${AdminTeacherEndpoints.TEACHER_ACTION}?id=${id}`,
        method: "GET",
      }),
    }),
    getSubjectAssignList: builder.query<SubjectAssignListResponse, Params>({
      query: (param) => ({
        url: AdminTeacherEndpoints.SUBJECT_ASSIGN_LIST,
        method: "GET",
        params: param,
      }),
    }),
    assignSubject: builder.mutation({
      query: (data) => ({
        url: AdminTeacherEndpoints.ASSIGN_SUBJECT,
        method: "POST",
        body: data,
      }),
    }),

    //teacher report
    teacherReport: builder.query<Blob, TeacherListParams>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.search && params.search.trim()) {
          queryParams.append("search", params.search.trim());
        }

        if (params.limit) {
          queryParams.append("limit", params.limit.toString());
        }

        if (params.page) {
          queryParams.append("page", params.page.toString());
        }

        if (params.gender && params.gender !== "all") {
          queryParams.append("gender", params.gender);
        }

        const queryString = queryParams.toString();

        return {
          url: `${AdminTeacherEndpoints.GET_STUDENTS_REPORT}${
            queryString ? `?${queryString}` : ""
          }`,
          method: "GET",
          responseHandler: async (response) => {
            if (!response.ok) {
              const contentType = response.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Export failed");
              } else {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
            }
            return response.blob();
          },
        };
      },
      keepUnusedDataFor: 0,
      transformResponse: (response: Blob) => response,
      providesTags: [],
    }),
  }),
});

export const {
  useGetTeacherQuery,
  useGetTeacherByIdQuery,
  useAddTeacherMutation,
  useDeleteTeacherMutation,
  useEditTeacherMutation,
  useGetSubjectAssignListQuery,
  useAssignSubjectMutation,
  useLazyTeacherReportQuery,
} = adminTeacherApi;
