"use client"
import {useEffect, useState} from "react";
import DashboardSidebar from "@/components/admin_panel/sidebar/DashboardSidebar";
import {useSelector} from "react-redux";
import DashboardTopbar from "@/components/admin_panel/topbar/DashboardTopbar";
import MediaSelectorModal from "@/components/admin_panel/media/MediaSelectorModal";

function DashboardWrapper({children}: any) {

    // Media Slice Data (Redux)
    const {mediaSelectorOpen} = useSelector((state: any)=>state.Media);

    // Sidebar Open
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

    // Current Width
    const [currentWidth, setCurrentWidth] = useState(0);

    // Auto Open / Close Handle
    useEffect(()=>{
        const handleResize = ()=>{
            setCurrentWidth(window.innerWidth);
            if(window.innerWidth < 1280){
                setSidebarOpen(false)
            }else{
                setSidebarOpen(true)
            }
        }
        handleResize()
        window.addEventListener("resize", handleResize);
        return ()=>window.removeEventListener("resize", handleResize);
    }, [])


    return(
        <div className="relative flex h-screen w-screen overflow-hidden">
            {/* Sidebar */}
            <DashboardSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* Top Bar & Main Page */}
            <div className={`${(currentWidth > 1280 && sidebarOpen) ? "w-[calc(100vw-336px)]" : "w-full"} flex flex-col h-screen transition-all duration-200`}>
                {/* Top Bar */}
                <DashboardTopbar setSidebarOpen={setSidebarOpen}/>

                {/* Main Page */}
                <main className="h-full bg-gray-100 p-5 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* Media Selector Modal */}
            <>
                {mediaSelectorOpen && (
                    <MediaSelectorModal />
                )}
            </>
        </div>
    )
}

export default DashboardWrapper;