import * as firebase from "firebase";
import "firebase/auth";

import "firebase/firestore";

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

const db = firebase.firestore();
const auth = firebase.auth();


export { db, auth };
