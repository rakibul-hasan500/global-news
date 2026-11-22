import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithRefresh} from "@/redux/baseQuery";

const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: baseQueryWithRefresh,
    tagTypes: ["Dashboard"],
    endpoints: (builder) => ({

        // Get Dashboard Stats
        getDashboardStats: builder.query({
            query: () => ({
                url: "/dashboard/stats",
                method: "GET"
            })
        }),

    })
})

export const {
    useGetDashboardStatsQuery,
} = dashboardApi;
export default dashboardApi;