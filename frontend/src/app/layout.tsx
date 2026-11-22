import type { Metadata } from "next";
import "../styles/globals.css";
import ProviderWrapper from "@/wrappers/ProviderWrapper";
import {Toaster} from "react-hot-toast";
import {config} from "@/config/config";

export async function generateMetadata(): Promise<Metadata> {

    // Data
    let data = null

    // Fetch & Validate
    try {
        // Fetch
        const response = await fetch(`${config.baseUrl}/settings/app`, {
            method: "GET",
        })

        // Validate
        if(response?.ok) {
            data = await response.json()
        }
    } catch(error) {
        console.log("Failed to fetch app settings")
    }

    // Extract Settings Data
    const settings = data?.data?.data

    return {
        title: {
            template: `%s | ${settings?.appName} ${settings?.appName && settings?.tagline && "-"} ${settings?.tagline}` || "",
            default: `${settings?.appName} ${settings?.appName && settings?.tagline && "-"} ${settings?.tagline}` || ""
        },
        description: settings?.appDescription || settings?.metaDescription || "",
        keywords: settings?.metaKeywords || [],
        icons: {
            icon: settings?.favicon?.url || "",
        },
        openGraph: {
            title: settings?.metaTitle || settings?.appName || "",
            description: settings?.metaDescription || settings?.appDescription || "",
            images: settings?.logo?.url ? [settings?.logo?.url] : [],
        }
    }

}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <ProviderWrapper>
          {children}
        </ProviderWrapper>
        <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
                duration: 3000,
            }}
        />
      </body>
    </html>
  );
}
