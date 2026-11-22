interface IConfig {
    baseUrl: string | undefined;
    serverUrl: string | undefined;
    frontendUrl: string | undefined;
    googleOAuthClientId: string
}

export const config: IConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
    frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL,
    googleOAuthClientId: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || "",
}