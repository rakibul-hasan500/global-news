"use client";
import Link from "next/link";
import { FaBolt, FaArrowRight } from "react-icons/fa";
import { useGetArticlesQuery } from "@/redux/services/article/articleApi";
import {useState} from "react";

function BreakingNewsSection() {

    // Get Breaking News
    const {data: articlesData, isLoading, isError} = useGetArticlesQuery({
        search: "",
        category: "breaking-news",
        page: 1,
        limit: 5
    });

    // Extract Articles
    const response = articlesData?.data ?? articlesData;
    const articles = response?.articles ?? [];

    // Current Index
    const [currentIndex, setCurrentIndex] = useState(0)

    // Change Article Index
    setTimeout(() => {
        if (currentIndex < 4) {
            setCurrentIndex(currentIndex + 1)
        } else if(currentIndex >= 4) {
            setCurrentIndex(0)
        }
    }, 6000)

    // Hide Section When No Breaking News
    if (!isLoading && (!articles.length || isError)) {
        return null;
    }

    return (
        <section className="base-container pt-4">
            <div className="flex flex-col md:flex-row min-h-12 overflow-hidden rounded border border-red-100 bg-white">
                {/* Breaking Label */}
                <div className="flex shrink-0 items-center gap-2 bg-red-600 px-3 py-3 text-white sm:px-5">
                    <FaBolt className="text-sm" />
                    <span className="text-xs font-bold uppercase tracking-wide sm:text-sm">
                        Breaking News
                    </span>
                </div>

                {/* Headlines */}
                <div className="flex-1 items-center">
                    {isLoading ? (
                        <div className="flex w-full items-center gap-3 px-4">
                            <div className="h-4 w-full max-w-md animate-pulse rounded bg-slate-200" />
                        </div>
                    ) : (
                        <Link href={`/articles/${articles?.[currentIndex]?.slug}`} className="group truncate flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                            <span className="text-xs font-semibold text-slate-700 transition-colors group-hover:text-red-600 sm:text-sm">
                                    {articles?.[currentIndex]?.title}
                                </span>
                        </Link>
                    )}
                </div>

                {/* View All */}
                {!isLoading && articles.length > 0 && (
                    <Link href="/articles?breaking=true" className="hidden shrink-0 items-center gap-2 px-4 text-xs font-semibold text-slate-600 transition hover:text-red-600 md:flex">
                        View All
                        <FaArrowRight />
                    </Link>
                )}
            </div>
        </section>
    );
}

export default BreakingNewsSection;