import {Metadata} from "next";
import Articles from "@/components/user_panel/articles/Articles";

export const metadata: Metadata = {
    title: "Articles",
}

function ArticlesPage() {
    return <Articles />
}

export default ArticlesPage;