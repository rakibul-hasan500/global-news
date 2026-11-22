import Footer from "@/components/user_panel/footer/Footer";
import Header from "@/components/user_panel/header/Header";

function UserLayout({children}: LayoutProps<"/">) {
    return (
        <>
            {/* Header */}
            <Header />

            {/* Load Page */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </>
    )
}

export default UserLayout;