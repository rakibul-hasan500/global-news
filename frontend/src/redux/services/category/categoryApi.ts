import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithRefresh} from "@/redux/baseQuery";

const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: baseQueryWithRefresh,
    tagTypes: ["Category"],
    endpoints: (builder) => ({

        // Get Categories
        getCategories: builder.query({
            query: ({search = "", status = "", limit = 20, page = 1}) => ({
                url: `/categories?search=${search}&status=${status}&limit=${limit}&page=${page}`,
                method: "GET"
            }),
            providesTags: ["Category"]
        }),

        // Get All Categories
        getAllCategories: builder.query({
            query: () => ({
                url: `/categories/all`,
                method: "GET"
            }),
            providesTags: ["Category"]
        }),

        // Toggle Category Status
        toggleCategoryStatus: builder.mutation({
            query: (categoryId: string) => ({
                url: `/categories/${categoryId}/status`,
                method: "PATCH"
            }),
            invalidatesTags: ["Category"]
        }),

        // Create Category
        createCategory: builder.mutation({
            query: (formData: any) => ({
                url: "/categories",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Category"]
        }),

        // Update Category
        updateCategory: builder.mutation({
            query: ({id, formData}) => ({
                url: `/categories/${id}`,
                method: "PATCH",
                body: formData
            }),
            invalidatesTags: ["Category"]
        }),

        // Delete Category
        deleteCategory: builder.mutation({
            query: (categoryId: string) => ({
                url: `/categories/${categoryId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Category"]
        })

    })
});

export const {
    useGetCategoriesQuery,
    useGetAllCategoriesQuery,
    useToggleCategoryStatusMutation,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;

export default categoryApi;