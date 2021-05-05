import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "playerPersist",
  initialState: {
    playerID: null,
    saved:false
  },
  reducers: {
    userIdReceived: (playerPersist, action) => {
      const data = action.payload;
      playerPersist.playerID = data;      
      playerPersist.saved=true
    },
    userIdReset:(playerPersist,action)=>{
      if(playerPersist.playerID!==''){
        playerPersist.playerID='';
        playerPersist.saved=false;
      }
     
      
    }
  },
});

export const { userIdReceived,userIdReset } = slice.actions;
export default slice.reducer;
