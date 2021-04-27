//8LPOP8LVC
import React from "react";

import { Provider } from "react-redux";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { PersistGate } from "redux-persist/integration/react";



import { store, persistor } from "./app/store/configureStore";

import BottomBar from './app/components/modules/BottomBar'
import PlayerLogin from "./app/view/PlayerStats/PlayerLogin";



export default function App() {
  let [fontsLoaded] = useFonts({
    "Lilita-One": require("./app/assets/fonts/LilitaOne-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        
          <PlayerLogin/>
        </PersistGate>
      </Provider>
    );
  }
}
