import Link from "next/link";
import { FiArrowLeft, FiHome, FiSearch } from "react-icons/fi";

export default function NotFoundPage() {
    return (
        <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-white px-5 py-16">
            {/* Background Decoration */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-indigo-50 blur-3xl" />

            {/* Content */}
            <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
                {/* 404 */}
                <div className="relative mb-5">
                    {/* Title */}
                    <h1 className="select-none text-[130px] font-black leading-none tracking-tighter text-blue-600 sm:text-[190px]">
                        404
                    </h1>

                    {/* Subtitle */}
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-600 shadow-sm">
                        Page Not Found
                    </span>
                </div>

                {/* Content */}
                <div className="mx-auto max-w-lg">
                    <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Oops! You've lost your way.
                    </h2>
                    <p className="text-sm leading-7 text-slate-500 sm:text-base">
                        The page you're looking for doesn't exist, has been moved,
                        or is temporarily unavailable. Let's get you back on track.
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    {/* Home */}
                    <Link href="/" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-blue-600/30 sm:w-auto">
                        <FiHome size={18} />
                        Back to Homepage
                    </Link>

                    {/* Articles */}
                    <Link href="/articles" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:w-auto">
                        <FiSearch size={18} />
                        Explore Articles
                    </Link>
                </div>

                {/* Footer */}
                <div className="mt-12 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <FiArrowLeft size={14} />
                    <span>Don't worry, it happens to the best of us.</span>
                </div>
            </div>
        </main>
    );
}