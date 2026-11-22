import { Metadata } from "next";
import VerifyOtp from "@/components/auth/verify_otp/VerifyOtp";

export const metadata: Metadata = {
    title: "Verify OTP",
    description: "Enter the verification code to continue resetting your password.",
};

function VerifyOtpPage() {
    return <VerifyOtp />
}

export default VerifyOtpPage