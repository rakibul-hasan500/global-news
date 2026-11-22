"use client"
import {usePathname} from "next/navigation";
import {useState} from "react";
import {useSelector} from "react-redux";
import {RiDashboardFill} from "react-icons/ri";
import {IoCloseOutline} from "react-icons/io5";
import Link from "next/link";
import {FiBell, FiBox, FiChevronDown, FiHome, FiLogOut, FiMail, FiSettings, FiTag, FiUsers} from "react-icons/fi";
import {MdOutlinePermMedia} from "react-icons/md";
import LogoutWarningModal from "@/components/common/warning/LogoutWarningModal";
import {BsDashLg} from "react-icons/bs";

function DashboardSidebar({sidebarOpen, setSidebarOpen}: {sidebarOpen: boolean, setSidebarOpen: Function}) {

    // Current path
    const path = usePathname()

    // User Data From Redux
    const {user} = useSelector((state: any)=>state.Auth)

    // App Settings Data From Redux
    const {app} = useSelector((state: any)=>state.Settings)

    // Active Menu Dropdown
    const [activeMenuDropdown, setActiveMenuDropdown] = useState("")

    // Logout Modal Open
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    // Close Sidebar
    const handleCloseSidebar = ()=>{
        if(window.innerWidth < 1280){
            setSidebarOpen(false);
        }
    }

    return (
        <>
            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-[2px] xl:hidden z-4000"/>
            )}

            {/* Sidebar */}
            <aside className={`${sidebarOpen ? "w-84 min-w-84 max-w-84" : "w-0  min-w-0 max-w-0 overflow-hidden"} w-84 fixed top-0 left-0 xl:static h-screen bg-primary-hover text-surface flex flex-col border-r border-border/20 transition-all duration-200 z-4001`}>
                {/* Logo Section */}
                <div className="relative h-20 flex items-center gap-3 px-6 bg-background-primary/5">
                    {/*  Logo  */}
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-surface/10 text-surface">
                        <RiDashboardFill className="text-lg" />
                    </div>

                    {/*  Name  */}
                    <div>
                        <h1 className="text-sm font-semibold text-surface">{app?.appName || "App Name"}</h1>
                        <p className="text-xs text-surface/60">{app?.tagline}</p>
                    </div>

                    {/*  Close Button  */}
                    <button onClick={()=> setSidebarOpen(false)} className="absolute right-6 h-9 w-9 flex xl:hidden items-center justify-center bg-white/10 text-white text-xl cursor-pointer">
                        <IoCloseOutline />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto p-4 scroll-hidden">
                    {/*  Menu Title  */}
                    <p className="text-xs uppercase text-surface mb-3 px-2">Main Menu</p>

                    {/*  Menus  */}
                    <ul className="space-y-4 uppercase">
                        {/*  Dashboard  */}
                        <Link href="/dashboard" onClick={()=> {
                            handleCloseSidebar()
                            setActiveMenuDropdown("")
                        }} className={`${path === "/dashboard" ? "bg-background-primary/10 text-background-primary" : "text-surface/70 hover:bg-background-primary/10"} flex items-center gap-4 p-3 cursor-pointer transition`}>
                            <span className="text-lg"><FiHome /></span>
                            <span className="text-sm font-medium">Dashboard</span>
                        </Link>

                        {/*  Users  */}
                        {["MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(user?.role) && (
                            <Link href="/dashboard/users" onClick={()=> {
                                handleCloseSidebar()
                                setActiveMenuDropdown("")
                            }} className={`${path === "/dashboard/users" ? "bg-background-primary/10 text-background-primary" : "text-surface/70 hover:bg-background-primary/10"} flex items-center gap-4 p-3 cursor-pointer transition`}>
                                <span className="text-lg"><FiUsers /></span>
                                <span className="text-sm font-medium">Users</span>
                            </Link>
                        )}

                        {/* Articles */}
                        <div className="flex flex-col">
                            {/* Submenu Open Button */}
                            <button onClick={() => setActiveMenuDropdown((prev: any) => prev !== "articles" ? "articles" : "")} className={`group flex items-center justify-between gap-4 p-3 rounded-md cursor-pointer transition-all duration-200 uppercase ${activeMenuDropdown === "articles" ? "bg-background-primary/10 text-background-primary" : "text-surface/70 hover:bg-background-primary/10 hover:text-surface"}`}>
                                {/* Title */}
                                <div className="flex items-center gap-4">
                                    <FiBox className={`text-lg transition-transform duration-200 ${activeMenuDropdown === "articles" ? "scale-110" : "group-hover:scale-110"}`}/>
                                    <span className="text-sm font-medium">
                                        Articles
                                    </span>
                                </div>

                                {/* Arrow */}
                                <FiChevronDown className={`text-sm transition-transform duration-300 ${activeMenuDropdown === "articles" ? "rotate-180 text-background-primary" : "text-surface/50"}`}/>
                            </button>

                            {/* Sub Menu */}
                            <ul className={`relative flex flex-col ml-5 pl-4 overflow-hidden transition-all duration-300 ease-in-out ${activeMenuDropdown === "articles" ? "max-h-52 mt-2 opacity-100" : "max-h-0 opacity-0"}`}>
                                {/* Vertical Guide */}
                                <span className="absolute left-0 top-1 bottom-1 w-px bg-surface/10" />

                                {/* All Articles */}
                                <Link href="/dashboard/articles" onClick={handleCloseSidebar} className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-r-md text-sm transition-all duration-200 ${path === "/dashboard/articles" ? "bg-background-primary/10 text-background-primary font-medium" : "text-surface/55 hover:text-surface hover:bg-background-primary/5"}`}>
                                    {/* Active Indicator */}
                                    <span className={`absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full transition-all duration-200 ${path === "/dashboard/articles" ? "bg-background-primary" : "bg-transparent group-hover:bg-surface/30"}`}/>

                                    {/* Dot */}
                                    <span className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${path === "/dashboard/articles" ? "bg-background-primary scale-110" : "bg-surface/30 group-hover:bg-surface/60"}`}/>

                                    {/* Title */}
                                    <span>Articles</span>
                                </Link>

                                {/* Add Article */}
                                {["JOURNALIST"].includes(user?.role) && (
                                    <Link href="/dashboard/articles/add" onClick={handleCloseSidebar} className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-r-md text-sm transition-all duration-200 ${path === "/dashboard/articles/add" ? "bg-background-primary/10 text-background-primary font-medium" : "text-surface/55 hover:text-surface hover:bg-background-primary/5"}`}>
                                        {/* Active Indicator */}
                                        <span className={`absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full transition-all duration-200 ${path === "/dashboard/articles/add" ? "bg-background-primary" : "bg-transparent group-hover:bg-surface/30"}`}/>

                                        {/* Dot */}
                                        <span className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${path === "/dashboard/articles/add" ? "bg-background-primary scale-110" : "bg-surface/30 group-hover:bg-surface/60"}`}/>

                                        {/* Title */}
                                        <span>Add Article</span>
                                    </Link>
                                )}

                                {/* Categories */}
                                {["MODERATOR", "EDITOR", "ADMIN", "SUPER_ADMIN"].includes(user?.role) && (
                                    <Link href="/dashboard/articles/categories" onClick={handleCloseSidebar} className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-r-md text-sm transition-all duration-200 ${path === "/dashboard/articles/categories" ? "bg-background-primary/10 text-background-primary font-medium" : "text-surface/55 hover:text-surface hover:bg-background-primary/5"}`}>
                                        {/* Active Indicator */}
                                        <span className={`absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full transition-all duration-200 ${path === "/dashboard/articles/categories" ? "bg-background-primary" : "bg-transparent group-hover:bg-surface/30"}`}/>

                                        {/* Dot */}
                                        <span className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${path === "/dashboard/articles/categories" ? "bg-background-primary scale-110" : "bg-surface/30 group-hover:bg-surface/60"}`}/>

                                        {/* Title */}
                                        <span>Categories</span>
                                    </Link>
                                )}

                                {/* Tags */}
                                {["MODERATOR", "EDITOR", "ADMIN", "SUPER_ADMIN"].includes(user?.role) && (
                                    <Link href="/dashboard/articles/tags" onClick={handleCloseSidebar} className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-r-md text-sm transition-all duration-200 ${path === "/dashboard/articles/tags" ? "bg-background-primary/10 text-background-primary font-medium" : "text-surface/55 hover:text-surface hover:bg-background-primary/5"}`}>
                                        {/* Active Indicator */}
                                        <span className={`absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full transition-all duration-200 ${path === "/dashboard/articles/tags" ? "bg-background-primary" : "bg-transparent group-hover:bg-surface/30"}`}/>

                                        {/* Dot */}
                                        <span className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${path === "/dashboard/articles/tags" ? "bg-background-primary scale-110" : "bg-surface/30 group-hover:bg-surface/60"}`}/>

                                        {/* Title */}
                                        <span>Tags</span>
                                    </Link>
                                )}

                                {/* Comments */}
                                <Link href="/dashboard/articles/comments" onClick={handleCloseSidebar} className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-r-md text-sm transition-all duration-200 ${path === "/dashboard/articles/comments" ? "bg-background-primary/10 text-background-primary font-medium" : "text-surface/55 hover:text-surface hover:bg-background-primary/5"}`}>
                                    {/* Active Indicator */}
                                    <span className={`absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full transition-all duration-200 ${path === "/dashboard/articles/comments" ? "bg-background-primary" : "bg-transparent group-hover:bg-surface/30"}`}/>

                                    {/* Dot */}
                                    <span className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${path === "/dashboard/articles/comments" ? "bg-background-primary scale-110" : "bg-surface/30 group-hover:bg-surface/60"}`}/>

                                    {/* Title */}
                                    <span>Comments</span>
                                </Link>
                            </ul>
                        </div>

                        {/* contact */}
                        {["ADMIN", "SUPER_ADMIN"].includes(user?.role) && (
                            <Link href="/dashboard/contacts" onClick={()=> {
                                handleCloseSidebar()
                                setActiveMenuDropdown("")
                            }} className={`${path === "/dashboard/contacts" ? "bg-background-primary/10 text-background-primary" : "text-surface/70 hover:bg-background-primary/10"} flex items-center gap-4 p-3 cursor-pointer transition`}>
                                <span className="text-lg"><FiMail /></span>
                                <span className="text-sm font-medium">Contact</span>
                            </Link>
                        )}

                        {/* Notifications */}
                        <Link href="/dashboard/notifications" onClick={() => {
                            handleCloseSidebar()
                            setActiveMenuDropdown("")
                        }} className={`${path === "/notifications" ? "bg-background-primary/10 text-background-primary" : "text-surface/70 hover:bg-background-primary/10"} flex items-center gap-4 p-3 cursor-pointer transition`}>
                                <span className="text-lg">
                                    <FiBell />
                                </span>
                            <span className="text-sm font-medium">Notifications</span>
                        </Link>

                        {/* Media */}
                        {["ADMIN", "SUPER_ADMIN", "EDITOR", "JOURNALIST"].includes(user?.role) && (
                            <Link href="/dashboard/media" onClick={()=> {
                                handleCloseSidebar()
                                setActiveMenuDropdown("")
                            }} className={`${path === "/dashboard/media" ? "bg-background-primary/10 text-background-primary" : "text-surface/70 hover:bg-background-primary/10"} flex items-center gap-4 p-3 cursor-pointer transition`}>
                                <span className="text-lg"><MdOutlinePermMedia /></span>
                                <span className="text-sm font-medium">Media</span>
                            </Link>
                        )}

                        {/* Settings */}
                        {["ADMIN", "SUPER_ADMIN"].includes(user?.role) && (
                            <Link href="/dashboard/settings/app" onClick={()=> {
                                handleCloseSidebar()
                                setActiveMenuDropdown("")
                            }} className={`${path.startsWith("/dashboard/settings") ? "bg-background-primary/10 text-background-primary" : "text-surface/70 hover:bg-background-primary/10"} flex items-center gap-4 p-3 cursor-pointer transition`}>
                                <span className="text-lg"><FiSettings /></span>
                                <span className="text-sm font-medium">Settings</span>
                            </Link>
                        )}
                    </ul>
                </div>

                {/* User Section */}
                <div className="p-4">
                    {/* User Card */}
                    <div className="relative overflow-hidden rounded border border-border/10 bg-background-primary/5 backdrop-blur-sm p-4">
                        {/* User Info */}
                        <div className="relative flex items-center gap-3">
                            {/* Profile Image */}
                            <div className="relative h-12.5 min-h-12.5 w-12.5 min-w-12.5 flex items-center justify-center border border-border/20 bg-background-primary/20  rounded-full">
                                {user?.avatar?.url ? (
                                    <img
                                        src={user?.avatar?.url}
                                        alt={user?.name || "user"}
                                        className="w-12.5 h-12.5 object-cover"
                                    />
                                ) : (
                                    <span className="text-surface font-semibold uppercase text-lg">
                                        {user?.name?.charAt(0) || "U"}
                                    </span>
                                )}

                                {/* Online Dot */}
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success border-2 border-border/20 rounded-full"></span>
                            </div>

                            {/* User Details */}
                            <div className="flex-1 overflow-hidden">
                                {/* Name */}
                                <h3 className="text-sm font-semibold text-white truncate">
                                    {user?.name}
                                </h3>

                                {/* Email */}
                                <p className="text-xs text-white/70 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button onClick={() => setLogoutModalOpen(true)} className={`cursor-pointer mt-4 flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded bg-error transition-all duration-200 text-sm font-semibold text-surface uppercase`}>
                            <FiLogOut className="text-base" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Logout Warning Modal */}
                {logoutModalOpen && <LogoutWarningModal onClose={()=> setLogoutModalOpen(false)}/>}
            </aside>
        </>
    )
}

export default DashboardSidebar;

