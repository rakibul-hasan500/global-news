import VerifyAccount from "@/components/auth/verify_account/VerifyAccount";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Verify Account",
    description: "Verify your email address to activate your account.",
}

function VerifyAccountPage() {
    return <VerifyAccount />
}

export default VerifyAccountPage;