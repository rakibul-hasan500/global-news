"use client";
import {useEffect, useState} from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {FaBars, FaXmark, FaMagnifyingGlass, FaChevronDown, FaArrowRight, FaGlobe} from "react-icons/fa6";
import {useRouter} from "next/navigation";
import ProfileDropdown from "@/components/common/dropdown/ProfileDropdown";
import NotificationDropdown from "@/components/common/dropdown/NotificationDropdown";
import {RootState} from "@reduxjs/toolkit/query";

function Header() {

    // Router
    const router = useRouter();

    // Redux Data
    const appSettings = useSelector((state: any) => state.Settings?.app);
    const categories = useSelector((state: any) => state.Category?.allCategories);
    const user = useSelector((state: any) => state.Auth?.user);

    // Local State
    const [menuOpen, setMenuOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);

    // App Information
    const appName = appSettings?.appName || "Global News";
    const logo = appSettings?.logo?.url;

    // Categories
    const allCategories = Array.isArray(categories) ? categories.filter((category) => category?.slug && category?.name) : [];
    const visibleCategories = allCategories.slice(0, 4);
    const remainingCategories = allCategories.slice(4);

    // Close Menus
    const closeMenus = () => {
        setMenuOpen(false);
        setCategoriesOpen(false);
    };

    // Search State
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Search Submit
    const handleSearch = (e: any) => {
        e.preventDefault();

        const query = searchQuery.trim();

        if (!query) return;

        setSearchOpen(false);
        setSearchQuery("");

        router.push(`/articles?search=${encodeURIComponent(query)}`);
    };

    // Close Search With Escape
    useEffect(() => {
        const handleEscape = (e: any) => {
            if (e.key === "Escape") {
                setSearchOpen(false);
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

    return (
        <>
            {/* Header */}
            <header className="relative bg-white shadow-sm">
                {/* Top Header */}
                <div className="border-b border-slate-100">
                    <div className="mx-auto base-container flex h-[80px] items-center justify-between gap-4 px-4 sm:px-8 lg:px-10">
                        {/* Logo */}
                        <Link href="/" onClick={closeMenus} className="group flex shrink-0 items-center gap-3">
                            {logo ? (
                                <img
                                    src={logo}
                                    alt={appName}
                                    className="h-12 max-w-44 object-contain"
                                />
                            ) : (
                                <>
                                    {/* Icon */}
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm transition group-hover:bg-blue-800">
                                        <FaGlobe size={23} />
                                    </div>

                                    {/* Data */}
                                    <div>
                                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                                            {appName}
                                        </h1>
                                        <p className="text-[10px] font-semibold uppercase tracking-[2px] text-slate-500">
                                            Your World. Your News.
                                        </p>
                                    </div>
                                </>
                            )}
                        </Link>

                        {/* Right Actions */}
                        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                            {/* Explore News */}
                            <Link href="/articles" className="hidden items-center gap-2 rounded bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 md:inline-flex">
                                Explore News
                                <FaArrowRight size={12} />
                            </Link>

                            {/* Search */}
                            <button type="button" onClick={() => {
                                setSearchOpen(true);
                                setMenuOpen(false);
                            }} aria-label="Search" className="flex h-11 w-11 items-center justify-center rounded-full text-slate-600 transition border border-gray-200 hover:bg-blue-50 hover:text-blue-700">
                                <FaMagnifyingGlass size={18} />
                            </button>

                            {/* Notification */}
                            {user && (
                                <NotificationDropdown style={"LIGHT"}/>
                            )}

                            {/* Hamburger - Always Visible */}
                            <button type="button" onClick={() => {
                                setMenuOpen(!menuOpen);
                                setCategoriesOpen(false);
                            }} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${menuOpen ? "border-blue-700 bg-blue-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-blue-700 hover:text-blue-700"}`}>
                                {menuOpen ? (
                                    <FaXmark size={21} />
                                ) : (
                                    <FaBars size={20} />
                                )}
                            </button>

                            {/* Profile Dropdown */}
                            <ProfileDropdown user_panel={true} />
                        </div>
                    </div>
                </div>

                {/* Category Navigation */}
                <div className="hidden border-b border-slate-200 md:block">
                    <div className="mx-auto base-container flex h-[52px] items-center gap-7 px-4 sm:px-8 lg:px-10">
                        {/* Home */}
                        <Link href="/" className="relative flex h-full shrink-0 items-center text-sm font-bold text-blue-700 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-t-full after:bg-blue-700">
                            Home
                        </Link>

                        {/* Latest News */}
                        <Link href="/articles" className="shrink-0 text-sm font-medium text-slate-600 transition hover:text-blue-700">
                            Latest News
                        </Link>

                        {/* Visible Categories */}
                        {visibleCategories.map((category) => (
                            <Link key={category._id} href={`/articles?category=${encodeURIComponent(category.slug)}`} className="shrink-0 whitespace-nowrap text-sm font-medium text-slate-600 transition hover:text-blue-700">
                                {category.name}
                            </Link>
                        ))}

                        {/* More Categories Dropdown */}
                        {remainingCategories.length > 0 && (
                            <div className="relative ml-auto">
                                {/* Open Button */}
                                <button type="button" onClick={() => setCategoriesOpen(!categoriesOpen)} className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-slate-700 transition hover:text-blue-700">
                                    All Categories
                                    <FaChevronDown size={11} className={`transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`}/>
                                </button>

                                {/* More Items */}
                                {categoriesOpen && (
                                    <div className="absolute right-0 top-10 z-50 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                                        {remainingCategories.map((category) => (
                                            <Link key={category._id} href={`/articles?category=${encodeURIComponent(category.slug)}`} onClick={closeMenus} className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700">
                                                {category.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Hamburger Menu Panel */}
                <div className={`absolute left-0 right-0 z-500 top-full overflow-hidden border-b border-slate-200 bg-white shadow-xl transition-all duration-300 ${menuOpen ? "visible max-h-[80vh] opacity-100" : "invisible max-h-0 opacity-0"}`}>
                    <div className="mx-auto base-container overflow-y-auto px-4 py-7 sm:px-8 lg:px-10">
                        {/* Dropdown Data */}
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Main Navigation */}
                            <div>
                                {/* Title */}
                                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                                    Navigation
                                </h3>

                                {/* Links */}
                                <div className="space-y-1">
                                    {/* Item 1 */}
                                    <Link href="/" onClick={closeMenus} className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-blue-50 hover:text-blue-700">
                                        Home
                                        <FaArrowRight size={12} />
                                    </Link>

                                    {/* Item 2 */}
                                    <Link href="/articles" onClick={closeMenus} className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-blue-50 hover:text-blue-700">
                                        Latest News
                                        <FaArrowRight size={12} />
                                    </Link>

                                    {/* Item 3 */}
                                    <Link href="/about" onClick={closeMenus} className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-blue-50 hover:text-blue-700">
                                        About Us
                                        <FaArrowRight size={12} />
                                    </Link>

                                    {/* Item 4 */}
                                    <Link href="/contact" onClick={closeMenus} className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-blue-50 hover:text-blue-700">
                                        Contact Us
                                        <FaArrowRight size={12} />
                                    </Link>

                                    {/* Account / Login */}
                                    <Link href={user ? "/account" : "/login"} onClick={closeMenus} className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-blue-50 hover:text-blue-700">
                                        {user ? "My Account" : "Login"}
                                        <FaArrowRight size={12} />
                                    </Link>
                                </div>
                            </div>

                            {/* All Categories */}
                            <div className="sm:col-span-1 lg:col-span-2">
                                {/* Title */}
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                        Explore Categories
                                    </h3>
                                    <span className="text-xs text-slate-400">
                                        {allCategories.length} Categories
                                    </span>
                                </div>

                                {/* Items */}
                                {allCategories.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                        {allCategories.map((category) => (
                                            <Link key={category._id} href={`/articles?category=${encodeURIComponent(category.slug)}`} onClick={closeMenus} className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                                                <span className="truncate">
                                                    {category.name}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400">
                                        No categories available.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Bottom CTA */}
                        <div className="mt-7 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
                            {/* Hint Text */}
                            <p className="text-sm text-slate-500">
                                Stay informed. Stay connected with the world.
                            </p>

                            {/* Articles Page */}
                            <Link href="/articles" onClick={closeMenus} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800">
                                Discover All News
                                <FaArrowRight size={12} />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Search Modal */}
            {searchOpen && (
                <div onClick={() => setSearchOpen(false)} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
                    <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl rounded border border-white/20 bg-white p-6 shadow-2xl sm:p-10">
                        {/* Close Button */}
                        <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search" className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                            <FaXmark size={20} />
                        </button>

                        {/* Heading */}
                        <div className="mb-7">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                <FaMagnifyingGlass size={21} />
                            </div>

                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Search News
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Discover the latest stories, breaking news and updates from around the world.
                            </p>
                        </div>

                        {/* Search Form */}
                        <form onSubmit={handleSearch}>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                {/* Input */}
                                <div className="flex h-14 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 py-3.5 sm:py-0 px-4 transition focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                                    <FaMagnifyingGlass className="shrink-0 text-slate-400" />
                                    <input
                                        type="search"
                                        autoFocus
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search news, topics, keywords..."
                                        className="h-full w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                                    />
                                </div>

                                {/* Submit */}
                                <button type="submit" disabled={!searchQuery.trim()} className="flex h-14 items-center justify-center gap-2 rounded-xl bg-blue-700 px-7 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50">
                                    Search
                                    <FaArrowRight size={13} />
                                </button>
                            </div>
                        </form>

                        {/* Footer Hint */}
                        <p className="mt-5 text-xs text-slate-400">
                            Press ESC to close search
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export default Header;
