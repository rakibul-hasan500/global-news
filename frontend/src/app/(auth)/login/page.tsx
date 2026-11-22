import {Metadata} from "next";
import Login from "@/components/auth/login/Login";

export const metadata: Metadata = {
    title: "Login",
    description: "Sign in to your account to stay updated with the latest news and stories.",
}

function LoginPage() {
    return <Login />
}

export default LoginPage;