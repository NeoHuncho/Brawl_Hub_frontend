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
    mapID: null,
    gameType: null,
    seasonIndex: null,
    sortedBrawlers: null,
    sortedTeams: null,
    deviceType: null,
    starPowers_gadgets_votes: null,
    languages: {
      English: "en",
      Español: "es",
      Português: "pt",
      Türkçe: "tr",
      Русский: "ru",
      Français: "fr",
      Deutsh: "de",
      Nederlands: "nl",
      Italiano: "it",
      Svenska: "se",
      Suomi: "fi",
    },
    translations: undefined,
    languageChanging: false,
    challengeOpen: false,
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
      uiData.mapID = action.payload.mapID;
      uiData.starPowers_gadgets_votes= action.payload.starPowers_gadgets_votes
    },
    moreInfoEventClosed: (uiData, action) => {
      uiData.isOpenEvents = false;
      uiData.type = null;
      uiData.name = null;
      uiData.mode = null;
      uiData.image = null;
      uiData.sortedBrawlers = null;
      uiData.sortedTeams = null;
      uiData.mapID = null;
    },
    typeIndexChanged: (uiData, action) => {
      uiData.typeIndex = action.payload;
    },
    rangeIndexChanged: (uiData, action) => {
      uiData.rangeIndex = action.payload;
    },
    translationsChanged: (uiData, action) => {
      uiData.translations = action.payload;
    },
    languageChanging: (uiData, action) => {
      uiData.languageChanging = action.payload;
    },
    challengeOpened: (uiData, action) => {
      uiData.challengeOpen = action.payload;
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
  translationsChanged,
  languageChanging,
  challengeOpened,
} = slice.actions;
export default slice.reducer;
