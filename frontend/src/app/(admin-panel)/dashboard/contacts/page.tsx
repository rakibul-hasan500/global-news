"use client"
import {useEffect, useRef, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useDeleteContactMessageMutation, useGetContactMessagesQuery} from "@/redux/services/contact/contactApi";
import {IoMdArrowDropdown} from "react-icons/io";
import {FiEye, FiMail, FiTrash2} from "react-icons/fi";
import Pagination from "@/components/common/other/Pagination";
import {responseHandler} from "@/utils/responseHandler";
import DeleteWarningModal from "@/components/common/warning/DeleteWarningModal";

function ContactPage() {

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
        { value: "all", label: "All Messages" },
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



    // Call Get Contact Messages API
    const {data: contactMessagesData, isLoading: contactMessagesDataLoading} = useGetContactMessagesQuery({
        page,
        limit: selectedLimit,
        isRead: selectedStatus === "READ" ? true : selectedStatus === "UNREAD" ? false : undefined
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



    return (
        <div className="min-h-screen space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Title */}
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-semibold text-heading">
                        <FiMail className="text-primary" size={24} />
                        Contact Messages
                    </h1>
                    <p className="mt-1 text-sm text-text">
                        View and manage messages submitted through the contact form
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
                            {contactMessagesDataLoading && Array.from({length: selectedLimit}).map((_, index) => (
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

            {/* Pagination */}
            <>
                {contactMessagesData?.data?.messages?.length > 0 && (
                    <Pagination
                        pagination={contactMessagesData?.data?.pagination}
                    />
                )}
            </>

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
    )
}

export default ContactPage;