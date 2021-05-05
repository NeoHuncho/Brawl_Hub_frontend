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

import { receivedPlayerStatsFromDB } from "../../store/reducers/battleLogReducer";
import { userIdReceived } from "../../store/reducers/playerIdReducer";

import colors from "../../config/colors";

import imageBackground from "../../assets/background-login.jpg";

import {
  getStatsFirstLogin,
  getStatsFromDB,
  writeLastLogin,
} from "../../store/apiDB";

import PlayerStats from "./PlayerStats";

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
            setLoadingText("fetching Your Stavts...");
            setProgress(0.5);
            setProgress(0.8);
            const stats = await getStatsFromDB(userId);
            await dispatch(receivedPlayerStatsFromDB(stats));
            setProgress(1);
            setValidId(true);
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
            setProgress(0.2);
            setLoadingText("fetching your stats...");
            setProgress(0.5);
            let checkDBStats = await getStatsFromDB(userId);
            if (checkDBStats == null) {
              await getStatsFirstLogin(userId);
              let statsFromDB = await getStatsFromDB(userId);
            //  console.log(statsFromDB.battleLog)
              if (statsFromDB.battleLog==undefined) {
                await new Promise((r) => setTimeout(r, 1000));
                setLoadingText(
                  `fetching your stats... 
                  This process be much faster after your first login!`
                );
                statsFromDB = await getStatsFromDB(userId);
                if (statsFromDB.battleLog==undefined) {
                  await new Promise((r) => setTimeout(r, 2000));
                  statsFromDB = await getStatsFromDB(userId);
                }
              }
              setLoadingText("fetching your stats... Hang in there!");
              setProgress(0.8);
              dispatch(receivedPlayerStatsFromDB(statsFromDB));
              await writeLastLogin(userId);
            } else {
              setLoadingText("fetching your stats... Hang in there!");
              setProgress(0.8);
              dispatch(receivedPlayerStatsFromDB(checkDBStats));
            }

            dispatch(userIdReceived(userId));
            setProgress(1);
            setValidId(true);
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
            blurRadius={20}
          >
            <View style={{ marginBottom: 40 }}>
              <Text
                style={[
                  styles.provideIdText,
                  { fontSize: 30, color: colors.secondary },
                ]}
              >
                View your own stats!
              </Text>
              <Text
                style={[
                  styles.provideIdText,
                  { fontSize: 20, color: colors.secondary },
                ]}
              >
                (and get them updated & saved daily)
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.provideIdText}>{message}</Text>

              <TextInput
                onClick={console.log("hello")}
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

              <View style={{ marginTop: 5 }}>
                <Button
                  title="Confirm"
                  onPress={() => setConfirmClicked(true)}
                />
              </View>
              <Text style={[styles.findIdText, { marginTop: 20 }]}>
                There will NEVER be the LETTER O in your tag!
              </Text>
              <Text style={[styles.findIdText, { marginTop: 0 }]}>
                It will ALWAYS be the NUMBER 0
              </Text>
            </View>

            <View style={styles.imagesContainer}>
              <TouchableOpacity onPress={() => handleHowToClicked()}>
                <Text style={[styles.findIdText, { fontSize: 18 }]}>
                  Click how to find Player ID
                </Text>
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
            source={imageBackground}
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

      {validId && <PlayerStats />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    justifyContent: "center",
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
