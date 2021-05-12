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
    averageTrophies: 0,
    soloPLTrophies: 0,
    teamPLTrophies: 0,
    avg3vs3Victories: 0,
    avgDuoVictories: 0,
    avgSoloVictories: 0,
    trophyWins: 0,
    trophyLosses: 0,
    numberOfGames: 0,
    playerStats: null,
    season: null,
  },
  reducers: {
    receivedPlayerStatsFromDB: (battleLogAndPlayer, action) => {
      let data = action.payload;
      battleLogAndPlayer.name = data.globalStats.name;
      battleLogAndPlayer.nameColor = data.globalStats.nameColor;
      battleLogAndPlayer.icon = data.globalStats.icon;
      battleLogAndPlayer.numberOfBrawlers = data.globalStats.numberOfBrawlers;
      battleLogAndPlayer.numberOfStarPowers =
        data.globalStats.numberOfStarPowers;
      battleLogAndPlayer.numberOfGadgets = data.globalStats.numberOfGadgets;
      battleLogAndPlayer.averageTrophies = data.globalStats.averageTrophies;
      battleLogAndPlayer.soloPLTrophies = data.globalStats.playerPLTrophySolo;
      battleLogAndPlayer.teamPLTrophies = data.globalStats.playerPLTrophyTeam;
      battleLogAndPlayer.avg3vs3Victories = data.globalStats.avg3vs3Victories;
      battleLogAndPlayer.avgDuoVictories = data.globalStats.avgDuoVictories;
      battleLogAndPlayer.avgSoloVictories = data.globalStats.avgSoloVictories;
      battleLogAndPlayer.trophyWins = data.globalStats.trophyWins;
      battleLogAndPlayer.trophyLosses = data.globalStats.trophyLosses;
      battleLogAndPlayer.numberOfGames = data.globalStats.numberOfGames;

      if (data.brawlers !== {} || data.brawlers !== undefined) {
        battleLogAndPlayer.playerStats = data;
      } else {
        battleLogAndPlayer.playerStats = "no data";
      }
    },
  },
});
export const { receivedPlayerStatsFromDB } = slice.actions;
export default slice.reducer;
