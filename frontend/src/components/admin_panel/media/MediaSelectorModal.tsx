"use client"
import {useState, useRef, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import { IoMdArrowDropdown } from "react-icons/io";
import { FiUpload, FiSearch, FiGrid, FiPlay, FiFile, FiImage, FiVideo, FiMusic, FiMoreHorizontal, FiCheck, FiX, FiEdit2, FiCopy } from "react-icons/fi";
import {useGetMediaQuery} from "@/redux/services/media/mediaApi";
import {
    handleCancelMediaSelectorModal,
    handleCloseMediaSelectorModal,
    handleSelectMediaRedux
} from "@/redux/services/media/mediaSlice";
import MediaEditModal from "@/components/admin_panel/media/MediaEditModal";
import MediaUploadModal from "@/components/admin_panel/media/MediaUploadModal";

function MediaSelectorModal(){

    // Redux
    const dispatch = useDispatch();

    // Media Slice (Redux)
    const {selectedMediaRedux, mediaType, mediaSelectedFor} = useSelector((state: any)=>state.Media);



    // Filter States
    const [selectedType, setSelectedType] = useState(mediaType);
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(30);
    const [page, setPage] = useState(1);



    // Call Get Media API
    const {data: mediaData, isLoading: mediaDataLoading} = useGetMediaQuery({
        type: selectedType,
        search,
        limit,
        page,
    });



    // Type Dropdown
    const typeDropdownRef = useRef(null);
    const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
    const types = [
        { label: "All Files", value: "all", icon: <FiGrid /> },
        { label: "Images", value: "image", icon: <FiImage /> },
        { label: "Videos", value: "video", icon: <FiVideo /> },
        { label: "Audio", value: "audio", icon: <FiMusic /> },
        { label: "Documents", value: "document", icon: <FiFile /> },
        { label: "Others", value: "other", icon: <FiMoreHorizontal /> },
    ];

    // Close Type Dropdown on Outside Click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (typeDropdownRef.current && !(typeDropdownRef.current as HTMLElement).contains(event.target as Node)) {
                setTypeDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    // Media Upload Modal
    const [mediaUploadModalOpen, setMediaUploadModalOpen] = useState(false);

    // Media Edit Modal
    const [selectedMediaToEdit, setSelectedMediaToEdit] = useState(null);




    return(
        <div className="fixed top-0 left-0 h-full w-full inset-0 z-5000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-5">
            <div className="relative w-full max-w-6xl h-[80vh] rounded bg-white shadow-2xl p-6 overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded shadow-sm">
                    {/* Search & Type Selector */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Type Selector */}
                        {mediaType && mediaType !== "" && mediaSelectedFor === "" && (
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
                                            <button key={type.value} onClick={()=>setSelectedType(type.value)} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100">
                                                {type.icon}
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Search */}
                        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg md:min-w-sm lg:min-w-md w-full">
                            <FiSearch className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search files..."
                                value={search}
                                onChange={(e)=>setSearch(e.target.value)}
                                className="bg-transparent outline-none text-sm w-full text-text-body placeholder:text-muted"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        {/* Upload */}
                        <button onClick={()=>setMediaUploadModalOpen(true)} type="button" title="Upload" className="group flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 active:scale-95 cursor-pointer">
                            <FiUpload size={18} className="transition-transform duration-300 group-hover:scale-110"/>
                        </button>

                        {/* OK */}
                        {selectedMediaRedux?.length > 0 && (
                            <button onClick={()=>dispatch(handleCloseMediaSelectorModal(null))} type="button" title="Select" className="group flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer">
                                <FiCheck size={18} className="transition-transform duration-300 group-hover:scale-110"/>
                            </button>
                        )}

                        {/* Close */}
                        <button type="button" title="Close" onClick={()=>dispatch(handleCancelMediaSelectorModal())} className="group flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 active:scale-95 cursor-pointer">
                            <FiX size={19} className="transition-transform duration-300 group-hover:scale-110"/>
                        </button>
                    </div>
                </div>

                {/* Image Grid */}
                <div className="mt-6 flex-1 h-full max-h-125 overflow-y-auto scroll-hidden">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {/* Media Loading Skeleton */}
                        {mediaDataLoading && Array.from({length: 12}).map((_, i)=>(
                            <div key={i} className="bg-white border border-gray-200 overflow-hidden">
                                {/* Image placeholder */}
                                <div className="h-38 bg-gray-200 relative">
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
                        {!mediaDataLoading && mediaData?.data?.media?.map((media: any)=>{
                            let isSelected = false
                            if(Array.isArray(selectedMediaRedux)){
                                isSelected = selectedMediaRedux?.some((item)=>item?.url === media?.url);
                            }else{
                                isSelected = false
                            }
                            return(
                                <div key={media?._id} className="relative group">
                                    {/* Media */}
                                    <div onClick={()=>mediaSelectedFor && dispatch(handleSelectMediaRedux(media))} className={`group relative bg-white border-4 overflow-hidden transition cursor-pointer ${isSelected ? "border-2 border-primary shadow-lg" : "border border-gray-200 hover:shadow-md"}`}>
                                        {/* Media Preview */}
                                        <div className="relative h-38 group">
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
                                                    <video src={media?.url} className="h-full w-full object-cover"/>
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
                                        </div>

                                        {/* NAME SECTION */}
                                        <div className="p-2 border-t border-gray-100">
                                            <p className="text-xs text-gray-700 truncate">
                                                {media?.name}
                                            </p>
                                        </div>

                                        {/* Check Icon */}
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 z-20 bg-primary text-white rounded-full p-1">
                                                <FiCheck size={14} strokeWidth={4}/>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="absolute bottom-10 right-2 flex translate-y-2 gap-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 z-20">
                                        {/* Edit */}
                                        <button onClick={()=>setSelectedMediaToEdit(media)} title="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-600 text-white backdrop-blur transition hover:bg-yellow-700">
                                            <FiEdit2 size={14} />
                                        </button>

                                        {/* Copy URL */}
                                        <button onClick={()=>navigator.clipboard.writeText(media?.url)} title="Copy URL" className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900/80 text-white backdrop-blur transition hover:bg-black active:scale-90">
                                            <FiCopy size={14} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* No Media */}
                {!mediaDataLoading && mediaData?.data?.media?.length === 0 && (
                    <div className={`mt-8 bg-white border border-gray-200 rounded-xl py-20 px-6 flex flex-col items-center justify-center text-center`}>
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
                        <button onClick={()=>setMediaUploadModalOpen(true)} className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg transition cursor-pointer">
                            <FiUpload />
                            Upload Media
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {!mediaDataLoading && mediaData?.data?.media?.length !== 0 && (
                    <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                        {/* Previous */}
                        <button onClick={()=>setPage((prev) => prev - 1)} disabled={page === 1} className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">
                            ← Previous
                        </button>

                        {/* Page Number */}
                        <div className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-2 text-sm font-medium text-gray-700">
                            Page <span className="font-semibold">{page}</span> of{" "}
                            <span className="font-semibold">
                                {mediaData?.data?.pagination?.totalPages || 1}
                            </span>
                        </div>

                        {/* Next */}
                        <button onClick={()=>setPage((prev) => prev + 1)} disabled={page >= (mediaData?.data?.pagination?.totalPages || 1)} className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">
                            Next →
                        </button>
                    </div>
                )}

                {/* Media Upload */}
                <>
                    {mediaUploadModalOpen && (
                        <MediaUploadModal
                            setOpen={setMediaUploadModalOpen}
                        />
                    )}
                </>

                {/* Media Edit */}
                <>
                    {selectedMediaToEdit && (
                        <MediaEditModal
                            media={selectedMediaToEdit}
                            onClose={()=>setSelectedMediaToEdit(null)}
                        />
                    )}
                </>
            </div>
        </div>
    )
}

export default MediaSelectorModal;