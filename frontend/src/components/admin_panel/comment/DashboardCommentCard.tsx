"use client"
import {useCreateCommentMutation, useUpdateCommentMutation, useUpdateCommentStatusMutation} from "@/redux/services/comment/commentApi";
import {useEffect, useRef, useState} from "react";
import {FiCheckCircle, FiClock, FiXCircle, FiCheck, FiChevronDown, FiFileText, FiTrash2, FiMessageSquare, FiCornerUpLeft, FiSend, FiThumbsDown, FiThumbsUp} from "react-icons/fi";
import {responseHandler} from "@/utils/responseHandler";
import {useSelector} from "react-redux";
import {FaThumbsDown, FaThumbsUp} from "react-icons/fa";
import Reactions from "@/components/common/reaction/Reactions";

function DashboardCommentCard({comment, index, createdDate, hasValidCreatedDate, setSelectedCommentToDelete}: any) {

    // Current User From Redux
    const {user} = useSelector((state: any) => state.Auth);



    // Comment Status Dropdown State
    const [openStatusCommentId, setOpenStatusCommentId] = useState<string | null>(null);

    // Comment Status Dropdown Ref
    const commentStatusDropdownRef = useRef<HTMLDivElement>(null);

    // Close Comment Status Dropdown on Outside Click
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node;
            if (!commentStatusDropdownRef.current?.contains(target)) {
                setOpenStatusCommentId(null);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    // Comment Status Options
    const commentStatusOptions = [
        {
            value: "PENDING",
            label: "Pending",
            icon: FiClock,
            className: "bg-amber-50 text-amber-700 border-amber-200",
            activeClassName: "bg-amber-50 text-amber-700",
        },
        {
            value: "APPROVED",
            label: "Approved",
            icon: FiCheckCircle,
            className: "bg-green-50 text-green-700 border-green-200",
            activeClassName: "bg-green-50 text-green-700",
        },
        {
            value: "REJECTED",
            label: "Rejected",
            icon: FiXCircle,
            className: "bg-red-50 text-red-700 border-red-200",
            activeClassName: "bg-red-50 text-red-700",
        },
    ];

    // Call Update Comment Status API
    const [updateCommentStatus, {isLoading: updateCommentStatusLoading}] = useUpdateCommentStatusMutation()

    // Handle Comment Status Change
    const handleCommentStatusChange = async (commentId: string, status: string) => {
        try {
            // Validate
            if(!commentId || !status){
                return
            }

            // Hit Update Comment Status API
            const response = await updateCommentStatus({commentId, status}).unwrap()

            return responseHandler("S", response?.message)
        } catch (error: any) {
            return responseHandler("E", error?.data?.message)
        }
    };




    // Reply Form State
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    // Create Comment API
    const [createComment, {isLoading: createCommentLoading}] = useCreateCommentMutation();

    // Handle Reply Submission
    const handleSubmitReply = async () => {
        if (!comment?._id || !replyContent.trim() || createCommentLoading) {
            return;
        }

        // Get Article ID
        const articleId = typeof comment?.article === "object" ? comment?.article?._id : comment?.article;
        if (!articleId) {
            return responseHandler("E", "Article information is missing");
        }

        try {
            // Create Reply
            const response = await createComment({
                article: articleId,
                parentComment: comment._id,
                content: replyContent.trim(),
            }).unwrap();

            setReplyContent("");
            setReplyOpen(false);

            return responseHandler("S", response?.message || "Reply submitted successfully");
        } catch (error: any) {
            return responseHandler("E", error?.data?.message || "Failed to submit reply");
        }
    };




    // Edit Comment Form State
    const [editOpen, setEditOpen] = useState(false);
    const [editContent, setEditContent] = useState("");

    // Update Comment API
    const [updateComment, {isLoading: updateCommentLoading}] = useUpdateCommentMutation();

    // Handle Edit Comment
    const handleEditComment = async () => {
        if (!comment?._id || !editContent.trim() || updateCommentLoading) {
            return;
        }
        try {
            // Update Own Comment
            const response = await updateComment({
                commentId: comment._id,
                content: editContent.trim(),
            }).unwrap();

            // Close Form
            setEditOpen(false);
            setEditContent("");

            return responseHandler("S", response?.message || "Comment updated successfully");
        } catch (error: any) {
            return responseHandler("E", error?.data?.message || "Failed to update comment");
        }
    };


    return (
        <tr className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} transition hover:bg-blue-50/40`}>
            {/* COMMENT + REPLY INFORMATION */}
            <td className="px-4 py-4">
                <div className="max-w-80">
                    {/* REPLY CONTEXT */}
                    {comment?.parentComment && (
                        <div className="mb-2 rounded-md border-l-2 border-blue-400 bg-blue-50 px-3 py-2">
                            {/* Replay To Author */}
                            <div className="mb-1 flex items-center gap-1 text-[10px] font-medium text-blue-700">
                                <FiMessageSquare size={11} />
                                <span>
                                                                        Replying to{" "}
                                    {comment?.parentComment?.author?.name || "Unknown User"}
                                                                    </span>
                            </div>

                            {/* Replay To Content */}
                            <p className="line-clamp-2 break-words text-[11px] leading-4 text-gray-600">
                                {comment?.parentComment?.content || "Parent comment unavailable"}
                            </p>
                        </div>
                    )}

                    {/* CURRENT COMMENT */}
                    <p className="whitespace-pre-wrap break-words text-sm leading-5 text-heading">
                        {comment?.content || "Empty comment"}
                    </p>

                    {/* Reactions & Current User Badge & Reply Button */}
                    <div className="flex items-center gap-4 mt-3">
                        {/* Reactions */}
                        <Reactions
                            item={comment}
                            isOwnItem={String(comment?.author?._id) === String(user?._id)}
                        />

                        {/* CURRENT USER BADGE & EDIT BUTTON */}
                        {String(comment?.author?._id) === String(user?._id) && (
                            <>
                                {/* You Badge */}
                                <span className="inline-flex h-max items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">
                                    You
                                </span>

                                {/* Edit Button */}
                                <button type="button" onClick={() => {
                                    setEditOpen((prev) => !prev);
                                    setEditContent(comment?.content || "");
                                    setReplyOpen(false);
                                    setReplyContent("");
                                }} className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 px-3 py-1.5 text-[11px] font-medium text-amber-700 transition hover:bg-amber-50">
                                    <FiFileText size={12} />
                                    {editOpen ? "Cancel Edit" : "Edit"}
                                </button>
                            </>
                        )}

                        {/* Reply Button */}
                        {comment?.status === "APPROVED" && String(comment?.author?._id) !== String(user?._id) && (
                            <button type="button" onClick={() => {
                                setReplyOpen((prev) => !prev);
                                setReplyContent("");
                            }} className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 px-3 py-1.5 text-[11px] font-medium text-blue-700 transition hover:bg-blue-50">
                                <FiCornerUpLeft size={12} />
                                {replyOpen ? "Cancel Reply" : "Reply"}
                            </button>
                        )}
                    </div>

                    {/* REPLY BUTTON + FORM */}
                    {comment?.status === "APPROVED" && String(comment?.author?._id) !== String(user?._id) && replyOpen && (
                        <div className="mt-2 space-y-2">
                            {/* Input */}
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write your reply..."
                                rows={3}
                                maxLength={2000}
                                disabled={createCommentLoading}
                                className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                            />

                            {/* Hint & Button */}
                            <div className="flex items-center justify-between gap-3">
                                {/* Length Hint */}
                                <span className="text-xs text-slate-500">
                                      {replyContent.length}/2000
                                    </span>

                                {/* Submit Button */}
                                <button type="button" onClick={handleSubmitReply} disabled={!replyContent.trim() || createCommentLoading} className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer">
                                    <FiSend size={13} />
                                    {createCommentLoading ? "Submitting..." : "Submit Reply"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* EDIT COMMENT FORM */}
                    {String(comment?.author?._id) === String(user?._id) && editOpen && (
                        <div className="mt-3 space-y-2">
                            {/* Content Input */}
                            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} placeholder="Edit your comment..." rows={3} maxLength={2000} disabled={updateCommentLoading} className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"/>

                            {/* Character Count & Actions */}
                            <div className="flex items-center justify-between gap-3">
                                {/* Length */}
                                <span className="text-xs text-slate-500">
                                    {editContent.length}/2000
                                </span>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {/* Cancel Button */}
                                    <button type="button" onClick={() => {
                                        setEditOpen(false);
                                        setEditContent("");
                                    }} disabled={updateCommentLoading} className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50">
                                        Cancel
                                    </button>

                                    {/* Save Button */}
                                    <button type="button" onClick={handleEditComment} disabled={!editContent.trim() || editContent.trim() === comment?.content || updateCommentLoading} className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                                        <FiCheck size={13} />
                                        {updateCommentLoading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </td>

            {/* COMMENTATOR */}
            <td className="px-4 py-4 text-text">
                <div className="flex items-center gap-2">
                    {/* Image */}
                    {comment?.author?.avatar?.url ? (
                        <img
                            src={comment?.author?.avatar?.url}
                            alt={comment?.author?.name || "Commentator"}
                            className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600">
                            {(comment?.author?.name || "U").charAt(0).toUpperCase()}
                        </div>
                    )}

                    {/* Name */}
                    <span className="max-w-32 truncate text-sm font-medium text-heading">
                                                            {comment?.author?.name || "Unknown User"}
                                                        </span>
                </div>
            </td>

            {/* ARTICLE */}
            <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                    {/* Image */}
                    <div className="flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-200">
                        {comment?.article?.coverImage?.url ? (
                            <img
                                src={comment.article.coverImage.url}
                                alt={comment?.article?.coverImage?.altTag || comment?.article?.title || "Article cover"}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <FiFileText size={18} className="text-gray-500"/>
                        )}
                    </div>

                    {/* Title */}
                    <p className="max-w-48 line-clamp-2 text-sm font-medium leading-5 text-heading">
                        {comment?.article?.title || "Article unavailable"}
                    </p>
                </div>
            </td>

            {/* STATUS */}
            <td className="px-4 py-4">
                <div ref={openStatusCommentId === comment._id ? commentStatusDropdownRef : null} className="relative inline-block">
                    {/* Selected Status */}
                    <button type="button" aria-label={`Change status: ${comment?.status || "PENDING"}`} aria-haspopup="listbox" aria-expanded={openStatusCommentId === comment._id} onClick={() => setOpenStatusCommentId((previous) => previous === comment._id ? null : comment._id)} className={`inline-flex min-w-36 cursor-pointer items-center justify-between gap-3 rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${commentStatusOptions.find((option) => option.value === comment?.status)?.className || "border-amber-200 bg-amber-50 text-amber-700"}`}>
                                                    <span className="flex items-center gap-1.5">
                                                        {(() => {
                                                            const StatusIcon = commentStatusOptions.find((option) => option.value === comment?.status)?.icon || FiClock;
                                                            return <StatusIcon size={13} />;
                                                        })()}
                                                        {commentStatusOptions.find((option) => option.value === comment?.status)?.label || "Pending"}
                                                    </span>
                        <FiChevronDown size={14} className={`shrink-0 transition-transform ${openStatusCommentId === comment._id ? "rotate-180" : ""}`}/>
                    </button>

                    {/* Status Options */}
                    {openStatusCommentId === comment._id && (
                        <div role="listbox" aria-label="Comment status options" className="absolute left-0 top-full z-50 mt-2 min-w-36 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                            {commentStatusOptions.map((option) => {
                                const StatusIcon = option.icon;
                                const isSelected = comment?.status === option.value;
                                return (
                                    <button key={option.value} type="button" role="option" aria-selected={isSelected} onClick={() => {
                                        handleCommentStatusChange(comment._id, option.value);
                                        setOpenStatusCommentId(null);
                                    }} className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left text-xs transition ${isSelected ? option.activeClassName : "text-gray-600 hover:bg-gray-100"}`}>
                                                                    <span className="flex items-center gap-2">
                                                                        <StatusIcon size={14} />
                                                                        {option.label}
                                                                    </span>
                                        {isSelected && (
                                            <FiCheck size={14} className="shrink-0"/>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </td>

            {/* CREATED AT */}
            <td className="whitespace-nowrap px-4 py-4 text-text">
                {hasValidCreatedDate ? (
                    <div className="flex flex-col gap-1">
                                                            <span>
                                                                {createdDate.toLocaleDateString("en-GB", {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                })}
                                                            </span>

                        <span className="text-[10px] text-gray-500">
                                                                {createdDate.toLocaleTimeString("en-GB", {
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

            {/* ACTIONS */}
            <td className="px-4 py-4">
                <div className="flex items-center justify-center gap-2">
                    {/* DELETE */}
                    <button type="button" title="Delete Comment" aria-label="Delete Comment" onClick={() => setSelectedCommentToDelete(comment?._id)} className="cursor-pointer rounded-md border border-gray-200 p-2 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
                        <FiTrash2 size={15} />
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default DashboardCommentCard;