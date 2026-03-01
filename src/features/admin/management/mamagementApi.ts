import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../api/apislice";
import { ManagementApiEndpoints } from "./endpoints";
import { ListGradeResponse,PromotionApiResponse, Params } from "./utils";


export const managementApi = createApi({
    reducerPath:"managementApi",
    baseQuery,
    tagTypes:["grades","promotionLogs"],
    endpoints:(builder)=>({
        getGradeRange:builder.query<ListGradeResponse,void>({
            query:()=>({
                url:ManagementApiEndpoints.LIST_GRADE_RANGE,
                method:"GET"
            }),
            providesTags:["grades"]
        }),
        addGradeRange:builder.mutation({
            query:(data)=>({
                url:ManagementApiEndpoints.ADD_GRADINGS,
                method:"POST",
                body:data
            }),
            invalidatesTags:(result)=>result?.success ? ["grades"]:[]
        }),
        promoteStudent:builder.mutation({
            query:(data)=>({
                url:ManagementApiEndpoints.PROMOTE_STUDENT,
                method:"POST",
                body:data
            }),
            invalidatesTags:(result)=>result?.success ? ["promotionLogs"] : []
        }),
        getPromotionLogs:builder.query<PromotionApiResponse,Params>({
            query:(QueryParams)=>({
                url:ManagementApiEndpoints.PROMOTION_LOGS,
                method:"GET",
                params:QueryParams
            }),
            providesTags:["promotionLogs"]
        })
    })
})

export const {
    useGetGradeRangeQuery,
    useAddGradeRangeMutation,
    useGetPromotionLogsQuery,
    usePromoteStudentMutation
}=managementApi;