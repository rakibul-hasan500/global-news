"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import {FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube, FaEnvelope, FaPhone, FaLocationDot, FaArrowRight} from "react-icons/fa6";

function Footer() {

    // Redux Data
    const appSettings = useSelector((state: any) => state.Settings?.app);
    const contactSettings = useSelector((state: any) => state.Settings?.contact);
    const categories = useSelector((state: any) => state.Category?.allCategories);
    const user = useSelector((state: any) => state.Auth?.user);

    // App Information
    const appName = appSettings?.appName || "Global News";
    const appDescription = appSettings?.appDescription || "Stay informed with the latest news, stories, and updates from around the world.";
    const logo = appSettings?.logo?.url;

    // Social Links
    const socialLinks = [
        {
            name: "Facebook",
            url: contactSettings?.socialLinks?.facebook,
            icon: FaFacebookF
        },
        {
            name: "Instagram",
            url: contactSettings?.socialLinks?.instagram,
            icon: FaInstagram
        },
        {
            name: "X",
            url: contactSettings?.socialLinks?.twitter,
            icon: FaXTwitter
        },
        {
            name: "LinkedIn",
            url: contactSettings?.socialLinks?.linkedin,
            icon: FaLinkedinIn
        },
        {
            name: "YouTube",
            url: contactSettings?.socialLinks?.youtube,
            icon: FaYoutube
        }
    ].filter((social) => social.url);

    // Current Year
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-950 text-slate-300">
            {/* Main Footer */}
            <div className="mx-auto base-container py-14 sm:px-8 lg:px-10">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
                    {/* Brand Information */}
                    <div className="lg:col-span-1">
                        {/* Logo */}
                        <Link href="/" className="mb-5 inline-flex items-center gap-3 bg-white px-2 py-1 rounded">
                            {logo ? (
                                <img
                                    src={logo}
                                    alt={appName}
                                    className="h-11 w-auto max-w-40 object-contain"
                                />
                            ) : (
                                <span className="text-2xl font-bold tracking-tight text-white">
                                    {appName}
                                </span>
                            )}
                        </Link>

                        {/* Description */}
                        <p className="max-w-sm text-sm leading-7 text-slate-400">
                            {appDescription}
                        </p>

                        {/* Social Links */}
                        {socialLinks.length > 0 && (
                            <div className="mt-6 flex items-center gap-3">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white">
                                            <Icon size={14} />
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div>
                        {/* Title */}
                        <h3 className="mb-6 text-base font-semibold text-white">
                            Quick Links
                        </h3>

                        {/* Links */}
                        <ul className="space-y-4 text-sm">
                            {/* Item 1 */}
                            <li>
                                <Link href="/" className="transition hover:text-blue-400">
                                    Home
                                </Link>
                            </li>

                            {/* Item 2 */}
                            <li>
                                <Link href="/articles" className="transition hover:text-blue-400">
                                    Latest News
                                </Link>
                            </li>

                            {/* Item 3 */}
                            <li>
                                <Link href="/about" className="transition hover:text-blue-400">
                                    About Us
                                </Link>
                            </li>

                            {/* Item 4 */}
                            <li>
                                <Link href="/contact" className="transition hover:text-blue-400">
                                    Contact Us
                                </Link>
                            </li>

                            {/* Account / Login */}
                            <li>
                                <Link href={user ? "/account" : "/login"} className="transition hover:text-blue-400">
                                    {user ? "My Account" : "Login"}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        {/* Title */}
                        <h3 className="mb-6 text-base font-semibold text-white">
                            Categories
                        </h3>

                        {/* Nav Links */}
                        <ul className="space-y-4 text-sm">
                            {/* Categories */}
                            {Array.isArray(categories) && categories.filter((category: any) => category?.slug && category?.name).slice(0, 6).map((category: any) => (
                                <li key={category._id}>
                                    <Link href={`/articles?category=${encodeURIComponent(category.slug)}`} className="transition hover:text-blue-400">
                                        {category.name}
                                    </Link>
                                </li>
                            ))}

                            {/* No Categories */}
                            {(!Array.isArray(categories) || categories.length === 0) && (
                                <li className="text-slate-500">
                                    Categories will appear here.
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        {/* Title */}
                        <h3 className="mb-6 text-base font-semibold text-white">
                            Contact Information
                        </h3>

                        {/* Data */}
                        <ul className="space-y-5 text-sm">
                            {/* Email */}
                            {contactSettings?.email && (
                                <li className="flex items-start gap-3">
                                    <FaEnvelope className="mt-1 shrink-0 text-blue-400" />
                                    <a href={`mailto:${contactSettings.email}`} className="break-all transition hover:text-blue-400">
                                        {contactSettings.email}
                                    </a>
                                </li>
                            )}

                            {/* Phone */}
                            {contactSettings?.phone && (
                                <li className="flex items-start gap-3">
                                    <FaPhone className="mt-1 shrink-0 text-blue-400" />
                                    <a href={`tel:${contactSettings.phone}`} className="transition hover:text-blue-400">
                                        {contactSettings.phone}
                                    </a>
                                </li>
                            )}

                            {/* Address */}
                            {contactSettings?.address && (
                                <li className="flex items-start gap-3">
                                    <FaLocationDot className="mt-1 shrink-0 text-blue-400" />
                                    <span className="leading-6 text-slate-400">
                                        {contactSettings.address}
                                    </span>
                                </li>
                            )}
                        </ul>

                        {/* Contact CTA */}
                        <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition hover:text-blue-300">
                            Get in Touch
                            <FaArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-slate-800">
                <div className="mx-auto flex base-container flex-col items-center justify-between gap-4 py-6 text-center sm:px-8 md:flex-row md:text-left lg:px-10">
                    {/* Copyright Text */}
                    <p className="text-xs text-slate-500">
                        © {currentYear} {appName}. All rights reserved.
                    </p>

                    {/* Links */}
                    <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500">
                        {/* Item 1 */}
                        <Link href="/about" className="transition hover:text-blue-400">
                            About Us
                        </Link>

                        {/* Item 2 */}
                        <Link href="/contact" className="transition hover:text-blue-400">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;