"use client"
import { useState } from "react";
import { useSelector } from "react-redux";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import Loader from "@/components/common/other/Loader";
import { responseHandler } from "@/utils/responseHandler";
import { zodErrorHandler } from "@/utils/zodErrorHandler";
import {useChangePasswordMutation} from "@/redux/services/user/userApi";
import {changePasswordSchema} from "@/validation/user.validation";

function ChangePasswordPage() {

    // Auth User
    const { user } = useSelector((state: any) => state.Auth);

    // Passwords Show/Hide States
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form States
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Call Change Password API
    const [changePassword, { isLoading: changePasswordLoading }] = useChangePasswordMutation();

    // Handle Submit Change Password Form
    const handleSubmitChangePasswordForm = async (e: any) => {
        e.preventDefault();
        try {
            // Validate
            const validation = changePasswordSchema.safeParse({
                currentPassword,
                newPassword,
                confirmPassword,
            });
            if (!validation?.success) {
                return zodErrorHandler(validation);
            }

            // Hit Change Password API
            const response: any = await changePassword({
                currentPassword,
                newPassword,
            }).unwrap();

            // Clear States
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            return responseHandler("S", response?.message);
        } catch (error: any) {
            return responseHandler("E", error?.data?.message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Heading */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Change Password
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    Update your password regularly to keep your account secure.
                </p>
            </div>

            {/* Provider Check */}
            {user?.provider !== "CREDENTIALS" ? (
                <div className="max-w-2xl rounded border border-red-200 bg-red-50 p-5">
                    <div className="flex items-start gap-3">
                        <FiLock size={20} className="mt-0.5 shrink-0 text-red-600" />
                        <div>
                            <h3 className="text-sm font-semibold text-red-700">
                                Password Change Unavailable
                            </h3>
                            <p className="mt-1 text-sm leading-relaxed text-red-600">
                                Your account is registered using Google authentication.
                                You cannot change your password here.
                                Please manage your password through your Google Account settings.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-2xl overflow-hidden rounded border border-[var(--color-border)] bg-white shadow-sm">
                    {/* Form Header */}
                    <div className="border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[var(--color-primary)]">
                                <FiLock size={19} />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-[var(--color-heading)]">
                                    Update Your Password
                                </h2>
                                <p className="mt-1 text-xs text-[var(--color-muted)]">
                                    Enter your current password and choose a new one.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Change Password Form */}
                    <form onSubmit={handleSubmitChangePasswordForm} className="space-y-5 p-5 sm:p-6">
                        {/* Current Password */}
                        <div>
                            {/* Label */}
                            <label htmlFor="currentPassword" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
                                Current Password
                            </label>

                            {/* Input & Eye Button */}
                            <div className="relative">
                                {/* Input */}
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter your current password"
                                    autoComplete="current-password"
                                    className="w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 pr-12 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                                />

                                {/* Eye Button */}
                                <button type="button" onClick={() => setShowCurrentPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--color-muted)] transition-colors hover:text-[var(--color-heading)]" aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}>
                                    {showCurrentPassword ? (
                                        <FiEyeOff size={19} />
                                    ) : (
                                        <FiEye size={19} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            {/* Label */}
                            <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
                                New Password
                            </label>

                            {/* Input & Eye Button */}
                            <div className="relative">
                                {/* Input */}
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter your new password"
                                    autoComplete="new-password"
                                    className="w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 pr-12 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                                />

                                {/* Eye Button */}
                                <button type="button" onClick={() => setShowNewPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--color-muted)] transition-colors hover:text-[var(--color-heading)]"
                                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}>
                                    {showNewPassword ? (
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

                        {/* Confirm New Password */}
                        <div>
                            {/* Label */}
                            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
                                Confirm New Password
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
                                    placeholder="Confirm your new password"
                                    autoComplete="new-password"
                                    className="w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 pr-12 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                                />

                                {/* Eye Button */}
                                <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--color-muted)] transition-colors hover:text-[var(--color-heading)]" aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>
                                    {showConfirmPassword ? (
                                        <FiEyeOff size={19} />
                                    ) : (
                                        <FiEye size={19} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end border-t border-[var(--color-border)] pt-5">
                            <button type="submit" disabled={changePasswordLoading} className="flex min-w-40 cursor-pointer items-center justify-center rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-colors not-disabled:hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                {changePasswordLoading ? (
                                    <Loader />
                                ) : (
                                    "Change Password"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ChangePasswordPage;
