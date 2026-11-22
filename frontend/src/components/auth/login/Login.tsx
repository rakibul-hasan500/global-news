"use client"
import HomeButton from "@/components/common/other/HomeButton";
import {FiEye, FiEyeOff} from "react-icons/fi";
import Loader from "@/components/common/other/Loader";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {loginSchema} from "@/validation/auth.validation";
import {zodErrorHandler} from "@/utils/zodErrorHandler";
import {responseHandler} from "@/utils/responseHandler";
import {useLoginUserByGoogleMutation, useLoginUserMutation} from "@/redux/services/auth/authApi";
import {AiFillGoogleCircle} from "react-icons/ai";
import {FaGoogle} from "react-icons/fa";
import {GoogleLogin} from "@react-oauth/google";
import {useDispatch} from "react-redux";
import {handleSetAccessTokenToRedux, handleSetUserDataToRedux} from "@/redux/services/auth/authSlice";

function Login() {

    // Dispatch
    const dispatch = useDispatch()

    // Router
    const router = useRouter()

    // Passwords Show/Hide States
    const [showPassword, setShowPassword] = useState(false);

    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);



    // Call Login User API
    const [loginUser, {isLoading: loginUserLoading}] = useLoginUserMutation()

    // Handle Submit Login User Form
    const handleSubmitLoginUserForm = async (e: any) => {
        e.preventDefault();
        try {
            // Validate
            const validation = loginSchema.safeParse({
                email,
                password
            })
            if(!validation?.success) {
                return zodErrorHandler(validation)
            }

            // Hit Register User API
            const response: any = await loginUser({
                email,
                password,
                rememberMe
            }).unwrap()

            // Clear States
            setShowPassword(false)
            setEmail("")
            setPassword("")

            // Navigate To Login
            router.push(`/verify-otp/${response?.data?.token}`)

            return responseHandler("S", response?.message)
        } catch (error: any) {
            return responseHandler("E", error?.data?.message)
        }
    }


    // Call Login User By Google API
    const [loginUserByGoogle, {isLoading: isGoogleLoginLoading}] = useLoginUserByGoogleMutation();

    // Handle Login User By Google
    const handleLoginUserByGoogle = async (credential: any) => {
        try {
            // Id Token
            const idToken = credential
            if (!idToken) {
                return responseHandler("E", "Google verification token is missing");
            }

            // Hit Login User By Google API
            const response = await loginUserByGoogle({idToken}).unwrap();

            // Navigate To Home Page
            router.push("/")

            // Set Data To Redux
            dispatch(handleSetUserDataToRedux(response?.data?.user))
            dispatch(handleSetAccessTokenToRedux(response?.data?.accessToken))

            return responseHandler("S", response?.message)
        } catch(error: any) {
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
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                        Sign in to stay updated with the latest news
                    </p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleSubmitLoginUserForm} className="space-y-5">
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
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between gap-4">
                        {/* Remember Me */}
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-muted)]">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked) }
                                className="h-4 w-4 cursor-pointer rounded border-[var(--color-border)] accent-[var(--color-primary)]"
                            />
                            <span> Remember me </span>
                        </label>

                        {/* Forgot Password */}
                        <Link href="/forgot-password" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={loginUserLoading} className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition-colors not-disabled:hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                        {loginUserLoading ? (
                            <Loader />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-[var(--color-border)]"/>
                    <span className="text-xs text-[var(--color-muted)]">OR</span>
                    <div className="h-px flex-1 bg-[var(--color-border)]"/>
                </div>

                {/* Google Login */}
                <div className={`${isGoogleLoginLoading ? "cursor-not-allowed opacity-50" : ""} relative w-full`}>
                    {/* Custom Google Button */}
                    <button type="button" className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-heading)] transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-50">
                        <FaGoogle />
                        <span>Continue with Google</span>
                    </button>

                    {/* Google OAuth Overlay */}
                    <div className="absolute inset-0 opacity-0">
                        <GoogleLogin
                            onSuccess={(credentialResponse) => handleLoginUserByGoogle(credentialResponse?.credential)}
                            onError={() => {
                                responseHandler("E", "Google login failed");
                            }}
                        />
                    </div>
                </div>

                {/* Register */}
                <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
                    Don't have an account?{" "}
                    <Link href="/register" className="font-medium text-[var(--color-primary)] hover:underline">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login;