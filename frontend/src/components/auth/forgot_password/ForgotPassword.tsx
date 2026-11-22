"use client"
import HomeButton from "@/components/common/other/HomeButton";
import {FiEye, FiEyeOff} from "react-icons/fi";
import Loader from "@/components/common/other/Loader";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {forgotPasswordSchema, loginSchema} from "@/validation/auth.validation";
import {zodErrorHandler} from "@/utils/zodErrorHandler";
import {responseHandler} from "@/utils/responseHandler";
import {useForgotPasswordMutation, useLoginUserMutation} from "@/redux/services/auth/authApi";
import {AiFillGoogleCircle} from "react-icons/ai";
import {FaGoogle} from "react-icons/fa";

function ForgotPassword() {

    // Router
    const router = useRouter()

    // Form States
    const [email, setEmail] = useState("");



    // Call Forgot Password API
    const [forgotPassword, {isLoading: forgotPasswordLoading}] = useForgotPasswordMutation()

    // Handle Submit Forgot Password Form
    const handleSubmitForgotPasswordForm = async (e: any) => {
        e.preventDefault();
        try {
            // Validate
            const validation = forgotPasswordSchema.safeParse({
                email
            })
            if(!validation?.success) {
                return zodErrorHandler(validation)
            }

            // Hit Register User API
            const response: any = await forgotPassword({
                email
            }).unwrap()

            // Clear States
            setEmail("")

            // Navigate To Login
            router.push(`/verify-otp/${response?.data?.token}`)

            return responseHandler("S", response?.message)
        } catch (error: any) {
            return responseHandler("E", error?.data?.message)
        }
    }



    return (
        <div className="relative min-h-screen w-full bg-[var(--color-auth-background)] px-4 flex items-center justify-center py-8">
            {/* Home Buton */}
            <HomeButton />

            {/* Form Card */}
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-[var(--color-heading)]">
                        Forgot Password
                    </h1>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                        Enter your email address to receive a password reset code
                    </p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleSubmitForgotPasswordForm} className="space-y-5">
                    {/* Email */}
                    <div>
                        {/* Label */}
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
                            Email Address
                        </label>

                        {/* Input */}
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                        />
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={forgotPasswordLoading} className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition-colors not-disabled:hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                        {forgotPasswordLoading ? (
                            <Loader />
                        ) : (
                            "Send Verification Code"
                        )}
                    </button>
                </form>

                {/* Register */}
                <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
                    Remember your password?{" "}
                    <Link href="/login" className="font-medium text-[var(--color-primary)] hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default ForgotPassword;