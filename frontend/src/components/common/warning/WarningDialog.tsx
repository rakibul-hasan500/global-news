import {FiAlertTriangle, FiX} from "react-icons/fi"

interface ToggleWarningDialogProps {
    open: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    loading?: boolean
    onConfirm: () => void
    onCancel: () => void
}

const WarningDialog = ({open, title, message, confirmText = "Confirm", cancelText = "Cancel", loading = false, onConfirm, onCancel}: ToggleWarningDialogProps) => {

    // No Opened
    if (!open) return null

    return (
        <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-5">
            <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    {/* Title */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                            <FiAlertTriangle size={20}/>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h2>
                    </div>

                    {/* Close */}
                    <button type="button" onClick={onCancel} disabled={loading} className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50">
                        <FiX size={18}/>
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-5">
                    <p className="text-sm leading-6 text-gray-600">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-5 py-4">
                    {/* Cancel */}
                    <button type="button" onClick={onCancel} disabled={loading} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                        {cancelText}
                    </button>

                    {/* Confirm */}
                    <button type="button" onClick={onConfirm} disabled={loading} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
                        {loading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default WarningDialog