"use client"
import {
    FiCheckCircle,
    FiEye,
    FiPlus, FiRotateCcw,
    FiSearch,
    FiSlash,
    FiTrash2,
    FiUsers
} from "react-icons/fi";
import {useEffect, useRef, useState} from "react";
import {IoMdArrowDropdown} from "react-icons/io";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useSelector} from "react-redux";
import {
    useGetUsersQuery,
    useToggleBlockUserStatusMutation,
    useToggleDeleteUserStatusMutation
} from "@/redux/services/user/userApi";
import Pagination from "@/components/common/other/Pagination";
import UserDetailsCard from "@/components/admin_panel/user/UserDetailsCard";
import WarningDialog from "@/components/common/warning/WarningDialog";
import {responseHandler} from "@/utils/responseHandler";
import AddUserForm from "@/components/admin_panel/user/AddUserForm";

function UsersPage() {

    // Search Params
    const searchParams = useSearchParams()

    // Router
    const router = useRouter();

    // Pathname
    const pathName = usePathname()



    // Users Data From Redux
    const {user, accessToken} = useSelector((state: any) => state.Auth)



    // Filter States
    const [search, setSearch] = useState("");
    const [selectedRole, setSelectedRole] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedLimit, setSelectedLimit] = useState(20);
    const [page, setPage] = useState(1);

    // Sync URL Params → State
    useEffect(() => {
        setSearch(searchParams.get("search") || "")
        setSelectedRole(searchParams.get("role") || "all")
        setSelectedStatus(searchParams.get("status") || "all")
        setSelectedLimit(Number(searchParams.get("limit")) || 20)
        setPage(Number(searchParams.get("page")) || 1)
    }, [searchParams])



    // Dropdown States
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [limitDropdownOpen, setLimitDropdownOpen] = useState(false);

    // Dropdown ref States
    const roleDropdownRef = useRef<HTMLDivElement>(null);
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const limitDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (roleDropdownRef.current && !roleDropdownRef.current.contains(target)) {
                setRoleDropdownOpen(false);
            }
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(target)) {
                setStatusDropdownOpen(false);
            }
            if (limitDropdownRef.current && !limitDropdownRef.current.contains(target)) {
                setLimitDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    // Roles
    const roles = [
        { value: "all", label: "All Roles" },
        { value: "USER", label: "User" },
        { value: "JOURNALIST", label: "Journalist" },
        { value: "MODERATOR", label: "Moderator" },
        { value: "EDITOR", label: "Editor" },
        { value: "ADMIN", label: "Admin" },
        { value: "SUPER_ADMIN", label: "Super Admin" },
    ];

    // Status
    const statuses = [
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "blocked", label: "Blocked" },
        { value: "deleted", label: "Deleted" },
    ];



    // User Add Modal Open State
    const [userAddModalOpen, setUserAddModalOpen] = useState(false);



    // Call Get All Users API
    const {data: usersData, isLoading: usersDataLoading} = useGetUsersQuery({
        search,
        role: selectedRole,
        status: selectedStatus,
        limit: selectedLimit,
        page
    }, {
        skip: !accessToken || !user || !["MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(user?.role)
    })



    // View
    const [selectedUserToView, setSelectedUserToView] = useState<any>(null);



    // Can Block / Unblock & Delete / Not Delete
    let canBlockOrDelete = (userItem: any) => {
        // Admin
        if (user?.role === "ADMIN" && ["USER", "JOURNALIST", "EDITOR", "MODERATOR"].includes(userItem?.role) && user?._id !== userItem?._id) {
            return true
        }

        // Super Admin
        if(user?.role === "SUPER_ADMIN" && ["USER", "JOURNALIST", "EDITOR", "MODERATOR", "ADMIN"].includes(userItem?.role) && user?._id !== userItem?._id) {
            return true
        }

        return false
    }



    // Block / Unblock
    const [selectedUserToBlock, setSelectedUserToBlock] = useState<any | null>(null);

    // Call Toggle Block User Status API
    const [toggleBlockUserStatus, {isLoading: toggleBlockUserStatusLoading}] = useToggleBlockUserStatusMutation()

    // Handle Toggle Block User Status
    const handleToggleBlockUserStatus = async () => {
        try {
            // Hit Toggle Block User Status API
            const response = await toggleBlockUserStatus(selectedUserToBlock?._id).unwrap()

            // Reset State
            setSelectedUserToBlock(null)

            return responseHandler("S", response?.message)
        } catch (error: any) {
            return responseHandler("E", error?.data?.message)
        }
    }



    // Delete
    const [selectedUserToDelete, setSelectedUserToDelete] = useState<any | null>(null);

    // Call Toggle Delete User Status API
    const [toggleDeleteUserStatus, {isLoading: toggleDeleteUserStatusLoading}] = useToggleDeleteUserStatusMutation()

    // Handle Toggle Delete User Status
    const handleToggleDeleteUserStatus = async () => {
        try {
            // Hit Toggle Delete User Status API
            const response = await toggleDeleteUserStatus(selectedUserToDelete?._id).unwrap()

            // Reset State
            setSelectedUserToDelete(null)

            return responseHandler("S", response?.message)
        } catch (error: any) {
            return responseHandler("E", error?.data?.message)
        }
    }



    return (
        <div className="space-y-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold flex text-heading items-center gap-2">
                        <FiUsers className="text-primary" />
                        Users
                    </h1>
                    <p className="text-sm text-text mt-1">
                        Manage and organize your users
                    </p>
                </div>

                {/* Button */}
                {["ADMIN", "SUPER_ADMIN"].includes(user?.role) && (
                    <button onClick={() => setUserAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm transition shadow-sm cursor-pointer w-max">
                        <FiPlus />
                        Add User
                    </button>
                )}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 bg-white p-4 rounded-xl border border-border shadow-sm">
                {/* Search & Filters */}
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-2">
                    {/* Search */}
                    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg w-full">
                        {/* Icon */}
                        <FiSearch className="text-text" />

                        {/* Input */}
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                const params = new URLSearchParams(searchParams.toString());
                                if (e.target.value) {
                                    params.set("search", e.target.value);
                                } else {
                                    params.delete("search");
                                }
                                params.set("page", "1");
                                router.replace(`${pathName}?${params.toString()}`);
                            }}
                            className="bg-transparent outline-none text-sm w-full text-text placeholder-text-body/60"
                        />
                    </div>

                    {/* Role, Status & Limit Selector */}
                    <div className="grid grid-cols-1 md:flex gap-2 w-full">
                        {/* Role Selector */}
                        <div ref={roleDropdownRef} className="relative w-full">
                            {/* Selected Button */}
                            <button onClick={() => setRoleDropdownOpen(!roleDropdownOpen)} className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition w-full">
                                <span>
                                    {roles.find((role) => role.value === selectedRole)?.label}
                                </span>
                                <IoMdArrowDropdown size={18} />
                            </button>

                            {/* Dropdown */}
                            {roleDropdownOpen && (
                                <div className="absolute w-full top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                                    {roles.map((role) => (
                                        <button key={role.value} onClick={() => {
                                            setSelectedRole(role.value);
                                            setRoleDropdownOpen(false);
                                            const params = new URLSearchParams(searchParams.toString());
                                            if (role.value === "all") {
                                                params.delete("role");
                                            } else {
                                                params.set("role", role.value);
                                            }
                                            params.set("page", "1");
                                            router.replace(`${pathName}?${params.toString()}`);
                                        }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition">
                                            {role.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Status Selector */}
                        <div ref={statusDropdownRef} className="relative w-full">
                            {/* Selected Button */}
                            <button onClick={() => setStatusDropdownOpen(!statusDropdownOpen)} className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition w-full">
                                <span>
                                    {statuses.find((status) => status.value === selectedStatus)?.label}
                                </span>
                                <IoMdArrowDropdown size={18} />
                            </button>

                            {/* Dropdown */}
                            {statusDropdownOpen && (
                                <div className="absolute w-full top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                                    {statuses.map((status) => (
                                        <button key={status.value} onClick={() => {
                                            setSelectedStatus(status.value);
                                            setStatusDropdownOpen(false);
                                            const params = new URLSearchParams(searchParams.toString());
                                            if (status.value === "all") {
                                                params.delete("status");
                                            } else {
                                                params.set("status", status.value);
                                            }
                                            params.set("page", "1");
                                            router.replace(`${pathName}?${params.toString()}`);
                                        }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition">
                                            {status.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Limit Selector */}
                        <div ref={limitDropdownRef} className="relative lg:w-50">
                            {/* Selected Button */}
                            <button onClick={() => setLimitDropdownOpen(!limitDropdownOpen)} className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition w-full">
                            <span>
                                {selectedLimit}
                            </span>
                                <IoMdArrowDropdown size={18} />
                            </button>

                            {/* Dropdown */}
                            {limitDropdownOpen && (
                                <div className="absolute w-full top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                                    {[20, 40, 60, 80, 100].map((limit) => (
                                        <button key={limit} onClick={() => {
                                            setSelectedLimit(limit);
                                            setLimitDropdownOpen(false);
                                            const params = new URLSearchParams(searchParams.toString());
                                            params.set("limit", limit.toString());
                                            params.set("page", "1");
                                            router.replace(`${pathName}?${params.toString()}`);
                                        }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition">
                                            {limit}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-275 w-full text-xs text-left">
                        {/* HEADER */}
                        <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] tracking-wide border-y border-gray-300">
                            <tr>
                                <th className="px-4 py-3">Avatar</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Provider</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Created At</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody className="divide-y divide-gray-100">
                            {/* Users List Items Skeleton */}
                            {usersDataLoading && Array.from({length: 10}).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {/* Avatar */}
                                    <td className="px-4 py-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                    </td>

                                    {/* Name */}
                                    <td className="px-4 py-3">
                                        <div className="h-4 w-32 rounded bg-gray-200"></div>
                                    </td>

                                    {/* Email */}
                                    <td className="px-4 py-3">
                                        <div className="h-4 w-48 rounded bg-gray-200"></div>
                                    </td>

                                    {/* Role */}
                                    <td className="px-4 py-3">
                                        <div className="h-6 w-24 rounded bg-gray-200"></div>
                                    </td>

                                    {/* Provider */}
                                    <td className="px-4 py-3">
                                        <div className="h-4 w-20 rounded bg-gray-200"></div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3">
                                        <div className="h-6 w-16 rounded bg-gray-200"></div>
                                    </td>

                                    {/* Created At */}
                                    <td className="px-4 py-3">
                                        <div className="h-4 w-28 rounded bg-gray-200"></div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <div className="w-8 h-8 rounded-md bg-gray-200"></div>
                                            <div className="w-8 h-8 rounded-md bg-gray-200"></div>
                                            <div className="w-8 h-8 rounded-md bg-gray-200"></div>
                                            <div className="w-8 h-8 rounded-md bg-gray-200"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {/* Users List Items */}
                            {!usersDataLoading && usersData?.data?.users?.map((userItem: any, index: number) => (
                                <tr key={userItem?._id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} transition`}>
                                    {/* AVATAR */}
                                    <td className="px-4 py-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                            {/* Avatar Image */}
                                            {userItem?.avatar?.url ? (
                                                <img
                                                    src={userItem?.avatar?.url}
                                                    alt={userItem?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                /* First Letter */
                                                <span className="text-sm font-semibold text-gray-600 uppercase">
                                                    {userItem?.name?.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* NAME */}
                                    <td className="px-4 py-3 font-medium text-heading max-w-45 truncate">
                                        {userItem?.name}
                                    </td>

                                    {/* EMAIL */}
                                    <td className="px-4 py-3 text-text max-w-55 truncate">
                                        {userItem?.email}
                                    </td>

                                    {/* ROLE */}
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 text-[10px] rounded bg-gray-100 text-gray-700 uppercase">
                                            {userItem?.role?.replace("_", " ")}
                                        </span>
                                    </td>

                                    {/* PROVIDER */}
                                    <td className="px-4 py-3 text-text capitalize">
                                        {userItem?.provider?.toLowerCase()}
                                    </td>

                                    {/* STATUS */}
                                    <td className="px-4 py-3">
                                        {userItem?.isDeleted ? (
                                            <span className="px-2 py-1 text-[10px] rounded bg-error/10 text-error">
                                                Deleted
                                            </span>
                                        ) : userItem?.isBlocked ? (
                                            <span className="px-2 py-1 text-[10px] rounded bg-warning/10 text-warning">
                                                Blocked
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 text-[10px] rounded bg-success/10 text-success">
                                                Active
                                            </span>
                                        )}
                                    </td>

                                    {/* CREATED AT */}
                                    <td className="px-4 py-3 text-text whitespace-nowrap">
                                        {new Date(userItem?.createdAt).toLocaleDateString()}
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* View */}
                                            <button onClick={() => setSelectedUserToView(userItem)} title="View" className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white cursor-pointer">
                                                <FiEye size={14} />
                                            </button>

                                            {/* Block / Unblock */}
                                            {canBlockOrDelete(userItem) && (
                                                <button onClick={() => setSelectedUserToBlock(userItem)} title={userItem?.isBlocked ? "Unblock" : "Block"} className={`flex h-8 w-8 items-center justify-center rounded-md text-white transition cursor-pointer ${userItem?.isBlocked ? "bg-green-600 hover:bg-green-700" : "bg-warning hover:bg-warning/90"}`}>
                                                    {userItem?.isBlocked ? (
                                                        <FiCheckCircle size={15} />
                                                    ) : (
                                                        <FiSlash size={15} />
                                                    )}
                                                </button>
                                            )}

                                            {/* Delete / Restore */}
                                            {canBlockOrDelete(userItem) && (
                                                <button onClick={() => setSelectedUserToDelete(userItem)} title={userItem?.isDeleted ? "Restore" : "Delete"} className={`flex h-8 w-8 items-center justify-center rounded-md text-white transition cursor-pointer ${userItem?.isDeleted ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
                                                    {userItem?.isDeleted ? (
                                                        <FiRotateCcw size={14} />
                                                    ) : (
                                                        <FiTrash2 size={14} />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <>
                {usersData?.data?.users?.length > 0 && (
                    <Pagination
                        pagination={usersData?.data?.pagination}
                    />
                )}
            </>

            {/* User Details Card */}
            <>
                {selectedUserToView && (
                    <UserDetailsCard
                        user={selectedUserToView}
                        onClose={() => setSelectedUserToView(null)}
                    />
                )}
            </>

            {/* Toggle Block Status Warning */}
            <>
                {selectedUserToBlock && (
                    <WarningDialog
                        open={!!selectedUserToBlock}
                        title={selectedUserToBlock?.isBlocked ? "Unblock User" : "Block User"}
                        message={selectedUserToBlock?.isBlocked ? "Are you sure you want to unblock this user?" : "Are you sure you want to block this user? The user will no longer be able to access the platform."}
                        confirmText={selectedUserToBlock?.isBlocked ? "Unblock" : "Block"}
                        loading={toggleBlockUserStatusLoading}
                        onConfirm={handleToggleBlockUserStatus}
                        onCancel={() => setSelectedUserToBlock(null)}
                    />
                )}
            </>

            {/* Toggle Delete Status Warning */}
            <>
                {selectedUserToDelete && (
                    <WarningDialog
                        open={!!selectedUserToDelete}
                        title={selectedUserToDelete?.isDeleted ? "Restore User" : "Delete User"}
                        message={selectedUserToDelete?.isDeleted ? "Are you sure you want to restore this user?" : "Are you sure you want to delete this user? The user will no longer be able to access the platform."}
                        confirmText={selectedUserToDelete?.isDeleted ? "Restore" : "Delete"}
                        loading={toggleDeleteUserStatusLoading}
                        onConfirm={handleToggleDeleteUserStatus}
                        onCancel={() => setSelectedUserToDelete(null)}
                    />
                )}
            </>

            {/* User Add Modal */}
            {userAddModalOpen && (
                <AddUserForm onClose={()=>setUserAddModalOpen(false)}/>
            )}
        </div>
    )
}

export default UsersPage;