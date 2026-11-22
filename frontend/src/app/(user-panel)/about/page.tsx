import About from "@/components/user_panel/about/About";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "About",
}

function AboutPage() {
    return <About />
}

export default AboutPage;
