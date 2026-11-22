"use client"
import {Provider} from "react-redux";
import {store} from "@/redux/store";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {config} from "@/config/config";
import DataFetcherWrapper from "@/wrappers/DataFetcherWrapper";
import SocketConnection from "@/components/common/connection/SocketConnection";

function ProviderWrapper ({children}: any) {
    return (
        <GoogleOAuthProvider clientId={config.googleOAuthClientId}>
            <Provider store={store}>
                <SocketConnection />
                <DataFetcherWrapper>
                    {children}
                </DataFetcherWrapper>
            </Provider>
        </GoogleOAuthProvider>
    )
}

export default ProviderWrapper;