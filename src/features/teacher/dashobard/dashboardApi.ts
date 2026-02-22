import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../api/apislice";
import { TeacherDashboardEndpoints } from "./endpoints";

export const teacherDashboardAPi = createApi({
    reducerPath:"teacherDashboardApi",
    baseQuery,
    tagTypes:[],
    endpoints:(builder)=>({
        getDashboardData:(builder).query<void,void>({
            query:()=>({
                url:TeacherDashboardEndpoints.DASHBORD,
                method:"GET"
            })
        })
    })
})


export const {
    useGetDashboardDataQuery,
}=teacherDashboardAPi;