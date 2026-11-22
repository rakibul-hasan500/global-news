import Loader from "@/components/common/other/Loader";

export default function LoadingPage() {
    return (
        <main>
            <div className="h-screen w-screen flex items-center justify-center">
                <Loader size={25}/>
            </div>
        </main>
    );
}