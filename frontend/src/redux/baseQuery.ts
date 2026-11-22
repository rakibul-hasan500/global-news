import {fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {config} from "@/config/config";
import {handleClearAuthReduxData, handleSetAccessTokenToRedux} from "@/redux/services/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: config.baseUrl,
    credentials: "include",
    prepareHeaders: (headers, {getState}: any) => {
        const token = getState().Auth.accessToken;
        if(token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("x-client-type", "web")
        return headers;
    }
})

export const baseQueryWithRefresh: any = async (args: any, api: any, extraOptions: any) => {

    // First Request
    let result = await baseQuery(args, api, extraOptions);

    // If Access Token Expired
    if (result?.error?.status === 401) {

        // Refresh Token API Call
        const refreshResult: any = await baseQuery({
            url: "/auth/refresh-token",
            method: "POST",
        }, api, extraOptions)

        if (refreshResult?.data?.data?.accessToken) {
            api.dispatch(handleSetAccessTokenToRedux(refreshResult?.data?.data?.accessToken))
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(handleClearAuthReduxData())
            return result
        }

    }

    return result;

}