"use client";
import {FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiArrowUpRight, FiFacebook, FiInstagram, FiYoutube, FiLinkedin, FiTwitter, FiMessageSquare, FiGlobe,} from "react-icons/fi";
import {useGetSettingsQuery} from "@/redux/services/settings/settingsApi";
import {responseHandler} from "@/utils/responseHandler";
import {useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import {useCreateContactMessageMutation} from "@/redux/services/contact/contactApi";
import {useState} from "react";
import {createContactMessageSchema} from "@/validation/contact.validation";
import {zodErrorHandler} from "@/utils/zodErrorHandler";

function ContactPage() {

    // Router
    const router = useRouter()

    // Current User From Redux
    const {user} = useSelector((state: any) => state.Auth)



    // contact Form States
    const [fullName, setFullName] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")



    // Get contact Settings
    const {data: settingsData, isLoading} = useGetSettingsQuery("contact");
    const contact = settingsData?.data?.data;
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



    // Call create contact Message API
    const [createContactMessage, {isLoading: createContactMessageLoading}] = useCreateContactMessageMutation()

    // Handle Submit contact Form
    const handleSubmitContactForm = async (e: any) => {
        e.preventDefault();
        try {
            // Check Logged In
            if (!user?._id) {
                router.push("/login");
                return;
            }

            // "ADMIN", "SUPER_ADMIN" Can't Submit
            if (["ADMIN", "SUPER_ADMIN"].includes(user?.role)) {
                responseHandler("E", "You cannot submit this contact form.");
                return;
            }

            // Validate
            const validate = createContactMessageSchema.safeParse({
                fullName,
                subject,
                message
            })
            if(!validate?.success) {
                return zodErrorHandler(validate)
            }

            // Hit create contact Message API
            const response = await createContactMessage(validate.data).unwrap()

            // Reset States
            setFullName("")
            setSubject("")
            setMessage("")

            return responseHandler("S", response?.message)
        } catch (error: any) {
            return responseHandler("E", error?.data?.message)
        }
    }



    // Loading State
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="size-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white text-slate-800">
            {/* Hero Section */}
            <section className="border-b border-slate-200 bg-slate-50">
                <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
                    <div className="max-w-3xl">
                        {/* Label */}
                        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                            <FiMessageSquare />
                            Get In Touch
                        </span>

                        {/* Title */}
                        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                            {contact?.title || "We'd Love to Hear From You"}
                        </h1>

                        {/* Desc */}
                        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                            {contact?.description || "Have a question, suggestion, or feedback? We'd love to hear from you. Reach out to us and let's start a conversation."}
                        </p>
                    </div>
                </div>
            </section>

            {/* contact Content */}
            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                    {/* contact Information */}
                    <div className="lg:col-span-5">
                        {/* Section Title */}
                        <div>
                            {/* Label */}
                            <span className="text-sm font-bold uppercase tracking-widest text-blue-700">
                                Contact Information
                            </span>

                            {/* Title */}
                            <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                                Let's Start a Conversation
                            </h2>

                            {/* Desc */}
                            <p className="mt-5 leading-8 text-slate-600">
                                Whether you have a question, want to share
                                your thoughts, or need assistance, our team
                                is always happy to connect with you.
                            </p>
                        </div>

                        {/* contact Details */}
                        <div className="mt-10 space-y-9">
                            {/* Email */}
                            {contact?.email && (
                                <a href={`mailto:${contact?.email}`} className="group flex items-start gap-5">
                                    {/* Icon */}
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                                        <FiMail />
                                    </div>

                                    {/* Data */}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-500">
                                            Email Address
                                        </p>
                                        <p className="mt-1 break-all font-semibold text-slate-900 transition group-hover:text-blue-700">
                                            {contact?.email}
                                        </p>
                                    </div>

                                    {/* Icon */}
                                    <FiArrowUpRight className="mt-1 text-lg text-slate-400 transition group-hover:text-blue-700" />
                                </a>
                            )}

                            {/* Phone */}
                            {contact?.phone && (
                                <a href={`tel:${contact?.phone}`} className="group flex items-start gap-5">
                                    {/* Icon */}
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                                        <FiPhone />
                                    </div>

                                    {/* Data */}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-500">
                                            Phone Number
                                        </p>
                                        <p className="mt-1 font-semibold text-slate-900 transition group-hover:text-blue-700">
                                            {contact?.phone}
                                        </p>
                                    </div>

                                    {/* Icon */}
                                    <FiArrowUpRight className="mt-1 text-lg text-slate-400 transition group-hover:text-blue-700" />
                                </a>
                            )}

                            {/* Address */}
                            {contact?.address && (
                                <div className="flex items-start gap-5">
                                    {/* Icon */}
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                                        <FiMapPin />
                                    </div>

                                    {/* Data */}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-500">
                                            Our Address
                                        </p>
                                        <p className="mt-1 whitespace-pre-line leading-7 font-semibold text-slate-900">
                                            {contact?.address}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Working Hours */}
                            {contact?.workingHours && (
                                <div className="flex items-start gap-5">
                                    {/* Icon */}
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                                        <FiClock />
                                    </div>

                                    {/* Data */}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-500">
                                            Working Hours
                                        </p>
                                        <p className="mt-1 whitespace-pre-line leading-7 font-semibold text-slate-900">
                                            {contact?.workingHours}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Social Media */}
                        {socialLinks.length > 0 && (
                            <div className="mt-12 border-t border-slate-200 pt-8">

                                <h3 className="font-bold text-slate-900">
                                    Connect With Us
                                </h3>

                                <p className="mt-2 text-sm leading-7 text-slate-500">
                                    Follow us on social media to stay
                                    connected and get the latest updates.
                                </p>

                                <div className="mt-5 flex flex-wrap gap-3">

                                    {socialLinks.map((social) => (
                                        <a
                                            key={social.name}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.name}
                                            title={social.name}
                                            className="flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-blue-700 hover:bg-blue-700 hover:text-white"
                                        >
                                            {social.icon}
                                        </a>
                                    ))}

                                </div>

                            </div>
                        )}
                    </div>

                    {/* contact Form */}
                    <div className="lg:col-span-7">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9 lg:p-10">
                            {/* Form Title */}
                            <div className="mb-8">
                                {/* Label */}
                                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-blue-700">
                                    <FiSend />
                                    Send Us a Message
                                </span>

                                {/* Title */}
                                <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                                    We'd Love to Hear From You
                                </h2>

                                {/* Desc */}
                                <p className="mt-3 text-sm leading-7 text-slate-500">
                                    Fill out the form below and share
                                    your thoughts with us.
                                </p>
                            </div>

                            {/* Static contact Form */}
                            <form onSubmit={(e) => handleSubmitContactForm(e)} className="space-y-6">
                                {/* Name */}
                                <div>
                                    {/* Label */}
                                    <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                                        Full Name
                                    </label>

                                    {/* Input */}
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Enter your full name"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    {/* Label */}
                                    <label htmlFor="subject" className="mb-2 block text-sm font-semibold text-slate-700">
                                        Subject
                                    </label>

                                    {/* Input */}
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        placeholder="What is your message about?"
                                        required
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    {/* Label */}
                                    <label htmlFor="message" className="mb-2 block text-sm font-semibold text-slate-700">
                                        Your Message
                                    </label>

                                    {/* Input */}
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={6}
                                        placeholder="Write your message here..."
                                        required
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button type="submit" disabled={createContactMessageLoading} className={`inline-flex w-full items-center justify-center gap-3 rounded-lg bg-blue-700 px-6 py-4 text-sm font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:w-auto ${createContactMessageLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                                    {createContactMessageLoading ? "Sending..." : "Send Message"}
                                    {createContactMessageLoading ? (
                                        <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    ) : (
                                        <FiSend />
                                    )}
                                </button>

                                {/* Hint */}
                                <p className="text-xs leading-6 text-slate-400">
                                    Your information will only be used
                                    to respond to your inquiry.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="border-t border-slate-200 bg-slate-50">
                <div className="mx-auto max-w-7xl px-5 py-12 text-center sm:px-8">
                    {/* Icon */}
                    <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-blue-50 text-2xl text-blue-700">
                        <FiGlobe />
                    </div>

                    {/* Title */}
                    <h2 className="mt-5 text-2xl font-bold text-slate-900">
                        Your Voice Matters
                    </h2>

                    {/* Desc */}
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
                        Questions, feedback, and suggestions help us
                        improve. Thank you for taking the time to
                        connect with us.
                    </p>
                </div>
            </section>
        </main>
    );
}

export default ContactPage;
