import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "uiDataPersist",
  initialState: {
  styleIndex:0,
  sortIndex:0
    
  },
  reducers: {
    preferencesCarousel: (uiDataPersist, action) => {
        uiDataPersist.sortIndex=action.payload.sortIndex
        uiDataPersist.styleIndex= action.payload.styleIndex
    },
  },
});

export const {preferencesCarousel} = slice.actions;
export default slice.reducer;
