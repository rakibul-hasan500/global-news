"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {FiBell, FiCheck, FiTrash2} from "react-icons/fi";
import {useDeleteNotificationMutation, useGetNotificationsQuery, useMarkNotificationAsReadMutation,} from "@/redux/services/notification/notificationApi";
import { responseHandler } from "@/utils/responseHandler";
import {useDispatch, useSelector} from "react-redux";
import {
    setNotificationToRedux,
    setUnreadNotificationCountToRedux
} from "@/redux/services/notification/notificationSlice";

function NotificationDropdown({style="DARK"}: any) {

    // Dispatch
    const dispatch = useDispatch()

    // Router
    const router = useRouter()

    // Current User
    const {user} = useSelector((state: any) => state.Auth)

    // Notification State
    const {notifications: reduxNotifications, unreadCount: reduxUnreadCount} = useSelector((state: any) => state.Notification)



    // Dropdown Open States
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);



    // Call Get Notifications API
    const {data: notificationsData, isLoading} = useGetNotificationsQuery({
        page: 1,
        limit: 5,
    })
    const notifications = notificationsData?.data?.notifications ?? []
    const unreadCount = notificationsData?.data?.unreadNotificationCount ?? 0

    // Set Notifications To Redux
    useEffect(() => {
        if(notifications && notifications?.length > 0) {
            dispatch(setNotificationToRedux(notifications))
        }
        if(unreadCount) {
            dispatch(setUnreadNotificationCountToRedux(unreadCount))
        }
    }, [notificationsData, notifications])



    // Call Mark Notification As Read API
    const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

    // Handle Notification Click
    const handleNotificationClick = async (notification: any) => {
        try {
            // Mark Notification As Read API
            if (!notification?.isRead) {
                await markNotificationAsRead(notification._id).unwrap();
            }

            // Close Dropdown
            setIsOpen(false);

            // Navigate
            if (["ARTICLE", "COMMENT"].includes(notification?.targetCategory) && notification?.targetId) {
                if(user?.role === "USER") {
                    router.push(`/articles/${notification?.targetId?.slug}`);
                }else{
                    router.push(`/dashboard/articles/view/${notification?.targetId?._id}`);
                }
                return;
            }
            if (notification?.targetCategory === "CONTACT" && notification?.targetId) {
                router.push(`/dashboard/contacts/view/${notification?.targetId?._id}`);
                return;
            }
        } catch (error: any) {
            responseHandler("E", error?.data?.message || "Failed to open notification");
        }
    };



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


    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Button */}
            <button type="button" onClick={() => setIsOpen((open) => !open)} aria-label="Notifications" aria-expanded={isOpen} className={`${style === "DARK" ? "bg-white/10 text-gray-200 hover:bg-white/20 hover:text-white h-10 w-10" : "text-gray-700 bg-gray-50 border border-gray-200 h-11 w-11"} relative flex items-center justify-center rounded-full  text-xl transition cursor-pointer`}>
                <FiBell />
                {reduxUnreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                        {reduxUnreadCount > 99 ? "99+" : reduxUnreadCount}
                    </span>
                )}
            </button>

            {/* Notification ropdown */}
            {isOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-border bg-surface text-heading shadow-xl sm:w-96">
                    {/* Title & Unread Count */}
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <h3 className="font-semibold">Notifications</h3>
                        {reduxUnreadCount > 0 && (
                            <span className="text-xs text-text">
                                {reduxUnreadCount} unread
                            </span>
                        )}
                    </div>

                    {/* Main Body */}
                    {isLoading ? (
                        <p className="px-4 py-6 text-center text-sm text-text">
                            Loading notifications...
                        </p>
                    ) : reduxNotifications?.length === 0 ? (
                        <p className="px-4 py-6 text-center text-sm text-text">
                            No notifications yet
                        </p>
                    ) : (
                        <div className="max-h-96 overflow-y-auto">
                            {reduxNotifications?.map((notification: any) => (
                                <div key={notification?._id} className={`flex w-full items-start gap-3 border-b border-border px-4 py-3 transition ${!notification?.isRead ? "bg-primary/5" : ""}`}>
                                    {/* Notification Data */}
                                    <button type="button" onClick={() => handleNotificationClick(notification)} className="flex min-w-0 flex-1 gap-3 text-left hover:bg-surface-hover">
                                        {/* Icon */}
                                        <span className="mt-1 text-primary">
                                            {!notification?.isRead ? <FiBell /> : <FiCheck />}
                                        </span>

                                        {/* Data */}
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-medium">
                                                {notification?.title}
                                            </span>
                                            <span className="mt-1 block line-clamp-2 text-xs text-text">
                                                {notification?.message}
                                            </span>
                                        </span>
                                    </button>

                                    {/* Delete Notification */}
                                    <button type="button" aria-label="Delete notification" title="Delete notification" disabled={deleteNotificationLoading} onClick={() => handleDeleteNotification(notification._id)} className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted transition hover:bg-error/10 hover:text-error cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
                                        <FiTrash2 className="text-sm" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* View All */}
                    <button type="button" onClick={() => {
                        setIsOpen(false);
                        if(user?.role === "USER") {
                            router.push("/account/notifications");
                        } else {
                            router.push("/dashboard/notifications");
                        }
                    }} className="w-full px-4 py-3 text-center text-sm font-medium text-primary transition hover:bg-background hover:text-white cursor-pointer">
                        View all notifications
                    </button>
                </div>
            )}
        </div>
    );
}

export default NotificationDropdown;