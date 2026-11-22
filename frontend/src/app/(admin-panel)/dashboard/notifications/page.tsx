"use client"
import {FiBell, FiEye, FiTrash2} from "react-icons/fi";
import {useEffect, useRef, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {IoMdArrowDropdown} from "react-icons/io";
import {useDeleteNotificationMutation, useGetNotificationsQuery, useMarkNotificationAsReadMutation} from "@/redux/services/notification/notificationApi";
import {responseHandler} from "@/utils/responseHandler";
import Pagination from "@/components/common/other/Pagination";
import {setNotificationToRedux} from "@/redux/services/notification/notificationSlice";
import {useDispatch, useSelector} from "react-redux";

function NotificationsPage() {

    // Dispatch
    const dispatch = useDispatch()

    // Notification State
    const {notifications: reduxNotifications} = useSelector((state: any) => state.Notification)



    // URL Items
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();



    // Filter States
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedLimit, setSelectedLimit] = useState(20);
    const [page, setPage] = useState(1);

    // Sync URL params to filter states
    useEffect(() => {
        setSelectedStatus(searchParams.get("status") || "all");
        setSelectedLimit(Number(searchParams.get("limit")) || 20);
        setPage(Number(searchParams.get("page")) || 1);
    }, [searchParams]);

    // Update URL Search Params
    const updateURLParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        // Update Selected Filter
        params.set(key, value);

        // Reset Page
        params.set("page", "1");

        // Update URL Without Page Reload
        router.replace(`${pathname}?${params.toString()}`, {
            scroll: false,
        });
    };

    // Dropdown States
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [limitDropdownOpen, setLimitDropdownOpen] = useState(false);

    // Status Options
    const statuses = [
        { value: "all", label: "All Notifications" },
        { value: "READ", label: "Read" },
        { value: "UNREAD", label: "Unread" },
    ];

    // Limit Options
    const limits = [20, 40, 60, 80, 100];

    // Dropdown Refs
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const limitDropdownRef = useRef<HTMLDivElement>(null);

    // Close Dropdowns When Clicking Outside
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node;
            if (!statusDropdownRef.current?.contains(target)) {
                setStatusDropdownOpen(false);
            }
            if (!limitDropdownRef.current?.contains(target)) {
                setLimitDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    // Shared Filter Button Style
    const filterButtonClass = "flex w-full items-center justify-between gap-2 rounded-lg " + "border border-border bg-gray-100 px-3 py-2.5 text-sm " + "text-heading transition hover:bg-gray-200";

    // Shared Dropdown Style
    const dropdownClass = "absolute left-0 top-full z-50 mt-2 max-h-64 w-full " + "overflow-y-auto rounded-lg border border-gray-200 bg-white " + "py-1 shadow-lg";

    // Option Style
    const optionClass = "w-full px-3 py-2 text-left text-sm text-text transition " + "hover:bg-gray-100";



    // Call Get Notifications API
    const {data: notificationsData, isLoading: notificationsLoading} = useGetNotificationsQuery({
        page,
        limit: selectedLimit,
        isRead: selectedStatus === "READ" ? true : selectedStatus === "UNREAD" ? false : undefined
    });

    // Set Notifications To Redux
    useEffect(() => {
        if(notificationsData?.data?.notifications && notificationsData?.data?.notifications?.length > 0) {
            dispatch(setNotificationToRedux(notificationsData?.data?.notifications))
        }
    }, [notificationsData])



    // Call Delete Notification API
    const [deleteNotification, {isLoading: deleteNotificationLoading}] = useDeleteNotificationMutation();

    // Handle Delete Notification
    const handleDeleteNotification = async (id: string) => {
        // Validate Notification ID
        if (!id) {
            return responseHandler("E", "Notification ID is required");
        }
        try{
            // Hit Delete Notification API
            const response = await deleteNotification(id).unwrap();

            // return responseHandler("S", response?.message || "Notification deleted successfully");
        }catch(error: any) {
            return responseHandler("E", error?.data?.message)
        }
    }



    // Call Mark Notification As Read API
    const [markNotificationAsRead, {isLoading: markNotificationAsReadLoading}] = useMarkNotificationAsReadMutation();

    // Handle View Notification
    const handleViewNotification = async (notification: any) => {
        // Validate Notification ID
        if (!notification?._id) {
            return responseHandler("E", "Notification ID is required");
        }
        try {
            // Hit Mark Notification As Read API
            const response = await markNotificationAsRead(notification?._id).unwrap();

            // Navigate
            if(["ARTICLE", "COMMENT"].includes(notification?.targetCategory) && notification?.targetId) {
                await router.push(`/dashboard/articles/view/${notification?.targetId?._id}`);
            }
            if(notification?.targetCategory === "CONTACT" && notification?.targetId) {
                await router.push(`/dashboard/contacts/view/${notification?.targetId?._id}`)
            }

            // return responseHandler("S", response?.message || "Notification marked as read");
        } catch (error: any) {
            return responseHandler("E", error?.data?.message || "Failed to mark notification as read");
        }
    };


    return (
        <div className="min-h-screen space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Title */}
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-semibold text-heading">
                        <FiBell className="text-primary" size={24} />
                        Notifications
                    </h1>
                    <p className="mt-1 text-sm text-text">
                        Manage and monitor all platform notifications
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="space-y-4 rounded-xl border border-border bg-white p-4 shadow-sm">
                {/* Filter Dropdowns */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Read Status */}
                    <div ref={statusDropdownRef} className="relative w-full sm:w-60">
                        {/* Selected Status */}
                        <button type="button" onClick={() => setStatusDropdownOpen((prev) => !prev)} className={filterButtonClass}>
                            <span>
                                {statuses.find((item) => item.value === selectedStatus)?.label || "All Notifications"}
                            </span>
                            <IoMdArrowDropdown size={18} />
                        </button>

                        {/* Status Options */}
                        {statusDropdownOpen && (
                            <div className={dropdownClass}>
                                {statuses.map((status) => (
                                    <button key={status.value} type="button" className={optionClass} onClick={() => {
                                        setSelectedStatus(status.value);
                                        setStatusDropdownOpen(false);
                                        setPage(1);
                                        updateURLParams("status", status.value);
                                    }}>
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Limit */}
                    <div ref={limitDropdownRef} className="relative w-full sm:w-60">
                        {/* Selected Limit */}
                        <button type="button" onClick={() => setLimitDropdownOpen((prev) => !prev)} className={filterButtonClass}>
                            <span>{selectedLimit} per page</span>
                            <IoMdArrowDropdown size={18} />
                        </button>

                        {/* Limit Options */}
                        {limitDropdownOpen && (
                            <div className={dropdownClass}>
                                {limits.map((limit) => (
                                    <button key={limit} type="button" className={optionClass} onClick={() => {
                                        setSelectedLimit(limit);
                                        setLimitDropdownOpen(false);
                                        setPage(1);
                                        updateURLParams("limit", String(limit));
                                    }}>
                                        {limit} per page
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* NOTIFICATIONS TABLE */}
            <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[1000px] text-left text-xs">
                        {/* HEADER */}
                        <thead className="border-y border-gray-300 bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                            <tr>
                                <th className="min-w-80 px-4 py-3">Notification</th>
                                <th className="min-w-44 px-4 py-3">Sender</th>
                                <th className="min-w-40 px-4 py-3">Type</th>
                                <th className="min-w-32 px-4 py-3">Target</th>
                                <th className="min-w-28 px-4 py-3">Read Status</th>
                                <th className="min-w-40 whitespace-nowrap px-4 py-3">Created At</th>
                                <th className="min-w-28 px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody className="divide-y divide-gray-100">
                            {/* LOADING SKELETON */}
                            {notificationsLoading && Array.from({ length: selectedLimit }).map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                    {/* NOTIFICATION */}
                                    <td className="px-4 py-4">
                                        <div className="space-y-2">
                                            <div className="h-4 w-40 rounded bg-gray-200" />
                                            <div className="h-3 w-64 rounded bg-gray-200" />
                                        </div>
                                    </td>

                                    {/* SENDER */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-9 w-9 shrink-0 rounded-full bg-gray-200" />
                                            <div className="space-y-2">
                                                <div className="h-4 w-24 rounded bg-gray-200" />
                                                <div className="h-3 w-16 rounded bg-gray-200" />
                                            </div>
                                        </div>
                                    </td>

                                    {/* TYPE */}
                                    <td className="px-4 py-4">
                                        <div className="h-5 w-28 rounded bg-gray-200" />
                                    </td>

                                    {/* TARGET */}
                                    <td className="px-4 py-4">
                                        <div className="h-5 w-20 rounded bg-gray-200" />
                                    </td>

                                    {/* READ STATUS */}
                                    <td className="px-4 py-4">
                                        <div className="h-5 w-16 rounded bg-gray-200" />
                                    </td>

                                    {/* CREATED AT */}
                                    <td className="px-4 py-4">
                                        <div className="space-y-2">
                                            <div className="h-4 w-24 rounded bg-gray-200" />
                                            <div className="h-3 w-16 rounded bg-gray-200" />
                                        </div>
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center gap-2">
                                            <div className="h-8 w-8 rounded-lg bg-gray-200" />
                                            <div className="h-8 w-8 rounded-lg bg-gray-200" />
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {/* NOTIFICATIONS LIST */}
                            {!notificationsLoading && reduxNotifications?.map((notification: any) => {
                                // Sender Information
                                const senderName = notification?.sender?.name || notification?.sender?.fullName || "System";
                                const senderInitials = senderName.split(" ").filter(Boolean).slice(0, 2).map((word: string) => word[0]).join("").toUpperCase();
                                const createdDate = notification?.createdAt ? new Date(notification.createdAt) : null;
                                const hasValidCreatedDate = createdDate && !Number.isNaN(createdDate.getTime());

                                return (
                                    <tr key={notification?._id} className="transition hover:bg-gray-50">
                                        {/* NOTIFICATION */}
                                        <td className="px-4 py-4">
                                            <div className="space-y-1">
                                                <p className="font-semibold text-heading">
                                                    {notification?.title || "Untitled Notification"}
                                                </p>
                                                <p className="max-w-sm line-clamp-2 text-text">
                                                    {notification?.message || "No message available"}
                                                </p>
                                            </div>
                                        </td>

                                        {/* SENDER */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                {/* Avatar */}
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                                                    {senderInitials || "S"}
                                                </div>

                                                {/* Sender Details */}
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-heading">
                                                        {senderName}
                                                    </p>
                                                    <p className="truncate text-[11px] text-text">
                                                        {notification?.sender?.email || "System"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* TYPE */}
                                        <td className="px-4 py-4">
                                            <span className="inline-flex rounded-md bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
                                                {notification?.type?.replaceAll("_", " ") || "Unknown"}
                                            </span>
                                        </td>

                                        {/* TARGET */}
                                        <td className="px-4 py-4">
                                            <div className="space-y-1">
                                                <p className="font-medium text-heading">
                                                    {notification?.targetCategory || "N/A"}
                                                </p>
                                                {notification?.targetId && (
                                                    <p className="max-w-24 truncate text-[10px] text-text">
                                                        {notification?.targetCategory === "CONTACT" ? notification?.targetId?.subject : notification?.targetId?.title}
                                                    </p>
                                                )}
                                            </div>
                                        </td>

                                        {/* READ STATUS */}
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${notification?.isRead ? "bg-gray-100 text-gray-600" : "bg-blue-50 text-blue-700"}`}>
                                                {notification?.isRead ? "Read" : "Unread"}
                                            </span>
                                        </td>

                                        {/* CREATED AT */}
                                        <td className="whitespace-nowrap px-4 py-4">
                                            {hasValidCreatedDate ? (
                                                <div className="space-y-1">
                                                    <p className="font-medium text-heading">
                                                        {createdDate.toLocaleDateString("en-GB", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </p>
                                                    <p className="text-[11px] text-text">
                                                        {createdDate.toLocaleTimeString("en-US", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-text">N/A</span>
                                            )}
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* View Notification */}
                                                <button type="button" title="View Notification" disabled={markNotificationAsReadLoading} onClick={() => handleViewNotification(notification)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <FiEye size={15} />
                                                </button>

                                                {/* Delete Notification */}
                                                <button type="button" title="Delete Notification" disabled={deleteNotificationLoading} onClick={() => handleDeleteNotification(notification?._id?.toString())} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-red-500 transition hover:border-red-200 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                                    <FiTrash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {/* EMPTY STATE */}
                            {!notificationsLoading && (reduxNotifications?.length ?? 0) === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            {/* Icon */}
                                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                                <FiBell size={24} className="text-gray-400" />
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-sm font-semibold text-heading">
                                                No notifications found
                                            </h3>

                                            {/* Description */}
                                            <p className="mt-1 max-w-sm text-xs text-text">
                                                There are no notifications to display for the selected read status.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <>
                {reduxNotifications?.length > 0 && (
                    <Pagination
                        pagination={reduxNotifications?.pagination}
                    />
                )}
            </>
        </div>
    )
}

export default NotificationsPage;