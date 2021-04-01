import * as firebase from "firebase";
import "firebase/auth";

import "firebase/firestore";

import 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyD3T-uzTrbs486u7bcbjqRjVJgTGUSOthQ",
  authDomain: "brawl-hub-6a708.firebaseapp.com",
  projectId: "brawl-hub-6a708",
  storageBucket: "brawl-hub-6a708.appspot.com",
  messagingSenderId: "913314223821",
  appId: "1:913314223821:web:6fab1ebf01fed2bc787b84",
  measurementId: "G-R8QTPRQ2HK",
  databaseURL:'https://brawl-hub-6a708-default-rtdb.firebaseio.com/'
};

firebase.initializeApp(firebaseConfig);

const fireStore = firebase.firestore();
const auth = firebase.auth();
const db = firebase.database()



export { db, auth,fireStore};
