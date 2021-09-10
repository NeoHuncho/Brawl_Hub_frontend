import React, { useEffect } from "react";

// import { connectAsync } from "expo-in-app-purchases";
import { Provider } from "react-redux";
import { useFonts } from "expo-font";
import { PersistGate } from "redux-persist/integration/react";
import { prepareAdsFirstTime } from "./app/config/ads";
import * as Sentry from "sentry-expo";

import { store, persistor } from "./app/store/configureStore";

import AppLoading from "./app/view/AppLoading";
import LoadingPage from "./app/view/LoadingPage";

export default function App() {
  // Sentry.init({
  //   dsn: "https://8be72791283542849cfed8ac185757f2@o963279.ingest.sentry.io/5911505",
  //   enableInExpoDevelopment: true,
  //   debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
  // });
  useEffect(() => {
    prepareAdsFirstTime();
  }, []);

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
