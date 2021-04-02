import { combineReducers } from "redux";
import battleLogReducer from "./battleLogReducer";
import brawlifyReducer from "./brawlifyReducer";
import globalStatsReducer from './globalStatsReducer'

import playerPersistReducer from "./playerIdReducer";
const reducers = combineReducers({
  battleLogReducer: battleLogReducer,
  playerPersistReducer: playerPersistReducer,
  brawlifyReducer: brawlifyReducer,
  globalStatsReducer:globalStatsReducer

});

export default reducers;
