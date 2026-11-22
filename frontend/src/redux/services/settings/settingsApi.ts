import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/redux/baseQuery";

const settingsApi = createApi({
    reducerPath: "settingsApi",
    baseQuery: baseQueryWithRefresh,
    tagTypes: ["Settings"],
    endpoints: (builder) => ({

        // Get Settings
        getSettings: builder.query({
            query: (type?: "app" | "about" | "contact") => ({
                url: type ? `/settings/${type}` : "/settings",
                method: "GET",
            }),
            providesTags: ["Settings"],
        }),

        // Update App Settings
        updateAppSettings: builder.mutation({
            query: (data: FormData) => ({
                url: "/settings/app",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Settings"],
        }),

        // Update About Settings
        updateAboutSettings: builder.mutation({
            query: (data: any) => ({
                url: "/settings/about",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Settings"],
        }),

        // Update contact Settings
        updateContactSettings: builder.mutation({
            query: (data: any) => ({
                url: "/settings/contact",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Settings"],
        }),

    }),
});

export const {
    useGetSettingsQuery,
    useUpdateAppSettingsMutation,
    useUpdateAboutSettingsMutation,
    useUpdateContactSettingsMutation,
} = settingsApi;

export default settingsApi;