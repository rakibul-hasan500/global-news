"use client";
import {FiMessageSquare} from "react-icons/fi";
import {useEffect, useRef, useState} from "react";
import {IoMdArrowDropdown} from "react-icons/io";
import {useDeleteCommentMutation, useGetDashboardCommentsQuery} from "@/redux/services/comment/commentApi";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import Pagination from "@/components/common/other/Pagination";
import {responseHandler} from "@/utils/responseHandler";
import DeleteWarningModal from "@/components/common/warning/DeleteWarningModal";
import DashboardCommentCard from "@/components/admin_panel/comment/DashboardCommentCard";

function CommentsPage() {

    // Url Items
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();




    // Filter States
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedLimit, setSelectedLimit] = useState(20);
    const [page, setPage] = useState(1);

    // Sync URL params to filter states
    useEffect(() => {
        setSelectedStatus(searchParams.get("status")?.toUpperCase() || "all");
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
        { value: "all", label: "All Status" },
        { value: "PENDING", label: "Pending" },
        { value: "APPROVED", label: "Approved" },
        { value: "REJECTED", label: "Rejected" },
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




    // Call Get Dashboard Comments API
    const {data: dashboardCommentsData, isLoading: dashboardCommentsLoading} = useGetDashboardCommentsQuery({
        status: selectedStatus,
        page,
        limit: selectedLimit,
    })




    // Selected Comment To Delete
    const [selectedCommentToDelete, setSelectedCommentToDelete] = useState<any>(null)

    // Call Delete Comment API
    const [deleteComment, {isLoading: deleteCommentLoading}] = useDeleteCommentMutation()

    // Handle Delete Comment
    const handleDeleteComment = async () => {
        if (!selectedCommentToDelete) return;
        try {
            // Hit Delete Comment API
            const response = await deleteComment(selectedCommentToDelete).unwrap();

            // Reset State
            setSelectedCommentToDelete(null);

            // Success Message
            return responseHandler("S", response?.message || "Comment deleted successfully")
        } catch (error: any) {
            return responseHandler("E", error?.data?.message || "Failed to delete comment")
        }
    }



    return (
        <div className="min-h-screen space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Title */}
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-semibold text-heading">
                        <FiMessageSquare className="text-primary" size={24} />
                        Comments
                    </h1>
                    <p className="mt-1 text-sm text-text">
                        Manage, review, and moderate article comments
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="space-y-4 rounded-xl border border-border bg-white p-4 shadow-sm">
                {/* Filter Dropdowns */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Status */}
                    <div ref={statusDropdownRef} className="relative w-full sm:w-60">
                        {/* Selected Status */}
                        <button type="button" onClick={() => setStatusDropdownOpen((prev) => !prev)} className={filterButtonClass}>
                            <span>
                                {statuses.find((item) => item.value === selectedStatus)?.label || "All Status"}
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
                                        updateURLParams("status", status.value.toLowerCase());
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

            {/* COMMENTS TABLE */}
            <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[1000px] text-left text-xs">
                        {/* HEADER */}
                        <thead className="border-y border-gray-300 bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                            <tr>
                                <th className="min-w-80 px-4 py-3">Comment</th>
                                <th className="min-w-44 px-4 py-3">Commentator</th>
                                <th className="min-w-64 px-4 py-3">Article</th>
                                <th className="min-w-32 px-4 py-3">Status</th>
                                <th className="min-w-40 whitespace-nowrap px-4 py-3">Created At</th>
                                <th className="min-w-28 px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody className="divide-y divide-gray-100">
                            {/* LOADING SKELETON */}
                            {dashboardCommentsLoading && Array.from({ length: selectedLimit }).map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                    {/* COMMENT */}
                                    <td className="px-4 py-4">
                                        <div className="space-y-2">
                                            <div className="h-3 w-36 rounded bg-gray-200" />
                                            <div className="h-4 w-56 rounded bg-gray-200" />
                                            <div className="h-3 w-40 rounded bg-gray-200" />
                                        </div>
                                    </td>

                                    {/* COMMENTATOR */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-9 w-9 shrink-0 rounded-full bg-gray-200" />
                                            <div className="space-y-2">
                                                <div className="h-4 w-24 rounded bg-gray-200" />
                                                <div className="h-3 w-16 rounded bg-gray-200" />
                                            </div>
                                        </div>
                                    </td>

                                    {/* ARTICLE */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-11 w-14 shrink-0 rounded-lg bg-gray-200" />
                                            <div className="space-y-2">
                                                <div className="h-4 w-40 rounded bg-gray-200" />
                                                <div className="h-3 w-24 rounded bg-gray-200" />
                                            </div>
                                        </div>
                                    </td>

                                    {/* STATUS */}
                                    <td className="px-4 py-4">
                                        <div className="h-5 w-20 rounded bg-gray-200" />
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

                            {/* COMMENTS LIST */}
                            {!dashboardCommentsLoading && dashboardCommentsData?.data?.comments?.map((comment: any, index: number) => {
                                const createdDate = comment?.createdAt ? new Date(comment.createdAt) : null;
                                const hasValidCreatedDate = createdDate && !Number.isNaN(createdDate.getTime());
                                return (
                                    <DashboardCommentCard
                                        key={comment._id}
                                        index={index}
                                        comment={comment}
                                        createdDate={createdDate}
                                        hasValidCreatedDate={hasValidCreatedDate}
                                        setSelectedCommentToDelete={setSelectedCommentToDelete}
                                    />
                                )
                            })}

                            {/* EMPTY STATE */}
                            {!dashboardCommentsLoading && (dashboardCommentsData?.data?.comments?.length ?? 0) === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            {/* Icon */}
                                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                                <FiMessageSquare size={24} className="text-gray-400"/>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-sm font-semibold text-heading">
                                                No comments found
                                            </h3>

                                            {/* Desc */}
                                            <p className="mt-1 max-w-sm text-xs text-text">
                                                There are no comments to display for the selected status.
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
                {dashboardCommentsData?.data?.comments?.length > 0 && (
                    <Pagination pagination={dashboardCommentsData?.data?.pagination} />
                )}
            </>

            {/* Delete Comment Warning */}
            <>
                {selectedCommentToDelete && (
                    <DeleteWarningModal
                        onClose={() => setSelectedCommentToDelete(null)}
                        onConfirm={handleDeleteComment}
                        loading={deleteCommentLoading}
                    />
                )}
            </>
        </div>
    );
}

export default CommentsPage;