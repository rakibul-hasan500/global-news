"use client";
import Link from "next/link";
import { useGetArticlesQuery } from "@/redux/services/article/articleApi";
import FeaturedArticleCard from "@/components/user_panel/articles/cards/FeaturedArticleCard";
import FeaturedArticleCardSkeleton from "@/components/user_panel/articles/skeletons/FeaturedArticleCardSkeleton";

function BusinessSection() {

    // Fetch Business Articles
    const {data: articlesData, isLoading, isError,} = useGetArticlesQuery({
        search: "",
        category: "business",
        page: 1,
        limit: 6,
    });

    // Extract Articles
    const responseData = articlesData?.data ?? articlesData;
    const articles = Array.isArray(responseData?.articles) ? responseData.articles : [];

    return (
        <section className="space-y-5">
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    Business
                </h2>
                <Link href="/articles?category=business" className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800">
                    View All
                </Link>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <FeaturedArticleCardSkeleton key={index} />
                    ))}
                </div>
            ) : isError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center">
                    <p className="text-sm font-medium text-red-600">
                        Failed to load business articles. Please try again later.
                    </p>
                </div>
            ) : articles.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-8 text-center">
                    <p className="text-sm text-slate-500">
                        No business articles available right now.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {articles.map((article: any) => (
                        <FeaturedArticleCard
                            key={article._id}
                            article={article}
                            titleSize={"sm"}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default BusinessSection;