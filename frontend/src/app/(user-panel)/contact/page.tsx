import Contact from "@/components/user_panel/contact/Contact";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Contact",
}

function ContactPage() {
    return <Contact />
}

export default ContactPage;