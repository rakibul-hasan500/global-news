import {Metadata} from "next";
import DashboardWrapper from "@/wrappers/DashboardWrapper";

export const metadata: Metadata = {
    title: "Dashboard"
}

export default function AdminLayout({children}: LayoutProps<"/">) {
    return (
        <DashboardWrapper>
            {children}
        </DashboardWrapper>
    )
}