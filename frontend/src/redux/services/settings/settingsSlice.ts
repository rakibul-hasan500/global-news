import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        app: null,
        contact: null
    },
    reducers: {

        // Handle Set App Settings Data To Redux
        handleSetAppSettingsDataToRedux: (state, action: any) => {
            state.app = action.payload;
        },

        // Handle Set Contact Settings Data To Redux
        handleSetContactSettingsDataToRedux: (state, action: any) => {
            state.contact = action.payload;
        }

    }
});

export const {
    handleSetAppSettingsDataToRedux,
    handleSetContactSettingsDataToRedux
} = settingsSlice.actions;

export default settingsSlice.reducer;