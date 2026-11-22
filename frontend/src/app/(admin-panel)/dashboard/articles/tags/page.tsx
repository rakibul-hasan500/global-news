"use client"
import {FiEdit2, FiFolder, FiPlus, FiPower, FiSearch, FiTag, FiTrash2} from "react-icons/fi";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {IoMdArrowDropdown} from "react-icons/io";
import CategoryForm from "@/components/admin_panel/category/CategoryForm";
import {
    useDeleteCategoryMutation,
    useGetCategoriesQuery,
    useToggleCategoryStatusMutation
} from "@/redux/services/category/categoryApi";
import Pagination from "@/components/common/other/Pagination";
import WarningDialog from "@/components/common/warning/WarningDialog";
import {responseHandler} from "@/utils/responseHandler";
import DeleteWarningModal from "@/components/common/warning/DeleteWarningModal";
import {useDeleteTagMutation, useGetTagsQuery, useToggleTagStatusMutation} from "@/redux/services/tag/tagApi";
import TagForm from "@/components/admin_panel/tag/TagForm";

function TagsPage() {

    // Search Params
    const searchParams = useSearchParams()

    // Router
    const router = useRouter();

    // Pathname
    const pathName = usePathname()



    // User Data From Redux
    const {user} = useSelector((state: any) => state.Auth)



    // Tag Add Modal Open / Close
    const [tagAddModalOpen, setTagAddModalOpen] = useState(false)



    // Filter States
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedLimit, setSelectedLimit] = useState(20);
    const [page, setPage] = useState(1);

    // Sync URL Params → State
    useEffect(() => {
        setSearch(searchParams.get("search") || "")
        setSelectedStatus(searchParams.get("status") || "all")
        setSelectedLimit(Number(searchParams.get("limit")) || 20)
        setPage(Number(searchParams.get("page")) || 1)
    }, [searchParams])



    // Dropdown States
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [limitDropdownOpen, setLimitDropdownOpen] = useState(false);

    // Dropdown Refs
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const limitDropdownRef = useRef<HTMLDivElement>(null);

    // Status Selector
    const statuses = [
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
    ];

    // Close Dropdowns When Clicking Outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (statusDropdownRef.current && !statusDropdownRef.current.contains(target)) {
                setStatusDropdownOpen(false);
            }

            if (limitDropdownRef.current && !limitDropdownRef.current.contains(target)) {
                setLimitDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    // Call Get Tags API
    const {data: tagsData, isLoading: tagsDataLoading} = useGetTagsQuery({
        search,
        status: selectedStatus,
        limit: selectedLimit,
        page
    })



    // Selected Tag To Edit
    const [selectedTagToEdit, setSelectedTagToEdit] = useState<any>(null)



    // Selected Tag To Delete
    const [selectedTagToDelete, setSelectedTagToDelete] = useState<any>(null)

    // Call Delete Tag API
    const [deleteTag, {isLoading: deleteTagLoading}] = useDeleteTagMutation();

    // Handle Delete Tag
    const handleDeleteTag = async () => {
        if (!selectedTagToDelete?._id) return;

        try {
            // Hit Delete Tag API
            const response = await deleteTag(selectedTagToDelete._id).unwrap();

            // Reset State
            setSelectedTagToDelete(null);

            return responseHandler("S", response?.message || "Tag deleted successfully");
        } catch (error: any) {
            return responseHandler("E", error?.data?.message || "Failed to delete tag");
        }
    };



    // Selected Tag To Change Status
    const [selectedTagToChangeStatus, setSelectedTagToChangeStatus] = useState<any>(null);

    // Call Toggle Tag Status API
    const [toggleTagStatus, {isLoading: toggleTagStatusLoading}] = useToggleTagStatusMutation();

    // Handle Toggle Tag Status
    const handleToggleTagStatus = async () => {
        if (!selectedTagToChangeStatus?._id) {
            return;
        }

        try {
            // Hit Toggle Tag Status API
            const response = await toggleTagStatus(selectedTagToChangeStatus._id).unwrap();

            // Reset State
            setSelectedTagToChangeStatus(null);

            return responseHandler("S", response?.message);
        } catch (error: any) {
            return responseHandler("E", error?.data?.message);
        }
    };


    return (
        <div className="space-y-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold flex text-heading items-center gap-2">
                        <FiTag className="text-primary" />
                        Tags
                    </h1>
                    <p className="text-sm text-text mt-1">
                        Manage and organize your news tags
                    </p>
                </div>

                {/* Button */}
                {["ADMIN", "SUPER_ADMIN"].includes(user?.role) && (
                    <button onClick={() => {
                        setTagAddModalOpen(true)
                        setSelectedTagToEdit(null)
                    }} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm transition shadow-sm cursor-pointer w-max">
                        <FiPlus />
                        Add Tag
                    </button>
                )}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 bg-white p-4 rounded-xl border border-border shadow-sm">
                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row w-full gap-2 justify-between">
                    {/* Search & Status Selector */}
                    <div className="grid grid-cols-1 sm:flex gap-2 w-full">
                        {/* Search */}
                        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg flex-1 max-w-140">
                            {/* Icon */}
                            <FiSearch className="text-text" />

                            {/* Input */}
                            <input
                                type="text"
                                placeholder="Search by tag name..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    const params = new URLSearchParams(searchParams.toString());
                                    if (e.target.value) {
                                        params.set("search", e.target.value);
                                    } else {
                                        params.delete("search");
                                    }
                                    params.set("page", "1");
                                    router.replace(`${pathName}?${params.toString()}`);
                                }}
                                className="bg-transparent outline-none text-sm w-full text-text placeholder-text-body/60"
                            />
                        </div>

                        {/* Status Selector */}
                        {["EDITOR", "ADMIN", "SUPER_ADMIN"].includes(user?.role) && (
                            <div ref={statusDropdownRef} className="relative sm:w-50">
                                {/* Selected Button */}
                                <button onClick={() => setStatusDropdownOpen(!statusDropdownOpen)} className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition w-full">
                                    <span>
                                        {statuses.find((status) => status.value === selectedStatus)?.label}
                                    </span>
                                    <IoMdArrowDropdown size={18} />
                                </button>

                                {/* Dropdown */}
                                {statusDropdownOpen && (
                                    <div className="absolute w-full top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                                        {statuses.map((status) => (
                                            <button key={status.value} onClick={() => {
                                                setSelectedStatus(status.value);
                                                setStatusDropdownOpen(false);
                                                const params = new URLSearchParams(searchParams.toString());
                                                if (status.value === "all") {
                                                    params.delete("status");
                                                } else {
                                                    params.set("status", status.value);
                                                }
                                                params.set("page", "1");
                                                router.replace(`${pathName}?${params.toString()}`);
                                            }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition">
                                                {status.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Limit Selector */}
                    <div ref={limitDropdownRef} className="relative md:w-40">
                        {/* Selected Button */}
                        <button onClick={() => setLimitDropdownOpen(!limitDropdownOpen)} className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition w-full">
                                <span>
                                    {selectedLimit}
                                </span>
                            <IoMdArrowDropdown size={18} />
                        </button>

                        {/* Dropdown */}
                        {limitDropdownOpen && (
                            <div className="absolute w-full top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                                {[20, 40, 60, 80, 100].map((limit) => (
                                    <button key={limit} onClick={() => {
                                        setSelectedLimit(limit);
                                        setLimitDropdownOpen(false);
                                        const params = new URLSearchParams(searchParams.toString());
                                        params.set("limit", limit.toString());
                                        params.set("page", "1");
                                        router.replace(`${pathName}?${params.toString()}`);
                                    }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition">
                                        {limit}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tags Table */}
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-[1100px] w-full text-xs text-left">
                        {/* HEADER */}
                        <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] tracking-wide border-y border-gray-300">
                            <tr>
                                {/* TAG */}
                                <th className="px-4 py-3 min-w-50">
                                    Tag
                                </th>

                                {/* SLUG */}
                                <th className="px-4 py-3 min-w-50">
                                    Slug
                                </th>

                                {/* DESCRIPTION */}
                                <th className="px-4 py-3 min-w-120">
                                    Description
                                </th>

                                {/* POSTS */}
                                <th className="px-4 py-3 min-w-20">
                                    Posts
                                </th>

                                {/* STATUS */}
                                <th className="px-4 py-3 min-w-24">
                                    Status
                                </th>

                                {/* CREATED AT */}
                                <th className="px-4 py-3 min-w-28 whitespace-nowrap">
                                    Created At
                                </th>

                                {/* ACTIONS — ADMIN & SUPER ADMIN ONLY */}
                                {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                                    <th className="px-4 py-3 text-center min-w-32">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody className="divide-y divide-gray-100">
                            {/* SKELETON */}
                            {tagsDataLoading && Array.from({length: 10}).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {/* TAG */}
                                    <td className="px-4 py-3">
                                        <div className="h-4 w-36 rounded bg-gray-200"></div>
                                    </td>

                                    {/* SLUG */}
                                    <td className="px-4 py-3">
                                        <div className="h-4 w-40 rounded bg-gray-200"></div>
                                    </td>

                                    {/* DESCRIPTION */}
                                    <td className="px-4 py-3">
                                        <div className="h-4 w-80 rounded bg-gray-200"></div>
                                    </td>

                                    {/* POSTS */}
                                    <td className="px-4 py-3">
                                        <div className="h-6 w-14 rounded bg-gray-200"></div>
                                    </td>

                                    {/* STATUS */}
                                    <td className="px-4 py-3">
                                        <div className="h-6 w-16 rounded bg-gray-200"></div>
                                    </td>

                                    {/* CREATED AT */}
                                    <td className="px-4 py-3">
                                        <div className="h-4 w-28 rounded bg-gray-200"></div>
                                    </td>

                                    {/* ACTIONS */}
                                    {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <div className="w-8 h-8 rounded-md bg-gray-200"></div>
                                                <div className="w-8 h-8 rounded-md bg-gray-200"></div>
                                                <div className="w-8 h-8 rounded-md bg-gray-200"></div>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}

                            {/* TAG LIST */}
                            {!tagsDataLoading && tagsData?.data?.tags?.map((tag: any, index: number) => (
                                <tr key={tag?._id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} transition`}>
                                    {/* TAG */}
                                    <td className="px-4 py-3 min-w-50">
                                        <div className="flex items-center gap-3">
                                            {/* ICON */}
                                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center">
                                                <FiTag size={16} className="text-primary"/>
                                            </div>

                                            {/* NAME */}
                                            <div className="min-w-0">
                                                <p className="font-semibold text-heading text-sm truncate max-w-35">
                                                    {tag?.name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* SLUG */}
                                    <td className="px-4 py-3 min-w-50 text-text">
                                        <span className="block truncate max-w-50">
                                            {tag?.slug}
                                        </span>
                                    </td>

                                    {/* DESCRIPTION */}
                                    <td className="px-4 py-3 min-w-120 text-text">
                                        <span className="block truncate max-w-120">
                                            {tag?.description || "—"}
                                        </span>
                                    </td>

                                    {/* POSTS */}
                                    <td className="px-4 py-3">
                                        <span className="inline-flex min-w-10 items-center justify-center px-2 py-1 text-[10px] font-semibold rounded bg-primary/10 text-primary">
                                            {tag?.postsCount ?? 0}
                                        </span>
                                    </td>

                                    {/* STATUS */}
                                    <td className="px-4 py-3">
                                        {tag?.isActive ? (
                                            <span className="px-2 py-1 text-[10px] rounded bg-success/10 text-success">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 text-[10px] rounded bg-warning/10 text-warning">
                                                Inactive
                                            </span>
                                        )}
                                    </td>

                                    {/* CREATED AT */}
                                    <td className="px-4 py-3 text-text whitespace-nowrap">
                                        {new Date(tag?.createdAt).toLocaleDateString()}
                                    </td>

                                    {/* ACTIONS */}
                                    {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* EDIT */}
                                                <button onClick={() => {
                                                    setSelectedTagToEdit(tag)
                                                    setTagAddModalOpen(true)
                                                }} title="Edit" className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-700 text-white cursor-pointer">
                                                    <FiEdit2 size={14} />
                                                </button>

                                                {/* ACTIVATE / DEACTIVATE */}
                                                <button onClick={() => setSelectedTagToChangeStatus(tag)} title={tag?.isActive ? "Deactivate" : "Activate"} className={`flex h-8 w-8 items-center justify-center rounded-md text-white cursor-pointer transition ${tag?.isActive ? "bg-orange-500 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700"}`}>
                                                    <FiPower size={14} />
                                                </button>

                                                {/* DELETE */}
                                                <button onClick={() => setSelectedTagToDelete(tag)} title="Delete" className="flex h-8 w-8 items-center justify-center rounded-md bg-red-600 text-white cursor-pointer">
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}


                            {/* EMPTY STATE */}
                            {!tagsDataLoading && tagsData?.data?.tags?.length === 0 && (
                                <tr>
                                    <td colSpan={user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" ? 7 : 6} className="px-4 py-12">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            {/* ICON */}
                                            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                                <FiTag size={24} className="text-gray-400"/>
                                            </div>

                                            {/* TITLE */}
                                            <h3 className="text-sm font-semibold text-heading">
                                                No tags found
                                            </h3>

                                            {/* DESCRIPTION */}
                                            <p className="text-xs text-text mt-1 max-w-sm">
                                                {search ? "No tags match your current search or filter." : "You haven't created any tags yet."}
                                            </p>

                                            {/* ADD BUTTON */}
                                            {["ADMIN", "SUPER_ADMIN"].includes(user?.role) && (
                                                <button onClick={() => {
                                                    setSelectedTagToEdit(null)
                                                    setTagAddModalOpen(true)
                                                }} className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm transition shadow-sm cursor-pointer">
                                                    <FiPlus size={15} />
                                                    Add Tag
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <>
                {tagsData?.data?.tags?.length > 0 && (
                    <Pagination
                        pagination={tagsData?.data?.pagination}
                    />
                )}
            </>

            {/* Tag Form */}
            <>
                {tagAddModalOpen && (
                    <TagForm
                        tag={selectedTagToEdit}
                        onClose={() => {
                            setTagAddModalOpen(false)
                            setSelectedTagToEdit(null)
                        }}
                    />
                )}
            </>

            {/* Toggle Tag Status Warning */}
            <>
                {selectedTagToChangeStatus && (
                    <WarningDialog
                        open={!!selectedTagToChangeStatus}
                        title={selectedTagToChangeStatus?.isActive ? "Deactivate Tag" : "Activate Tag"}
                        message={selectedTagToChangeStatus?.isActive ? "Are you sure you want to deactivate this tag? It will no longer be visible to regular users." : "Are you sure you want to activate this tag? It will become visible to regular users."}
                        confirmText={selectedTagToChangeStatus?.isActive ? "Deactivate" : "Activate"}
                        loading={toggleTagStatusLoading}
                        onConfirm={handleToggleTagStatus}
                        onCancel={() => setSelectedTagToChangeStatus(null)}
                    />
                )}
            </>

            {/* Delete Warning */}
            <>
                {selectedTagToDelete && (
                    <DeleteWarningModal
                        onClose={() => setSelectedTagToDelete(null)}
                        onConfirm={handleDeleteTag}
                        loading={deleteTagLoading}
                    />
                )}
            </>
        </div>
    )
}

export default TagsPage;