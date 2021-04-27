import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "uiDataPersist",
  initialState: {
    styleIndex: 0,
    sortIndex: 0,
    updateMessage: true,
    betaMessage: true,
    plMessage: true,
    menuMessage:true
  },
  reducers: {
    preferencesCarousel: (uiDataPersist, action) => {
      uiDataPersist.sortIndex = action.payload.sortIndex;
      uiDataPersist.styleIndex = action.payload.styleIndex;
    },
    messageBoxActions: (uiDataPersist, action) => {
      let id = action.payload;
      if (id == "beta") uiDataPersist.betaMessage = false;
      if (id == "update") uiDataPersist.updateMessage = false;
      if (id == "pl") uiDataPersist.plMessage = false;
      if (id == "menu") uiDataPersist.menuMessage = false;
    },
  },
});

export const { preferencesCarousel, messageBoxActions } = slice.actions;
export default slice.reducer;
