import { configureStore, applyMiddleware,getDefaultMiddleware } from "@reduxjs/toolkit"; // this tool allows for store to talk to redux dev tools & dispatch async actions

import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";

import reducers from "./reducers";

const persistConfig = {
  // Root
  key: "root",
  version: 0,
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: ["playerPersistReducer","brawlifyReducer"],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: ["battleLogReducer"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
//getDefaultMiddleware imports redux-func
let persistor = persistStore(store);

export { store, persistor };
