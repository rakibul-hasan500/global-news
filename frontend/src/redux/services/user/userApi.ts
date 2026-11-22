import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithRefresh} from "@/redux/baseQuery";

const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQueryWithRefresh,
    tagTypes: ["User"],
    endpoints: (builder) => ({

        // Get Current User
        getCurrentUser: builder.query({
            query: () => ({
                url: "/users/me",
                method: "GET"
            }),
            providesTags: ["User"]
        }),

        // Get Users
        getUsers: builder.query({
            query: ({search="", role="", status="", limit=20, page=1}) => ({
                url: `/users?search=${search}&role=${role}&status=${status}&limit=${limit}&page=${page}`,
                method: "GET",
            }),
            providesTags: ["User"]
        }),

        // Toggle Block User Status
        toggleBlockUserStatus: builder.mutation({
            query: (userId: string) => ({
                url: `/users/${userId}/block-status`,
                method: "PATCH"
            }),
            invalidatesTags: ["User"]
        }),

        // Toggle Delete User Status
        toggleDeleteUserStatus: builder.mutation({
            query: (userId: string) => ({
                url: `/users/${userId}/delete-status`,
                method: "PATCH"
            }),
            invalidatesTags: ["User"]
        }),

        // Create User
        createUser: builder.mutation({
            query: (data: {
                name: string,
                email: string,
                role: string,
                password: string
            }) => ({
                url: "/users",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["User"]
        }),

        // Change Password
        changePassword: builder.mutation({
            query: (data) => ({
                url: "/users/change-password",
                method: "PATCH",
                body: data,
            }),
        }),

    })
});

export const {
    useGetCurrentUserQuery,
    useGetUsersQuery,
    useToggleBlockUserStatusMutation,
    useToggleDeleteUserStatusMutation,
    useCreateUserMutation,
    useChangePasswordMutation,
} = userApi;

export default userApi;