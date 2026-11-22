import {Metadata} from "next";
import ResetPassword from "@/components/auth/reset_password/ResetPassword";

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Create a new password and secure your account.",
}

function ResetPasswordPage() {
    return <ResetPassword />;
}

export default ResetPasswordPage;