import { combineReducers } from "redux";
import battleLogReducer from "./battleLogReducer";
import brawlifyReducer from "./brawlifyReducer";
import globalStatsReducer from './globalStatsReducer'
import uiReducerNoPersist from './uiReducerNoPersist'

import playerPersistReducer from "./playerIdReducer";
const reducers = combineReducers({
  battleLogReducer: battleLogReducer,
  playerPersistReducer: playerPersistReducer,
  brawlifyReducer: brawlifyReducer,
  globalStatsReducer:globalStatsReducer,
  uiReducerNoPersist:uiReducerNoPersist

});

export default reducers;
