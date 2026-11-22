"use client";
import {FiEdit2, FiEye, FiFileText, FiPlus, FiSearch, FiStar, FiTrash2} from "react-icons/fi";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import { useSelector } from "react-redux";
import {useEffect, useRef, useState} from "react";
import {useGetCategoriesQuery} from "@/redux/services/category/categoryApi";
import {IoMdArrowDropdown} from "react-icons/io";
import {useGetTagsQuery} from "@/redux/services/tag/tagApi";
import {
    useDeleteArticleMutation,
    useGetDashboardArticlesQuery,
    useToggleArticleFeaturedStatusMutation
} from "@/redux/services/article/articleApi";
import Pagination from "@/components/common/other/Pagination";
import {responseHandler} from "@/utils/responseHandler";
import DeleteWarningModal from "@/components/common/warning/DeleteWarningModal";
import Reactions from "@/components/common/reaction/Reactions";

function ArticlesPage() {

    // Url Items
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();




    // User Data From Redux
    const { user } = useSelector((state: any) => state.Auth);

    // Check Authoring Permissions
    const canAddArticle = ["JOURNALIST"].includes(user?.role);




    // Filter states
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedTag, setSelectedTag] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedLimit, setSelectedLimit] = useState(20);
    const [page, setPage] = useState(1);

    // Dropdown states
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [limitDropdownOpen, setLimitDropdownOpen] = useState(false)

    // Sync URL params to filter states
    useEffect(() => {
        setSearch(searchParams.get("search") || "");
        setSelectedCategory(searchParams.get("category") || "all");
        setSelectedTag(searchParams.get("tag") || "all");
        setSelectedStatus(searchParams.get("status") || "all");
        setSelectedLimit(Number(searchParams.get("limit")) || 20);
        setPage(Number(searchParams.get("page")) || 1);
    }, [searchParams]);




    // Fetch categories for the category filter
    const [categoriesLimit, setCategoriesLimit] = useState(100);
    const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery({
        search: "",
        status: "active",
        limit: categoriesLimit,
        page: 1,
    });
    useEffect(() => {
        if(categoriesData?.data?.categories) {
            setCategoriesLimit(categoriesData?.data?.categories?.length || 100)
        }
    }, [categoriesData]);
    const categories = categoriesData?.data?.categories ?? [];

    // Status options from the Article schema
    const statuses = [
        { value: "all", label: "All Status" },
        { value: "DRAFT", label: "Draft" },
        { value: "SUBMITTED", label: "Submitted" },
        { value: "REJECTED", label: "Rejected" },
        { value: "PUBLISHED", label: "Published" },
    ];

    // Fetch tags for the tag filter
    const [tagsLimit, setTagsLimit] = useState(100);
    const { data: tagsData, isLoading: tagsLoading } = useGetTagsQuery({
        search: "",
        status: "active",
        limit: tagsLimit,
        page: 1,
    });
    useEffect(() => {
        if (tagsData?.data?.tags) {
            setTagsLimit(tagsData.data.tags.length || 100);
        }
    }, [tagsData]);
    const tags = tagsData?.data?.tags ?? [];

    // Article Limits
    const limits = [20, 40, 60, 80, 100];

    // Sync URL params to filter states
    useEffect(() => {
        setSearch(searchParams.get("search") || "");
        setSelectedCategory(searchParams.get("category") || "all");
        setSelectedTag(searchParams.get("tag") || "all");
        setSelectedStatus(searchParams.get("status") || "all");
        setSelectedLimit(Number(searchParams.get("limit")) || 20);
    }, [searchParams]);

    // Update URL and reset pagination when a filter changes
    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (!value || value === "all") {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        params.set("page", "1");

        const query = params.toString();

        router.replace(query ? `${pathname}?${query}` : pathname, {
            scroll: false,
        });
    };

    // Shared filter button style
    const filterButtonClass = "flex w-full items-center justify-between gap-2 rounded-lg " + "border border-border bg-gray-100 px-3 py-2.5 text-sm " + "text-heading transition hover:bg-gray-200";

    // Shared dropdown style
    const dropdownClass = "absolute left-0 top-full z-50 mt-2 max-h-64 w-full " + "overflow-y-auto rounded-lg border border-gray-200 bg-white " + "py-1 shadow-lg";
    const optionClass = "w-full px-3 py-2 text-left text-sm text-text transition " + "hover:bg-gray-100";

    // Dropdown refs
    const categoryDropdownRef = useRef<HTMLDivElement>(null);
    const tagDropdownRef = useRef<HTMLDivElement>(null);
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const limitDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node;

            if (!categoryDropdownRef.current?.contains(target)) {
                setCategoryDropdownOpen(false);
            }

            if (!tagDropdownRef.current?.contains(target)) {
                setTagDropdownOpen(false);
            }

            if (!statusDropdownRef.current?.contains(target)) {
                setStatusDropdownOpen(false);
            }

            if (!limitDropdownRef.current?.contains(target)) {
                setLimitDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);




    // Call Get Dashboard Articles API
    const {data: articlesData, isLoading: articlesDataLoading} = useGetDashboardArticlesQuery({
        search,
        category: selectedCategory,
        tag: selectedTag,
        status: selectedStatus,
        limit: selectedLimit,
        page
    })




    // Call Toggle Article Featured Status API
    const [toggleArticleFeaturedStatus, {isLoading: toggleArticleFeaturedStatusLoading}] = useToggleArticleFeaturedStatusMutation()

    // Handle Toggle Article Featured Status
    const handleToggleArticleFeaturedStatus = async (id: string) => {
        try {
            // Hit Toggle Article Featured Status API
            const response = await toggleArticleFeaturedStatus(id).unwrap()

            return responseHandler("S", response?.message)
        } catch (error: any) {
            return responseHandler("E", error?.data?.message)
        }
    }



    // Selected Article To Delete
    const [selectedArticleToDelete, setSelectedArticleToDelete] = useState<any>(null);

    // Call Delete Article API
    const [deleteArticle, {isLoading: deleteArticleLoading}] = useDeleteArticleMutation();

    // Handle Delete Article
    const handleDeleteArticle = async () => {
        if (!selectedArticleToDelete?._id) return;
        try {
            // Hit Delete Article API
            const response = await deleteArticle(selectedArticleToDelete._id).unwrap();

            // Reset State
            setSelectedArticleToDelete(null);

            return responseHandler("S", response?.message || "Article deleted successfully");
        } catch (error: any) {
            return responseHandler("E", error?.data?.message || "Failed to delete article");
        }
    };



    return (
        <div className="min-h-screen space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Title */}
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-semibold text-heading">
                        <FiFileText className="text-primary" size={24} />
                        Articles
                    </h1>
                    <p className="mt-1 text-sm text-text">
                        Manage, organize, and track your news articles
                    </p>
                </div>

                {/* Add Article Button */}
                {canAddArticle && (
                    <button type="button" onClick={() => router.push("/dashboard/articles/add")} className="flex w-max cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover">
                        <FiPlus size={18} />
                        Add Article
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="space-y-4 rounded-xl border border-border bg-white p-4 shadow-sm">
                {/* Search */}
                <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5">
                    <FiSearch className="shrink-0 text-text" />
                    <input
                        type="text"
                        value={search}
                        placeholder="Search articles by title..."
                        onChange={(e) => {
                            setSearch(e.target.value);
                            updateFilter("search", e.target.value);
                        }}
                        className="w-full bg-transparent text-sm text-heading outline-none placeholder:text-text/60"
                    />
                </div>

                {/* Filter dropdowns */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {/* Category */}
                    <div ref={categoryDropdownRef} className="relative">
                        {/* Selected */}
                        <button type="button" onClick={() => setCategoryDropdownOpen((prev) => !prev)} className={filterButtonClass}>
                            <span className="truncate">
                                {categories?.find((item: any) => item?._id === selectedCategory)?.name || "All Categories"}
                            </span>
                            <IoMdArrowDropdown size={18} />
                        </button>

                        {/* Selector */}
                        {categoryDropdownOpen && (
                            <div className={dropdownClass}>
                                {/* All */}
                                <button type="button" className={optionClass} onClick={() => {
                                    setSelectedCategory("all");
                                    updateFilter("category", "all");
                                    setCategoryDropdownOpen(false);
                                }}>
                                    All Categories
                                </button>

                                {categoriesLoading ? (
                                    <p className="px-3 py-2 text-sm text-text">
                                        Loading categories...
                                    </p>
                                ) : (categories.map((category: any) => (
                                    <button key={category?._id} type="button" className={optionClass} onClick={() => {
                                        setSelectedCategory(category?._id);
                                        updateFilter("category", category?._id);
                                        setCategoryDropdownOpen(false);
                                    }}>
                                        {category?.name}
                                    </button>
                                )))}
                            </div>
                        )}
                    </div>

                    {/* Tag */}
                    <div ref={tagDropdownRef} className="relative">
                        {/* Selected */}
                        <button type="button" onClick={() => setTagDropdownOpen((prev) => !prev)} className={filterButtonClass}>
                            <span className="truncate">
                                {tags?.find((item: any) => item?._id === selectedTag)?.name || "All Tags"}
                            </span>
                            <IoMdArrowDropdown size={18} />
                        </button>

                        {/* Selector */}
                        {tagDropdownOpen && (
                            <div className={dropdownClass}>
                                {/* All */}
                                <button type="button" className={optionClass} onClick={() => {
                                    setSelectedTag("all");
                                    updateFilter("tag", "all");
                                    setTagDropdownOpen(false);
                                }}>
                                    All Tags
                                </button>

                                {tagsLoading ? (
                                    <p className="px-3 py-2 text-sm text-text">
                                        Loading tags...
                                    </p>
                                ) : (tags.map((tag: any) => (
                                    <button key={tag?._id} type="button" className={optionClass} onClick={() => {
                                        setSelectedTag(tag?._id);
                                        updateFilter("tag", tag?._id);
                                        setTagDropdownOpen(false);
                                    }}>
                                        {tag?.name}
                                    </button>
                                )))}
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    <div ref={statusDropdownRef} className="relative">
                        {/* Selected */}
                        <button type="button" onClick={() => setStatusDropdownOpen((prev) => !prev)} className={filterButtonClass}>
                            <span>
                                {statuses.find((item) => item?.value === selectedStatus)?.label || "All Status"}
                            </span>
                            <IoMdArrowDropdown size={18} />
                        </button>

                        {/* Selector */}
                        {statusDropdownOpen && (
                            <div className={dropdownClass}>
                                {statuses?.map((status) => (
                                    <button key={status?.value} type="button" className={optionClass} onClick={() => {
                                        setSelectedStatus(status?.value);
                                        updateFilter("status", status?.value);
                                        setStatusDropdownOpen(false);
                                    }}>
                                        {status?.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Limit */}
                    <div ref={limitDropdownRef} className="relative">
                        {/* Selected */}
                        <button type="button" onClick={() => setLimitDropdownOpen((prev) => !prev)} className={filterButtonClass}>
                            <span>{selectedLimit} per page</span>
                            <IoMdArrowDropdown size={18} />
                        </button>

                        {/* Selector */}
                        {limitDropdownOpen && (
                            <div className={dropdownClass}>
                                {limits.map((limit) => (
                                    <button key={limit} type="button" className={optionClass} onClick={() => {
                                        setSelectedLimit(limit);
                                        updateFilter("limit", String(limit));
                                        setLimitDropdownOpen(false);
                                    }}>
                                        {limit} per page
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ARTICLES TABLE */}
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-[1400px] w-full text-xs text-left">
                        {/* HEADER */}
                        <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] tracking-wide border-y border-gray-300">
                            <tr>
                                <th className="px-4 py-3 min-w-72">Article</th>
                                <th className="px-4 py-3 min-w-32 text-center">Reactions</th>
                                <th className="px-4 py-3 min-w-40">Author</th>
                                <th className="px-4 py-3 min-w-40">Categories</th>
                                <th className="px-4 py-3 min-w-36">Tags</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 whitespace-nowrap">Publish At</th>
                                <th className="px-4 py-3 whitespace-nowrap">Created At</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>

                        {/* Items */}
                        <tbody className="divide-y divide-gray-100">
                            {/* LOADING SKELETON */}
                            {articlesDataLoading && Array.from({ length: selectedLimit }).map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                    {/* ARTICLE */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-11 shrink-0 rounded-lg bg-gray-200" />
                                            <div className="space-y-2">
                                                <div className="h-4 w-48 rounded bg-gray-200" />
                                                <div className="h-3 w-32 rounded bg-gray-200" />
                                            </div>
                                        </div>
                                    </td>

                                    {/* REACTIONS */}
                                    <td className="px-4 py-3">
                                        <div className="h-5 w-8 rounded bg-gray-200" />
                                    </td>

                                    {/* AUTHOR */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-gray-200" />
                                            <div className="h-4 w-24 rounded bg-gray-200" />
                                        </div>
                                    </td>

                                    {/* CATEGORIES */}
                                    <td className="px-4 py-3">
                                        <div className="h-5 w-24 rounded bg-gray-200" />
                                    </td>

                                    {/* TAGS */}
                                    <td className="px-4 py-3">
                                        <div className="h-5 w-20 rounded bg-gray-200" />
                                    </td>

                                    {/* STATUS */}
                                    <td className="px-4 py-3">
                                        <div className="h-5 w-20 rounded bg-gray-200" />
                                    </td>

                                    {/* PUBLISH AT */}
                                    <td className="px-4 py-3">
                                        <div className="space-y-2">
                                            <div className="h-4 w-24 rounded bg-gray-200" />
                                            <div className="h-4 w-16 rounded bg-gray-200" />
                                        </div>
                                    </td>

                                    {/* CREATED AT */}
                                    <td className="px-4 py-3">
                                        <div className="h-4 w-24 rounded bg-gray-200" />
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <div className="h-8 w-8 rounded-md bg-gray-200" />
                                            <div className="h-8 w-8 rounded-md bg-gray-200" />
                                            <div className="h-8 w-8 rounded-md bg-gray-200" />
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {/* ARTICLE LIST */}
                            {!articlesDataLoading && articlesData?.data?.articles?.map((article: any, index: number) => {
                                const publishDate = article?.publishAt ? new Date(article.publishAt) : null;
                                const hasValidPublishDate = publishDate && !Number.isNaN(publishDate?.getTime());
                                return (
                                    <tr key={article?._id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} transition hover:bg-blue-50/40`}>
                                        {/* ARTICLE: COVER + TITLE + SLUG */}
                                        <td className="px-4 py-3 flex items-center gap-3">
                                            {/* Featured */}
                                            <button disabled={!["EDITOR", "ADMIN", "SUPER_ADMIN"].includes(user?.role) || toggleArticleFeaturedStatusLoading} onClick={()=>handleToggleArticleFeaturedStatus(article?._id)} className="cursor-pointer">
                                                {article?.isFeatured ? (
                                                    <FiStar size={18} className="fill-yellow-400 text-yellow-400" title="Featured"/>
                                                ) : (
                                                    <FiStar size={18} className="text-gray-400" title="Not featured"/>
                                                )}
                                            </button>

                                            {/* Article Data */}
                                            <div className="flex items-center gap-3 mb-2">
                                                {/* Image */}
                                                <div className="w-14 h-11 shrink-0 overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
                                                    {article?.coverImage?.url ? (
                                                        <img
                                                            src={article?.coverImage?.url}
                                                            alt={article?.coverImage?.altTag || article?.title || "Article cover"}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <FiFileText size={18} className="text-gray-500"/>
                                                    )}
                                                </div>

                                                {/* Title & Slug */}
                                                <div className="min-w-0">
                                                    <p className="max-w-64 truncate text-sm font-semibold text-heading">
                                                        {article?.title || "Untitled Article"}
                                                    </p>
                                                    <p className="mt-1 max-w-64 truncate text-xs text-text">
                                                        {article?.slug || "—"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* REACTIONS */}
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center">
                                                <Reactions
                                                    item={article}
                                                    type="ARTICLE"
                                                    isOwnItem={article?.author?._id?.toString() === user?._id?.toString()}
                                                />
                                            </div>
                                        </td>

                                        {/* AUTHOR */}
                                        <td className="px-4 py-3 text-text">
                                            {/* Image */}
                                            <div className="flex items-center gap-2">
                                                {article?.author?.avatar?.url ? (
                                                    <img
                                                        src={article?.author?.avatar?.url}
                                                        alt={article?.author?.name || "Author"}
                                                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600">
                                                        {(article?.author?.name || "A").charAt(0).toUpperCase()}
                                                    </div>
                                                )}

                                                {/* Name */}
                                                <span className="max-w-32 truncate">
                                                        {article?.author?.name || "Unknown Author"}
                                                    </span>
                                            </div>
                                        </td>

                                        {/* CATEGORIES */}
                                        <td className="px-4 py-3">
                                            <div className="flex max-w-52 flex-wrap gap-1.5">
                                                {article?.categories?.length > 0 ? (
                                                    article?.categories?.map((category: any) => (
                                                        <span key={category?._id} className={`rounded px-2 py-1 text-[10px] font-medium ${category?.isActive ? "bg-primary/10 text-primary" : "bg-red-600/10 text-red-600"}`}>
                                                                {category?.name || "Unnamed"}
                                                            </span>
                                                    ))
                                                ) : (
                                                    <span className="text-text">
                                                            —
                                                        </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* TAGS */}
                                        <td className="px-4 py-3">
                                            <div className="flex max-w-44 flex-wrap gap-1.5">
                                                {article?.tags?.length > 0 ? (
                                                    article?.tags?.map((tag: any) => (
                                                        <span key={tag?._id} className={`rounded px-2 py-1 text-[10px] font-medium ${tag?.isActive ? "bg-gray-200 text-gray-700" : "bg-red-600/10 text-red-600"}`}>
                                                                {tag?.name || "Unnamed"}
                                                            </span>
                                                    ))
                                                ) : (
                                                    <span className="text-text">
                                                            —
                                                        </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* STATUS */}
                                        <td className="px-4 py-3">
                                                <span className={`inline-flex rounded px-2 py-1 text-[10px] font-medium ${article?.status === "PUBLISHED" ? "bg-green-100 text-green-700" : article?.status === "SUBMITTED" ? "bg-blue-100 text-blue-700" : article?.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-gray-200 text-gray-700"}`}>
                                                    {article?.status || "DRAFT"}
                                                </span>
                                        </td>

                                        {/* PUBLISH AT */}
                                        <td className="px-4 py-3 whitespace-nowrap text-text">
                                            {hasValidPublishDate ? (
                                                <div className={`flex flex-col items-start gap-1.5 ${publishDate && publishDate.getTime() <= Date.now() ? "text-green-600" : "text-red-600"}`}>
                                                        <span>
                                                            {publishDate?.toLocaleString("en-GB", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                hour12: true,
                                                            })}
                                                        </span>
                                                </div>
                                            ) : (
                                                "—"
                                            )}
                                        </td>

                                        {/* CREATED AT */}
                                        <td className="px-4 py-3 whitespace-nowrap text-text">
                                            {article?.createdAt ? new Date(article.createdAt).toLocaleDateString() : "—"}
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* VIEW */}
                                                <button type="button" title="View Article" aria-label="View Article" onClick={() => router.push(`/dashboard/articles/view/${article?._id}`)} className="rounded-md border border-gray-200 p-2 text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 cursor-pointer">
                                                    <FiEye size={15} />
                                                </button>

                                                {/* EDIT */}
                                                <button type="button" title="Edit Article" aria-label="Edit Article" onClick={() => router.push(`/dashboard/articles/edit/${article?._id}`)} className="rounded-md border border-gray-200 p-2 text-gray-600 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 cursor-pointer">
                                                    <FiEdit2 size={15} />
                                                </button>

                                                {/* DELETE */}
                                                <button type="button" title="Delete Article" aria-label="Delete Article" onClick={() => setSelectedArticleToDelete(article)} className="rounded-md border border-gray-200 p-2 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer">
                                                    <FiTrash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {/* EMPTY STATE */}
                            {!articlesDataLoading && (articlesData?.data?.articles?.length ?? 0) === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-4 py-12">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            {/* Icon */}
                                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                                <FiFileText size={24} className="text-gray-400"/>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-sm font-semibold text-heading">
                                                No articles found
                                            </h3>

                                            {/* Description */}
                                            <p className="mt-1 max-w-sm text-xs text-text">
                                                There are no articles to display yet.
                                            </p>

                                            {/* Add Button */}
                                            {canAddArticle && (
                                                <button type="button" onClick={() => router.push("/dashboard/articles/add")} className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white transition hover:bg-primary-hover">
                                                    <FiPlus size={15} />
                                                    Add Article
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {(articlesData?.data?.articles?.length ?? 0) > 0 && (
                <Pagination pagination={articlesData?.data?.pagination} />
            )}

            {/* Delete Article Warning */}
            <>
                {/* Delete Article Warning */}
                {selectedArticleToDelete && (
                    <DeleteWarningModal
                        onClose={() => setSelectedArticleToDelete(null)}
                        onConfirm={handleDeleteArticle}
                        loading={deleteArticleLoading}
                    />
                )}
            </>
        </div>
    );
}

export default ArticlesPage;