"use client";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";
import {useToggleArticleReactionMutation} from "@/redux/services/article/articleApi";
import {responseHandler} from "@/utils/responseHandler";
import {useToggleCommentReactionMutation} from "@/redux/services/comment/commentApi";

function Reactions({item, isOwnItem=false, type="COMMENT"}: any) {

    // Format Reaction Count
    const formatCount = (count: number) => {
        const value = Number(count) || 0;
        return value < 1000 ? value : `${Number((value / 1000).toFixed(1))}k`;
    };



    // Call Toggle Article Reaction API
    const [toggleArticleReaction, {isLoading: toggleArticleReactionLoading}] = useToggleArticleReactionMutation()

    // Call Toggle Comment Reaction API
    const [toggleCommentReaction, {isLoading: toggleCommentReactionLoading}] = useToggleCommentReactionMutation()

    // Handle Toggle Article Reaction
    const handleToggleArticleReaction = async (reactionType: "LIKE" | "DISLIKE") => {
        if (isOwnItem) return;
        try {
            // Toggle Reaction API
            if (type === "ARTICLE") {
                await toggleArticleReaction({
                    itemId: item?._id,
                    reactionType,
                    reactionFor: type,
                }).unwrap();
            } else {
                await toggleCommentReaction({
                    itemId: item?._id,
                    reactionType,
                    reactionFor: type,
                })
            }

            return;
        } catch (error: any) {
            return responseHandler("E", error?.data?.message)
        }
    };


    return (
        <div className="flex items-center gap-2">
            {/* LIKE */}
            <button type="button" disabled={isOwnItem || toggleArticleReactionLoading || toggleCommentReactionLoading} onClick={() => handleToggleArticleReaction("LIKE")} title="Likes" aria-label={`Likes: ${item?.like || 0}`} className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50">
                {item?.myReaction === "LIKE" ? (
                    <FaThumbsUp size={14} />
                ) : (
                    <FiThumbsUp size={14} />
                )}
                <span>{formatCount(item?.like)}</span>
            </button>

            {/* DISLIKE */}
            <button type="button" disabled={isOwnItem || toggleArticleReactionLoading || toggleCommentReactionLoading} onClick={() => handleToggleArticleReaction("DISLIKE")} title="Dislikes" aria-label={`Dislikes: ${item?.dislike || 0}`} className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50">
                {item?.myReaction === "DISLIKE" ? (
                    <FaThumbsDown size={14} />
                ) : (
                    <FiThumbsDown size={14} />
                )}
                <span>{formatCount(item?.dislike)}</span>
            </button>
        </div>
    );
}

export default Reactions;