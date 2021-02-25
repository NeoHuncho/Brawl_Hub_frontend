//8LPOP8LVC
import React from "react";

import { Provider } from "react-redux";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { PersistGate } from "redux-persist/integration/react";
import * as firebase from "firebase";

import { store, persistor } from "./app/store/configureStore";
import PlayerLogin from "./app/view/PlayerLogin";

const firebaseConfig = {
  apiKey: "AIzaSyD3T-uzTrbs486u7bcbjqRjVJgTGUSOthQ",
  authDomain: "brawl-hub-6a708.firebaseapp.com",
  projectId: "brawl-hub-6a708",
  storageBucket: "brawl-hub-6a708.appspot.com",
  messagingSenderId: "913314223821",
  appId: "1:913314223821:web:6fab1ebf01fed2bc787b84",
  measurementId: "G-R8QTPRQ2HK",
};

firebase.initializeApp(firebaseConfig);

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
