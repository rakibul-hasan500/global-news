function ArticleGridSkeleton() {
    return (
        <article className="overflow-hidden rounded border border-slate-200 bg-white">
            {/* Image */}
            <div className="h-78 w-full animate-pulse bg-slate-200" />

            <div className="p-5">
                {/* Category & Date */}
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
                    <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                </div>

                {/* Excerpt */}
                <div className="mt-4 space-y-2">
                    <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                </div>

                {/* Author */}
                <div className="mt-4 h-4 w-32 animate-pulse rounded bg-slate-200" />

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex gap-4">
                        <div className="h-4 w-12 animate-pulse rounded bg-slate-200" />
                        <div className="h-4 w-12 animate-pulse rounded bg-slate-200" />
                    </div>

                    <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                </div>
            </div>
        </article>
    );
}

export default ArticleGridSkeleton;