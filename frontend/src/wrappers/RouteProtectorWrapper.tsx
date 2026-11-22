"use client"
import {useSelector} from "react-redux";
import Loader from "@/components/common/other/Loader";
import {usePathname, useRouter} from "next/navigation";

function RouteProtectorWrapper ({children}: any) {

    // Auth Data
    const {accessToken, user, authLoading} = useSelector((state: any) => state.Auth)

    // Data
    let isAuth = !authLoading && accessToken && user && user._id
    let role = (user && user?.role && typeof user.role === "string") ? user?.role : null
    let pathname = usePathname()
    let router = useRouter()





    // Public Routes
    const publicRoutes = [
        "/articles",
        "/about",
        "/contact",
    ]

    // Auth Routes
    const authRoutes = [
        "/login",
        "/register",
        "/forgot-password",
        "/verify-otp",
        "/reset-password",
        "/verify-account",
    ]

    // Private routes
    const privateRoutes = [
        "/account",
        "/account/notifications",
        "/account/change-password",
    ]

    // Protected Routes
    const protectedRoutes = [
        "/dashboard",
        "/dashboard/users",
        "/dashboard/articles",
        "/dashboard/articles/add",
        "/dashboard/articles/view",
        "/dashboard/articles/edit",
        "/dashboard/articles/categories",
        "/dashboard/articles/tags",
        "/dashboard/articles/comments",
        "/dashboard/contacts",
        "/dashboard/contacts/view",
        "/dashboard/notifications",
        "/dashboard/media",
        "/dashboard/settings/app",
        "/dashboard/settings/contact",
    ]




    // Current Route type
    const isPublicRoute = pathname === "/" || publicRoutes?.some((route) => (pathname === route || pathname.startsWith(route)))
    const isAutRoute = (authRoutes?.some((route) => (pathname === route || pathname.startsWith(route))))
    const isPrivateRoute = (privateRoutes?.some((route) => (pathname === route || pathname.startsWith(route))))
    const isProtectedRoute = (protectedRoutes?.some((route) => (pathname === route || pathname.startsWith(route))))




    // If Auth Loading
    if (authLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <Loader size={25}/>
            </div>
        )
    } else if (isPublicRoute) {
        return children
    } else if (isAutRoute) {
        if (isAuth) {
            return router.push("/")
        } else {
            return children
        }
    } else if (isPrivateRoute) {
        if (isAuth) {
            return children
        } else {
            return router.push("/login")
        }
    } else if (isProtectedRoute) {
        if (isAuth && role) {
            if (pathname === "/dashboard" && ["JOURNALIST", "EDITOR", "MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
                return children
            } else if (pathname === "/dashboard/users" && ["ADMIN", "SUPER_ADMIN"].includes(role)) {
                return children
            } else if (pathname === "/dashboard/articles" && ["JOURNALIST", "EDITOR", "MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
                return children
            } else if (pathname === "/dashboard/articles/add" && ["JOURNALIST"].includes(role)) {
                return children
            } else if (pathname.startsWith("/dashboard/articles/view/") && ["JOURNALIST", "EDITOR", "MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
                return children
            } else if (pathname.startsWith("/dashboard/articles/edit/") && ["JOURNALIST", "EDITOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
                return children
            } else if (pathname === "/dashboard/articles/categories" && ["ADMIN", "SUPER_ADMIN"].includes(role)) {
                return children
            } else if (pathname === "/dashboard/articles/tags" && ["ADMIN", "SUPER_ADMIN"].includes(role)) {
                return children
            } else if (pathname === "/dashboard/articles/comments" && ["JOURNALIST", "EDITOR", "MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
                return children
            } else if ((pathname === "/dashboard/contacts" || pathname.startsWith("/dashboard/contacts/view/")) && ["ADMIN", "SUPER_ADMIN"].includes(role)) {
                return children
            } else if (pathname === "/dashboard/notifications" && ["JOURNALIST", "EDITOR", "MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
                return children
            } else if (pathname === "/dashboard/media" && ["JOURNALIST", "EDITOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
                return children
            } else if ((pathname === "/dashboard/settings/app" || pathname === "/dashboard/settings/contact") && ["ADMIN", "SUPER_ADMIN"].includes(role)) {
                return children
            }

            return router.push("/not-found")
        } else {
            return router.push("/not-found")
        }
    } else {
        return children
    }
}

export default RouteProtectorWrapper;