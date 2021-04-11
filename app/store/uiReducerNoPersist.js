import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "uiData",
  initialState: {
    isOpen:false,
    type:null,
    name:null
  },
  reducers: {
    moreInfoCarouselOpen: (uiData, action) => {

    uiData.isOpen=action.payload.isOpen
    uiData.type= action.payload.type
    uiData.name=action.payload.name
    },
    moreInfoCarouselClosed: (uiData, action) => {
      uiData.isOpen=false
      uiData.type=null
      uiData.name=null
    },
  },
});

export const { moreInfoCarouselOpen,moreInfoCarouselClosed} = slice.actions;
export default slice.reducer;
