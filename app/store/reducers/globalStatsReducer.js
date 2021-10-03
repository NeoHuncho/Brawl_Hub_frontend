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
    rangesDisplay: undefined,
    seasons: undefined,
    seasonStats: undefined,
    globalStats: undefined,
    seasonEvents: undefined,
    powerLeagueActive: undefined,
    eventActive: undefined,
    slotIDMaximum: undefined,
    challenge_hash: undefined,
    challenge_active: undefined,
    challenge_imageWidth: undefined,
    challenge_imageHeight: undefined,
    challenge_endTime: undefined,
  },
  reducers: {
    globalCountsReceived: (globalStats, action) => {
      const data = action.payload["switches"];

      globalStats.challenge_active = data.challenge_active;
      if (globalStats.challenge_active == true) {
        globalStats.challenge_endTime = data.challenge_endTime;
        globalStats.challenge_startTime = data.challenge_startTime;
        globalStats.challenge_icon = data.challenge_icon;
        globalStats.challenge_name = data.challenge_name;
        globalStats.challenge_hash = data.challenge_hash;
        globalStats.challenge_imageWidth = data.challenge_imageWidth;
        globalStats.challenge_imageHeight = data.challenge_imageHeight;
      }
      globalStats.ranges = data.rangesV2;
      globalStats.rangesDisplay = data.rangesDisplay;
      globalStats.numbers.numberOfBrawlers = data.total_numberOfBrawlers;
      globalStats.numbers.numberOfGadgets = data.total_numberOfGadgets;
      globalStats.numbers.numberOfStarPowers = data.total_numberOfStarPowers;
      globalStats.numbers.totalUnlockables =
        globalStats.numbers.numberOfBrawlers +
        globalStats.numbers.numberOfGadgets +
        globalStats.numbers.numberOfStarPowers;
      +data.total_numberOfGadgets;
      +data.total_numberOfStarPowers;
      globalStats.seasons = data.seasons;
      globalStats.seasonStats = data.seasonStatsV2;
      globalStats.seasonEvents = data.seasonEvents;
      globalStats.powerLeagueActive = data.powerLeagueActive;
      globalStats.slotIDMaximum = data.slotIDMaximum;
    },

    globalStatsReceived: (globalStats, action) => {
      const data = action.payload;
      globalStats.globalStats = data;
    },
    seasonChangeReceived: (globalStats, action) => {
      globalStats.seasonStats = action.payload;
    },
  },
});

export const {
  globalCountsReceived,
  globalStatsReceived,
  seasonChangeReceived,
} = slice.actions;
export default slice.reducer;
