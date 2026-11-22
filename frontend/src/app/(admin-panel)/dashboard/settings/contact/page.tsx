"use client";
import { useEffect, useState } from "react";
import {FiMail, FiPhone, FiMapPin, FiClock, FiGlobe, FiFacebook, FiInstagram, FiYoutube, FiLinkedin, FiTwitter, FiFileText, FiSearch, FiSave,} from "react-icons/fi";
import { responseHandler } from "@/utils/responseHandler";
import { zodErrorHandler } from "@/utils/zodErrorHandler";
import Loader from "@/components/common/other/Loader";
import { useSelector } from "react-redux";
import {contactSettingsSchema} from "@/validation/settings.validation";
import {useGetSettingsQuery, useUpdateContactSettingsMutation} from "@/redux/services/settings/settingsApi";

// contact Settings Page
function ContactSettingsPage() {

    // Data From Redux Store
    const { user, accessToken } = useSelector((state: any) => state.Auth);




    // General Information States
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // contact Information States
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [workingHours, setWorkingHours] = useState("");

    // Social Media States
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");
    const [youtube, setYoutube] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [twitter, setTwitter] = useState("");




    // Call Get Settings API
    const {data: settingsData, isLoading: settingsDataLoading} = useGetSettingsQuery("contact", {
        skip: !user || !["ADMIN", "SUPER_ADMIN"].includes(user?.role) || !accessToken
    });
    const settings = settingsData?.data?.data;

    // Populate Form With API Data
    useEffect(() => {
        if (!settings) return;

        // General Information
        setTitle(settings?.title ?? "");
        setDescription(settings?.description ?? "");

        // contact Information
        setEmail(settings?.email ?? "");
        setPhone(settings?.phone ?? "");
        setAddress(settings?.address ?? "");
        setWorkingHours(settings?.workingHours ?? "");

        // Social Media
        setFacebook(settings?.socialLinks?.facebook ?? "");
        setInstagram(settings?.socialLinks?.instagram ?? "");
        setYoutube(settings?.socialLinks?.youtube ?? "");
        setLinkedin(settings?.socialLinks?.linkedin ?? "");
        setTwitter(settings?.socialLinks?.twitter ?? "");
    }, [settingsData]);



    // Call Update contact Settings API
    const [updateContactSettings, {isLoading: contactSettingsUpdateLoading}] = useUpdateContactSettingsMutation();

    // Submit contact Settings
    const handleSubmitContactSettings = async (e: any) => {
        e.preventDefault();
        try {
            // Request Data
            const data = {
                title,
                description,
                email,
                phone,
                address,
                workingHours,
                socialLinks: {
                    facebook,
                    instagram,
                    youtube,
                    linkedin,
                    twitter,
                }
            };

            // Validate
            const validate = contactSettingsSchema.safeParse(data);
            if (!validate.success) {
                return zodErrorHandler(validate);
            }

            // Hit Update contact Settings
            const response = await updateContactSettings(data).unwrap();

            // Reset States
            setTitle("")
            setDescription("")
            setEmail("")
            setPhone("")
            setAddress("")
            setWorkingHours("")
            setFacebook("")
            setInstagram("")
            setYoutube("")
            setLinkedin("")
            setTwitter("")

            responseHandler("S", response?.message);
        } catch (error: any) {
            responseHandler("E", error?.data?.message || "Unable to update contact settings.");
        }
    };


    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Contact Settings
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your website contact information and social media links.
                    </p>
                </div>
            </div>

            {/* contact Settings Form */}
            <form id="contact-settings-form" onSubmit={(e)=>handleSubmitContactSettings(e)} className="space-y-6">
                {/* General Information */}
                <section className="rounded-xl border border-gray-200 bg-white">
                    {/* Form Title */}
                    <div className="border-b border-gray-200 px-5 py-4">
                        <h2 className="text-base font-semibold text-gray-800">
                            General Information
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Configure the main heading and description of your contact page.
                        </p>
                    </div>

                    {/* Forms */}
                    <div className="space-y-5 p-5">
                        {/* Title */}
                        <div>
                            {/* Label */}
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Page Title
                            </label>

                            {/* Input */}
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Contact Us"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            {/* Label */}
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Description
                            </label>

                            {/* Input */}
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Write a short description for your contact page..."
                                rows={4}
                                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>
                </section>

                {/* contact Information */}
                <section className="rounded-xl border border-gray-200 bg-white">
                    {/* Form Title */}
                    <div className="border-b border-gray-200 px-5 py-4">
                        <h2 className="text-base font-semibold text-gray-800">
                            Contact Information
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage the contact details displayed on your website.
                        </p>
                    </div>

                    {/* Forms */}
                    <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
                        {/* Email */}
                        <div>
                            {/* Label */}
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                <span className="inline-flex items-center gap-2">
                                    <FiMail className="text-gray-500" />
                                    Email Address
                                </span>
                            </label>

                            {/* Input */}
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="contact@example.com"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            {/* Label */}
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                <span className="inline-flex items-center gap-2">
                                    <FiPhone className="text-gray-500" />
                                    Phone Number
                                </span>
                            </label>

                            {/* Input */}
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+880 1XXXXXXXXX"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            {/* Label */}
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                <span className="inline-flex items-center gap-2">
                                    <FiMapPin className="text-gray-500" />
                                    Office Address
                                </span>
                            </label>

                            {/* Input */}
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your office address"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Working Hours */}
                        <div>
                            {/* Label */}
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                <span className="inline-flex items-center gap-2">
                                    <FiClock className="text-gray-500" />
                                    Working Hours
                                </span>
                            </label>

                            {/* Input */}
                            <input
                                type="text"
                                value={workingHours}
                                onChange={(e) => setWorkingHours(e.target.value)}
                                placeholder="Saturday - Thursday, 9 AM - 6 PM"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>
                </section>

                {/* Social Media Links */}
                <section className="rounded-xl border border-gray-200 bg-white">
                    {/* Form Title */}
                    <div className="border-b border-gray-200 px-5 py-4">
                        <h2 className="text-base font-semibold text-gray-800">
                            Social Media Links
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Add your official social media profile URLs.
                        </p>
                    </div>

                    {/* Forms */}
                    <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
                        {/* Facebook */}
                        <div>
                            {/* Label */}
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                <span className="inline-flex items-center gap-2">
                                    <FiFacebook className="text-gray-500" />
                                    Facebook
                                </span>
                            </label>

                            {/* Input */}
                            <input
                                type="url"
                                value={facebook}
                                onChange={(e) => setFacebook(e.target.value)}
                                placeholder="https://facebook.com/yourpage"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Instagram */}
                        <div>
                            {/* Label */}
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                <span className="inline-flex items-center gap-2">
                                    <FiInstagram className="text-gray-500" />
                                    Instagram
                                </span>
                            </label>

                            {/* Input */}
                            <input
                                type="url"
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                                placeholder="https://instagram.com/yourpage"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* YouTube */}
                        <div>
                            {/* Label */}
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                <span className="inline-flex items-center gap-2">
                                    <FiYoutube className="text-gray-500" />
                                    YouTube
                                </span>
                            </label>

                            {/* Input */}
                            <input
                                type="url"
                                value={youtube}
                                onChange={(e) => setYoutube(e.target.value)}
                                placeholder="https://youtube.com/@yourchannel"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* LinkedIn */}
                        <div>
                            {/* Label */}
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                <span className="inline-flex items-center gap-2">
                                    <FiLinkedin className="text-gray-500" />
                                    LinkedIn
                                </span>
                            </label>

                            {/* Input */}
                            <input
                                type="url"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                                placeholder="https://linkedin.com/company/yourpage"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Twitter */}
                        <div>
                            {/* Label */}
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                <span className="inline-flex items-center gap-2">
                                    <FiTwitter className="text-gray-500" />
                                    X / Twitter
                                </span>
                            </label>

                            {/* Input */}
                            <input
                                type="url"
                                value={twitter}
                                onChange={(e) => setTwitter(e.target.value)}
                                placeholder="https://x.com/yourpage"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>
                </section>

                {/* Bottom Save Button */}
                <div className="flex justify-end">
                    <button type="submit" disabled={contactSettingsUpdateLoading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60">
                        <FiSave size={17} />
                        {contactSettingsUpdateLoading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ContactSettingsPage;
