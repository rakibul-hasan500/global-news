"use client";
import Link from "next/link";
import { useGetArticlesQuery } from "@/redux/services/article/articleApi";
import ArticleGridCard from "@/components/user_panel/articles/cards/ArticleGridCard";
import ArticleListCard from "@/components/user_panel/articles/cards/ArticleListCard";
import ArticleGridSkeleton from "@/components/user_panel/articles/skeletons/ArticleGridSkeleton";
import ArticleListCardSkeleton from "@/components/user_panel/articles/skeletons/ArticleListCardSkeleton";

function SportsSection() {

    // Fetch Sports Articles
    const {data: articlesData, isLoading, isError,} = useGetArticlesQuery({
        search: "",
        category: "sports",
        page: 1,
        limit: 8,
    });

    // Extract Response Data
    const responseData = articlesData?.data ?? articlesData;

    // Get Articles
    const articles = Array.isArray(responseData?.articles) ? responseData.articles : [];

    // Featured Article
    const featuredArticle = articles[0];

    // Remaining Articles
    const remainingArticles = articles.slice(1, 8);

    return (
        <section className="space-y-5">
            {/* Section Header */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
                {/* Title */}
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    Sports
                </h2>

                {/* View All */}
                <Link href="/articles?category=sports" className="shrink-0 text-sm font-semibold text-blue-700 transition hover:text-blue-800">
                    View All
                </Link>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
                    {/* Featured Skeleton */}
                    <ArticleGridSkeleton />

                    {/* List Skeletons */}
                    <ul className="space-y-[22px]">
                        {Array.from({ length: 7 }).map((_, index) => (
                            <ArticleListCardSkeleton key={index} />
                        ))}
                    </ul>
                </div>
            )}

            {/* Error State */}
            {!isLoading && isError && (
                <p className="py-6 text-center text-sm text-red-500">
                    Failed to load sports articles.
                </p>
            )}

            {/* Empty State */}
            {!isLoading && !isError && articles.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-500">
                    No sports articles available right now.
                </p>
            )}

            {/* Sports Articles */}
            {!isLoading && !isError && articles.length > 0 && (
                <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
                    {/* Featured Article */}
                    <ArticleGridCard article={featuredArticle} />

                    {/* Remaining Articles */}
                    {remainingArticles.length > 0 && (
                        <ul className="space-y-[25px]">
                            {remainingArticles.map((article: any) => (
                                <ArticleListCard
                                    key={article?._id}
                                    article={article}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </section>
    );
}

export default SportsSection;
