"use client"
import NewsSidebar from "@/components/user_panel/sidebar/NewsSidebar";
import ArticleComments from "@/components/common/comment/ArticleComments";
import {useGetArticleDetailsQuery} from "@/redux/services/article/articleApi";
import Reactions from "@/components/common/reaction/Reactions";
import {useSelector} from "react-redux";
import Link from "next/link";
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    PinterestShareButton, RedditShareButton,
    XShareButton
} from "react-share";
import {config} from "@/config/config";
import {FaEnvelope, FaFacebookF, FaLinkedinIn, FaXTwitter} from "react-icons/fa6";
import {FaExclamationTriangle, FaPinterestP, FaRedditAlien, FaRedo, FaRegNewspaper} from "react-icons/fa";
import MoreNews from "@/components/user_panel/articleDetails/sections/MoreNews";

function ArticleDetails({slug}: any) {

    // User From Redux
    const {user} = useSelector((state: any) => state.Auth)

    // Call Get Article Details API
    const {data: articleDetailsData, isLoading: articleDetailsLoading, isError: articleDetailsError, refetch} = useGetArticleDetailsQuery(slug)
    const article = articleDetailsData?.data?.article

    // Share Data
    const itemUrl: string = `${config.frontendUrl}/articles/${slug}`
    const itemImageUrl = article?.coverImage?.url

    // Get article's first category slug
    const categorySlug = article?.categories?.[0]?.slug;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="base-container px-4 py-8 sm:px-8 lg:px-10 flex flex-col items-start gap-8 lg:flex-row">
                {/* Article Details Section */}
                <section className="w-full min-w-0 flex-1">
                    {articleDetailsLoading ? (
                        <div className="animate-pulse overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
                            {/* Header */}
                            <div className="p-5 sm:p-8">
                                {/* Categories */}
                                <div className="mb-6 flex gap-2">
                                    <div className="h-6 w-20 rounded bg-slate-200" />
                                    <div className="h-6 w-24 rounded bg-slate-200" />
                                </div>

                                {/* Title */}
                                <div className="space-y-3">
                                    <div className="h-8 w-full rounded bg-slate-200" />
                                    <div className="h-8 w-4/5 rounded bg-slate-200" />
                                </div>

                                {/* Excerpt */}
                                <div className="mt-6 space-y-2">
                                    <div className="h-4 w-full rounded bg-slate-100" />
                                    <div className="h-4 w-11/12 rounded bg-slate-100" />
                                    <div className="h-4 w-3/4 rounded bg-slate-100" />
                                </div>

                                {/* Author & Date */}
                                <div className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-5">
                                    <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />
                                    <div className="space-y-2">
                                        <div className="h-3 w-20 rounded bg-slate-200" />
                                        <div className="h-4 w-32 rounded bg-slate-200" />
                                    </div>
                                    <div className="ml-6 space-y-2">
                                        <div className="h-3 w-20 rounded bg-slate-200" />
                                        <div className="h-4 w-28 rounded bg-slate-200" />
                                    </div>
                                </div>
                            </div>

                            {/* Cover Image */}
                            <div className="px-5 sm:px-8">
                                <div className="h-64 w-full rounded bg-slate-200 sm:h-96" />
                            </div>

                            {/* Article Content */}
                            <div className="space-y-4 p-5 sm:p-8">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <div key={index} className="h-4 rounded bg-slate-100" style={{width: `${index % 3 === 0 ? "100%" : index % 3 === 1 ? "90%" : "75%"}`}}/>
                                ))}
                            </div>
                        </div>
                    ) : articleDetailsError ? (
                        <div className="flex min-h-[400px] flex-col items-center justify-center rounded border border-slate-200 bg-white px-5 py-12 text-center">
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                                <FaExclamationTriangle size={26} />
                            </div>

                            <h2 className="text-xl font-bold text-slate-900">
                                Something Went Wrong
                            </h2>

                            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                                We couldn't load this article. Please check your internet connection and try again.
                            </p>

                            <button onClick={refetch} className="mt-6 inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                                <FaRedo size={13} />
                                Try Again
                            </button>
                        </div>
                    ) : (!articleDetailsLoading && !article) ? (
                        <div className="flex min-h-[400px] flex-col items-center justify-center rounded border border-slate-200 bg-white px-5 py-12 text-center">
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <FaRegNewspaper size={28} />
                            </div>

                            <h2 className="text-xl font-bold text-slate-900">
                                Article Not Found
                            </h2>

                            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                                Sorry, the article you're looking for doesn't exist or may have been removed.
                            </p>

                            <Link href="/articles" className="mt-6 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                                Explore Articles
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Article Data */}
                            <div>
                                {/* Article Data */}
                                <div className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
                                    {/* Article Header */}
                                    <div className="p-5 sm:p-8">
                                        {/* Categories */}
                                        {article?.categories?.length > 0 && (
                                            <div className="mb-5 flex flex-wrap gap-2">
                                                {article?.categories?.map((category: any) => (
                                                    <Link key={category?._id} href={`/articles?category=${category?.slug}`} className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100">
                                                        {category?.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {/* Title */}
                                        <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-[38px]">
                                            {article?.title}
                                        </h1>

                                        {/* Excerpt */}
                                        {article?.excerpt && (
                                            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                                                {article?.excerpt}
                                            </p>
                                        )}

                                        {/* Author & Publish Date */}
                                        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-100 pt-5">
                                            {/* Author */}
                                            <div className="flex items-center gap-3">
                                                {/* Image */}
                                                {article?.author?.avatar?.url ? (
                                                    <img
                                                        src={article?.author?.avatar?.url}
                                                        alt={article?.author?.name}
                                                        className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                                                        {article?.author?.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                )}

                                                {/* Name */}
                                                <div>
                                                    <p className="text-xs text-slate-500">
                                                        Written by
                                                    </p>
                                                    <p className="mt-0.5 text-sm font-semibold text-slate-800">
                                                        {article?.author?.name}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Publish Date / Created Date */}
                                            {(article?.publishAt || article?.createdAt) && (
                                                <div className="flex flex-col gap-0.5">
                                                    {/* Label */}
                                                    <p className="text-xs text-slate-500">
                                                        {article?.publishAt ? "Published on" : "Created on"}
                                                    </p>

                                                    {/* Date */}
                                                    <p className="text-sm font-medium text-slate-700">
                                                        {new Date(article.publishAt || article.createdAt).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric"
                                                        })}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Cover Image */}
                                    {article?.coverImage?.url && (
                                        <figure className="px-5 sm:px-8">
                                            <img
                                                src={article?.coverImage?.url}
                                                alt={article?.coverImage?.altTag || article?.title}
                                                className="max-h-[550px] w-full rounded object-cover"
                                            />
                                        </figure>
                                    )}

                                    {/* Article Content */}
                                    {article?.content && (
                                        <div className="px-5 pb-6 pt-2 sm:px-8 sm:pb-8" dangerouslySetInnerHTML={{__html: article.content}}/>
                                    )}

                                    {/* Tags */}
                                    {article?.tags?.length > 0 && (
                                        <div className="mx-5 flex flex-wrap items-center gap-2 border-t border-slate-100 py-6 sm:mx-8">
                                            {/* Label */}
                                            <span className="mr-1 text-sm font-semibold text-slate-700">
                                        Topics:
                                    </span>

                                            {/* Tags */}
                                            {article?.tags?.map((tag: any) => (
                                                <Link key={tag?._id} href={`/articles?tag=${tag?.slug}`} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                                                    #{tag?.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Share Buttons & Reaction */}
                                <div className="flex items-start justify-between gap-6 flex-wrap mt-6">
                                    {/* Share Buttons */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Email */}
                                        <EmailShareButton url={itemUrl}>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                                                <FaEnvelope size={17} />
                                            </div>
                                        </EmailShareButton>

                                        {/* Facebook */}
                                        <FacebookShareButton url={itemUrl}>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#1877F2] transition hover:border-blue-200 hover:bg-blue-50">
                                                <FaFacebookF size={17} />
                                            </div>
                                        </FacebookShareButton>

                                        {/* X */}
                                        <XShareButton url={itemUrl}>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 transition hover:border-slate-400 hover:bg-slate-100">
                                                <FaXTwitter size={17} />
                                            </div>
                                        </XShareButton>

                                        {/* LinkedIn */}
                                        <LinkedinShareButton url={itemUrl}>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#0A66C2] transition hover:border-blue-200 hover:bg-blue-50">
                                                <FaLinkedinIn size={17} />
                                            </div>
                                        </LinkedinShareButton>

                                        {/* Pinterest */}
                                        <PinterestShareButton url={itemUrl} media={itemImageUrl}>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#E60023] transition hover:border-red-200 hover:bg-red-50">
                                                <FaPinterestP size={17} />
                                            </div>
                                        </PinterestShareButton>

                                        {/* Reddit */}
                                        <RedditShareButton url={itemUrl}>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#FF4500] transition hover:border-orange-200 hover:bg-orange-50">
                                                <FaRedditAlien size={17} />
                                            </div>
                                        </RedditShareButton>
                                    </div>

                                    {/* Reaction */}
                                    <div>
                                        <Reactions
                                            item={article}
                                            isOwnItem={user && article?.author?._id?.toString() === user?._id?.toString()}
                                            type="ARTICLE"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* More Articles */}
                            <MoreNews categorySlug={categorySlug} />

                            {/* Comment */}
                            <ArticleComments articleId={article?._id?.toString()}/>
                        </>
                    )}
                </section>

                {/* Sidebar */}
                <aside className="sticky top-0 w-full shrink-0 lg:w-90">
                    <NewsSidebar />
                </aside>
            </div>
        </div>
    )
}

export default ArticleDetails;