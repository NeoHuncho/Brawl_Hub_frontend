import {
  configureStore,
  applyMiddleware,
  getDefaultMiddleware,
} from "@reduxjs/toolkit"; // this tool allows for store to talk to redux dev tools & dispatch async actions

import { persistReducer, persistStore, createMigrate } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";
import { composeWithDevTools } from "redux-devtools-extension";
import reducers from "./reducers";

const migrations = {
  2: (state) => {
    return {
      ...state,
      uiReducerPersist: {
        ...state.uiReducerReducer,
        languages: undefined,
      },
    };
  },
};

const persistConfig = {
  // Root
  key: "root",
  version: 2,
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  //"playerPersistReducer",
  whitelist: ["uiReducerPersist", "playerPersistReducer"],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: [
    "battleLogReducer",
    "globalStatsReducer",
    "brawlifyReducer",
    "uiReducerNoPersist",
  ],
  // stateReconciler: "autoMergeLevel2",
  // migrate: createMigrate(migrations, { debug: true }),
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
