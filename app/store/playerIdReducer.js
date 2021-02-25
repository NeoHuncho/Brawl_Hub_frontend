import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "playerID",
  initialState: {
    playerID: null,
    saved:false
  },
  reducers: {
    userIdReceived: (playerID, action) => {
      const userId = action.payload;
      playerID.playerID = userId;
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
