import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "globalStats",
  initialState: {
    numberOfBrawlers: undefined,
    numberOfGadgets: undefined,
    numberOfStarPowers: undefined,
    minBrawlerEvent: undefined,
    minTeamEvent: undefined,
    minBrawlerPL: undefined,
    minTeamPL: undefined,
    seasonGlobal: undefined,
    globalStats: undefined,
    slotNumberActive:undefined,
    slotNumberUpcoming: undefined
  },
  reducers: {
    globalCountsReceived: (globalStats, action) => {
      const data = action.payload;
      globalStats.numberOfBrawlers = data.nBrawlers;
      globalStats.numberOfGadgets = data.nGadgets;
      globalStats.numberOfStarPowers = data.nStarPowers;
      globalStats.minBrawlerEvent = data.minBrawlerEvent;
      globalStats.minTeamEvent = data.minTeamEvent;
      globalStats.minBrawlerPL = data.minBrawlerPL;
      globalStats.minTeamPL = data.minTeamPL;
      globalStats.seasonGlobal = data.seasonGlobal;
      globalStats.slotNumberActive=data.slotNumActive;
      globalStats.slotNumberUpcoming= data.slotNumUpcoming
    },

    globalStatsReceived: (globalStats, action) => {
      const data = action.payload;
      globalStats.globalStats = data;
    },
  },
});

export const {
  globalCountsReceived,
  globalStatsReceived,
} = slice.actions;
export default slice.reducer;
