import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithRefresh} from "@/redux/baseQuery";

const commentApi = createApi({
    reducerPath: "commentApi",
    baseQuery: baseQueryWithRefresh,
    tagTypes: ["Comment"],
    endpoints: (builder) => ({

        // Create Comment
        createComment: builder.mutation({
            query: (data) => ({
                url: "/comments",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Comment"]
        }),

        // Get Dashboard Comments
        getDashboardComments: builder.query({
            query: ({status, page, limit}) => ({
                url: `/comments/dashboard?status=${status}&page=${page}&limit=${limit}`,
                method: "GET"
            }),
            providesTags: ["Comment"]
        }),

        // Get Article Comments
        getArticleComments: builder.query({
            query: ({articleId, page = 1, limit = 20}) => ({
                url: `/comments/${articleId}?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["Comment"],
        }),

        // Get Comment Replies (lazy query)
        getCommentReplies: builder.query({
            query: ({commentId, page = 1, limit = 20}) => ({
                url: `/comments/${commentId}/replies?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["Comment"],
        }),

        // Update Comment Status
        updateCommentStatus: builder.mutation({
            query: ({commentId, status}) => ({
                url: `/comments/${commentId}/status`,
                method: "PATCH",
                body: { status }
            }),
            invalidatesTags: ["Comment"]
        }),

        // Delete Comment
        deleteComment: builder.mutation({
            query: ({commentId}) => ({
                url: `/comments/${commentId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Comment"],
        }),

        // Update Own Comment
        updateComment: builder.mutation({
            query: ({ commentId, content }) => ({
                url: `/comments/${commentId}`,
                method: "PATCH",
                body: { content }
            }),
            invalidatesTags: ["Comment"]
        }),

        // Toggle Comment Reaction
        toggleCommentReaction: builder.mutation({
            query: ({itemId, reactionType, reactionFor}) => ({
                url: `/comments/reactions/${itemId}`,
                method: "POST",
                body: {reactionType, reactionFor},
            }),
            invalidatesTags: ["Comment"],
        }),

    })
})

export const {
    useCreateCommentMutation,
    useGetDashboardCommentsQuery,
    useGetArticleCommentsQuery,
    useGetCommentRepliesQuery,
    useUpdateCommentStatusMutation,
    useDeleteCommentMutation,
    useUpdateCommentMutation,
    useToggleCommentReactionMutation,
} = commentApi;
export default commentApi;