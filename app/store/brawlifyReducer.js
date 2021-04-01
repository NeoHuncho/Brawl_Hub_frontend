import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "brawlify",
  initialState: {
    brawlersList: undefined,
    mapsList: undefined,
    eventsList: undefined,
    iconList: undefined
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
    eventsReceived:(brawlify, action)=>{
      const data= action.payload;
      brawlify.eventsList= data
    },
    iconsReceived:(brawlify, action)=>{
      const data= action.payload;
      brawlify.iconsList= data
    }

  },
});

export const { brawlersReceived,mapsReceived,eventsReceived,iconsReceived} = slice.actions;
export default slice.reducer;
