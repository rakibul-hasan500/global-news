"use client"
import {
    FiCheckCircle,
    FiChevronDown,
    FiFileText,
    FiHash,
    FiPlus,
    FiSave,
    FiTag,
    FiToggleLeft,
    FiX
} from "react-icons/fi";
import {useEffect, useState} from "react";
import {
    useCreateTagMutation,
    useUpdateTagMutation
} from "@/redux/services/tag/tagApi";
import {responseHandler} from "@/utils/responseHandler";
import {zodErrorHandler} from "@/utils/zodErrorHandler";
import {tagSchema} from "@/validation/tag.validation";

function TagForm({tag, onClose}: any) {

    // Edit Mode
    const isEditMode = Boolean(tag);


    // Form States
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);

    // Populate Form
    useEffect(() => {
        if (tag) {
            setName(tag?.name || "");
            setSlug(tag?.slug || "");
            setDescription(tag?.description || "");
            setIsActive(Boolean(tag?.isActive));
        } else {
            setName("");
            setSlug("");
            setDescription("");
            setIsActive(true);
        }
    }, [tag]);



    // Status Dropdown
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

    // Status Options
    const statuses = [
        {
            value: true,
            label: "Active"
        },
        {
            value: false,
            label: "Inactive"
        }
    ];

    // Close Status Dropdown When Clicking Outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(".tag-status-dropdown")) {
                setStatusDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    // Create Tag Mutation
    const [createTag, {isLoading: createTagLoading}] = useCreateTagMutation();

    // Update Tag Mutation
    const [updateTag, {isLoading: updateTagLoading}] = useUpdateTagMutation();

    // Handle Submit Tag Form
    const handleSubmitTagForm = async (e: any) => {
        e.preventDefault();
        try {
            // Validate
            const validate = tagSchema.safeParse({
                name,
                status: isActive,
                slug,
                description
            });
            if (!validate?.success) {
                return zodErrorHandler(validate);
            }

            // Tag Data
            const data = {
                name,
                slug,
                description,
                status: isActive
            };

            // Hit API
            let response;

            if (isEditMode && tag) {
                response = await updateTag({
                    id: tag?._id,
                    data
                }).unwrap();
            } else {
                response = await createTag(data).unwrap();
            }

            // Reset States
            setName("");
            setSlug("");
            setDescription("");
            setIsActive(true);
            setStatusDropdownOpen(false);

            // Close Form
            onClose();

            return responseHandler("S", response?.message);
        } catch (error: any) {
            return responseHandler("E", error?.data?.message || "Something went wrong");
        }
    };


    return (
        <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-5">
            {/* Modal */}
            <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl">
                {/* Modal Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                    {/* Header Content */}
                    <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <FiTag size={20}/>
                        </div>

                        {/* Title */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {isEditMode ? "Update Tag" : "Add Tag"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {isEditMode ? "Update tag information" : "Create a new tag"}
                            </p>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button type="button" onClick={onClose} disabled={createTagLoading || updateTagLoading} className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50">
                        <FiX size={20}/>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmitTagForm} className="flex max-h-[90vh] flex-col">
                    {/* Fields */}
                    <div className="max-h-[calc(80vh-145px)] overflow-y-auto space-y-5 px-6 pb-4">
                        {/* Name + Status */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {/* Name */}
                            <div>
                                {/* Label */}
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Tag Name
                                </label>

                                {/* Input */}
                                <div className="relative">
                                    <FiTag size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter tag name"
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50"
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div className="tag-status-dropdown">
                                {/* Label */}
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Status
                                </label>

                                {/* Input */}
                                <div className="relative">
                                    {/* Status Button */}
                                    <button type="button" onClick={() => setStatusDropdownOpen((prev) => !prev)} className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-50">
                                        <span className="flex items-center gap-2">
                                            <FiToggleLeft size={17} className="text-gray-400"/>
                                            {isActive ? "Active" : "Inactive"}
                                        </span>
                                        <span className="text-gray-400">
                                            <FiChevronDown size={18}/>
                                        </span>
                                    </button>

                                    {/* Status Dropdown */}
                                    {statusDropdownOpen && (
                                        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                                            {statuses.map((status) => (
                                                <button key={String(status.value)} type="button" onClick={() => {
                                                    setIsActive(status.value);
                                                    setStatusDropdownOpen(false);
                                                }} className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition hover:bg-gray-50 ${isActive === status.value ? "bg-blue-50 text-blue-600" : "text-gray-700"}`}>
                                                    <FiCheckCircle size={15}/>
                                                    {status.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Slug */}
                        <div>
                            {/* Label */}
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Slug
                            </label>

                            {/* Input */}
                            <div className="relative">
                                <FiHash size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="example-tag"
                                    className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            {/* Label */}
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Description
                            </label>

                            {/* Field */}
                            <div className="relative">
                                <FiFileText size={17} className="absolute left-3 top-3 text-gray-400"/>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter tag description"
                                    rows={4}
                                    className="w-full resize-none rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5 px-6 pb-5">
                        {/* Cancel */}
                        <button type="button" onClick={onClose} disabled={createTagLoading || updateTagLoading} className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                            <FiX size={16}/>
                            Cancel
                        </button>

                        {/* Submit */}
                        <button type="submit" disabled={createTagLoading || updateTagLoading} className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
                            {isEditMode ? (
                                <FiSave size={16}/>
                            ) : (
                                <FiPlus size={16}/>
                            )}
                            {(createTagLoading || updateTagLoading) ? "Saving..." : isEditMode ? "Update Tag" : "Create Tag"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TagForm;