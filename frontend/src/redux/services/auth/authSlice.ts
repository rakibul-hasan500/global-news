import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "authSlice",
    initialState: {
        accessToken: null,
        user: null,
        authLoading: true,
    },
    reducers: {

        // Handle Set User Data To redux
        handleSetUserDataToRedux: (state, action) => {
            state.user = action.payload;
        },

        // Handle Set Access Token To Redux
        handleSetAccessTokenToRedux: (state, action) => {
            state.accessToken = action.payload
        },

        // Handle Clear Auth Redux Data
        handleClearAuthReduxData: (state) => {
            state.accessToken = null;
            state.user = null;
        },

        // Handle Set Auth Loading To Redux
        handleSetAuthLoadingToRedux: (state, action) => {
            if(typeof action.payload === "boolean") {
                state.authLoading = action.payload;
            }
        }

    }
})

export const {
    handleSetUserDataToRedux,
    handleSetAccessTokenToRedux,
    handleClearAuthReduxData,
    handleSetAuthLoadingToRedux
} = authSlice.actions;
export default authSlice.reducer;