function ArticleHorizontalCardSkeleton() {
    return (
        <div className="flex animate-pulse flex-col overflow-hidden rounded border border-slate-200 bg-white sm:flex-row">
            {/* Cover Image Skeleton */}
            <div className="h-52 shrink-0 bg-slate-200 sm:h-auto sm:w-52" />

            {/* Content Skeleton */}
            <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                {/* Category & Date */}
                <div className="mb-3 flex items-center gap-3">
                    <div className="h-6 w-20 rounded bg-slate-200" />
                    <div className="h-3 w-24 rounded bg-slate-200" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <div className="h-5 w-full rounded bg-slate-200" />
                    <div className="h-5 w-3/4 rounded bg-slate-200" />
                </div>

                {/* Excerpt */}
                <div className="mt-3 space-y-2">
                    <div className="h-3 w-full rounded bg-slate-200" />
                    <div className="h-3 w-2/3 rounded bg-slate-200" />
                </div>

                {/* Author */}
                <div className="mt-4 h-3 w-28 rounded bg-slate-200" />

                {/* Footer */}
                <div className="mt-auto mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    {/* Reactions */}
                    <div className="flex items-center gap-4">
                        <div className="h-4 w-10 rounded bg-slate-200" />
                        <div className="h-4 w-10 rounded bg-slate-200" />
                    </div>

                    {/* Read More */}
                    <div className="h-4 w-16 rounded bg-slate-200" />
                </div>
            </div>
        </div>
    );
}

export default ArticleHorizontalCardSkeleton;
