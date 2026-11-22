import { Metadata } from "next"
import AccountSidebar from "@/components/user_panel/sidebar/AccountSidebar";

export const metadata: Metadata = {
    title: "My Account",
};

function AccountLayout({ children }: any) {
    return (
        <div className="base-container px-4 py-8 sm:px-8 lg:px-10 pb-20">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
                {/* Sidebar */}
                <aside>
                    <div className="lg:sticky lg:top-24">
                        <AccountSidebar />
                    </div>
                </aside>

                {/* Page Content */}
                <div className="min-w-0">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AccountLayout;
