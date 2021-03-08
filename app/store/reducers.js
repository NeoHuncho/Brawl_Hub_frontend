import { combineReducers } from "redux";
import battleLogReducer from "./battleLogReducer";
import brawlifyReducer from "./brawlifyReducer";
import playerPersistReducer from "./playerIdReducer";
const reducers = combineReducers({
  battleLogReducer: battleLogReducer,
  playerPersistReducer: playerPersistReducer,
  brawlifyReducer: brawlifyReducer,
});

export default reducers;
