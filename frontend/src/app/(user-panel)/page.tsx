"use client"
import HeroSection from "@/components/user_panel/home/HeroSection";
import BreakingNewsSection from "@/components/user_panel/home/BreakingNewsSection";
import NewsSidebar from "@/components/user_panel/sidebar/NewsSidebar";
import PoliticsSection from "@/components/user_panel/home/PoliticsSection";
import SportsSection from "@/components/user_panel/home/SportsSection";
import BusinessSection from "@/components/user_panel/home/BusinessSection";
import {useGetSettingsQuery} from "@/redux/services/settings/settingsApi";
import {FiArrowUpRight, FiFacebook, FiInstagram, FiLinkedin, FiTwitter, FiYoutube} from "react-icons/fi";
import TechnologySection from "@/components/user_panel/home/TechnologySection";

async function HomePage() {

    // Get Contact Settings
    const {data: settingsData} = useGetSettingsQuery("contact");

    // Contact Data
    const contact = settingsData?.data?.data;

    // Social Media Links
    const socialLinks = [
        {
            name: "Facebook",
            url: contact?.socialLinks?.facebook,
            icon: <FiFacebook />,
        },
        {
            name: "Instagram",
            url: contact?.socialLinks?.instagram,
            icon: <FiInstagram />,
        },
        {
            name: "YouTube",
            url: contact?.socialLinks?.youtube,
            icon: <FiYoutube />,
        },
        {
            name: "LinkedIn",
            url: contact?.socialLinks?.linkedin,
            icon: <FiLinkedin />,
        },
        {
            name: "Twitter",
            url: contact?.socialLinks?.twitter,
            icon: <FiTwitter />,
        },
    ].filter((social) => social.url);


    return (
        <>
            {/* Hero Section */}
            <HeroSection />

            {/* Breaking News */}
            <BreakingNewsSection />

            {/* Technology Section */}
            <div className="base-container px-4 py-8 sm:px-8 lg:px-10 space-y-10">
                <TechnologySection />
            </div>

            {/* Main Sections */}
            <div className="base-container px-4 py-8 sm:px-8 lg:px-10 space-y-10 pb-20">
                {/* Top Items */}
                <div className="flex justify-between gap-8">
                    {/* News Items */}
                    <div className="flex-1 space-y-10">
                        {/* Politics */}
                        <PoliticsSection />

                        {/* Sports */}
                        <SportsSection />
                    </div>

                    {/* Sidebar & Social Media */}
                    <div className="hidden xl:flex xl:flex-col space-y-10 min-w-90 max-w-90">
                        {/* Sidebar */}
                        <NewsSidebar />

                        {/* Social Media */}
                        {socialLinks.length > 0 && (
                            <div className="w-full shrink-0">
                                {/* Section Title */}
                                <div className="mb-5">
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Follow Us
                                    </h3>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Stay connected with us on social media.
                                    </p>
                                </div>

                                {/* Social Links */}
                                <div className="space-y-4">
                                    {socialLinks.map((social) => (
                                        <a key={social?.name} href={social?.url} target="_blank" rel="noopener noreferrer" aria-label={`Follow us on ${social.name}`} className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700">
                                            <span className="flex items-center gap-3">
                                                <span className="text-lg">
                                                    {social?.icon}
                                                </span>
                                                {social?.name}
                                            </span>
                                            <FiArrowUpRight className="shrink-0 text-slate-400 transition group-hover:text-blue-700" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Business Section */}
                <BusinessSection />
            </div>
        </>
    )
}

export default HomePage;

