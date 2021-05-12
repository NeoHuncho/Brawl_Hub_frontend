import { store } from "../store/configureStore";

function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

const bestBrawlers = (type, range, modeName, mapID) => {
  let state = store.getState();


  if (type == 0) type = "trophies";
  if (type == 1) type = "powerLeagueSolo";

  modeName = camelize(modeName);
  // console.log("look here 2", type, range);
  if (state.globalStatsReducer.globalStats[type][range]) {
    if (state.globalStatsReducer.globalStats[type][range][modeName]) {
      if (state.globalStatsReducer.globalStats[type][range][modeName][mapID]) {
        if (
          state.globalStatsReducer.globalStats[type][range][modeName][mapID]
            .performanceBrawlers
        ) {
          let data =
            state.globalStatsReducer.globalStats[type][range][modeName][mapID]
              .performanceBrawlers;
          // console.log(data);

          let performanceBrawlers = Object.keys(data).map((i) => data[i]);
          // console.log(performanceBrawlers);

          // console.log(brawlersSorted);
          return performanceBrawlers;
        }
      }
    }
  }
};

const bestTeams = (type, range, modeName, mapID) => {
  // console.log("look here 3", type, range);
  let state = store.getState();
  


  if (type == 0) type = "trophies";
  if (type == 1) type = "powerLeagueSolo";

  modeName = camelize(modeName);

  if (state.globalStatsReducer.globalStats[type][range]) {
    if (state.globalStatsReducer.globalStats[type][range][modeName]) {
      if (state.globalStatsReducer.globalStats[type][range][modeName][mapID]) {
        if (
          state.globalStatsReducer.globalStats[type][range][modeName][mapID]
            .performanceTeams
        ) {
          let data =
            state.globalStatsReducer.globalStats[type][range][modeName][mapID]
              .performanceTeams;
          //console.log(data);

          let performanceTeams = Object.keys(data).map((i) => data[i]);

          // console.log(teamsSorted);
          return performanceTeams;
        }
      }
    }
  }
};

const unsubscribe = store.subscribe(bestBrawlers, bestTeams);
unsubscribe();
export { bestBrawlers, bestTeams, camelize };
