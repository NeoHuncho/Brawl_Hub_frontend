import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "brawlify",
  initialState: {
    brawlersList: undefined,
    mapsList: undefined,
  },
  reducers: {
    brawlersReceived: (brawlify, action) => {
      const data = action.payload;
      brawlify.brawlersList = data;
    },
    mapsReceived: (brawlify, action) => {
      const data = action.payload;
      brawlify.mapsList = data;
    },
  },
});

export const { brawlersReceived,mapsReceived} = slice.actions;
export default slice.reducer;
