import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithRefresh} from "@/redux/baseQuery";

const tagApi = createApi({
    reducerPath: "tagApi",
    baseQuery: baseQueryWithRefresh,
    tagTypes: ["Tag"],
    endpoints: (builder) => ({

        // Get Tags
        getTags: builder.query({
            query: ({search = "", status = "", limit = 20, page = 1}) => ({
                url: `/tags?search=${search}&status=${status}&limit=${limit}&page=${page}`,
                method: "GET"
            }),
            providesTags: ["Tag"]
        }),

        // Toggle Tag Status
        toggleTagStatus: builder.mutation({
            query: (tagId: string) => ({
                url: `/tags/${tagId}/status`,
                method: "PATCH"
            }),
            invalidatesTags: ["Tag"]
        }),

        // Create Tag
        createTag: builder.mutation({
            query: (data) => ({
                url: "/tags",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Tag"]
        }),

        // Update Tag
        updateTag: builder.mutation({
            query: ({id, data}) => ({
                url: `/tags/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["Tag"]
        }),

        // Delete Tag
        deleteTag: builder.mutation({
            query: (tagId: string) => ({
                url: `/tags/${tagId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Tag"]
        })

    })
});

export const {
    useGetTagsQuery,
    useToggleTagStatusMutation,
    useCreateTagMutation,
    useUpdateTagMutation,
    useDeleteTagMutation,
} = tagApi;

export default tagApi;