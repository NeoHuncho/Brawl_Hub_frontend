import { store } from "../store/configureStore";

function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

const getRanges = () => {
  let state = store.getState();
  let season = state.battleLogReducer.season;
  let ranges = [];
  let soloRanges = [];
  let teamRanges = [];

  ranges.push(
    Object.keys(state.globalStatsReducer.globalStats[season]["trophies"])
  );

  soloRanges.push(
    Object.keys(state.globalStatsReducer.globalStats[season]["powerLeagueSolo"])
  );

  teamRanges.push(
    Object.keys(state.globalStatsReducer.globalStats[season]["powerLeagueTeam"])
  );

  return [ranges, soloRanges, teamRanges];
};

const bestBrawlers = (type, range, modeName, mapID) => {
  let state = store.getState();
  let season = state.battleLogReducer.season;

  if (type == 0) type = "trophies";
  if (type == 1) type = "powerLeagueSolo";
  if (type == 2) type = "powerLeagueTeam";

  modeName = camelize(modeName);
  console.log(type, range, modeName, mapID);
  if (state.globalStatsReducer.globalStats[season][type][range]) {
    if (state.globalStatsReducer.globalStats[season][type][range][modeName]) {
      if (
        state.globalStatsReducer.globalStats[season][type][range][modeName][
          mapID
        ]
      ) {
        if (
          state.globalStatsReducer.globalStats[season][type][range][modeName][
            mapID
          ].performanceBrawlers
        ) {
          let data =
            state.globalStatsReducer.globalStats[season][type][range][modeName][
              mapID
            ].performanceBrawlers;
          console.log(data);

          let performanceBrawlers = Object.keys(data).map((i) => data[i]);
          console.log(performanceBrawlers);

          let brawlersSorted = performanceBrawlers
            .sort((a, b) => (a.points < b.points ? 1 : -1))
            .filter((x) => x.count >= 1);
          console.log(brawlersSorted);
          return brawlersSorted;
        }
      }
    }
  }
};

const bestTeams = (type, range, modeName, mapID) => {
  let state = store.getState();
  let season = state.battleLogReducer.season;

  if (type == 0) type = "trophies";
  if (type == 1) type = "powerLeagueSolo";
  if (type == 2) type = "powerLeagueTeam";

  modeName = camelize(modeName);

  if (state.globalStatsReducer.globalStats[season][type][range]) {
    if (state.globalStatsReducer.globalStats[season][type][range][modeName]) {
      if (
        state.globalStatsReducer.globalStats[season][type][range][modeName][
          mapID
        ]
      ) {
        if (
          state.globalStatsReducer.globalStats[season][type][range][modeName][
            mapID
          ].performanceTeams
        ) {
          let data =
            state.globalStatsReducer.globalStats[season][type][range][modeName][
              mapID
            ].performanceTeams;
          //console.log(data);

          let performanceTeams = Object.keys(data).map((i) => data[i]);

          let teamsSorted = performanceTeams
            .sort((a, b) => (a.points < b.points ? 1 : -1))
            .filter((x) => x.count >= 1);
          console.log(teamsSorted);
          return teamsSorted;
        }
      }
    }
  }
};

const unsubscribe = store.subscribe(bestBrawlers, bestTeams);
unsubscribe();
export { getRanges, bestBrawlers, bestTeams };
