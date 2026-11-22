"use client"
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import Link from "next/link";
import Loader from "@/components/common/other/Loader";
import {useVerifyAccountMutation} from "@/redux/services/auth/authApi";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";

function VerifyAccount() {

    // Params
    const params = useParams<{token: string}>();

    // States
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    // Call Verify Account API
    const [verifyAccount, {isLoading: verifyAccountLoading}] = useVerifyAccountMutation()

    useEffect(() => {
        const handleVerifyAccount = async () => {
            try {
                const token = params?.token || ""
                const response = await verifyAccount(token).unwrap()
                setIsSuccess(true)
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false);
            }
        }
        handleVerifyAccount();
    }, [params])

    return (
        <div className="min-h-screen w-full bg-[var(--color-auth-background)] px-4 flex items-center justify-center py-8">
            {isLoading ? (
                // Loading
                <Loader size={24}/>
            ) : isSuccess ? (
                // Success
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
                    {/* Icon */}
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)]/10">
                        <FiCheckCircle size={34} className="text-[var(--color-success)]"/>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-[var(--color-heading)]">
                        Account Verified
                    </h1>

                    {/* Description */}
                    <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                        Your email address has been verified successfully.
                        Your account is now active and ready to use.
                    </p>

                    {/* Buton */}
                    <Link href="/login" className="mt-6 block w-full rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20">
                        Continue to Login
                    </Link>
                </div>
            ) : (
                // Error Card
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
                    {/* Icon */}
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-error)]/10">
                        <FiXCircle
                            size={34}
                            className="text-[var(--color-error)]"
                        />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-[var(--color-heading)]">
                        Verification Failed
                    </h1>

                    {/* Description */}
                    <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                        We couldn't verify your account. The verification
                        link may be invalid or expired.
                    </p>

                    {/* Button */}
                    <Link href="/register" className="mt-6 block w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-heading)] transition-colors hover:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20">
                        Back to Register
                    </Link>
                </div>
            )}
        </div>
    )
}

export default VerifyAccount;

