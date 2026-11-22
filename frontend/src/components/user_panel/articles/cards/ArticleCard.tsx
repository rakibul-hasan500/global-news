import Link from "next/link";
import { FaRegClock } from "react-icons/fa";

// Format Date
function formatDate(date?: string) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

// Article Card
function ArticleCard({ article }: { article: any }) {

    // Published Date or Created Date
    const articleDate = article?.publishAt ? article.publishAt : article?.createdAt;

    return (
        <Link href={`/articles/${article?.slug}`} className="group block overflow-hidden rounded border border-slate-200 bg-white transition hover:border-blue-200 hover:shadow-md">
            {/* Cover Image */}
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                {article?.coverImage?.url && (
                    <img
                        src={article?.coverImage?.url}
                        alt={article?.coverImage?.altTag || article?.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                )}

                {/* Category */}
                {article?.categories?.[0] && (
                    <span className="absolute left-3 top-3 rounded bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white">
                        {article?.categories[0]?.name}
                    </span>
                )}
            </div>

            {/* Article Content */}
            <div className="p-3 sm:p-4">
                {/* Title */}
                <h3 className="line-clamp-2 text-sm font-bold leading-6 text-slate-800 transition-colors group-hover:text-blue-600 sm:text-base">
                    {article?.title}
                </h3>

                {/* Date */}
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                    <FaRegClock />
                    <span>{formatDate(articleDate)}</span>
                </div>
            </div>
        </Link>
    );
}

export default ArticleCard;