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
    rangesMinus: undefined,
    rangesPLMinus: undefined,
    minBrawlerEvent: undefined,
    minTeamEvent: undefined,
    minBrawlerPL: undefined,
    minTeamPL: undefined,
    seasonGlobal: undefined,
    globalStats: undefined,
    slotNumberActive: undefined,
    slotNumberUpcoming: undefined,
  },
  reducers: {
    globalCountsReceived: (globalStats, action) => {
      const data = action.payload;
      globalStats.rangesMinus = data.rangesMinus;
      globalStats.rangesPLMinus = data.rangesPLMinus;
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
      globalStats.slotNumberActive = data.slotNumActive;
      globalStats.slotNumberUpcoming = data.slotNumUpcoming;
    },

    globalStatsReceived: (globalStats, action) => {
      const data = action.payload;
      globalStats.globalStats = data;
    },
  },
});

export const { globalCountsReceived, globalStatsReceived } = slice.actions;
export default slice.reducer;
