import { db, fireStore } from "../lib/initFirebase";
import axios from "axios";
import moment from "moment";
import cloneDeep from "lodash.clonedeep";
import { store } from "../store/configureStore";
import { camelize } from "../lib/getGlobalStatsFunctions";
import sizeOf from "object-sizeof";

const getStatsFirstLogin = async (userID) => {
  return new Promise(async function (resolve, reject) {
    await axios
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
        console.log(userID, error);
        if (error) {
          reject(error);
        }
      });
  });
};

const writeLastLogin = async (userID) => {
  console.log(2, userID);
  if (userID.length !== 0 && userID !== undefined && userID !== null)
    try {
      let playerRef = db.ref(`lastLogin/${userID}`);
      playerRef
        .set(moment().format("YYYY-MM-DD HH:mm"))
        .then(() => "nothingness");
      return;
    } catch (error) {
      console.log(error);
      return;
    }
};

const writeError = async (userID, error) => {
  if (userID.length === 0) {
 
    userID = Math.round(Math.random() * 10000).toString();
  }
  
  let playerRef = db.ref("errors/" + userID);
  playerRef.set(error).then(() => "nothingness");
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

const getStatsFromDB = async (userID, season) => {
  try {
    console.log("called db");
    let globalStats = {};
    const snapShot = await fireStore.collection(`S${season}_${userID}`).get();
    snapShot.docs.map((doc) => {
      const data = doc.data(); //Here is your content
      const id = doc.id; //Here is the key of your document
      globalStats[id] = data;
    });
    console.log(sizeOf(globalStats));
    return globalStats;
  } catch (error) {
    console.log("error in getStatsFromDB", error);
    return "error";
  }
};

const getGlobalNumbersFromDB = async () => {
  const globalCount = await db
    .ref("global/count")
    .once("value")
    .then((snapshot) => snapshot.val());

  const ranges = globalCount["ranges"];
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
    ranges,
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
const getGlobalStatsFromDB = async (
  gStats,
  season,
  scope,
  typeIndex,
  rangeName
) => {
  // console.log("called getDB", typeIndex, rangeName);

  try {
    let globalStats = {};
    gStats == null ? null : (globalStats = cloneDeep(gStats));

    let typeAndRangeNameFinder = (type, rangeTrophies, rangePL) => {
      let typeName = null;
      let rangeName = null;
      type == 0 ? (typeName = "trophies") : (typeName = "powerLeagueSolo");
      type == 1
        ? rangePL == 0
          ? (rangeName = "underGold")
          : rangePL == 1
          ? (rangeName = "gold")
          : rangePL == 2
          ? (rangeName = "diamond")
          : rangePL == 3
          ? (rangeName = "mythic")
          : rangePL == 4
          ? (rangeName = "legendary")
          : (rangePL = 5 ? (rangeName = "master") : null)
        : type == 0
        ? rangeTrophies == 0
          ? (rangeName = "under400")
          : rangeTrophies == 1
          ? (rangeName = "400-600")
          : rangeTrophies == 2
          ? (rangeName = "600-800")
          : rangeTrophies == 3
          ? (rangeName = "800-1000")
          : rangeTrophies == 4
          ? (rangeName = "1000-1200")
          : null
        : null;

      return { typeName: typeName, rangeNameFromFinder: rangeName };
    };
    let state = store.getState();
    const typeIndexPersist = state.uiReducerPersist.typeIndex;

    const trophiesRange = state.uiReducerPersist.trophiesRange;

    const plRange = state.uiReducerPersist.plRange;
    let eventsActive = state.brawlifyReducer.eventsList.active;
    let slotNumberActive = state.globalStatsReducer.slotNumberActive;
    let events = {};
    if (typeIndex == 0 || typeIndexPersist == 0) {
      for (const eventKey in eventsActive) {
        if (eventsActive[eventKey].slot.id <= slotNumberActive) {
          if (
            Math.sign(
              moment.duration(
                moment(eventsActive[eventKey].endTime).diff(moment.now())
              )
            ) == 1
          ) {
            events[camelize(eventsActive[eventKey].map.gameMode.name)] =
              eventsActive[eventKey].map.id;
          }
        }
      }
    }
    // console.log(events);
    let type = null;
    let range = null;

    let { typeName, rangeNameFromFinder } = typeAndRangeNameFinder(
      typeIndex == undefined ? typeIndexPersist : typeIndex,
      trophiesRange,
      plRange
    );

    type = typeName;
    if (rangeName == undefined) {
      range = rangeNameFromFinder;
    } else {
      range = rangeName;
    }

    if (scope == "global") {
      if (globalStats[type]) {
        // console.log("called no firebases1");
        if (globalStats[type][range]) {
          // console.log("called no firebases2");
          return globalStats;
        }
      }
      await fireStore
        .collection(`eventsPageBR_TM`)
        .doc(`S${season}_${type}_${range}`)
        .get()
        .then((doc) => {
          if (!globalStats[type]) globalStats[type] = {};
          globalStats[type][range] = doc.data();
        });
    } else {
      // console.log("called firebases");
      // console.log(season, type, scope, range);
      await fireStore
        .collection(
          `S${season}_${type == "trophies" ? "Trophies" : "PL"}_Events`
        )
        .doc(`${scope[1]}_${range}`)
        .get()
        .then((doc) => {
          let data = doc.data();
          if (data["performanceBrawlers"])
            globalStats[type][range][scope[0]][parseInt(scope[1])][
              "performanceBrawlers"
            ] = data["performanceBrawlers"];
          if (data["performanceTeams"])
            globalStats[type][range][scope[0]][parseInt(scope[1])][
              "performanceTeams"
            ] = data["performanceTeams"];
        });
    }

    // console.log("final boss", globalStats[type][range]);
    return globalStats;
  } catch (error) {
    console.log(error);
  }
};

export {
  getStatsFirstLogin,
  getBrawlifyFromDB,
  getStatsFromDB,
  getGlobalNumbersFromDB,
  getGlobalStatsFromDB,
  writeLastLogin,
  writeError,
};
const unsubscribe = store.subscribe(getGlobalStatsFromDB);
unsubscribe();
