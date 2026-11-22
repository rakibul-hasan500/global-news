"use client";
import { useState } from "react";
import {FiX, FiFile, FiMusic, FiMoreHorizontal} from "react-icons/fi";
import { formatBytes } from "@/utils/formatBytes";
import {responseHandler} from "@/utils/responseHandler";
import {useUpdateMediaMutation} from "@/redux/services/media/mediaApi";
import Loader from "@/components/common/other/Loader";
import {updateMediaSchema} from "@/validation/media.validation";
import {zodErrorHandler} from "@/utils/zodErrorHandler";

function MediaEditModal({media, onClose}: any){

    // States
    const [name, setName] = useState(media?.name || "");
    const [altTag, setAltTag] = useState(media?.altTag || "");



    // call Update Media API
    const [updateMedia, {isLoading: updateMediaLoading}] = useUpdateMediaMutation()

    // Handle Update Media
    const handleUpdateMedia = async ()=>{
        try{
            // Validate
            if(!media || !media?._id){
                return responseHandler("E", "No media selected to update")
            }

            // Zod Validation
            const validate = updateMediaSchema.safeParse({name, altTag})
            if(!validate?.success) {
                return zodErrorHandler(validate)
            }

            // Validated Data
            const {name: mediaName, altTag: mediaAltTag}: any = validate.data

            // Hit Update Media API
            const response = await updateMedia({
                id: media._id.toString(),
                name: mediaName,
                altTag: mediaAltTag,
            }).unwrap();

            // Reset State
            setName("")
            setAltTag("")

            // Close Form
            onClose()

            return responseHandler("S", response?.message)
        }catch(error: any){
            return responseHandler("E", error?.data?.message)
        }
    }


    return(
        <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-5">
            <div className="w-full h-max max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    {/* Title */}
                    <h2 className="text-xl font-semibold">
                        Edit Media
                    </h2>

                    {/* Close Button */}
                    <button disabled={updateMediaLoading} onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition">
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="grid lg:grid-cols-[340px_1fr] gap-8 p-6 h-full max-h-[55vh] overflow-y-auto">
                    {/* Preview */}
                    <div className="border border-gray-300 rounded-xl overflow-hidden bg-gray-50 h-80 flex items-center justify-center">
                        {/* Image */}
                        {media?.type === "image" && (
                            <img
                                src={media?.url}
                                alt={media?.name}
                                className="w-full h-full object-contain"
                            />
                        )}

                        {/* Video */}
                        {media?.type === "video" && (
                            <video
                                src={media?.url}
                                controls
                                className="w-full h-full"
                            />
                        )}

                        {/* Audio */}
                        {media?.type === "audio" && (
                            <div className="text-gray-500 flex flex-col items-center gap-3">
                                <FiMusic size={60} />
                                <span>Audio File</span>
                            </div>
                        )}

                        {/* Document */}
                        {(media?.type === "document" || media?.type === "other") && (
                            <div className="text-gray-500 flex flex-col items-center gap-3">
                                <FiFile size={60} />
                                <span>Document</span>
                            </div>
                        )}

                        {/* Other */}
                        {media?.type === "other" && (
                            <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                                <FiMoreHorizontal size={64} />
                                <p className="text-sm font-medium">Unknown File</p>
                                <span className="rounded bg-gray-200 px-2 py-1 text-xs uppercase">
                                    {media?.extension}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="space-y-5">
                        {/* Name */}
                        <div>
                            {/* Label */}
                            <label className="block text-sm font-medium mb-2">
                                Name
                            </label>

                            {/* Input */}
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter media name..."
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                            />
                        </div>

                        {/* URL */}
                        <Info label="URL" value={media?.url}/>

                        {/* Other Details */}
                        <div className="grid md:grid-cols-2 gap-5">
                            {/* Type */}
                            <Info label="Type" value={media?.type}/>

                            {/* Mime Type */}
                            <Info label="MIME Type" value={media?.mimeType}/>

                            {/* Extension */}
                            <Info label="Extension" value={media?.extension}/>

                            {/* Size */}
                            <Info label="Size" value={formatBytes(media?.size)}/>
                        </div>

                        {/* Alt Text */}
                        <div>
                            {/* Label */}
                            <label className="block text-sm font-medium mb-2">
                                Alt Text
                            </label>

                            {/* Input */}
                            <input
                                type="text"
                                value={altTag}
                                onChange={(e) => setAltTag(e.target.value)}
                                placeholder="Enter image alt text..."
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
                    {/* Cancel */}
                    <button onClick={onClose} className="rounded-lg border border-gray-300 px-5 py-2 hover:bg-gray-100 transition">
                        Cancel
                    </button>

                    {/* Save */}
                    <button disabled={updateMediaLoading} onClick={handleUpdateMedia} className="flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-white hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer gap-2">
                        {!updateMediaLoading ? (
                            "Save Changes"
                        ) : (
                            <>
                                <Loader />
                                Saving...
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Info({label, value}: any){
    return(
        <div>
            {/* Label */}
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                {label}
            </p>

            {/* Value */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 break-all text-sm">
                {value || "-"}
            </div>
        </div>
    );
}

export default MediaEditModal;