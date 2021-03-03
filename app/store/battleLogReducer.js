import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

import "react-native-url-polyfill/auto";

const slice = createSlice({
  name: "battleLogAndPlayer",
  initialState: {
    battleLog: null,
    player: null,
    lastMatch: null,
    userId: null,
    playerStats: null,
    trophyLosses: 0,
    trophyWins: 0,
    numberOfGames: 0,
  },
  reducers: {
    battleLogAndPlayerReceived: (battleLogAndPlayer, action) => {
      const data = action.payload;
      const { items, ...playerData } = data;
      (battleLogAndPlayer.battleLog = action.payload.items),
        (battleLogAndPlayer.player = playerData);
    },

    processedPlayerStats: (battleLogAndPlayer, action) => {
      const userId = action.payload;
      const playerId = "#" + userId;

      let lastMatch = battleLogAndPlayer.battleLog[0].battleTime;

      let wins = 0;
      let losses = 0;
      let trophyLosses = 0;
      let trophyWins = 0;
      let numberOfGames = 0;

      let playerStats = { mode: {} };

      for (const element of battleLogAndPlayer.battleLog) {
        console.log("CALLLLDED");
        if (element.battle.trophyChange) {
          numberOfGames++;
          let mapName = element.event.map;
          let mode = element.event.mode;
          console.log(mode);
          let findBrawler = (element) => {
            if (element.battle.teams) {
              for (const team of element.battle.teams)
                for (const player of team)
                  if (player.tag == playerId)
                    return [player.brawler.name, player.brawler.trophies];
            } else {
              for (const player of element.battle.players)
                if (player.tag == playerId)
                  return [player.brawler.name, player.brawler.trophies];
            }
          };
          let [brawlerName, brawlerTrophies] = findBrawler(element);

          let findTeam = (element) => {
            let brawler = [];
            let trophies = 0;

            let brawlerTeam0 = [];
            let brawlerTeam1 = [];
            let trophiesTeam0 = 0;
            let trophiesTeam1 = 0;
            let inTeam0 = false;
            let inTeam1 = false;

            if (element.battle.teams) {
              for (const player of element.battle.teams[0]) {
                if (player.tag == playerId) {
                  inTeam0 = true;
                }
                brawlerTeam0.push(player.brawler.name);
                trophiesTeam0 += player.brawler.trophies;
              }
              for (const player of element.battle.teams[1]) {
                if (player.tag == playerId) {
                  inTeam1 = true;
                }
                brawlerTeam1.push(player.brawler.name);
                trophiesTeam1 += player.brawler.trophies;
              }
              if (inTeam0) {
                return [brawlerTeam0, trophiesTeam0];
              } else {
                return [brawlerTeam1, trophiesTeam1];
              }
            }
          };
      
          let brawlerTeam=null;
          let trophiesTeam=null;
          if(element.battle.teams){
            let [bTeam, tTeam] = findTeam(element);
            brawlerTeam=bTeam;
            trophiesTeam=tTeam;
            brawlerTeam.sort();
          }
          let calculateRatio = (wins, losses) => {
            return (wins / (wins + losses)) * 100;
          };
          if (element.battle.trophyChange > 0) {
            trophyWins += element.battle.trophyChange;

            if (playerStats.mode[mode]) {
              playerStats.mode[mode].wins += 1;
              playerStats.mode[mode].winsByTrophies += brawlerTrophies;
              if (playerStats.mode[mode].lossesByTrophies !== 0) {
                playerStats.mode[mode].winRatio = calculateRatio(
                  playerStats.mode[mode].winsByTrophies,
                  playerStats.mode[mode].lossesByTrophies
                );
              } else {
                playerStats.mode[mode].winRatio = 100;
              }
            } else
              playerStats.mode[mode] = {
                wins: 1,
                losses: 0,
                winRatio: 100,
                lossesByTrophies: 0,
                winsByTrophies: brawlerTrophies,
                map: {},
              };
            if (playerStats.mode[mode].map[mapName]) {
              playerStats.mode[mode].map[mapName].wins += 1;
              playerStats.mode[mode].map[
                mapName
              ].winsByTrophies += brawlerTrophies;

              if (playerStats.mode[mode].map[mapName].lossesByTrophies !== 0) {
                playerStats.mode[mode].map[mapName].winRatio = calculateRatio(
                  playerStats.mode[mode].map[mapName].winsByTrophies,
                  playerStats.mode[mode].map[mapName].lossesByTrophies
                );
              } else playerStats.mode[mode].map[mapName].winRatio = 100;
            } else {
              playerStats.mode[mode].map[mapName] = {
                wins: 1,
                losses: 0,
                winRatio: 100,
                lossesByTrophies: 0,
                winsByTrophies: brawlerTrophies,
                brawler: {},
              };
            }

            if (playerStats.mode[mode].map[mapName].brawler[brawlerName]) {
              playerStats.mode[mode].map[mapName].brawler[
                brawlerName
              ].wins += 1;
              playerStats.mode[mode].map[mapName].brawler[
                brawlerName
              ].winsByTrophies += parseInt(brawlerTrophies);
              if (
                playerStats.mode[mode].map[mapName].brawler[brawlerName]
                  .lossesByTrophies !== 0
              ) {
                playerStats.mode[mode].map[mapName].brawler[
                  brawlerName
                ].winRatio = calculateRatio(
                  playerStats.mode[mode].map[mapName].brawler[brawlerName]
                    .winsByTrophies,
                  playerStats.mode[mode].map[mapName].brawler[brawlerName]
                    .lossesByTrophies
                );
              } else {
                playerStats.mode[mode].map[mapName].brawler[
                  brawlerName
                ].winRatio = 100;
              }
            } else
              playerStats.mode[mode].map[mapName].brawler[brawlerName] = {
                wins: 1,
                losses: 0,
                winRatio: 100,
                lossesByTrophies: 0,
                winsByTrophies: brawlerTrophies,
                team:{}
              };

            if (playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam]) {
              playerStats.mode[mode].map[mapName].brawler[
                brawlerName
              ].team[brawlerTeam].wins += 1;
              playerStats.mode[mode].map[mapName].brawler[
                brawlerName
              ].team[brawlerTeam].winsByTrophies += parseInt(trophiesTeam);
              if (
                playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam]
                  .lossesByTrophies !== 0
              ) {
                playerStats.mode[mode].map[mapName].brawler[
                  brawlerName
                ].team[brawlerTeam].winRatio = calculateRatio(
                  playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam]
                    .winsByTrophies,
                  playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam]
                    .lossesByTrophies
                );
              } else {
                playerStats.mode[mode].map[mapName].brawler[
                  brawlerName
                ].team[brawlerTeam].winRatio = 100;
              }
            } else
              playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam] = {
                wins: 1,
                losses: 0,
                winRatio: 100,
                lossesByTrophies: 0,
                winsByTrophies: brawlerTrophies,
              };
            //
          } else if (element.battle.trophyChange < 0) {
            trophyLosses += Math.abs(element.battle.trophyChange);

            if (playerStats.mode[mode]) {
              playerStats.mode[mode].losses += 1;
              playerStats.mode[mode].lossesByTrophies += brawlerTrophies;
              if (playerStats.mode[mode].winsByTrophies !== 0) {
                playerStats.mode[mode].winRatio = calculateRatio(
                  playerStats.mode[mode].winsByTrophies,
                  playerStats.mode[mode].lossesByTrophies
                );
              } else {
                playerStats.mode[mode].winRatio = 0;
              }
            } else
              playerStats.mode[mode] = {
                wins: 0,
                losses: 1,
                winRatio: 0,
                lossesByTrophies: brawlerTrophies,
                winsByTrophies: 0,
                map: {},
              };

            if (playerStats.mode[mode].map[mapName]) {
              playerStats.mode[mode].map[mapName].losses += 1;
              playerStats.mode[mode].map[
                mapName
              ].lossesByTrophies += brawlerTrophies;
              if (playerStats.mode[mode].map[mapName].winsByTrophies !== 0) {
                playerStats.mode[mode].map[mapName].winRatio = calculateRatio(
                  playerStats.mode[mode].map[mapName].winsByTrophies,
                  playerStats.mode[mode].map[mapName].lossesByTrophies
                );
              } else playerStats.mode[mode].map[mapName].winRatio = 0;
            } else
              playerStats.mode[mode].map[mapName] = {
                wins: 0,
                losses: 1,
                winRatio: 0,
                lossesByTrophies: brawlerTrophies,
                winsByTrophies: 0,
                brawler: {},
              };

            if (playerStats.mode[mode].map[mapName].brawler[brawlerName]) {
              playerStats.mode[mode].map[mapName].brawler[
                brawlerName
              ].losses += 1;
              playerStats.mode[mode].map[mapName].brawler[
                brawlerName
              ].lossesByTrophies += parseInt(brawlerTrophies);
              if (
                playerStats.mode[mode].map[mapName].brawler[brawlerName]
                  .winsByTrophies !== 0
              ) {
                playerStats.mode[mode].map[mapName].brawler[
                  brawlerName
                ].winRatio = calculateRatio(
                  playerStats.mode[mode].map[mapName].brawler[brawlerName]
                    .winsByTrophies,
                  playerStats.mode[mode].map[mapName].brawler[brawlerName]
                    .lossesByTrophies
                );
              } else {
                playerStats.mode[mode].map[mapName].brawler[
                  brawlerName
                ].winRatio = 0;
              }
            } else
              playerStats.mode[mode].map[mapName].brawler[brawlerName] = {
                wins: 0,
                losses: 1,
                winRatio: 0,
                lossesByTrophies: brawlerTrophies,
                winsByTrophies: 0,
                team:{}
              };

            if (playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam]) {
              playerStats.mode[mode].map[mapName].brawler[
                brawlerName
              ].team[brawlerTeam].losses += 1;
              playerStats.mode[mode].map[mapName].brawler[
                brawlerName
              ].team[brawlerTeam].lossesByTrophies += parseInt(trophiesTeam);
              if (
                playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam]
                  .winsByTrophies !== 0
              ) {
                playerStats.mode[mode].map[mapName].brawler[
                  brawlerName
                ].team[brawlerTeam].winRatio = calculateRatio(
                  playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam]
                    .winsByTrophies,
                  playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam]
                    .lossesByTrophies
                );
              } else {
                playerStats.mode[mode].map[mapName].brawler[
                  brawlerName
                ].team[brawlerTeam].winRatio = 0;
              }
            } else
              playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam] = {
                wins: 0,
                losses: 1,
                winRatio: 0,
                lossesByTrophies: brawlerTrophies,
                winsByTrophies: 0,
              };
          }
        }
        console.log(playerStats);
      }

      (battleLogAndPlayer.wins = wins),
        (battleLogAndPlayer.losses = losses),
        (battleLogAndPlayer.trophyLosses = trophyLosses),
        (battleLogAndPlayer.trophyWins = trophyWins),
        (battleLogAndPlayer.playerStats = playerStats),
        (battleLogAndPlayer.userId = userId),
        (battleLogAndPlayer.numberOfGames = numberOfGames);
      battleLogAndPlayer.lastMatch = lastMatch;
    },
    receivedPlayerStatsFromDB: (battleLogAndPlayer, action) => {
      let data = action.payload;
      battleLogAndPlayer.trophyWins = data.trophyWins;
      battleLogAndPlayer.trophyLosses = data.trophyLosses;
      battleLogAndPlayer.numberOfGames = data.numberOfGames;
      battleLogAndPlayer.playerStats = data.playerStats;
      battleLogAndPlayer.userId = data.playerId;

      console.log(data);
    },
    updatedPlayerStats: (battleLogAndPlayer, action) => {
      const data = action.payload;
      const { items, ...playerData } = data;
      battleLogAndPlayer.battleLog = items;
      battleLogAndPlayer.player = playerData;
      console.log(data);

      if (battleLogAndPlayer.battleLog[0]) {
        console.log("called 1");
        battleLogAndPlayer.lastMatch =
          battleLogAndPlayer.battleLog[0].battleTime;
        let playerId = "#" + battleLogAndPlayer.userId;
        let wins = 0;
        let losses = 0;
        let trophyLosses = battleLogAndPlayer.trophyLosses;
        let trophyWins = battleLogAndPlayer.trophyWins;
        let numberOfGames = battleLogAndPlayer.numberOfGames;

        let playerStats = battleLogAndPlayer.playerStats;

        for (const element of battleLogAndPlayer.battleLog) {
    
          if (element.battle.trophyChange) {
            numberOfGames++;
            let mapName = element.event.map;
            let mode = element.event.mode;
            console.log(mode);
            let findBrawler = (element) => {
              if (element.battle.teams) {
                for (const team of element.battle.teams)
                  for (const player of team)
                    if (player.tag == playerId)
                      return [player.brawler.name, player.brawler.trophies];
              } else {
                for (const player of element.battle.players)
                  if (player.tag == playerId)
                    return [player.brawler.name, player.brawler.trophies];
              }
            };
            let [brawlerName, brawlerTrophies] = findBrawler(element);
console.log(brawlerName)

            let findTeam = (element) => {
              let brawler = [];
              let trophies = 0;

              let brawlerTeam0 = [];
              let brawlerTeam1 = [];
              let trophiesTeam0 = 0;
              let trophiesTeam1 = 0;
              let inTeam0 = false;
              let inTeam1 = false;

              if (element.battle.teams) {
                for (const player of element.battle.teams[0]) {
                  if (player.tag == playerId) {
                    inTeam0 = true;
                  }
                  brawlerTeam0.push(player.brawler.name);
                  trophiesTeam0 += player.brawler.trophies;
                }
                for (const player of element.battle.teams[1]) {
                  if (player.tag == playerId) {
                    inTeam1 = true;
                  }
                  brawlerTeam1.push(player.brawler.name);
                  trophiesTeam1 += player.brawler.trophies;
                }
                if (inTeam0) {
                  return [brawlerTeam0, trophiesTeam0];
                } else {
                  return [brawlerTeam1, trophiesTeam1];
                }

              }
              };

            let brawlerTeam=null;
              let trophiesTeam=null;
              if(element.battle.teams){
                let [bTeam, tTeam] = findTeam(element);
                brawlerTeam=bTeam;
                trophiesTeam=tTeam;
                brawlerTeam.sort();
              }

            
            
          
            
      
            let calculateRatio = (wins, losses) => {
              return (wins / (wins + losses)) * 100;
            };

            let trophyChange= element.battle.trophyChange
           
            if (element.battle.trophyChange > 0) {
              trophyWins += element.battle.trophyChange;

           

              if (playerStats.mode[mode]) {
                mode==='soloShowdown'||'duoShowdown'?playerStats.mode[mode].wins += (trophyChange/8):
                playerStats.mode[mode].wins += 1;
                mode==='soloShowdown'||'duoShowdown'?playerStats.mode[mode].winsByTrophies += brawlerTrophies * playerStats.mode[mode].wins:
                playerStats.mode[mode].winsByTrophies += brawlerTrophies;
                if (playerStats.mode[mode].lossesByTrophies !== 0) {
                  playerStats.mode[mode].winRatio = calculateRatio(
                    playerStats.mode[mode].winsByTrophies,
                    playerStats.mode[mode].lossesByTrophies
                  );
                } else {
                  playerStats.mode[mode].winRatio = 100;
                }
              } else
                playerStats.mode[mode] = {
                  wins: 1,
                  losses: 0,
                  winRatio: 100,
                  lossesByTrophies: 0,
                  winsByTrophies: brawlerTrophies,
                  map: {},
                };
              if (playerStats.mode[mode].map[mapName]) {
                playerStats.mode[mode].map[mapName].wins += 1;
                playerStats.mode[mode].map[
                  mapName
                ].winsByTrophies += brawlerTrophies;

                if (
                  playerStats.mode[mode].map[mapName].lossesByTrophies !== 0
                ) {
                  playerStats.mode[mode].map[mapName].winRatio = calculateRatio(
                    playerStats.mode[mode].map[mapName].winsByTrophies,
                    playerStats.mode[mode].map[mapName].lossesByTrophies
                  );
                } else playerStats.mode[mode].map[mapName].winRatio = 100;
              } else {
                playerStats.mode[mode].map[mapName] = {
                  wins: 1,
                  losses: 0,
                  winRatio: 100,
                  lossesByTrophies: 0,
                  winsByTrophies: brawlerTrophies,
                  brawler: {},
                };
              }

              if (playerStats.mode[mode].map[mapName].brawler[brawlerName]) {
                playerStats.mode[mode].map[mapName].brawler[
                  brawlerName
                ].wins += 1;
                playerStats.mode[mode].map[mapName].brawler[
                  brawlerName
                ].winsByTrophies += parseInt(brawlerTrophies);
                if (
                  playerStats.mode[mode].map[mapName].brawler[brawlerName]
                    .lossesByTrophies !== 0
                ) {
                  playerStats.mode[mode].map[mapName].brawler[
                    brawlerName
                  ].winRatio = calculateRatio(
                    playerStats.mode[mode].map[mapName].brawler[brawlerName]
                      .winsByTrophies,
                    playerStats.mode[mode].map[mapName].brawler[brawlerName]
                      .lossesByTrophies
                  );
                } else {
                  playerStats.mode[mode].map[mapName].brawler[
                    brawlerName
                  ].winRatio = 100;
                }
              } else
                playerStats.mode[mode].map[mapName].brawler[brawlerName] = {
                  wins: 1,
                  losses: 0,
                  winRatio: 100,
                  lossesByTrophies: 0,
                  winsByTrophies: brawlerTrophies,
                  team:{}
                };

              if (playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam]) {
                playerStats.mode[mode].map[mapName].brawler[
                  brawlerName
                ].team[brawlerTeam].wins += 1;
                playerStats.mode[mode].map[mapName].brawler[
                  brawlerName
                ].team[brawlerTeam].winsByTrophies += parseInt(trophiesTeam);
                if (
                  playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam]
                    .lossesByTrophies !== 0
                ) {
                  playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam].winRatio = calculateRatio(
                    playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam]
                      .winsByTrophies,
                    playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam]
                      .lossesByTrophies
                  );
                } else {
                  playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam].winRatio = 100;
                }
              } else
                playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam] = {
                  wins: 1,
                  losses: 0,
                  winRatio: 100,
                  lossesByTrophies: 0,
                  winsByTrophies: brawlerTrophies,
                };
              //
            } else if (element.battle.trophyChange < 0) {
              trophyLosses += Math.abs(element.battle.trophyChange);

              if (playerStats.mode[mode]) {
                playerStats.mode[mode].losses += 1;
                playerStats.mode[mode].lossesByTrophies += brawlerTrophies;
                if (playerStats.mode[mode].winsByTrophies !== 0) {
                  playerStats.mode[mode].winRatio = calculateRatio(
                    playerStats.mode[mode].winsByTrophies,
                    playerStats.mode[mode].lossesByTrophies
                  );
                } else {
                  playerStats.mode[mode].winRatio = 0;
                }
              } else
                playerStats.mode[mode] = {
                  wins: 0,
                  losses: 1,
                  winRatio: 0,
                  lossesByTrophies: brawlerTrophies,
                  winsByTrophies: 0,
                  map: {},
                };

              if (playerStats.mode[mode].map[mapName]) {
                playerStats.mode[mode].map[mapName].losses += 1;
                playerStats.mode[mode].map[
                  mapName
                ].lossesByTrophies += brawlerTrophies;
                if (playerStats.mode[mode].map[mapName].winsByTrophies !== 0) {
                  playerStats.mode[mode].map[mapName].winRatio = calculateRatio(
                    playerStats.mode[mode].map[mapName].winsByTrophies,
                    playerStats.mode[mode].map[mapName].lossesByTrophies
                  );
                } else playerStats.mode[mode].map[mapName].winRatio = 0;
              } else
                playerStats.mode[mode].map[mapName] = {
                  wins: 0,
                  losses: 1,
                  winRatio: 0,
                  lossesByTrophies: brawlerTrophies,
                  winsByTrophies: 0,
                  brawler: {},
                };

              if (playerStats.mode[mode].map[mapName].brawler[brawlerName]) {
                playerStats.mode[mode].map[mapName].brawler[
                  brawlerName
                ].losses += 1;
                playerStats.mode[mode].map[mapName].brawler[
                  brawlerName
                ].lossesByTrophies += parseInt(brawlerTrophies);
                if (
                  playerStats.mode[mode].map[mapName].brawler[brawlerName]
                    .winsByTrophies !== 0
                ) {
                  playerStats.mode[mode].map[mapName].brawler[
                    brawlerName
                  ].winRatio = calculateRatio(
                    playerStats.mode[mode].map[mapName].brawler[brawlerName]
                      .winsByTrophies,
                    playerStats.mode[mode].map[mapName].brawler[brawlerName]
                      .lossesByTrophies
                  );
                } else {
                  playerStats.mode[mode].map[mapName].brawler[
                    brawlerName
                  ].winRatio = 0;
                }
              } else
                playerStats.mode[mode].map[mapName].brawler[brawlerName] = {
                  wins: 0,
                  losses: 1,
                  winRatio: 0,
                  lossesByTrophies: brawlerTrophies,
                  winsByTrophies: 0,
                  team:{}
                };

              if (playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam]) {
                playerStats.mode[mode].map[mapName].brawler[
                  brawlerName
                ].team[brawlerTeam].losses += 1;
                playerStats.mode[mode].map[mapName].brawler[
                  brawlerName
                ].team[brawlerTeam].lossesByTrophies += parseInt(trophiesTeam);
                if (
                  playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam]
                    .winsByTrophies !== 0
                ) {
                  playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam].winRatio = calculateRatio(
                    playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam]
                      .winsByTrophies,
                    playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam]
                      .lossesByTrophies
                  );
                } else {
                  playerStats.mode[mode].map[mapName].brawler[
                    brawlerTeam
                  ].winRatio = 0;
                }
              } else
                playerStats.mode[mode].map[mapName].brawler[brawlerName].team[brawlerTeam] = {
                  wins: 0,
                  losses: 1,
                  winRatio: 0,
                  lossesByTrophies: brawlerTrophies,
                  winsByTrophies: 0,
                  
                };
            }
          }
        }
        (battleLogAndPlayer.wins = wins),
          (battleLogAndPlayer.losses = losses),
          (battleLogAndPlayer.trophyLosses = trophyLosses),
          (battleLogAndPlayer.trophyWins = trophyWins),
          (battleLogAndPlayer.playerStats = playerStats),
          (battleLogAndPlayer.numberOfGames = numberOfGames);
      }
    },
  },
});
export const {
  battleLogAndPlayerReceived,
  processedPlayerStats,
  updatedPlayerStats,
  receivedPlayerStatsFromDB,
} = slice.actions;
export default slice.reducer;
