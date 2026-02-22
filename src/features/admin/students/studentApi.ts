import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../api/apislice";
import AdminStudentEndpoints from "./endpoints";
import {
  StudentListApiReponse,
  studentListParams,
  ProgramListApiResponse,
  StudentDetailApiResponse,
  FacultyListApiResponse,
  TeacherList,
  StudentSubjectResponse,
  Param,
  ResultParam,
  StudentMarksResponse,
  ResultApiResponse,
  FinalResultParam
} from "./utils";

export const adminStudentApi = createApi({
  reducerPath: "adminStudentApi",
  baseQuery,
  tagTypes: ["Students", "Marks"],
  endpoints: (builder) => ({
    getStudents: builder.query<StudentListApiReponse, studentListParams>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.search && params.search.trim()) {
          queryParams.append("search", params.search.trim());
        }

        if (params.programId) {
          queryParams.append("programId", params.programId.toString());
        }

        if (params.currentSemester) {
          queryParams.append(
            "currentSemester",
            params.currentSemester.toString(),
          );
        }

        if (params.status && params.status.trim()) {
          queryParams.append("status", params.status);
        }

        if (params.page) {
          queryParams.append("page", params.page.toString());
        }

        if (params.limit) {
          queryParams.append("limit", params.limit.toString());
        }

        const queryString = queryParams.toString();

        return {
          url: `${AdminStudentEndpoints.GET_STUDENTS}${
            queryString ? `?${queryString}` : ""
          }`,
          method: "GET",
        };
      },
      providesTags: ["Students"],
    }),

    getPrograms: builder.query<ProgramListApiResponse, void>({
      query: () => ({
        url: AdminStudentEndpoints.PROGRAM_LIST,
        method: "GET",
      }),
    }),

    getFaculties: builder.query<FacultyListApiResponse, void>({
      query: () => ({
        url: AdminStudentEndpoints.FACULTY_LIST,
        method: "GET",
      }),
    }),

    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `${AdminStudentEndpoints.STUDENT_ACTION}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => (result?.success ? ["Students"] : []),
    }),

    addStudent: builder.mutation({
      query: (data) => ({
        url: AdminStudentEndpoints.STUDENT_ACTION,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result) => (result?.success ? ["Students"] : []),
    }),

    editStudent: builder.mutation({
      query: ({ data, id }) => ({
        url: `${AdminStudentEndpoints.STUDENT_ACTION}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result) => (result?.success ? ["Students"] : []),
    }),

    getStudentById: builder.query<StudentDetailApiResponse, number>({
      query: (id) => ({
        url: `${AdminStudentEndpoints.GET_STUDENTS}?id=${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Students", id }],
    }),
    getTeacherList: builder.query<TeacherList, void>({
      query: () => ({
        url: AdminStudentEndpoints.TEACHER_LIST,
        method: "GET",
      }),
    }),
    getStudentSubjectList: builder.query<StudentSubjectResponse, Param>({
      query: (param) => ({
        url: AdminStudentEndpoints.SUBJECT_LIST,
        method: "GET",
        params: param,
      }),
    }),
    getStudentMarks: builder.query<StudentMarksResponse, ResultParam>({
      query: (param) => ({
        url: AdminStudentEndpoints.STUDENT_MARKS,
        method: "GET",
        params: param,
      }),
      providesTags: ["Marks"],
    }),

    addStudentMarks: builder.mutation({
      query: (data) => ({
        url: AdminStudentEndpoints.ADD_MARKS,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result) => (result?.success ? ["Marks"] : []),
    }),

    // student report
    studentReport: builder.query<Blob, studentListParams>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.search && params.search.trim()) {
          queryParams.append("search", params.search.trim());
        }

        if (params.programId) {
          queryParams.append("programId", params.programId.toString());
        }

        if (params.currentSemester) {
          queryParams.append(
            "currentSemester",
            params.currentSemester.toString(),
          );
        }

        if (params.status && params.status.trim()) {
          queryParams.append("status", params.status);
        }

        const queryString = queryParams.toString();

        return {
          url: `${AdminStudentEndpoints.GET_STUDENTS_REPORT}${
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
    getPublishedResult:(builder).query<ResultApiResponse,FinalResultParam>({
      query:(queryParams)=>({
        url:AdminStudentEndpoints.PUBLISHED_RESULT,
        method:"GET",
        params:queryParams
      })
    })

  }),
});

export const {
  useGetStudentsQuery,
  useGetProgramsQuery,
  useDeleteStudentMutation,
  useAddStudentMutation,
  useGetStudentByIdQuery,
  useEditStudentMutation,
  useGetFacultiesQuery,
  useGetTeacherListQuery,
  useGetStudentSubjectListQuery,
  useGetStudentMarksQuery,
  useAddStudentMarksMutation,
  useLazyStudentReportQuery,
  useGetPublishedResultQuery
} = adminStudentApi;
