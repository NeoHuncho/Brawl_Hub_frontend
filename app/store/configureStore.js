import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"; // this tool allows for store to talk to redux dev tools & dispatch async actions
import battleLogReducer from './battleLog'

//getDefaultMiddleware imports redux-func
export default function () {
  return configureStore({
    reducer:battleLogReducer,
    middleware: [
      ...getDefaultMiddleware()
    ],
  });
}
