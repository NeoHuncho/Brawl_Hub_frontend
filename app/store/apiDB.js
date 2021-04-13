import { db } from "../lib/initFirebase";
import axios from "axios";

const getStatsFirstLogin = async (userID) => {
  return new Promise(function (resolve, reject) {
    axios
      .post(
        "http://europe-west1-brawl-hub-6a708.cloudfunctions.net/getPlayerBPandStats",
        {
          playerID: userID,
        }
      )
      .then((response) => {
        // console.log(response);
        resolve("all good");
      })
      .catch(function (error) {
        if (error) {
          reject(error);
        }
      });
  });
};

const getBrawlifyFromDB = async () => {
  const maps = await db
    .ref("global/brawlify/maps")
    .once("value")
    .then((snapshot) => snapshot.val());
  const brawlers = await db
    .ref("global/brawlify/brawlers")
    .once("value")
    .then((snapshot) => snapshot.val());
  const events = await db
    .ref("global/brawlify/events")
    .once("value")
    .then((snapshot) => snapshot.val());
  const icons = await db
    .ref("global/brawlify/icons/player")
    .once("value")
    .then((snapshot) => snapshot.val());

  return { maps, brawlers, events, icons };
};

const getStatsFromDB = async (userID) => {
  let playerRef = db.ref("playerStats/" + userID);
  let stats = undefined;
  await playerRef.once("value", (data) => {
    stats = data.val();
  });
  return stats;
};

const getGlobalNumbersFromDB = async () => {
  const nBrawlers = await db
    .ref("global/count/numberOfBrawlers")
    .once("value")
    .then((snapshot) => snapshot.val());
  const nGadgets = await db
    .ref("global/count/numberOfGadgets")
    .once("value")
    .then((snapshot) => snapshot.val());
  const nStarPowers = await db
    .ref("global/count/numberOfStarPowers")
    .once("value")
    .then((snapshot) => snapshot.val());

  return { nBrawlers, nGadgets, nStarPowers};
};
const getGlobalStatsFromDB = async () => {
  const globalStats = await db
    .ref("global/globalStats/6")
    .once("value")
    .then((snapshot) => snapshot.val());

  return globalStats;
};

export {
  getStatsFirstLogin,
  getBrawlifyFromDB,
  getStatsFromDB,
  getGlobalNumbersFromDB,
  getGlobalStatsFromDB,
};
