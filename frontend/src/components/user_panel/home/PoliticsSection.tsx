"use client";
import Link from "next/link";
import { useGetArticlesQuery } from "@/redux/services/article/articleApi";
import ArticleGridCard from "@/components/user_panel/articles/cards/ArticleGridCard";
import ArticleGridSkeleton from "@/components/user_panel/articles/skeletons/ArticleGridSkeleton";

// Politics Section
function PoliticsSection() {

    // Fetch Politics Articles
    const {data: articlesData, isLoading, isError} = useGetArticlesQuery({
        search: "",
        category: "politics",
        page: 1,
        limit: 6,
    });

    // Extract Response Data
    const responseData = articlesData?.data ?? articlesData;

    // Get Articles
    const articles = Array.isArray(responseData?.articles) ? responseData.articles : [];

    return (
        <section className="space-y-5">
            {/* Section Header */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
                {/* Title */}
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    Politics
                </h2>

                {/* View All */}
                <Link href="/articles?category=politics" className="shrink-0 text-sm font-semibold text-blue-700 transition hover:text-blue-800">
                    View All
                </Link>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <ArticleGridSkeleton key={index}/>
                    ))}
                </div>
            )}

            {/* Error State */}
            {!isLoading && isError && (
                <p className="py-6 text-center text-sm text-red-500">
                    Failed to load politics articles.
                </p>
            )}

            {/* Empty State */}
            {!isLoading && !isError && articles.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-500">
                    No politics articles available right now.
                </p>
            )}

            {/* Politics Articles */}
            {!isLoading && !isError && articles?.length > 0 && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {articles?.map((article: any) => (
                        <ArticleGridCard
                            key={article?._id}
                            article={article}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default PoliticsSection;
