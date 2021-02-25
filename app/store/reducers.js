import {combineReducers} from "redux"; 
import battleLogReducer from "./battleLogReducer";
import playerIdReducer from "./playerIdReducer";
const reducers = combineReducers({
  battleLogReducer: battleLogReducer,
  playerIdReducer: playerIdReducer,
});

export default reducers;
