//expo build:android -t apk
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { setTestDeviceIDAsync } from "expo-ads-admob";
import * as Progress from "react-native-progress";

import { getAssets } from "../lib/getAssetsFunctions";
import season6_1 from "../assets/backgrounds/season6_1.jpg";
import season6_2 from "../assets/backgrounds/season6_2.jpg";
import season6_3 from "../assets/backgrounds/season6_3.jpg";
import season5_1 from "../assets/backgrounds/season5_1.jpg";
import season5_2 from "../assets/backgrounds/season5_2.jpg";
import season5_3 from "../assets/backgrounds/season5_3.jpg";
import season4_1 from "../assets/backgrounds/season4_1.jpg";
import getEvents from "../lib/getBrawlifyEvents";

import {
  globalStatsReceived,
  globalCountsReceived,
} from "../store/reducers/globalStatsReducer";
import { brawlifyDataReceived } from "../store/reducers/brawlifyReducer";

import colors from "../config/colors";

import {
  getBrawlifyFromDB,
  getGlobalStatsFromDB,
  getGlobalNumbersFromDB,
  writeLastLogin,
} from "../store/apiDB";

import BottomBar from "../components/modules/BottomBar";

const backgrounds = [
  season6_1,
  season6_2,
  season6_3,
  season5_3,
  season5_2,
  season5_1,
  season4_1,
];
const randomBackgroundIndex = Math.floor(Math.random() * backgrounds.length);
export default function PlayerLogin() {
  const dispatch = useDispatch();
  const userID = useSelector((state) => state.playerPersistReducer.playerID);
  const saved = useSelector((state) => state.playerPersistReducer.saved);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    async function fetchMySavedData() {
      await setTestDeviceIDAsync("EMULATOR");
      setLoadingText("fetching Assets...");
      const { maps, brawlers, icons } = await getBrawlifyFromDB();
      dispatch(
        brawlifyDataReceived({
          brawlers: brawlers,
          maps: maps,
          icons: icons,
        })
      );
      setProgress(0.5);
      const {
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
      } = await getGlobalNumbersFromDB();
      setProgress(0.8);
      setLoadingText("fetching global stats. Hang in there!");
      dispatch(
        globalCountsReceived({
          ranges: ranges,
          nBrawlers: nBrawlers,
          nGadgets: nGadgets,
          nStarPowers: nStarPowers,
          minBrawlerEvent: minBrawlerEvent,
          minTeamEvent: minTeamEvent,
          minBrawlerPL: minBrawlerPL,
          minTeamPL: minTeamPL,
          seasonGlobal: seasonGlobal,
          slotNumActive: slotNumActive,
          slotNumUpcoming: slotNumUpcoming,
        })
      );
      if (saved == false) {
        await writeLastLogin(userID);
      }
      await getEvents();
      const globalStats = await getGlobalStatsFromDB(null, seasonGlobal,'global');
      // console.log('called')
      dispatch(globalStatsReceived(globalStats));
      getAssets();

      setProgress(1);
      setLoaded(true);
    }
    fetchMySavedData();
  }, [1]);

  return (
    <>
      {loaded == false && (
        <View style={styles.container}>
          <ImageBackground
            source={backgrounds[randomBackgroundIndex]}
            style={styles.imageBackground}
          >
            <Progress.Bar
              animated={true}
              progress={progress}
              height={10}
              width={300}
              style={{
                marginTop: 100,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
            <Text
              style={
                ([styles.findIdText],
                {
                  fontWeight: "bold",
                  color: colors.secondary,
                  fontSize: 14,
                  marginTop: 20,
                  marginLeft: "auto",
                  marginRight: "auto",
                })
              }
            >
              {loadingText}
            </Text>
          </ImageBackground>
        </View>
      )}

      {loaded == true && <BottomBar />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    justifyContent: "center",
  },

  inputContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  playerIdInput: {
    paddingLeft: 3,
    color: colors.secondary,
    fontFamily: "Lilita-One",
    fontSize: 15,
    height: 50,
    width: 340,
    borderColor: "white",
    borderWidth: 1,
  },
  imagesContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginTop: 20,
    width: 300,
    height: 170,
  },
});
