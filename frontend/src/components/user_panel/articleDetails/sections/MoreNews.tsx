"use client";
import Link from "next/link";
import { useGetArticlesQuery } from "@/redux/services/article/articleApi";
import ArticleCard from "@/components/user_panel/articles/cards/ArticleCard";
import ArticleCardSkeleton from "@/components/user_panel/articles/skeletons/ArticleCardSkeleton";

function MoreNews({categorySlug}: any) {

    // Fetch Related Articles
    const {data: articlesData, isLoading, isError} = useGetArticlesQuery({
        search: "",
        category: categorySlug || "",
        page: 1,
        limit: 6,
    }, {
        skip: !categorySlug,
    });

    // Extract Articles
    const responseData = articlesData?.data ?? articlesData;
    const articles = Array.isArray(responseData?.articles) ? responseData.articles : [];

    return (
        <section className="mt-8 space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-900">
                    More News
                </h3>
                {categorySlug && (
                    <Link href={`/articles?category=${categorySlug}`} className="text-xs font-semibold text-blue-600 transition-colors hover:text-blue-800">
                        View All
                    </Link>
                )}
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <ArticleCardSkeleton key={index} />
                    ))}
                </div>
            ) : isError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-center">
                    <p className="text-sm font-medium text-red-600">
                        Failed to load more news. Please try again later.
                    </p>
                </div>
            ) : articles.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-center">
                    <p className="text-sm text-slate-500">
                        No related news available right now.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {articles?.map((article: any) => (
                        <ArticleCard
                            key={article?._id}
                            article={article}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default MoreNews;
