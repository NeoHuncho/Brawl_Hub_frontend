import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const slice = createSlice({
  name: "battleLogAndPlayer",
  initialState: {
    battleLog: null,
    player: null,
    lastFetch: null,
    userId: null,
  },
  reducers: {
    battleLogAndPlayerReceived: (battleLogAndPlayer, action) => {
      const data = action.payload;
      const { items, ...playerData } = data;
        (battleLogAndPlayer.battleLog = action.payload.items),
        (battleLogAndPlayer.player = playerData),
        (battleLogAndPlayer.lastFetch = Date.now());
    },
  },
});
export const { battleLogAndPlayerReceived } = slice.actions;
export default slice.reducer;
