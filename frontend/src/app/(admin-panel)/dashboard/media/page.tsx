"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {useSelector} from "react-redux";
import { IoImageOutline } from "react-icons/io5";
import { FiUpload, FiSearch, FiGrid, FiList, FiPlay, FiTrash2, FiFile, FiImage, FiVideo, FiMusic, FiCopy, FiMoreHorizontal, FiEdit2 } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import {useEffect, useRef, useState} from "react";
import {useDeleteMediaMutation, useGetMediaQuery, useGetMediaStatsQuery} from "@/redux/services/media/mediaApi";
import {responseHandler} from "@/utils/responseHandler";
import {formatBytes} from "@/utils/formatBytes";
import MediaUploadModal from "@/components/admin_panel/media/MediaUploadModal";
import Pagination from "@/components/common/other/Pagination";
import MediaEditModal from "@/components/admin_panel/media/MediaEditModal";
import DeleteWarningModal from "@/components/common/warning/DeleteWarningModal";

function MediaPage(){

    // User From Redux
    const {accessToken, user} = useSelector((state: any)=>state.Auth);



    // Media Upload Modal Open
    const [mediaUploadModalOpen, setMediaUploadModalOpen] = useState(false);





    // URL
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathName = usePathname()

    // View Mode
    const [viewMode, setViewMode] = useState("grid");
    useEffect(()=>{
        const mode = searchParams.get("view") || "grid";
        setViewMode(mode);
    }, [searchParams])
    const handleViewModeChange = (view: any)=>{
        const params = new URLSearchParams(searchParams.toString());
        params.set("view", view)
        router.replace(`${pathName}?${params.toString()}`)
    }





    // Filter States
    const [selectedType, setSelectedType] = useState("all");
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(30);
    const [page, setPage] = useState(1);

    useEffect(()=>{
        // Type
        const type = searchParams.get("type") || "all";
        setSelectedType(type);

        // Search
        const searchText = searchParams.get("search") || "";
        setSearch(searchText);

        // Limit
        const itemLimit = searchParams.get("limit") || 30;
        setLimit(Number(itemLimit))

        // Page
        const pageNumber = searchParams.get("page") || 1;
        setPage(Number(pageNumber))
    }, [searchParams]);




    // Call Get Media API
    const {data: mediaData, isLoading: mediaDataLoading} = useGetMediaQuery({
        type: selectedType,
        search,
        limit,
        page,
    }, {
        skip: !accessToken || !user || !["JOURNALIST", "EDITOR", "ADMIN", "SUPER_ADMIN"].includes(user?.role)
    });






    // Type Dropdown
    const typeDropdownRef: any = useRef(null);
    const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
    const types = [
        { label: "All Files", value: "all", icon: <FiGrid /> },
        { label: "Images", value: "image", icon: <FiImage /> },
        { label: "Videos", value: "video", icon: <FiVideo /> },
        { label: "Audio", value: "audio", icon: <FiMusic /> },
        { label: "Documents", value: "document", icon: <FiFile /> },
        { label: "Others", value: "other", icon: <FiMoreHorizontal /> },
    ];
    useEffect(()=>{
        function closeDropdownOnOutsideClick(e: any){
            // Type Dropdown
            if(typeDropdownRef.current && !typeDropdownRef.current.contains(e.target)){
                setTypeDropdownOpen(false);
            }
        }
        document.addEventListener("click", closeDropdownOnOutsideClick);
        return ()=>{
            document.removeEventListener("click", closeDropdownOnOutsideClick);
        }
    }, [])






    // Get Media Stats
    const {data: mediaStatsData} = useGetMediaStatsQuery(undefined, {
        skip: !accessToken || !user || !["JOURNALIST", "EDITOR", "ADMIN", "SUPER_ADMIN"].includes(user?.role)
    })
    const stats = mediaStatsData?.data?.stats






    // Call Delete Media API
    const [deleteMedia, {isLoading: deleteMediaLoading}] = useDeleteMediaMutation()

    // Selected Media To Delete
    const [selectedMediaToDelete, setSelectedMediaToDelete] = useState("");

    // Handle Delete Media
    const handleDeleteMedia = async ()=>{
        try{
            // Validate
            if(!selectedMediaToDelete){
                return responseHandler("E", "Select media to delete")
            }

            // Hit Delete Media API
            const response = await deleteMedia(selectedMediaToDelete).unwrap();

            // Toast Message
            responseHandler("S", response?.message)

            // Reset States
            setSelectedMediaToDelete("")

            return;
        }catch(error: any){
            return responseHandler("E", error?.data?.message)
        }
    }

    // Cancel Delete Media
    const handleCancelDeleteMedia = ()=>{
        setSelectedMediaToDelete("");
    }





    // Selected Media To Edit
    const [selectedMediaToEdit, setSelectedMediaToEdit] = useState(null);


    return(
        <div className="space-y-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold flex text-heading items-center gap-2">
                        <IoImageOutline className="text-primary" />
                        Media Library
                    </h1>
                    <p className="text-sm text-text mt-1">
                        Manage and organize your uploaded images
                    </p>
                </div>

                {/* Button */}
                <button onClick={()=> setMediaUploadModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm transition shadow-sm cursor-pointer w-max">
                    <FiUpload />
                    Upload
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-border shadow-sm">
                {/* Search & Type Selector */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Type Selector */}
                    <div ref={typeDropdownRef} className="relative w-full md:w-43 md:min-w-42">
                        {/* Selected Button */}
                        <button onClick={()=>setTypeDropdownOpen(!typeDropdownOpen)} className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition w-full">
                            <div className="flex items-center gap-2">
                                {types.find(t => t.value === selectedType)?.icon}
                                {types.find(t => t.value === selectedType)?.label}
                            </div>
                            <IoMdArrowDropdown size={18}/>
                        </button>

                        {/* Dropdown */}
                        {typeDropdownOpen && (
                            <div className="absolute w-full top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                                {types.map((type)=>(
                                    <button key={type.value} onClick={()=>{
                                        setSelectedType(type.value);
                                        setTypeDropdownOpen(false);

                                        const params = new URLSearchParams(searchParams.toString());
                                        params.set("type", type.value);
                                        params.set("page", "1")
                                        router.replace(`${pathName}?${params.toString()}`)
                                    }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100">
                                        {type.icon}
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg md:min-w-sm lg:min-w-md w-full">
                        <FiSearch className="text-text" />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={search}
                            onChange={(e)=>{
                                setSearch(e.target.value)
                                const params = new URLSearchParams(searchParams.toString());
                                params.set("search", e.target.value);
                                params.set("page", "1")
                                router.replace(`${pathName}?${params.toString()}`)
                            }}
                            className="bg-transparent outline-none text-sm w-full text-text placeholder-text-body/60"
                        />
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-gray-200 p-1 rounded-lg w-max">
                    {/* Grid */}
                    <button onClick={()=> {
                        setViewMode("grid")
                        handleViewModeChange("grid")
                    }} className={`${viewMode === "grid" && "bg-white"} p-2 rounded-md transition`}>
                        <FiGrid />
                    </button>

                    {/* List */}
                    <button onClick={()=> {
                        setViewMode("list")
                        handleViewModeChange("list")
                    }} className={`${viewMode === "list" && "bg-white"} p-2 rounded-md transition`}>
                        <FiList />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    {
                        label: "Total Files",
                        value: stats?.totalFiles ?? 0,
                    },
                    {
                        label: "Storage Used",
                        value: formatBytes(stats?.totalSize),
                    },
                    {
                        label: "File Types",
                        value: stats?.fileTypes ?? 0,
                    },
                    {
                        label: "Recent Uploads",
                        value: stats?.recentUploads ?? 0,
                    },
                ].map((item, i)=>(
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <p className="text-text text-sm">{item?.label}</p>
                        <h2 className="text-2xl font-semibold mt-2">{item?.value}</h2>
                    </div>
                ))}
            </div>

            {/* Image Grid */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Media Loading Skeleton */}
                    {mediaDataLoading && Array.from({length: 12}).map((_, i)=>(
                        <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            {/* Image placeholder */}
                            <div className="h-42 bg-gray-200 relative">
                                {/* extension Placeholder */}
                                <div className="absolute top-2 left-2 w-10 h-4 bg-gray-300 rounded"></div>
                            </div>

                            {/* Name placeholder */}
                            <div className="p-2 border-t border-gray-100">
                                <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}

                    {/* Media Card Grid */}
                    {!mediaDataLoading && mediaData?.data?.media?.map((media: any)=>(
                        <div key={media?._id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                            {/* Media Preview */}
                            <div className="relative h-42 group">
                                {/* Image */}
                                <>
                                    {media?.type === "image" && (
                                        <img
                                            src={media?.url}
                                            alt={media?.name}
                                            className="h-full w-full object-cover"
                                        />
                                    )}
                                </>

                                {/* Video */}
                                {media?.type === "video" && (
                                    <div className="relative w-full h-full group">
                                        <video
                                            src={media?.url}
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <div className="bg-black/60 p-3 rounded-full">
                                                <FiPlay className="text-white text-2xl" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Audio */}
                                {media?.type === "audio" && (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-50">
                                        <FiMusic className="text-2xl" />
                                    </div>
                                )}

                                {/* Document / Other */}
                                {(media?.type === "document" || media?.type === "other") && (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-50">
                                        <FiFile className="text-2xl" />
                                    </div>
                                )}

                                {/* Extension badge */}
                                <p className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-0.5 rounded">
                                    {media?.extension?.replace(".", "").toUpperCase()}
                                </p>

                                {/* Actions */}
                                <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                    {/* Edit */}
                                    <button onClick={()=>setSelectedMediaToEdit(media)} className="bg-warning text-white p-1.5 rounded-md cursor-pointer" title="Edit">
                                        <FiEdit2 className="text-xs" />
                                    </button>

                                    {/* Delete */}
                                    <button onClick={()=>setSelectedMediaToDelete(media?._id)} className="bg-error text-white p-1.5 rounded-md cursor-pointer" title="Delete">
                                        <FiTrash2 className="text-xs" />
                                    </button>
                                </div>
                            </div>

                            {/* NAME SECTION */}
                            <div className="p-2 border-t border-gray-100">
                                <p className="text-xs text-text truncate">
                                    {media?.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Media Card List */}
            {viewMode === "list" && (
                <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-300 w-full text-xs text-left">
                            {/* HEADER */}
                            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] tracking-wide border-y border-gray-300">
                                <tr>
                                    <th className="px-4 py-3">Media</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">URL</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Ext</th>
                                    <th className="px-4 py-3">MIME</th>
                                    <th className="px-4 py-3">Size</th>
                                    <th className="px-4 py-3 text-center">Actions</th>
                                </tr>
                            </thead>

                            {/* BODY */}
                            <tbody className="divide-y divide-gray-100">
                                {/* Media List Items Skeleton */}
                                {mediaDataLoading && Array.from({length: 10}).map((_, i)=>(
                                    <tr key={i} className="animate-pulse">
                                        {/* Media */}
                                        <td className="px-4 py-3">
                                            <div className="w-14 h-14 rounded-lg bg-gray-200"></div>
                                        </td>

                                        {/* Name */}
                                        <td className="px-4 py-3">
                                            <div className="h-4 w-36 rounded bg-gray-200"></div>
                                        </td>

                                        {/* URL */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-56 rounded bg-gray-200"></div>
                                                <div className="w-5 h-5 rounded bg-gray-200"></div>
                                            </div>
                                        </td>

                                        {/* Type */}
                                        <td className="px-4 py-3">
                                            <div className="h-4 w-16 rounded bg-gray-200"></div>
                                        </td>

                                        {/* Extension */}
                                        <td className="px-4 py-3">
                                            <div className="h-6 w-12 rounded bg-gray-200"></div>
                                        </td>

                                        {/* MIME */}
                                        <td className="px-4 py-3">
                                            <div className="h-4 w-28 rounded bg-gray-200"></div>
                                        </td>

                                        {/* Size */}
                                        <td className="px-4 py-3">
                                            <div className="h-4 w-14 rounded bg-gray-200"></div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-3">
                                                <div className="w-5 h-5 rounded bg-gray-200"></div>
                                                <div className="w-5 h-5 rounded bg-gray-200"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {/* Media List Items */}
                                {!mediaDataLoading && mediaData?.data?.media?.map((media: any, index: number)=>(
                                    <tr key={media?._id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} transition`}>
                                        {/* MEDIA */}
                                        <td className="px-4 py-3">
                                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                                {/* Image */}
                                                {media?.type === "image" && (
                                                    <img
                                                        src={media?.url}
                                                        alt={media?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}

                                                {/* Video */}
                                                {media?.type === "video" && (
                                                    <div className="relative w-full h-full">
                                                        <video
                                                            src={media?.url}
                                                            className="w-full h-full object-cover"
                                                        />

                                                        {/* Play Overlay */}
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                            <div className="bg-black/60 p-1.5 rounded-full">
                                                                <FiPlay className="text-white text-sm" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Audio */}
                                                {media?.type === "audio" && (
                                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                                        <FiMusic className="text-2xl" />
                                                        <span className="text-[9px] mt-1 uppercase">
                                                            {media.extension?.replace(".", "")}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Document */}
                                                {media?.type === "document" && (
                                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                                        <FiFile className="text-2xl" />
                                                        <span className="text-[9px] mt-1 uppercase">
                                                            {media.extension?.replace(".", "")}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Others Icon */}
                                                {media?.type === "other" && (
                                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                                        <FiFile className="text-xl" />
                                                        <span className="text-[9px] mt-1 uppercase">
                                                            {media.extension?.replace(".", "")}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* NAME */}
                                        <td className="px-4 py-3 font-medium text-heading max-w-45 truncate">
                                            {media?.name}
                                        </td>

                                        {/* URL */}
                                        <td className="px-4 py-3 max-w-55">
                                            <div className="flex items-center gap-2">
                                                <span className="truncate text-gray-500">
                                                    {media.url}
                                                </span>
                                                <button onClick={()=>navigator.clipboard.writeText(media?.url)} className="text-gray-400 hover:text-gray-700 transition text-base" title="Copy URL">
                                                    <FiCopy />
                                                </button>
                                            </div>
                                        </td>

                                        {/* TYPE */}
                                        <td className="px-4 py-3 capitalize text-text">
                                            {media?.type}
                                        </td>

                                        {/* EXTENSION */}
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 text-[10px] rounded bg-gray-100 text-gray-700 uppercase">
                                                {media?.extension?.replace(".", "")}
                                            </span>
                                        </td>

                                        {/* MIME */}
                                        <td className="px-4 py-3 text-text/80 truncate">
                                            {media?.mimeType}
                                        </td>

                                        {/* SIZE */}
                                        <td className="px-4 py-3 text-text">
                                            {formatBytes(media?.size)}
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Edit */}
                                                <button onClick={()=>setSelectedMediaToEdit(media)} title="Edit" className="flex h-8 w-8 items-center justify-center rounded-md bg-warning text-white cursor-pointer">
                                                    <FiEdit2 size={14} />
                                                </button>

                                                {/* Delete */}
                                                <button onClick={()=>setSelectedMediaToDelete(media._id)} title="Delete" className="flex h-8 w-8 items-center justify-center rounded-md bg-error text-white cursor-pointer">
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* No Media */}
            {!mediaDataLoading && mediaData?.data?.media?.length === 0 && (
                <div className={`${viewMode === "grid" && "-mt-8"} bg-white border border-gray-200 rounded-xl py-20 px-6 flex flex-col items-center justify-center text-center`}>
                    {/* Icon */}
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                        <FiImage className="text-4xl text-gray-400" />
                    </div>

                    {/* Not Found Text */}
                    <h2 className="text-xl font-semibold text-heading">
                        No media found
                    </h2>

                    {/* Upload Text */}
                    <p className="text-sm text-text mt-2 max-w-md">
                        Your media library is empty. Upload images, videos, audio, or documents
                        to start managing your files.
                    </p>

                    {/* Open Upload Modal Button */}
                    <button onClick={()=>setMediaUploadModalOpen(true)} className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-lg transition cursor-pointer">
                        <FiUpload />
                        Upload Media
                    </button>
                </div>
            )}

            {/* Pagination */}
            {!mediaDataLoading && mediaData?.data?.media?.length !== 0 && (
                <Pagination pagination={mediaData?.data?.pagination}/>
            )}

            {/* Media Upload Modal */}
            {mediaUploadModalOpen && (
                <MediaUploadModal setOpen={setMediaUploadModalOpen}/>
            )}

            {/* Delete Media Warning */}
            <>
                {selectedMediaToDelete !== "" && (
                    <DeleteWarningModal
                        onClose={handleCancelDeleteMedia}
                        onConfirm={handleDeleteMedia}
                        loading={deleteMediaLoading}
                    />
                )}
            </>

            {/* Edit Media Modal */}
            <>
                {selectedMediaToEdit && (
                    <MediaEditModal
                        media={selectedMediaToEdit}
                        onClose={()=>setSelectedMediaToEdit(null)}
                    />
                )}
            </>
        </div>
    );
}

export default MediaPage;