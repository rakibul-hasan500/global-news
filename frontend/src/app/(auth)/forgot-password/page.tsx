import {Metadata} from "next";
import ForgotPassword from "@/components/auth/forgot_password/ForgotPassword";

export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Reset your password and regain access to your account.",
}

function ForgotPasswordPage() {
    return <ForgotPassword />
}

export default ForgotPasswordPage;