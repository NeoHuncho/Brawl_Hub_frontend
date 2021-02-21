//8LPOP8LVC
import React from "react";

import { Provider } from "react-redux";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";

import configureStore from "./app/store/configureStore";
import PlayerLogin from "./app/view/PlayerLogin";
import store from './app/store/configureStore'


export default function App() {
  let [fontsLoaded] = useFonts({
    "Lilita-One": require("./app/assets/fonts/LilitaOne-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <Provider store={store}>
        <PlayerLogin />
      </Provider>
    );
  }
}
