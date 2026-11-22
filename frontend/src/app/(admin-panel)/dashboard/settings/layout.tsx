"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiSettings, FiInfo, FiMail } from "react-icons/fi";

const navItems = [
    {
        label: "App",
        href: "/dashboard/settings/app",
        icon: FiSettings,
    },
    {
        label: "contact",
        href: "/dashboard/settings/contact",
        icon: FiMail,
    },
];

export default function SettingsLayout({children}: LayoutProps<"/">) {

    // Path Name
    const pathname = usePathname();

    return (
        <div className="space-y-6">
            {/* Nav Bar */}
            <nav className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-border bg-surface p-1.5 shadow-sm">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className={`group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${isActive ? "bg-primary text-background-primary shadow-sm ring-1 ring-primary-hover" : "text-text"}`}>
                            <Icon className={`text-[17px]`}/>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Pages */}
            {children}
        </div>
    );
}