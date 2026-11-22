import {createSlice} from "@reduxjs/toolkit";

const categorySlice = createSlice({
    name: "categorySlice",
    initialState: {
        allCategories: null
    },
    reducers: {

        // Handle Set All Categories To Redux
        handleSetAllCategoriesToRedux: (state: any, action: any) => {
            state.allCategories = action.payload
        }

    }
})

export const {
    handleSetAllCategoriesToRedux
} = categorySlice.actions;
export default categorySlice.reducer;