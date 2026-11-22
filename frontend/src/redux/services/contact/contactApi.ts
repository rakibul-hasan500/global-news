import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/redux/baseQuery";

const contactApi = createApi({
    reducerPath: "contactApi",
    baseQuery: baseQueryWithRefresh,
    tagTypes: ["Contact"],
    endpoints: (builder) => ({

        // Get contact Messages
        getContactMessages: builder.query({
            query: ({page=1, limit=20, isRead}) => {
                const params = new URLSearchParams();
                params.set("page", String(page));
                params.set("limit", String(limit));
                if (typeof isRead === "boolean") {
                    params.set("isRead", String(isRead));
                }
                return {
                    url: "/contacts",
                    method: "GET"
                }
            },
            providesTags: ["Contact"]
        }),

        // Create contact Message
        createContactMessage: builder.mutation({
            query: (data: any) => ({
                url: "/contacts",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Contact"],
        }),

        // Delete Contact Message
        deleteContactMessage: builder.mutation({
            query: (contactMessageId: string) => ({
                url: `/contacts/${contactMessageId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Contact"],
        }),

        // Mark Contact Message As Read
        markContactMessageAsRead: builder.mutation({
            query: (contactMessageId: string) => ({
                url: `/contacts/${contactMessageId}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["Contact"],
        }),

        // Get Single Contact Message
        getSingleContactMessage: builder.query({
            query: (contactMessageId: string) => ({
                url: `/contacts/${contactMessageId}`,
                method: "GET",
            }),
            providesTags: ["Contact"],
        }),

    }),
});

export const {
    useGetContactMessagesQuery,
    useCreateContactMessageMutation,
    useDeleteContactMessageMutation,
    useMarkContactMessageAsReadMutation,
    useGetSingleContactMessageQuery,
} = contactApi;

export default contactApi;