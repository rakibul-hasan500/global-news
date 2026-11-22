import Link from "next/link";
import { FaArrowRight, FaRegClock } from "react-icons/fa";

// Format Date
function formatDate(date?: string) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

// Featured Article Card
function FeaturedArticleCard({article, titleSize="lg"}: any) {
    return (
        <Link href={`/articles/${article?.slug}`} className="group relative isolate block min-h-[380px] overflow-hidden rounded bg-slate-900 h-full">
            {/* Cover Image */}
            {article?.coverImage?.url && (
                <img
                    src={article?.coverImage?.url}
                    alt={article.coverImage?.altTag || article?.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/5" />

            {/* Article Content */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                {/* Category */}
                {article?.categories?.[0] && (
                    <span className="mb-3 inline-flex rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                        {article?.categories[0]?.name}
                    </span>
                )}

                {/* Title */}
                <h3 className={`${titleSize === "sm" ? "text-2xl" : "text-xl sm:text-2xl lg:text-3xl"} font-bold leading-snug text-white transition-colors group-hover:text-blue-200`}>
                    {article?.title}
                </h3>

                {/* Excerpt */}
                {article?.excerpt && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/80">
                        {article?.excerpt}
                    </p>
                )}

                {/* Date */}
                <div className="mt-4 flex items-center gap-2 text-xs text-white/75">
                    {/* Icon */}
                    <FaRegClock />

                    {/* Date */}
                    <span>
                        {formatDate(article?.publishAt || article?.createdAt)}
                    </span>

                    {/* Separator */}
                    <span className="mx-1">·</span>

                    {/* Read Button */}
                    <span className="font-medium text-white">
                        Read Story
                    </span>

                    {/* Icon */}
                    <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}

export default FeaturedArticleCard;
