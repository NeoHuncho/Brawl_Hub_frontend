import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "uiData",
  initialState: {
    isOpen:false,
    type:null,
    displayName:null,
    name:null,
    mode:null,
    image:null,
    gameType:null,
    seasonIndex:null
    
  },
  reducers: {
    moreInfoCarouselOpen: (uiData, action) => {
    uiData.isOpen=action.payload.isOpen
    uiData.type= action.payload.type
    uiData.name=action.payload.name
    uiData.mode= action.payload.mode
    uiData.image= action.payload.image
    uiData.displayName= action.payload.displayName
    },
    moreInfoCarouselClosed: (uiData, action) => {
      uiData.isOpen=false
      uiData.type=null
      uiData.name=null
      uiData.mode= null
      uiData.image=null,
      uiData.displayName=null
    },
    receivedGameTypeAndSeason:(uiData,action)=>{
      uiData.gameType= action.payload.gameType
      uiData.seasonIndex= action.payload.seasonIndex
    }
  },
});

export const { moreInfoCarouselOpen,moreInfoCarouselClosed,receivedGameTypeAndSeason} = slice.actions;
export default slice.reducer;
