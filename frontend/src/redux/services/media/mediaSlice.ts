import {createSlice} from "@reduxjs/toolkit";

const mediaSlice = createSlice({
    name: "mediaSlice",
    initialState: {
        mediaSelectorOpen: false,
        mediaType: "",
        multipleMediaSelect: false,
        selectedMediaRedux: [],
        mediaSelectedFor: ""
    },
    reducers: {

        // Handle Open Media Selector Modal
        handleOpenMediaSelectorModal: (state, action)=>{
            state.mediaSelectorOpen = true;
            state.mediaType = action.payload.type;
            state.multipleMediaSelect = action.payload.multiple;
            state.selectedMediaRedux = action.payload.selected;
            state.mediaSelectedFor = action.payload.for
        },

        // Handle Select Media To Redux
        handleSelectMediaRedux: (state: any, action)=>{
            if(state.multipleMediaSelect){
                const exist = state.selectedMediaRedux.find((item: any)=>item.url === action.payload.url)
                if(exist){
                    state.selectedMediaRedux = state.selectedMediaRedux.filter((item: any)=>item.url !== action.payload.url)
                }else{
                    state.selectedMediaRedux = [...state.selectedMediaRedux, action.payload]
                }
            }else{
                state.selectedMediaRedux = [action.payload]
            }
        },

        // Handle Close Media Selector Modal
        handleCloseMediaSelectorModal: (state, action)=>{
            state.mediaSelectorOpen = false;
            state.multipleMediaSelect = false;
        },

        // Handle Cancel Media Selector Modal
        handleCancelMediaSelectorModal: (state: any)=>{
            state.mediaSelectorOpen = false;
            state.multipleMediaSelect = false;
            state.selectedMediaRedux = [];
            state.mediaSelectedFor = "";
        }

    }
})

export const {
    handleOpenMediaSelectorModal,
    handleSelectMediaRedux,
    handleCloseMediaSelectorModal,
    handleCancelMediaSelectorModal
} = mediaSlice.actions;
export default mediaSlice.reducer;