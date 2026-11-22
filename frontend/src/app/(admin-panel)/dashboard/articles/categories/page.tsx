"use client"
import {FiEdit2, FiFolder, FiPlus, FiPower, FiSearch, FiTrash2} from "react-icons/fi";
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

function CategoriesPage() {

    // Search Params
    const searchParams = useSearchParams()

    // Router
    const router = useRouter();

    // Pathname
    const pathName = usePathname()



    // Users Data From Redux
    const {user, accessToken} = useSelector((state: any) => state.Auth)



    // Category Add Modal Open / Close
    const [categoryAddModalOpen, setCategoryAddModalOpen] = useState(false)



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



    // Call Get Categories API
    const {data: categoriesData, isLoading: categoriesDataLoading} = useGetCategoriesQuery({
        search,
        status: selectedStatus,
        limit: selectedLimit,
        page
    })



    // Selected Category To Edit
    const [selectedCategoryToEdit, setSelectedCategoryToEdit] = useState<any>(null)



    // Selected Category To Delete
    const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState<any>(null)

    // Call Delete Category API
    const [deleteCategory, {isLoading: deleteCategoryLoading}] = useDeleteCategoryMutation();

    // Handle Delete Category
    const handleDeleteCategory = async () => {
        if (!selectedCategoryToDelete?._id) return;
        try {
            // Hit Delete Category API
            const response = await deleteCategory(selectedCategoryToDelete._id).unwrap();

            // Reset State
            setSelectedCategoryToDelete(null);

            return  responseHandler("S", response?.message || "Category deleted successfully");
        } catch (error: any) {
            return responseHandler("E", error?.data?.message || "Failed to delete category");
        }
    };



    // Selected Category To Change Status
    const [selectedCategoryToChangeStatus, setSelectedCategoryToChangeStatus] = useState<any>(null);

    // Call Toggle Category Status API
    const [toggleCategoryStatus, {isLoading: toggleCategoryStatusLoading}] = useToggleCategoryStatusMutation();

    // Handle Toggle Category Status
    const handleToggleCategoryStatus = async () => {
        if (!selectedCategoryToChangeStatus?._id) {
            return;
        }
        try {
            // Hit Toggle Category Status API
            const response = await toggleCategoryStatus(selectedCategoryToChangeStatus._id).unwrap();

            // Reset State
            setSelectedCategoryToChangeStatus(null);

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
                        <FiFolder className="text-primary" />
                        Categories
                    </h1>
                    <p className="text-sm text-text mt-1">
                        Manage and organize your news categories
                    </p>
                </div>

                {/* Button */}
                {["ADMIN", "SUPER_ADMIN"].includes(user?.role) && (
                    <button onClick={() => {
                        setCategoryAddModalOpen(true)
                        setSelectedCategoryToEdit(null)
                    }} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm transition shadow-sm cursor-pointer w-max">
                        <FiPlus />
                        Add Category
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
                                placeholder="Search by category name..."
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

            {/* Categories Table */}
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-275 w-full text-xs text-left">
                        {/* HEADER */}
                        <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] tracking-wide border-y border-gray-300">
                            <tr>
                                {/* CATEGORY */}
                                <th className="px-4 py-3 min-w-60">
                                    Category
                                </th>

                                {/* SLUG */}
                                <th className="px-4 py-3 min-w-70">
                                    Slug
                                </th>

                                {/* DESCRIPTION */}
                                <th className="px-4 py-3 min-w-100">
                                    Description
                                </th>

                                {/* POSTS */}
                                <th className="px-4 py-3">
                                    Posts
                                </th>

                                {/* STATUS */}
                                <th className="px-4 py-3">
                                    Status
                                </th>

                                {/* CREATED AT */}
                                <th className="px-4 py-3 whitespace-nowrap">
                                    Created At
                                </th>

                                {/* ACTIONS — ADMIN & SUPER ADMIN ONLY */}
                                {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                                    <th className="px-4 py-3 text-center">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody className="divide-y divide-gray-100">
                            {/* SKELETON */}
                            {categoriesDataLoading && Array.from({ length: 10 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {/* CATEGORY */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-lg bg-gray-200"></div>
                                            <div className="h-4 w-36 rounded bg-gray-200"></div>
                                        </div>
                                    </td>

                                    {/* SLUG */}
                                    <td className="px-4 py-3">
                                        <div className="h-4 w-48 rounded bg-gray-200"></div>
                                    </td>

                                    {/* DESCRIPTION */}
                                    <td className="px-4 py-3">
                                        <div className="h-4 w-64 rounded bg-gray-200"></div>
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
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}

                            {/* CATEGORY LIST */}
                            {!categoriesDataLoading && categoriesData?.data?.categories?.map((category: any, index: number) => (
                                <tr key={category?._id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} transition`}>
                                    {/* CATEGORY — IMAGE + NAME */}
                                    <td className="px-4 py-3 min-w-60">
                                        <div className="flex items-center gap-3">
                                            {/* IMAGE */}
                                            <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
                                                {category?.image?.url ? (
                                                    <img
                                                        src={category?.image?.url}
                                                        alt={category?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <FiFolder size={18} className="text-gray-500" />
                                                )}
                                            </div>

                                            {/* NAME */}
                                            <div className="min-w-0">
                                                <p className="font-semibold text-heading text-sm truncate max-w-35">
                                                    {category?.name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* SLUG */}
                                    <td className="px-4 py-3 min-w-70 text-text">
                                        <span className="block truncate max-w-50">
                                            {category?.slug}
                                        </span>
                                    </td>

                                    {/* DESCRIPTION */}
                                    <td className="px-4 py-3 min-w-100 text-text">
                                        <span className="block truncate max-w-120">
                                            {category?.description || "—"}
                                        </span>
                                    </td>

                                    {/* POSTS */}
                                    <td className="px-4 py-3">
                                        <span className="inline-flex min-w-10 items-center justify-center px-2 py-1 text-[10px] font-semibold rounded bg-primary/10 text-primary">
                                            {category?.postsCount ?? 0}
                                        </span>
                                    </td>

                                    {/* STATUS */}
                                    <td className="px-4 py-3">
                                        {category?.isActive ? (
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
                                        {new Date(category?.createdAt).toLocaleDateString()}
                                    </td>

                                    {/* ACTIONS */}
                                    {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* EDIT */}
                                                <button onClick={() => {
                                                    setSelectedCategoryToEdit(category)
                                                    setCategoryAddModalOpen(true)
                                                }} title="Edit" className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-700 text-white cursor-pointer">
                                                    <FiEdit2 size={14} />
                                                </button>

                                                {/* Activate / Deactivate */}
                                                <button onClick={() => setSelectedCategoryToChangeStatus(category)} title={category?.isActive ? "Deactivate" : "Activate"} className={`flex h-8 w-8 items-center justify-center rounded-md text-white cursor-pointer transition ${category?.isActive ? "bg-orange-500 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700"}`}>
                                                    <FiPower size={14} />
                                                </button>

                                                {/* DELETE */}
                                                <button onClick={() => setSelectedCategoryToDelete(category)} title="Delete" className="flex h-8 w-8 items-center justify-center rounded-md bg-red-600 text-white cursor-pointer">
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}

                            {/* EMPTY STATE */}
                            {!categoriesDataLoading && categoriesData?.data?.categories?.length === 0 && (
                                <tr>
                                    <td colSpan={user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" ? 7 : 6} className="px-4 py-12">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            {/* ICON */}
                                            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                                <FiFolder size={24} className="text-gray-400"/>
                                            </div>

                                            {/* TITLE */}
                                            <h3 className="text-sm font-semibold text-heading">
                                                No categories found
                                            </h3>

                                            {/* DESCRIPTION */}
                                            <p className="text-xs text-text mt-1 max-w-sm">
                                                {search ? "No categories match your current search or filter." : "You haven't created any categories yet."}
                                            </p>

                                            {/* ADD BUTTON */}
                                            {["ADMIN", "SUPER_ADMIN"].includes(user?.role) && (
                                                <button onClick={() => {
                                                    setSelectedCategoryToEdit(null)
                                                    setCategoryAddModalOpen(true)
                                                }} className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm transition shadow-sm cursor-pointer">
                                                    <FiPlus size={15} />
                                                    Add Category
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
                {categoriesData?.data?.categories?.length > 0 && (
                    <Pagination
                        pagination={categoriesData?.data?.pagination}
                    />
                )}
            </>

            {/* Category Form */}
            <>
                {categoryAddModalOpen && (
                    <CategoryForm
                        category={selectedCategoryToEdit}
                        onClose={() => {
                            setCategoryAddModalOpen(false)
                            setSelectedCategoryToEdit(null)
                        }}
                    />
                )}
            </>

            {/* Toggle Category Status Warning */}
            <>
                {selectedCategoryToChangeStatus && (
                    <WarningDialog
                        open={!!selectedCategoryToChangeStatus}
                        title={selectedCategoryToChangeStatus?.isActive ? "Deactivate Category" : "Activate Category"}
                        message={selectedCategoryToChangeStatus?.isActive ? "Are you sure you want to deactivate this category? It will no longer be visible to regular users." : "Are you sure you want to activate this category? It will become visible to regular users."}
                        confirmText={selectedCategoryToChangeStatus?.isActive ? "Deactivate" : "Activate"}
                        loading={toggleCategoryStatusLoading}
                        onConfirm={handleToggleCategoryStatus}
                        onCancel={() => setSelectedCategoryToChangeStatus(null)}
                    />
                )}
            </>

            {/* Delete Warning */}
            <>
                {selectedCategoryToDelete && (
                    <DeleteWarningModal
                        onClose={() => setSelectedCategoryToDelete(null)}
                        onConfirm={handleDeleteCategory}
                        loading={deleteCategoryLoading}
                    />
                )}
            </>
        </div>
    )
}

export default CategoriesPage;