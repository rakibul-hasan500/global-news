"use client";
import {ChangeEvent, useEffect, useState} from "react";
import {
    FiImage, FiInfo,
    FiSearch,
    FiSettings,
    FiUploadCloud,
    FiX,
} from "react-icons/fi";
import {responseHandler} from "@/utils/responseHandler";
import {appSettingsSchema} from "@/validation/settings.validation";
import {zodErrorHandler} from "@/utils/zodErrorHandler";
import {useGetSettingsQuery, useUpdateAppSettingsMutation} from "@/redux/services/settings/settingsApi";
import Loader from "@/components/common/other/Loader";
import {useSelector} from "react-redux";

function AppSettingsPage() {

    // Data From redux Store
    const {user, accessToken} = useSelector((state: any)=>state.Auth)



    // Form States
    const [appName, setAppName] = useState("");
    const [tagline, setTagline] = useState("");
    const [appDescription, setAppDescription] = useState("");

    // Image States
    const [logo, setLogo] = useState<File | null>(null);
    const [favicon, setFavicon] = useState<File | null>(null);

    // Image Preview States
    const [logoPreview, setLogoPreview] = useState("");
    const [faviconPreview, setFaviconPreview] = useState("");

    // SEO States
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [metaKeywords, setMetaKeywords] = useState("");



    // Handle Logo Select
    const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogo(file);
        const previewUrl = URL.createObjectURL(file);
        setLogoPreview(previewUrl);
    };

    // Handle Favicon Select
    const handleFaviconChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFavicon(file);
        const previewUrl = URL.createObjectURL(file);
        setFaviconPreview(previewUrl);
    };



    // Call Get Settings API
    const {data: settingsData, isLoading: settingsDataLoading} = useGetSettingsQuery("app", {
        skip: !user || !["ADMIN", "SUPER_ADMIN"].includes(user?.role) || !accessToken
    })
    const settings = settingsData?.data?.data

    // Set Data To States
    useEffect(() => {
        if (!settings) return;

        // Application Information
        setAppName(settings?.appName ?? "");
        setTagline(settings?.tagline ?? "");
        setAppDescription(settings?.appDescription ?? "");

        // Branding
        setLogoPreview(settings?.logo?.url ?? "");
        setFaviconPreview(settings?.favicon?.url ?? "");

        // SEO
        setMetaTitle(settings?.metaTitle ?? "");
        setMetaDescription(settings?.metaDescription ?? "");
        setMetaKeywords(settings?.metaKeywords?.join(", ") ?? "");
    }, [settingsData]);



    // Remove Logo
    const removeLogo = () => {
        setLogo(null);
        setLogoPreview(settings?.logo?.url ?? "");
    };

    // Remove Favicon
    const removeFavicon = () => {
        setFavicon(null);
        setFaviconPreview(settings?.favicon?.url ?? "");
    };



    // Call Update App Settings API
    const [updateAppSettings, {isLoading: appSettingsUpdateLoading}] = useUpdateAppSettingsMutation()

    // Handle Submit App Settings Form
    const handleSubmitAppSettingsForm = async () => {
        try {
            // Data
            const data = {
                appName,
                tagline,
                appDescription,
                logo: logo || undefined,
                favicon: favicon || undefined,
                metaTitle,
                metaDescription,
                metaKeywords
            };

            // Validate
            const validate = appSettingsSchema.safeParse(data);
            if(!validate.success) {
                return zodErrorHandler(validate)
            }

            // Form Data
            const formData = new FormData()
            formData.set("appName", appName);
            formData.set("tagline", tagline);
            formData.set("appDescription", appDescription);
            if(logo) {
                formData.set("logo", logo)
            }
            if(favicon) {
                formData.set("favicon", favicon)
            }
            formData.set("metaTitle", metaTitle)
            formData.set("metaDescription", metaDescription)
            formData.set("metaKeywords", metaKeywords)

            // Hit Update App Settings API
            const response = await updateAppSettings(formData).unwrap()

            // Reset States
            setAppName("")
            setAppDescription("")
            setTagline("")
            setLogo(null)
            setLogoPreview("")
            setFavicon(null)
            setFaviconPreview("")
            setMetaTitle("")
            setMetaDescription("")
            setMetaKeywords("")

            return responseHandler("S", response?.message)
        } catch (error: any) {
            return responseHandler("E", error?.data?.message)
        }
    };


    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-xl font-semibold text-heading">
                    App Settings
                </h1>
                <p className="mt-1 text-sm text-muted">
                    Manage your application identity and branding.
                </p>
            </div>

            {/* Application Information */}
            <section className="rounded-xl border border-border bg-background-primary">
                {/* Section Header */}
                <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                    {/* Icon */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FiInfo className="text-lg" />
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                        <h2 className="text-sm font-semibold text-heading">
                            Application Information
                        </h2>
                        <p className="text-xs text-muted">
                            Configure your application name and basic information.
                        </p>
                    </div>
                </div>

                {/* Fields */}
                <div className="space-y-5 p-5">
                    {/* App Name */}
                    <div>
                        {/* Label */}
                        <label className="mb-2 block text-sm font-medium text-text">
                            App Name
                        </label>

                        {/* Input */}
                        <input
                            type="text"
                            value={appName}
                            onChange={(e) => setAppName(e.target.value)}
                            placeholder="Enter your application name"
                            className="w-full rounded-lg border border-border bg-background-primary px-3.5 py-2.5 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    </div>

                    {/* Tagline */}
                    <div>
                        {/* Label */}
                        <label className="mb-2 block text-sm font-medium text-text">
                            Tagline
                        </label>

                        {/* Input */}
                        <input
                            type="text"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            placeholder="Enter a short tagline for your application"
                            className="w-full rounded-lg border border-border bg-background-primary px-3.5 py-2.5 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        {/* Label */}
                        <label className="mb-2 block text-sm font-medium text-text">
                            Description
                        </label>

                        {/* Input */}
                        <textarea
                            rows={4}
                            value={appDescription}
                            onChange={(e) => setAppDescription(e.target.value)}
                            placeholder="Enter a brief description about your application..."
                            className="w-full resize-none rounded-lg border border-border bg-background-primary px-3.5 py-2.5 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />

                        {/* Hint */}
                        <p className="mt-1.5 text-xs text-muted">
                            A short description that represents your application.
                        </p>
                    </div>
                </div>
            </section>

            {/* Branding */}
            <section className="rounded-xl border border-border bg-background-primary">
                {/* Section Header */}
                <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                    {/* Icon */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FiImage className="text-lg" />
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                        <h2 className="text-sm font-semibold text-heading">
                            Branding
                        </h2>
                        <p className="text-xs text-muted">
                            Upload your application logo and favicon.
                        </p>
                    </div>
                </div>

                {/* Images */}
                <div className="grid gap-5 p-5 md:grid-cols-2">
                    {/* Logo */}
                    <div>
                        {/* Label */}
                        <label className="mb-2 block text-sm font-medium text-text">
                            App Logo
                        </label>

                        {/* Selector */}
                        <div className="rounded-lg border border-border p-4">
                            {/* Preview */}
                            <div className="flex h-36 items-center justify-center rounded-lg bg-surface">
                                {logoPreview ? (
                                    <div className="relative h-full w-full">
                                        {/* Selected Image */}
                                        <img
                                            src={logoPreview}
                                            alt="App logo preview"
                                            className="h-full w-full rounded-lg object-contain p-4"
                                        />

                                        {/* Remove Button */}
                                        {logo && (
                                            <button type="button" onClick={removeLogo} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background text-white transition hover:bg-error" aria-label="Remove logo">
                                                <FiX />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted">
                                        <FiImage className="text-3xl" />
                                        <span className="text-xs">
                                            No logo selected
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Upload */}
                            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text transition hover:bg-surface">
                                <FiUploadCloud className="text-base" />
                                {logo ? "Change Logo" : "Select Logo"}
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                />
                            </label>

                            {/* Hint */}
                            <p className="mt-2 text-center text-xs text-muted">
                                PNG, JPG, WEBP or SVG
                            </p>
                        </div>
                    </div>

                    {/* Favicon */}
                    <div>
                        {/* Label */}
                        <label className="mb-2 block text-sm font-medium text-text">
                            Favicon
                        </label>

                        {/* Selector */}
                        <div className="rounded-lg border border-border p-4">
                            {/* Preview */}
                            <div className="flex h-36 items-center justify-center rounded-lg bg-surface">
                                {faviconPreview ? (
                                    <div className="relative h-full w-full">
                                        {/* Selected Image */}
                                        <img
                                            src={faviconPreview}
                                            alt="Favicon preview"
                                            className="h-full w-full rounded-lg object-contain p-10"
                                        />

                                        {/* Remove Button */}
                                        {favicon && (
                                            <button type="button" onClick={removeFavicon} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background text-white transition hover:bg-error" aria-label="Remove favicon">
                                                <FiX />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted">
                                        <FiImage className="text-3xl" />
                                        <span className="text-xs">
                                            No favicon selected
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Upload */}
                            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text transition hover:bg-surface">
                                <FiUploadCloud className="text-base" />
                                {favicon ? "Change Favicon" : "Select Favicon"}
                                <input
                                    type="file"
                                    accept="image/png,image/x-icon,image/svg+xml"
                                    onChange={handleFaviconChange}
                                    className="hidden"
                                />
                            </label>

                            {/* Hint */}
                            <p className="mt-2 text-center text-xs text-muted">
                                PNG, ICO or SVG
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO & Metadata */}
            <section className="rounded-xl border border-border bg-background-primary">
                {/* Section Header */}
                <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                    {/* Icon */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FiSearch className="text-lg" />
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                        <h2 className="text-sm font-semibold text-heading">
                            SEO & Metadata
                        </h2>
                        <p className="text-xs text-muted">
                            Configure the default search engine metadata for your website.
                        </p>
                    </div>
                </div>

                {/* Fields */}
                <div className="space-y-5 p-5">
                    {/* Meta Title */}
                    <div>
                        {/* Label */}
                        <label className="mb-2 block text-sm font-medium text-text">
                            Meta Title
                        </label>

                        {/* Input */}
                        <input
                            type="text"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            placeholder="Enter the default title for search engine results"
                            className="w-full rounded-lg border border-border bg-background-primary px-3.5 py-2.5 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />

                        {/* Hint */}
                        <p className="mt-1.5 text-xs text-muted">
                            The default title used by search engines for your website.
                        </p>
                    </div>

                    {/* Meta Description */}
                    <div>
                        {/* Label */}
                        <label className="mb-2 block text-sm font-medium text-text">
                            Meta Description
                        </label>

                        {/* Input */}
                        <textarea
                            rows={4}
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                            placeholder="Enter a concise description of your website for search engine results..."
                            className="w-full resize-none rounded-lg border border-border bg-background-primary px-3.5 py-2.5 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />

                        {/* Hint */}
                        <p className="mt-1.5 text-xs text-muted">
                            A short description that may appear in search engine results.
                        </p>
                    </div>

                    {/* Meta Keywords */}
                    <div>
                        {/* Label */}
                        <label className="mb-2 block text-sm font-medium text-text">
                            Meta Keywords
                        </label>

                        {/* Input */}
                        <input
                            type="text"
                            value={metaKeywords}
                            onChange={(e) => setMetaKeywords(e.target.value)}
                            placeholder="Enter relevant keywords separated by commas"
                            className="w-full rounded-lg border border-border bg-background-primary px-3.5 py-2.5 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />

                        {/* Hint */}
                        <p className="mt-1.5 text-xs text-muted">
                            Separate keywords with commas.
                        </p>
                    </div>
                </div>
            </section>

            {/* Save */}
            <div className="flex justify-end border-t border-border pt-5">
                <button type="button" onClick={handleSubmitAppSettingsForm} disabled={appSettingsUpdateLoading} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
                    {appSettingsUpdateLoading ? (
                        <Loader />
                    ) : (
                        <>
                            <FiSettings />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default AppSettingsPage;