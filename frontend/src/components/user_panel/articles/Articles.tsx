"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import NewsSidebar from "@/components/user_panel/sidebar/NewsSidebar";
import {FaNewspaper, FaFolderOpen, FaMagnifyingGlass, FaTableCellsLarge, FaList} from "react-icons/fa6";
import Pagination from "@/components/common/other/Pagination";
import {useGetArticlesQuery} from "@/redux/services/article/articleApi";
import ArticleGridCard from "@/components/user_panel/articles/cards/ArticleGridCard";
import ArticleListCard from "@/components/user_panel/articles/cards/ArticleListCard";
import ArticleGridSkeleton from "@/components/user_panel/articles/skeletons/ArticleGridSkeleton";
import ArticleListSkeleton from "@/components/user_panel/articles/skeletons/ArticleListCardSkeleton";
import ArticleHorizontalCardSkeleton from "@/components/user_panel/articles/skeletons/ArticleHorizontalCardSkeleton";
import ArticleHorizontalCard from "@/components/user_panel/articles/cards/ArticleHorizontalCard";

function Articles() {

    // URL Parameters
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const categorySlug = searchParams.get("category");
    const searchQuery = searchParams.get("search");

    // Current Layout
    const layout = searchParams.get("layout") === "list" ? "list" : "grid";

    // Categories
    const categories = useSelector((state: any) => state.Category?.allCategories);
    const activeCategory = Array.isArray(categories) ? categories.find((category: any) => category.slug === categorySlug) : null;

    // Page Information
    const pageInfo = searchQuery ? {
        title: `Search: ${searchQuery}`,
        subtitle: "Explore stories matching your search.",
        icon: FaMagnifyingGlass
    } : categorySlug ? {
        title: activeCategory?.name || "Category News",
        subtitle: activeCategory?.description || "Explore the latest stories in this category.",
        icon: FaFolderOpen
    } : {
        title: "Latest News",
        subtitle: "Explore the latest stories and updates from around the world.",
        icon: FaNewspaper
    };
    const PageIcon = pageInfo.icon;

    // Change Layout
    const handleLayoutChange = (newLayout: "grid" | "list") => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("layout", newLayout);

        router.replace(`${pathname}?${params.toString()}`, {scroll: false});
    };

    // Pagination
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = 10;

    // Fetch Articles
    const {data: articlesData, isLoading, isError, refetch} = useGetArticlesQuery({
        search: searchQuery || "",
        category: categorySlug || "",
        page,
        limit
    });

    // Extract Response
    const responseData = articlesData?.data ?? articlesData;
    const articles = Array.isArray(responseData?.articles) ? responseData.articles : [];
    const pagination = responseData?.pagination;

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="base-container px-4 py-8 sm:px-8 lg:px-10">
                {/* Page Header */}
                <section className="mb-8 rounded border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8">
                    <div className="flex items-center justify-between gap-4">
                        {/* Title */}
                        <div className="flex min-w-0 items-center gap-3">
                            {/* Icon */}
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                <PageIcon size={21} />
                            </div>

                            {/* Headings */}
                            <div className="min-w-0">
                                <h1 className="text-xl font-bold capitalize tracking-tight text-slate-900 sm:text-3xl">
                                    {pageInfo.title}
                                </h1>
                                <p className="mt-1 hidden text-sm text-slate-500 sm:block">
                                    {pageInfo.subtitle}
                                </p>
                            </div>
                        </div>

                        {/* Layout Toggle */}
                        <div className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
                            {/* Grid */}
                            <button type="button" onClick={() => handleLayoutChange("grid")} aria-label="Grid view" aria-pressed={layout === "grid"} className={`flex h-9 w-9 items-center justify-center rounded-md transition ${layout === "grid" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-white hover:text-blue-700"}`}>
                                <FaTableCellsLarge size={16} />
                            </button>

                            {/* List */}
                            <button type="button" onClick={() => handleLayoutChange("list")} aria-label="List view" aria-pressed={layout === "list"} className={`flex h-9 w-9 items-center justify-center rounded-md transition ${layout === "list" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-white hover:text-blue-700"}`}>
                                <FaList size={16} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <div className="flex flex-col items-start gap-8 lg:flex-row">
                    {/* Articles Section */}
                    <section className="w-full min-w-0 flex-1">
                        {/* Articles Grid / List */}
                        {isLoading ? (
                            <div className={layout === "grid" ? "grid grid-cols-1 gap-6 sm:grid-cols-2" : "flex flex-col gap-5"}>
                                {Array.from({ length: 8 }).map((_, index) => (
                                    layout === "grid" ? (
                                        <ArticleGridSkeleton key={index}/>
                                    ) : (
                                        <ArticleHorizontalCardSkeleton key={index}/>
                                    )
                                ))}
                            </div>
                        ) : isError ? (
                            <div className="flex min-h-[350px] flex-col items-center justify-center rounded border border-slate-200 bg-white px-6 py-10 text-center">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                                    <FaNewspaper size={24} />
                                </div>

                                <h3 className="text-lg font-bold text-slate-800">
                                    Unable to Load Articles
                                </h3>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                    Something went wrong while loading articles. Please try again.
                                </p>

                                <button type="button" onClick={refetch} className="mt-5 rounded bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                                    Try Again
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Articles */}
                                <div className={layout === "grid" ? "grid grid-cols-1 gap-6 sm:grid-cols-2" : "flex flex-col gap-5"}>
                                    {articles.map((article: any) => (
                                        layout === "grid" ? (
                                            <ArticleGridCard key={article._id} article={article} />
                                        ) : (
                                            <ArticleHorizontalCard key={article._id} article={article} />
                                        )
                                    ))}
                                </div>

                                {/* Pagination */}
                                {articles.length > 0 && pagination && (
                                    <div className="mt-8">
                                        <Pagination pagination={pagination} />
                                    </div>
                                )}

                                {/* Empty State */}
                                {articles.length === 0 && (
                                    <div className="flex min-h-[280px] flex-col items-center justify-center rounded border border-dashed border-slate-300 bg-white px-6 text-center">
                                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                                            <FaNewspaper size={23} />
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-800">
                                            No Articles Yet
                                        </h3>

                                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                            Articles will appear here once available.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Empty State */}
                        {articles.length === 0 && (
                            <div className="flex min-h-[280px] flex-col items-center justify-center rounded border border-dashed border-slate-300 bg-white px-6 text-center">
                                {/* Icon */}
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                                    <FaNewspaper size={23} />
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-slate-800">
                                    No Articles Yet
                                </h3>

                                {/* Subtitle */}
                                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                    Articles will appear here once available.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Sidebar */}
                    <aside className="sticky top-0 w-full shrink-0 lg:w-90">
                        <NewsSidebar />
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default Articles;