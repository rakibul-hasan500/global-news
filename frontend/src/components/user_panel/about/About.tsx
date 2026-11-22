"use client";
import Link from "next/link";
import {FiArrowRight, FiGlobe, FiTarget, FiEye, FiShield, FiBookOpen, FiUsers, FiZap, FiCheckCircle, FiTrendingUp, FiMonitor, FiBriefcase, FiActivity,} from "react-icons/fi";

function About() {

    // Values
    const values = [
        {
            icon: <FiShield />,
            title: "Accuracy & Trust",
            description: "We prioritize accurate, verified information and responsible journalism to earn and maintain our readers' trust.",
        },
        {
            icon: <FiZap />,
            title: "Timely Reporting",
            description: "We work to deliver important news and updates as events unfold, keeping our readers informed.",
        },
        {
            icon: <FiUsers />,
            title: "Reader First",
            description: "Our readers are at the heart of everything we do. We aim to provide meaningful and accessible information.",
        },
        {
            icon: <FiGlobe />,
            title: "Global Perspective",
            description: "We cover stories from around the world and bring different perspectives to our readers.",
        },
    ];

    // Categories
    const categories = [
        {
            icon: <FiGlobe />,
            title: "World News",
            description: "Important events and developments from across the globe.",
        },
        {
            icon: <FiBriefcase />,
            title: "Business",
            description: "Business trends, markets, economy and industry updates.",
        },
        {
            icon: <FiMonitor />,
            title: "Technology",
            description: "Technology innovations, digital trends and discoveries.",
        },
        {
            icon: <FiActivity />,
            title: "Sports",
            description: "Sports news, match updates and major sporting events.",
        },
        {
            icon: <FiTrendingUp />,
            title: "Politics",
            description: "Political developments, policies and public affairs.",
        },
        {
            icon: <FiBookOpen />,
            title: "Education",
            description: "Education, learning opportunities and academic updates.",
        },
    ];

    return (
        <main className="min-h-screen bg-white text-slate-800">
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
                <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
                    {/* Hero Content */}
                    <div className="max-w-3xl">
                        {/* Label */}
                        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                            <FiGlobe size={15} />
                            About Our Platform
                        </span>

                        {/* Heading */}
                        <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                            Bringing the World Closer Through
                            <span className="text-blue-700"> Trusted News.</span>
                        </h1>

                        {/* Desc */}
                        <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                            We believe everyone deserves access to reliable,
                            meaningful and timely information. Our mission is
                            to keep people informed, connected and aware of
                            the world around them.
                        </p>

                        {/* Actions */}
                        <div className="mt-9 flex flex-wrap gap-4">
                            {/* News */}
                            <Link href="/articles" className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800">
                                Explore Latest News
                                <FiArrowRight />
                            </Link>

                            {/* contact */}
                            <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-700">
                                Contact Us
                            </Link>
                        </div>
                    </div>

                    {/* Hero Highlights */}
                    <div className="mt-20 grid grid-cols-1 gap-5 border-t border-slate-200 pt-10 sm:grid-cols-3">
                        {/* Item 1 */}
                        <div>
                            <p className="text-3xl font-bold text-blue-700">24/7</p>
                            <p className="mt-2 text-sm text-slate-500">
                                News Updates
                            </p>
                        </div>

                        {/* Item 2 */}
                        <div>
                            <p className="text-3xl font-bold text-blue-700">
                                Global
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                                News Coverage
                            </p>
                        </div>

                        {/* Item 3 */}
                        <div>
                            <p className="text-3xl font-bold text-blue-700">
                                Reader First
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                                Our Core Philosophy
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who We Are */}
            <section className="border-y border-slate-200 bg-slate-50">
                <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
                        {/* Left Content */}
                        <div className="lg:col-span-4">
                            {/* Label */}
                            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-blue-700">
                                <span className="h-0.5 w-6 bg-blue-700"></span>
                                Who We Are
                            </span>

                            {/* Heading */}
                            <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                                Understanding the World Through
                                <span className="text-blue-700"> Meaningful Stories.</span>
                            </h2>

                            {/* Desc */}
                            <p className="mt-6 text-base leading-8 text-slate-500">
                                Discover the purpose, principles, and commitment behind
                                the stories that keep people informed and connected.
                            </p>
                        </div>

                        {/* Right Content */}
                        <div className="lg:col-span-8">
                            {/* Main Content */}
                            <div className="space-y-7 text-base leading-8 text-slate-600">
                                {/* Paragraph 1 */}
                                <p>
                                    We believe information has the power to shape perspectives,
                                    inspire meaningful conversations, and connect people with
                                    the world around them. Our goal is to make accurate, relevant,
                                    and trustworthy information accessible to everyone while
                                    encouraging curiosity and awareness.
                                </p>

                                {/* Paragraph 2 */}
                                <p>
                                    We cover a wide range of topics, including politics, business,
                                    technology, education, science, sports, culture, and international
                                    affairs. With a strong commitment to accuracy, fairness, and
                                    transparency, we aim to go beyond reporting events by providing
                                    meaningful context and diverse perspectives.
                                </p>

                                {/* Paragraph 3 */}
                                <p>
                                    Our commitment is to build trust, encourage critical thinking,
                                    and contribute to a more informed society through responsible
                                    storytelling. We continuously strive to improve the quality
                                    and accessibility of the information we share, helping people
                                    stay connected with the stories and developments that matter.
                                </p>
                            </div>

                            {/* Highlight */}
                            <div className="mt-10 border-l-4 border-blue-700 bg-white px-6 py-6 shadow-sm sm:px-8">
                                <p className="text-lg font-semibold leading-8 text-slate-800">
                                    "Being informed is not just about knowing what is
                                    happening; it is about understanding the world
                                    around us."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="border-y border-slate-200 bg-slate-50">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-24">
                    {/* Card 1 */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10">
                        {/* Icon */}
                        <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                            <FiTarget size={24} />
                        </div>

                        {/* Title */}
                        <h3 className="mt-7 text-2xl font-bold text-slate-900">
                            Our Mission
                        </h3>

                        {/* Content */}
                        <p className="mt-4 leading-8 text-slate-600">
                            To deliver accurate, timely and meaningful news
                            that empowers people with knowledge, encourages
                            critical thinking and helps them understand the
                            world around them.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10">
                        {/* Icon */}
                        <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                            <FiEye size={24} />
                        </div>

                        {/* Title */}
                        <h3 className="mt-7 text-2xl font-bold text-slate-900">
                            Our Vision
                        </h3>

                        {/* Content */}
                        <p className="mt-4 leading-8 text-slate-600">
                            To become a trusted digital media destination
                            where people from different backgrounds can
                            access reliable information and gain a broader
                            understanding of global events.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
                {/* Section Title */}
                <div className="mx-auto max-w-2xl text-center">
                    {/* Label */}
                    <span className="text-sm font-bold uppercase tracking-widest text-blue-700">
                        What Guides Us
                    </span>

                    {/* Title */}
                    <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                        Our Core Values
                    </h2>

                    {/* Desc */}
                    <p className="mt-5 leading-8 text-slate-600">
                        The principles that shape our journalism, guide our
                        decisions and define our relationship with readers.
                    </p>
                </div>

                {/* Items */}
                <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {values.map((value, index) => (
                        <div key={index} className="rounded-xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
                            {/* Icon */}
                            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                                {value.icon}
                            </div>

                            {/* Title */}
                            <h3 className="mt-6 text-lg font-bold text-slate-900">
                                {value.title}
                            </h3>

                            {/* Desc */}
                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* What We Cover */}
            <section className="border-y border-slate-200 bg-slate-50">
                <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
                    {/* Section Title */}
                    <div className="max-w-2xl">
                        {/* Label */}
                        <span className="text-sm font-bold uppercase tracking-widest text-blue-700">
                            Our Coverage
                        </span>

                        {/* Title */}
                        <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                            Stories That Matter
                        </h2>

                        {/* Desc */}
                        <p className="mt-5 leading-8 text-slate-600">
                            We cover a wide range of topics to help our readers
                            stay informed about the issues and developments
                            that shape our world.
                        </p>
                    </div>

                    {/* Items */}
                    <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category, index) => (
                            <div key={index} className="flex gap-5 rounded-xl border border-slate-200 bg-white p-6 transition hover:border-blue-300">
                                {/* Icon */}
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-700">
                                    {category.icon}
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        {category.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-7 text-slate-600">
                                        {category.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Commitment */}
            <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    {/* Left */}
                    <div>
                        {/* Label */}
                        <span className="text-sm font-bold uppercase tracking-widest text-blue-700">
                            Our Commitment
                        </span>

                        {/* Title */}
                        <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                            Journalism With Responsibility and Purpose
                        </h2>

                        {/* Content */}
                        <p className="mt-6 leading-8 text-slate-600">
                            We understand the responsibility that comes with
                            sharing information. We aim to maintain editorial
                            integrity, respect different perspectives and
                            continuously improve the quality of our content.
                        </p>
                    </div>

                    {/* Right */}
                    <div className="space-y-5">
                        {[
                            "Prioritize accuracy and factual information",
                            "Respect diverse opinions and perspectives",
                            "Promote responsible and ethical journalism",
                            "Keep readers informed with relevant updates",
                        ].map((item, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <FiCheckCircle className="mt-1 shrink-0 text-xl text-blue-700" />
                                <p className="leading-7 text-slate-700">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-blue-700">
                <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 lg:py-20">
                    {/* Title */}
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">
                        Stay Informed. Stay Connected.
                    </h2>

                    {/* Desc */}
                    <p className="mx-auto mt-5 max-w-2xl leading-8 text-blue-100">
                        Explore the latest stories, discover new perspectives
                        and stay connected with the events shaping our world.
                    </p>

                    {/* Actions */}
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        {/* News */}
                        <Link href="/articles" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50">
                            Read Latest News
                            <FiArrowRight />
                        </Link>

                        {/* contact */}
                        <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg border border-blue-400 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800">
                            Get In Touch
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default About;