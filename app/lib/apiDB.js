import { db, fireStore } from "./initFirebase";
import axios from "axios";
import moment from "moment";
import cloneDeep from "lodash.clonedeep";
import { store } from "../store/configureStore";
import sizeOf from "object-sizeof";
import { getBrawlifyTranslations } from "./getBrawlify";

const getStatsFirstLogin = async (userID) => {
  return new Promise(async function (resolve, reject) {
    await axios
      .post(
        "https://europe-west1-brawl-hub-6a708.cloudfunctions.net/getPlayerBPandStats-1",
        {
          playerID: userID,
        }
      )
      .then((returnedPlayerStats) => {
        // console.log(returnedPlayerStats);
        resolve(returnedPlayerStats.data);
      })
      .catch(function (error) {
        console.log(userID, error);
        reject(error);
      });
  });
};

const writeLastLogin = async (userID) => {
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

const getStatsFromDB = async (userID, season) => {
  try {
    // console.log("called db");
    let globalStats = {};
    let snapShot = null;
    snapShot = await fireStore.collection(`S${season}_${userID}`).get();

    snapShot.docs.map((doc) => {
      const data = doc.data(); //Here is your content
      const id = doc.id; //Here is the key of your document
      globalStats[id] = data;
    });
    // console.log(sizeOf(globalStats));
    return globalStats;
  } catch (error) {
    console.log("error in getStatsFromDB", error);
    return "error";
  }
};

const setStats = (playerID, season, stats) => {
  fireStore
    .collection(`S${season}_${playerID}`)
    .doc("brawlers")
    .set(stats.brawlers)
    .then(() => {
      fireStore
        .collection(`S${season}_${playerID}`)
        .doc("teams")
        .set(stats.teams)
        .then(() => {
          fireStore
            .collection(`S${season}_${playerID}`)
            .doc("globalStats")
            .set(stats.globalStats)
            .then(() => {
              for (const [key, value] of Object.entries(stats)) {
                if (key.includes("maps")) {
                  fireStore
                    .collection(`S${season}_${playerID}`)
                    .doc(key)
                    .set(value)
                    .then(() => {});
                }
              }
            });
        });
    });
};

const getSwitchesFromDB = async () => {
  const globalSwitches = await (
    await fireStore.collection("Commands").doc("Switches").get()
  ).data();

  return globalSwitches;
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
    let state = store.getState();
    let ranges = state.globalStatsReducer.ranges;
    let typeAndRangeNameFinder = (type, rangeTrophies, rangePL) => {
      let typeName = null;
      let rangeName = null;
      type == 0 ? (typeName = "trophies") : (typeName = "powerLeagueSolo");
      type == 1
        ? (rangeName = ranges["powerLeague"][rangePL])
        : type == 0
        ? (rangeName = ranges["trophies"][rangeTrophies])
        : null;

      return { typeName: typeName, rangeNameFromFinder: rangeName };
    };
    const typeIndexPersist = state.uiReducerPersist.typeIndex;

    const trophiesRange = state.uiReducerPersist.trophiesRange;

    const plRange = state.uiReducerPersist.plRange;

    if (typeIndex == 0 || typeIndexPersist == 0) {
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

const getStarGadgetVotesFromDB = async (season, mapID, rangeName) => {
  console.log(season, mapID, rangeName);
  let votes = await fireStore
    .collection(`season${season}_starPowers_gadgets_votes`)
    .doc(`${mapID}_${rangeName}`)
    .get();
  // console.log(332, votes.data());
  return votes.data();
};

const getTranslations = async (language) => {
  if (language !== undefined && language !== "en") {
    const brawlifyTranslations = await getBrawlifyTranslations(language);
    let translationsDB = await db
      .ref(`translations/${language}`)
      .once("value")
      .then((snapshot) => snapshot.val());
    // console.log(22, language, brawlifyTranslations);
    // console.log(23333, translationsDB);
    return { ...translationsDB, ...brawlifyTranslations };
  } else {
    return undefined;
  }
};

const getTranslation = (phrase, key) => {
  try {
    let state = store.getState();
    const translations = state.uiReducerNoPersist.translations;
    const languages = state.uiReducerNoPersist.languages;
    const language = state.uiReducerPersist.language;
    // console.log("hello1", language, languages[language]);
    if (
      language !== undefined &&
      Object.values(languages).includes(language) !== false &&
      language != "en"
    ) {
      if (phrase == "Top 3 Brawlers") {
        return translations["stats_links_top_brawlers"];
      } else if (phrase === "Events") {
        return translations["event_name"];
      } else if (phrase === "Power League") {
        return translations["navigation_menu_league_short"] == undefined
          ? translations["navigation_menu_league"] == undefined
            ? "Power League"
            : translations["navigation_menu_league"]
          : translations["navigation_menu_league_short"];
      } else if (phrase === "Default Category:") {
        return `${translations["Default"]} ${translations["Range"]}:`;
      } else if (phrase === "Default Event Range:") {
        return `${translations["Default"]} ${translations["event_name"]} ${translations["Range"]}:`;
      } else if (phrase === "Default Power League Range:") {
        return `${translations["Default"]} ${translations["navigation_menu_league"]} ${translations["Range"]}:`;
      } else if (phrase === "rangesDisplay") {
        return translations["rangesDisplay"];
      } else {
        if (key !== undefined) {
          return translations[key];
        } else if (
          translations[
            phrase.includes(".") ? phrase.replace(/\./g, "@") : phrase
          ] !== undefined
        ) {
          return translations[
            phrase.includes(".") ? phrase.replace(/\./g, "@") : phrase
          ];
        } else return phrase;
      }
    } else {
      return phrase;
    }
  } catch (error) {
    console.log(error, "in translation");
    return phrase;
  }
};

export {
  getStatsFirstLogin,
  getStatsFromDB,
  getSwitchesFromDB,
  getGlobalStatsFromDB,
  writeLastLogin,
  writeError,
  setStats,
  getTranslations,
  getTranslation,
  getStarGadgetVotesFromDB,
};
const unsubscribe = store.subscribe(getGlobalStatsFromDB, getTranslation);
unsubscribe();
