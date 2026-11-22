"use client";
import { IoCloseOutline, IoCloudUploadOutline } from "react-icons/io5";
import { useRef, useState } from "react";
import {formatBytes} from "@/utils/formatBytes";
import {responseHandler} from "@/utils/responseHandler";
import {useUploadMediaMutation} from "@/redux/services/media/mediaApi";

function MediaUploadModal({setOpen}: any){

    // File Ref
    const fileRef: any = useRef(null);

    // Selected Files
    const [files, setFiles] = useState([]);

    // Handle Select Files
    const handleFileChange = (e: any)=>{
        const selected: any = Array.from(e.target.files);
        setFiles(selected);
    };

    // Remove Selected
    const handleRemoveFile = (indexToRemove: any)=>{
        setFiles((prev)=>prev.filter((_, index) => index !== indexToRemove));
    };



    // Call Upload Media API
    const [uploadMedia, {isLoading: uploadMediaLoading}] = useUploadMediaMutation()

    // Handle Upload Media
    const handleUploadMedia = async ()=>{
        try{
            // Validate
            if(!files || files.length === 0){
                return responseHandler("E", "No files selected")
            }

            // Form Data
            const formData = new FormData()
            files.forEach((file)=>{
                formData.append("file", file)
            })

            // Hit Upload Media API
            const response = await uploadMedia(formData).unwrap();

            // Toast Message
            responseHandler("S", response?.message)

            // Reset States
            setFiles([])
            setOpen(false);
        }catch(error: any){
            return responseHandler("E", error?.data?.message)
        }
    }



    return(
        <div className="fixed top-0 left-0 h-full w-full inset-0 z-5000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-5">
            {/* White Card */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-300">
                    {/* Text */}
                    <h2 className="text-sm font-semibold text-gray-800">
                        Upload Media
                    </h2>

                    {/* Close Button */}
                    <button onClick={()=>setOpen(false)} disabled={uploadMediaLoading} className="p-2 hover:bg-gray-100 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <IoCloseOutline className="text-xl text-gray-600" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    {/* Drop Box */}
                    <div onClick={(): any =>fileRef.current.click()} className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition rounded-lg p-8 text-center bg-gray-50">
                        {/* Upload Icon */}
                        <IoCloudUploadOutline className="text-4xl mx-auto text-gray-400 mb-2" />

                        {/* Text */}
                        <p className="text-sm text-gray-700 font-medium">
                            Drag & drop files or click to upload
                        </p>

                        {/* Supported */}
                        <p className="text-xs text-gray-500 mt-1">
                            Supported Images, Videos, Audio, Documents, etc
                        </p>

                        {/* Input */}
                        <input
                            ref={fileRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Selected Count */}
                    {files?.length > 0 && (
                        <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md">
                            {/* Selected Files Count */}
                            <p className="text-sm text-gray-700 font-medium">
                                {files?.length} file{files?.length > 1 ? "s" : ""} selected
                            </p>

                            {/* Selected File Status */}
                            <span className="text-xs text-gray-500">
                                {uploadMediaLoading ? "Uploading..." : "Ready to upload"}
                            </span>
                        </div>
                    )}

                    {/* File List */}
                    {files?.length > 0 && (
                        <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-3 bg-white">
                            {files?.map((file: any, index)=>(
                                <div key={index} className="flex items-center justify-between text-xs text-gray-600 border-b pb-1">
                                    {/* File name */}
                                    <span className="truncate pr-2 flex-1">
                                        {file?.name}
                                    </span>

                                    {/* Size */}
                                    <span className="min-w-max mr-3">
                                        {formatBytes(file?.size)}
                                    </span>

                                    {/* Remove button */}
                                    <button onClick={()=>handleRemoveFile(index)} className="text-gray-400 hover:text-error transition text-lg">
                                        <IoCloseOutline />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        {/* Cancel */}
                        <button onClick={()=>setOpen(false)} disabled={uploadMediaLoading} className="flex-1 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition text-sm disabled:opacity-50">
                            Cancel
                        </button>

                        {/* Upload */}
                        <button disabled={uploadMediaLoading || files.length === 0} onClick={handleUploadMedia} className="flex-1 py-2 rounded-md bg-primary-hover disabled:opacity-50 text-white transition text-sm font-semibold cursor-pointer disabled:cursor-not-allowed">
                            {uploadMediaLoading ? "Uploading..." : "Upload"} ({files.length})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MediaUploadModal;