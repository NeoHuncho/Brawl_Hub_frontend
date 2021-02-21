import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"; // this tool allows for store to talk to redux dev tools & dispatch async actions
import battleLogReducer from './battleLogReducer'

const store = configureStore({ reducer: battleLogReducer })
//getDefaultMiddleware imports redux-func

export default store;
