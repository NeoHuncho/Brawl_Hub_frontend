import {combineReducers} from "redux"; 
import battleLogReducer from "./battleLogReducer";
import playerPersistReducer from "./playerIdReducer";
const reducers = combineReducers({
  battleLogReducer: battleLogReducer,
  playerPersistReducer: playerPersistReducer,
});

export default reducers;
