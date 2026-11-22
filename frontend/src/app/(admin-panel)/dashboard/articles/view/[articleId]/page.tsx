"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
    FiArrowLeft,
    FiArrowUpRight,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiCopy,
    FiExternalLink,
    FiEye,
    FiFileText,
    FiGlobe,
    FiHash,
    FiImage,
    FiMessageCircle,
    FiRefreshCw,
    FiSearch,
    FiShield,
    FiStar,
    FiTag,
    FiUser,
    FiXCircle,
    FiEdit2, FiCheck, FiX,
} from "react-icons/fi";
import {
    useGetDashboardArticleDetailsQuery,
    useUpdateArticleReviewStatusMutation,
} from "@/redux/services/article/articleApi";
import {responseHandler} from "@/utils/responseHandler";
import {useSelector} from "react-redux";
import ArticleComments from "@/components/common/comment/ArticleComments";
import Reactions from "@/components/common/reaction/Reactions";

function DashboardArticleDetailsPage() {

    // Get current authenticated user
    const {user} = useSelector((state: any) => state.Auth);



    // Get article ID from route params
    const {articleId}: any = useParams();

    // Copy state
    const [copied, setCopied] = useState(false);



    // Fetch article details
    const {data: response, isLoading, isFetching, isError, refetch}: any = useGetDashboardArticleDetailsQuery(articleId, {
        skip: !articleId,
    });



    // Review Status Mutation
    const [updateArticleReviewStatus, {isLoading: isReviewing}] = useUpdateArticleReviewStatusMutation();

    // Handle Article Review
    const handleArticleReview = async (status: "PUBLISHED" | "REJECTED") => {
        try {
            // Hit API
            const response = await updateArticleReviewStatus({
                id: articleId,
                status,
            }).unwrap();

            return responseHandler("S", response?.message)
        } catch (error: any) {
            return responseHandler("E", error?.data?.message || "Failed to update article status.");
        }
    };



    // Loading state
    if (isLoading) {
        return (
            <main className="min-h-screen bg-slate-50/80">
                <div className="mx-auto max-w-[1440px] space-y-6 p-4 sm:p-6 lg:p-8 animate-pulse">
                    {/* Breadcrumb & Back Button */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="h-4 w-56 rounded bg-slate-200" />
                        <div className="h-10 w-32 rounded-xl bg-white ring-1 ring-slate-200" />
                    </div>

                    {/* Page Heading */}
                    <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                        <div className="min-w-0 flex-1 space-y-4">
                            <div className="flex gap-2">
                                <div className="h-7 w-24 rounded-full bg-slate-200" />
                                <div className="h-7 w-24 rounded-full bg-slate-200" />
                            </div>

                            <div className="h-9 max-w-2xl rounded-lg bg-slate-200 sm:h-11" />
                            <div className="h-4 max-w-xl rounded bg-slate-200" />
                        </div>

                        <div className="flex gap-2">
                            <div className="h-11 w-36 rounded-xl bg-slate-200" />
                            <div className="h-11 w-28 rounded-xl bg-white ring-1 ring-slate-200" />
                        </div>
                    </header>

                    {/* Main Layout */}
                    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                        {/* Left Content */}
                        <div className="min-w-0 space-y-6">
                            {/* Cover Image */}
                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                                    <div className="h-5 w-28 rounded bg-slate-200" />
                                    <div className="h-4 w-28 rounded bg-slate-100" />
                                </div>

                                <div className="p-4 sm:p-5">
                                    <div className="aspect-[16/9] w-full rounded-xl bg-slate-200" />

                                    <div className="mt-5 space-y-2">
                                        <div className="h-3 w-28 rounded bg-slate-200" />
                                        <div className="h-4 max-w-lg rounded bg-slate-100" />
                                    </div>
                                </div>
                            </section>

                            {/* Article Overview */}
                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                                    <div className="h-5 w-5 rounded bg-slate-200" />
                                    <div className="h-5 w-36 rounded bg-slate-200" />
                                </div>

                                <div className="space-y-6 p-5">
                                    {/* Excerpt */}
                                    <div className="space-y-3">
                                        <div className="h-3 w-20 rounded bg-slate-200" />
                                        <div className="h-4 w-full rounded bg-slate-100" />
                                        <div className="h-4 w-4/5 rounded bg-slate-100" />
                                    </div>

                                    {/* Full Content */}
                                    <div className="space-y-4 border-t border-slate-100 pt-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="h-3 w-40 rounded bg-slate-200" />
                                            <div className="h-6 w-16 rounded-lg bg-slate-100" />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="h-4 w-full rounded bg-slate-100" />
                                            <div className="h-4 w-full rounded bg-slate-100" />
                                            <div className="h-4 w-11/12 rounded bg-slate-100" />
                                            <div className="h-4 w-full rounded bg-slate-100" />
                                            <div className="h-4 w-4/5 rounded bg-slate-100" />
                                        </div>

                                        <div className="h-40 rounded-xl bg-slate-100" />

                                        <div className="space-y-3">
                                            <div className="h-4 w-full rounded bg-slate-100" />
                                            <div className="h-4 w-11/12 rounded bg-slate-100" />
                                            <div className="h-4 w-3/4 rounded bg-slate-100" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Categories & Tags */}
                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                                    <div className="h-5 w-5 rounded bg-slate-200" />
                                    <div className="h-5 w-36 rounded bg-slate-200" />
                                </div>

                                <div className="space-y-6 p-5">
                                    <div className="space-y-3">
                                        <div className="h-3 w-24 rounded bg-slate-200" />
                                        <div className="flex flex-wrap gap-2">
                                            <div className="h-9 w-28 rounded-lg bg-slate-100" />
                                            <div className="h-9 w-32 rounded-lg bg-slate-100" />
                                            <div className="h-9 w-24 rounded-lg bg-slate-100" />
                                        </div>
                                    </div>

                                    <div className="space-y-3 border-t border-slate-100 pt-5">
                                        <div className="h-3 w-12 rounded bg-slate-200" />
                                        <div className="flex flex-wrap gap-2">
                                            <div className="h-9 w-24 rounded-lg bg-slate-100" />
                                            <div className="h-9 w-28 rounded-lg bg-slate-100" />
                                            <div className="h-9 w-20 rounded-lg bg-slate-100" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* SEO Metadata */}
                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                                    <div className="h-5 w-5 rounded bg-slate-200" />
                                    <div className="h-5 w-52 rounded bg-slate-200" />
                                </div>

                                <div className="space-y-5 p-5">
                                    <div className="space-y-3">
                                        <div className="h-3 w-24 rounded bg-slate-200" />
                                        <div className="h-4 w-3/4 rounded bg-slate-100" />
                                    </div>

                                    <div className="space-y-3 border-t border-slate-100 pt-4">
                                        <div className="h-3 w-32 rounded bg-slate-200" />
                                        <div className="h-4 w-full rounded bg-slate-100" />
                                        <div className="h-4 w-4/5 rounded bg-slate-100" />
                                    </div>

                                    <div className="space-y-3 border-t border-slate-100 pt-4">
                                        <div className="h-3 w-28 rounded bg-slate-200" />
                                        <div className="flex flex-wrap gap-2">
                                            <div className="h-7 w-24 rounded-md bg-slate-100" />
                                            <div className="h-7 w-28 rounded-md bg-slate-100" />
                                            <div className="h-7 w-20 rounded-md bg-slate-100" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Comments */}
                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                                    <div className="h-5 w-28 rounded bg-slate-200" />
                                    <div className="h-8 w-20 rounded-lg bg-slate-100" />
                                </div>

                                <div className="space-y-5 p-5">
                                    {[1, 2, 3].map((item) => (
                                        <div key={item} className="flex gap-3">
                                            <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />
                                            <div className="min-w-0 flex-1 space-y-3">
                                                <div className="flex gap-3">
                                                    <div className="h-4 w-28 rounded bg-slate-200" />
                                                    <div className="h-4 w-20 rounded bg-slate-100" />
                                                </div>
                                                <div className="h-4 w-full rounded bg-slate-100" />
                                                <div className="h-4 w-3/4 rounded bg-slate-100" />
                                                <div className="flex gap-2 pt-1">
                                                    <div className="h-8 w-16 rounded-md bg-slate-100" />
                                                    <div className="h-8 w-16 rounded-md bg-slate-100" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Sidebar */}
                        <aside className="space-y-6">
                            {/* Editorial Review */}
                            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-4 h-5 w-32 rounded bg-slate-200" />
                                <div className="space-y-3">
                                    <div className="h-11 w-full rounded-xl bg-slate-200" />
                                    <div className="h-11 w-full rounded-xl bg-slate-100" />
                                </div>
                                <div className="mt-4 h-3 w-full rounded bg-slate-100" />
                            </section>

                            {/* Article Information */}
                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                                    <div className="h-5 w-5 rounded bg-slate-200" />
                                    <div className="h-5 w-36 rounded bg-slate-200" />
                                </div>

                                <div className="space-y-6 p-5">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <div key={item} className="flex gap-3">
                                            <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-100" />
                                            <div className="flex-1 space-y-2 pt-1">
                                                <div className="h-3 w-24 rounded bg-slate-100" />
                                                <div className="h-4 w-32 max-w-full rounded bg-slate-200" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Author Information */}
                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                                    <div className="h-5 w-5 rounded bg-slate-200" />
                                    <div className="h-5 w-36 rounded bg-slate-200" />
                                </div>

                                <div className="flex items-center gap-3 p-5">
                                    <div className="h-12 w-12 shrink-0 rounded-full bg-slate-200" />
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="h-4 w-32 max-w-full rounded bg-slate-200" />
                                        <div className="h-3 w-40 max-w-full rounded bg-slate-100" />
                                    </div>
                                </div>
                            </section>

                            {/* Article URL */}
                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                                    <div className="h-5 w-5 rounded bg-slate-200" />
                                    <div className="h-5 w-24 rounded bg-slate-200" />
                                </div>

                                <div className="space-y-3 p-5">
                                    <div className="h-3 w-20 rounded bg-slate-200" />
                                    <div className="h-16 rounded-xl bg-slate-100" />
                                    <div className="h-10 rounded-xl bg-slate-100" />
                                    <div className="h-10 rounded-xl bg-slate-200" />
                                </div>
                            </section>
                        </aside>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="space-y-2">
                            <div className="h-4 w-36 rounded bg-slate-200" />
                            <div className="h-3 w-56 max-w-full rounded bg-slate-100" />
                        </div>
                        <div className="h-10 w-36 rounded-xl bg-slate-100" />
                    </div>
                </div>
            </main>
        );
    }

    // Error state
    if (isError || !response?.data?.article) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 p-5">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    {/* Icon */}
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                        <FiFileText size={28} />
                    </div>

                    {/* Title */}
                    <h1 className="mt-5 text-xl font-bold text-slate-900">
                        Article unavailable
                    </h1>

                    {/* Description */}
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        We couldn't load this article. It may not exist, or you may not
                        have permission to access it.
                    </p>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        {/* Refetch Button */}
                        <button type="button" onClick={() => refetch()} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800">
                            <FiRefreshCw size={15} />
                            Try again
                        </button>

                        {/* Articles */}
                        <Link href="/dashboard/articles" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                            <FiArrowLeft size={16} />
                            Back to articles
                        </Link>
                    </div>
                </div>
            </main>
        );
    }


    return (
        <main className="min-h-screen bg-slate-50/80">
            <div className="mx-auto max-w-[1440px] space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Breadcrumb */}
                    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <Link href="/dashboard" className="transition hover:text-blue-700">
                            Dashboard
                        </Link>

                        <span>/</span>

                        <Link href="/dashboard/articles" className="transition hover:text-blue-700">
                            Articles
                        </Link>

                        <span>/</span>

                        <span className="font-semibold text-slate-800">Details</span>
                    </nav>

                    {/* All Articles */}
                    <Link href="/dashboard/articles" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
                        <FiArrowLeft size={16} />
                        All articles
                    </Link>
                </div>

                {/* Page heading */}
                <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    {/* Article Title */}
                    <div className="min-w-0">
                        {/* Badge */}
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            {/* Status Badge */}
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${response.data.article.status === "PUBLISHED" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : response.data.article.status === "REJECTED" ? "border-red-200 bg-red-50 text-red-700" : response.data.article.status === "SUBMITTED" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-slate-200 bg-slate-100 text-slate-700"}`}>
                                {/* Icon */}
                                {response.data.article.status === "PUBLISHED" ? (
                                    <FiCheckCircle size={14} />
                                ) : response.data.article.status === "REJECTED" ? (
                                    <FiXCircle size={14} />
                                ) : (
                                    <FiClock size={14} />
                                )}

                                {/* Status */}
                                {response?.data?.article?.status}
                            </span>

                            {/* Is Featured */}
                            {response?.data?.article?.isFeatured && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
                                    <FiStar size={14} />
                                    Featured
                                </span>
                            )}

                            {/* Fetching */}
                            {isFetching && (
                                <span className="text-xs font-medium text-slate-400">
                                    Refreshing...
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="max-w-4xl text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
                            {response?.data?.article?.title}
                        </h1>

                        {/* Desc */}
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
                            Review article content, editorial status, publishing
                            information, and SEO metadata in one place.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-wrap gap-2">
                        {/* Edit */}
                        <Link href={`/dashboard/articles/edit/${response.data.article._id}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800">
                            <FiEdit2 size={16} />
                            Edit article
                        </Link>

                        {/* View Article */}
                        {response?.data?.article?.status === "PUBLISHED" && (
                            <Link href={`/articles/${response?.data?.article?.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                                <FiExternalLink size={16} />
                                View live
                            </Link>
                        )}
                    </div>
                </header>

                {/* Main layout */}
                <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                    {/* Left content */}
                    <div className="min-w-0 space-y-6">
                        {/* Cover image */}
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            {/* Title */}
                            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                                <div className="flex items-center gap-2.5">
                                    <FiImage size={18} className="text-blue-700" />
                                    <h2 className="text-sm font-bold text-slate-900">
                                        Cover image
                                    </h2>
                                </div>
                                <span className="text-xs font-medium text-slate-400">
                                    Article thumbnail
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-4 sm:p-5">
                                {/* Image */}
                                <div className="overflow-hidden rounded-xl bg-slate-100">
                                    <div className="aspect-[16/9] w-full">
                                        {response?.data?.article.coverImage?.url ? (
                                            <img
                                                src={response?.data?.article?.coverImage?.url}
                                                alt={response?.data?.article?.coverImage?.altTag || response?.data?.article?.title || "Article cover"}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-slate-400">
                                                <FiImage size={42} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Alt Text & Reactions */}
                                <div className="flex gap-4 flex-wrap justify-between">
                                    {/* Alt Text */}
                                    <div className="mt-4 flex items-start gap-3">
                                        {/* Icon */}
                                        <FiEye size={18} className="mt-0.5 shrink-0 text-slate-500"/>

                                        {/* Title & Content */}
                                        <div className="min-w-0">
                                            {/* Title */}
                                            <p className="text-xs font-semibold text-slate-500">
                                                Alternative text
                                            </p>

                                            {/* Content */}
                                            <p className="mt-1 break-words text-sm leading-6 text-slate-700">
                                                {response.data.article.coverImage?.altTag || "No alternative text added"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Reactions */}
                                    <Reactions
                                        item={response?.data?.article}
                                        type={"ARTICLE"}
                                        isOwnItem={response?.data?.article?.author?._id?.toString() === user?._id?.toString()}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Article overview */}
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            {/* Title */}
                            <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
                                <FiFileText size={18} className="text-blue-700" />
                                <h2 className="text-sm font-bold text-slate-900">
                                    Article overview
                                </h2>
                            </div>

                            {/* Details Content */}
                            <div className="space-y-6 p-5">
                                {/* Excerpt */}
                                <div>
                                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Excerpt
                                    </p>
                                    <p className="text-sm leading-7 text-slate-700">
                                        {response?.data?.article?.excerpt || "No excerpt added for this article."}
                                    </p>
                                </div>

                                {/* Description Content */}
                                <div className="border-t border-slate-100 pt-5">
                                    {/* Title */}
                                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Full article content
                                        </p>
                                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                                            Rich text
                                        </span>
                                    </div>

                                    {/* Sanitize article HTML before rendering */}
                                    <div className="prose prose-slate max-w-none break-words text-sm leading-7 prose-headings:font-bold prose-a:text-blue-700 prose-img:rounded-xl" dangerouslySetInnerHTML={{__html: response?.data?.article?.content || "<p>No content available.</p>"}}/>
                                </div>
                            </div>
                        </section>

                        {/* Categories and tags */}
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            {/* Section Title */}
                            <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
                                <FiTag size={18} className="text-blue-700" />
                                <h2 className="text-sm font-bold text-slate-900">
                                    Categories & tags
                                </h2>
                            </div>

                            {/* Categories & Tags */}
                            <div className="space-y-6 p-5">
                                {/* Categories */}
                                <div>
                                    {/* Title */}
                                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Categories
                                    </p>

                                    {/* Items */}
                                    {response?.data?.article?.categories?.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {response?.data?.article?.categories?.map((category: any, index: number) => (
                                                <span key={category?._id ?? category?.slug ?? index} className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800">
                                                    {category?.name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400">
                                            No categories assigned.
                                        </p>
                                    )}
                                </div>

                                {/* Tags */}
                                <div className="border-t border-slate-100 pt-5">
                                    {/* Title */}
                                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Tags
                                    </p>

                                    {/* Items */}
                                    {response?.data?.article?.tags?.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {response?.data?.article?.tags?.map((tag: any, index: number) => (
                                                <span key={tag?._id ?? tag?.slug ?? index} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                                                    <FiHash size={13} className="text-slate-400" />
                                                    {tag?.name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400">
                                            No tags assigned.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* SEO metadata */}
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            {/* Section Title */}
                            <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
                                <FiSearch size={18} className="text-blue-700" />
                                <h2 className="text-sm font-bold text-slate-900">
                                    Search engine optimization
                                </h2>
                            </div>

                            {/* Meta Data */}
                            <div className="space-y-5 p-5">
                                {/* Meta Title */}
                                <div>
                                    {/* Title */}
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Meta title
                                    </p>

                                    {/* Data */}
                                    <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-800">
                                        {response?.data?.article?.metaTitle || "No meta title configured"}
                                    </p>
                                </div>

                                {/* Meta Descripion */}
                                <div className="border-t border-slate-100 pt-4">
                                    {/* Title */}
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Meta description
                                    </p>

                                    {/* Data */}
                                    <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                                        {response?.data?.article?.metaDescription || "No meta description configured"}
                                    </p>
                                </div>

                                {/* Meta Keywords */}
                                <div className="border-t border-slate-100 pt-4">
                                    {/* Title */}
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Meta keywords
                                    </p>

                                    {/* Data */}
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {response?.data?.article?.metaKeywords?.length > 0 ? (response?.data?.article?.metaKeywords?.map((keyword: any, index: number) => (
                                            <span key={`${keyword}-${index}`} className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                                                {keyword}
                                            </span>
                                        ))) : (
                                            <span className="text-sm text-slate-400">
                                                No keywords configured
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Show Comments */}
                        <ArticleComments articleId={articleId} />
                    </div>

                    {/* Right sidebar */}
                    <aside className="space-y-6">
                        {/* Editorial Review Actions */}
                        {["EDITOR", "ADMIN", "SUPER_ADMIN"].includes(user?.role) && response?.data?.article?.status === "SUBMITTED" && (
                            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                {/* Section Title */}
                                <h2 className="mb-4 text-sm font-bold text-slate-900">
                                    Editorial Review
                                </h2>

                                {/* Buttons */}
                                <div className="flex flex-col gap-3">
                                    {/* Approve */}
                                    <button type="button" disabled={isReviewing} onClick={() => handleArticleReview("PUBLISHED")} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer">
                                        <FiCheck size={16} />
                                        {isReviewing ? "Processing..." : "Approve & Publish"}
                                    </button>

                                    {/* Reject */}
                                    <button type="button" disabled={isReviewing} onClick={() => handleArticleReview("REJECTED")} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer">
                                        <FiX size={16} />
                                        {isReviewing ? "Processing..." : "Reject Article"}
                                    </button>
                                </div>

                                {/* Helper Text */}
                                <p className="mt-3 text-xs leading-5 text-slate-500">
                                    Approving publishes the article. Rejecting marks it as rejected.
                                </p>
                            </section>
                        )}

                        {/* Article information */}
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            {/* Section Title */}
                            <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
                                <FiShield size={18} className="text-blue-700" />
                                <h2 className="text-sm font-bold text-slate-900">
                                    Article information
                                </h2>
                            </div>

                            {/* Informations */}
                            <div className="space-y-5 p-5">
                                {/* Created AT */}
                                <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-200">
                                        <FiCalendar size={17} />
                                    </div>

                                    {/* Created Data */}
                                    <div className="min-w-0 flex-1 pt-0.5">
                                        {/* Title */}
                                        <p className="text-xs font-medium text-slate-500">
                                            Created on
                                        </p>

                                        {/* Data */}
                                        <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-800">
                                            {response?.data?.article?.createdAt ? Number.isNaN(new Date(response?.data?.article?.createdAt).getTime()) ? "Unavailable" : new Intl.DateTimeFormat("en-US", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }).format(new Date(response?.data?.article?.createdAt)) : "Unavailable"}
                                        </p>
                                    </div>
                                </div>

                                {/* Updated At */}
                                <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-200">
                                        <FiClock size={17} />
                                    </div>

                                    {/* Updated Data */}
                                    <div className="min-w-0 flex-1 pt-0.5">
                                        {/* Title */}
                                        <p className="text-xs font-medium text-slate-500">
                                            Last updated
                                        </p>

                                        {/* Data */}
                                        <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-800">
                                            {response?.data?.article?.updatedAt ? Number.isNaN(new Date(response?.data?.article?.updatedAt).getTime()) ? "Unavailable" : new Intl.DateTimeFormat("en-US", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }).format(new Date(response?.data?.article?.updatedAt)) : "Unavailable"}
                                        </p>
                                    </div>
                                </div>

                                {/* Publish At */}
                                <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-200">
                                        <FiCalendar size={17} />
                                    </div>

                                    {/* Publish Data */}
                                    <div className="min-w-0 flex-1 pt-0.5">
                                        {/* Title */}
                                        <p className="text-xs font-medium text-slate-500">
                                            Publish date
                                        </p>

                                        {/* Data */}
                                        <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-800">
                                            {response?.data?.article?.publishAt ? Number.isNaN(new Date(response?.data?.article?.publishAt).getTime()) ? "Unavailable" : new Intl.DateTimeFormat("en-US", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }).format(new Date(response?.data?.article?.publishAt)) : "Not scheduled"}
                                        </p>
                                    </div>
                                </div>

                                {/* Comment Status */}
                                <div className="border-t border-slate-100 pt-5">
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-200">
                                            <FiMessageCircle size={17} />
                                        </div>

                                        {/* Data */}
                                        <div className="min-w-0 flex-1 pt-0.5">
                                            {/* Title */}
                                            <p className="text-xs font-medium text-slate-500">
                                                Comments
                                            </p>

                                            {/* Data */}
                                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                                {response?.data?.article?.allowComments ? "Enabled" : "Disabled"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Featured Status */}
                                <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-200">
                                        <FiStar size={17} />
                                    </div>

                                    {/* Data */}
                                    <div className="min-w-0 flex-1 pt-0.5">
                                        {/* Title */}
                                        <p className="text-xs font-medium text-slate-500">
                                            Featured article
                                        </p>

                                        {/* Data */}
                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            {response?.data?.article?.isFeatured ? "Yes" : "No"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Author information */}
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            {/* Section Title */}
                            <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
                                <FiUser size={18} className="text-blue-700" />
                                <h2 className="text-sm font-bold text-slate-900">
                                    Author information
                                </h2>
                            </div>

                            {/* Information */}
                            <div className="p-5">
                                <div className="flex items-center gap-3">
                                    {/* Image */}
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                                        {typeof response?.data?.article?.author?.avatar === "string" ? (
                                            <img
                                                src={response?.data?.article?.author?.avatar}
                                                alt={response.data.article.author.name || "Author"}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : response?.data?.article?.author?.avatar?.url ? (
                                            <img
                                                src={response?.data?.article?.author?.avatar?.url}
                                                alt={response?.data?.article?.author?.name || "Author"}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <FiUser size={22} />
                                        )}
                                    </div>

                                    {/* Data */}
                                    <div className="min-w-0">
                                        {/* Name */}
                                        <p className="truncate text-sm font-bold text-slate-900">
                                            {response?.data?.article?.author?.name || "Unknown author"}
                                        </p>

                                        {/* Email */}
                                        <p className="mt-1 break-all text-xs leading-5 text-slate-500">
                                            {response?.data?.article?.author?.email || "No email available"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Article URL */}
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            {/* Section Title */}
                            <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
                                <FiGlobe size={18} className="text-blue-700" />
                                <h2 className="text-sm font-bold text-slate-900">
                                    Article URL
                                </h2>
                            </div>

                            {/* Data */}
                            <div className="p-5">
                                {/* Title */}
                                <p className="mb-3 text-xs font-medium text-slate-500">
                                    URL slug
                                </p>

                                {/* Url */}
                                <div className="break-all rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                                    /articles/{response?.data?.article?.slug}
                                </div>

                                {/* Copy slug inline */}
                                <button type="button" onClick={async () => {
                                    if (!response?.data?.article?.slug) return;
                                    try {
                                        await navigator.clipboard.writeText(response?.data?.article?.slug);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 1800);
                                    } catch {
                                        setCopied(false);
                                    }
                                }} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                                    {copied ? (
                                        <FiCheckCircle size={16} />
                                    ) : (
                                        <FiCopy size={16} />
                                    )}
                                    {copied ? "Slug copied" : "Copy slug"}
                                </button>

                                {/* View Article */}
                                {response?.data.article.status === "PUBLISHED" && (
                                    <Link href={`/articles/${response.data.article.slug}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                                        Open published article
                                        <FiArrowUpRight size={16} />
                                    </Link>
                                )}
                            </div>
                        </section>

                        {/* Editorial feedback */}
                        {response?.data?.article?.status === "REJECTED" && response?.data?.article?.reviewNote && (
                            <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
                                {/* Section Title */}
                                <div className="flex items-center gap-2">
                                    <FiXCircle size={18} className="shrink-0 text-red-600"/>
                                    <h2 className="text-sm font-bold text-red-900">
                                        Editorial feedback
                                    </h2>
                                </div>

                                {/* Data */}
                                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-red-800">
                                    {response?.data?.article?.reviewNote}
                                </p>
                            </section>
                        )}
                    </aside>
                </div>

                {/* Bottom navigation */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    {/* Section Title */}
                    <div>
                        <p className="text-sm font-bold text-slate-900">
                            Finished reviewing?
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Return to your article management dashboard.
                        </p>
                    </div>

                    {/* Articles */}
                    <Link href="/dashboard/articles" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                        <FiArrowLeft size={16} />
                        Back to articles
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default DashboardArticleDetailsPage;