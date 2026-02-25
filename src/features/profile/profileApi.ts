import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../api/apislice";
import ProfileApiEndPoints from "./endpoint";
import { ProfileApiResponse } from "./utils";

export const profileApi = createApi({
    reducerPath:"profileApi",
    baseQuery,
    tagTypes:["admin","teacher"],
    endpoints:(builder)=>({
        getAdminProfileData:(builder).query<ProfileApiResponse,void>({
            query:()=>({
                url:ProfileApiEndPoints.ADMIN_PROFILE_DATA,
                method:"GET"
            }),
            providesTags:["admin"]
        }),
        updateAdminProfile:(builder).mutation({
            query:(payload)=>({
                url:ProfileApiEndPoints.UPDATE_ADMIN_PROFILE,
                method:"POST",
                body:payload
            }),
            invalidatesTags:(result)=> result?.success ? ["admin"]:[]
        }),
        getTeacherProfileData:(builder).query<ProfileApiResponse,void>({
            query:()=>({
                url:ProfileApiEndPoints.TEACHER_PROFILE_DATA,
                method:"GET"
            }),
            providesTags:["teacher"]
        }),
        updateTeacherProfile:(builder).mutation({
            query:(payload)=>({
                url:ProfileApiEndPoints.UPDATE_TEACHER_PROFILE,
                method:"POST",
                body:payload
            }),
            invalidatesTags:(result)=> result?.success ? ["teacher"]:[]
        }),
        updatePassword:(builder).mutation({
            query:(payload)=>({
                url:ProfileApiEndPoints.UPDATE_PASSWORD,
                method:"POST",
                body:payload
            })
        })
    })
})

export const {
    useGetAdminProfileDataQuery,
    useUpdateAdminProfileMutation,
    useGetTeacherProfileDataQuery,
    useUpdateTeacherProfileMutation,
    useUpdatePasswordMutation
}=profileApi;