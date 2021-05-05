import { db } from "../lib/initFirebase";
import axios from "axios";
import moment from "moment";

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

const writeLastLogin = async (userID) => {
  let playerRef = db.ref("playerStats/" + userID + "/generalStats/lastLogin");
  playerRef.set(moment().format("YYYY-MM-DD HH:mm"));
};

const writeError = async (userID, error) => {
  console.log(userID,error)
  let playerRef = db.ref("errors/"+userID);
  playerRef.set(error);
};

const getBrawlifyFromDB = async () => {
  const brawlify = await db
    .ref("global/brawlify")
    .once("value")
    .then((snapshot) => snapshot.val());

  const maps = brawlify["maps"];
  const brawlers = brawlify["brawlers"];
  const icons = brawlify["icons"]["player"];

  return { maps, brawlers, icons };
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
  const globalCount = await db
    .ref("global/count")
    .once("value")
    .then((snapshot) => snapshot.val());

  const rangesMinus = globalCount["ranges"];
  const rangesPLMinus = globalCount["rangesPL"];
  const nBrawlers = globalCount["totals"]["numberOfBrawlers"];
  const nGadgets = globalCount["totals"]["numberOfGadgets"];
  const nStarPowers = globalCount["totals"]["numberOfStarPowers"];
  const minBrawlerEvent = globalCount["minBrawlerEvent"];
  const minTeamEvent = globalCount["minTeamEvent"];
  const minBrawlerPL = globalCount["minBrawlerPL"];
  const minTeamPL = globalCount["minTeamPL"];
  const seasonGlobal = globalCount["seasonGlobal"];
  const slotNumActive = globalCount["slotNumActive"];
  const slotNumUpcoming = globalCount["slotNumUpcoming"];

  return {
    rangesMinus,
    rangesPLMinus,
    nBrawlers,
    nGadgets,
    nStarPowers,
    minBrawlerEvent,
    minTeamEvent,
    minBrawlerPL,
    minTeamPL,
    seasonGlobal,
    slotNumActive,
    slotNumUpcoming,
  };
};
const getGlobalStatsFromDB = async (season) => {
  const globalStats = await db
    .ref("global/globalStatsReduced/" + season)
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
  writeLastLogin,
  writeError
};