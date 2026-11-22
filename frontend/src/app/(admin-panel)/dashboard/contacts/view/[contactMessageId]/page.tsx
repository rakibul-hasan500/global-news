"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {FiArrowLeft, FiUser, FiMail, FiCalendar, FiCheckCircle, FiClock, FiMessageSquare,} from "react-icons/fi";
import {useGetSingleContactMessageQuery, useMarkContactMessageAsReadMutation,} from "@/redux/services/contact/contactApi";

function ContactMessageDetailsPage() {

    // Contact Message ID From URL
    const params = useParams<{ contactMessageId: string }>();
    const contactMessageId = params.contactMessageId;

    // Get Single Contact Message
    const {data: contactResponse, isLoading, isError, error} = useGetSingleContactMessageQuery(contactMessageId, {
        skip: !contactMessageId,
    });

    // Mark Contact Message As Read
    const [markContactMessageAsRead, {isLoading: markReadLoading},] = useMarkContactMessageAsReadMutation();

    // Prevent Duplicate Read API Calls
    const readAttemptedRef = useRef<string | null>(null);

    // Contact Message Data
    const contact = contactResponse?.data?.message;

    // Automatically Mark As Read
    useEffect(() => {
        // Validate
        if (!contact || contact.isRead || !contactMessageId) {
            return;
        }

        // Prevent Duplicate API Calls
        if (readAttemptedRef.current === contactMessageId) {
            return;
        }

        readAttemptedRef.current = contactMessageId;

        // Call Read API
        markContactMessageAsRead(contactMessageId).unwrap()
            .catch((error) => {console.error("Failed to mark contact message as read:", error);});
    }, [contact, contactMessageId, markContactMessageAsRead]);

    // Loading State
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="mb-6 h-6 w-2/3 animate-pulse rounded bg-gray-200" />
                    <div className="mb-4 h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                    <div className="h-32 animate-pulse rounded-lg bg-gray-100" />
                </div>
            </div>
        );
    }

    // Error State
    if (isError) {
        return (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center">
                <FiMessageSquare className="mb-3 text-4xl text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-800">
                    Failed to load contact message
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    {(error as any)?.data?.message || "Something went wrong. Please try again."}
                </p>
                <Link href="/dashboard/contacts" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                    <FiArrowLeft size={16} />
                    Back to Contacts
                </Link>
            </div>
        );
    }

    // Not Found State
    if (!contact) {
        return (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center">
                <FiMessageSquare className="mb-3 text-4xl text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-800">
                    Contact message not found
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    This contact message may have been deleted or does not exist.
                </p>
                <Link href="/dashboard/contacts" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                    <FiArrowLeft size={16} />
                    Back to Contacts
                </Link>
            </div>
        );
    }

    // Sender Information
    const sender = contact.sender;

    // Format Date
    const formattedDate = contact.createdAt ? new Date(contact.createdAt).toLocaleString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }) : "N/A";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Title */}
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">
                        Contact Message Details
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        View the complete details of this contact message.
                    </p>
                </div>

                {/* Contacts */}
                <Link href="/dashboard/contacts" className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
                    <FiArrowLeft size={16} />
                    Back to Contacts
                </Link>
            </div>

            {/* Contact Message Card */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                {/* Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
                    {/* Title */}
                    <div className="flex items-center gap-2">
                        <FiMessageSquare className="text-blue-600" />
                        <h2 className="font-semibold text-gray-800">
                            Message Information
                        </h2>
                    </div>

                    {/* Read Status */}
                    {markReadLoading ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                            <FiClock size={13} />
                            Marking as read...
                        </span>
                    ) : contact.isRead ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                            <FiCheckCircle size={13} />
                            Read
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                            <FiClock size={13} />
                            Unread
                        </span>
                    )}
                </div>

                {/* Data */}
                <div className="space-y-6 p-5">
                    {/* Sender Information */}
                    <div>
                        {/* Section Title */}
                        <h3 className="mb-4 text-sm font-semibold text-gray-700">
                            Sender Information
                        </h3>

                        {/* Section Data */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Sender Name */}
                            <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
                                {/* Icon */}
                                <FiUser className="mt-0.5 text-gray-500" />

                                {/* Data */}
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Full Name
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-gray-800">
                                        {contact?.fullName || sender?.fullName || "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Sender Email */}
                            <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
                                {/* Icon */}
                                <FiMail className="mt-0.5 text-gray-500" />

                                {/* ata */}
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Email Address
                                    </p>
                                    <p className="mt-1 break-all text-sm font-medium text-gray-800">
                                        {sender?.email || "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Created Date */}
                            <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 sm:col-span-2">
                                {/* Icon */}
                                <FiCalendar className="mt-0.5 text-gray-500" />

                                {/* Data */}
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Submitted At
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-gray-800">
                                        {formattedDate}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="border-t border-gray-100 pt-5">
                        {/* Label */}
                        <h3 className="mb-3 text-sm font-semibold text-gray-700">
                            Subject
                        </h3>

                        {/* Info */}
                        <div className="rounded-lg bg-gray-50 p-4">
                            <p className="text-sm font-medium text-gray-800">
                                {contact?.subject || "No subject"}
                            </p>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="border-t border-gray-100 pt-5">
                        {/* Label */}
                        <h3 className="mb-3 text-sm font-semibold text-gray-700">
                            Message
                        </h3>

                        {/* Info */}
                        <div className="min-h-40 rounded-lg bg-gray-50 p-4">
                            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-700">
                                {contact?.message || "No message content"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactMessageDetailsPage;