//expo build:android -t apk
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import { getDeviceTypeAsync } from "expo-device";
import { useDispatch, useSelector } from "react-redux";
import { setTestDeviceIDAsync } from "expo-ads-admob";
import * as Progress from "react-native-progress";
import { auth } from "../lib/initFirebase";
import { AdMobInterstitial } from "expo-ads-admob";

import { videoAdID } from "../config/ads";
import { getAssets } from "../lib/getAssetsFunctions";
import season7_1 from "../assets/backgrounds/season7_1.jpg";
import season7_2 from "../assets/backgrounds/season7_2.jpg";
import season7_3 from "../assets/backgrounds/season7_3.jpg";
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

import { deviceTypeReceived } from "../store/reducers/uiReducerNoPersist";
import {
  brawlifyDataReceived,
  eventsReceived,
} from "../store/reducers/brawlifyReducer";

import colors from "../config/colors";

import getBrawlify from "../lib/getBrawlify";
import {
  getGlobalStatsFromDB,
  getSwitchesFromDB,
  writeLastLogin,
} from "../lib/apiDB";

import BottomBar from "../components/modules/BottomBar";

const backgrounds = [
  season7_1,
  season7_2,
  season7_3,
  season6_1,
  season6_2,
  season6_3,
  season5_3,
  season5_2,
  season5_1,
  season4_1,
];
let deviceType = null;
const getDevice = async () => {
  let deviceTypeIndex = await getDeviceTypeAsync();
  deviceTypeIndex == 2 ? (deviceType = "tablet") : (deviceType = "phone");
};
getDevice();
const randomBackgroundIndex = Math.floor(Math.random() * backgrounds.length);
export default function PlayerLogin() {
  auth.signInAnonymously();
  // console.log(deviceType);
  const dispatch = useDispatch();
  const userID = useSelector((state) => state.playerPersistReducer.playerID);
  const name = useSelector((state) => state.playerPersistReducer.playerName);

  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    async function fetchMySavedData() {
      // await setTestDeviceIDAsync("EMULATOR");
      try {
      } catch (error) {}
      setLoadingText("fetching Assets...");

      const { maps, brawlers } = await getBrawlify();
      dispatch(deviceTypeReceived(deviceType));
      dispatch(
        brawlifyDataReceived({
          brawlers: brawlers,
          maps: maps,
        })
      );
      setProgress(0.5);
      const switches = await getSwitchesFromDB();
      setProgress(0.8);
      setLoadingText("fetching global stats. Hang in there!");
      dispatch(
        globalCountsReceived({
          switches,
        })
      );
      if (userID != null) {
        // console.log(1, userID);
        await writeLastLogin(userID);
      }
     await getEvents();

      const globalStats = await getGlobalStatsFromDB(
        null,
        switches.seasonStats,
        "global"
      );
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
            <View>
              <Progress.Bar
                animated={true}
                progress={progress}
                height={deviceType == "tablet" ? 20 : 10}
                width={deviceType == "tablet" ? 600 : 300}
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
                    fontSize: deviceType == "tablet" ? 22 : 14,
                    marginTop: 20,
                    marginLeft: "auto",
                    marginRight: "auto",
                  })
                }
              >
                {loadingText}
              </Text>
            </View>

            {userID != null &&
              name !== undefined &&
              userID.length !== 0 &&
              name.length !== 0 && (
                <View style={{ flex: 0.2, justifyContent: "flex-end" }}>
                  <Text
                    style={
                      ([styles.findIdText],
                      {
                        fontWeight: "bold",
                        color: colors.secondary,
                        fontSize: deviceType == "tablet" ? 22 : 14,
                        marginTop: 160,
                        marginLeft: "auto",
                        marginRight: "auto",
                        textAlign: "center",
                      })
                    }
                  >
                    logged in as:
                  </Text>
                  <Text
                    style={
                      ([styles.findIdText],
                      {
                        fontWeight: "bold",
                        color: colors.secondary,
                        fontSize: deviceType == "tablet" ? 28 : 18,
                        marginTop: 10,
                        marginLeft: "auto",
                        marginRight: "auto",
                        textAlign: "center",
                      })
                    }
                  >
                    {name}
                  </Text>
                </View>
              )}
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
