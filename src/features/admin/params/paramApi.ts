import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../api/apislice";
import { ParamsApiResponse,QueryParams } from "./utils";
import { ParamEndpoints} from "./endpoint";
export const paramAPi = createApi({
    reducerPath:"paramApi",
    baseQuery,
    tagTypes:["Params"],
    endpoints: (builder)=>({
        getParamList:(builder).query<ParamsApiResponse,QueryParams>({
            query:(QueryParams)=>({
                url:ParamEndpoints.PARAM_ACTION,
                method:"GET",
                params:QueryParams
            }),
            providesTags:["Params"]
        }),
        createEvalParams:(builder).mutation({
            query:(data)=>({
                url:ParamEndpoints.PARAM_ACTION,
                method:"POST",
                body:data
            }),
            invalidatesTags:(result)=>result?.success ? ["Params"]:[]
        }),
        deleteEvalParams:(builder).mutation({
            query:(id)=>({
                url:`${ParamEndpoints.PARAM_ACTION}/${id}`,
                method:"DELETE"
            }),
            invalidatesTags:(result)=>result?.success ? ["Params"]:[]
        })
    })
})

export const {
    useGetParamListQuery,
    useCreateEvalParamsMutation,
    useDeleteEvalParamsMutation
} = paramAPi;