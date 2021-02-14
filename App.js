import React from 'react'

import { Provider } from "react-redux";


import api from "./app/store/middleware/api";
import configureStore from "./app/store/configureStore";
import PlayerLogin from "./app/view/PlayerLogin";

const store = configureStore();

export default function App() {


  return (
    <Provider store={store}>
      <PlayerLogin />
    </Provider>
  );
}
