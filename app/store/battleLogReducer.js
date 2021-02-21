import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const slice = createSlice({
  name: "battleLogAndPlayer",
  initialState: {
    battleLog: null,
    player: null,
    lastFetch: null,
    userId: null,
    playerStats: null,
    wins: 0,
    losses: 0,
    trophyLosses: 0,
    trophyWins: 0,
    numberOfGames: 0,
  },
  reducers: {
    battleLogAndPlayerReceived: (battleLogAndPlayer, action) => {
      const data = action.payload;
      const { items, ...playerData } = data;
      (battleLogAndPlayer.battleLog = action.payload.items),
        (battleLogAndPlayer.player = playerData),
        (battleLogAndPlayer.lastFetch = Date.now());
    },

    processedPlayerStats: (battleLogAndPlayer, action) => {
      const userId = action.payload;
      const playerId = "#" + userId;

      let wins = 0;
      let losses = 0;
      let trophyLosses = 0;
      let trophyWins = 0;
      let numberOfGames = 0;

      let playerStats = {};
      for (const element of battleLogAndPlayer.battleLog) {
        if (element.battle.trophyChange) {
          numberOfGames++;
          let mapName = element.event.map;
          let mode = element.event.mode;

          let findBrawler = (element) => {
            if (element.battle.teams) {
              for (const team of element.battle.teams)
                for (const player of team)
                  if (player.tag == playerId) return player.brawler.name;
            } else {
              for (const player of element.battle.players)
                if (player.tag == playerId) return player.brawler.name;
            }
          };
          let brawler = findBrawler(element);

          let calculateRatio = (wins, losses) => {
            return (wins / (wins + losses)) * 100;
          };
          if (element.battle.trophyChange > 0) {
            trophyWins += element.battle.trophyChange;

            if (playerStats[mode]) {
              playerStats[mode].wins += 1;
              if (playerStats[mode].losses)
                playerStats[mode].winRatio = calculateRatio(
                  playerStats[mode].wins,
                  playerStats[mode].losses
                );
            } else playerStats[mode] = { wins: 1, losses: 0, winRatio: 100 };

            if (playerStats[mode][mapName]) {
              playerStats[mode][mapName].wins += 1;
              if (playerStats[mode][mapName].losses)
                playerStats[mode][mapName].winRatio = calculateRatio(
                  playerStats[mode][mapName].wins,
                  playerStats[mode][mapName].losses
                );
            } else
              playerStats[mode][mapName] = {
                wins: 1,
                losses: 0,
                winRatio: 100,
              };

            if (playerStats[mode][mapName][brawler]) {
              playerStats[mode][mapName][brawler].wins += 1;
              if (playerStats[mode][mapName][brawler].losses)
                playerStats[mode][mapName][brawler].winRatio = calculateRatio(
                  playerStats[mode][mapName][brawler].wins,
                  playerStats[mode][mapName][brawler].losses
                );
            } else
              playerStats[mode][mapName][brawler] = {
                wins: 1,
                losses: 0,
                winRatio: 100,
              };
            //
          } else if (element.battle.trophyChange) {
            trophyLosses += Math.abs(element.battle.trophyChange);
            losses = losses + 1;

            if (playerStats[mode]) {
              playerStats[mode].losses += 1;
              if (playerStats[mode].wins)
                playerStats[mode].winRatio = calculateRatio(
                  playerStats[mode].wins,
                  playerStats[mode].losses
                );
            } else playerStats[mode] = { wins: 0, losses: 1, winRatio: 0 };

            if (playerStats[mode][mapName]) {
              playerStats[mode][mapName].losses += 1;
              if (playerStats[mode][mapName].wins)
                playerStats[mode][mapName].winRatio = calculateRatio(
                  playerStats[mode][mapName].wins,
                  playerStats[mode][mapName].losses
                );
            } else
              playerStats[mode][mapName] = { wins: 0, losses: 1, winRatio: 0 };

            if (playerStats[mode][mapName][brawler]) {
              playerStats[mode][mapName][brawler].losses += 1;
              if (playerStats[mode][mapName][brawler].wins)
                playerStats[mode][mapName][brawler].winRatio = calculateRatio(
                  playerStats[mode][mapName][brawler].wins,
                  playerStats[mode][mapName][brawler].losses
                );
            } else
              playerStats[mode][mapName][brawler] = {
                wins: 0,
                losses: 1,
                winRatio: 0,
              };
          }
        }
      }
     ;
     if(!playerStats.brawlBall){
       playerStats.brawlBall= { wins: 0, losses: 0, winRatio: 0 }
     }
     if(!playerStats.bounty){
       playerStats.bounty= { wins: 0, losses: 0, winRatio: 0 }
     }
     if(!playerStats.soloShowdown){
       playerStats.soloShowdown= { wins: 0, losses: 0, winRatio: 0 }
     }
     if(!playerStats.duoShowdown){
       playerStats.duoShowdown= { wins: 0, losses: 0, winRatio: 0 }
     }
     if(!playerStats.siege){
       playerStats.siege= { wins: 0, losses: 0, winRatio: 0 }
     }
     if(!playerStats.heist){
       playerStats.heist= { wins: 0, losses: 0, winRatio: 0 }
     }
     if(!playerStats.gemGrab){
       playerStats.gemGrab= { wins: 0, losses: 0, winRatio: 0 }
     }
     if(!playerStats.hotZone){
       playerStats.hotZone= { wins: 0, losses: 0, winRatio: 0 }
     }
      (battleLogAndPlayer.wins = wins),
        (battleLogAndPlayer.losses = losses),
        (battleLogAndPlayer.trophyLosses = trophyLosses),
        (battleLogAndPlayer.trophyWins = trophyWins),
        (battleLogAndPlayer.playerStats = playerStats),
        (battleLogAndPlayer.userId = playerId),
        (battleLogAndPlayer.numberOfGames = numberOfGames);
    },
  },
});
export const {
  battleLogAndPlayerReceived,
  processedPlayerStats,
} = slice.actions;
export default slice.reducer;
