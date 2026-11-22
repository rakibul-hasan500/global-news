import { FiTrash2 } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import Loader from "@/components/common/other/Loader";

function DeleteWarningModal({onClose, onConfirm, loading=false}: any){
    return(
        <div className="fixed top-0 left-0 h-full w-full inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-5000">
            <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 relative">
                {/* Icon */}
                <div className="flex items-center justify-center mb-4">
                    <FiTrash2 className="text-error text-5xl animate-pulse" />
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-heading text-center mb-2">
                    Delete Item?
                </h2>

                {/* Message */}
                <p className="text-center text-text mb-6">
                    Are you sure you want to delete this item? This action cannot be undone.
                </p>

                {/* Actions */}
                <div className="flex justify-center gap-4">
                    {/* Cancel */}
                    <button onClick={onClose} disabled={loading} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition text-text-body">
                        <IoCloseOutline className="text-gray-600" />
                        Cancel
                    </button>

                    {/* Confirm Delete */}
                    <button onClick={onConfirm} disabled={loading} className={`${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} flex items-center gap-2 px-4 py-2 bg-error text-white rounded transition duration-200 min-w-28.75 justify-center`}>
                        {loading ? (
                            <Loader />
                        ) : (
                            <>
                                <FiTrash2 />
                                Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteWarningModal;