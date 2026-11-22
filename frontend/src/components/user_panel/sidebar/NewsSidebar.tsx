"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import {FaArrowRight, FaFolderOpen, FaNewspaper, FaClock, FaFire} from "react-icons/fa6";
import {useGetArticlesQuery} from "@/redux/services/article/articleApi";
import ArticleListCard from "@/components/user_panel/articles/cards/ArticleListCard";
import ArticleListCardSkeleton from "@/components/user_panel/articles/skeletons/ArticleListCardSkeleton";

function NewsSidebar() {

    // Redux Categories
    const categories = useSelector((state: any) => state.Category?.allCategories)?.slice(0, 10)

    // URL Parameters
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get("category");

    // Latest Articles
    const {data: latestData, isLoading, isError} = useGetArticlesQuery({
        search: "",
        category: "",
        page: 1,
        limit: 6
    });

    // Extract Articles
    const responseData = latestData?.data ?? latestData;
    const latestArticles = Array.isArray(responseData?.articles) ? responseData.articles : [];

    // Valid Categories
    const allCategories = Array.isArray(categories) ? categories.filter((category: any) => category?.slug && category?.name) : [];

    // Featured Articles
    const {data: featuredData, isLoading: featuredLoading, isError: featuredError} = useGetArticlesQuery({
        search: "",
        category: "",
        featured: "true",
        page: 1,
        limit: 6
    });

    // Extract Featured Articles
    const featuredResponse = featuredData?.data ?? featuredData;

    const featuredArticles = Array.isArray(featuredResponse?.articles) ? featuredResponse.articles : [];

    return (
        <aside className="space-y-6">
            {/* Explore Categories */}
            <section className="overflow-hidden rounded border border-slate-200 bg-white">
                {/* Section Title */}
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                    {/* Icon */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                        <FaFolderOpen size={17} />
                    </div>

                    {/* Title */}
                    <div>
                        <h2 className="text-base font-bold text-slate-900">
                            Explore Categories
                        </h2>
                        <p className="text-xs text-slate-500">
                            Browse news by topic
                        </p>
                    </div>
                </div>

                {/* Categories */}
                <div className="p-3">
                    {allCategories.length > 0 ? (
                        <ul className="space-y-1">
                            {allCategories.map((category: any) => {
                                const isActive = activeCategory === category.slug;
                                return (
                                    <li key={category._id}>
                                        <Link href={`/articles?category=${encodeURIComponent(category.slug)}`} className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"}`}>
                                            <span className="flex items-center gap-3">
                                                <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-blue-700" : "bg-slate-300"}`}/>
                                                {category.name}
                                            </span>
                                            <FaArrowRight size={11} className={isActive ? "text-blue-700" : "text-slate-400"}/>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="px-3 py-5 text-center text-sm text-slate-400">
                            No categories available.
                        </p>
                    )}
                </div>

                {/* View All Articles */}
                <div className="border-t border-slate-100 p-3">
                    <Link href="/articles" className="flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
                        View All News
                        <FaArrowRight size={12} />
                    </Link>
                </div>
            </section>

            {/* Latest Stories */}
            <section className="overflow-hidden rounded border border-slate-200 bg-white">
                {/* Section Title */}
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                    {/* Icon */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                        <FaClock size={16} />
                    </div>

                    {/* Title */}
                    <div>
                        <h2 className="text-base font-bold text-slate-900">
                            Latest Stories
                        </h2>
                        <p className="text-xs text-slate-500">
                            Recently published articles
                        </p>
                    </div>
                </div>

                {/* Articles */}
                <div className="divide-y divide-slate-100">
                    {isLoading ? (
                        <div className="space-y-4 p-4">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <ArticleListCardSkeleton key={item}/>
                            ))}
                        </div>
                    ) : isError ? (
                        <p className="px-5 py-6 text-center text-sm text-slate-500">
                            Unable to load latest stories.
                        </p>
                    ) : latestArticles?.length > 0 ? (
                        <div className="p-3">
                            <ul className="space-y-4">
                                {latestArticles.map((article: any) => (
                                    <ArticleListCard key={article._id} article={article}/>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="px-5 py-6 text-center text-sm text-slate-400">
                            No recent articles available.
                        </p>
                    )}
                </div>

                {/* View All */}
                <div className="border-t border-slate-100 p-3">
                    <Link href="/articles" className="flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
                        Explore All Stories
                        <FaArrowRight size={12} />
                    </Link>
                </div>
            </section>

            {/* Featured Stories */}
            <section className="overflow-hidden rounded border border-slate-200 bg-white">
                {/* Section Title */}
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                    {/* Icon */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                        <FaFire size={17} />
                    </div>

                    {/* Title */}
                    <div>
                        <h2 className="text-base font-bold text-slate-900">
                            Featured Stories
                        </h2>
                        <p className="text-xs text-slate-500">
                            Editor's selected stories
                        </p>
                    </div>
                </div>

                {/* Articles */}
                <div className="divide-y divide-slate-100">
                    {featuredLoading ? (
                        <div className="space-y-4 p-4">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <ArticleListCardSkeleton key={item}/>
                            ))}
                        </div>
                    ) : featuredError ? (
                        <p className="px-5 py-6 text-center text-sm text-slate-500">
                            Unable to load featured stories.
                        </p>
                    ) : featuredArticles.length > 0 ? (
                        <div className="p-3">
                            <ul className="space-y-4">
                                {featuredArticles.map((article: any) => (
                                    <ArticleListCard key={article._id} article={article}/>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="px-5 py-6 text-center text-sm text-slate-400">
                            No featured stories available.
                        </p>
                    )}
                </div>

                {/* View All */}
                <div className="border-t border-slate-100 p-3">
                    <Link href="/articles" className="flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
                        Explore All Stories
                        <FaArrowRight size={12} />
                    </Link>
                </div>
            </section>

            {/* About Global News */}
            <section className="rounded border border-slate-200 bg-white p-5">

                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <FaNewspaper size={18} />
                </div>

                <h2 className="text-base font-bold text-slate-900">
                    Stay Informed
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Discover the latest stories, important updates and
                    perspectives from around the world.
                </p>

                <Link href="/articles" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-800">
                    Explore Latest News
                    <FaArrowRight size={12} />
                </Link>
            </section>
        </aside>
    );
}

export default NewsSidebar;
