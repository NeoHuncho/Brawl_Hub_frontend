import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "globalStats",
  initialState: {
numberOfBrawlers:undefined,
numberOfGadgets: undefined,
numberOfStarPowers:undefined,
globalStats: undefined
  },
  reducers: {
    nBrawlersReceived: (globalStats, action) => {
      const data = action.payload;
      globalStats.numberOfBrawlers = data;
    },
    nGadgetsReceived: (globalStats, action) => {
      const data = action.payload;
      globalStats.numberOfGadgets = data;
    },
    nStarsReceived:(globalStats, action)=>{
      const data= action.payload;
      globalStats.numberOfStarPowers= data
    },
    globalStatsReceived:(globalStats, action)=>{
      const data= action.payload;
      globalStats.globalStats= data
    }

  },
});

export const { nBrawlersReceived,nGadgetsReceived,nStarsReceived,globalStatsReceived} = slice.actions;
export default slice.reducer;
