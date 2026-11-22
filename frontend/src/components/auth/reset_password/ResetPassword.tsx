"use client"
import HomeButton from "@/components/common/other/HomeButton";
import Loader from "@/components/common/other/Loader";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import {useState} from "react";
import {FiEye, FiEyeOff} from "react-icons/fi";
import {responseHandler} from "@/utils/responseHandler";
import {useResetPasswordMutation} from "@/redux/services/auth/authApi";
import {resetPasswordSchema} from "@/validation/auth.validation";
import {zodErrorHandler} from "@/utils/zodErrorHandler";

function ResetPassword() {

    // Router
    const router = useRouter();

    // Token From Params
    const {token} = useParams<{token: string}>();

    // Password Show/Hide States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form States
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");



    // Call Reset Password API
    const [resetPassword, {isLoading: resetPasswordLoading}] = useResetPasswordMutation()

    // Handle Submit Reset Password Form
    const handleSubmitResetPasswordForm = async (e: any) => {
        e.preventDefault();
        try {
            // Reset Password Data
            const data = {
                token,
                password,
                confirmPassword,
            }

            // Validate
            const validate = resetPasswordSchema.safeParse(data);
            if(!validate.success) {
                return zodErrorHandler(validate)
            }

            // Hit Reset Password API
            const response = await resetPassword(data).unwrap()

            // Clear States
            setPassword("");
            setConfirmPassword("");

            // Navigate To Login
            router.push("/login");

            return responseHandler("S", response?.message)
        } catch (error: any) {
            return responseHandler("E", error?.data?.message)
        }
    }


    return (
        <div className="relative min-h-screen w-full bg-[var(--color-auth-background)] px-4 flex items-center justify-center py-8">
            {/* Home Button */}
            <HomeButton />

            {/* Form Card */}
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-[var(--color-heading)]">
                        Reset Password
                    </h1>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                        Create a new password for your account
                    </p>
                </div>

                {/* Reset Password Form */}
                <form onSubmit={handleSubmitResetPasswordForm} className="space-y-5">
                    {/* Password */}
                    <div>
                        {/* Label */}
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
                            New Password
                        </label>

                        {/* Input & Eye Button */}
                        <div className="relative">
                            {/* Input */}
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your new password"
                                className="w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 pr-12 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                            />

                            {/* Eye Button */}
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] transition-colors hover:text-[var(--color-heading)]" aria-label={showPassword ? "Hide password" : "Show password"}>
                                {showPassword ? (
                                    <FiEyeOff size={19} />
                                ) : (
                                    <FiEye size={19} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        {/* Label */}
                        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
                            Confirm Password
                        </label>

                        {/* Input & Eye Button */}
                        <div className="relative">
                            {/* Input */}
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your new password"
                                className="w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 pr-12 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                            />

                            {/* Eye Button */}
                            <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] transition-colors hover:text-[var(--color-heading)]" aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>
                                {showConfirmPassword ? (
                                    <FiEyeOff size={19} />
                                ) : (
                                    <FiEye size={19} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={resetPasswordLoading} className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition-colors not-disabled:hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer">
                        {resetPasswordLoading ? (
                            <Loader />
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>

                {/* Back to Login */}
                <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
                    Remember your password?{" "}
                    <Link href="/login" className="font-medium text-[var(--color-primary)] hover:underline">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default ResetPassword;