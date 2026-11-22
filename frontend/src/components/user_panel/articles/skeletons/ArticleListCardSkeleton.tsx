function ArticleListCardSkeleton() {
    return (
        <li className="list-none">
            <div className="flex animate-pulse gap-3 rounded">
                {/* Cover Image */}
                <div className="h-16 w-20 shrink-0 rounded bg-slate-200" />

                {/* Article Info */}
                <div className="min-w-0 flex-1 space-y-3 py-1">
                    {/* Title */}
                    <div className="space-y-2">
                        <div className="h-3.5 w-full rounded bg-slate-200" />
                        <div className="h-3.5 w-4/5 rounded bg-slate-200" />
                    </div>

                    {/* Date */}
                    <div className="h-2.5 w-20 rounded bg-slate-200" />
                </div>
            </div>
        </li>
    );
}

export default ArticleListCardSkeleton;
