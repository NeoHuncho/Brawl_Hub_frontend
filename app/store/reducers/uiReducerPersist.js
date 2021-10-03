import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "uiDataPersist",
  initialState: {
    styleIndex: 0,
    sortIndex: 0,
    updateMessage: true,
    betaMessage: true,
    plMessage: true,
    menuMessage: true,
    adMessage: true,
    typeIndex: 0,
    trophiesRange: 2,
    plRange: 2,
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
      if (id == "ad") uiDataPersist.adMessage = false;
    },
    typeIndexChanged: (uiDataPersist, action) => {
      uiDataPersist.typeIndex = action.payload;
    },
    trophiesRangeChanged: (uiDataPersist, action) => {
      uiDataPersist.trophiesRange = action.payload;
    },
    plRangeChanged: (uiDataPersist, action) => {
      uiDataPersist.plRange = action.payload;
    },
    languageChanged: (uiDataPersist, action) => {
      console.log("done it 33", action.payload);
      uiDataPersist.language = action.payload;
    },
  },
});

export const {
  preferencesCarousel,
  messageBoxActions,
  typeIndexChanged,
  trophiesRangeChanged,
  plRangeChanged,
  languageChanged,
} = slice.actions;
export default slice.reducer;
