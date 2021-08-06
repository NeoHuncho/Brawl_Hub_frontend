import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "brawlify",
  initialState: {
    brawlersList: undefined,
    mapsList: undefined,
    eventsList: undefined,

  },
  reducers: {
    brawlifyDataReceived: (brawlify, action) => {
      const data = action.payload;
      brawlify.brawlersList = data.brawlers;
      brawlify.mapsList = data.maps;
      
    },
    eventsReceived:(brawlify,action)=>{
      brawlify.eventsList= action.payload
    }
  },
});

export const { brawlifyDataReceived,eventsReceived } = slice.actions;
export default slice.reducer;
