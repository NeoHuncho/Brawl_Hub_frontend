import { store } from "../../../store/configureStore";
import colors from "../../../config/colors";
import {
  getAssets,
  getBrawlerImage,
  getBrawlerName,
  getMapImage,
  getMapName,
  getModeImage,
} from "../../../lib/getAssetsFunctions";
import { camelize } from "../../../lib/getGlobalStatsFunctions";

let modesByPerformance = undefined;
let modesByWins = undefined;
let mapsByWins = undefined;
let mapsByPerformance = undefined;
let brawlersByWins = undefined;
let brawlersByPerformance = undefined;
let teamsByWins = undefined;
let teamsByPerformance = undefined;

let pickedModeByPerformance = undefined;
let pickedModeByWins = undefined;
let pickedMapByPerformance = undefined;
let pickedMapByWins = undefined;

let modes = [];
let brawlers = [];
let maps = [];
let teams = [];

let chosenMode = [];
let chosenMap = [];

let loadedOnceCarouselData = false;

const processPlayerStats = (seasonIndex, gameTypeName, name, type) => {
  //reseting variable otherwise they add up
  modesByPerformance = undefined;
  modesByWins = undefined;
  mapsByWins = undefined;
  mapsByPerformance = undefined;
  brawlersByWins = undefined;
  brawlersByPerformance = undefined;
  teamsByWins = undefined;
  teamsByPerformance = undefined;
  modes = [];
  brawlers = [];
  maps = [];
  teams = [];
  loadedOnceCarouselData = false;

  //

  let state = store.getState();
  let playerStats = undefined;
  let season = seasonIndex;
  let gameType = undefined;

  // console.log(gameTypeName);
  gameTypeName === "Trophies"
    ? (gameType = "ranked")
    : gameTypeName === "Solo PL"
    ? (gameType = "soloRanked")
    : gameTypeName === "Team PL"
    ? (gameType = "teamRanked")
    : null;

  if (
    state.battleLogReducer.playerStats.season[season].type[gameType].keys
      .teams &&
    name == null
  ) {
    playerStats =
      state.battleLogReducer.playerStats.season[season].type[gameType];
    // console.log(playerStats);

    getAssets();

    playerStats.keys.modes.map((mode) => {
      //console.log(mode);
      if (mode !== "duoShowdown" && mode !== "soloShowdown") {
        modes.push({
          image: getModeImage(mode),
          duration:
            playerStats.mode[mode].duration / playerStats.mode[mode].games,
          spRatio:
            playerStats.mode[mode].starPlayer / playerStats.mode[mode].games,
          winRatio: playerStats.mode[mode].winRatio,
          wins: playerStats.mode[mode].wins,
          losses: playerStats.mode[mode].losses,
          title: mode.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
            return str.toUpperCase();
          }),
          titleCamel: mode,
        });
      } else {
        modes.push({
          image: getModeImage(mode),
          winRatio: playerStats.mode[mode].winRatio,
          wins: playerStats.mode[mode].wins,
          losses: playerStats.mode[mode].losses,
          title: mode
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, function (str) {
              return str.toUpperCase();
            })
            .replace(/Showdown/gm, "S/D"),
          titleCamel: mode,
        });
      }
    });

    modesByPerformance = [...modes]
      .sort((a, b) => (a.winRatio > b.winRatio ? -1 : 1))
      .filter((mode) => mode.winRatio !== 0);

    modesByWins = [...modes]
      .sort((a, b) => (a.wins > b.wins ? -1 : 1))
      .filter((mode) => mode.winRatio !== 0);

    playerStats.keys.brawlers.map((brawler) => {
      //console.log(brawler)

      let compiledBrawlers = playerStats.compiled.brawlers[brawler];
      brawlers.push({
        //color: getBrawlerColor(brawler),
        image: getBrawlerImage(brawler),
        duration: compiledBrawlers.duration / compiledBrawlers.games,
        spRatio: compiledBrawlers.starPlayer / compiledBrawlers.games,
        winRatio: compiledBrawlers.winRatio,
        wins: compiledBrawlers.wins,
        losses: compiledBrawlers.losses,
        title: getBrawlerName(brawler),
      });
    });

    brawlersByPerformance = [...brawlers].sort((a, b) =>
      a.winRatio > b.winRatio ? -1 : 1
    );

    brawlersByWins = [...brawlers].sort((a, b) => (a.wins > b.wins ? -1 : 1));

    playerStats.keys.maps.map((map) => {
      let compiledMaps = playerStats.compiled.maps[map];
      let modeName = undefined;
      playerStats.keys.modes.map((mode) => {
        if (playerStats.mode[mode].map[map]) {
          // console.log(mode)
          modeName = mode;
        }
      });
      maps.push({
        image: getMapImage(map),
        winRatio: compiledMaps.winRatio,
        spRatio: compiledMaps.starPlayer / compiledMaps.games,
        duration: compiledMaps.duration / compiledMaps.games,
        wins: compiledMaps.wins,
        losses: compiledMaps.losses,
        title: getMapName(map),
        titleCamel: map,
        mode: getModeImage(modeName),
      });
    });

    mapsByPerformance = [...maps].sort((a, b) =>
      a.winRatio > b.winRatio ? -1 : 1
    );

    mapsByWins = [...maps].sort((a, b) => (a.wins > b.wins ? -1 : 1));

    if (mapsByWins) {
      loadedOnceCarouselData = true;
    }

    playerStats.keys.teams.map((team) => {
      let compiledTeams = playerStats.compiled.teams[team];
      teams.push({
        brawler1: getBrawlerImage(compiledTeams.id1),
        brawler2: getBrawlerImage(compiledTeams.id2),
        brawler3: compiledTeams.id3 ? getBrawlerImage(compiledTeams.id3) : null,
        duration: compiledTeams.duration / compiledTeams.games,
        spRatio: compiledTeams.starPlayer / compiledTeams.games,
        winRatio: compiledTeams.winRatio,
        wins: compiledTeams.wins,
        losses: compiledTeams.losses,
        title: `${getBrawlerName(compiledTeams.id1)}, ${getBrawlerName(
          compiledTeams.id2
        )}${
          compiledTeams.id3 !== 0
            ? " , " + getBrawlerName(compiledTeams.id3)
            : ""
        }`,
      });
    });
    // console.log(teams);
    teamsByPerformance = [...teams]
      .sort((a, b) => (a.winRatio > b.winRatio ? -1 : 1))
      .slice(0, 20);

    teamsByWins = [...teams]
      .sort((a, b) => (a.wins > b.wins ? -1 : 1))
      .slice(0, 20);
  } else if (
    state.battleLogReducer.playerStats.season[season].type[gameType].keys
      .teams &&
    name != null
  ) {
    //IMPORTANT: name here for type mode is in camelCase and for map it is it's ID!

    if (type == "mode")
      playerStats =
        state.battleLogReducer.playerStats.season[season].type[gameType].mode[
          name
        ];
    else if (type == "map")
      playerStats =
        state.battleLogReducer.playerStats.season[season].type[gameType]
          .compiled.maps[name];
    // console.log(playerStats);

    getAssets();

    if (type == "mode") {
      let mapKeys = Object.keys(playerStats["map"]);

      //these serve so that when more info clicked, brawlers and teams that are the same but on different maps end up together and not seperate
      let brawlerAdded = [];
      let teamAdded = [];

      mapKeys.map((mapID) => {
        let map = playerStats["map"][mapID];

        maps.push({
          image: getMapImage(mapID),
          winRatio: map.winRatio,
          spRatio: map.starPlayer / map.games,
          duration: map.duration / map.games,
          wins: map.wins,
          losses: map.losses,
          title: getMapName(mapID),
        });

        let brawlerKeys = Object.keys(map.brawler);
        brawlerKeys.map((brawlerID) => {
          let brawler = map.brawler[brawlerID];
          if (brawlerAdded.includes(brawlerID) == false) {
            brawlerAdded.push(brawlerID);
            brawlers.push({
              //color: getBrawlerColor(brawler),
              image: getBrawlerImage(brawlerID),
              duration: brawler.duration / brawler.games,
              spRatio: brawler.starPlayer / brawler.games,
              winRatio: brawler.winRatio,
              wins: brawler.wins,
              losses: brawler.losses,
              title: getBrawlerName(brawlerID),
              games: brawler.games,
              durationTotal: brawler.duration,
              spTotal: brawler.starPlayer,
            });
          } else {
            brawlers.map((brawlerSaved, index) => {
              if (brawlerSaved.title == getBrawlerName(brawlerID)) {
                brawlers[index] = {
                  image: getBrawlerImage(brawlerID),
                  duration:
                    (brawlerSaved.durationTotal + brawler.duration) /
                    (brawlerSaved.games + brawler.games),
                  spRatio:
                    (brawlerSaved.spTotal + brawler.starPlayer) /
                    (brawlerSaved.games + brawler.games),
                  winRatio:
                    (brawlerSaved.wins + brawler.wins) /
                    (brawlerSaved.losses + brawler.losses),
                  wins: brawlerSaved.wins + brawler.wins,
                  losses: brawlerSaved.losses + brawler.losses,
                  title: getBrawlerName(brawlerID),
                  games: brawler.games + brawlerSaved.games,
                  durationTotal: brawlerSaved.durationTotal + brawler.duration,
                  spTotal: brawlerSaved.spTotal + brawler.starPlayer,
                };
                // console.log(brawlers[index]);
              }
            });
          }
          // console.log(brawlerAdded);
          if (brawler.team) {
            let teamKeys = Object.keys(brawler.team);
            teamKeys.map((teamIDs) => {
              let team = brawler.team[teamIDs];
              if (teamAdded.includes(teamIDs) == false) {
                teamAdded.push(teamIDs);
                teams.push({
                  brawler1: getBrawlerImage(team.id1),
                  brawler2: getBrawlerImage(team.id2),
                  brawler3: team.id3 ? getBrawlerImage(team.id3) : null,
                  duration: team.duration / team.games,
                  spRatio: team.starPlayer / team.games,
                  winRatio: team.winRatio,
                  wins: team.wins,
                  losses: team.losses,
                  title: `${getBrawlerName(team.id1)}, ${getBrawlerName(
                    team.id2
                  )}${team.id3 !== 0 ? " , " + getBrawlerName(team.id3) : ""}`,
                  games: team.games,
                  durationTotal: team.duration,
                  spTotal: team.starPlayer,
                });
              } else {
                teams.map((teamSaved, index) => {
                  if (
                    teamSaved.brawler1 == getBrawlerImage(team.id1) &&
                    teamSaved.brawler2 == getBrawlerImage(team.id2) &&
                    teamSaved.brawler3 ==
                      (team.id3 ? getBrawlerImage(team.id3) : null)
                  ) {
                    teams[index] = {
                      brawler1: getBrawlerImage(teamSaved.id1),
                      brawler2: getBrawlerImage(teamSaved.id2),
                      brawler3: teamSaved.id3
                        ? getBrawlerImage(teamSaved.id3)
                        : null,
                      duration:
                        (teamSaved.durationTotal + team.duration) /
                        (teamSaved.games + team.games),
                      spRatio:
                        (team.starPlayer + teamSaved.spTotal) /
                        (teamSaved.games + team.games),
                      winRatio:
                        (teamSaved.wins + team.wins) /
                        (teamSaved.losses + team.losses),
                      wins: teamSaved.wins + team.wins,
                      losses: teamSaved.losses + team.losses,
                      title: `${getBrawlerName(
                        teamSaved.id1
                      )}, ${getBrawlerName(teamSaved.id2)}${
                        teamSaved.id3 !== 0
                          ? " , " + getBrawlerName(teamSaved.id3)
                          : ""
                      }`,
                      games: teamSaved.games + team.games,
                      durationTotal: teamSaved.duration + team.duration,
                      spTotal: teamSaved.starPlayer + team.starPlayer,
                    };
                  }
                });
              }
            });
          }
        });
      });
      brawlersByPerformance = [...brawlers].sort((a, b) =>
        a.winRatio > b.winRatio ? -1 : 1
      );

      brawlersByWins = [...brawlers].sort((a, b) => (a.wins > b.wins ? -1 : 1));

      mapsByPerformance = [...maps].sort((a, b) =>
        a.winRatio > b.winRatio ? -1 : 1
      );

      mapsByWins = [...maps].sort((a, b) => (a.wins > b.wins ? -1 : 1));
      teamsByPerformance = [...teams]
        .sort((a, b) => (a.winRatio > b.winRatio ? -1 : 1))
        .slice(0, 20);

      teamsByWins = [...teams]
        .sort((a, b) => (a.wins > b.wins ? -1 : 1))
        .slice(0, 20);

      if (mapsByWins) {
        loadedOnceCarouselData = true;
      }
    } else if (type == "map") {
      let brawlerKeys = Object.keys(playerStats.brawler);
      brawlerKeys.map((brawlerID) => {
        let brawler = playerStats.brawler[brawlerID];

        brawlers.push({
          //color: getBrawlerColor(brawler),
          image: getBrawlerImage(brawlerID),
          duration: brawler.duration / brawler.games,
          spRatio: brawler.starPlayer / brawler.games,
          winRatio: brawler.winRatio,
          wins: brawler.wins,
          losses: brawler.losses,
          title: getBrawlerName(brawlerID),
        });
        if (brawler.team) {
          let teamKeys = Object.keys(brawler.team);
          teamKeys.map((teamIDs) => {
            let team = brawler.team[teamIDs];
            teams.push({
              brawler1: getBrawlerImage(team.id1),
              brawler2: getBrawlerImage(team.id2),
              brawler3: team.id3 ? getBrawlerImage(team.id3) : null,
              duration: team.duration / team.games,
              spRatio: team.starPlayer / team.games,
              winRatio: team.winRatio,
              wins: team.wins,
              losses: team.losses,
              title: `${getBrawlerName(team.id1)}, ${getBrawlerName(team.id2)}${
                team.id3 !== 0 ? " , " + getBrawlerName(team.id3) : ""
              }`,
            });
          });
        }
      });

      brawlersByPerformance = [...brawlers].sort((a, b) =>
        a.winRatio > b.winRatio ? -1 : 1
      );
      brawlersByWins = [...brawlers].sort((a, b) => (a.wins > b.wins ? -1 : 1));
      teamsByPerformance = [...teams]
        .sort((a, b) => (a.winRatio > b.winRatio ? -1 : 1))
        .slice(0, 20);
      teamsByWins = [...teams]
        .sort((a, b) => (a.wins > b.wins ? -1 : 1))
        .slice(0, 20);

      if (mapsByWins) {
        loadedOnceCarouselData = true;
      }
    }
  }
};

const unsubscribe = store.subscribe(processPlayerStats);
unsubscribe();

//console.log(brawlersByPerformance);
export {
  processPlayerStats,
  modesByPerformance,
  modesByWins,
  brawlersByPerformance,
  brawlersByWins,
  mapsByPerformance,
  mapsByWins,
  teamsByPerformance,
  teamsByWins,
  loadedOnceCarouselData,
};
