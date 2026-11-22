"use client";
import Link from "next/link";
import { FaClock } from "react-icons/fa6";

// Format Date
function formatDate(date: string) {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function ArticleListCard({article}: any) {

    // Publish Date
    const publishDate = article?.publishAt || article?.createdAt;

    return (
        <li className="list-none">
            <Link href={`/articles/${article?.slug}`} className="group flex gap-3 rounded transition">
                {/* Cover Image */}
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded bg-slate-100">
                    {article?.coverImage?.url && (
                        <img
                            src={article?.coverImage?.url}
                            alt={article?.coverImage?.altTag || article?.title || "Article"}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                    )}
                </div>

                {/* Article Info */}
                <div className="min-w-0 flex-1">
                    {/* Title */}
                    <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-800 transition group-hover:text-blue-700">
                        {article?.title}
                    </h3>

                    {/* Publish Date */}
                    {publishDate && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                            <FaClock size={10} />
                            {formatDate(publishDate)}
                        </p>
                    )}
                </div>
            </Link>
        </li>
    );
}

export default ArticleListCard;
