import { createSlice } from "@reduxjs/toolkit";
import { KEY_PREFIX } from "redux-persist/es/constants";

const slice = createSlice({
  name: "uiData",
  initialState: {
    isOpen: false,
    isOpenEvents: false,
    typeIndex: null,
    rangeIndex: null,
    type: null,
    displayName: null,
    name: null,
    mode: null,
    image: null,
    gameType: null,
    seasonIndex: null,
    sortedBrawlers: null,
    sortedTeams: null,
    deviceType: null,
    languages: {
      Português: " PT",
      Deutsh: " DE",
      Suomi: " FI",
      हिन्दी: "IN",
      中文: " CN",
      Español: " ES",
      Français: " FR",
      Italiano: "IT",
      日本語: " JP",
      한국어: " KR",
      Nederlands: " NL",
      Русский: " RU",
      Svenska: " SE",
      Türkçe: "TR",
      繁體中文: " HK",
    },
  },
  reducers: {
    deviceTypeReceived: (uiData, action) => {
      uiData.deviceType = action.payload;
    },
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
      uiData.sortedBrawlers = action.payload.sortedBrawlers;
      uiData.sortedTeams = action.payload.sortedTeams;
    },
    moreInfoEventClosed: (uiData, action) => {
      uiData.isOpenEvents = false;
      uiData.type = null;
      uiData.name = null;
      uiData.mode = null;
      uiData.image = null;
      uiData.sortedBrawlers = null;
      uiData.sortedTeams = null;
    },
    typeIndexChanged: (uiData, action) => {
      uiData.typeIndex = action.payload;
    },
    rangeIndexChanged: (uiData, action) => {
      uiData.rangeIndex = action.payload;
    },
  },
});

export const {
  deviceTypeReceived,
  moreInfoCarouselOpen,
  moreInfoCarouselClosed,
  receivedGameTypeAndSeason,
  moreInfoEventOpen,
  moreInfoEventClosed,
  typeIndexChanged,
  rangeIndexChanged,
} = slice.actions;
export default slice.reducer;
