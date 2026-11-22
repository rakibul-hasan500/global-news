"use client"
import {useGetCurrentUserQuery} from "@/redux/services/user/userApi";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {
    handleSetAccessTokenToRedux,
    handleSetAuthLoadingToRedux,
    handleSetUserDataToRedux
} from "@/redux/services/auth/authSlice";
import {useRefreshTokenMutation} from "@/redux/services/auth/authApi";
import {useGetSettingsQuery} from "@/redux/services/settings/settingsApi";
import {
    handleSetAppSettingsDataToRedux,
    handleSetContactSettingsDataToRedux
} from "@/redux/services/settings/settingsSlice";
import {useGetAllCategoriesQuery} from "@/redux/services/category/categoryApi";
import {handleSetAllCategoriesToRedux} from "@/redux/services/category/categorySlice";
import RouteProtectorWrapper from "@/wrappers/RouteProtectorWrapper";
import Loader from "@/components/common/other/Loader";

function DataFetcherWrapper({children}: any) {

    // Dispatch
    const dispatch = useDispatch();

    // Current User Data From Auth Slice
    const {accessToken} = useSelector((state:any) => state.Auth)





    // Call Get Current User Data API
    const {data: currentUserData, isLoading: currentUserDataLoading, isSuccess: currentUserDataSuccess, isError: currentUserDataError} = useGetCurrentUserQuery(undefined, {
        skip: !accessToken,
    })

    // Set Current user Data To Auth Slice
    useEffect(() => {
        if(currentUserData?.data?.user) {
            dispatch(handleSetUserDataToRedux(currentUserData?.data?.user))
        }
    }, [currentUserData, accessToken, dispatch])





    // Call Refresh Token API
    const [refreshToken, {isLoading: refreshTokenLoading, isSuccess: refreshTokenSuccess, isError: refreshTokenError}] = useRefreshTokenMutation()

    // Handle Refresh Token
    useEffect(() => {
        async function handleRefreshToken() {
            try {
                // Hit Refresh Token API
                const response = await refreshToken(undefined).unwrap()

                // Set New Token To Auth Slice
                if(response?.data?.accessToken) {
                    dispatch(handleSetAccessTokenToRedux(response?.data?.accessToken))
                }
            } catch(error) {
                console.error(error)
            }
        }
        handleRefreshToken()
    }, [refreshToken, dispatch]);





    // Call Get App Settings Data API
    const {data: appSettingsData, isLoading: appSettingsDataLoading} = useGetSettingsQuery("app")
    const appSettings = appSettingsData?.data?.data

    // Set Data To States
    useEffect(() => {
        if (!appSettings) return;
        dispatch(handleSetAppSettingsDataToRedux(appSettings))
    }, [appSettingsData]);





    // Call Get Contact Settings Data API
    const {data: contactSettingsData, isLoading: contactSettingsDataLoading} = useGetSettingsQuery("contact")
    const contactSettings = contactSettingsData?.data?.data

    // Set Data To States
    useEffect(() => {
        if (!contactSettings) return;
        dispatch(handleSetContactSettingsDataToRedux(contactSettings))
    }, [contactSettingsData]);





    // Call Get All Categories API
    const {data: allCategoriesData, isLoading: allCategoriesDataLoading} = useGetAllCategoriesQuery(null)
    const allCategories = allCategoriesData?.data?.categories

    // Set Data To States
    useEffect(() => {
        if(!allCategories) return;
        dispatch(handleSetAllCategoriesToRedux(allCategories))
    }, [allCategories])





    // Fetch End
    const [fetchEnd, setFetchEnd] = useState(false)

    // Set Fetch End
    useEffect(() => {
        if((currentUserDataSuccess || currentUserDataError) && (refreshTokenSuccess || refreshTokenError)) {
            setFetchEnd(true)
            dispatch(handleSetAuthLoadingToRedux(false))
        }
    }, [currentUserDataSuccess, currentUserDataError, refreshTokenSuccess, refreshTokenError]);

    // currentUserDataLoading, refreshTokenLoading




    if (!fetchEnd) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <Loader size={25}/>
            </div>
        )
    } else {
        return (
            <RouteProtectorWrapper>
                {children}
            </RouteProtectorWrapper>
        )
    }
}

export default DataFetcherWrapper;