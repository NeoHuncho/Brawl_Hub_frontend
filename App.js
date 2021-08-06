import React from "react";

// import { connectAsync } from "expo-in-app-purchases";
import { Provider } from "react-redux";
import { useFonts } from "expo-font";
import { PersistGate } from "redux-persist/integration/react";
import {
  prepareAdsFirstTime,
  showImageInterstitial,
  showVideoInterstitial,
} from "./app/config/ads";

import { store, persistor } from "./app/store/configureStore";

import AppLoading from "./app/view/AppLoading";
import LoadingPage from "./app/view/LoadingPage";

export default function App() {
  prepareAdsFirstTime();
  
  let [fontsLoaded] = useFonts({
    "Lilita-One": require("./app/assets/fonts/LilitaOne-Regular.ttf"),
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppLoading />
      </PersistGate>
    </Provider>
  );
}
