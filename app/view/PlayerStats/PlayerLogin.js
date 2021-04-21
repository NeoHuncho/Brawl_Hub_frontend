//expo build:android -t apk
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Button,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { setTestDeviceIDAsync } from "expo-ads-admob";
import * as Progress from "react-native-progress";

import season6_1 from "../../assets/backgrounds/season6_1.jpg";
import season6_2 from "../../assets/backgrounds/season6_2.jpg";
import season6_3 from "../../assets/backgrounds/season6_3.jpg";
import season5_1 from "../../assets/backgrounds/season5_1.jpg";
import season5_2 from "../../assets/backgrounds/season5_2.jpg";
import season5_3 from "../../assets/backgrounds/season5_3.jpg";
import season4_1 from "../../assets/backgrounds/season4_1.jpg";
import { receivedPlayerStatsFromDB } from "../../store/reducers/battleLogReducer";
import { userIdReceived } from "../../store/reducers/playerIdReducer";
import { brawlifyDataReceived } from "../../store/reducers/brawlifyReducer";
import getEvents from "../../lib/getBrawlifyEvents";

import {
  globalCountsReceived,
  globalStatsReceived,
} from "../../store/reducers/globalStatsReducer";

import colors from "../../config/colors";

import imageBackground from "../../assets/background-login.jpg";

import {
  getBrawlifyFromDB,
  getGlobalStatsFromDB,
  getGlobalNumbersFromDB,
  getStatsFirstLogin,
  getStatsFromDB,
} from "../../store/apiDB";

import BottomBar from "../../components/modules/BottomBar";

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
  const playerID = useSelector((state) => state.playerPersistReducer.playerID);
  const saved = useSelector((state) => state.playerPersistReducer.saved);

  const [userId, setUserId] = useState(); //8LP0P8LVC
  const [validId, setValidId] = useState(false);
  const [howToClicked, setHowToClicked] = useState(false);
  const [confirmClicked, setConfirmClicked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");

  const [message, setMessage] = useState(
    "Please provide your Brawl Stars player ID"
  );
  const handleHowToClicked = () => {
    if (howToClicked == false) {
      setHowToClicked(true);
    } else if (howToClicked == true) {
      setHowToClicked(false);
    }
  };

  useEffect(() => {
    {
      if (saved === true) {
        setUserId(playerID);
        async function fetchMySavedData() {
          if (userId) {
            await setTestDeviceIDAsync("EMULATOR");
            setLoadingText("fetching your stats...");
            const stats = await getStatsFromDB(userId);
            dispatch(receivedPlayerStatsFromDB(stats));
            setProgress(0.5);
            const { maps, brawlers, icons } = await getBrawlifyFromDB();
            setProgress(0.8);
            setLoadingText("fetching global stats. Hang in there!");

            const {
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

            dispatch(
              brawlifyDataReceived({
                brawlers: brawlers,
                maps: maps,
                icons: icons,
              })
            );
            dispatch(
              globalCountsReceived({
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
            setProgress(1);
            setValidId(true);
            await getEvents();
            const globalStats = await getGlobalStatsFromDB(seasonGlobal);
            dispatch(globalStatsReceived(globalStats));
          }
        }
        fetchMySavedData();
      }

      if (
        saved !== true &&
        !validId &&
        userId &&
        userId.length >= 4 &&
        confirmClicked === true
      ) {
        async function fetchMyDataFirstTime() {
          try {
            let checkDBStats = await getStatsFromDB(userId);
            setProgress(0.2);
            setLoadingText("fetching your stats...");
            if (checkDBStats == null) {
              await getStatsFirstLogin(userId);
              let statsFromDB = await getStatsFromDB(userId);
              // console.log(statsFromDB)
              dispatch(receivedPlayerStatsFromDB(statsFromDB));
              setProgress(0.5);
            } else {
              dispatch(receivedPlayerStatsFromDB(checkDBStats));
              setProgress(0.5);
            }

            const { maps, brawlers, icons } = await getBrawlifyFromDB();
            setProgress(0.65);
            setLoadingText("fetching global stats. Hang in there!");
            const {
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

            dispatch(
              brawlifyDataReceived({
                brawlers: brawlers,
                maps: maps,
                icons: icons,
              })
            );
            dispatch(
              globalCountsReceived({
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
            setProgress(1);
            dispatch(userIdReceived(userId));
            setValidId(true);
            await getEvents();
            const globalStats = await getGlobalStatsFromDB(seasonGlobal);
            dispatch(globalStatsReceived(globalStats));
          } catch (error) {
            if (error.response) {
              if (error.response.status == 404) {
                setConfirmClicked(false);
                setMessage("Invalid player ID. Please try Again!");
              } else {
                console.log(error.response.status);
                setMessage(
                  "Invalid player ID or Supercell is doing maintenance!"
                );
              }
            } else {
              console.log(error);
            }
          }
        }
        // console.log("apiHeroku called in player login component!");

        fetchMyDataFirstTime();
      }
    }
  }, [userId, confirmClicked]);

  return (
    <>
      {!validId && saved !== true && confirmClicked == false && (
        <View style={styles.container}>
          <ImageBackground
            source={imageBackground}
            style={styles.imageBackground}
            blurRadius={2}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.provideIdText}>{message}</Text>

              <TextInput
                type="flat"
                underlineColor={colors.background}
                selectionColor={colors.background}
                autoCapitalize="characters"
                style={styles.playerIdInput}
                onChangeText={(userId) => {
                  setUserId(userId.toUpperCase());
                  setMessage("Please provide your Brawl Stars player ID");
                }}
              />
              <Button title="Confirm" onPress={() => setConfirmClicked(true)} />
              <Text style={[styles.findIdText, { marginTop: 20 }]}>
                There will NEVER be the LETTER O in your tag!
              </Text>
              <Text style={[styles.findIdText, { marginTop: 0 }]}>
                It will ALWAYS be the NUMBER 0
              </Text>
            </View>

            <View style={styles.imagesContainer}>
              <TouchableOpacity onPress={() => handleHowToClicked()}>
                <Text style={[styles.findIdText,{fontSize:18}]}>Click how to find Player ID</Text>
              </TouchableOpacity>
              {howToClicked && (
                <>
                  <Image
                    style={styles.image}
                    source={require("../../assets/playerLoginImages/brawlStarsmainPage.png")}
                  />
                  <Image
                    style={styles.image}
                    source={require("../../assets/playerLoginImages/brawlStarsProfilePage.png")}
                  />
                </>
              )}
            </View>
          </ImageBackground>
        </View>
      )}
      {(saved === true || confirmClicked == true) && !validId && (
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
                  fontFamily: "Lilita-One",
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

      {validId && <BottomBar />}
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
  provideIdText: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 17,
    fontFamily: "Lilita-One",
    color: colors.primary,
  },
  findIdText: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Lilita-One",
    color: colors.secondary,
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
