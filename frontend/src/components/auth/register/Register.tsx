"use client"
import { useState } from "react";
import {FiEye, FiEyeOff} from "react-icons/fi";
import Link from "next/link";
import Loader from "@/components/common/other/Loader";
import {useRegisterUserMutation} from "@/redux/services/auth/authApi";
import {responseHandler} from "@/utils/responseHandler";
import HomeButton from "@/components/common/other/HomeButton";
import {useRouter} from "next/navigation";
import {registerSchema} from "@/validation/auth.validation";
import {zodErrorHandler} from "@/utils/zodErrorHandler";

function Register() {

    // Router
    const router = useRouter()

    // Passwords Show/Hide States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form States
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");



    // Call Register User API
    const [registerUser, {isLoading: registerUserLoading}] = useRegisterUserMutation()

    // Handle Submit Register User Form
    const handleSubmitRegisterUserForm = async (e: any) => {
        e.preventDefault();
        try {
            // Validate
            const validation = registerSchema.safeParse({
                name: fullName,
                email,
                password,
                confirmPassword,
            })
            if(!validation?.success) {
                return zodErrorHandler(validation)
            }

            // Hit Register User API
            const response: any = await registerUser({
                name: fullName,
                email,
                password
            }).unwrap()

            // Clear States
            setShowPassword(false)
            setShowConfirmPassword(false)
            setFullName("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")

            // Navigate To Login
            router.push("/login")

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
                        Create an account
                    </h1>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                        Stay informed with the latest news and stories
                    </p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleSubmitRegisterUserForm} className="space-y-5">
                    {/* Name */}
                    <div>
                        {/* Label */}
                        <label htmlFor="name" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
                            Full Name
                        </label>

                        {/* Input */}
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                        />
                    </div>

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

                    {/* Password */}
                    <div>
                        {/* Label */}
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
                            Password
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
                                placeholder="Create a strong password"
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

                        {/* Hint */}
                        <p className="mt-2 text-xs text-[var(--color-muted)]">
                            Minimum 8 characters with uppercase, lowercase, number and special character.
                        </p>
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
                                placeholder="Confirm your password"
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
                    <button type="submit" disabled={registerUserLoading} className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition-colors not-disabled:hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                        {registerUserLoading ? (
                            <Loader />
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                {/* Login */}
                <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-[var(--color-primary)] hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register;