import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "playerPersist",
  initialState: {
    playerID: null,
    saved:false
  },
  reducers: {
    userIdReceived: (playerID, action) => {
      const data = action.payload;
      playerID.playerID = data;//* finish updating this reducer so it keeps id name and color
      //*then change reset and update link in both login and stats
      //* then finish updating other reducer so we get saved stats
      
      playerID.saved=true
    },
    userIdReset:(playerID,action)=>{
      playerID.playerID='';
      playerID.saved=false
    }
  },
});

export const { userIdReceived,userIdReset } = slice.actions;
export default slice.reducer;
