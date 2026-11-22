import {NextRequest, NextResponse} from "next/server";

export async function proxy(request: NextRequest) {

    // Data
    let isAuth = false
    let role: "USER" | "JOURNALIST" | "EDITOR" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN" | null = null
    let pathname = request.nextUrl.pathname

    // Fetch Session
    try {
        // Refresh Token From Incoming Request
        const refreshToken = request.cookies.get("refreshToken")?.value;

        // Call Api
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/session`, {
            method: "POST",
            headers: {
                "refreshToken": refreshToken ? refreshToken : ""
            },
            cache: "no-cache",
        })

        // Data
        const data = await response.json()

        // Extract Data
        isAuth = data?.data?.isAuth
        role = data?.data?.role
    } catch (error) {
        console.error("Session Validation Error:", error)
    }





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





    // If Public Route
    const isPublicRoute = pathname === "/" || publicRoutes?.some((route) => (pathname === route || pathname.startsWith(route)))
    if(isPublicRoute) {
        return NextResponse.next()
    }

    // If Auth Route
    const isAutRoute = (authRoutes?.some((route) => (pathname === route || pathname.startsWith(route))))
    if(isAutRoute) {
        if (isAuth) {
            return NextResponse.redirect(new URL("/", request.url))
        } else {
           return NextResponse.next()
        }
    }

    // If Private Route
    const isPrivateRoute = (privateRoutes?.some((route) => (pathname === route || pathname.startsWith(route))))
    if(isPrivateRoute) {
        if (isAuth) {
            return NextResponse.next()
        } else {
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    // If Protected Route
    const isProtectedRoute = (protectedRoutes?.some((route) => (pathname === route || pathname.startsWith(route))))
    if(isProtectedRoute) {
        if (isAuth && role) {
            if (pathname === "/dashboard" && ["JOURNALIST", "EDITOR", "MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
                return NextResponse.next()
            } else if (pathname === "/dashboard/users" && ["ADMIN", "SUPER_ADMIN"].includes(role)) {
                return NextResponse.next()
            } else if (pathname === "/dashboard/articles" && ["JOURNALIST", "EDITOR", "MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
                return NextResponse.next()
            } else if (pathname === "/dashboard/articles/add" && ["JOURNALIST"].includes(role)) {
                return NextResponse.next()
            } else if (pathname.startsWith("/dashboard/articles/view/") && ["JOURNALIST", "EDITOR", "MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
                return NextResponse.next()
            } else if (pathname.startsWith("/dashboard/articles/edit/") && ["JOURNALIST", "EDITOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
                return NextResponse.next()
            } else if (pathname === "/dashboard/articles/categories" && ["ADMIN", "SUPER_ADMIN"].includes(role)) {
                return NextResponse.next()
            } else if (pathname === "/dashboard/articles/tags" && ["ADMIN", "SUPER_ADMIN"].includes(role)) {
                return NextResponse.next()
            } else if (pathname === "/dashboard/articles/comments" && ["JOURNALIST", "EDITOR", "MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
                return NextResponse.next()
            } else if ((pathname === "/dashboard/contacts" || pathname.startsWith("/dashboard/contacts/view/")) && ["ADMIN", "SUPER_ADMIN"].includes(role)) {
                return NextResponse.next()
            } else if (pathname === "/dashboard/notifications" && ["JOURNALIST", "EDITOR", "MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
                return NextResponse.next()
            } else if (pathname === "/dashboard/media" && ["JOURNALIST", "EDITOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
                return NextResponse.next()
            } else if ((pathname === "/dashboard/settings/app" || pathname === "/dashboard/settings/contact") && ["ADMIN", "SUPER_ADMIN"].includes(role)) {
                return NextResponse.next()
            }

            return NextResponse.redirect(new URL("/not-found", request.url))
        } else {
           return NextResponse.redirect(new URL("/not-found", request.url))
        }
    }

    return NextResponse.next()

}

export const config = {
    matcher: [
        // Public
        "/",
        "/articles",
        "/articles/:path",
        "/about",
        "/contact",

        // Auth
        "/login",
        "/register",
        "/forgot-password",
        "/verify-otp/:path",
        "/reset-password/:path",
        "/verify-account/:path",

        // Private
        "/account",
        "/account/notifications",
        "/account/change-password",

        // Protected
        "/dashboard",
        "/dashboard/users",
        "/dashboard/articles",
        "/dashboard/articles/add",
        "/dashboard/articles/view/:path",
        "/dashboard/articles/edit/:path",
        "/dashboard/articles/categories",
        "/dashboard/articles/tags",
        "/dashboard/articles/comments",
        "/dashboard/contacts",
        "/dashboard/contacts/:path",
        "/dashboard/notifications",
        "/dashboard/media",
        "/dashboard/settings/app",
        "/dashboard/settings/contact",
    ]
}