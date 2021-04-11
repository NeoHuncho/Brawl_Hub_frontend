import { createSlice } from "@reduxjs/toolkit";

import "react-native-url-polyfill/auto";

const slice = createSlice({
  name: "battleLogAndPlayer",
  initialState: {
    name: null,
    nameColor: null,
    icon: null,
    numberOfBrawlers: null,
    numberOfStarPowers: null,
    numberOfGadgets: null,
    playerStats: null,
    trophyLosses: 0,
    trophyWins: 0,
    numberOfGames: 0,
    season: null,
  },
  reducers: {
    receivedPlayerStatsFromDB: (battleLogAndPlayer, action) => {
      let data = action.payload;
      console.log(data);
      battleLogAndPlayer.name = data.name;
      battleLogAndPlayer.nameColor = data.nameColor;
      battleLogAndPlayer.icon = data.icon;
      battleLogAndPlayer.numberOfBrawlers = data.numberOfBrawlers;
      battleLogAndPlayer.numberOfStarPowers = data.numberOfStarPowers;
      battleLogAndPlayer.numberOfGadgets = data.numberOfGadgets;
      battleLogAndPlayer.trophyWins = data.battleLog.trophyWins;
      battleLogAndPlayer.trophyLosses = data.battleLog.trophyLosses;
      battleLogAndPlayer.numberOfGames = data.battleLog.numberOfGames;
      battleLogAndPlayer.season = data.battleLog.season;
      if (data.battleLog.playerStats) {
        battleLogAndPlayer.playerStats = data.battleLog.playerStats.playerStats;
      }
      else{
        battleLogAndPlayer.playerStats = 'no data'
      }
    },
  },
});
export const { receivedPlayerStatsFromDB } = slice.actions;
export default slice.reducer;
