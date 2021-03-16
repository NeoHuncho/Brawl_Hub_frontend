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
    name: null,
    time: null,
    season: null,
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
      battleLogAndPlayer.name = data.name;
      battleLogAndPlayer.season = data.season;
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
      let playerStats = {};
      let season = null;

      let inSeason5 = moment().isBefore("2021-04-12");
      // console.log(inSeason5);
      if (inSeason5 === true) {
        battleLogAndPlayer.season = 5;
      } else {
        battleLogAndPlayer.season = 6;
      }

      if (typeof action.payload === "string") {
        //  console.log("string");
        userId = action.payload;
        playerId = "#" + userId;
        lastMatch = battleLogAndPlayer.battleLog[0].battleTime;
        wins = 0;
        losses = 0;
        trophyLosses = 0;
        trophyWins = 0;
        numberOfGames = 0;
        playerStats = { season: {} };
      } else {
        const data = action.payload;
        const { items, ...playerData } = data;
        battleLogAndPlayer.battleLog = items;
        battleLogAndPlayer.player = playerData;
        //console.log(data);
        if (battleLogAndPlayer.battleLog[0]) {
          // console.log(battleLogAndPlayer.battleLog[0]);
          // console.log(battleLogAndPlayer.battleLog[0].battleTime);
          // console.log("called 1");
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
          const verifyIfPowerPlay = () => {
            let result = false;
            if (element.battle.teams) {
              for (const team of element.battle.teams)
                for (const player of team)
                  if (player.brawler.trophies <= 23) result = true;

              return result;
            }
          };
          let isPowerPlay = verifyIfPowerPlay();

          try {
            //  console.log("CALLLLDED");
            if (element.battle.trophyChange || isPowerPlay === true) {
              numberOfGames += 1;
              let gameType = undefined;
              element.battle.type
                ? (gameType = element.battle.type)
                : (gameType = "Power League");
              console.log(gameType);
              let mapName = element.event.map;
              let mode = element.event.mode;
              let eventID = element.event.id;
              let duration = element.battle.duration;
              let season = battleLogAndPlayer.season;
              if (duration === NaN || duration === undefined) {
                duration = 0;
              }
              let isStarPlayer = 0;

              if (element.battle.trophyChange) {
                let checkStarPlayer = () => {
                  if (element.battle.starPlayer) {
                    if (element.battle.starPlayer.tag === playerId) {
                      isStarPlayer = 1;
                    }
                  }
                };
                checkStarPlayer();
              }

              let findBrawler = (element) => {
                if (element.battle.teams) {
                  for (const team of element.battle.teams)
                    for (const player of team)
                      if (player.tag == playerId)
                        return [
                          player.brawler.name,
                          player.brawler.trophies,
                          player.brawler.id,
                        ];
                } else {
                  for (const player of element.battle.players)
                    if (player.tag == playerId)
                      return [
                        player.brawler.name,
                        player.brawler.trophies,
                        player.brawler.id,
                      ];
                }
              };
              let [
                brawlerName,
                brawlerTrophiesOrPPTrophies,
                brawlerID,
              ] = findBrawler(element);

              let findTeam = (element) => {
                let brawler = [];
                let trophies = 0;

                let brawlerTeam0 = [];
                let brawlerTeam1 = [];
                let trophiesTeam0 = 0;
                let trophiesTeam1 = 0;
                let brawlerIDTeam0 = [];
                let brawlerIDTeam1 = [];
                let inTeam0 = false;
                let inTeam1 = false;

                if (element.battle.teams) {
                  for (const player of element.battle.teams[0]) {
                    if (player.tag == playerId) {
                      inTeam0 = true;
                    }
                    brawlerTeam0.push(player.brawler.name);
                    brawlerIDTeam0.push(player.brawler.id);
                    trophiesTeam0 += player.brawler.trophies;
                  }
                  for (const player of element.battle.teams[1]) {
                    if (player.tag == playerId) {
                      inTeam1 = true;
                    }
                    brawlerTeam1.push(player.brawler.name);
                    brawlerIDTeam1.push(player.brawler.id);
                    trophiesTeam1 += player.brawler.trophies;
                  }
                  if (inTeam0) {
                    return [
                      brawlerTeam0,
                      trophiesTeam0,
                      brawlerIDTeam0,
                      trophiesTeam1,
                    ];
                  } else {
                    return [
                      brawlerTeam1,
                      trophiesTeam1,
                      brawlerIDTeam1,
                      trophiesTeam0,
                    ];
                  }
                }
              };

              let brawlersTeam = null;
              let brawlersIDTeam = null;
              let trophiesTeam = null;
              let opposingTeamTrophies = null;

              if (element.battle.teams) {
                let [bTeam, tTeam, idTeam, otTeam] = findTeam(element);
                brawlersTeam = bTeam;
                brawlersIDTeam = idTeam;
                trophiesTeam = tTeam;
                opposingTeamTrophies = otTeam;
                brawlersTeam.sort();
              }
              //   console.log(brawlersIDTeam);
              let calculateRatio = (wins, losses) => {
                return wins / losses;
              };
              if (element.battle.trophyChange || isPowerPlay === true) {
                let winTrophies = undefined;
                let lossTrophies = undefined;

                if (playerStats.season[season]) {
                  null;
                } else {
                  playerStats.season[season] = { type: {} };
                }

                if (playerStats.season[season].type[gameType]) {
                  null;
                } else {
                  playerStats.season[season].type[gameType] = { mode: {} };
                }

                //
                if (element.battle.trophyChange > 0) {
                  winTrophies = element.battle.trophyChange;
                  trophyWins += element.battle.trophyChange;
                } else if (element.battle.trophyChange < 0) {
                  lossTrophies = Math.abs(element.battle.trophyChange);
                  trophyLosses += lossTrophies;
                }

                console.log(season, gameType);

                console.log(playerStats);
                if (playerStats.season[season].type[gameType].mode[mode]) {
                  mode !== "soloShowdown" && mode !== "duoShowdown"
                    ? (playerStats.season[season].type[gameType].mode[
                        mode
                      ].games += 1)
                    : null;
                  playerStats.season[season].type[gameType].mode[
                    mode
                  ].duration += duration;
                  playerStats.season[season].type[gameType].mode[
                    mode
                  ].avgDuration =
                    playerStats.season[season].type[gameType].mode[mode]
                      .duration /
                    playerStats.season[season].type[gameType].mode[mode].games;

                  if (
                    winTrophies ||
                    (isPowerPlay === true &&
                      element.battle.result === "victory")
                  ) {
                    playerStats.season[season].type[gameType].mode[
                      mode
                    ].wins += 1;
                    playerStats.season[season].type[gameType].mode[
                      mode
                    ].winsByTrophies += isPowerPlay
                      ? brawlerTrophiesOrPPTrophies * opposingTeamTrophies
                      : winTrophies * opposingTeamTrophies;
                  } else {
                    playerStats.season[season].type[gameType].mode[
                      mode
                    ].losses += 1;
                    playerStats.season[season].type[gameType].mode[
                      mode
                    ].lossesByTrophies += isPowerPlay
                      ? brawlerTrophiesOrPPTrophies * opposingTeamTrophies
                      : lossTrophies * opposingTeamTrophies;
                  }
                  if (
                    playerStats.season[season].type[gameType].mode[mode]
                      .lossesByTrophies !== 0 &&
                    playerStats.season[season].type[gameType].mode[mode]
                      .winsByTrophies !== 0
                  ) {
                    isStarPlayer !== 0 && !isPowerPlay
                      ? (playerStats.season[season].type[gameType].mode[
                          mode
                        ].starPlayer += 1)
                      : null;
                    playerStats.season[season].type[gameType].mode[
                      mode
                    ].winRatio = calculateRatio(
                      playerStats.season[season].type[gameType].mode[mode]
                        .winsByTrophies,
                      playerStats.season[season].type[gameType].mode[mode]
                        .lossesByTrophies
                    );
                  } else {
                    if (
                      winTrophies ||
                      (isPowerPlay === true &&
                        element.battle.result === "victory")
                    ) {
                      if (!isPowerPlay)
                        playerStats.season[season].type[gameType].mode[
                          mode
                        ].winRatio =
                          playerStats.season[season].type[gameType].mode[
                            mode
                          ].wins;
                      if (isPowerPlay)
                        playerStats.season[season].type[gameType].mode[
                          mode
                        ].winRatio =
                          playerStats.season[season].type[gameType].mode[mode]
                            .wins * brawlerTrophiesOrPPTrophies;
                      isStarPlayer !== 0 && !isPowerPlay
                        ? (playerStats.season[season].type[gameType].mode[
                            mode
                          ].starPlayer += 1)
                        : null;
                    } else {
                      playerStats.season[season].type[gameType].mode[
                        mode
                      ].winRatio -= 1;
                    }
                  }
                } else if (
                  winTrophies ||
                  (isPowerPlay === true && element.battle.result === "victory")
                ) {
                  playerStats.season[season].type[gameType].mode[mode] = {
                    games: 1,
                    avgDuration: duration,
                    duration: duration,
                    wins: 1,
                    losses: 0,
                    winRatio: 1,
                    lossesByTrophies: 0,
                    winsByTrophies: isPowerPlay
                      ? brawlerTrophiesOrPPTrophies * opposingTeamTrophies
                      : winTrophies * opposingTeamTrophies,
                    map: {},
                    starPlayer: 0,
                  };
                  isStarPlayer || !isPowerPlay
                    ? (playerStats.season[season].type[gameType].mode[
                        mode
                      ].starPlayer = 1)
                    : null;
                } else {
                  playerStats.season[season].type[gameType].mode[mode] = {
                    games: 1,
                    avgDuration: duration,
                    duration: duration,
                    wins: 0,
                    losses: 1,

                    winRatio: -1,
                    lossesByTrophies: isPowerPlay
                      ? brawlerTrophiesOrPPTrophies * opposingTeamTrophies
                      : lossTrophies * opposingTeamTrophies,
                    winsByTrophies: 0,
                    map: {},
                    starPlayer: 0,
                  };
                }

                if (
                  playerStats.season[season].type[gameType].mode[mode].map[
                    mapName
                  ]
                ) {
                  mode !== "soloShowdown" && mode !== "duoShowdown"
                    ? (playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].games += 1)
                    : null;
                  playerStats.season[season].type[gameType].mode[mode].map[
                    mapName
                  ].duration += duration;
                  playerStats.season[season].type[gameType].mode[mode].map[
                    mapName
                  ].avgDuration =
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].duration /
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].games;

                  if (
                    winTrophies ||
                    (isPowerPlay === true &&
                      element.battle.result === "victory")
                  ) {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].wins += 1;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].winsByTrophies += isPowerPlay
                      ? brawlerTrophiesOrPPTrophies * opposingTeamTrophies
                      : winTrophies * opposingTeamTrophies;
                  } else {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].losses += 1;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].lossesByTrophies += isPowerPlay
                      ? brawlerTrophiesOrPPTrophies * opposingTeamTrophies
                      : lossTrophies * opposingTeamTrophies;
                  }
                  if (
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].lossesByTrophies !== 0 &&
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].winsByTrophies !== 0
                  ) {
                    isStarPlayer !== 0 && !isPowerPlay
                      ? (playerStats.season[season].type[gameType].mode[
                          mode
                        ].map[mapName].starPlayer += 1)
                      : null;

                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].winRatio = calculateRatio(
                      playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].winsByTrophies,
                      playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].lossesByTrophies
                    );
                  } else {
                    if (
                      winTrophies |
                      (isPowerPlay === true &&
                        element.battle.result === "victory")
                    ) {
                      playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].winRatio += 1;
                      isStarPlayer !== 0 && !isPowerPlay
                        ? (playerStats.season[season].type[gameType].mode[
                            mode
                          ].map[mapName].starPlayer += 1)
                        : null;
                    } else {
                      playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].winRatio -= 1;
                    }
                  }
                } else if (
                  winTrophies ||
                  (isPowerPlay === true && element.battle.result === "victory")
                ) {
                  playerStats.season[season].type[gameType].mode[mode].map[
                    mapName
                  ] = {
                    mapID: eventID,
                    games: 1,
                    avgDuration: duration,
                    duration: duration,
                    wins: 1,
                    losses: 0,
                    winRatio: 1,
                    lossesByTrophies: 0,
                    winsByTrophies: isPowerPlay
                      ? brawlerTrophiesOrPPTrophies * opposingTeamTrophies
                      : winTrophies * opposingTeamTrophies,
                    brawler: {},
                    starPlayer: 0,
                  };
                  isStarPlayer && !isPowerPlay
                    ? (playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].starPlayer += 1)
                    : null;
                } else
                  playerStats.season[season].type[gameType].mode[mode].map[
                    mapName
                  ] = {
                    mapID: eventID,
                    games: 1,
                    avgDuration: duration,
                    duration: duration,
                    wins: 0,
                    losses: 1,
                    winRatio: 0,
                    lossesByTrophies: isPowerPlay
                      ? brawlerTrophiesOrPPTrophies * opposingTeamTrophies
                      : lossTrophies * opposingTeamTrophies,
                    winsByTrophies: 0,
                    brawler: {},
                    starPlayer: 0,
                  };

                if (
                  playerStats.season[season].type[gameType].mode[mode].map[
                    mapName
                  ].brawler[brawlerName]
                ) {
                  mode !== "soloShowdown" && mode !== "duoShowdown"
                    ? (playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].brawler[brawlerName].games += 1)
                    : null;
                  playerStats.season[season].type[gameType].mode[mode].map[
                    mapName
                  ].brawler[brawlerName].duration += duration;
                  playerStats.season[season].type[gameType].mode[mode].map[
                    mapName
                  ].brawler[brawlerName].avgDuration =
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].duration /
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].games;

                  if (
                    winTrophies ||
                    (isPowerPlay === true &&
                      element.battle.result === "victory")
                  ) {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].wins += 1;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].winsByTrophies += isPowerPlay
                      ? brawlerTrophiesOrPPTrophies * opposingTeamTrophies
                      : winTrophies * opposingTeamTrophies;
                  } else {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].losses += 1;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].lossesByTrophies += isPowerPlay
                      ? brawlerTrophiesOrPPTrophies * opposingTeamTrophies
                      : lossTrophies * opposingTeamTrophies;
                  }
                  if (
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].lossesByTrophies !== 0 &&
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].winsByTrophies !== 0
                  ) {
                    isStarPlayer !== 0 && !isPowerPlay
                      ? (playerStats.season[season].type[gameType].mode[
                          mode
                        ].map[mapName].brawler[brawlerName].starPlayer += 1)
                      : null;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].winRatio = calculateRatio(
                      playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].brawler[brawlerName].winsByTrophies,
                      playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].brawler[brawlerName].lossesByTrophies
                    );
                  } else {
                    if (
                      winTrophies ||
                      (isPowerPlay === true &&
                        element.battle.result === "victory")
                    ) {
                      isStarPlayer !== 0 && !isPowerPlay
                        ? (playerStats.season[season].type[gameType].mode[
                            mode
                          ].map[mapName].brawler[brawlerName].starPlayer += 1)
                        : null;

                      playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].brawler[brawlerName].winRatio =
                        playerStats.season[season].type[gameType].mode[
                          mode
                        ].map[mapName].brawler[brawlerName].wins;
                    } else
                      playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].brawler[brawlerName].winRatio -= 1;
                  }
                } else if (
                  winTrophies ||
                  (isPowerPlay === true && element.battle.result === "victory")
                ) {
                  playerStats.season[season].type[gameType].mode[mode].map[
                    mapName
                  ].brawler[brawlerName] = {
                    brawlerID: brawlerID,
                    games: 1,
                    avgDuration: duration,
                    duration: duration,
                    wins: 1,
                    losses: 0,
                    winRatio: 1,
                    lossesByTrophies: 0,
                    winsByTrophies: isPowerPlay
                      ? brawlerTrophiesOrPPTrophies * opposingTeamTrophies
                      : winTrophies * opposingTeamTrophies,
                    starPlayer: 0,
                    team: {},
                  };
                  isStarPlayer
                    ? (playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].brawler[brawlerName].starPlayer = 1)
                    : null;
                } else
                  playerStats.season[season].type[gameType].mode[mode].map[
                    mapName
                  ].brawler[brawlerName] = {
                    brawlerID: brawlerID,
                    games: 1,
                    avgDuration: duration,
                    duration: duration,
                    wins: 0,
                    losses: 1,
                    winRatio: -1,
                    lossesByTrophies: isPowerPlay
                      ? brawlerTrophiesOrPPTrophies * opposingTeamTrophies
                      : lossTrophies * opposingTeamTrophies,
                    winsByTrophies: 0,
                    starPlayer: 0,
                    team: {},
                  };

                if (
                  playerStats.season[season].type[gameType].mode[mode].map[
                    mapName
                  ].brawler[brawlerName].team[brawlersTeam]
                ) {
                  if (duration !== 0) {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].team[brawlersTeam].games += 1;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].team[
                      brawlersTeam
                    ].duration += duration;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].team[brawlersTeam].avgDuration =
                      playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].brawler[brawlerName].team[brawlersTeam].duration /
                      playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].brawler[brawlerName].team[brawlersTeam].games;
                  }

                  if (
                    winTrophies ||
                    (isPowerPlay === true &&
                      element.battle.result === "victory")
                  ) {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].team[brawlersTeam].wins += 1;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].team[
                      brawlersTeam
                    ].winsByTrophies += isPowerPlay
                      ? brawlerTrophiesOrPPTrophies * opposingTeamTrophies
                      : winTrophies * opposingTeamTrophies;
                  } else {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].team[brawlersTeam].losses += 1;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].team[
                      brawlersTeam
                    ].lossesByTrophies += isPowerPlay
                      ? brawlerTrophiesOrPPTrophies * opposingTeamTrophies
                      : lossTrophies * opposingTeamTrophies;
                  }
                  if (
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].team[brawlersTeam]
                      .lossesByTrophies !== 0 &&
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].team[brawlersTeam].winsByTrophies !==
                      0
                  ) {
                    isStarPlayer !== 0 && !isPowerPlay
                      ? (playerStats.season[season].type[gameType].mode[
                          mode
                        ].map[mapName].brawler[brawlerName].team[
                          brawlersTeam
                        ].starPlayer += 1)
                      : null;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      mapName
                    ].brawler[brawlerName].team[
                      brawlersTeam
                    ].winRatio = calculateRatio(
                      playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].brawler[brawlerName].team[brawlersTeam].winsByTrophies,
                      playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].brawler[brawlerName].team[brawlersTeam].lossesByTrophies
                    );
                  } else {
                    if (
                      winTrophies ||
                      (isPowerPlay === true &&
                        element.battle.result === "victory")
                    ) {
                      isStarPlayer !== 0 && !isPowerPlay
                        ? (playerStats.season[season].type[gameType].mode[
                            mode
                          ].map[mapName].brawler[brawlerName].team[
                            brawlersTeam
                          ].starPlayer += 1)
                        : null;
                      playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].brawler[brawlerName].team[brawlersTeam].winRatio =
                        playerStats.season[season].type[gameType].mode[
                          mode
                        ].map[mapName].brawler[brawlerName].team[
                          brawlersTeam
                        ].wins;
                    } else
                      playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].brawler[brawlerName].team[brawlersTeam].winRatio = 0;
                  }
                } else if (
                  (mode !== "soloShowdown" &&
                    mode !== "duoShowdown" &&
                    winTrophies) ||
                  (isPowerPlay === true && element.battle.result === "victory")
                ) {
                  playerStats.season[season].type[gameType].mode[mode].map[
                    mapName
                  ].brawler[brawlerName].team[brawlersTeam] = {
                    games: 1,
                    avgDuration: duration,
                    duration: duration,
                    wins: 1,
                    losses: 0,
                    winRatio: 1,
                    lossesByTrophies: 0,
                    winsByTrophies: isPowerPlay
                      ? brawlerTrophiesOrPPTrophies * opposingTeamTrophies
                      : winTrophies * opposingTeamTrophies,
                    starPlayer: 0,
                    id1: brawlersIDTeam[0],
                    id2: brawlersIDTeam[1],
                    id3: brawlersIDTeam[2],
                  };

                  isStarPlayer
                    ? (playerStats.season[season].type[gameType].mode[mode].map[
                        mapName
                      ].brawler[brawlerName].team[brawlersTeam].starPlayer = 1)
                    : null;
                } else if (
                  mode !== "soloShowdown" &&
                  mode !== "duoShowdown" &&
                  lossTrophies ||
                  (isPowerPlay === true &&
                    element.battle.result === "defeat")
                ) {
                  playerStats.season[season].type[gameType].mode[mode].map[
                    mapName
                  ].brawler[brawlerName].team[brawlersTeam] = {
                    games: 1,
                    avgDuration: duration,
                    duration: duration,
                    wins: 0,
                    losses: 1,
                    winRatio: 0,
                    lossesByTrophies: isPowerPlay
                      ? brawlerTrophiesOrPPTrophies * opposingTeamTrophies
                      : lossTrophies * opposingTeamTrophies,
                    winsByTrophies: 0,
                    starPlayer: 0,
                    id1: brawlersIDTeam[0],
                    id2: brawlersIDTeam[1],
                    id3: brawlersIDTeam[2],
                  };
                }
                //
              }
            }
          } catch (error) {
            console.log(error);
          }
        }

        (battleLogAndPlayer.wins = wins),
          (battleLogAndPlayer.losses = losses),
          (battleLogAndPlayer.trophyLosses = trophyLosses),
          (battleLogAndPlayer.trophyWins = trophyWins),
          (battleLogAndPlayer.playerStats = playerStats),
          (battleLogAndPlayer.userId = userId),
          (battleLogAndPlayer.numberOfGames = numberOfGames);
        battleLogAndPlayer.lastMatch = lastMatch;
        //  console.log(battleLogAndPlayer.playerStats)
      }
    },
    compiledPlayerStats: (battleLogAndPlayer, action) => {
      if (battleLogAndPlayer.playerStats.season) {
        battleLogAndPlayer.time = moment().add(5, "minutes").format();

        let season = battleLogAndPlayer.season;
        let playerStats = battleLogAndPlayer.playerStats;

        let gameTypeKeys = Object.keys(playerStats.season[season].type);

        gameTypeKeys.map((gameType) => {
          let mKeys = [];
          let bKeys = [];
          let tKeys = [];
          battleLogAndPlayer.playerStats.season[season].type[
            gameType
          ].compiled = {};
          battleLogAndPlayer.playerStats.season[season].type[
            gameType
          ].keys = {};

          let modeKeys = Object.keys(
            playerStats.season[season].type[gameType].mode
          );
          battleLogAndPlayer.playerStats.season[season].type[
            gameType
          ].keys.modes = modeKeys;

          battleLogAndPlayer.playerStats.season[season].type[
            gameType
          ].compiled.maps = modeKeys
            .map(
              (mode) => playerStats.season[season].type[gameType].mode[mode].map
            )
            .reduce((r, c) => Object.assign(r, c), {});

          modeKeys.map((mode) =>
            mKeys.push(
              Object.keys(
                playerStats.season[season].type[gameType].mode[mode].map
              )
            )
          );

          let mapKeys = mKeys.flat();
          battleLogAndPlayer.playerStats.season[season].type[
            gameType
          ].keys.maps = mapKeys;

          modeKeys.map((mode) =>
            mapKeys.map((map) => {
              if (
                playerStats.season[season].type[gameType].mode[mode].map[map]
              ) {
                bKeys.push(
                  Object.keys(
                    playerStats.season[season].type[gameType].mode[mode].map[
                      map
                    ].brawler
                  )
                );
              }
            })
          );

          let brawlerKeys = bKeys
            .flat()
            .filter((v, i, a) => a.indexOf(v) === i);
          battleLogAndPlayer.playerStats.season[season].type[
            gameType
          ].keys.brawlers = brawlerKeys;
          modeKeys.map((mode) =>
            mapKeys.map((map) => {
              brawlerKeys.map((brawler) => {
                if (
                  playerStats.season[season].type[gameType].mode[mode].map[map]
                ) {
                  if (
                    playerStats.season[season].type[gameType].mode[mode].map[
                      map
                    ].brawler[brawler]
                  )
                    tKeys.push(
                      Object.keys(
                        playerStats.season[season].type[gameType].mode[mode]
                          .map[map].brawler[brawler].team
                      )
                    );
                }
              });
            })
          );
          let teamKeys = tKeys.flat().filter((v, i, a) => a.indexOf(v) === i);

          battleLogAndPlayer.playerStats.season[season].type[
            gameType
          ].keys.teams = teamKeys;

          //
          let reducerBrawler = (stored, next) => {
            let result = {};
            brawlerKeys.map((brawler) => {
              if (
                stored === undefined ||
                (stored === {} && next !== undefined)
              ) {
                // console.log("called 1");
                return next;
              } else if (stored !== undefined && next === undefined) {
                // console.log("called 2");
                result = stored;
              }

              if (stored && next) {
                //  console.log("called 3");
                if (stored[brawler] && next[brawler]) {
                  //  console.log("called 4");
                  result[brawler] = {
                    games: stored[brawler].games + next[brawler].games,
                    wins: stored[brawler].wins + next[brawler].wins,
                    losses: stored[brawler].losses + next[brawler].losses,
                    lossesByTrophies:
                      stored[brawler].lossesByTrophies +
                      next[brawler].lossesByTrophies,
                    winsByTrophies:
                      stored[brawler].winsByTrophies +
                      next[brawler].winsByTrophies,
                    avgDuration:
                      (stored[brawler].avgDuration +
                        next[brawler].avgDuration) /
                      2,
                    duration: stored[brawler].duration + next[brawler].duration,
                    brawlerID: stored[brawler].brawlerID,
                    starPlayer:
                      stored[brawler].starPlayer + next[brawler].starPlayer,
                  };
                  if (result[brawler].lossesByTrophies !== 0) {
                    result[brawler].winRatio =
                      (stored[brawler].winsByTrophies +
                        next[brawler].winsByTrophies) /
                      (stored[brawler].lossesByTrophies +
                        next[brawler].lossesByTrophies);
                  } else {
                    result[brawler].winRatio = stored[brawler].wins;
                  }
                } else if (next[brawler]) {
                  // console.log("called 5");
                  result[brawler] = {
                    games: next[brawler].games,
                    wins: next[brawler].wins,
                    losses: next[brawler].losses,
                    lossesByTrophies: next[brawler].lossesByTrophies,
                    winsByTrophies: next[brawler].winsByTrophies,
                    winRatio: next[brawler].winRatio,
                    duration: next[brawler].duration,
                    avgDuration: next[brawler].avgDuration,
                    brawlerID: next[brawler].brawlerID,
                    starPlayer: next[brawler].starPlayer,
                  };
                } else if (stored[brawler]) {
                  //  console.log("called 6");
                  result[brawler] = stored[brawler];
                }
              }
            });

            return result;
          };

          //
          let reducerTeams = (stored, next) => {
            //console.log(next);
            //console.log(stored);
            let result = {};
            teamKeys.map((team) => {
              if (
                stored === undefined ||
                (stored === {} && next !== undefined)
              ) {
                // console.log("called 1");
                return next;
              } else if (stored !== undefined && next === undefined) {
                //console.log("called 2");
                result = stored;
              }

              if (stored && next) {
                // console.log("called 3");
                if (stored[team] && next[team]) {
                  // console.log("called 4");
                  result[team] = {
                    games: stored[team].games + next[team].games,
                    wins: stored[team].wins + next[team].wins,
                    losses: stored[team].losses + next[team].losses,
                    lossesByTrophies:
                      stored[team].lossesByTrophies +
                      next[team].lossesByTrophies,
                    winsByTrophies:
                      stored[team].winsByTrophies + next[team.winsByTrophies],
                    winRatio: stored[team].winRatio + next[team].winRatio,
                    avgDuration:
                      (stored[team].avgDuration + next[team].avgDuration) / 2,
                    duration: stored[team].duration + next[team].duration,
                    id1: stored[team].id1,
                    id2: stored[team].id2,
                    id3: stored[team].id3,
                    starPlayer: stored[team].starPlayer + next[team].starPlayer,
                  };
                } else if (next[team]) {
                  //  console.log("called 5");
                  result[team] = {
                    games: next[team].games,
                    wins: next[team].wins,
                    losses: next[team].losses,
                    lossesByTrophies: next[team].lossesByTrophies,
                    winsByTrophies: next[team].winsByTrophies,
                    winRatio: next[team].winRatio,
                    id1: next[team].id1,
                    id2: next[team].id2,
                    id3: next[team].id3,
                    duration: next[team].duration,
                    avgDuration: next[team].avgDuration,
                    starPlayer: next[team].starPlayer,
                  };
                } else if (stored[team]) {
                  //console.log("called 6");
                  result[team] = stored[team];
                }
              }
            });
            return result;
          };

          battleLogAndPlayer.playerStats.season[season].type[
            gameType
          ].compiled.brawlers = modeKeys
            .map((mode) =>
              mapKeys.map((map) => {
                if (
                  playerStats.season[season].type[gameType].mode[mode].map[map]
                ) {
                  return playerStats.season[season].type[gameType].mode[mode]
                    .map[map].brawler;
                }
              })
            )
            .flat()
            .reduce(reducerBrawler);

          let savedTeams = [];

          let saveTeams = (x) => {
            savedTeams.push(x);
          };

          let TeamsFinder = modeKeys
            .map((mode) =>
              mapKeys.map((map) =>
                brawlerKeys.map((brawler) => {
                  if (
                    playerStats.season[season].type[gameType].mode[mode].map[
                      map
                    ]
                  ) {
                    if (
                      playerStats.season[season].type[gameType].mode[mode].map[
                        map
                      ].brawler[brawler]
                    ) {
                      return playerStats.season[season].type[gameType].mode[
                        mode
                      ].map[map].brawler[brawler].team;
                    }
                  }
                })
              )
            )
            .flat(1)
            .map((team) => team.filter((x) => x !== undefined))
            .filter((el) => (el.length <= 0 ? null : el))
            .map((team) => team.map((x) => saveTeams(x)));
          battleLogAndPlayer.playerStats.season[season].type[
            gameType
          ].compiled.teams = savedTeams.reduce(reducerTeams);
        });
      }
    },
  },
});
export const {
  battleLogAndPlayerReceived,
  processedPlayerStats,
  receivedPlayerStatsFromDB,
  compiledPlayerStats,
} = slice.actions;
export default slice.reducer;
