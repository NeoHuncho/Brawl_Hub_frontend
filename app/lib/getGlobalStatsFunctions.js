import { store } from "../store/configureStore";

function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

const bestBrawlers = (type, modeName, mapID) => {
  let state = store.getState();
  let season = state.battleLogReducer.season;

  if (type == 0) type = "trophies";
  if (type == 1) type = "powerLeagueSolo";
  if (type == 2) type = "powerLeagueTeams";

  modeName = camelize(modeName);
  
  if (
    state.globalStatsReducer.globalStats[season][type][modeName][mapID]
      .performanceBrawlers
  ) {
    let data =
      state.globalStatsReducer.globalStats[season][type][modeName][mapID]
        .performanceBrawlers;
    //console.log(data);

    let performanceBrawlers = Object.keys(data).map((i) => data[i]);
    //console.log(performanceBrawlers);

    let brawlersSorted = performanceBrawlers
      .sort((a, b) => (a.points < b.points ? 1 : -1))
      .filter((x) => x.count >= 10);
    return brawlersSorted;
  }
};
const bestTeams = (type, modeName, mapID) => {
  let state = store.getState();
  let season = state.battleLogReducer.season;

  if (type == 0) type = "trophies";
  if (type == 1) type = "powerLeagueSolo";
  if (type == 2) type = "powerLeagueTeams";

  modeName = camelize(modeName);
  
  if (
    state.globalStatsReducer.globalStats[season][type][modeName][mapID]
      .performanceTeams
  ) {
    let data =
      state.globalStatsReducer.globalStats[season][type][modeName][mapID]
        .performanceTeams;
    //console.log(data);

    let performanceTeams = Object.keys(data).map((i) => data[i]);
    
    let teamsSorted = performanceTeams
    .sort((a, b) => (a.points < b.points ? 1 : -1))
    console.log(teamsSorted);
    return teamsSorted;
  }
};

const unsubscribe = store.subscribe(bestBrawlers, bestTeams);
unsubscribe();
export { bestBrawlers, bestTeams };
