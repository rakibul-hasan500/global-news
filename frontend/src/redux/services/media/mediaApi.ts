import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithRefresh} from "@/redux/baseQuery";

const mediaApi = createApi({
    reducerPath: "mediaApi",
    baseQuery: baseQueryWithRefresh,
    tagTypes: ["Media"],
    endpoints: (builder) => ({

        // Upload Media
        uploadMedia: builder.mutation({
            query: (formData: any) => ({
                url: "/media",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Media"]
        }),

        // Get Media Stats
        getMediaStats: builder.query({
            query: () => ({
                url: "/media/stats"
            }),
            providesTags: ["Media"]
        }),

        // Get Media
        getMedia: builder.query({
            query: ({type="", search="", limit=20, page=1}: any) => ({
                url: `/media?type=${type}&search=${search}&limit=${limit}&page=${page}`,
                method: "GET",
            }),
            providesTags: ["Media"]
        }),

        // Update Media
        updateMedia: builder.mutation({
            query: ({id, name, altTag}: {
                id: string,
                name: string,
                altTag: string
            }) => ({
                url: `/media/${id}`,
                method: "PATCH",
                body: {name, altTag}
            }),
            invalidatesTags: ["Media"]
        }),

        // Delete Media
        deleteMedia: builder.mutation({
            query: (id: string) => ({
                url: `/media/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Media"]
        })

    })
})

export const {
    useUploadMediaMutation,
    useGetMediaStatsQuery,
    useGetMediaQuery,
    useUpdateMediaMutation,
    useDeleteMediaMutation,
} = mediaApi;
export default mediaApi;