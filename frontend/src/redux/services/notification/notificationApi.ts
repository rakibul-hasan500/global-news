import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithRefresh} from "@/redux/baseQuery";

const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery: baseQueryWithRefresh,
    tagTypes: ["Notification"],
    endpoints: (builder) => ({

        // Get Notifications
        getNotifications: builder.query({
            query: ({page=1, limit=20, isRead}) => {
                const params = new URLSearchParams();
                params.set("page", String(page));
                params.set("limit", String(limit));
                if (typeof isRead === "boolean") {
                    params.set("isRead", String(isRead));
                }
                return {
                    url: `/notifications?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["Notification"],
        }),

        // Delete Notification
        deleteNotification: builder.mutation({
            query: (notificationId: string) => ({
                url: `/notifications/${notificationId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notification"],
        }),

        // Mark Notification As Read
        markNotificationAsRead: builder.mutation({
            query: (notificationId: string) => ({
                url: `/notifications/${notificationId}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notification"],
        }),

    })
})

export const {
    useGetNotificationsQuery,
    useDeleteNotificationMutation,
    useMarkNotificationAsReadMutation,
} = notificationApi;
export default notificationApi;