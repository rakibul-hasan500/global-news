import Register from "@/components/auth/register/Register";

export const metadata: {title: string; description: string} = {
    title: "Register",
    description: "Create your account and stay updated with the latest news and stories.",
}

function RegisterPage() {
    return <Register />;
}

export default RegisterPage;