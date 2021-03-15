import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "uiData",
  initialState: {
    title:undefined
  },
  reducers: {
    moreInfoCarouselOpen: (uiData, action) => {

    uiData.title=action.payload


    },
    moreInfoCarouselClosed: (uiData, action) => {
      uiData.title = undefined;
    },
  },
});

export const { moreInfoCarouselOpen,moreInfoCarouselClosed} = slice.actions;
export default slice.reducer;
