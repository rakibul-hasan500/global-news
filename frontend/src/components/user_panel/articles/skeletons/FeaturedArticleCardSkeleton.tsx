function FeaturedArticleCardSkeleton() {
    return (
        <div className="relative min-h-[380px] animate-pulse overflow-hidden rounded bg-slate-200 h-full">
            <div className="absolute inset-x-0 bottom-0 space-y-4 p-5 sm:p-7">
                {/* Category */}
                <div className="h-6 w-24 rounded bg-slate-300" />

                {/* Title */}
                <div className="space-y-2">
                    <div className="h-7 w-full rounded bg-slate-300" />
                    <div className="h-7 w-4/5 rounded bg-slate-300" />
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-slate-300" />
                    <div className="h-4 w-3/4 rounded bg-slate-300" />
                </div>

                {/* Date */}
                <div className="flex items-center gap-3 pt-1">
                    <div className="h-3 w-3 rounded-full bg-slate-300" />
                    <div className="h-3 w-24 rounded bg-slate-300" />
                    <div className="h-3 w-16 rounded bg-slate-300" />
                </div>
            </div>
        </div>
    )
}

export default FeaturedArticleCardSkeleton;