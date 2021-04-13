import { combineReducers } from "redux";
import battleLogReducer from "./reducers/battleLogReducer";
import brawlifyReducer from "./reducers/brawlifyReducer";
import globalStatsReducer from './reducers/globalStatsReducer'
import uiReducerNoPersist from './reducers/uiReducerNoPersist'
import uiReducerPersist from './reducers/uiReducerPersist'

import playerPersistReducer from "./reducers/playerIdReducer";
const reducers = combineReducers({
  battleLogReducer: battleLogReducer,
  playerPersistReducer: playerPersistReducer,
  brawlifyReducer: brawlifyReducer,
  globalStatsReducer:globalStatsReducer,
  uiReducerNoPersist:uiReducerNoPersist,
  uiReducerPersist: uiReducerPersist

});

export default reducers;
