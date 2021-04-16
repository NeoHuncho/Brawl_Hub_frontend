import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "brawlify",
  initialState: {
    brawlersList: undefined,
    mapsList: undefined,
    eventsList: undefined,
    iconList: undefined,
  },
  reducers: {
    brawlifyDataReceived: (brawlify, action) => {
      const data = action.payload;
      brawlify.brawlersList = data.brawlers;
      brawlify.mapsList = data.maps;
      brawlify.iconList = data.icons;
    },
    eventsReceived:(brawlify,action)=>{
      brawlify.eventsList= action.payload
    }
  },
});

export const { brawlifyDataReceived,eventsReceived } = slice.actions;
export default slice.reducer;
