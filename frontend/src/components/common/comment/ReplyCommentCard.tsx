"use client";
import {useCreateCommentMutation, useDeleteCommentMutation, useGetCommentRepliesQuery, useUpdateCommentMutation,} from "@/redux/services/comment/commentApi";
import { responseHandler } from "@/utils/responseHandler";
import { useState } from "react";
import {FiCornerUpLeft, FiMessageCircle, FiSend, FiEdit2, FiCheck, FiChevronDown, FiChevronUp, FiLoader, FiTrash2, FiX,} from "react-icons/fi";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";
import Reactions from "@/components/common/reaction/Reactions";

function ReplyCommentCard({comment, parentComment, articleId, user}: any) {

    // Comment Author
    const author = comment?.author;

    // Ownership
    const isOwnComment = !!user?._id && String(user._id) === String(author?._id || comment?.author?._id);

    // Reply Context
    const replyToAuthor = parentComment?.author?.name || "Unknown User";
    const replyToContent = parentComment?.content || "";

    // Reply Section State
    const [showReplies, setShowReplies] = useState(false);
    const [replyPage, setReplyPage] = useState(1);

    // Reply Form State
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment?.content || "");

    // Delete Confirmation State
    const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

    // Create Reply API
    const [createComment, {isLoading: isReplySubmitting}] = useCreateCommentMutation();

    // Update Comment API
    const [updateComment, {isLoading: isUpdating}] = useUpdateCommentMutation();

    // Delete Comment API
    const [deleteComment, {isLoading: isDeleting}] = useDeleteCommentMutation();

    // Get Nested Replies
    const {data: repliesResponse, isLoading: repliesLoading, isFetching: repliesFetching, isError: repliesError, refetch: refetchReplies,} = useGetCommentRepliesQuery({
        commentId: comment?._id,
        page: replyPage,
        limit: 20,
    });

    // Replies List
    const replies = repliesResponse?.data?.comments || [];

    // Pagination
    const totalItems = repliesResponse?.data?.pagination?.totalItems || 0;
    const totalPages = Math.max(1, repliesResponse?.data?.pagination?.totalPages || 1);

    // Format Date
    const formattedDate = comment?.createdAt ? new Date(comment.createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }) : "";

    // Create Nested Reply
    const handleCreateReply = async () => {
        // Validate
        if (!user) {
            return responseHandler("E", "Please sign in to reply");
        }
        if (!replyContent.trim() || isReplySubmitting) {
            return;
        }

        try {
            // Create Reply
            const response = await createComment({
                article: articleId,
                parentComment: comment._id,
                content: replyContent.trim(),
            }).unwrap();

            // Reset Form
            setReplyContent("");
            setShowReplyForm(false);
            setReplyPage(1);

            // Show Replies
            setShowReplies(true);

            // Refresh if the query was already active
            if (showReplies) {
                await refetchReplies();
            }

            // Notify User
            return responseHandler("S", response?.message || "Reply submitted successfully");
        } catch (error: any) {
            return responseHandler("E", error?.data?.message || "Failed to submit reply");
        }
    };

    // Update Comment
    const handleUpdateComment = async () => {
        // Validate
        if (!editContent.trim() || isUpdating) {
            return;
        }

        try {
            // Update Comment
            const response = await updateComment({
                commentId: comment._id,
                content: editContent.trim(),
            }).unwrap();

            // Reset Edit State
            setIsEditing(false);

            // Notify User
            return responseHandler("S", response?.message || "Comment updated successfully");
        } catch (error: any) {
            return responseHandler("E", error?.data?.message || "Failed to update comment");
        }
    };

    // Delete Comment
    const handleDeleteComment = async () => {
        // Prevent Duplicate Requests
        if (isDeleting) {
            return;
        }
        try {
            // Delete Comment
            const response = await deleteComment({commentId: comment._id}).unwrap();

            // Close Confirmation
            setIsDeleteConfirming(false);

            // Notify User
            return responseHandler("S", response?.message || "Comment deleted successfully");
        } catch (error: any) {
            return responseHandler("E", error?.data?.message || "Failed to delete comment");
        }
    };

    return (
        <>
            {/* Main Nested Reply */}
            <article className="border-l-2 border-slate-200 pl-3 sm:pl-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
                    {/* Author & Avatar */}
                    <div className="flex gap-2.5">
                        {/* Image */}
                        <>
                            {author?.avatar?.url ? (
                                <img
                                    src={author?.avatar?.url}
                                    alt={author?.name || "User"}
                                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                                    {author?.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                            )}
                        </>

                        {/* Comment Details */}
                        <div className="min-w-0 flex-1">
                            {/* Author & Date */}
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                {/* Name */}
                                <h4 className="text-sm font-semibold text-slate-900">
                                    {author?.name || "Unknown User"}
                                </h4>

                                {/* Created Date */}
                                <span className="text-xs text-slate-400">
                                    {formattedDate}
                                </span>
                            </div>

                            {/* Reply Context */}
                            <div className="mt-2 rounded-md border-l-2 border-blue-400 bg-white px-3 py-2">
                                {/* Reply to Author Name */}
                                <p className="text-xs font-medium text-blue-600">
                                    Reply to @{replyToAuthor}
                                </p>

                                {/* Reply to Content */}
                                <p className="mt-1 line-clamp-2 whitespace-pre-wrap break-words text-xs leading-5 text-slate-500">
                                    {replyToContent}
                                </p>
                            </div>

                            {/* Comment Content / Edit Form */}
                            {isEditing ? (
                                <div className="mt-3">
                                    {/* Input */}
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        maxLength={2000}
                                        rows={3}
                                        disabled={isUpdating}
                                        className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                                    />

                                    {/* Actions */}
                                    <div className="mt-2 flex gap-2">
                                        {/* Save */}
                                        <button type="button" onClick={handleUpdateComment} disabled={!editContent.trim() || isUpdating} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                                            {isUpdating ? (
                                                <FiLoader size={14} className="animate-spin"/>
                                            ) : (
                                                <FiCheck size={14} />
                                            )}
                                            Save
                                        </button>

                                        {/* Cancel */}
                                        <button type="button" onClick={() => {
                                            setEditContent(comment?.content || "");
                                            setIsEditing(false);
                                        }} disabled={isUpdating} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                                    {comment?.content}
                                </p>
                            )}

                            {/* Reactions & Actions */}
                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                                {/* Reactions */}
                                <Reactions
                                    item={comment}
                                    isOwnItem={isOwnComment}
                                />

                                {/* Reply */}
                                {user && !isOwnComment && (
                                    <button type="button" onClick={() => {
                                        setShowReplyForm((prev) => !prev);
                                        setIsEditing(false);
                                        setIsDeleteConfirming(false);
                                    }} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-blue-600">
                                        <FiCornerUpLeft size={13} />
                                        Reply
                                    </button>
                                )}

                                {/* Edit Own Comment */}
                                {isOwnComment && !isEditing && (
                                    <button type="button" onClick={() => {
                                        setEditContent(comment?.content || "");
                                        setIsEditing(true);
                                        setShowReplyForm(false);
                                        setIsDeleteConfirming(false);
                                    }} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-blue-600">
                                        <FiEdit2 size={13} />
                                        Edit
                                    </button>
                                )}

                                {/* Delete Own Comment */}
                                {isOwnComment && !isEditing && !isDeleteConfirming && (
                                    <button type="button" onClick={() => {
                                        setIsDeleteConfirming(true);
                                        setShowReplyForm(false);
                                        setIsEditing(false);
                                    }} title="Delete comment" aria-label="Delete comment" className="inline-flex items-center gap-1 text-xs font-medium text-red-500 transition hover:text-red-700">
                                        <FiTrash2 size={13} />
                                        Delete
                                    </button>
                                )}

                                {/* View Nested Replies */}
                                {totalItems > 0 && (
                                    <button type="button" onClick={() => setShowReplies((prev) => !prev)} className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                                        <FiMessageCircle size={13} />
                                        {showReplies ? "Hide replies" : `View replies (${totalItems})`}
                                        {showReplies ? (
                                            <FiChevronUp size={13} />
                                        ) : (
                                            <FiChevronDown size={13} />
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Reply Form */}
                            {user && !isOwnComment && showReplyForm && (
                                <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                                    {/* Reply to Author Name */}
                                    <p className="mb-2 text-xs font-medium text-blue-600">
                                        Reply to @{author?.name || "Unknown User"}
                                    </p>

                                    {/* Input */}
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder="Write a reply..."
                                        rows={3}
                                        maxLength={2000}
                                        disabled={isReplySubmitting}
                                        className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                                    />

                                    {/* Reply Action */}
                                    <div className="mt-2 flex items-center justify-between gap-3">
                                        {/* Length */}
                                        <span className="text-xs text-slate-400">
                                            {replyContent.length}/2000
                                        </span>

                                        {/* Submit */}
                                        <button type="button" onClick={handleCreateReply} disabled={!replyContent.trim() || isReplySubmitting} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                                            {isReplySubmitting ? (
                                                <FiLoader size={13} className="animate-spin"/>
                                            ) : (
                                                <FiSend size={13} />
                                            )}
                                            {isReplySubmitting ? "Submitting..." : "Post Reply"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Delete Confirmation */}
                            {isDeleteConfirming && (
                                <div className="mt-3 max-w-[420px] rounded-lg border border-red-200 bg-red-50 p-3">
                                    <div className="flex items-start gap-2">
                                        {/* Icon */}
                                        <FiTrash2 size={17} className="mt-0.5 shrink-0 text-red-600"/>

                                        {/* Delete Dialog Data 7 Actions */}
                                        <div className="min-w-0 flex-1">
                                            {/* Title */}
                                            <p className="text-sm font-semibold text-red-700">
                                                Delete this comment?
                                            </p>

                                            {/* Paragraph */}
                                            <p className="mt-1 text-xs leading-5 text-red-600">
                                                Are you sure you want to delete
                                                this comment? This action cannot
                                                be undone.
                                            </p>

                                            {/* Actions */}
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {/* Confirm Delete */}
                                                <button type="button" onClick={handleDeleteComment} disabled={isDeleting} className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                                                    {isDeleting ? (
                                                        <FiLoader size={14} className="animate-spin"/>
                                                    ) : (
                                                        <FiTrash2 size={14} />
                                                    )}
                                                    {isDeleting ? "Deleting..." : "Delete"}
                                                </button>

                                                {/* Cancel Delete */}
                                                <button type="button" onClick={() => setIsDeleteConfirming(false)} disabled={isDeleting} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50">
                                                    <FiX size={14} />
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </article>

            {/* Nested Replies */}
            {showReplies && (
                <div className="mt-4 space-y-3">
                    {/* Loading */}
                    {(repliesLoading || repliesFetching) && (
                        <div className="flex items-center gap-2 py-2 text-xs text-slate-500">
                            <FiLoader size={14} className="animate-spin"/>
                            Loading replies...
                        </div>
                    )}

                    {/* Error */}
                    {repliesError && !repliesLoading && !repliesFetching && (
                        <div className="text-xs text-red-600">
                            Failed to load replies.
                            <button type="button" onClick={() => refetchReplies()} className="ml-2 font-semibold underline">
                                Try again
                            </button>
                        </div>
                    )}

                    {/* Nested Reply List */}
                    {!repliesLoading && !repliesFetching && !repliesError && (
                        <>
                            {/* Reply items */}
                            {replies?.length > 0 ? (replies?.map((reply: any) => (
                                <ReplyCommentCard
                                    key={reply?._id}
                                    comment={reply}
                                    parentComment={comment}
                                    articleId={articleId}
                                    user={user}
                                />
                            ))) : (
                                <p className="py-2 text-xs text-slate-500">
                                    No replies yet.
                                </p>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3">
                                    {/* Items */}
                                    <p className="text-xs text-slate-500">
                                        {totalItems} replies
                                    </p>

                                    {/* Pagination */}
                                    <div className="flex items-center gap-2">
                                        {/* Previous */}
                                        <button type="button" onClick={() => setReplyPage((prev) => Math.max(1, prev - 1))} disabled={replyPage === 1 || repliesFetching} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
                                            Previous
                                        </button>

                                        {/* Current Page */}
                                        <span className="text-xs text-slate-600">
                                                                Page {replyPage} of{" "}
                                            {totalPages}
                                                            </span>

                                        {/* Next */}
                                        <button type="button" onClick={() => setReplyPage((prev) => Math.min(totalPages, prev + 1))} disabled={replyPage >= totalPages || repliesFetching} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    );
}

export default ReplyCommentCard;