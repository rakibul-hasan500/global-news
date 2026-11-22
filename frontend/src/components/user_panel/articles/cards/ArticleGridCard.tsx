"use client";
import Link from "next/link";
import {FaThumbsUp, FaThumbsDown, FaRegThumbsUp, FaRegThumbsDown} from "react-icons/fa6";

// Format Count
function formatCount(count: number = 0) {
    return new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(count);
}

function ArticleGridCard({article}: any) {

    // Publish Date
    const publishDate = article.publishAt || article.createdAt;

    return (
        <article className="overflow-hidden rounded border border-slate-200 bg-white transition-shadow hover:shadow-md">
            {/* Cover Image */}
            <Link href={`/articles/${article.slug}`}>
                <img
                    src={article.coverImage?.url || "/images/placeholder.jpg"}
                    alt={article.coverImage?.altTag || article.title}
                    className="h-78 w-full object-cover"
                />
            </Link>

            {/* Content */}
            <div className="p-5">
                {/* Category & Date */}
                <div className="mb-3 flex items-center justify-between gap-3">
                    {/* Category */}
                    {article.categories?.[0] && (
                        <Link href={`/articles?category=${encodeURIComponent(article.categories[0].slug)}`} className="rounded bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            {article.categories[0].name}
                        </Link>
                    )}

                    {/* Date */}
                    {publishDate && (
                        <span className="shrink-0 text-xs text-slate-500">
                            {new Date(publishDate).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            })}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h2 className="line-clamp-2 text-lg font-bold leading-7 text-slate-900">
                    <Link href={`/articles/${article.slug}`} className="hover:text-blue-700">
                        {article.title}
                    </Link>
                </h2>

                {/* Excerpt */}
                {article?.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                        {article.excerpt}
                    </p>
                )}

                {/* Author */}
                <p className="mt-3 text-xs text-slate-500">
                    By{" "}
                    <span className="font-semibold text-slate-700">
                        {article.author?.name || "News Team"}
                    </span>
                </p>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    {/* Reactions */}
                    <div className="flex items-center gap-4">
                        {/* Like */}
                        <span className={`flex items-center gap-1.5 text-sm text-slate-500`} title="Likes">
                            <FaRegThumbsUp />
                            {formatCount(article.like)}
                        </span>

                        {/* Dislike */}
                        <span className={`flex items-center gap-1.5 text-sm text-slate-500`} title="Dislikes">
                            <FaRegThumbsDown />
                            {formatCount(article.dislike)}
                        </span>
                    </div>

                    {/* Read More */}
                    <Link href={`/articles/${article.slug}`} className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                        Read More →
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default ArticleGridCard;
