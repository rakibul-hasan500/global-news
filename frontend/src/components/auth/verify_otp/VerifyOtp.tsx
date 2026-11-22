"use client"
import HomeButton from "@/components/common/other/HomeButton";
import {FiEye, FiEyeOff} from "react-icons/fi";
import Loader from "@/components/common/other/Loader";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {forgotPasswordSchema, loginSchema, resendOtpSchema, verifyOtpSchema} from "@/validation/auth.validation";
import {zodErrorHandler} from "@/utils/zodErrorHandler";
import {responseHandler} from "@/utils/responseHandler";
import {
    useForgotPasswordMutation,
    useLoginUserMutation,
    useResendOtpMutation,
    useVerifyOtpMutation
} from "@/redux/services/auth/authApi";
import {AiFillGoogleCircle} from "react-icons/ai";
import {FaGoogle} from "react-icons/fa";
import {Params} from "next/dist/server/request/params";
import {handleSetAccessTokenToRedux, handleSetUserDataToRedux} from "@/redux/services/auth/authSlice";
import {useDispatch} from "react-redux";

function VerifyOtp() {

    // Dispatch
    const dispatch = useDispatch()

    // Router
    const router = useRouter()

    // Token From Params
    const {token} = useParams<{token: string}>()



    // Form Ref
    const otpRefs: any = useRef([]);

    // Form States
    const [otpField, setOtpField] = useState(["", "", "", "", "", ""]);

    // Handle OTP Form Change
    const handleOtpFormChange = (index: number, value: string) => {

        // Restrice Value
        if(!/^\d?$/.test(value)) {
            return;
        }

        // Set Value
        setOtpField((prev) => {
            const prevOtp = [...prev]
            prevOtp[index] = value
            return prevOtp
        })

        // Focus Next
        if(value && index + 1 < otpField?.length) {
            otpRefs?.current?.[index + 1]?.focus();
        }

    }

    // Handle OTP Form Key Down
    const handleOTPFormKeyDown = (index: number, e: any) => {
        // Prevent Remove
        if(e.key !== "Backspace") {
            return
        }

        // Remove
        if(otpField[index]) {
            setOtpField((prev) => {
                const prevOtp = [...prev]
                prevOtp[index] = ""
                return prevOtp
            });
            return;
        }

        // Focus
        if(index > 0) {
            otpRefs?.current?.[index - 1]?.focus();
        }
    }

    // Focus First Element
    useEffect(() => {
        otpRefs?.current?.[0]?.focus()
    }, [])



    // Call Resend OTP API
    const [resendOtp, {isLoading: resendOtpLoading}] = useResendOtpMutation()

    // Handle Resend Otp
    const handleResendOtp = async () => {
        try {
            // Validate
            const validation = resendOtpSchema.safeParse({
                token
            })
            if(!validation?.success) {
                return zodErrorHandler(validation)
            }

            // Hit Register User API
            const response: any = await resendOtp({
                token
            }).unwrap()

            // Clear States
            setOtpField(["", "", "", "", "", ""])

            return responseHandler("S", response?.message)
        } catch (error: any) {
            return responseHandler("E", error?.data?.message)
        }
    }



    // Call Verify Otp API
    const [verifyOtp, {isLoading: verifyOtpLoading}] = useVerifyOtpMutation()

    // Handle Submit Verify Otp Form
    const handleSubmitVerifyOtpForm = async (e: any) => {
        e.preventDefault();
        try {
            // OTP
            const otp = otpField.join("")

            // Validate
            const validation = verifyOtpSchema.safeParse({
                otp,
                token
            })
            if(!validation?.success) {
                return zodErrorHandler(validation)
            }

            // Hit Register User API
            const response: any = await verifyOtp({
                otp,
                token
            }).unwrap()

            // Clear States
            setOtpField(["", "", "", "", "", ""])

            // Navigate
            if (response?.data?.type === "LOGIN") {
                // Set Auth Data To Redux
                dispatch(handleSetUserDataToRedux(response?.data?.user))
                dispatch(handleSetAccessTokenToRedux(response?.data?.accessToken))

                router.push(`/`)
            } else {
                router.push(`/reset-password/${response?.data?.token}`)
            }

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
                        Verify OTP
                    </h1>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                        Enter the 6-digit verification code sent to your email address
                    </p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleSubmitVerifyOtpForm} className="space-y-5">
                    {/* OTP */}
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        {otpField?.map((value, index) => (
                            <input
                                key={index}
                                ref={(element) => {
                                    otpRefs.current[index] = element;
                                }}
                                type="text"
                                value={value}
                                onChange={(e)=> handleOtpFormChange(index, e.target.value)}
                                onKeyDown={(e) => handleOTPFormKeyDown(index, e)}
                                className="w-12 rounded-lg border border-[var(--color-border)] bg-primary/5 px-4 py-2.5 text-lg font-semibold text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 text-center"
                            />
                        ))}
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={verifyOtpLoading} className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition-colors not-disabled:hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                        {verifyOtpLoading ? (
                            <Loader />
                        ) : (
                            "Verify OTP"
                        )}
                    </button>

                    {/* Resend OTP */}
                    <div className="text-center">
                        <button type="button" onClick={handleResendOtp} disabled={resendOtpLoading} className="text-sm font-medium text-[var(--color-primary)] hover:underline cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
                            {resendOtpLoading ? "Sending..." : "Resend OTP"}
                        </button>
                    </div>
                </form>

                {/* Back to Login */}
                <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
                    Want to go back?{" "}
                    <Link href="/login" className="font-medium text-[var(--color-primary)] hover:underline">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default VerifyOtp;