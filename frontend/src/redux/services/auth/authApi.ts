import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithRefresh} from "@/redux/baseQuery";

const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithRefresh,
    tagTypes: ["Auth"],
    endpoints: (builder) => ({

        // Register User
        registerUser: builder.mutation({
            query: (data: {name: string, email: string, password: string}) => ({
                url: "/auth/register",
                method: "POST",
                body: data
            })
        }),

        // Verify Account
        verifyAccount: builder.mutation({
            query: (token: string) => ({
                url: "/auth/verify-account",
                method: "POST",
                body: {token}
            })
        }),

        // Login User
        loginUser: builder.mutation({
            query: (data: {email: string, password: string, rememberMe: boolean}) => ({
                url: "/auth/login",
                method: "POST",
                body: data
            })
        }),

        // Forgot Password
        forgotPassword: builder.mutation({
            query: (data: {email: string}) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body: data
            })
        }),

        // Resend Otp
        resendOtp: builder.mutation({
            query: (data: {token: string}) => ({
                url: "/auth/resend-otp",
                method: "POST",
                body: data
            })
        }),

        // Verify Otp
        verifyOtp: builder.mutation({
            query: (data: {otp: string, token: string}) => ({
                url: "/auth/verify-otp",
                method: "POST",
                body: data
            })
        }),

        // Reset Password
        resetPassword: builder.mutation({
            query: (data: {token: string, password: string, confirmPassword: string}) => ({
                url: "/auth/reset-password",
                method: "POST",
                body: data
            })
        }),

        // Login User By Google
        loginUserByGoogle: builder.mutation({
            query: (body) => ({
                url: "/auth/login/google",
                method: "POST",
                body,
            }),
        }),

        // Logout User
        logoutUser: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST"
            })
        }),

        // Refresh Token
        refreshToken: builder.mutation({
            query: () => ({
                url: "/auth/refresh-token",
                method: "POST"
            })
        })

    })
})

export const {
    useRegisterUserMutation,
    useVerifyAccountMutation,
    useLoginUserMutation,
    useForgotPasswordMutation,
    useResendOtpMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation,
    useLoginUserByGoogleMutation,
    useLogoutUserMutation,
    useRefreshTokenMutation
} = authApi;
export default authApi;