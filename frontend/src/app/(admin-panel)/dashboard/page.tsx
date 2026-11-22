"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
    FiBell,
    FiCheckCircle,
    FiClock, FiEdit2, FiEye,
    FiFileText,
    FiMail,
    FiMessageSquare,
    FiPlus, FiRotateCcw, FiSlash, FiStar, FiTrash2,
    FiUserCheck,
    FiUsers,
    FiXCircle
} from "react-icons/fi";
import {useGetDashboardStatsQuery} from "@/redux/services/dashboard/dashboardApi";
import Reactions from "@/components/common/reaction/Reactions";
import Pagination from "@/components/common/other/Pagination";
import {
    useDeleteArticleMutation,
    useGetDashboardArticlesQuery,
    useToggleArticleFeaturedStatusMutation
} from "@/redux/services/article/articleApi";
import {responseHandler} from "@/utils/responseHandler";
import {useState} from "react";
import DeleteWarningModal from "@/components/common/warning/DeleteWarningModal";
import {useDeleteContactMessageMutation, useGetContactMessagesQuery} from "@/redux/services/contact/contactApi";
import {
    useGetUsersQuery,
    useToggleBlockUserStatusMutation,
    useToggleDeleteUserStatusMutation
} from "@/redux/services/user/userApi";
import UserDetailsCard from "@/components/admin_panel/user/UserDetailsCard";
import WarningDialog from "@/components/common/warning/WarningDialog";
import {
    useDeleteNotificationMutation,
    useGetNotificationsQuery,
    useMarkNotificationAsReadMutation
} from "@/redux/services/notification/notificationApi";

function DashboardPage() {

    // Router
    const router = useRouter();

    // Auth User From Redux
    const {user} = useSelector((state: any) => state.Auth);



    // Dashboard Header Content
    const dashboard = {
        title: "Dashboard",
        description: "Welcome to your dashboard. Manage your activities from here."
    };
    if (user?.role === "JOURNALIST") {
        dashboard.title = "Journalist Dashboard";
        dashboard.description = "Manage your articles and track their performance.";
    }



    // Call get Dashboard Stats API
    const {data: dashboardStatsData, isLoading: dashboardStatsDataLoading} = useGetDashboardStatsQuery(null)

    // Dashboard Statistics
    const stats = dashboardStatsData?.data?.stats || {};

    // Statistics Cards By Role
    const dashboardCards: any = {
        ADMIN: [
            {title: "Total Users", value: stats.totalUsers, icon: FiUsers, color: "blue"},
            {title: "Total Journalists", value: stats.totalJournalists, icon: FiUserCheck, color: "indigo"},
            {title: "Total Articles", value: stats.totalArticles, icon: FiFileText, color: "purple"},
            {title: "Published Articles", value: stats.totalPublishedArticles, icon: FiCheckCircle, color: "green"},
            {title: "Submitted Articles", value: stats.totalSubmittedArticles, icon: FiClock, color: "amber"},
            {title: "Rejected Articles", value: stats.totalRejectedArticles, icon: FiXCircle, color: "red"},
            {title: "Contact Messages", value: stats.totalContactMessages, icon: FiMail, color: "cyan"},
            {title: "Unread Messages", value: stats.totalUnreadContactMessages, icon: FiMessageSquare, color: "orange"}
        ],
        SUPER_ADMIN: [
            {title: "Total Users", value: stats.totalUsers, icon: FiUsers, color: "blue"},
            {title: "Total Journalists", value: stats.totalJournalists, icon: FiUserCheck, color: "indigo"},
            {title: "Total Articles", value: stats.totalArticles, icon: FiFileText, color: "purple"},
            {title: "Published Articles", value: stats.totalPublishedArticles, icon: FiCheckCircle, color: "green"},
            {title: "Submitted Articles", value: stats.totalSubmittedArticles, icon: FiClock, color: "amber"},
            {title: "Rejected Articles", value: stats.totalRejectedArticles, icon: FiXCircle, color: "red"},
            {title: "Contact Messages", value: stats.totalContactMessages, icon: FiMail, color: "cyan"},
            {title: "Unread Messages", value: stats.totalUnreadContactMessages, icon: FiMessageSquare, color: "orange"}
        ],
        MODERATOR: [
            {title: "Total Comments", value: stats.totalComments, icon: FiMessageSquare, color: "blue"},
            {title: "Total Articles", value: stats.totalArticles, icon: FiFileText, color: "purple"},
            {title: "Published Articles", value: stats.totalPublishedArticles, icon: FiCheckCircle, color: "green"},
            {title: "Submitted Articles", value: stats.totalSubmittedArticles, icon: FiClock, color: "amber"},
            {title: "Rejected Articles", value: stats.totalRejectedArticles, icon: FiXCircle, color: "red"}
        ],
        EDITOR: [
            {title: "Total Comments", value: stats.totalComments, icon: FiMessageSquare, color: "blue"},
            {title: "Total Articles", value: stats.totalArticles, icon: FiFileText, color: "purple"},
            {title: "Published Articles", value: stats.totalPublishedArticles, icon: FiCheckCircle, color: "green"},
            {title: "Submitted Articles", value: stats.totalSubmittedArticles, icon: FiClock, color: "amber"},
            {title: "Rejected Articles", value: stats.totalRejectedArticles, icon: FiXCircle, color: "red"}
        ],
        JOURNALIST: [
            {title: "My Articles", value: stats.totalArticles, icon: FiFileText, color: "blue"},
            {title: "Published Articles", value: stats.totalPublishedArticles, icon: FiCheckCircle, color: "green"},
            {title: "Submitted Articles", value: stats.totalSubmittedArticles, icon: FiClock, color: "amber"},
            {title: "Rejected Articles", value: stats.totalRejectedArticles, icon: FiXCircle, color: "red"}
        ]
    }

    // Get Cards For Current User
    const cards = dashboardCards[user?.role] || []

    // Card Color Styles
    const cardColors: any = {
        blue: "bg-blue-50 text-blue-600",
        indigo: "bg-indigo-50 text-indigo-600",
        purple: "bg-purple-50 text-purple-600",
        green: "bg-green-50 text-green-600",
        amber: "bg-amber-50 text-amber-600",
        red: "bg-red-50 text-red-600",
        cyan: "bg-cyan-50 text-cyan-600",
        orange: "bg-orange-50 text-orange-600"
    }



    // Call Get Dashboard Articles API
    const {data: articlesData, isLoading: articlesDataLoading} = useGetDashboardArticlesQuery({
        status: "SUBMITTED",
        limit: 10,
        page: 1
    })



    // Call Toggle Article Featured Status API
    const [toggleArticleFeaturedStatus, {isLoading: toggleArticleFeaturedStatusLoading}] = useToggleArticleFeaturedStatusMutation()

    // Handle Toggle Article Featured Status
    const handleToggleArticleFeaturedStatus = async (id: string) => {
        try {
            // Hit Toggle Article Featured Status API
            const response = await toggleArticleFeaturedStatus(id).unwrap()

            return responseHandler("S", response?.message)
        } catch (error: any) {
            return responseHandler("E", error?.data?.message)
        }
    }

    // Selected Article To Delete
    const [selectedArticleToDelete, setSelectedArticleToDelete] = useState<any>(null);

    // Call Delete Article API
    const [deleteArticle, {isLoading: deleteArticleLoading}] = useDeleteArticleMutation();

    // Handle Delete Article
    const handleDeleteArticle = async () => {
        if (!selectedArticleToDelete?._id) return;
        try {
            // Hit Delete Article API
            const response = await deleteArticle(selectedArticleToDelete._id).unwrap();

            // Reset State
            setSelectedArticleToDelete(null);

            return responseHandler("S", response?.message || "Article deleted successfully");
        } catch (error: any) {
            return responseHandler("E", error?.data?.message || "Failed to delete article");
        }
    };



    // Call Get Contact Messages API
    const {data: contactMessagesData, isLoading: contactMessagesDataLoading} = useGetContactMessagesQuery({
        page: 1,
        limit: 10 ,
        isRead:false
    }, {
        skip: !user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)
    });

    // Selected Contact Message To Delete
    const [selectedContactMessageToDelete, setSelectedContactMessageToDelete] = useState<any>(null);

    // Call Delete Contact Message API
    const [deleteContactMessage, {isLoading: deleteContactMessageLoading}] = useDeleteContactMessageMutation()

    // Handle Delete Contact Message
    const handleDeleteContactMessage = async () => {
        try {
            // Hit Delete Contact Message API
            const response = await deleteContactMessage(selectedContactMessageToDelete).unwrap()

            // Reset States
            setSelectedContactMessageToDelete(null)

            return responseHandler("S", response?.message)
        }catch (error: any) {
            return responseHandler("E", error?.data?.message)
        }
    }



    // Call Get All Users API
    const {data: usersData, isLoading: usersDataLoading} = useGetUsersQuery({
        limit: 10,
        page: 1
    }, {
        skip: !user || !["MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(user?.role)
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



    // Call Get Notifications API
    const {data: notificationsData, isLoading: notificationsLoading} = useGetNotificationsQuery({
        page: 1,
        limit: 10,
        isRead:false
    });

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
                router.push(`/dashboard/articles/view/${notification?.targetId?._id}`);
            }
            if(notification?.targetCategory === "CONTACT" && notification?.targetId) {
                router.push(`/dashboard/contacts/view/${notification?.targetId?._id}`)
            }

            // return responseHandler("S", response?.message || "Notification marked as read");
        } catch (error: any) {
            return responseHandler("E", error?.data?.message || "Failed to mark notification as read");
        }
    };


    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Header Content */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {dashboard.title}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {dashboard.description}
                    </p>
                </div>

                {/* Journalist Action */}
                {user?.role === "JOURNALIST" && (
                    <button type="button" onClick={() => router.push("/dashboard/article/add")} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
                        <FiPlus size={18} />
                        Create Article
                    </button>
                )}
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardStatsDataLoading ? (
                    Array.from({ length: cards.length || 4 }).map((_, index) => (
                        <div key={index} className="animate-pulse rounded-xl border border-gray-200 bg-white p-5">
                            <div className="flex items-center justify-between">
                                <div className="h-4 w-28 rounded bg-gray-200" />
                                <div className="h-10 w-10 rounded-lg bg-gray-200" />
                            </div>
                            <div className="mt-5 h-7 w-16 rounded bg-gray-200" />
                        </div>
                    ))
                ) : (
                    cards?.map((card: any, index: number) => {
                        const Icon = card.icon;
                        return (
                            <div key={index} className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-sm">
                                {/* Card Data */}
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-500">
                                        {card?.title}
                                    </p>
                                    <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${cardColors[card.color]}`}>
                                        <Icon size={21} />
                                    </div>
                                </div>

                                {/* Value */}
                                <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                                    {(card?.value ?? 0).toLocaleString()}
                                </h2>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pending Articles */}
            <div>
                {/* ARTICLES SECTION HEADER */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
                    {/* Title & Description */}
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Pending Articles
                            </h2>
                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                {articlesData?.data?.pagination?.totalItems ?? 0}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Review and manage articles waiting for editorial approval.
                        </p>
                    </div>

                    {/* View All Button */}
                    <button type="button" onClick={() => router.push("/dashboard/articles")} className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 cursor-pointer">
                        View All
                    </button>
                </div>

                {/* ARTICLES TABLE */}
                <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-[1400px] w-full text-xs text-left">
                            {/* HEADER */}
                            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] tracking-wide border-y border-gray-300">
                            <tr>
                                <th className="px-4 py-3 min-w-72">Article</th>
                                <th className="px-4 py-3 min-w-32 text-center">Reactions</th>
                                <th className="px-4 py-3 min-w-40">Author</th>
                                <th className="px-4 py-3 min-w-40">Categories</th>
                                <th className="px-4 py-3 min-w-36">Tags</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 whitespace-nowrap">Publish At</th>
                                <th className="px-4 py-3 whitespace-nowrap">Created At</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                            </thead>

                            {/* Items */}
                            <tbody className="divide-y divide-gray-100">
                                {/* LOADING SKELETON */}
                                {articlesDataLoading && Array.from({ length: 10 }).map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        {/* ARTICLE */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-14 h-11 shrink-0 rounded-lg bg-gray-200" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-48 rounded bg-gray-200" />
                                                    <div className="h-3 w-32 rounded bg-gray-200" />
                                                </div>
                                            </div>
                                        </td>

                                        {/* REACTIONS */}
                                        <td className="px-4 py-3">
                                            <div className="h-5 w-8 rounded bg-gray-200" />
                                        </td>

                                        {/* AUTHOR */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-gray-200" />
                                                <div className="h-4 w-24 rounded bg-gray-200" />
                                            </div>
                                        </td>

                                        {/* CATEGORIES */}
                                        <td className="px-4 py-3">
                                            <div className="h-5 w-24 rounded bg-gray-200" />
                                        </td>

                                        {/* TAGS */}
                                        <td className="px-4 py-3">
                                            <div className="h-5 w-20 rounded bg-gray-200" />
                                        </td>

                                        {/* STATUS */}
                                        <td className="px-4 py-3">
                                            <div className="h-5 w-20 rounded bg-gray-200" />
                                        </td>

                                        {/* PUBLISH AT */}
                                        <td className="px-4 py-3">
                                            <div className="space-y-2">
                                                <div className="h-4 w-24 rounded bg-gray-200" />
                                                <div className="h-4 w-16 rounded bg-gray-200" />
                                            </div>
                                        </td>

                                        {/* CREATED AT */}
                                        <td className="px-4 py-3">
                                            <div className="h-4 w-24 rounded bg-gray-200" />
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <div className="h-8 w-8 rounded-md bg-gray-200" />
                                                <div className="h-8 w-8 rounded-md bg-gray-200" />
                                                <div className="h-8 w-8 rounded-md bg-gray-200" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {/* ARTICLE LIST */}
                                {!articlesDataLoading && articlesData?.data?.articles?.map((article: any, index: number) => {
                                    const publishDate = article?.publishAt ? new Date(article.publishAt) : null;
                                    const hasValidPublishDate = publishDate && !Number.isNaN(publishDate?.getTime());
                                    return (
                                        <tr key={article?._id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} transition hover:bg-blue-50/40`}>
                                            {/* ARTICLE: COVER + TITLE + SLUG */}
                                            <td className="px-4 py-3 flex items-center gap-3">
                                                {/* Featured */}
                                                <button disabled={!["EDITOR", "ADMIN", "SUPER_ADMIN"].includes(user?.role) || toggleArticleFeaturedStatusLoading} onClick={()=>handleToggleArticleFeaturedStatus(article?._id)} className="cursor-pointer">
                                                    {article?.isFeatured ? (
                                                        <FiStar size={18} className="fill-yellow-400 text-yellow-400" title="Featured"/>
                                                    ) : (
                                                        <FiStar size={18} className="text-gray-400" title="Not featured"/>
                                                    )}
                                                </button>

                                                {/* Article Data */}
                                                <div className="flex items-center gap-3 mb-2">
                                                    {/* Image */}
                                                    <div className="w-14 h-11 shrink-0 overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
                                                        {article?.coverImage?.url ? (
                                                            <img
                                                                src={article?.coverImage?.url}
                                                                alt={article?.coverImage?.altTag || article?.title || "Article cover"}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <FiFileText size={18} className="text-gray-500"/>
                                                        )}
                                                    </div>

                                                    {/* Title & Slug */}
                                                    <div className="min-w-0">
                                                        <p className="max-w-64 truncate text-sm font-semibold text-heading">
                                                            {article?.title || "Untitled Article"}
                                                        </p>
                                                        <p className="mt-1 max-w-64 truncate text-xs text-text">
                                                            {article?.slug || "—"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* REACTIONS */}
                                            <td className="px-4 py-3">
                                                <div className="flex justify-center">
                                                    <Reactions
                                                        item={article}
                                                        type="ARTICLE"
                                                        isOwnItem={article?.author?._id?.toString() === user?._id?.toString()}
                                                    />
                                                </div>
                                            </td>

                                            {/* AUTHOR */}
                                            <td className="px-4 py-3 text-text">
                                                {/* Image */}
                                                <div className="flex items-center gap-2">
                                                    {article?.author?.avatar?.url ? (
                                                        <img
                                                            src={article?.author?.avatar?.url}
                                                            alt={article?.author?.name || "Author"}
                                                            className="h-8 w-8 shrink-0 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600">
                                                            {(article?.author?.name || "A").charAt(0).toUpperCase()}
                                                        </div>
                                                    )}

                                                    {/* Name */}
                                                    <span className="max-w-32 truncate">
                                                                {article?.author?.name || "Unknown Author"}
                                                            </span>
                                                </div>
                                            </td>

                                            {/* CATEGORIES */}
                                            <td className="px-4 py-3">
                                                <div className="flex max-w-52 flex-wrap gap-1.5">
                                                    {article?.categories?.length > 0 ? (
                                                        article?.categories?.map((category: any) => (
                                                            <span key={category?._id} className={`rounded px-2 py-1 text-[10px] font-medium ${category?.isActive ? "bg-primary/10 text-primary" : "bg-red-600/10 text-red-600"}`}>
                                                                        {category?.name || "Unnamed"}
                                                                    </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-text">
                                                                    —
                                                                </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* TAGS */}
                                            <td className="px-4 py-3">
                                                <div className="flex max-w-44 flex-wrap gap-1.5">
                                                    {article?.tags?.length > 0 ? (
                                                        article?.tags?.map((tag: any) => (
                                                            <span key={tag?._id} className={`rounded px-2 py-1 text-[10px] font-medium ${tag?.isActive ? "bg-gray-200 text-gray-700" : "bg-red-600/10 text-red-600"}`}>
                                                                        {tag?.name || "Unnamed"}
                                                                    </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-text">
                                                                    —
                                                                </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* STATUS */}
                                            <td className="px-4 py-3">
                                                        <span className={`inline-flex rounded px-2 py-1 text-[10px] font-medium ${article?.status === "PUBLISHED" ? "bg-green-100 text-green-700" : article?.status === "SUBMITTED" ? "bg-blue-100 text-blue-700" : article?.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-gray-200 text-gray-700"}`}>
                                                            {article?.status || "DRAFT"}
                                                        </span>
                                            </td>

                                            {/* PUBLISH AT */}
                                            <td className="px-4 py-3 whitespace-nowrap text-text">
                                                {hasValidPublishDate ? (
                                                    <div className={`flex flex-col items-start gap-1.5 ${publishDate && publishDate.getTime() <= Date.now() ? "text-green-600" : "text-red-600"}`}>
                                                                <span>
                                                                    {publishDate?.toLocaleString("en-GB", {
                                                                        day: "2-digit",
                                                                        month: "short",
                                                                        year: "numeric",
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                        hour12: true,
                                                                    })}
                                                                </span>
                                                    </div>
                                                ) : (
                                                    "—"
                                                )}
                                            </td>

                                            {/* CREATED AT */}
                                            <td className="px-4 py-3 whitespace-nowrap text-text">
                                                {article?.createdAt ? new Date(article.createdAt).toLocaleDateString() : "—"}
                                            </td>

                                            {/* ACTIONS */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    {/* VIEW */}
                                                    <button type="button" title="View Article" aria-label="View Article" onClick={() => router.push(`/dashboard/articles/view/${article?._id}`)} className="rounded-md border border-gray-200 p-2 text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 cursor-pointer">
                                                        <FiEye size={15} />
                                                    </button>

                                                    {/* EDIT */}
                                                    <button type="button" title="Edit Article" aria-label="Edit Article" onClick={() => router.push(`/dashboard/articles/edit/${article?._id}`)} className="rounded-md border border-gray-200 p-2 text-gray-600 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 cursor-pointer">
                                                        <FiEdit2 size={15} />
                                                    </button>

                                                    {/* DELETE */}
                                                    <button type="button" title="Delete Article" aria-label="Delete Article" onClick={() => setSelectedArticleToDelete(article)} className="rounded-md border border-gray-200 p-2 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer">
                                                        <FiTrash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {/* EMPTY STATE */}
                                {!articlesDataLoading && (articlesData?.data?.articles?.length ?? 0) === 0 && (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-12">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                {/* Icon */}
                                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                                    <FiFileText size={24} className="text-gray-400"/>
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-sm font-semibold text-heading">
                                                    No pending articles found
                                                </h3>

                                                {/* Description */}
                                                <p className="mt-1 max-w-sm text-xs text-text">
                                                    There are no pending articles to display yet.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Delete Article Warning */}
                <>
                    {/* Delete Article Warning */}
                    {selectedArticleToDelete && (
                        <DeleteWarningModal
                            onClose={() => setSelectedArticleToDelete(null)}
                            onConfirm={handleDeleteArticle}
                            loading={deleteArticleLoading}
                        />
                    )}
                </>
            </div>

            {/* Users */}
            {user && ["MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(user.role) && (
                <div>
                    {/* USERS SECTION HEADER */}
                    <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* Title & Description */}
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Users
                                </h2>
                                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                    {usersData?.data?.pagination?.totalItems ?? 0}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage platform users, account status and permissions.
                            </p>
                        </div>

                        {/* View All Button */}
                        <button type="button" onClick={() => router.push("/dashboard/users")} className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                            View All
                        </button>
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
                </div>
            )}

            {/* Unread Notifications */}
            <div>
                {/* NOTIFICATIONS SECTION HEADER */}
                <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Title & Description */}
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Unread Notifications
                            </h2>
                            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                {notificationsData?.data?.pagination?.totalItems ?? 0}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Stay updated with your latest activities and platform notifications.
                        </p>
                    </div>

                    {/* View All Button */}
                    <button type="button" onClick={() => router.push("/dashboard/notifications")} className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                        View All
                    </button>
                </div>

                {/* Notifications Table */}
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
                                {notificationsLoading && Array.from({ length: 10 }).map((_, index) => (
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
                                {!notificationsLoading && notificationsData?.data?.notifications?.map((notification: any) => {
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
                                {!notificationsLoading && (notificationsData?.data?.notifications?.length ?? 0) === 0 && (
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
            </div>

            {/* Unread Contact Messages */}
            {user && ["ADMIN", "SUPER_ADMIN"].includes(user.role) && (
                <div>
                    {/* CONTACT MESSAGES SECTION HEADER */}
                    <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* Title & Description */}
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Unread Contact Messages
                                </h2>
                                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                    {contactMessagesData?.data?.pagination?.totalItems ?? 0}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Review and manage messages submitted by users.
                            </p>
                        </div>

                        {/* View All Button */}
                        <button type="button" onClick={() => router.push("/dashboard/contacts")} className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                            View All
                        </button>
                    </div>

                    {/* CONTACT MESSAGES TABLE */}
                    <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full min-w-[950px] text-left text-xs">
                                {/* HEADER */}
                                <thead className="border-y border-gray-300 bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="min-w-44 px-4 py-3">Sender</th>
                                    <th className="min-w-52 px-4 py-3">Subject</th>
                                    <th className="min-w-72 px-4 py-3">Message</th>
                                    <th className="min-w-28 px-4 py-3">Seen Status</th>
                                    <th className="min-w-40 whitespace-nowrap px-4 py-3">Created At</th>
                                    <th className="min-w-28 px-4 py-3 text-center">Action</th>
                                </tr>
                                </thead>

                                {/* BODY */}
                                <tbody className="divide-y divide-gray-100">
                                    {/* LOADING SKELETON */}
                                    {contactMessagesDataLoading && Array.from({length: 10}).map((_, index) => (
                                        <tr key={index} className="animate-pulse">
                                            {/* SENDER */}
                                            <td className="px-4 py-4">
                                                <div className="space-y-2">
                                                    <div className="h-4 w-28 rounded bg-gray-200" />
                                                    <div className="h-3 w-32 rounded bg-gray-200" />
                                                </div>
                                            </td>

                                            {/* SUBJECT */}
                                            <td className="px-4 py-4">
                                                <div className="h-4 w-36 rounded bg-gray-200" />
                                            </td>

                                            {/* MESSAGE */}
                                            <td className="px-4 py-4">
                                                <div className="space-y-2">
                                                    <div className="h-3 w-56 rounded bg-gray-200" />
                                                    <div className="h-3 w-40 rounded bg-gray-200" />
                                                </div>
                                            </td>

                                            {/* SEEN STATUS */}
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

                                    {/* CONTACT MESSAGES LIST */}
                                    {!contactMessagesDataLoading && contactMessagesData?.data?.messages?.map((contact: any) => {
                                        const senderName = contact?.fullName || "Unknown User";
                                        const createdDate = contact?.createdAt ? new Date(contact.createdAt) : null;
                                        const hasValidCreatedDate = createdDate && !Number.isNaN(createdDate.getTime());
                                        return (
                                            <tr key={contact?._id} className="transition hover:bg-gray-50">
                                                {/* SENDER */}
                                                <td className="px-4 py-4">
                                                    <div className="space-y-1">
                                                        <p className="font-semibold text-heading">
                                                            {senderName}
                                                        </p>
                                                        <p className="max-w-40 truncate text-[11px] text-text">
                                                            {contact?.sender?.email || "N/A"}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* SUBJECT */}
                                                <td className="px-4 py-4">
                                                    <p className="max-w-52 truncate font-semibold text-heading">
                                                        {contact?.subject || "No Subject"}
                                                    </p>
                                                </td>

                                                {/* MESSAGE */}
                                                <td className="px-4 py-4">
                                                    <p className="max-w-md line-clamp-2 text-text">
                                                        {contact?.message || "No message available"}
                                                    </p>
                                                </td>

                                                {/* SEEN STATUS */}
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${contact?.isSeen ? "bg-gray-100 text-gray-600" : "bg-blue-50 text-blue-700"}`}>
                                                        {contact?.isRead ? "Read" : "Unread"}
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
                                                        {/* View Contact */}
                                                        <button type="button" title="View Contact Message" onClick={() => router.push(`/dashboard/contacts/view/${contact?._id?.toString()}`)} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                                                            <FiEye size={15} />
                                                        </button>

                                                        {/* Delete Contact */}
                                                        <button type="button" title="Delete Contact Message" onClick={() => setSelectedContactMessageToDelete(contact?._id?.toString())} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-red-500 transition hover:border-red-200 hover:bg-red-50">
                                                            <FiTrash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )})
                                    }

                                    {/* EMPTY STATE */}
                                    {!contactMessagesDataLoading && contactMessagesData?.data?.messages?.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-12">
                                                <div className="flex flex-col items-center justify-center text-center">
                                                    {/* Icon */}
                                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                                        <FiMail size={24} className="text-gray-400" />
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="text-sm font-semibold text-heading">
                                                        No contact messages found
                                                    </h3>

                                                    {/* Description */}
                                                    <p className="mt-1 max-w-sm text-xs text-text">
                                                        There are no contact messages available for the selected seen status.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Delete Contact Message Warning */}
                    <>
                        {selectedContactMessageToDelete && (
                            <DeleteWarningModal
                                onClose={() => setSelectedContactMessageToDelete(null)}
                                onConfirm={handleDeleteContactMessage}
                                loading={deleteContactMessageLoading}
                            />
                        )}
                    </>
                </div>
            )}
        </div>
    );
}

export default DashboardPage;