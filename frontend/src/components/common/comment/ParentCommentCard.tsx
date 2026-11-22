"use client";
import {useCreateCommentMutation, useDeleteCommentMutation, useGetCommentRepliesQuery, useUpdateCommentMutation,} from "@/redux/services/comment/commentApi";
import { responseHandler } from "@/utils/responseHandler";
import { useState } from "react";
import {FiCornerUpLeft, FiMessageCircle, FiSend, FiEdit2, FiCheck, FiChevronDown, FiChevronUp, FiLoader, FiTrash2, FiX,} from "react-icons/fi";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";
import ReplyCommentCard from "@/components/common/comment/ReplyCommentCard";
import Reactions from "@/components/common/reaction/Reactions";

function ParentCommentCard({comment, articleId, user}: any) {

    // Parent Comment Author
    const author = comment?.author;

    // Check Comment Ownership
    const isOwnComment = !!user?._id && String(user._id) === String(author?._id || comment?.author?._id);

    // Reply Section State
    const [showReplies, setShowReplies] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    // Edit Parent Comment State
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment?.content || "");

    // Create Reply API
    const [createComment, { isLoading: isReplySubmitting }] = useCreateCommentMutation();

    // Update Parent Comment API
    const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation();

    // Replies Pagination State
    const [replyPage, setReplyPage] = useState(1);

    // Get Replies API
    const {data: repliesResponse, isLoading: repliesLoading, isFetching: repliesFetching, isError: repliesError, refetch: refetchReplies,} = useGetCommentRepliesQuery({
        commentId: comment?._id,
        page: replyPage,
        limit: 20,
    })

    // Replies & Pagination
    const replies = repliesResponse?.data?.comments || [];

    // Format Date
    const formattedDate = comment?.createdAt ? new Date(comment.createdAt).toLocaleTimeString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }) : "";

    // Submit Reply
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

            // Reset Reply Form
            setReplyContent("");
            setShowReplyForm(false);
            setShowReplies(true);

            // Notify User
            return responseHandler("S", response?.message || "Reply submitted successfully");
        } catch (error: any) {
            return responseHandler("E", error?.data?.message || "Failed to submit reply");
        }
    };

    // Update Parent Comment
    const handleUpdateComment = async () => {
        // Validate Content
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

    // Delete Confirmation State
    const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

    // Delete Comment API
    const [deleteComment, {isLoading: isDeleting}] = useDeleteCommentMutation();

    // Delete Parent Comment
    const handleDeleteComment = async () => {
        if (isDeleting) {
            return;
        }
        try {
            // Hit Delete Comment API
            const response = await deleteComment({commentId: comment._id?.toString()}).unwrap();

            // Clear State
            setIsDeleteConfirming(false);

            return responseHandler("S", response?.message || "Comment deleted successfully");
        } catch (error: any) {
            return responseHandler("E", error?.data?.message || "Failed to delete comment");
        }
    };

    return (
        <article className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            {/* Parent Comment */}
            <div className="flex gap-3">
                {/* Author Avatar */}
                <>
                    {author?.avatar?.url ? (
                        <img
                            src={author?.avatar?.url}
                            alt={author?.name || "User"}
                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                            {author?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                    )}
                </>

                {/* Comment Details */}
                <div className="min-w-0 flex-1">
                    {/* Author & Date */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        {/* Author Name */}
                        <h3 className="text-sm font-semibold text-slate-900">
                            {author?.name || "Unknown User"}
                        </h3>

                        {/* Created Date */}
                        <span className="text-xs text-slate-400">
                            {formattedDate}
                        </span>
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
                                className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                            />

                            {/* Edit Actions */}
                            <div className="mt-2 flex gap-2">
                                {/* Save */}
                                <button type="button" onClick={handleUpdateComment} disabled={!editContent.trim() || isUpdating} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50">
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
                                }} disabled={isUpdating} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
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

                        {/* Reply Form Toggle */}
                        {user && !isOwnComment && (
                            <button type="button" onClick={() => {
                                setShowReplyForm((prev) => !prev)
                                setIsEditing(false);
                                setIsDeleteConfirming(false);
                            }} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-blue-600">
                                <FiCornerUpLeft size={14} />
                                Reply
                            </button>
                        )}

                        {/* Edit Own Comment */}
                        {isOwnComment && !isEditing && (
                            <button type="button" onClick={() => {
                                setEditContent(comment?.content || "");
                                setIsEditing(true);
                                setIsDeleteConfirming(false);
                                setShowReplyForm(false)
                            }} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-blue-600">
                                <FiEdit2 size={13} />
                                Edit
                            </button>
                        )}

                        {/* Delete Own Comment */}
                        {isOwnComment && !isEditing && !isDeleteConfirming && (
                            <button type="button" onClick={() => {
                                setIsDeleteConfirming(true)
                                setShowReplyForm(false)
                                setIsEditing(false);
                            }} title="Delete comment" aria-label="Delete comment" className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-red-500 transition hover:text-red-700">
                                <FiTrash2 size={13} />
                                Delete
                            </button>
                        )}

                        {/* Replies Toggle */}
                        {repliesResponse?.data?.pagination?.totalItems > 0 && (
                            <button type="button" onClick={() => setShowReplies((prev) => !prev)} className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                                <FiMessageCircle size={14} />
                                {showReplies ? "Hide replies" : `View replies (${repliesResponse?.data?.pagination?.totalItems})`}
                                {showReplies ? (
                                    <FiChevronUp size={14} />
                                ) : (
                                    <FiChevronDown size={14} />
                                )}
                            </button>
                        )}
                    </div>

                    {/* Reply Form */}
                    {!isOwnComment && showReplyForm && (
                        <div className="mt-4 rounded-lg bg-slate-50 p-3">
                            {/* Input */}
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                rows={3}
                                maxLength={2000}
                                disabled={isReplySubmitting}
                                className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                            />

                            {/* Length & Actions */}
                            <div className="mt-2 flex items-center justify-between gap-3">
                                {/* Length */}
                                <span className="text-xs text-slate-400">
                                    {replyContent.length}/2000
                                </span>

                                {/* Create */}
                                <button type="button" onClick={handleCreateReply} disabled={!replyContent.trim() || isReplySubmitting} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                                    {isReplySubmitting ? (
                                        <FiLoader size={14} className="animate-spin"/>
                                    ) : (
                                        <FiSend size={14} />
                                    )}
                                    {isReplySubmitting ? "Submitting..." : "Post Reply"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation */}
                    {isDeleteConfirming && (
                        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 max-w-[420px]">
                            <div className="flex items-start gap-2">
                                {/* Icon */}
                                <FiTrash2 size={17} className="mt-0.5 shrink-0 text-red-600"/>

                                {/* Delete Body */}
                                <div className="min-w-0 flex-1">
                                    {/* Delete Warning Title */}
                                    <p className="text-sm font-semibold text-red-700">
                                        Delete this comment?
                                    </p>

                                    {/* Delete Warning Paragraph */}
                                    <p className="mt-1 text-xs leading-5 text-red-600">
                                        Are you sure you want to delete this comment?
                                        This action cannot be undone.
                                    </p>

                                    {/* Action */}
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {/* Confirm Delete */}
                                        <button type="button" onClick={handleDeleteComment} disabled={isDeleting} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                                            {isDeleting ? (
                                                <FiLoader size={14} className="animate-spin"/>
                                            ) : (
                                                <FiTrash2 size={14} />
                                            )}
                                            {isDeleting ? "Deleting..." : "Delete"}
                                        </button>

                                        {/* Cancel Delete */}
                                        <button type="button" onClick={() => setIsDeleteConfirming(false)} disabled={isDeleting} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">
                                            <FiX size={14} />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Replies Section */}
                    {showReplies && (
                        <div className="mt-5 space-y-4">
                            {/* Loading */}
                            {(repliesLoading || repliesFetching) && (
                                <div className="flex items-center gap-2 py-3 text-xs text-slate-500">
                                    <FiLoader size={15} className="animate-spin"/>
                                    Loading replies...
                                </div>
                            )}

                            {/* Error */}
                            {repliesError && !repliesLoading && (
                                <div className="text-xs text-red-600">
                                    Failed to load replies.
                                    <button type="button" onClick={() => refetchReplies()} className="ml-2 font-semibold underline">
                                        Try again
                                    </button>
                                </div>
                            )}

                            {/* Replies List */}
                            {!repliesLoading && !repliesFetching && !repliesError && (
                                <>
                                    {/* Reply Items */}
                                    {replies?.length > 0 ? (replies?.map((reply: any) => (
                                        <ReplyCommentCard
                                            key={reply?._id}
                                            comment={reply}
                                            parentComment={comment}
                                            articleId={articleId}
                                            user={user}
                                        />
                                    ))) : (
                                        <p className="py-3 text-xs text-slate-500">
                                            No replies yet. Start the conversation.
                                        </p>
                                    )}

                                    {/* Replies Pagination */}
                                    {showReplies && (repliesResponse?.data?.pagination?.totalPages || 1) > 1 && (
                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                                            {/* Total Items */}
                                            <p className="text-xs text-slate-500">
                                                {repliesResponse?.data?.pagination?.totalItems || 0} replies
                                            </p>

                                            {/* Pagination */}
                                            <div className="flex items-center gap-2">
                                                {/* Prev */}
                                                <button type="button" onClick={() => setReplyPage((prev) => Math.max(1, prev - 1))} disabled={replyPage === 1 || repliesFetching} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                                                    Previous
                                                </button>

                                                {/* Page */}
                                                <span className="text-xs text-slate-600">
                                                    Page {replyPage} of {repliesResponse?.data?.pagination?.totalPages || 1}
                                                </span>

                                                {/* Next */}
                                                <button type="button" onClick={() => setReplyPage((prev) => Math.min(repliesResponse?.data?.pagination?.totalPages || 1, prev + 1))} disabled={replyPage >= (repliesResponse?.data?.pagination?.totalPages || 1) || repliesFetching} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

export default ParentCommentCard;