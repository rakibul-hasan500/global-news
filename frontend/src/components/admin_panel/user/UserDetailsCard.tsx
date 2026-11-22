"use client";
import {
    FiX,
    FiUser,
    FiMail,
    FiShield,
    FiLock,
    FiUnlock,
    FiTrash2,
    FiCheckCircle,
} from "react-icons/fi";

function UserDetailsCard({user, onClose}: any) {

    // No User
    if(!user){
        return null;
    }

    // User Status
    const status = user?.isDeleted ? {
        label: "Deleted",
        icon: <FiTrash2 size={14}/>,
        className: "bg-error/10 text-error",
    } : user?.isBlocked ? {
        label: "Blocked",
        icon: <FiLock size={14}/>,
        className: "bg-warning/10 text-warning",
    } : {
        label: "Active",
        icon: <FiCheckCircle size={14}/>,
        className: "bg-success/10 text-success",
    };

    // Format Date
    const formatDate = (date: string) => {
        if(!date){
            return "-";
        }
        return new Date(date).toLocaleString();
    };

    return (
        <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-5">
            {/* Card */}
            <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    {/* Title */}
                    <div>
                        <h2 className="text-xl font-semibold text-heading flex items-center gap-2">
                            <FiUser className="text-primary"/>
                            User Details
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            View user account information
                        </p>
                    </div>

                    {/* Close Button */}
                    <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
                        <FiX size={20}/>
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
                    {/* Profile */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5 rounded-xl border border-gray-200 bg-gray-50 p-5">
                        {/* Avatar */}
                        <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {user?.avatar?.url ? (
                                <img
                                    src={user?.avatar?.url}
                                    alt={user?.name || "User"}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-3xl font-semibold text-gray-500 uppercase">
                                    {user?.name?.charAt(0) || "U"}
                                </span>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="min-w-0 flex-1">
                            {/* Name */}
                            <h3 className="text-xl font-semibold text-heading truncate">
                                {user?.name || "-"}
                            </h3>

                            {/* Email */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 break-all">
                                <FiMail size={14}/>
                                {user?.email || "-"}
                            </div>

                            {/* Role + Status */}
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                {/* Role */}
                                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary px-2.5 py-1 text-xs font-medium uppercase">
                                    <FiShield size={13}/>
                                    {user?.role?.replaceAll("_", " ") || "-"}
                                </span>

                                {/* Status */}
                                <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${status.className}`}>
                                    {status.icon}
                                    {status.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div>
                        {/* Section Title */}
                        <h3 className="text-sm font-semibold text-heading mb-4">
                            Account Information
                        </h3>

                        {/* Information Grid */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {/* User ID */}
                            <div>
                                {/* Label */}
                                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                                    User ID
                                </p>

                                {/* Info */}
                                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 break-all text-sm text-gray-700 min-h-10 flex items-center">
                                    {user?._id || "-"}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                {/* Label */}
                                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                                    Email
                                </p>

                                {/* Info */}
                                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 break-all text-sm text-gray-700 min-h-10 flex items-center">
                                    {user?.email || "-"}
                                </div>
                            </div>

                            {/* Provider */}
                            <div>
                                {/* Label */}
                                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                                    Provider
                                </p>

                                {/* Info */}
                                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 min-h-10 flex items-center capitalize">
                                    {user?.provider?.toLowerCase() || "-"}
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                {/* Label */}
                                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                                    Role
                                </p>

                                {/* Info */}
                                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 min-h-10 flex items-center uppercase">
                                    {user?.role?.replaceAll("_", " ") || "-"}
                                </div>
                            </div>

                            {/* Created At */}
                            <div>
                                {/* Label */}
                                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                                    Created At
                                </p>

                                {/* Info */}
                                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 min-h-10 flex items-center">
                                    {formatDate(user?.createdAt)}
                                </div>
                            </div>

                            {/* Updated At */}
                            <div>
                                {/* Label */}
                                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                                    Updated At
                                </p>

                                {/* Info */}
                                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 min-h-10 flex items-center">
                                    {formatDate(user?.updatedAt)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Status */}
                    <div>
                        {/* Section Title */}
                        <h3 className="text-sm font-semibold text-heading mb-4">
                            Account Status
                        </h3>

                        {/* Section Data */}
                        <div className="grid sm:grid-cols-2 gap-5">

                            {/* Block Status */}
                            <div>
                                {/* Label */}
                                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                                    Block Status
                                </p>

                                {/* Info */}
                                <div className={`rounded-lg border px-3 py-2 text-sm min-h-10 flex items-center gap-2 ${!user?.isBlocked ? "border-success/20 bg-success/5 text-success" : "border-error/20 bg-error/5 text-error"}`}>
                                    {!user?.isBlocked ? (
                                        <>
                                            <FiUnlock size={16}/>
                                            <span>Not Blocked</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiLock size={16}/>
                                            <span>Blocked</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Delete Status */}
                            <div>
                                {/* Label */}
                                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                                    Delete Status
                                </p>

                                {/* Info */}
                                <div className={`rounded-lg border px-3 py-2 text-sm min-h-10 flex items-center gap-2 ${!user?.isDeleted ? "border-success/20 bg-success/5 text-success" : "border-error/20 bg-error/5 text-error"}`}>
                                    {!user?.isDeleted ? (
                                        <>
                                            <FiCheckCircle size={16}/>
                                            <span>Not Deleted</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiTrash2 size={16}/>
                                            <span>Deleted</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-gray-200 p-6">
                    {/* Close */}
                    <button onClick={onClose} className="rounded-lg border border-gray-300 px-5 py-2 hover:bg-gray-100 transition cursor-pointer">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserDetailsCard;
