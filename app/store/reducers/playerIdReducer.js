import { createSlice, } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "playerPersist",
  initialState: {
    playerID: null,
    saved: false,
  },
  reducers: {
    userIdAndNameReceived: (playerPersist, action) => {
      const data = action.payload;
      playerPersist.playerID = data.userId;
      playerPersist.playerName = data.name;
      playerPersist.saved = true;
    },
    userIdReset: (playerPersist, action) => {
      if (playerPersist.playerID !== "") {
        playerPersist.playerID = "";
        playerPersist.playerName = "";
        playerPersist.saved = false;
      }
    },
  },
  
});

export const { userIdAndNameReceived, userIdReset } = slice.actions;
export default slice.reducer;
