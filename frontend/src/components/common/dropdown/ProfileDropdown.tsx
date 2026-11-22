"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
    FiUser,
    FiSettings,
    FiGlobe,
    FiLogOut,
} from "react-icons/fi";
import LogoutModal from "@/components/common/warning/LogoutWarningModal";

function ProfileDropdown({user_panel = false}: { user_panel: boolean }) {

    // Router
    const router = useRouter();

    // Data From Redux
    const {accessToken, user} = useSelector((state: any) => state.Auth);



    // Dropdown Open
    const [open, setOpen] = useState(false);

    // Dropdown Ref
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Close Dropdown On Outside Click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);



    // Logout Modal Open
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    // Handle Click Open User Card
    const handleClickOpenUserCard = () => {
        if (user) {
            setOpen(true);
        } else {
            router.push("/login");
        }
    };



    return (
        <>
            {/* Content */}
            <div ref={dropdownRef} className="relative">
                {/* Avatar */}
                <button onClick={handleClickOpenUserCard} className={`flex items-center justify-center overflow-hidden rounded-full cursor-pointer border transition-all duration-200 ${user_panel ? "h-10 w-10 bg-surface border-border hover:bg-surface-hover" : "h-9 w-9 bg-background border-white/10 hover:border-primary/50"}`}>
                    {user_panel ? (
                        <FiUser className={`${user_panel ? "text-xl" : "text-lg"} text-text`} />
                    ) : (
                        <>
                            {user?.avatar?.url ? (
                                <img
                                    src={user?.avatar?.url}
                                    alt={user?.name || "User"}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-sm font-semibold uppercase text-surface">
                                    {user?.name?.charAt(0) || "U"}
                                </span>
                            )}
                        </>
                    )}
                </button>

                {/* Dropdown */}
                {accessToken && user && open && (
                    <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-xl border border-border bg-background-primary shadow-xl z-50">
                        {/* Header */}
                        <div className="border-b border-border p-5">
                            <div className="flex items-center gap-3 overflow-hidden">
                                {/* Avatar */}
                                <>
                                    {user?.avatar?.url ? (
                                        <img
                                            src={user?.avatar?.url}
                                            alt={user?.name || "User"}
                                            className="h-12 w-12 rounded-full object-cover border border-border"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold uppercase text-background-primary">
                                            {user?.name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </>

                                {/* Name & Email & Role */}
                                <div className="min-w-0 flex-1">
                                    {/* Name */}
                                    <h3 className="truncate font-semibold text-heading">
                                        {user?.name}
                                    </h3>

                                    {/* Email */}
                                    <p className="truncate text-sm text-muted">
                                        {user?.email}
                                    </p>

                                    {/* Role */}
                                    <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold capitalize text-primary">
                                        {user?.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Menu */}
                        <div className="p-2">
                            {/* Profile */}
                            <Link href="/account" onClick={() => setOpen(false)} className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text transition-all duration-200 hover:bg-surface-hover hover:text-heading">
                                <FiUser className="text-base text-muted transition-colors group-hover:text-primary" />
                                My Account
                            </Link>

                            {/* Settings */}
                            {user && user?.role === "ADMIN" && (
                                <Link href="/dashboard/settings/app" onClick={() => setOpen(false)} className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text transition-all duration-200 hover:bg-surface-hover hover:text-heading">
                                    <FiSettings className="text-base text-muted transition-colors group-hover:text-primary" />
                                    Settings
                                </Link>
                            )}

                            {/* Dashboard / Visit Website */}
                            {["JOURNALIST", "EDITOR", "MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(user?.role) && (
                                user_panel ? (
                                    <Link href="/dashboard" onClick={() => setOpen(false)} className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text transition-all duration-200 hover:bg-surface-hover hover:text-heading">
                                        <FiGlobe className="text-base text-muted transition-colors group-hover:text-primary" />
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link href="/" target="_blank" onClick={() => setOpen(false)} className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text transition-all duration-200 hover:bg-surface-hover hover:text-heading">
                                        <FiGlobe className="text-base text-muted transition-colors group-hover:text-primary" />
                                        Visit Website
                                    </Link>
                                )
                            )}

                            {/* Divider */}
                            <div className="my-1.5 h-px bg-border" />

                            {/* Logout */}
                            <button onClick={() => {
                                setLogoutModalOpen(true);
                                setOpen(false);
                            }} className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-error transition-all duration-200 hover:bg-error/10">
                                <FiLogOut className="text-base transition-transform duration-200 group-hover:translate-x-0.5" />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Logout Warning Modal */}
            {logoutModalOpen && (
                <LogoutModal onClose={() => setLogoutModalOpen(false)}/>
            )}
        </>
    );
}

export default ProfileDropdown;
