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
                  if (player.tag == playerId)
                    return [player.brawler.name, player.brawler.trophies];
            } else {
              for (const player of element.battle.players)
                if (player.tag == playerId)
                  return [player.brawler.name, player.brawler.trophies];
            }
          };
          let [brawlerName, brawlerTrophies] = findBrawler(element);

          let calculateRatio = (wins, losses) => {
            return (wins / (wins + losses)) * 100;
          };
          if (element.battle.trophyChange > 0) {
            trophyWins += element.battle.trophyChange;
            console.log(element.battle);
            console.log(brawlerTrophies);

            if (playerStats[mode]) {
              playerStats[mode].wins += 1;
              playerStats[mode].winsByTrophies += brawlerTrophies;
              if (playerStats[mode].lossesByTrophies !== 0) {
                playerStats[mode].winRatio = calculateRatio(
                  playerStats[mode].winsByTrophies,
                  playerStats[mode].lossesByTrophies
                );
              } else {
                playerStats[mode].winRatio = 100;
              }
            } else
              playerStats[mode] = {
                wins: 1,
                losses: 0,
                winRatio: 100,
                lossesByTrophies: 0,
                winsByTrophies: brawlerTrophies,
              };
            if (playerStats[mode][mapName]) {
              playerStats[mode][mapName].wins += 1;
              playerStats[mode][mapName].winsByTrophies += parseInt(
                brawlerTrophies
              );
              if (playerStats[mode][mapName].lossesByTrophies !== 0) {
                playerStats[mode][mapName].winRatio = calculateRatio(
                  playerStats[mode][mapName].winsByTrophies,
                  playerStats[mode][mapName].lossesByTrophies
                );
              } else playerStats[mode][mapName].winRatio = 100;
            } else {
              playerStats[mode][mapName] = {
                wins: 1,
                losses: 0,
                winRatio: 100,
                lossesByTrophies: 0,
                winsByTrophies: brawlerTrophies,
                winsByTrophies: 0,
              };
            }

            if (playerStats[mode][mapName][brawlerName]) {
              playerStats[mode][mapName][brawlerName].wins += 1;
              playerStats[mode][mapName][
                brawlerName
              ].winsByTrophies += parseInt(brawlerTrophies);
              if (
                playerStats[mode][mapName][brawlerName].lossesByTrophies !== 0
              ) {
                playerStats[mode][mapName][
                  brawlerName
                ].winRatio = calculateRatio(
                  playerStats[mode][mapName][brawlerName].winsByTrophies,
                  playerStats[mode][mapName][brawlerName].lossesByTrophies
                );
              } else {
                playerStats[mode][mapName][brawlerName].winRatio = 100;
              }
            } else
              playerStats[mode][mapName][brawlerName] = {
                wins: 1,
                losses: 0,
                winRatio: 100,
                lossesByTrophies: 0,
                winsByTrophies: brawlerTrophies,
              };
            //
          } else if (element.battle.trophyChange < 0) {
            trophyLosses += Math.abs(element.battle.trophyChange);
            losses = losses + 1;

            if (playerStats[mode]) {
              playerStats[mode].losses += 1;
              playerStats[mode].lossesByTrophies += brawlerTrophies;
              if (playerStats[mode].winsByTrophies !== 0) {
                playerStats[mode].winRatio = calculateRatio(
                  playerStats[mode].winsByTrophies,
                  playerStats[mode].lossesByTrophies
                );
              } else {
                playerStats[mode].winRatio = 0;
              }
            } else
              playerStats[mode] = {
                wins: 0,
                losses: 1,
                winRatio: 0,
                lossesByTrophies: brawlerTrophies,
                winsByTrophies: 0,
              };

            if (playerStats[mode][mapName]) {
              playerStats[mode][mapName].losses += 1;
              playerStats[mode][mapName].lossesByTrophies += brawlerTrophies;
              if (playerStats[mode][mapName].winsByTrophies !== 0) {
                playerStats[mode][mapName].winRatio = calculateRatio(
                  playerStats[mode][mapName].winsByTrophies,
                  playerStats[mode][mapName].lossesByTrophies
                );
              } else playerStats[mode][mapName].winRatio = 100;
            } else
              playerStats[mode][mapName] = {
                wins: 0,
                losses: 1,
                winRatio: 0,
                lossesByTrophies: brawlerTrophies,
                winsByTrophies: 0,
              };

            if (playerStats[mode][mapName][brawlerName]) {
              playerStats[mode][mapName][brawlerName].losses += 1;
              playerStats[mode][mapName][
                brawlerName
              ].lossesByTrophies += parseInt(brawlerTrophies);
              if (
                playerStats[mode][mapName][brawlerName].winsByTrophies !== 0
              ) {
                playerStats[mode][mapName][
                  brawlerName
                ].winRatio = calculateRatio(
                  playerStats[mode][mapName][brawlerName]
                    .winsBylossesByTrophies,
                  playerStats[mode][mapName][brawlerName].lossesByTrophies
                );
              } else {
                playerStats[mode][mapName][brawlerName].winRatio = 0;
              }
            } else
              playerStats[mode][mapName][brawlerName] = {
                wins: 0,
                losses: 1,
                winRatio: 0,
                lossesByTrophies: brawlerTrophies,
                winsByTrophies: 0,
              };
          }
        }
      }

      if (!playerStats.brawlBall) {
        playerStats.brawlBall = {
          wins: 0,
          losses: 0,
          winRatio: 0,
          winsByTrophies: 0,
          winsBylossesByTrophies: 0,
        };
      }
      if (!playerStats.bounty) {
        playerStats.bounty = {
          wins: 0,
          losses: 0,
          winRatio: 0,
          winsByTrophies: 0,
          winsBylossesByTrophies: 0,
        };
      }
      if (!playerStats.soloShowdown) {
        playerStats.soloShowdown = {
          wins: 0,
          losses: 0,
          winRatio: 0,
          winsByTrophies: 0,
          winsBylossesByTrophies: 0,
        };
      }
      if (!playerStats.duoShowdown) {
        playerStats.duoShowdown = {
          wins: 0,
          losses: 0,
          winRatio: 0,
          winsByTrophies: 0,
          winsBylossesByTrophies: 0,
        };
      }
      if (!playerStats.siege) {
        playerStats.siege = {
          wins: 0,
          losses: 0,
          winRatio: 0,
          winsByTrophies: 0,
          winsBylossesByTrophies: 0,
        };
      }
      if (!playerStats.heist) {
        playerStats.heist = {
          wins: 0,
          losses: 0,
          winRatio: 0,
          winsByTrophies: 0,
          winsBylossesByTrophies: 0,
        };
      }
      if (!playerStats.gemGrab) {
        playerStats.gemGrab = {
          wins: 0,
          losses: 0,
          winRatio: 0,
          winsByTrophies: 0,
          winsBylossesByTrophies: 0,
        };
      }
      if (!playerStats.hotZone) {
        playerStats.hotZone = {
          wins: 0,
          losses: 0,
          winRatio: 0,
          winsByTrophies: 0,
          winsBylossesByTrophies: 0,
        };
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

            let calculateRatio = (wins, losses) => {
              return (wins / (wins + losses)) * 100;
            };
            if (element.battle.trophyChange > 0) {
              trophyWins += element.battle.trophyChange;

              if (playerStats[mode]) {
                playerStats[mode].wins += 1;
                playerStats[mode].winsByTrophies += brawlerTrophies;
                if (playerStats[mode].lossesByTrophies !== 0)
                  playerStats[mode].winRatio = calculateRatio(
                    playerStats[mode].winsByTrophies,
                    playerStats[mode].lossesByTrophies
                  );
              } else
                playerStats[mode] = {
                  wins: 1,
                  losses: 0,
                  winRatio: 100,
                  lossesByTrophies: 0,
                  winsByTrophies: brawlerTrophies,
                };

              if (playerStats[mode][mapName]) {
                playerStats[mode][mapName].wins += 1;
                playerStats[mode][mapName].winsByTrophies += parseInt(
                  brawlerTrophies
                );
                if (playerStats[mode][mapName].lossesByTrophies !== 0)
                  playerStats[mode][mapName].winRatio = calculateRatio(
                    playerStats[mode][mapName].winsByTrophies,
                    playerStats[mode][mapName].lossesByTrophies
                  );
              } else
                playerStats[mode][mapName] = {
                  wins: 0,
                  losses: 1,
                  winRatio: 0,
                  lossesByTrophies: 0,
                  winsByTrophies: brawlerTrophies,
                };

              if (playerStats[mode][mapName][brawlerName]) {
                playerStats[mode][mapName][brawlerName].wins += 1;
                playerStats[mode][mapName][
                  brawlerName
                ].winsByTrophies += parseInt(brawlerTrophies);
                if (
                  playerStats[mode][mapName][brawlerName].lossesByTrophies !== 0
                )
                  playerStats[mode][mapName][
                    brawlerName
                  ].winRatio = calculateRatio(
                    playerStats[mode][mapName][brawlerName].winsByTrophies,
                    playerStats[mode][mapName][brawlerName].lossesByTrophies
                  );
              } else
                playerStats[mode][mapName][brawlerName] = {
                  wins: 0,
                  losses: 1,
                  winRatio: 0,
                  lossesByTrophies: 0,
                  winsByTrophies: brawlerTrophies,
                };
              //
            } else if (element.battle.trophyChange) {
              trophyLosses += Math.abs(element.battle.trophyChange);
              losses = losses + 1;

              if (playerStats[mode]) {
                playerStats[mode].losses += 1;
                playerStats[mode].lossesByTrophies += parseInt(brawlerTrophies);
                if (playerStats[mode].winsByTrophies !== 0)
                  playerStats[mode].winRatio = calculateRatio(
                    playerStats[mode].winsByTrophies,
                    playerStats[mode].lossesByTrophies
                  );
              } else
                playerStats[mode] = {
                  wins: 0,
                  losses: 1,
                  winRatio: 0,
                  lossesByTrophies: brawlerTrophies,
                  winsByTrophies: 0,
                };

              if (playerStats[mode][mapName]) {
                playerStats[mode][mapName].losses += 1;
                playerStats[mode][mapName].lossesByTrophies += parseInt(
                  brawlerTrophies
                );
                if (playerStats[mode][mapName].winsByTrophies !== 0)
                  playerStats[mode][mapName].winRatio = calculateRatio(
                    playerStats[mode][mapName].winsByTrophies,
                    playerStats[mode][mapName].lossesByTrophies
                  );
              } else
                playerStats[mode][mapName] = {
                  wins: 0,
                  losses: 1,
                  winRatio: 0,
                  lossesByTrophies: brawlerTrophies,
                  winsByTrophies: 0,
                };

              if (playerStats[mode][mapName][brawlerName]) {
                playerStats[mode][mapName][brawlerName].losses += 1;
                playerStats[mode][mapName][
                  brawlerName
                ].lossesByTrophies += parseInt(brawlerTrophies);
                if (
                  playerStats[mode][mapName][brawlerName]
                    .winsBylossesByTrophies !== 0
                )
                  playerStats[mode][mapName][
                    brawlerName
                  ].winRatio = calculateRatio(
                    playerStats[mode][mapName][brawlerName]
                      .winsBylossesByTrophies,
                    playerStats[mode][mapName][brawlerName].lossesByTrophies
                  );
              } else
                playerStats[mode][mapName][brawlerName] = {
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
