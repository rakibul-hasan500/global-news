"use client";
import Link from "next/link";
import { useGetArticlesQuery } from "@/redux/services/article/articleApi";
import {FaArrowRight, FaRegClock, FaFire, FaExclamationCircle} from "react-icons/fa";
import FeaturedArticleCard from "@/components/user_panel/articles/cards/FeaturedArticleCard";
import ArticleCard from "@/components/user_panel/articles/cards/ArticleCard";
import FeaturedArticleCardSkeleton from "@/components/user_panel/articles/skeletons/FeaturedArticleCardSkeleton";
import ArticleCardSkeleton from "@/components/user_panel/articles/skeletons/ArticleCardSkeleton";

function HeroSection() {

    // Get Featured Articles
    const {data: articlesData, isLoading, isError, refetch} = useGetArticlesQuery({
        search: "",
        category: "",
        featured: true,
        page: 1,
        limit: 5
    })

    // Articles
    const response = articlesData?.data ?? articlesData;
    const articles = response?.articles ?? [];

    // Main Article
    const mainArticle = articles[0];

    // Other Four Articles
    const otherArticles = articles.slice(1, 5);

    return (
        <section className="base-container px-4 py-8 sm:px-8 lg:px-10">
            {/* Section Heading */}
            <div className="mb-5 flex items-center justify-between gap-4">
                {/* Heading */}
                <div>
                    <div className="flex items-center gap-2">
                        <span className="h-6 w-1 rounded-full bg-blue-600" />
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                            Top Stories
                        </h2>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                        Featured stories selected by our editors
                    </p>
                </div>

                {/* Articles Page */}
                <Link href="/articles" className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700">
                    View All
                    <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                    <>
                        {/* Main Article */}
                        <div className="sm:col-span-2 lg:row-span-2">
                            <FeaturedArticleCardSkeleton />
                        </div>

                        {/* Small Articles */}
                        {Array.from({length: 4}).map((_, index) => (
                            <ArticleCardSkeleton key={index}/>
                        ))}
                    </>
                ) : isError ? (
                    <div className="flex min-h-[250px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-center">
                        <FaExclamationCircle className="mb-3 text-3xl text-red-500" />

                        <h3 className="text-lg font-bold text-slate-800">
                            Unable to Load Featured Stories
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Something went wrong. Please try again.
                        </p>

                        <button onClick={refetch} className="mt-4 rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                            Try Again
                        </button>
                    </div>
                ) : (!articles || articles.length === 0) ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-center">
                        <FaFire className="mb-3 text-3xl text-slate-300" />

                        <h3 className="text-lg font-bold text-slate-800">
                            No Featured Stories Yet
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Check back later for our top stories.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Main Featured Article */}
                        <div className="sm:col-span-2 lg:row-span-2">
                            <FeaturedArticleCard article={mainArticle}/>
                        </div>

                        {/* Other Four Featured Articles */}
                        {otherArticles?.map((article: any) => (
                            <ArticleCard key={article._id} article={article}/>
                        ))}
                    </>
                )}
            </div>
        </section>
    );
}

export default HeroSection;
