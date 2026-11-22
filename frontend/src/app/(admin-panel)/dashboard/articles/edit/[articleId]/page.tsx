"use client"
import {useDispatch, useSelector} from "react-redux";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {useGetCategoriesQuery} from "@/redux/services/category/categoryApi";
import {useGetTagsQuery} from "@/redux/services/tag/tagApi";
import {useGetDashboardArticleDetailsQuery, useUpdateArticleMutation} from "@/redux/services/article/articleApi";
import {zodErrorHandler} from "@/utils/zodErrorHandler";
import {responseHandler} from "@/utils/responseHandler";
import {updateArticleSchema} from "@/validation/article.validation";
import {FiArrowLeft, FiChevronDown, FiChevronRight, FiFileText, FiImage} from "react-icons/fi";
import {handleCancelMediaSelectorModal, handleOpenMediaSelectorModal} from "@/redux/services/media/mediaSlice";
import JoditEditor from "jodit-react";
import DateTimePicker from "@/components/common/other/DateTimePicker";

function EditArticlePage () {

    // Dispatch
    const dispatch = useDispatch();

    // Router
    const router = useRouter();

    // Params
    const {articleId}: any = useParams()



    // Media Slice (Redux)
    const {mediaSelectorOpen, selectedMediaRedux, mediaType, mediaSelectedFor} = useSelector((state: any)=>state.Media);

    // User
    const { user } = useSelector((state: any) => state.Auth);
    const isJournalist = user?.role === "JOURNALIST";



    // Form States
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [excerpt, setExcerpt] = useState("");

    const [status, setStatus] = useState("DRAFT");
    const [publishAt, setPublishAt] = useState<any>(null);

    const [coverImage, setCoverImage] = useState<{_id: string, url: string, altTag: string} | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);

    const [allowComments, setAllowComments] = useState<boolean>(true);
    const [isFeatured, setIsFeatured] = useState(false);
    const [notes, setNotes] = useState("");

    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [metaKeywords, setMetaKeywords] = useState("");



    // Select Image
    useEffect(() => {
        if(!mediaSelectorOpen && Array.isArray(selectedMediaRedux) && selectedMediaRedux?.length > 0 && mediaSelectedFor === "article_cover_image") {
            setCoverImage(selectedMediaRedux[0])
        }
    }, [mediaSelectorOpen, selectedMediaRedux, mediaSelectedFor])



    // Category Selector
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(true);

    // Category Page
    const [categoryPage, setCategoryPage] = useState(1);

    // Call Get Categories Data API
    const {data: categoriesData, isLoading: categoriesDataLoading} = useGetCategoriesQuery({
        search: "",
        status: "active",
        limit: 20,
        page: categoryPage,
    });

    // Select / Unselect Category
    const handleCategorySelect = (categoryId: string) => {
        setCategories((prev: any) => {
            if(prev.includes(categoryId)) {
                return prev.filter((id: string) => id !== categoryId);
            }
            return [...prev, categoryId];
        });
    };



    // Tag Selector
    const [tagDropdownOpen, setTagDropdownOpen] = useState(true);

    // Tag Page
    const [tagPage, setTagPage] = useState(1);

    // Call Get Tags Data API
    const {data: tagsData, isLoading: tagsDataLoading} = useGetTagsQuery({
        search: "",
        limit: 20,
        page: tagPage,
    });

    // Select / Unselect Tag
    const handleTagSelect = (tagId: string) => {
        setTags((prev: any) => {
            if(prev.includes(tagId)) {
                return prev.filter((id: string) => id !== tagId);
            }
            return [...prev, tagId];
        });
    };



    // Available Status Options Based on User Role
    const statusOptions = isJournalist ? [
        { label: "DRAFT", value: "DRAFT" },
        { label: "PUBLISH", value: "PUBLISHED" },
    ] : [
        { label: "DRAFT", value: "DRAFT" },
        { label: "PUBLISH", value: "PUBLISHED" },
        { label: "REJECT", value: "REJECTED" },
        { label: "SUBMIT", value: "SUBMITTED" },
    ];

    // Status Dropdown
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

    // Status Ref
    const statusDropdownRef = useRef<HTMLDivElement>(null);



    // Close Outside Click
    useEffect(() => {
        // Handle outside click
        const handleOutsideClick = (event: MouseEvent) => {
            if(statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)){
                setStatusDropdownOpen(false);
            }
        };

        // Listen for document click
        document.addEventListener("mousedown", handleOutsideClick);

        // Cleanup
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);



    // Fetch existing article details
    const {data: articleResponse, isLoading: articleLoading, isFetching: articleFetching, isError: articleError, refetch: refetchArticle} = useGetDashboardArticleDetailsQuery(articleId, {
        skip: !articleId,
    });
    const article = articleResponse?.data?.article;

    // Populate form fields with existing article data
    useEffect(() => {

        if (!article) return;

        // Basic information
        setTitle(article?.title ?? "");
        setSlug(article?.slug ?? "");
        setContent(article?.content ?? "");
        setExcerpt(article?.excerpt ?? "");

        // Publishing information
        if(isJournalist) {
            setStatus("DRAFT")
        }else{
            setStatus(article?.status ?? "DRAFT")
        }
        setPublishAt(article?.publishAt ?? null);

        // Cover image
        setCoverImage(article?.coverImage
            ? {
                _id: article?.coverImage?._id ?? "",
                url: article?.coverImage?.url ?? "",
                altTag: article?.coverImage?.altTag ?? "",
            } : null
        );

        // Categories: support populated objects and raw IDs
        setCategories(Array.isArray(article?.categories) ? article?.categories?.map((category: any) => String(typeof category === "object" ? category?._id : category)) : []);

        // Tags: support populated objects and raw IDs
        setTags(Array.isArray(article?.tags) ? article?.tags?.map((tag: any) => String(typeof tag === "object" ? tag?._id : tag)) : []);

        // Article options
        setAllowComments(article.allowComments ?? false);
        setIsFeatured(article.isFeatured ?? false);
        setNotes(article.reviewNote ?? "");

        // SEO information
        setMetaTitle(article.metaTitle ?? "");
        setMetaDescription(article.metaDescription ?? "");

        setMetaKeywords(Array.isArray(article.metaKeywords) ? article.metaKeywords.join(", ") : "");

    }, [article]);



    // Call Update Article API
    const [updateArticle, {isLoading: updateArticleLoading}] = useUpdateArticleMutation()

    // Handle Update Article
    const handleUpdateArticle = async () => {
        try{
            // Validate
            const validate = updateArticleSchema.safeParse({
                title,
                slug,
                content,
                excerpt,
                status,
                publishAt,
                coverImage,
                categories,
                tags,
                allowComments,
                isFeatured,
                reviewNote: notes,
                metaTitle,
                metaDescription,
                metaKeywords
            })
            if(!validate?.success){
                return zodErrorHandler(validate)
            }

            console.log(validate.data);

            // Hit reate Article API
            const response = await updateArticle({
                id: articleId,
                data: validate?.data
            }).unwrap()

            // Reset States
            setTitle("")
            setSlug("")
            setContent("")
            setExcerpt("")
            setStatus("DRAFT")
            setPublishAt(null)
            setCoverImage(null)
            setCategories([])
            setTags([])
            setAllowComments(true)
            setIsFeatured(false)
            setNotes("")
            setMetaTitle("")
            setMetaDescription("")
            setMetaKeywords("")

            setCategoryDropdownOpen(true)
            setCategoryPage(1)
            setTagDropdownOpen(true)
            setTagPage(1)
            setStatusDropdownOpen(false)

            // Clear Selected Image
            dispatch(handleCancelMediaSelectorModal())

            // Redirect To Articles Page
            router.push("/dashboard/articles")

            return responseHandler("S", response?.message)
        }catch(error: any){
            return responseHandler("E", error?.data?.message)
        }
    }



    // Loading Article Details
    if (articleLoading || articleFetching) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-sm text-text">
                    Loading article details...
                </p>
            </div>
        );
    }

    // Article Fetch Error
    if (articleError) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                {/* Title */}
                <p className="text-sm text-red-600">
                    Failed to load article details.
                </p>

                {/* Refetch */}
                <button type="button" onClick={() => refetchArticle()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition cursor-pointer">
                    Try Again
                </button>

                {/* Articles */}
                <button type="button" onClick={() => router.push("/dashboard/articles")} className="text-sm text-text hover:text-primary transition cursor-pointer">
                    Back to Articles
                </button>
            </div>
        );
    }

    // Article Not Found
    if (!article) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                {/* Icon */}
                <FiFileText size={40} className="text-text/50" />

                {/* Title */}
                <h2 className="text-lg font-semibold text-heading">
                    Article Not Found
                </h2>

                {/* Desc */}
                <p className="text-sm text-text text-center">
                    The article you are trying to edit does not exist
                    or is no longer available.
                </p>

                {/* Articles */}
                <button type="button" onClick={() => router.push("/dashboard/articles")} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition cursor-pointer">
                    Back to Articles
                </button>
            </div>
        );
    }


    return (
        <div className="space-y-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                {/* Title & Description */}
                <div>
                    {/* Title */}
                    <div className="flex items-center gap-2">
                        <FiFileText className="text-primary" size={22} />
                        <h1 className="text-2xl font-semibold text-heading">
                            Edit Article
                        </h1>
                    </div>
                    <p className="text-sm text-text mt-1">
                        Update article content, publishing settings, categories, and SEO information.
                    </p>
                </div>

                {/* Back Button */}
                <button type="button" onClick={() => router.push("/dashboard/articles")} className="flex items-center gap-2 px-4 py-2 bg-white border border-border hover:bg-gray-50 text-text rounded-lg text-sm transition shadow-sm cursor-pointer w-max">
                    <FiArrowLeft size={16} />
                    Back to Articles
                </button>
            </div>

            {/* Article Form */}
            <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
                {/* Left — Main Article Fields */}
                <div className="2xl:col-span-2">
                    {/* Article Content */}
                    <div className="bg-white border border-border rounded-xl shadow-sm p-6">
                        {/* Section Title */}
                        <div className="mb-6">
                            <h2 className="text-base font-semibold text-heading">
                                Article Information
                            </h2>
                            <p className="text-xs text-text mt-1">
                                Add the basic information for your article.
                            </p>
                        </div>

                        {/* Title */}
                        <div>
                            {/* Label */}
                            <label htmlFor="title" className="block text-sm font-medium text-heading mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>

                            {/* Input */}
                            <input
                                id="title"
                                type="text"
                                placeholder="Enter article title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-heading placeholder:text-text/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                            />
                        </div>

                        {/* Slug */}
                        <div className="mt-5">
                            {/* Label */}
                            <label htmlFor="slug" className="block text-sm font-medium text-heading mb-2">
                                Slug
                            </label>

                            {/* Input */}
                            <input
                                id="slug"
                                type="text"
                                placeholder="Enter article slug..."
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-heading placeholder:text-text/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                            />
                        </div>

                        {/* Content */}
                        <div className="mt-5">
                            {/* Label & Media Button */}
                            <div className="flex items-center justify-between mb-2">
                                {/* Label */}
                                <label htmlFor="content" className="block text-sm font-medium text-heading">
                                    Content <span className="text-red-500">*</span>
                                </label>

                                {/* Insert Media Button */}
                                <button type="button" onClick={() => dispatch(handleOpenMediaSelectorModal({
                                    type: "all",
                                    multiple: false,
                                    selected: [],
                                    for: ""
                                }))} title="Insert Media" className="flex items-center justify-center w-8 h-8 text-text bg-white border border-border rounded-lg hover:bg-primary hover:text-white hover:border-primary transition cursor-pointer">
                                    <FiImage size={15} />
                                </button>
                            </div>

                            {/* Input */}
                            <JoditEditor
                                value={content}
                                onBlur={(newContent) => setContent(newContent)}
                                config={{
                                    readonly: false,
                                    toolbarSticky: false,
                                    placeholder: "Write your article content...",
                                    height: 766,
                                }}
                            />
                        </div>

                        {/* Excerpt */}
                        <div className="mt-5">
                            {/* Label */}
                            <label htmlFor="excerpt" className="block text-sm font-medium text-heading mb-2">
                                Excerpt
                            </label>

                            {/* Textarea */}
                            <textarea
                                id="excerpt"
                                placeholder="Enter a short summary of the article..."
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-heading placeholder:text-text/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition resize-none"
                            />
                        </div>
                    </div>

                    {/* SEO / Meta Information */}
                    <div className="mt-6 bg-white border border-border rounded-xl shadow-sm p-6">
                        {/* Section Title */}
                        <div className="mb-6">
                            <h2 className="text-base font-semibold text-heading">
                                SEO / Meta Information
                            </h2>
                            <p className="text-xs text-text mt-1">
                                Add search engine metadata for your article.
                            </p>
                        </div>

                        {/* Meta Title */}
                        <div>
                            {/* Label */}
                            <label htmlFor="metaTitle" className="block text-sm font-medium text-heading mb-2">
                                Meta Title
                            </label>

                            {/* Input */}
                            <input
                                id="metaTitle"
                                type="text"
                                placeholder="Enter meta title..."
                                value={metaTitle}
                                onChange={(e) => setMetaTitle(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-heading placeholder:text-text/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                            />
                        </div>

                        {/* Meta Description */}
                        <div className="mt-5">
                            {/* Label */}
                            <label htmlFor="metaDescription" className="block text-sm font-medium text-heading mb-2">
                                Meta Description
                            </label>

                            {/* Input */}
                            <textarea
                                id="metaDescription"
                                placeholder="Enter meta description..."
                                value={metaDescription}
                                onChange={(e) => setMetaDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-heading placeholder:text-text/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition resize-none"
                            />
                        </div>

                        {/* Meta Keywords */}
                        <div className="mt-5">
                            {/* Label */}
                            <label htmlFor="metaKeywords" className="block text-sm font-medium text-heading mb-2">
                                Meta Keywords
                            </label>

                            {/* Input */}
                            <input
                                id="metaKeywords"
                                type="text"
                                placeholder="Enter keywords separated by commas..."
                                value={metaKeywords}
                                onChange={(e) => setMetaKeywords(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-heading placeholder:text-text/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                            />

                            {/* Hint */}
                            <p className="text-xs text-text mt-1.5">
                                Separate multiple keywords with commas.
                            </p>
                        </div>
                    </div>

                    {/* Review Note */}
                    {!isJournalist && (
                        <div className="mt-6 bg-white border border-border rounded-xl shadow-sm p-6">
                            {/* Section Title */}
                            <div className="mb-5">
                                <h2 className="text-base font-semibold text-heading">
                                    Review Note
                                </h2>
                                <p className="text-xs text-text mt-1">
                                    Add editorial feedback or explain why an article was rejected.
                                </p>
                            </div>

                            {/* Review Note Input */}
                            <div>
                                {/* Label */}
                                <label htmlFor="reviewNote" className="block text-sm font-medium text-heading mb-2">
                                    Editorial Feedback
                                </label>

                                {/* Input */}
                                <textarea
                                    id="reviewNote"
                                    placeholder="Write feedback for the journalist..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={5}
                                    maxLength={2000}
                                    className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-heading placeholder:text-text/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition resize-none"
                                />

                                {/* Length Hint */}
                                <p className="text-xs text-text mt-1.5 text-right">
                                    {notes.length}/2000 characters
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right — Article Settings */}
                <div className="2xl:col-span-1 space-y-6">
                    {/* Publishing Settings */}
                    <div className="bg-white border border-border rounded-xl shadow-sm p-6">
                        {/* Section Title */}
                        <div className="mb-5">
                            <h2 className="text-base font-semibold text-heading">
                                Publishing Settings
                            </h2>
                            <p className="text-xs text-text mt-1">
                                Choose how and when to publish your article.
                            </p>
                        </div>

                        {/* Status & Action */}
                        <div className="flex items-end gap-2">
                            {/* Status */}
                            <div className="flex-1">
                                {/* Label */}
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Status
                                </label>

                                {/* Custom Selector */}
                                <div ref={statusDropdownRef} className="relative">
                                    {/* Selected Value */}
                                    <button type="button" onClick={() => setStatusDropdownOpen((prev) => !prev)} className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-heading outline-none hover:border-primary/50 focus:border-primary transition cursor-pointer">
                                        <span>
                                            {statusOptions.find((option) => option.value === status)?.label ?? "DRAFT"}
                                        </span>
                                        <FiChevronDown size={16} className={`text-text transition-transform ${statusDropdownOpen ? "rotate-180" : ""}`}/>
                                    </button>

                                    {/* Dropdown */}
                                    {statusDropdownOpen && (
                                        <div className="absolute z-20 w-full mt-2 p-1.5 bg-white border border-border rounded-lg shadow-lg">
                                            {statusOptions.map((option) => (
                                                <button key={option.value} type="button" onClick={() => {
                                                    setStatus(option.value);
                                                    setStatusDropdownOpen(false);
                                                }} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm text-left transition cursor-pointer ${status === option.value ? "bg-primary/5 text-primary" : "text-heading hover:bg-gray-50"}`}>
                                                    <span>{option.label}</span>
                                                    {status === option.value && (
                                                        <span className="text-primary text-xs font-semibold">
                                                            ✓
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Button */}
                            <button type="button" disabled={updateArticleLoading} onClick={handleUpdateArticle} className="shrink-0 px-4 py-2.5 w-25 flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap">
                                {updateArticleLoading ? "Updating..." : "Update"}
                            </button>
                        </div>

                        {/* Schedule */}
                        <div className="mt-5">
                            {/* Label */}
                            <label htmlFor="publishAt" className="block text-sm font-medium text-heading mb-2">
                                Schedule
                            </label>

                            {/* Input */}
                            <DateTimePicker
                                selected={publishAt}
                                setSelected={setPublishAt}
                                timeSelect={true}
                                yearTo={2050}
                            />

                            {/* Hint */}
                            <p className="text-xs text-text mt-1.5">
                                Choose a future date and time to schedule publication.
                            </p>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="bg-white border border-border rounded-xl shadow-sm p-6">
                        {/* Title */}
                        <h2 className="text-base font-semibold text-heading">
                            Cover Image <span className="text-red-500">*</span>
                        </h2>
                        <p className="text-xs text-text mt-1">
                            Select a cover image for your article.
                        </p>

                        {/* Cover Image Selector */}
                        <button type="button" onClick={() => dispatch(handleOpenMediaSelectorModal({
                            type: "image",
                            multiple: false,
                            selected: [coverImage],
                            for: "article_cover_image"
                        }))} className="block w-full mt-5 cursor-pointer">
                            {coverImage ? (
                                /* Image Preview */
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border group">
                                    <img
                                        src={coverImage?.url}
                                        alt="Cover"
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Change Overlay */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                Change Cover Image
                                            </span>
                                    </div>
                                </div>
                            ) : (
                                /* Select Image */
                                <div className="w-full aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition flex flex-col items-center justify-center">
                                    <FiImage size={32} className="text-text mb-3"/>
                                    <span className="text-sm font-medium text-heading">
                                            Select Cover Image
                                        </span>
                                    <span className="text-xs text-text mt-1">
                                            Choose an image from Media
                                        </span>
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Categories */}
                    <div className="bg-white border border-border rounded-xl shadow-sm">
                        {/* Title Bar */}
                        <div className="px-6 py-5 flex items-center justify-between gap-4">
                            {/* Title */}
                            <button type="button" onClick={() => setCategoryDropdownOpen((prev) => !prev)} className="w-full flex items-center justify-between text-left cursor-pointer">
                                {/* Headings */}
                                <div>
                                    <h2 className="text-base font-semibold text-heading">
                                        Categories <span className="text-red-500">*</span>
                                    </h2>
                                    <p className="text-xs text-text mt-1">
                                        Select article categories.
                                    </p>
                                </div>

                                {/* Right Side */}
                                <div className="flex items-center gap-3 ml-4">
                                    {/* Selected Count */}
                                    {categories?.length > 0 && (
                                        <span className="text-xs font-medium text-primary whitespace-nowrap">
                                                {categories?.length} selected
                                            </span>
                                    )}

                                    {/* Collapse Icon */}
                                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 border border-border text-text transition ${categoryDropdownOpen ? "bg-gray-100" : ""}`}>
                                            <FiChevronDown size={17} className={`transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`}/>
                                        </span>
                                </div>
                            </button>
                        </div>

                        {/* Content */}
                        {categoryDropdownOpen && (
                            <div className="border-t border-border">
                                {/* Categories Loading Skeleton */}
                                {categoriesDataLoading && (
                                    <div className="p-3 space-y-2">
                                        {Array.from({length: 6}).map((_, index) => (
                                            <div key={index} className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-white">
                                                {/* Checkbox Skeleton */}
                                                <div className="shrink-0 w-5 h-5 rounded-md bg-gray-100 animate-pulse" />

                                                {/* Category Information Skeleton */}
                                                <div className="min-w-0 flex-1 space-y-1.5">
                                                    {/* Name Skeleton */}
                                                    <div className={`h-4 rounded bg-gray-100 animate-pulse ${index % 3 === 0 ? "w-32" : index % 3 === 1 ? "w-40" : "w-28"}`}/>

                                                    {/* Description Skeleton */}
                                                    <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Categories */}
                                {!categoriesDataLoading && categoriesData?.data?.categories?.length > 0 && (
                                    <div className="p-3 max-h-90 overflow-y-auto">
                                        <div className="grid grid-cols-1 gap-2">
                                            {categoriesData?.data?.categories?.map((category: any) => {
                                                const isSelected = categories.includes(category?._id?.toString());
                                                return (
                                                    <button key={category?._id} type="button" onClick={() => handleCategorySelect(category?._id)} className={`group w-full flex items-center gap-3 p-3 rounded-xl border border-border text-left transition-all cursor-pointer ${isSelected ? "border-primary/30 bg-primary/5" : "bg-white hover:border-primary/20 hover:bg-gray-50"}`}>
                                                        {/* Checkbox */}
                                                        <span className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-md border transition-all ${isSelected ? "bg-primary border-primary" : "bg-white border-border group-hover:border-primary/50"}`}>
                                                                    {isSelected && (
                                                                        <span className="text-white text-xs font-bold leading-none">
                                                                            ✓
                                                                        </span>
                                                                    )}
                                                                </span>

                                                        {/* Category Information */}
                                                        <div className="min-w-0 flex-1">
                                                            {/* Name */}
                                                            <p className={`text-sm font-medium truncate ${isSelected ? "text-primary" : "text-heading"}`}>
                                                                {category?.name}
                                                            </p>

                                                            {/* Description */}
                                                            {category?.description && (
                                                                <p className="text-xs text-text mt-0.5 truncate">
                                                                    {category?.description}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Selected Indicator */}
                                                        {isSelected && (
                                                            <span className="shrink-0 px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wide">
                                                                        Selected
                                                                    </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Pagination */}
                                {!categoriesDataLoading && categoriesData?.data?.categories?.length > 0 && categoriesData?.data?.pagination?.totalPages > 1 && (
                                    <div className="px-3 py-3 border-t border-border">
                                        <div className="flex items-center justify-between gap-3">
                                            {/* Result Info */}
                                            <span className="text-[11px] text-text whitespace-nowrap">
                                                    {categoriesData?.data?.pagination?.from}-
                                                {categoriesData?.data?.pagination?.to}
                                                {" "}of{" "}
                                                {categoriesData?.data?.pagination?.totalItems}
                                                </span>

                                            {/* Controls */}
                                            <div className="flex items-center gap-1.5">
                                                {/* Previous */}
                                                <button type="button" disabled={!categoriesData?.data?.pagination?.hasPrevPage} onClick={() => setCategoryPage((prev) => prev - 1)} className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-white text-text hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer">
                                                    <FiChevronRight size={14} className="rotate-180"/>
                                                </button>

                                                {/* Current Page */}
                                                <div className="flex items-center justify-center min-w-8 h-8 px-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                                                    {categoriesData?.data?.pagination?.page}
                                                </div>

                                                {/* Next */}
                                                <button type="button" disabled={!categoriesData?.data?.pagination?.hasNextPage} onClick={() => setCategoryPage((prev) => prev + 1)} className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-white text-text hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer">
                                                    <FiChevronRight size={14}/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* No Categories */}
                                {!categoriesDataLoading && Array.isArray(categoriesData?.data?.categories) && categoriesData.data.categories.length === 0 && (
                                    <div className="px-5 py-8 text-center">
                                        {/* Icon */}
                                        <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-gray-50">
                                            <FiFileText size={18} className="text-text"/>
                                        </div>

                                        {/* No Category Message */}
                                        <p className="text-sm font-medium text-heading mt-3">
                                            No categories found
                                        </p>

                                        {/* Message */}
                                        <p className="text-xs text-text mt-1">
                                            No active categories are available for this article.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="bg-white border border-border rounded-xl shadow-sm">
                        {/* Title Bar */}
                        <div className="px-6 py-5 flex items-center justify-between gap-4">
                            {/* Title */}
                            <button type="button" onClick={() => setTagDropdownOpen((prev) => !prev)} className="w-full flex items-center justify-between text-left cursor-pointer">
                                {/* Headings */}
                                <div>
                                    <h2 className="text-base font-semibold text-heading">
                                        Tags
                                    </h2>
                                    <p className="text-xs text-text mt-1">
                                        Select article tags.
                                    </p>
                                </div>

                                {/* Right Side */}
                                <div className="flex items-center gap-3 ml-4">
                                    {/* Selected Count */}
                                    {tags?.length > 0 && (
                                        <span className="text-xs font-medium text-primary whitespace-nowrap">
                                                {tags?.length} selected
                                            </span>
                                    )}

                                    {/* Collapse Icon */}
                                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 border border-border text-text transition ${tagDropdownOpen ? "bg-gray-100" : ""}`}>
                                            <FiChevronDown size={17} className={`transition-transform ${tagDropdownOpen ? "rotate-180" : ""}`}/>
                                        </span>
                                </div>
                            </button>
                        </div>

                        {/* Content */}
                        {tagDropdownOpen && (
                            <div className="border-t border-border">
                                {/* Tags Loading Skeleton */}
                                {tagsDataLoading && (
                                    <div className="p-3 space-y-2">
                                        {Array.from({length: 6}).map((_, index) => (
                                            <div key={index} className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-white">
                                                {/* Checkbox Skeleton */}
                                                <div className="shrink-0 w-5 h-5 rounded-md bg-gray-100 animate-pulse" />

                                                {/* Tag Information Skeleton */}
                                                <div className="min-w-0 flex-1 space-y-1.5">
                                                    {/* Name Skeleton */}
                                                    <div className={`h-4 rounded bg-gray-100 animate-pulse ${index % 3 === 0 ? "w-32" : index % 3 === 1 ? "w-40" : "w-28"}`}/>

                                                    {/* Description Skeleton */}
                                                    <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Tags */}
                                {!tagsDataLoading && tagsData?.data?.tags?.length > 0 && (
                                    <div className="p-3 max-h-90 overflow-y-auto">
                                        <div className="grid grid-cols-1 gap-2">
                                            {tagsData?.data?.tags?.map((tag: any) => {
                                                const isSelected = tags.includes(tag?._id?.toString());
                                                return (
                                                    <button key={tag?._id} type="button" onClick={() => handleTagSelect(tag?._id)} className={`group w-full flex items-center gap-3 p-3 rounded-xl border border-border text-left transition-all cursor-pointer ${isSelected ? "border-primary/30 bg-primary/5" : "bg-white hover:border-primary/20 hover:bg-gray-50"}`}>
                                                        {/* Checkbox */}
                                                        <span className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-md border transition-all ${isSelected ? "bg-primary border-primary" : "bg-white border-border group-hover:border-primary/50"}`}>
                                                                {isSelected && (
                                                                    <span className="text-white text-xs font-bold leading-none">
                                                                        ✓
                                                                    </span>
                                                                )}
                                                            </span>

                                                        {/* Tag Information */}
                                                        <div className="min-w-0 flex-1">
                                                            {/* Name */}
                                                            <p className={`text-sm font-medium truncate ${isSelected ? "text-primary" : "text-heading"}`}>
                                                                {tag?.name}
                                                            </p>

                                                            {/* Description */}
                                                            {tag?.description && (
                                                                <p className="text-xs text-text mt-0.5 truncate">
                                                                    {tag?.description}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Selected Indicator */}
                                                        {isSelected && (
                                                            <span className="shrink-0 px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wide">
                                                                    Selected
                                                                </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Pagination */}
                                {!tagsDataLoading && tagsData?.data?.tags?.length > 0 && tagsData?.data?.pagination?.totalPages > 1 && (
                                    <div className="px-3 py-3 border-t border-border">
                                        <div className="flex items-center justify-between gap-3">
                                            {/* Result Info */}
                                            <span className="text-[11px] text-text whitespace-nowrap">
                                                    {tagsData?.data?.pagination?.from}-
                                                {tagsData?.data?.pagination?.to}
                                                {" "}of{" "}
                                                {tagsData?.data?.pagination?.totalItems}
                                                </span>

                                            {/* Controls */}
                                            <div className="flex items-center gap-1.5">
                                                {/* Previous */}
                                                <button type="button" disabled={!tagsData?.data?.pagination?.hasPrevPage} onClick={() => setTagPage((prev) => prev - 1)} className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-white text-text hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer">
                                                    <FiChevronRight size={14} className="rotate-180"/>
                                                </button>

                                                {/* Current Page */}
                                                <div className="flex items-center justify-center min-w-8 h-8 px-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                                                    {tagsData?.data?.pagination?.page}
                                                </div>

                                                {/* Next */}
                                                <button type="button" disabled={!tagsData?.data?.pagination?.hasNextPage} onClick={() => setTagPage((prev) => prev + 1)} className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-white text-text hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer">
                                                    <FiChevronRight size={14}/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* No Tags */}
                                {!tagsDataLoading && Array.isArray(tagsData?.data?.tags) && tagsData.data.tags.length === 0 && (
                                    <div className="px-5 py-8 text-center">
                                        {/* Icon */}
                                        <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-gray-50">
                                            <FiFileText size={18} className="text-text"/>
                                        </div>

                                        {/* No Tag Message */}
                                        <p className="text-sm font-medium text-heading mt-3">
                                            No tags found
                                        </p>

                                        {/* Message */}
                                        <p className="text-xs text-text mt-1">
                                            No tags are available for this article.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Article Options */}
                    <div className="bg-white border border-border rounded-xl shadow-sm p-6">
                        {/* Section Title */}
                        <div className="mb-5">
                            <h2 className="text-base font-semibold text-heading">
                                Article Options
                            </h2>
                            <p className="text-xs text-text mt-1">
                                Configure featured status and comments.
                            </p>
                        </div>

                        {/* Allow Comments Toggle */}
                        <div className="flex items-center justify-between gap-4 pt-4">
                            {/* Content */}
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-heading">
                                    Allow Comments
                                </p>
                                <p className="text-xs text-text mt-1">
                                    Allow readers to comment on this article.
                                </p>
                            </div>

                            {/* Toggler Switch */}
                            <button type="button" role="switch" aria-checked={allowComments} aria-label="Allow Comments" onClick={() => setAllowComments((prev) => !prev)} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${allowComments ? "bg-primary" : "bg-gray-300"}`}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${allowComments ? "translate-x-6" : "translate-x-1"}`}/>
                            </button>
                        </div>

                        {/* Featured Article Toggle */}
                        {!isJournalist && (
                            <div className="flex items-center justify-between gap-4 pt-4 mt-4 border-t border-border">
                                {/* Content */}
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-heading">
                                        Featured Article
                                    </p>
                                    <p className="text-xs text-text mt-1">
                                        Highlight this article in featured sections.
                                    </p>
                                </div>

                                {/* Toggle Switch */}
                                <button type="button" role="switch" aria-checked={isFeatured} aria-label="Featured Article" onClick={() => setIsFeatured((prev) => !prev)} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${isFeatured ? "bg-primary" : "bg-gray-300"}`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${isFeatured ? "translate-x-6" : "translate-x-1"}`}/>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditArticlePage;