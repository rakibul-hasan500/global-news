import Link from "next/link";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa6";

// Format Count
function formatCount(count: number = 0) {
    return new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(count);
}

// Format Date
function formatDate(date?: string) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

// Article Horizontal Card
function ArticleHorizontalCard({ article }: { article: any }) {

    // Publish Date
    const publishDate = article?.publishAt || article?.createdAt;

    return (
        <article className="group flex flex-col overflow-hidden rounded border border-slate-200 bg-white transition-shadow hover:shadow-md sm:flex-row">
            {/* Cover Image */}
            <Link href={`/articles/${article?.slug}`} className="relative h-52 shrink-0 overflow-hidden bg-slate-100 sm:h-auto sm:w-52">
                <img
                    src={article?.coverImage?.url || "/images/placeholder.jpg"}
                    alt={article?.coverImage?.altTag || article?.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </Link>

            {/* Article Content */}
            <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                {/* Category & Date */}
                <div className="mb-3 flex flex-wrap items-center gap-3">
                    {/* Category */}
                    {article?.categories?.[0] && (
                        <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            {article?.categories?.[0]?.name}
                        </span>
                    )}

                    {/* Date */}
                    {publishDate && (
                        <span className="text-xs text-slate-500">
                            {formatDate(publishDate)}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="line-clamp-2 text-base font-bold leading-6 text-slate-900 transition-colors group-hover:text-blue-700 sm:text-lg">
                    <Link href={`/articles/${article?.slug}`}>
                        {article?.title}
                    </Link>
                </h3>

                {/* Excerpt */}
                {article?.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                        {article?.excerpt}
                    </p>
                )}

                {/* Author */}
                <p className="mt-3 text-xs text-slate-500">
                    By{" "}
                    <span className="font-semibold text-slate-700">
                        {article?.author?.name || "News Team"}
                    </span>
                </p>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3 mt-4">
                    {/* Reactions */}
                    <div className="flex items-center gap-4">
                        {/* Likes */}
                        <span className="flex items-center gap-1.5 text-xs text-slate-500" title="Likes">
                            <FaRegThumbsUp />
                            {formatCount(article?.like)}
                        </span>

                        {/* Dislikes */}
                        <span className="flex items-center gap-1.5 text-xs text-slate-500" title="Dislikes">
                            <FaRegThumbsDown />
                            {formatCount(article?.dislike)}
                        </span>
                    </div>

                    {/* Read More */}
                    <Link href={`/articles/${article?.slug}`} className="shrink-0 text-xs font-semibold text-blue-700 transition hover:text-blue-800">
                        Read More →
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default ArticleHorizontalCard;
