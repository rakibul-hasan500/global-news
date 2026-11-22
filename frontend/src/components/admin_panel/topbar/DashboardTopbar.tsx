"use client"
import {HiBars3BottomLeft} from "react-icons/hi2";
import {useSelector} from "react-redux"
import {useState} from "react";
import LogoutModal from "@/components/common/warning/LogoutWarningModal";
import ProfileDropdown from "@/components/common/dropdown/ProfileDropdown";
import NotificationDropdown from "@/components/common/dropdown/NotificationDropdown";

function DashboardTopbar({setSidebarOpen}: any){

    // Logout Modal Open
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    return(
        <header className="w-full bg-primary-hover border-b border-border/20">
            <div className="flex items-center justify-between px-6 h-17">
                {/* Left */}
                <div className="flex items-center gap-4 text-surface text-xl">
                    <button onClick={()=>setSidebarOpen((open: boolean)=>!open)} className="h-10 w-10 bg-surface/10 flex items-center justify-center rounded-full text-xl cursor-pointer transition">
                        <HiBars3BottomLeft />
                    </button>
                </div>

                {/* Right */}
                <div className="flex items-center gap-6 text-gray-200 relative">
                     {/* Notification */}
                    <NotificationDropdown />

                    {/* Profile */}
                    <ProfileDropdown user_panel={false}/>
                </div>

                {/* Logout Warning Modal */}
                {logoutModalOpen && <LogoutModal onClose={()=>setLogoutModalOpen(false)}/>}
            </div>
        </header>
    )
}

export default DashboardTopbar;