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

let modes = [];
let brawlers = [];
let maps = [];
let teams = [];

let loadedOnceCarouselData = false;

const processPlayerStats = (seasonIndex, gameTypeName, name, type) => {
  getAssets();
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
    state.battleLogReducer.playerStats[`${gameType}_maps`] &&
    state.battleLogReducer.playerStats["brawlers"] &&
    state.battleLogReducer.playerStats["teams"] &&
    name == null
  ) {
    let mapsPS = state.battleLogReducer.playerStats[`${gameType}_maps`];
    let brawlersPS = state.battleLogReducer.playerStats["brawlers"][gameType];
    let teamsPS = state.battleLogReducer.playerStats["teams"][gameType];
    let modesPS = {};
    Object.values(mapsPS).map((map) => {
      if (modesPS[map.mode]) {
        modesPS[map.mode].wins += map.wins;
        modesPS[map.mode].winsByTrophies += map.winsByTrophies;
        modesPS[map.mode].losses += map.losses;
        modesPS[map.mode].lossesByTrophies += map.lossesByTrophies;
        modesPS[map.mode].winRatio =
          modesPS[map.mode].losses == 0
            ? modesPS[map.mode].wins
            : modesPS[map.mode].wins == 0
            ? -Math.abs(modesPS[map.mode].losses)
            : modesPS[map.mode].winsByTrophies /
              modesPS[map.mode].lossesByTrophies;

        if (
          map.mode !== "duoShowdown" &&
          map.mode !== "soloShowdown" &&
          map.mode !== "loneStar" &&
          map.mode !== "takedown"
        ) {
          modesPS[map.mode].games += map.games;
          modesPS[map.mode].durationTotal += map.duration;
          modesPS[map.mode].starPlayer += map.starPlayer;
          modesPS[map.mode].duration =
            modesPS[map.mode].durationTotal / modesPS[map.mode].games;
          modesPS[map.mode].spRatio =
            modesPS[map.mode].starPlayer / modesPS[map.mode].games;
          // console.log(modesPS[map.mode].spRatio)
        }
      } else {
        modesPS[map.mode] = {};

        modesPS[map.mode].wins = map.wins;
        modesPS[map.mode].winsByTrophies = map.winsByTrophies;
        modesPS[map.mode].losses = map.losses;
        modesPS[map.mode].lossesByTrophies = map.lossesByTrophies;
        modesPS[map.mode].winRatio =
          modesPS[map.mode].losses == 0
            ? modesPS[map.mode].wins
            : modesPS[map.mode].wins == 0
            ? -Math.abs(modesPS[map.mode].losses)
            : modesPS[map.mode].winsByTrophies /
              modesPS[map.mode].lossesByTrophies;

        modesPS[map.mode].image = getModeImage(map.mode);
        modesPS[map.mode].title = map.mode
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, function (str) {
            return str.toUpperCase();
          });
        modesPS[map.mode].titleCamel = map.mode;

        if (
          map.mode !== "duoShowdown" &&
          map.mode !== "soloShowdown" &&
          map.mode !== "loneStar" &&
          map.mode !== "takedown"
        ) {
          modesPS[map.mode].games = map.games;
          modesPS[map.mode].durationTotal = map.duration;
          modesPS[map.mode].starPlayer = map.starPlayer;
          modesPS[map.mode].duration = map.durationTotal / map.games;
          modesPS[map.mode].spRatio = map.starPlayer / map.games;
        }
      }
    });

    Object.values(modesPS).map((mode) => {
      //console.log(mode);
      if (
        mode !== "duoShowdown" &&
        mode !== "soloShowdown" &&
        mode !== "loneStar" &&
        mode !== "takedown"
      ) {
        modes.push({
          image: getModeImage(mode.titleCamel),
          duration: mode.duration,
          spRatio: mode.spRatio,
          winRatio: mode.winRatio,
          wins: mode.wins,
          losses: mode.losses,
          title: mode.title,
          titleCamel: mode.titleCamel,
        });
      } else {
        modes.push({
          image: getModeImage(mode.titleCamel),
          winRatio: mode.winRatio,
          wins: mode.wins,
          losses: mode.losses,
          title: mode.title,
          titleCamel: mode.titleCamel,
        });
      }
    });

    // console.log(modes);

    modesByPerformance = [...modes].sort((a, b) =>
      a.winRatio > b.winRatio ? -1 : 1
    );

    modesByWins = [...modes].sort((a, b) => (a.wins > b.wins ? -1 : 1));

    // console.log(modesByPerformance);
    brawlersPS.map((brawler) => {
      //console.log(brawler)

      brawlers.push({
        //color: getBrawlerColor(brawler),
        image: getBrawlerImage(brawler.id),
        duration: brawler.duration / brawler.games,
        spRatio: brawler.starPlayer / brawler.games,
        winRatio: brawler.winRatio,
        wins: brawler.wins,
        losses: brawler.losses,
        title: getBrawlerName(brawler.id),
      });
    });

    brawlersByPerformance = [...brawlers];

    brawlersByWins = [...brawlers].sort((a, b) => (a.wins > b.wins ? -1 : 1));

    Object.values(mapsPS).map((map) => {
      maps.push({
        image: getMapImage(map.id),
        winRatio: map.winRatio,
        spRatio: map.starPlayer / map.games,
        duration: map.duration / map.games,
        wins: map.wins,
        losses: map.losses,
        title: getMapName(map.id),
        titleCamel: map.id, //yeah I know weird, but it is to be the same as for mode where its id is its name
        mode: getModeImage(map.mode),
      });
    });

    mapsByPerformance = [...maps].sort((a, b) =>
      a.winRatio > b.winRatio ? -1 : 1
    );

    mapsByWins = [...maps].sort((a, b) => (a.wins > b.wins ? -1 : 1));

    if (mapsByWins) {
      loadedOnceCarouselData = true;
    }

    teamsPS.map((team) => {
      teams.push({
        brawler1: getBrawlerImage(team.id.slice(0, 8)),
        brawler2: getBrawlerImage(team.id.slice(9, 17)),
        brawler3:
          team.id.slice(18, 26).length != 0
            ? getBrawlerImage(team.id.slice(18, 26))
            : null,
        duration: team.duration / team.games,
        spRatio: team.starPlayer / team.games,
        winRatio: team.winRatio,
        wins: team.wins,
        losses: team.losses,
        title: `${getBrawlerName(team.id.slice(0, 8))}, ${getBrawlerName(
          team.id.slice(9, 17)
        )}${
          team.id.slice(18, 26).length != 0
            ? " , " + getBrawlerName(team.id.slice(18, 26))
            : ""
        }`,
      });
    });
    // console.log(teams);
    teamsByPerformance = [...teams].slice(0, 20);

    teamsByWins = [...teams]
      .sort((a, b) => (a.wins > b.wins ? -1 : 1))
      .slice(0, 20);
  } else if (name != null) {
    //IMPORTANT: name here for type mode is in camelCase and for map it is it's ID!

    playerStats = state.battleLogReducer.playerStats[`${gameType}_maps`];

    if (type == "mode") {
      let modePS = undefined;
      //this part is to compile all the selected mode stats together
      Object.values(playerStats).map((map) => {
        if (map.mode == name) {
          if (modePS) {
            modePS.maps[map.id] = {};
            modePS.maps[map.id].id = map.id;
            modePS.maps[map.id].mode = map.mode;
            modePS.maps[map.id].games = map.games;
            modePS.maps[map.id].wins = map.wins;
            modePS.maps[map.id].losses = map.losses;
            modePS.maps[map.id].winRatio = map.winRatio;
            modePS.maps[map.id].starPlayer = map.starPlayer;
            modePS.maps[map.id].duration = map.duration;

            Object.values(map.brawler).map((brawler) => {
              if (modePS.brawlers[brawler.id]) {
                modePS.brawlers[brawler.id].games += brawler.games;
                modePS.brawlers[brawler.id].wins += brawler.wins;
                modePS.brawlers[brawler.id].winsByTrophies +=
                  brawler.winsByTrophies;
                modePS.brawlers[brawler.id].losses += brawler.losses;
                modePS.brawlers[brawler.id].lossesByTrophies +=
                  brawler.lossesByTrophies;
                modePS.brawlers[brawler.id].starPlayer += brawler.starPlayer;
                modePS.brawlers[brawler.id].duration += brawler.duration;
              } else {
                modePS.brawlers[brawler.id] = {};
                modePS.brawlers[brawler.id].id = brawler.id;
                modePS.brawlers[brawler.id].games = brawler.games;
                modePS.brawlers[brawler.id].wins = brawler.wins;
                modePS.brawlers[brawler.id].winsByTrophies =
                  brawler.winsByTrophies;
                modePS.brawlers[brawler.id].losses = brawler.losses;
                modePS.brawlers[brawler.id].lossesByTrophies =
                  brawler.lossesByTrophies;
                modePS.brawlers[brawler.id].starPlayer = brawler.starPlayer;
                modePS.brawlers[brawler.id].duration = brawler.duration;
              }
            });

            if (map.team) {
              map.team.map((team) => {
                if (modePS.teams[team.id]) {
                  modePS.teams[team.id].games += team.games;
                  modePS.teams[team.id].wins += team.wins;
                  modePS.teams[team.id].winsByTrophies += team.winsByTrophies;
                  modesPS.teams[team.id].losses += team.losses;
                  modesPS.teams[team.id].lossesByTrophies +=
                    team.lossesByTrophies;
                  modePS.teams[team.id].starPlayer += team.starPlayer;
                  modePS.teams[team.id].duration += team.duration;
                } else {
                  modePS.teams[team.id] = {};
                  modePS.teams[team.id].id = team.id;
                  modePS.teams[team.id].games = team.games;
                  modePS.teams[team.id].wins = team.wins;
                  modePS.teams[team.id].winsByTrophies = team.winsByTrophies;
                  modePS.teams[team.id].losses = team.losses;
                  modePS.teams[team.id].losses = team.lossesByTrophies;
                  modePS.teams[team.id].starPlayer = team.starPlayer;
                  modePS.teams[team.id].duration = team.duration;
                }
              });
            }
          } else {
            modePS = { maps: {}, brawlers: {}, teams: {} };
            modePS.maps[map.id] = {};
            modePS.maps[map.id].id = map.id;
            modePS.maps[map.id].mode = map.mode;
            modePS.maps[map.id].games = map.games;
            modePS.maps[map.id].wins = map.wins;
            modePS.maps[map.id].losses = map.losses;
            modePS.maps[map.id].winRatio = map.winRatio;
            modePS.maps[map.id].starPlayer = map.starPlayer;
            modePS.maps[map.id].duration = map.duration;

            Object.values(map.brawler).map((brawler) => {
              modePS.brawlers[brawler.id] = {};
              modePS.brawlers[brawler.id].id = brawler.id;
              modePS.brawlers[brawler.id].games = brawler.games;
              modePS.brawlers[brawler.id].wins = brawler.wins;
              modePS.brawlers[brawler.id].winsByTrophies =
                brawler.winsByTrophies;
              modePS.brawlers[brawler.id].losses = brawler.losses;
              modePS.brawlers[brawler.id].lossesByTrophies =
                brawler.lossesByTrophies;
              modePS.brawlers[brawler.id].starPlayer = brawler.starPlayer;
              modePS.brawlers[brawler.id].duration = brawler.duration;
            });

            if (map.team) {
              map.team.map((team) => {
                modePS.teams[team.id] = {};
                modePS.teams[team.id].id = team.id;
                modePS.teams[team.id].games = team.games;
                modePS.teams[team.id].wins = team.wins;
                modePS.teams[team.id].winsByTrophies = team.winsByTrophies;
                modePS.teams[team.id].losses = team.losses;
                modePS.teams[team.id].lossesByTrophies = team.lossesByTrophies;
                modePS.teams[team.id].starPlayer = team.starPlayer;
                modePS.teams[team.id].duration = team.duration;
              });
            }
          }
        }
      });

      Object.values(modePS.maps).map((map) => {
        maps.push({
          image: getMapImage(map.id),
          winRatio: map.winRatio,
          spRatio: map.starPlayer / map.games,
          duration: map.duration / map.games,
          wins: map.wins,
          losses: map.losses,
          title: getMapName(map.id),
          titleCamel: map.id, //yeah I know weird, but it is to be the same as for mode where its id is its name
          mode: getModeImage(map.mode),
        });
      });

      Object.values(modePS.brawlers).map((brawler) => {
        brawlers.push({
          //color: getBrawlerColor(brawler),
          image: getBrawlerImage(brawler.id),
          duration: brawler.duration / brawler.games,
          spRatio: brawler.starPlayer / brawler.games,
          winRatio:
            brawler.losses == 0
              ? brawler.wins
              : brawler.wins == 0
              ? -Math.abs(brawler.losses)
              : brawler.winsByTrophies / brawler.lossesByTrophies,
          wins: brawler.wins,
          losses: brawler.losses,
          title: getBrawlerName(brawler.id),
        });
      });

      if (modePS.teams) {
        Object.values(modePS.teams).map((team) => {
          teams.push({
            brawler1: getBrawlerImage(team.id.slice(0, 8)),
            brawler2: getBrawlerImage(team.id.slice(9, 17)),
            brawler3:
              team.id.slice(18, 26).length != 0
                ? getBrawlerImage(team.id.slice(18, 26))
                : null,
            duration: team.duration / team.games,
            spRatio: team.starPlayer / team.games,
            winRatio:
              team.losses == 0
                ? team.wins
                : team.wins == 0
                ? -Math.abs(team.losses)
                : team.winsByTrophies / team.lossesByTrophies,
            wins: team.wins,
            losses: team.losses,
            title: `${getBrawlerName(team.id.slice(0, 8))}, ${getBrawlerName(
              team.id.slice(9, 17)
            )}${
              team.id.slice(18, 26).length != 0
                ? " , " + getBrawlerName(team.id.slice(18, 26))
                : ""
            }`,
          });
        });
      }

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
        .slice(0, 30);

      teamsByWins = [...teams]
        .sort((a, b) => (a.wins > b.wins ? -1 : 1))
        .slice(0, 30);

      //this part is to add the modes stats into their arrays to be shown
    } else if (type == "map") {
      let chosenMap = playerStats[name];
      console.log(name, chosenMap);

      Object.values(chosenMap.brawler).map((brawler) => {
        brawlers.push({
          //color: getBrawlerColor(brawler),
          image: getBrawlerImage(brawler.id),
          duration: brawler.duration
            ? brawler.duration / brawler.games
            : undefined,
          spRatio: brawler.starPlayer
            ? brawler.starPlayer / brawler.games
            : undefined,
          winRatio: brawler.winRatio,
          wins: brawler.wins,
          losses: brawler.losses,
          title: getBrawlerName(brawler.id),
        });
      });
      if (chosenMap.team) {
        chosenMap.team.map((team) => {
          teams.push({
            brawler1: getBrawlerImage(team.id.slice(0, 8)),
            brawler2: getBrawlerImage(team.id.slice(9, 17)),
            brawler3:
              team.id.slice(18, 26).length != 0
                ? getBrawlerImage(team.id.slice(18, 26))
                : null,
            duration: team.duration / team.games,
            spRatio: team.starPlayer / team.games,
            winRatio: team.winRatio,
            wins: team.wins,
            losses: team.losses,
            title: `${getBrawlerName(team.id.slice(0, 8))}, ${getBrawlerName(
              team.id.slice(9, 17)
            )}${
              team.id.slice(18, 26).length != 0
                ? " , " + getBrawlerName(team.id.slice(18, 26))
                : ""
            }`,
          });
        });
      }
      console.log(teams);

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
