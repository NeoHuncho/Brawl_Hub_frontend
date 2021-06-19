import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "globalStats",
  initialState: {
    numbers: {
      numberOfBrawlers: undefined,
      numberOfGadgets: undefined,
      numberOfStarPowers: undefined,
      totalUnlockables: undefined,
    },
    ranges: undefined,
    minBrawlerEvent: undefined,
    minTeamEvent: undefined,
    minBrawlerPL: undefined,
    minTeamPL: undefined,
    seasonGlobal: undefined,
    globalStats: undefined,
    slotNumberActive: undefined,
    slotNumberUpcoming: undefined,
    seasonStats: undefined,
    powerLeagueActive: undefined,
  },
  reducers: {
    globalCountsReceived: (globalStats, action) => {
      const data = action.payload;
      globalStats.ranges = data.ranges;
      globalStats.numbers.numberOfBrawlers = data.nBrawlers;
      globalStats.numbers.numberOfGadgets = data.nGadgets;
      globalStats.numbers.numberOfStarPowers = data.nStarPowers;
      globalStats.numbers.totalUnlockables =
        data.nBrawlers + data.nGadgets + data.nStarPowers;
      globalStats.minBrawlerEvent = data.minBrawlerEvent;
      globalStats.minTeamEvent = data.minTeamEvent;
      globalStats.minBrawlerPL = data.minBrawlerPL;
      globalStats.minTeamPL = data.minTeamPL;
      globalStats.seasonGlobal = data.seasonGlobal;
      globalStats.seasonStats = data.seasonStats;
      globalStats.slotNumberActive = data.slotNumActive;
      globalStats.slotNumberUpcoming = data.slotNumUpcoming;
      globalStats.powerLeagueActive = data.powerLeagueActive;
    },

    globalStatsReceived: (globalStats, action) => {
      const data = action.payload;
      globalStats.globalStats = data;
    },
  },
});

export const { globalCountsReceived, globalStatsReceived } = slice.actions;
export default slice.reducer;
