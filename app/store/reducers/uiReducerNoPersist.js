import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "uiData",
  initialState: {
    isOpen: false,
    isOpenEvents:false,
    type: null,
    displayName: null,
    name: null,
    mode: null,
    image: null,
    gameType: null,
    seasonIndex: null,
    sortedBrawlers:null,
    sortedTeams:null
  },
  reducers: {
    moreInfoCarouselOpen: (uiData, action) => {
      uiData.isOpen = action.payload.isOpen;
      uiData.type = action.payload.type;
      uiData.name = action.payload.name;
      uiData.mode = action.payload.mode;
      uiData.image = action.payload.image;
      uiData.displayName = action.payload.displayName;
    },
    moreInfoCarouselClosed: (uiData, action) => {
      uiData.isOpen = false;
      uiData.type = null;
      uiData.name = null;
      uiData.mode = null;
      uiData.image = null;
      uiData.displayName = null;
    },
    receivedGameTypeAndSeason: (uiData, action) => {
      uiData.gameType = action.payload.gameType;
      uiData.seasonIndex = action.payload.seasonIndex;
    },
    moreInfoEventOpen: (uiData, action) => {
      uiData.isOpenEvents = true;
      uiData.type = action.payload.type;
      uiData.name = action.payload.name;
      uiData.mode = action.payload.mode;
      uiData.image = action.payload.image;
      uiData.sortedBrawlers= action.payload.sortedBrawlers;
      uiData.sortedTeams= action.payload.sortedTeams
    },
    moreInfoEventClosed: (uiData, action) => {
      uiData.isOpenEvents = false;
      uiData.type = null;
      uiData.name = null;
      uiData.mode = null;
      uiData.image = null;
      uiData.sortedBrawlers=null;
      uiData.sortedTeams=null
    },
  },
});

export const {
  moreInfoCarouselOpen,
  moreInfoCarouselClosed,
  receivedGameTypeAndSeason,
  moreInfoEventOpen,
  moreInfoEventClosed,
} = slice.actions;
export default slice.reducer;
