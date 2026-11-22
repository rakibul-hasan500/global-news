"use client";
import {useCreateCommentMutation, useGetArticleCommentsQuery} from "@/redux/services/comment/commentApi";
import { responseHandler } from "@/utils/responseHandler";
import { useSelector } from "react-redux";
import { useState } from "react";
import {FiMessageCircle, FiSend, FiLoader,} from "react-icons/fi";
import ParentCommentCard from "@/components/common/comment/ParentCommentCard";

function ArticleComments({articleId}: {articleId: string}) {

    // Current User
    const {user} = useSelector((state: any) => state.Auth);

    // Pagination State
    const [page, setPage] = useState(1);
    const limit = 20;

    // Get Article Comments
    const {data: commentsResponse, isLoading, isFetching, isError, refetch,} = useGetArticleCommentsQuery({
        articleId,
        page,
        limit
    }, {skip: !articleId})

    // Create Comment API
    const [createComment, {isLoading: createLoading}] = useCreateCommentMutation();

    // New Comment State
    const [content, setContent] = useState("");

    // Comments & Pagination
    const comments = commentsResponse?.data?.comments || [];
    const pagination = commentsResponse?.data?.pagination;

    // Submit New Comment
    const handleCreateComment = async () => {
        // Validate
        if (!user) {
            return responseHandler("E", "Please sign in to comment");
        }
        if (!articleId || !content.trim() || createLoading) {
            return;
        }

        try {
            // Hit Create Comment API
            const response = await createComment({
                article: articleId,
                parentComment: null,
                content: content.trim(),
            }).unwrap();

            // Reset States
            setContent("");
            setPage(1);

            return responseHandler("S", response?.message || "Comment submitted successfully")
        } catch (error: any) {
            return responseHandler("E", error?.data?.message || "Failed to submit comment")
        }
    };

    return (
        <section className="mt-10">
            {/* SECTION HEADER */}
            <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-slate-900">
                    Comments
                    {typeof pagination?.totalItems === "number" && (
                        <span className="ml-2 text-sm font-medium text-slate-500">
                            ({pagination?.totalItems})
                        </span>
                    )}
                </h2>
            </div>

            {/* CREATE COMMENT */}
            <div className="mb-8 rounded-xl border border-slate-200 bg-white p-4">
                {user ? (
                    <>
                        {/* Input */}
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your thoughts..."
                            rows={4}
                            maxLength={2000}
                            disabled={createLoading}
                            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                        />

                        {/* Length & Submit */}
                        <div className="mt-3 flex items-center justify-between gap-3">
                            {/* Length */}
                            <span className="text-xs text-slate-500">
                                {content.length}/2000
                            </span>

                            {/* Submit */}
                            <button type="button" onClick={handleCreateComment} disabled={!content.trim() || createLoading} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                                {createLoading ? (
                                    <FiLoader className="animate-spin" size={15} />
                                ) : (
                                    <FiSend size={15} />
                                )}
                                {createLoading ? "Submitting..." : "Post Comment"}
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-sm text-slate-600">
                        Please sign in to join the conversation.
                    </p>
                )}
            </div>

            {/* LOADING */}
            {isLoading && (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
                    <FiLoader className="animate-spin" size={18} />
                    Loading comments...
                </div>
            )}

            {/* ERROR */}
            {isError && !isLoading && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Failed to load comments.
                    <button type="button" onClick={() => refetch()} className="ml-2 font-semibold underline">
                        Try again
                    </button>
                </div>
            )}

            {/* COMMENTS LIST */}
            {!isLoading && !isError && (
                <div className="space-y-4">
                    {comments?.length > 0 ? (comments?.map((comment: any) => (
                        <ParentCommentCard
                            key={comment._id}
                            comment={comment}
                            articleId={articleId}
                            user={user}
                        />
                    ))) : (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-10 text-center">
                            <FiMessageCircle size={28} className="mx-auto mb-3 text-slate-400"/>
                            <p className="text-sm font-medium text-slate-700">
                                No comments yet
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Be the first to share your thoughts.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* PAGINATION */}
            {pagination?.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between gap-3">
                    {/* Page Number */}
                    <p className="text-xs text-slate-500">
                        Page {page} of {pagination?.totalPages}
                    </p>

                    {/* Pagination Buttons */}
                    <div className="flex items-center gap-2">
                        {/* Prev Button */}
                        <button type="button" disabled={!pagination.hasPrevPage || isFetching} onClick={() => setPage((prev) => prev - 1)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                            Previous
                        </button>

                        {/* Next Button */}
                        <button type="button" disabled={!pagination.hasNextPage || isFetching} onClick={() => setPage((prev) => prev + 1)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                            Next
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ArticleComments;