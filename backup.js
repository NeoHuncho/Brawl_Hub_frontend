let request = require("request");
let sizeof = require("object-sizeof");
let admin = require("firebase-admin");
let serviceAccount = require("./serviceKey.json");

let stats = {};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://brawl-hub-6a708-default-rtdb.firebaseio.com/",
});
let fireStore = admin.firestore();
let db = admin.database();

let processPlayerInfo = (playerID, playerInfoJSON, season) => {
  return new Promise(function (resolve, reject) {
    console.log(season, playerID);

    try {
      let playerInfo = JSON.parse(playerInfoJSON);
      let numberOfStarPowers = 0;
      let numberOfGadgets = 0;
      let averageTrophies = Math.round(
        playerInfo["trophies"] / playerInfo.brawlers.length
      );
      let totalVictories =
        playerInfo["soloVictories"] +
        playerInfo["duoVictories"] +
        playerInfo["3vs3Victories"];
      let avgSoloVictories = Math.round(
        (playerInfo["soloVictories"] / totalVictories) * 100,
        4
      );
      let avgDuoVictories = Math.round(
        (playerInfo["duoVictories"] / totalVictories) * 100,
        4
      );
      let avg3vs3Victories = Math.round(
        (playerInfo["3vs3Victories"] / totalVictories) * 100,
        4
      );

      playerInfo["brawlers"].forEach((brawler) => {
        brawler["starPowers"].forEach(() => {
          numberOfStarPowers++;
        });
        brawler["gadgets"].forEach(() => {
          numberOfGadgets++;
        });
      });

      stats.globalStats = {
        name: playerInfo.name,
        nameColor:
          playerInfo.nameColor == undefined ? "fff" : playerInfo.nameColor,
        icon: playerInfo.icon.id,
        numberOfBrawlers: playerInfo.brawlers.length,
        numberOfStarPowers: numberOfStarPowers,
        numberOfGadgets: numberOfGadgets,
        averageTrophies: averageTrophies,
        avg3vs3Victories: avg3vs3Victories,
        avgDuoVictories: avgDuoVictories,
        avgSoloVictories: avgSoloVictories,
        brawlers: playerInfo.brawlers,
      };
      resolve("all good");
    } catch (error) {
      console.log(error);
      reject("error in process player info");
      return;
    }
  });
};

let processPlayerBP = (playerID, playerBPJSON, season) => {
  return new Promise(function (resolve, reject) {
    try {
      let playerRef = fireStore
        .collection(`S${season}_${playerID}`)
        .doc("globalStats");
      let playerPLTrophySolo = 0;
      let playerPLTrophyTeam = 0;

      let playerBP = JSON.parse(playerBPJSON);
      //  console.log(playerBP);
      if (playerBP.items[0]) {
        let playerId = "#" + playerID;
        let trophyLosses = 0;
        let trophyWins = 0;
        let numberOfGames = 0;
        let lastMatch = playerBP.items[0].battleTime;
        let playerStats = { season: {} };

        for (const element of playerBP.items) {
          //  console.log("CALLLLDED");
          if (
            (element.battle.trophyChange && element.battle.type == "ranked") ||
            element.battle.type == "soloRanked" ||
            element.battle.type == "teamRanked"
          ) {
            numberOfGames += 1;
            let gameType = undefined;
            element.battle.type ? (gameType = element.battle.type) : null;
            // console.log(gameType);
            let mode = element.event.mode;
            if (mode == undefined) {
              mode = element.battle.mode;
            }
            let eventID = element.event.id;
            let duration = element.battle.duration;
            if (duration === NaN || duration === undefined) {
              duration = 0;
            }
            let isStarPlayer = 0;
            let isPowerPlay = false;
            if (
              element.battle.type == "soloRanked" ||
              element.battle.type == "teamRanked"
            ) {
              isPowerPlay = true;
            }

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
                    if (player.tag == playerId) {
                      gameType == "soloRanked"
                        ? (playerPLTrophySolo = player.brawler.trophies)
                        : gameType == "teamRanked"
                        ? (playerPLTrophyTeam = playerPLTrophyTeam)
                        : null;
                      return [
                        player.brawler.name,
                        player.brawler.trophies,
                        player.brawler.id,
                      ];
                    }
              } else {
                for (const player of element.battle.players)
                  if (player.tag == playerId) {
                    gameType == "soloRanked"
                      ? (playerPLTrophySolo = player.brawler.trophies)
                      : gameType == "teamRanked"
                      ? (playerPLTrophyTeam = player.brawler.trophies)
                      : null;
                    return [
                      player.brawler.name,
                      player.brawler.trophies,
                      player.brawler.id,
                    ];
                  }
              }
            };
            let [brawlerName, brawlerTrophiesOrPPTrophies, brawlerID] =
              findBrawler(element);

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
            let findBrlrOrTeamSD = (element) => {
              let playerBrawlerTrophies = 0;
              let teamMateTrophies = 0;
              let duoTeam = null;
              if (element.battle.players) {
                element.battle.players.forEach((player) => {
                  if (player.tag == playerId) {
                    playerBrawlerTrophies = player.brawler.trophies;
                  }
                });
              } else {
                element.battle.teams.forEach((team, indexTeam) => {
                  team.forEach((player, indexPlayer) => {
                    if (player.tag == playerId) {
                      playerBrawlerTrophies = player.brawler.trophies / 2;
                      indexPlayer == 0
                        ? (teamMateTrophies =
                            element.battle.teams[indexTeam][1].brawler
                              .trophies / 2)
                        : (teamMateTrophies =
                            element.battle.teams[indexTeam][0].brawler
                              .trophies / 2);
                      duoTeam = [
                        element.battle.teams[indexTeam][0].brawler.id,
                        element.battle.teams[indexTeam][1].brawler.id,
                      ];
                      duoTeam.sort();
                    }
                  });
                });
              }
              return [playerBrawlerTrophies, teamMateTrophies, duoTeam];
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
              brawlersIDTeam.sort();
              brawlersTeam.sort();
              //  console.log(brawlersTeam);
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

              // console.log(season, gameType);

              // console.log(playerStats);
              if (
                mode !== "soloShowdown" &&
                mode !== "duoShowdown" &&
                mode !== "loneStar" &&
                mode !== "takedown" &&
                brawlerTrophiesOrPPTrophies !== 0 &&
                opposingTeamTrophies !== 0 &&
                trophiesTeam !== 0
              ) {
                if (playerStats.season[season].type[gameType].mode[mode]) {
                  playerStats.season[season].type[gameType].mode[
                    mode
                  ].games += 1;

                  playerStats.season[season].type[gameType].mode[
                    mode
                  ].duration += duration;

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
                    ].winsByTrophies +=
                      (opposingTeamTrophies / trophiesTeam) *
                      brawlerTrophiesOrPPTrophies;
                  } else {
                    playerStats.season[season].type[gameType].mode[
                      mode
                    ].losses += 1;
                    playerStats.season[season].type[gameType].mode[
                      mode
                    ].lossesByTrophies +=
                      (trophiesTeam / opposingTeamTrophies) *
                      brawlerTrophiesOrPPTrophies;
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
                      playerStats.season[season].type[gameType].mode[
                        mode
                      ].winRatio =
                        playerStats.season[season].type[gameType].mode[
                          mode
                        ].wins;

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
                    duration: duration,
                    wins: 1,
                    losses: 0,
                    winRatio: 1,
                    lossesByTrophies: 0,
                    winsByTrophies:
                      (opposingTeamTrophies / trophiesTeam) *
                      brawlerTrophiesOrPPTrophies,
                    map: {},
                    starPlayer: 0,
                  };
                  isStarPlayer && !isPowerPlay
                    ? (playerStats.season[season].type[gameType].mode[
                        mode
                      ].starPlayer = 1)
                    : null;
                } else {
                  playerStats.season[season].type[gameType].mode[mode] = {
                    games: 1,
                    duration: duration,
                    wins: 0,
                    losses: 1,
                    winRatio: -1,
                    lossesByTrophies:
                      (trophiesTeam / opposingTeamTrophies) *
                      brawlerTrophiesOrPPTrophies,
                    winsByTrophies: 0,
                    map: {},
                    starPlayer: 0,
                  };
                }

                if (
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ]
                ) {
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ].games += 1;
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ].duration += duration;

                  if (
                    winTrophies ||
                    (isPowerPlay === true &&
                      element.battle.result === "victory")
                  ) {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].wins += 1;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].winsByTrophies +=
                      (opposingTeamTrophies / trophiesTeam) *
                      brawlerTrophiesOrPPTrophies;
                  } else {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].losses += 1;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].lossesByTrophies +=
                      (trophiesTeam / opposingTeamTrophies) *
                      brawlerTrophiesOrPPTrophies;
                  }
                  if (
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].lossesByTrophies !== 0 &&
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].winsByTrophies !== 0
                  ) {
                    isStarPlayer !== 0 && !isPowerPlay
                      ? (playerStats.season[season].type[gameType].mode[
                          mode
                        ].map[eventID].starPlayer += 1)
                      : null;

                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].winRatio = calculateRatio(
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].winsByTrophies,
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].lossesByTrophies
                    );
                  } else {
                    if (
                      winTrophies |
                      (isPowerPlay === true &&
                        element.battle.result === "victory")
                    ) {
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].winRatio += 1;
                      isStarPlayer !== 0 && !isPowerPlay
                        ? (playerStats.season[season].type[gameType].mode[
                            mode
                          ].map[eventID].starPlayer += 1)
                        : null;
                    } else {
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].winRatio -= 1;
                    }
                  }
                } else if (
                  winTrophies ||
                  (isPowerPlay === true && element.battle.result === "victory")
                ) {
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ] = {
                    mode: mode,
                    id: eventID,
                    games: 1,
                    duration: duration,
                    wins: 1,
                    losses: 0,
                    winRatio: 1,
                    lossesByTrophies: 0,
                    winsByTrophies:
                      (opposingTeamTrophies / trophiesTeam) *
                      brawlerTrophiesOrPPTrophies,
                    brawler: {},
                    starPlayer: 0,
                  };
                  isStarPlayer && !isPowerPlay
                    ? (playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].starPlayer += 1)
                    : null;
                } else
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ] = {
                    mode: mode,
                    id: eventID,
                    games: 1,
                    duration: duration,
                    wins: 0,
                    losses: 1,
                    winRatio: -1,
                    lossesByTrophies:
                      (trophiesTeam / opposingTeamTrophies) *
                      brawlerTrophiesOrPPTrophies,
                    winsByTrophies: 0,
                    brawler: {},
                    starPlayer: 0,
                  };

                if (
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ].brawler[brawlerID]
                ) {
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ].brawler[brawlerID].games += 1;

                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ].brawler[brawlerID].duration += duration;

                  if (
                    winTrophies ||
                    (isPowerPlay === true &&
                      element.battle.result === "victory")
                  ) {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].wins += 1;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].winsByTrophies +=
                      (opposingTeamTrophies / trophiesTeam) *
                      brawlerTrophiesOrPPTrophies;
                  } else {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].losses += 1;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].lossesByTrophies +=
                      (trophiesTeam / opposingTeamTrophies) *
                      brawlerTrophiesOrPPTrophies;
                  }
                  if (
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].lossesByTrophies !== 0 &&
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].winsByTrophies !== 0
                  ) {
                    isStarPlayer !== 0 && !isPowerPlay
                      ? (playerStats.season[season].type[gameType].mode[
                          mode
                        ].map[eventID].brawler[brawlerID].starPlayer += 1)
                      : null;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].winRatio = calculateRatio(
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].winsByTrophies,
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].lossesByTrophies
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
                          ].map[eventID].brawler[brawlerID].starPlayer += 1)
                        : null;

                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].winRatio =
                        playerStats.season[season].type[gameType].mode[
                          mode
                        ].map[eventID].brawler[brawlerID].wins;
                    } else
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].winRatio -= 1;
                  }
                } else if (
                  winTrophies ||
                  (isPowerPlay === true && element.battle.result === "victory")
                ) {
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ].brawler[brawlerID] = {
                    id: brawlerID,
                    games: 1,
                    duration: duration,
                    wins: 1,
                    losses: 0,
                    winRatio: 1,
                    lossesByTrophies: 0,
                    winsByTrophies:
                      (opposingTeamTrophies / trophiesTeam) *
                      brawlerTrophiesOrPPTrophies,
                    starPlayer: 0,
                    team: {},
                  };
                  isStarPlayer
                    ? (playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].starPlayer = 1)
                    : null;
                } else
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ].brawler[brawlerID] = {
                    id: brawlerID,
                    games: 1,
                    duration: duration,
                    wins: 0,
                    losses: 1,
                    winRatio: -1,
                    lossesByTrophies:
                      (trophiesTeam / opposingTeamTrophies) *
                      brawlerTrophiesOrPPTrophies,
                    winsByTrophies: 0,
                    starPlayer: 0,
                    team: {},
                  };

                if (
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ].brawler[brawlerID].team[brawlersIDTeam]
                ) {
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ].brawler[brawlerID].team[brawlersIDTeam].games += 1;
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ].brawler[brawlerID].team[brawlersIDTeam].duration +=
                    duration;

                  if (
                    winTrophies ||
                    (isPowerPlay === true &&
                      element.battle.result === "victory")
                  ) {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].team[brawlersIDTeam].wins += 1;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].team[brawlersIDTeam].winsByTrophies +=
                      (opposingTeamTrophies / trophiesTeam) *
                      brawlerTrophiesOrPPTrophies;
                  } else {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].team[brawlersIDTeam].losses += 1;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].team[
                      brawlersIDTeam
                    ].lossesByTrophies +=
                      (trophiesTeam / opposingTeamTrophies) *
                      brawlerTrophiesOrPPTrophies;
                  }
                  if (
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].team[brawlersIDTeam]
                      .lossesByTrophies !== 0 &&
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].team[brawlersIDTeam].winsByTrophies !==
                      0
                  ) {
                    isStarPlayer !== 0 && !isPowerPlay
                      ? (playerStats.season[season].type[gameType].mode[
                          mode
                        ].map[eventID].brawler[brawlerID].team[
                          brawlersIDTeam
                        ].starPlayer += 1)
                      : null;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].team[brawlersIDTeam].winRatio =
                      calculateRatio(
                        playerStats.season[season].type[gameType].mode[mode]
                          .map[eventID].brawler[brawlerID].team[brawlersIDTeam]
                          .winsByTrophies,
                        playerStats.season[season].type[gameType].mode[mode]
                          .map[eventID].brawler[brawlerID].team[brawlersIDTeam]
                          .lossesByTrophies
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
                          ].map[eventID].brawler[brawlerID].team[
                            brawlersIDTeam
                          ].starPlayer += 1)
                        : null;
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].team[brawlersIDTeam].winRatio =
                        playerStats.season[season].type[gameType].mode[
                          mode
                        ].map[eventID].brawler[brawlerID].team[
                          brawlersIDTeam
                        ].wins;
                    } else
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].team[brawlersIDTeam].winRatio -= 1;
                  }
                } else if (
                  winTrophies ||
                  (isPowerPlay === true && element.battle.result === "victory")
                ) {
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ].brawler[brawlerID].team[brawlersIDTeam] = {
                    games: 1,
                    duration: duration,
                    wins: 1,
                    losses: 0,
                    winRatio: 1,
                    lossesByTrophies: 0,
                    winsByTrophies:
                      (opposingTeamTrophies / trophiesTeam) *
                      brawlerTrophiesOrPPTrophies,
                    starPlayer: 0,
                    id: brawlersIDTeam.toString(),
                  };

                  isStarPlayer
                    ? (playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].team[brawlersIDTeam].starPlayer = 1)
                    : null;
                } else if (
                  lossTrophies ||
                  (isPowerPlay === true && element.battle.result === "defeat")
                ) {
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ].brawler[brawlerID].team[brawlersIDTeam] = {
                    games: 1,
                    duration: duration,
                    wins: 0,
                    losses: 1,
                    winRatio: -1,
                    lossesByTrophies:
                      (trophiesTeam / opposingTeamTrophies) *
                      brawlerTrophiesOrPPTrophies,
                    winsByTrophies: 0,
                    starPlayer: 0,
                    id: brawlersIDTeam.toString(),
                  };
                }
              } else if (
                (mode === "soloShowdown" ||
                  mode === "duoShowdown" ||
                  mode === "loneStar" ||
                  mode === "takedown") &&
                brawlerTrophiesOrPPTrophies !== 0
              ) {
                let [playerBrawlerTrophies, teamMateTrophies, duoTeam] =
                  findBrlrOrTeamSD(element);

                if (playerStats.season[season].type[gameType].mode[mode]) {
                  if (winTrophies) {
                    playerStats.season[season].type[gameType].mode[
                      mode
                    ].wins += 1;

                    playerStats.season[season].type[gameType].mode[
                      mode
                    ].winsByTrophies +=
                      playerBrawlerTrophies + teamMateTrophies;
                  } else {
                    playerStats.season[season].type[gameType].mode[
                      mode
                    ].losses += 1;
                    playerStats.season[season].type[gameType].mode[
                      mode
                    ].lossesByTrophies +=
                      playerBrawlerTrophies + teamMateTrophies;
                  }
                  if (
                    playerStats.season[season].type[gameType].mode[mode]
                      .lossesByTrophies !== 0 &&
                    playerStats.season[season].type[gameType].mode[mode]
                      .winsByTrophies !== 0
                  ) {
                    playerStats.season[season].type[gameType].mode[
                      mode
                    ].winRatio = calculateRatio(
                      playerStats.season[season].type[gameType].mode[mode]
                        .winsByTrophies,
                      playerStats.season[season].type[gameType].mode[mode]
                        .lossesByTrophies
                    );
                  } else {
                    if (winTrophies) {
                      playerStats.season[season].type[gameType].mode[
                        mode
                      ].winRatio =
                        playerStats.season[season].type[gameType].mode[
                          mode
                        ].wins;
                    } else {
                      playerStats.season[season].type[gameType].mode[
                        mode
                      ].winRatio -= 1;
                    }
                  }
                } else if (winTrophies) {
                  playerStats.season[season].type[gameType].mode[mode] = {
                    duration: 0,
                    starPlayer: 0,
                    games: 0,
                    wins: 1,
                    losses: 0,
                    winRatio: 1,
                    lossesByTrophies: 0,
                    winsByTrophies: playerBrawlerTrophies + teamMateTrophies,
                    map: {},
                  };
                } else {
                  playerStats.season[season].type[gameType].mode[mode] = {
                    duration: 0,
                    starPlayer: 0,
                    games: 0,
                    wins: 0,
                    losses: 1,
                    winRatio: -1,
                    lossesByTrophies: playerBrawlerTrophies + teamMateTrophies,
                    winsByTrophies: 0,
                    map: {},
                  };
                }

                if (
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ]
                ) {
                  if (winTrophies) {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].wins += 1;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].winsByTrophies +=
                      playerBrawlerTrophies + teamMateTrophies;
                  } else {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].losses += 1;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].lossesByTrophies +=
                      playerBrawlerTrophies + teamMateTrophies;
                  }
                  if (
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].lossesByTrophies !== 0 &&
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].winsByTrophies !== 0
                  ) {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].winRatio = calculateRatio(
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].winsByTrophies,
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].lossesByTrophies
                    );
                  } else {
                    if (
                      winTrophies ||
                      (isPowerPlay === true &&
                        element.battle.result === "victory")
                    ) {
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].winRatio += 1;
                    } else {
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].winRatio -= 1;
                    }
                  }
                } else if (winTrophies) {
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ] = {
                    mode: mode,
                    id: eventID,
                    duration: 0,
                    starPlayer: 0,
                    games: 0,
                    wins: 1,
                    losses: 0,
                    winRatio: 1,
                    lossesByTrophies: 0,
                    winsByTrophies: playerBrawlerTrophies + teamMateTrophies,
                    brawler: {},
                  };
                } else
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ] = {
                    mode: mode,
                    id: eventID,
                    duration: 0,
                    starPlayer: 0,
                    games: 0,
                    wins: 0,
                    losses: 1,
                    winRatio: -1,
                    lossesByTrophies: playerBrawlerTrophies + teamMateTrophies,
                    winsByTrophies: 0,
                    brawler: {},
                  };

                if (
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ].brawler[brawlerID]
                ) {
                  if (winTrophies) {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].wins += 1;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].winsByTrophies +=
                      playerBrawlerTrophies + teamMateTrophies;
                  } else {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].losses += 1;
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].lossesByTrophies +=
                      playerBrawlerTrophies + teamMateTrophies;
                  }
                  if (
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].lossesByTrophies !== 0 &&
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].winsByTrophies !== 0
                  ) {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].winRatio = calculateRatio(
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].winsByTrophies,
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].lossesByTrophies
                    );
                  } else {
                    if (winTrophies) {
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].winRatio =
                        playerStats.season[season].type[gameType].mode[
                          mode
                        ].map[eventID].brawler[brawlerID].wins;
                    } else
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].winRatio -= 1;
                  }
                } else if (winTrophies) {
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ].brawler[brawlerID] = {
                    id: brawlerID,
                    duration: 0,
                    starPlayer: 0,
                    games: 0,
                    wins: 1,
                    losses: 0,
                    winRatio: 1,
                    lossesByTrophies: 0,
                    winsByTrophies: playerBrawlerTrophies + teamMateTrophies,
                    team: {},
                  };
                } else
                  playerStats.season[season].type[gameType].mode[mode].map[
                    eventID
                  ].brawler[brawlerID] = {
                    id: brawlerID,
                    duration: 0,
                    starPlayer: 0,
                    games: 0,
                    duration: duration,
                    wins: 0,
                    losses: 1,
                    winRatio: -1,
                    lossesByTrophies: playerBrawlerTrophies + teamMateTrophies,
                    winsByTrophies: 0,
                    team: {},
                  };
                if (mode === "duoShowdown") {
                  if (
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].team[duoTeam]
                  ) {
                    if (winTrophies) {
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].team[duoTeam].wins += 1;
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].team[duoTeam].winsByTrophies +=
                        playerBrawlerTrophies + teamMateTrophies;
                    } else {
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].team[duoTeam].losses += 1;
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].team[duoTeam].lossesByTrophies +=
                        playerBrawlerTrophies + teamMateTrophies;
                    }
                    if (
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].team[duoTeam].lossesByTrophies !==
                        0 &&
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].team[duoTeam].winsByTrophies !== 0
                    ) {
                      playerStats.season[season].type[gameType].mode[mode].map[
                        eventID
                      ].brawler[brawlerID].team[duoTeam].winRatio =
                        calculateRatio(
                          playerStats.season[season].type[gameType].mode[mode]
                            .map[eventID].brawler[brawlerID].team[duoTeam]
                            .winsByTrophies,
                          playerStats.season[season].type[gameType].mode[mode]
                            .map[eventID].brawler[brawlerID].team[duoTeam]
                            .lossesByTrophies
                        );
                    } else {
                      if (winTrophies) {
                        playerStats.season[season].type[gameType].mode[
                          mode
                        ].map[eventID].brawler[brawlerID].team[
                          duoTeam
                        ].winRatio =
                          playerStats.season[season].type[gameType].mode[
                            mode
                          ].map[eventID].brawler[brawlerID].team[duoTeam].wins;
                      } else
                        playerStats.season[season].type[gameType].mode[
                          mode
                        ].map[eventID].brawler[brawlerID].team[
                          duoTeam
                        ].winRatio -= 1;
                    }
                  } else if (winTrophies) {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].team[duoTeam] = {
                      duration: 0,
                      starPlayer: 0,
                      games: 0,
                      wins: 1,
                      losses: 0,
                      winRatio: 1,
                      lossesByTrophies: 0,
                      winsByTrophies: playerBrawlerTrophies + teamMateTrophies,
                      id: duoTeam.toString(),
                    };
                  } else if (lossTrophies) {
                    playerStats.season[season].type[gameType].mode[mode].map[
                      eventID
                    ].brawler[brawlerID].team[duoTeam] = {
                      duration: 0,
                      starPlayer: 0,
                      games: 0,
                      duration: duration,
                      wins: 0,
                      losses: 1,
                      winRatio: -1,
                      lossesByTrophies:
                        playerBrawlerTrophies + teamMateTrophies,
                      winsByTrophies: 0,
                      id: duoTeam.toString(),
                    };
                  }
                }
              }

              //
            }
          }
        }

        Object.assign(stats.globalStats, {
          lastMatch: lastMatch,
          trophyLosses: trophyLosses,
          trophyWins: trophyWins,
          numberOfGames: numberOfGames,
          playerPLTrophySolo: playerPLTrophySolo,
          playerPLTrophyTeam: playerPLTrophyTeam,
        });

        // console.log("about to call compiler");
        compiledPlayerBP(playerStats, season, playerID).then(() =>
          resolve("all Good")
        );
      } else {
        return "no BP";
      }
    } catch (error) {
      console.log("error in getting processing player BP", error);
      reject("error in getting processing player BP");
      return;
    }
  });
};

let compiledPlayerBP = (playerStats, season, playerID) => {
  // console.log("called compiler");
  return new Promise(function (resolve, reject) {
    try {
      let playerBPRef = fireStore.collection(`S${season}_${playerID}`);
      if (playerStats.season) {
        let gameTypeKeys = Object.keys(playerStats.season[season].type);

        gameTypeKeys.map((gameType) => {
          let mKeys = [];
          let bKeys = [];
          let tKeys = [];
          playerStats.season[season].type[gameType].compiled = {};

          let modeKeys = Object.keys(
            playerStats.season[season].type[gameType].mode
          );

          playerStats.season[season].type[gameType].compiled.maps = modeKeys
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
                    id: parseInt(brawler),
                    games: stored[brawler].games + next[brawler].games,
                    wins: stored[brawler].wins + next[brawler].wins,
                    losses: stored[brawler].losses + next[brawler].losses,
                    lossesByTrophies:
                      stored[brawler].lossesByTrophies +
                      next[brawler].lossesByTrophies,
                    winsByTrophies:
                      stored[brawler].winsByTrophies +
                      next[brawler].winsByTrophies,
                    duration: stored[brawler].duration + next[brawler].duration,
                    starPlayer:
                      stored[brawler].starPlayer + next[brawler].starPlayer,
                  };
                  if (
                    result[brawler].lossesByTrophies !== 0 &&
                    result[brawler].winsByTrophies !== 0
                  ) {
                    result[brawler].winRatio =
                      result[brawler].winsByTrophies /
                      result[brawler].lossesByTrophies;
                  } else if (result[brawler].winsByTrophies !== 0) {
                    result[brawler].winRatio = result[brawler].wins;
                  } else if (result[brawler].lossesByTrophies !== 0) {
                    result[brawler].winRatio = -Math.abs(
                      result[brawler].losses
                    );
                  }
                } else if (next[brawler]) {
                  // console.log("called 5");
                  result[brawler] = {
                    id: parseInt(brawler),
                    games: next[brawler].games,
                    wins: next[brawler].wins,
                    losses: next[brawler].losses,
                    lossesByTrophies: next[brawler].lossesByTrophies,
                    winsByTrophies: next[brawler].winsByTrophies,
                    winRatio: next[brawler].winRatio,
                    duration: next[brawler].duration,
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
                    duration: stored[team].duration + next[team].duration,
                    id: stored[team].id,
                    starPlayer: stored[team].starPlayer + next[team].starPlayer,
                  };
                  if (
                    result[team].lossesByTrophies !== 0 &&
                    result[team].winsByTrophies !== 0
                  ) {
                    result[team].winRatio =
                      result[team].winsByTrophies /
                      result[team].lossesByTrophies;
                  } else if (result[team].winsByTrophies !== 0) {
                    result[team].winRatio = result[team].wins;
                  } else if (result[team].lossesByTrophies !== 0) {
                    result[team].winRatio = -Math.abs(result[team].losses);
                  }
                } else if (next[team]) {
                  //  console.log("called 5");
                  result[team] = {
                    games: next[team].games,
                    wins: next[team].wins,
                    losses: next[team].losses,
                    lossesByTrophies: next[team].lossesByTrophies,
                    winsByTrophies: next[team].winsByTrophies,
                    winRatio: next[team].winRatio,
                    id: next[team].id,
                    duration: next[team].duration,
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

          playerStats.season[season].type[gameType].compiled.brawlers = modeKeys
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

          modeKeys
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
          let reducedTeams = savedTeams.reduce(reducerTeams);
          // console.log("reduce", typeof reducedTeams, reducedTeams);

          // let slicedTeams = Object.keys(reducedTeams)
          //   .slice(0, 20)
          //   .reduce((result, key) => {
          //     result[key] = reducedTeams[key];

          //     return result;
          //   }, {});

          playerStats.season[season].type[gameType].compiled.teams =
            reducedTeams;
        });

        let globalStats = playerStats.season[season].type;
        let typeKeys = Object.keys(globalStats);
        let globalBrawler = {};
        let globalTeam = {};
        //teamKeys is being reset in each loop of the different events
        let teamKeys = [];
        let reducerTeams = (stored, next) => {
          console.log(teamKeys);
          console.log(1, next);
          console.log(2, stored);
          let result = {};
          teamKeys.map((team) => {
            if (stored === undefined || (stored === {} && next !== undefined)) {
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
                    stored[team].lossesByTrophies + next[team].lossesByTrophies,
                  winsByTrophies:
                    stored[team].winsByTrophies + next[team.winsByTrophies],
                  duration: stored[team].duration + next[team].duration,
                  id: stored[team].id,
                  starPlayer: stored[team].starPlayer + next[team].starPlayer,
                };
                if (
                  result[team].lossesByTrophies !== 0 &&
                  result[team].winsByTrophies !== 0
                ) {
                  result[team].winRatio =
                    result[team].winsByTrophies / result[team].lossesByTrophies;
                } else if (result[team].winsByTrophies !== 0) {
                  result[team].winRatio = result[team].wins;
                } else if (result[team].lossesByTrophies !== 0) {
                  result[team].winRatio = -Math.abs(result[team].losses);
                }
              } else if (next[team]) {
                //  console.log("called 5");
                result[team] = {
                  games: next[team].games,
                  wins: next[team].wins,
                  losses: next[team].losses,
                  lossesByTrophies: next[team].lossesByTrophies,
                  winsByTrophies: next[team].winsByTrophies,
                  winRatio: next[team].winRatio,
                  id: next[team].id,
                  duration: next[team].duration,
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
        typeKeys.map((type) => {
          let sortedTypes = globalStats[type];
          let sortedTypesKeys = Object.keys(sortedTypes);
          sortedTypesKeys.map((sortedType) => {
            if (sortedType == "mode") delete globalStats[type][sortedType];
            else {
              let compiledObject = sortedTypes.compiled;
              compiledObjectKeys = Object.keys(compiledObject);
              compiledObjectKeys.map((compiledType) => {
                let ids = compiledObject[compiledType];
                console.log(sizeof(ids), compiledType);
                idsKey = Object.keys(ids);
                let brawlers = [];
                let teams = [];
                idsKey.map((id) => {
                  if (compiledType == "brawlers") {
                    ids[id].team ? delete ids[id].team : null;
                    brawlers.push(ids[id]);
                  }
                  if (compiledType == "teams") {
                    teams.push(ids[id]);
                  }
                  if (compiledType == "maps") {
                    let teams = [];
                    let brawlerKeys = Object.keys(ids[id].brawler);
                    brawlerKeys.map((brawler) => {
                      if (ids[id].brawler)
                        if (ids[id].brawler[brawler]) {
                          if (ids[id].brawler[brawler].team) {
                            teamKeys = Object.keys(
                              ids[id].brawler[brawler].team
                            );
                            teamKeys.map((team) => {
                              teams.push(ids[id].brawler[brawler].team[team]);
                            });

                            delete ids[id].brawler[brawler].team;
                          }
                        }
                    });
                    if (teams.length > 0) {
                      ids[id].team = teams;
                    }
                  }
                });
                if (compiledType == "brawlers") {
                  brawlers = brawlers.sort((a, b) =>
                    a.winRatio > b.winRatio ? -1 : 1
                  );
                  globalBrawler[type] = brawlers;
                }
                if (compiledType == "teams") {
                  teams = teams.sort((a, b) =>
                    a.winRatio > b.winRatio ? -1 : 1
                  );
                  globalTeam[type] = teams;
                }
                if (compiledType == "maps") {
                  stats[`${type}_${compiledType}`] = ids;
                  // fireStore
                  //   .collection(`S${season}_${playerID}`)
                  //   .doc(`${type}_${compiledType}`)
                  //   .set(ids)
                  //   .then(() => "nothing");
                }
              });
            }
          });
        });
        stats.brawlers = globalBrawler;
        stats.teams = globalTeam;
        resolve("all good");
        // fireStore
        //   .collection(`S${season}_${playerID}`)
        //   .doc("brawlers")
        //   .set(globalBrawler)
        //   .then(() => {
        //     fireStore
        //       .collection(`S${season}_${playerID}`)
        //       .doc("teams")
        //       .set(globalTeam)
        //       .then(() => {
        //         resolve("all done");
        //       });
        //   });
      }
    } catch (error) {
      console.log("error in compiler player stats", error);
      reject("error in compiler player stats");
      return;
    }
  });
};

const saveToFirebase = (season, playerID) => {
  console.log("called fire");
  await fireStore
    .collection(`S${season}_${playerID}`)
    .doc("brawlers")
    .set(stats.brawlers);

  await fireStore
    .collection(`S${season}_${playerID}`)
    .doc("teams")
    .set(stats.teams);

  await fireStore
    .collection(`S${season}_${playerID}`)
    .doc("globalStats")
    .set(stats.globalStats);

  for (const [key, value] of Object.entries(stats)) {
    if (key.includes("maps")) {
      await fireStore.collection(`S${season}_${playerID}`).doc(key).set(value);
    }
  }
  console.log("end of setting");
};

exports.getPlayerBLandProcess = (req, res) => {
  let session_id = (1000000 * Math.random()) | 0;
  let playerID = req.body["playerID"];
  // let playerID = playerIDReq.includes("#")
  //   ? playerIDReq.substring(1)
  //   : playerIDReq;
  console.log(playerID);
  let season = null;
  db.ref("global/count/seasonGlobalFN").on(
    "value",
    (snapshot) => {
      season = snapshot.val();
    },
    (error) => {
      console.log(error);
    }
  );

  request(
    {
      headers: {
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjdkOGU0N2RhLWE3MWQtNDEzNy1hMDVkLWE4YWI5MTkwZTMzNyIsImlhdCI6MTYyNzMyMDg4Nywic3ViIjoiZGV2ZWxvcGVyLzk3NTFkMjQ1LWQ5YjAtMGFkNC1mNmYyLTg4OWYzZDFlMmZiNyIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTYxLjEyMy4yMzMuMjQyIl0sInR5cGUiOiJjbGllbnQifV19.Ihq5VvuXGbz-7-8Y-IgH88H6dApDm-1Lv6ENWvtOpWvMs9W0AzrGrQppMRqfQzt8BKeSk2BxdUhXFSuPn-Bhjw",
      },
      url: `https://api.brawlstars.com/v1/players/%23` + playerID,
      method: "GET",
      proxy:
        "http://" +
        "lum-customer-hl_3bbcab99-zone-isp-ip-161.123.233.242" +
        "-session-" +
        session_id +
        ":" +
        "brawlMax99" +
        "@zproxy.lum-superproxy.io:" +
        22225,
    },
    (error, response, body, next) => {
      if (response.statusCode == 200) {
        processPlayerInfo(playerID, body, season).then(() =>
          request(
            {
              headers: {
                Authorization:
                  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjdkOGU0N2RhLWE3MWQtNDEzNy1hMDVkLWE4YWI5MTkwZTMzNyIsImlhdCI6MTYyNzMyMDg4Nywic3ViIjoiZGV2ZWxvcGVyLzk3NTFkMjQ1LWQ5YjAtMGFkNC1mNmYyLTg4OWYzZDFlMmZiNyIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTYxLjEyMy4yMzMuMjQyIl0sInR5cGUiOiJjbGllbnQifV19.Ihq5VvuXGbz-7-8Y-IgH88H6dApDm-1Lv6ENWvtOpWvMs9W0AzrGrQppMRqfQzt8BKeSk2BxdUhXFSuPn-Bhjw",
              },
              url:
                "https://api.brawlstars.com/v1/players/%23" +
                playerID +
                "/battlelog",
              method: "GET",
              proxy:
                "http://" +
                "lum-customer-hl_3bbcab99-zone-isp-ip-161.123.233.242" +
                "-session-" +
                session_id +
                ":" +
                "brawlMax99" +
                "@zproxy.lum-superproxy.io:" +
                22225,
            },

            (error, response, body, next) => {
              if (response.statusCode == 200) {
                processPlayerBP(playerID, body, season).then(() => {
                  res.status(200).send(stats);
                  saveToFirebase(season, playerID).then(() => {
                    console.log("end of function");
                  });
                });
              } else {
                console.log("error in second request");
                res.status(response.statusCode).send("something went wrong");
              }
            }
          )
        );
      } else {
        console.log("error in first request");
        res.status(response.statusCode).send("something went wrong");
      }
    }
  );
};
// getPlayerBLandProcess(1, 2);

//node getPlayerBLandStats.js
