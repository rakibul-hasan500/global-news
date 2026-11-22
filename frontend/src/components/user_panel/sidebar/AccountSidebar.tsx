"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { useState } from "react";
import {FiUser, FiBell, FiLock, FiLogOut,} from "react-icons/fi";
import LogoutModal from "@/components/common/warning/LogoutWarningModal";

function AccountSidebar() {

    // Current Route
    const pathname = usePathname();

    // User Data From Redux
    const {user} = useSelector((state: any) => state.Auth);

    // Logout Modal State
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    // Navigation Links
    const navLinks = [
        {
            name: "My Account",
            href: "/account",
            icon: <FiUser />,
        },
        {
            name: "Notifications",
            href: "/account/notifications",
            icon: <FiBell />,
        },
        {
            name: "Change Password",
            href: "/account/change-password",
            icon: <FiLock />,
        },
    ];

    // Check Active Route
    const isActive = (href: string) => {
        if (href === "/account") {
            return pathname === href;
        }
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <>
            <aside className="w-full rounded border border-slate-200 bg-white shadow-sm">
                {/* User Information */}
                <div className="border-b border-slate-200 p-6">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        {user?.avatar?.url ? (
                            <img
                                src={user?.avatar?.url}
                                alt={user?.name || "User"}
                                className="size-14 shrink-0 rounded-full border border-slate-200 object-cover"
                            />
                        ) : (
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold uppercase text-blue-700">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                        )}

                        {/* User Details */}
                        <div className="min-w-0 flex-1">
                            {/* Name */}
                            <h3 className="truncate font-bold text-slate-900">
                                {user?.name || "User"}
                            </h3>

                            {/* Email */}
                            <p className="mt-1 truncate text-sm text-slate-500">
                                {user?.email || ""}
                            </p>

                            {/* Role */}
                            {user?.role && (
                                <span className="mt-2 inline-block rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold capitalize text-blue-700">
                                    {user.role.toLowerCase().replaceAll("_", " ")}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="p-4">
                    {/* Title */}
                    <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Account Settings
                    </p>

                    {/* Nav Links */}
                    <nav className="space-y-1">
                        {navLinks.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link key={item?.href} href={item?.href} className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 ${active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"}`}>
                                    <span className={`text-lg ${active ? "text-blue-700" : "text-slate-400 group-hover:text-blue-700"}`}>
                                        {item?.icon}
                                    </span>
                                    {item?.name}
                                    {active && (
                                        <span className="ml-auto size-1.5 rounded-full bg-blue-700" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Divider */}
                    <div className="my-4 border-t border-slate-200" />

                    {/* Logout */}
                    <button type="button" onClick={() => setLogoutModalOpen(true)} className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-50">
                        <FiLogOut className="text-lg transition-transform group-hover:translate-x-0.5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Logout Warning Modal */}
            {logoutModalOpen && (
                <LogoutModal
                    onClose={() => setLogoutModalOpen(false)}
                />
            )}
        </>
    );
}

export default AccountSidebar;
