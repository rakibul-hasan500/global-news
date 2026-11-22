function ArticleCardSkeleton() {
    return (
        <div className="animate-pulse overflow-hidden rounded border border-slate-200 bg-white">
            {/* Cover Image Skeleton */}
            <div className="aspect-[16/9] bg-slate-200" />

            {/* Article Content Skeleton */}
            <div className="space-y-3 p-3 sm:p-4">
                {/* Title */}
                <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-slate-200" />
                    <div className="h-4 w-4/5 rounded bg-slate-200" />
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 pt-1">
                    <div className="h-3 w-3 rounded-full bg-slate-200" />
                    <div className="h-3 w-24 rounded bg-slate-100" />
                </div>
            </div>
        </div>
    )
}

export default ArticleCardSkeleton;