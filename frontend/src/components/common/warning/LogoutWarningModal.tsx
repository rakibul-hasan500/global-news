"use client"
import {FiLogOut} from "react-icons/fi";
import {useDispatch} from "react-redux";
import {IoCloseOutline} from "react-icons/io5";
import {useRouter} from "next/navigation";
import {useLogoutUserMutation} from "@/redux/services/auth/authApi";
import {responseHandler} from "@/utils/responseHandler";
import Loader from "@/components/common/other/Loader";
import {handleSetAccessTokenToRedux, handleSetUserDataToRedux} from "@/redux/services/auth/authSlice";

function LogoutModal({onClose}: any){

    // Router
    const router = useRouter();

    // Dispatch
    const dispatch = useDispatch()

    // Call Log Out API
    const [logoutUser, {isLoading: logoutUserLoading}] = useLogoutUserMutation()

    // Handle Logout User
    const handleLogoutUser = async ()=>{
        try{
            // Hit Logout User API
            const response = await logoutUser(undefined).unwrap()

            // Close Modal
            onClose()

            // Navigate To Login
            router.push("/login")

            // Reset Auth Data
            dispatch(handleSetUserDataToRedux(null))
            dispatch(handleSetAccessTokenToRedux(null))

            return responseHandler("S", response?.message)
        }catch(error: any){
            responseHandler("E", error?.data?.message)

            // Close Modal
            onClose()

            // Navigate To Login
            router.push("/login")
        }
    }


    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-5000">
            <div className="bg-background-primary rounded-xl shadow-lg max-w-sm w-[calc(100%-20px)] p-6 relative">
                {/* Warning Icon */}
                <div className="flex items-center justify-center mb-4">
                    <FiLogOut className="text-primary text-5xl animate-pulse" />
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-heading text-center mb-2">
                    Logout Account?
                </h2>

                {/* Message */}
                <p className="text-center text-text mb-6">
                    Are you sure you want to logout from your account?
                </p>

                {/* Actions */}
                <div className="flex flex-wrap justify-center gap-4">
                    {/* Cancel */}
                    <button onClick={onClose} disabled={logoutUserLoading} className="flex items-center gap-2 px-4 py-2 border border-border rounded hover:bg-error hover:text-surface transition text-error cursor-pointer">
                        <IoCloseOutline />
                        Cancel
                    </button>

                    {/* Confirm Logout */}
                    <button onClick={handleLogoutUser} disabled={logoutUserLoading} className={`${logoutUserLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} flex items-center gap-2 px-4 py-2 bg-brand text-background-primary rounded bg-primary hover:bg-primary-hover transition duration-200`}>
                        {logoutUserLoading ? (
                            <Loader/>
                            ) : (
                            <>
                                <FiLogOut />
                                Logout
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LogoutModal;