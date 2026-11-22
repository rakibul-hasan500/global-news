"use client";
import { useSelector } from "react-redux";
import {FiUser, FiMail, FiShield, FiLock, FiCheckCircle, FiGlobe,} from "react-icons/fi";

function AccountPage() {

    // User From Redux
    const {user} = useSelector((state: any) => state.Auth);

    // Role
    const getRoleLabel = (role?: string) => {
        if (!role) return "User";
        return role
            .toLowerCase()
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    // No User
    if (!user) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-sm text-slate-500">
                    Unable to load account information.
                </p>
            </div>
        );
    }

    // Account Details
    const accountDetails = [
        {
            label: "Full Name",
            value: user.name || "Not provided",
            icon: <FiUser />,
        },
        {
            label: "Email Address",
            value: user.email || "Not provided",
            icon: <FiMail />,
        },
        {
            label: "Account Role",
            value: getRoleLabel(user.role),
            icon: <FiShield />,
        },
        {
            label: "Login Provider",
            value: user.provider === "GOOGLE" ? "Google" : "Email & Password",
            icon: <FiGlobe />,
        },
    ];

    return (
        <div className="w-full space-y-6">
            {/* Page Heading */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    My Account
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    Manage your personal information and account details.
                </p>
            </div>

            {/* Profile Header */}
            <div className="rounded border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    {/* Avatar */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 text-2xl font-bold text-blue-600 sm:h-24 sm:w-24">
                        {user.avatar?.url ? (
                            <img
                                src={user.avatar?.url}
                                alt={user?.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            user.name?.charAt(0)?.toUpperCase() || "U"
                        )}
                    </div>

                    {/* User Information */}
                    <div className="min-w-0 flex-1">
                        {/* Name */}
                        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                            {user.name}
                        </h2>

                        {/* Email */}
                        <p className="mt-1 break-all text-sm text-slate-500">
                            {user.email}
                        </p>

                        {/* Role 7 Status */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            {/* Role */}
                            <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                {getRoleLabel(user.role)}
                            </span>

                            {/* Account Status */}
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                <FiCheckCircle size={13} />
                                Active Account
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Information */}
            <div className="rounded border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                {/* Section Title */}
                <div className="mb-6 flex items-center justify-between gap-3">
                    {/* Text */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Personal Information
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Your registered account information.
                        </p>
                    </div>

                    {/* Icon */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FiUser size={19} />
                    </div>
                </div>

                {/* Section Data */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {accountDetails.map((item) => (
                        <div key={item.label} className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-blue-100 hover:bg-blue-50/40">
                            {/* Icon */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-lg text-blue-600 shadow-sm">
                                {item.icon}
                            </div>

                            {/* Data */}
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-slate-500">
                                    {item.label}
                                </p>
                                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                                    {item.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Security Information */}
            <div className="rounded border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <FiLock size={20} />
                    </div>

                    {/* Data */}
                    <div>
                        <h3 className="font-bold text-slate-900">
                            Account Security
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Your account is protected. Keep your login
                            credentials private and never share your password
                            with anyone.
                        </p>
                        <p className="mt-3 text-xs font-medium text-emerald-700">
                            <FiCheckCircle className="mr-1 inline" />
                            Your account information is securely managed.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountPage;
