import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithRefresh} from "@/redux/baseQuery";

const articleApi = createApi({
    reducerPath: "articleApi",
    baseQuery: baseQueryWithRefresh,
    tagTypes: ["Article"],
    endpoints: (builder) => ({

        // Create Article
        createArticle: builder.mutation({
            query: (data) => ({
                url: "/articles",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Article"]
        }),

        // Get Articles
        getArticles: builder.query({
            query: ({search, category, page=1, limit=20}) => ({
                url: `/articles?search=${search}&category=${category}&page=${page}&limit=${limit}`,
                method: "GET"
            }),
            providesTags: ["Article"]
        }),

        // Get Article Details
        getArticleDetails: builder.query({
            query: (slug) => ({
                url: `/articles/${slug}`,
                method: "GET"
            }),
            providesTags: ["Article"]
        }),

        // Get Dashboard Articles
        getDashboardArticles: builder.query({
            query: ({search, category, tag, status, page=1, limit=20}) => ({
                url: `/articles/dashboard?search=${search}&category=${category}&tag=${tag}&status=${status}&page=${page}&limit=${limit}`,
                method: "GET"
            }),
            providesTags: ["Article"]
        }),

        // Toggle Article Featured Status
        toggleArticleFeaturedStatus: builder.mutation({
            query: (id: string) => ({
                url: `/articles/${id}/featured`,
                method: "PATCH"
            }),
            invalidatesTags: ["Article"]
        }),

        // Get Dashboard Article Details
        getDashboardArticleDetails: builder.query({
            query: (id: string) => ({
                url: `/articles/dashboard/${id}`,
                method: "GET",
            }),
            providesTags: ["Article"],
        }),

        // Delete Article
        deleteArticle: builder.mutation({
            query: (id) => ({
                url: `/articles/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Article"],
        }),

        // Update Article
        updateArticle: builder.mutation({
            query: ({id, data}) => ({
                url: `/articles/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Article"]
        }),

        // Update Article Review Status
        updateArticleReviewStatus: builder.mutation({
            query: ({id, status}) => ({
                url: `/articles/${id}/review-status`,
                method: "PATCH",
                body: {status},
            }),
            invalidatesTags: ["Article"],
        }),

        // Toggle Article Reaction
        toggleArticleReaction: builder.mutation({
            query: ({itemId, reactionType, reactionFor}) => ({
                url: `/articles/reactions/${itemId}`,
                method: "POST",
                body: {reactionType, reactionFor},
            }),
            invalidatesTags: ["Article"],
        }),

    })
})

export const {
    useCreateArticleMutation,
    useGetArticlesQuery,
    useGetArticleDetailsQuery,
    useGetDashboardArticlesQuery,
    useToggleArticleFeaturedStatusMutation,
    useGetDashboardArticleDetailsQuery,
    useDeleteArticleMutation,
    useUpdateArticleMutation,
    useUpdateArticleReviewStatusMutation,
    useToggleArticleReactionMutation,
} = articleApi;
export default articleApi;