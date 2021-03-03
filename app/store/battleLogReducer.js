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
    receivedPlayerStatsFromDB: (battleLogAndPlayer, action) => {
      let data = action.payload;
      battleLogAndPlayer.trophyWins = data.trophyWins;
      battleLogAndPlayer.trophyLosses = data.trophyLosses;
      battleLogAndPlayer.numberOfGames = data.numberOfGames;
      battleLogAndPlayer.playerStats = data.playerStats;
      battleLogAndPlayer.userId = data.playerId;
    },
    processedPlayerStats: (battleLogAndPlayer, action) => {
      let userId = null;
      let playerId = null;
      let wins = 0;
      let losses = 0;
      let trophyLosses = 0;
      let trophyWins = 0;
      let numberOfGames = 0;
      let lastMatch = null;
      let playerStats = null;

      if (typeof action.payload === "string") {
        userId = action.payload;
        playerId = "#" + userId;
        lastMatch = battleLogAndPlayer.battleLog[0].battleTime;
        wins = 0;
        losses = 0;
        trophyLosses = 0;
        trophyWins = 0;
        numberOfGames = 0;
        playerStats = { mode: {} };
      } else {
        const data = action.payload;
        const { items, ...playerData } = data;
        battleLogAndPlayer.battleLog = items;
        battleLogAndPlayer.player = playerData;
        console.log(data);
        if (battleLogAndPlayer.battleLog[0]) {
          console.log(battleLogAndPlayer.battleLog[0]);
          console.log(battleLogAndPlayer.battleLog[0].battleTime);
          console.log("called 1");
          lastMatch = battleLogAndPlayer.battleLog[0].battleTime;
          userId = battleLogAndPlayer.userId;
          playerId = "#" + battleLogAndPlayer.userId;
          wins = 0;
          losses = 0;
          trophyLosses = battleLogAndPlayer.trophyLosses;
          trophyWins = battleLogAndPlayer.trophyWins;
          numberOfGames = battleLogAndPlayer.numberOfGames;
          playerStats = battleLogAndPlayer.playerStats;
        }
      }

      if (battleLogAndPlayer.battleLog[0]) {
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

            let brawlerTeam = null;
            let trophiesTeam = null;
            if (element.battle.teams) {
              let [bTeam, tTeam] = findTeam(element);
              brawlerTeam = bTeam;
              trophiesTeam = tTeam;
              brawlerTeam.sort();
            }
            let calculateRatio = (wins, losses) => {
              return (wins / (wins + losses)) * 100;
            };
            if (element.battle.trophyChange) {
              let winTrophies = undefined;
              let lossTrophies = undefined;
              if (element.battle.trophyChange > 0) {
                winTrophies = element.battle.trophyChange;
                trophyWins += element.battle.trophyChange;
              } else {
                lossTrophies = Math.abs(element.battle.trophyChange);
                trophyLosses += lossTrophies;
              }

              if (playerStats.mode[mode]) {
                if (winTrophies) {
                  playerStats.mode[mode].wins += 1;
                  playerStats.mode[mode].winsByTrophies += 2 * brawlerTrophies;
                } else {
                  playerStats.mode[mode].losses += 1;
                  playerStats.mode[mode].lossesByTrophies +=
                    2 * brawlerTrophies;
                }
                if (
                  playerStats.mode[mode].lossesByTrophies !== 0 &&
                  playerStats.mode[mode].winsByTrophies !== 0
                ) {
                  playerStats.mode[mode].winRatio = calculateRatio(
                    playerStats.mode[mode].winsByTrophies,
                    playerStats.mode[mode].lossesByTrophies
                  );
                } else {
                  winTrophies
                    ? (playerStats.mode[mode].winRatio = 100)
                    : (playerStats.mode[mode].winRatio = 0);
                }
              } else if (winTrophies) {
                playerStats.mode[mode] = {
                  wins: 1,
                  losses: 0,
                  winRatio: 100,
                  lossesByTrophies: 0,
                  winsByTrophies: 2 * brawlerTrophies,
                  map: {},
                };
              } else
                playerStats.mode[mode] = {
                  wins: 0,
                  losses: 1,
                  winRatio: 0,
                  lossesByTrophies: 2 * brawlerTrophies,
                  winsByTrophies: 0,
                  map: {},
                };

              if (playerStats.mode[mode].map[mapName]) {
                if (winTrophies) {
                  playerStats.mode[mode].map[mapName].wins += 1;
                  playerStats.mode[mode].map[mapName].winsByTrophies +=
                    2 * brawlerTrophies * winTrophies;
                } else {
                  playerStats.mode[mode].map[mapName].losses += 1;
                  playerStats.mode[mode].map[mapName].lossesByTrophies +=
                    2 * brawlerTrophies * lossTrophies;
                }
                if (
                  playerStats.mode[mode].map[mapName].lossesByTrophies !== 0 &&
                  playerStats.mode[mode].map[mapName].winsByTrophies !== 0
                ) {
                  playerStats.mode[mode].map[mapName].winRatio = calculateRatio(
                    playerStats.mode[mode].map[mapName].winsByTrophies,
                    playerStats.mode[mode].map[mapName].lossesByTrophies
                  );
                } else {
                  winTrophies
                    ? (playerStats.mode[mode].map[mapName].winRatio = 100)
                    : (playerStats.mode[mode].map[mapName].winRatio = 0);
                }
              } else if (winTrophies) {
                playerStats.mode[mode].map[mapName] = {
                  wins: 1,
                  losses: 0,
                  winRatio: 100,
                  lossesByTrophies: 0,
                  winsByTrophies: brawlerTrophies * 2 * trophyWins,
                  brawler: {},
                };
              } else
                playerStats.mode[mode].map[mapName] = {
                  wins: 0,
                  losses: 1,
                  winRatio: 0,
                  lossesByTrophies: 2 * brawlerTrophies * trophyLosses,
                  winsByTrophies: 0,
                  brawler: {},
                };

              if (playerStats.mode[mode].map[mapName].brawler[brawlerName]) {
                if (winTrophies) {
                  playerStats.mode[mode].map[mapName].brawler[
                    brawlerName
                  ].wins += 1;
                  playerStats.mode[mode].map[mapName].brawler[
                    brawlerName
                  ].winsByTrophies += 2 * brawlerTrophies * winTrophies;
                } else {
                  playerStats.mode[mode].map[mapName].brawler[
                    brawlerName
                  ].losses += 1;
                  playerStats.mode[mode].map[mapName].brawler[
                    brawlerName
                  ].lossesByTrophies += 2 * brawlerTrophies * lossTrophies;
                }
                if (
                  playerStats.mode[mode].map[mapName].brawler[brawlerName]
                    .lossesByTrophies !== 0 &&
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
                  winTrophies
                    ? (playerStats.mode[mode].map[mapName].brawler[
                        brawlerName
                      ].winRatio = 100)
                    : (playerStats.mode[mode].map[mapName].brawler[
                        brawlerName
                      ].winRatio = 0);
                }
              } else if (winTrophies) {
                playerStats.mode[mode].map[mapName].brawler[brawlerName] = {
                  wins: 1,
                  losses: 0,
                  winRatio: 100,
                  lossesByTrophies: 0,
                  winsByTrophies: 2 * brawlerTrophies * winTrophies,
                  team: {},
                };
              } else
                playerStats.mode[mode].map[mapName].brawler[brawlerName] = {
                  wins: 0,
                  losses: 1,
                  winRatio: 0,
                  lossesByTrophies: 2 * brawlerTrophies * lossTrophies,
                  winsByTrophies: 0,
                  team: {},
                };

              if (
                playerStats.mode[mode].map[mapName].brawler[brawlerName].team[
                  brawlerTeam
                ]
              ) {
                if (winTrophies) {
                  playerStats.mode[mode].map[mapName].brawler[brawlerName].team[
                    brawlerTeam
                  ].wins += 1;
                  playerStats.mode[mode].map[mapName].brawler[brawlerName].team[
                    brawlerTeam
                  ].winsByTrophies += 2 * trophiesTeam * winTrophies;
                } else {
                  playerStats.mode[mode].map[mapName].brawler[brawlerName].team[
                    brawlerTeam
                  ].losses += 1;
                  playerStats.mode[mode].map[mapName].brawler[brawlerName].team[
                    brawlerTeam
                  ].lossesByTrophies += 2 * trophiesTeam * lossTrophies;
                }
                if (
                  playerStats.mode[mode].map[mapName].brawler[brawlerName].team[
                    brawlerTeam
                  ].lossesByTrophies !== 0 &&
                  playerStats.mode[mode].map[mapName].brawler[brawlerName].team[
                    brawlerTeam
                  ].winsByTrophies !== 0
                ) {
                  playerStats.mode[mode].map[mapName].brawler[brawlerName].team[
                    brawlerTeam
                  ].winRatio = calculateRatio(
                    playerStats.mode[mode].map[mapName].brawler[brawlerName]
                      .team[brawlerTeam].winsByTrophies,
                    playerStats.mode[mode].map[mapName].brawler[brawlerName]
                      .team[brawlerTeam].lossesByTrophies
                  );
                } else {
                  winTrophies
                    ? (playerStats.mode[mode].map[mapName].brawler[
                        brawlerName
                      ].team[brawlerTeam].winRatio = 100)
                    : (playerStats.mode[mode].map[mapName].brawler[
                        brawlerName
                      ].team[brawlerTeam].winRatio = 0);
                }
              } else if (mode !== "soloShowdown" && winTrophies) {
                playerStats.mode[mode].map[mapName].brawler[brawlerName].team[
                  brawlerTeam
                ] = {
                  wins: 1,
                  losses: 0,
                  winRatio: 100,
                  lossesByTrophies: 0,
                  winsByTrophies: 2 * trophiesTeam * trophyWins,
                };
              } else if (mode !== "soloShowdown" && lossTrophies)
                playerStats.mode[mode].map[mapName].brawler[brawlerName].team[
                  brawlerTeam
                ] = {
                  wins: 0,
                  losses: 1,
                  winRatio: 0,
                  lossesByTrophies: 2 * trophiesTeam * trophyLosses,
                  winsByTrophies: 0,
                };

              //
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
      }
    },
  },
});
export const {
  battleLogAndPlayerReceived,
  processedPlayerStats,
  receivedPlayerStatsFromDB,
} = slice.actions;
export default slice.reducer;
