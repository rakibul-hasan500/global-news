import {configureStore} from "@reduxjs/toolkit";
import authApi from "./services/auth/authApi";
import authSlice from "@/redux/services/auth/authSlice";
import userApi from "@/redux/services/user/userApi";
import settingsSlice from "@/redux/services/settings/settingsSlice";
import settingsApi from "@/redux/services/settings/settingsApi";
import mediaApi from "@/redux/services/media/mediaApi";
import categoryApi from "@/redux/services/category/categoryApi";
import tagApi from "@/redux/services/tag/tagApi";
import mediaSlice from "@/redux/services/media/mediaSlice";
import articleApi from "@/redux/services/article/articleApi";
import commentApi from "@/redux/services/comment/commentApi";
import notificationApi from "@/redux/services/notification/notificationApi";
import contactApi from "@/redux/services/contact/contactApi";
import dashboardApi from "@/redux/services/dashboard/dashboardApi";
import categorySlice from "@/redux/services/category/categorySlice";
import notificationSlice from "@/redux/services/notification/notificationSlice";

export const store = configureStore({
    reducer: {

        // Auth
        Auth: authSlice,
        [authApi.reducerPath]: authApi.reducer,

        // Dashboard
        [dashboardApi.reducerPath]: dashboardApi.reducer,

        // User
        [userApi.reducerPath]: userApi.reducer,

        // Article
        [articleApi.reducerPath]: articleApi.reducer,

        // Comment
        [commentApi.reducerPath]: commentApi.reducer,

        // Category
        Category: categorySlice,
        [categoryApi.reducerPath]: categoryApi.reducer,

        // Tag
        [tagApi.reducerPath]: tagApi.reducer,

        // contact
        [contactApi.reducerPath]: contactApi.reducer,

        // Notification
        Notification: notificationSlice,
        [notificationApi.reducerPath]: notificationApi.reducer,

        // Media
        Media: mediaSlice,
        [mediaApi.reducerPath]: mediaApi.reducer,

        // Settings
        Settings: settingsSlice,
        [settingsApi.reducerPath]: settingsApi.reducer,

    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(authApi.middleware)
        .concat(dashboardApi.middleware)
        .concat(userApi.middleware)
        .concat(articleApi.middleware)
        .concat(commentApi.middleware)
        .concat(categoryApi.middleware)
        .concat(tagApi.middleware)
        .concat(contactApi.middleware)
        .concat(notificationApi.middleware)
        .concat(mediaApi.middleware)
        .concat(settingsApi.middleware)
})