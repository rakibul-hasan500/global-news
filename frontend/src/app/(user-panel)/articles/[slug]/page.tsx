import ArticleDetails from "@/components/user_panel/articleDetails/ArticleDetails";
import {config} from "@/config/config";
import {Metadata} from "next";

async function getArticle(slug: string) {
    try {
        const response = await fetch(`${config.baseUrl}/articles/${slug}`, {
            cache: "no-store",
        });
        if(!response.ok) return null;
        const result = await response.json();
        return result.data.article
    } catch (error) {
        return null
    }
}

export async function generateMetadata({params}: any): Promise<Metadata> {
    const {slug} = await params;
    const article = await getArticle(slug);
    if(!article) {
        return {
            title: "Article Not Found"
        }
    }
    return {
        title: article.metaTitle || article.title,
        description: article.metaDescription || article.excerpt,
        keywords: article.metaKeywords || [],
    }
}

async function ArticleDetailsPage({params}: any) {
    const {slug} = await params;
    return <ArticleDetails slug={slug}/>
}

export default ArticleDetailsPage;