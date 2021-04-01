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

import {
  battleLogAndPlayerReceived,
  processedPlayerStats,
  receivedPlayerStatsFromDB,
  compiledPlayerStats,
} from "../../store/battleLogReducer";
import { userIdReceived } from "../../store/playerIdReducer";
import {
  mapsReceived,
  brawlersReceived,
  eventsReceived,
  iconsReceived,
} from "../../store/brawlifyReducer";

import PlayerStats from "./PlayerStats.js";
import colors from "../../config/colors";
import { playerInfoWrite } from "../../lib/writer";
import imageBackground from "../../assets/background-login.jpg";

import {
  getBrawlifyFromDB,
  getGlobalStatsFromDB,
  getStatsFirstLogin,
  getStatsFromDB,
} from "../../store/apiDB";

import moment from "moment";
import BottomBar from "../../components/modules/BottomBar";

import {eventsData} from '../../components/modules/eventsBoxes/eventsData'
export default function PlayerLogin() {
  const dispatch = useDispatch();
  const playerID = useSelector((state) => state.playerPersistReducer.playerID);
  const saved = useSelector((state) => state.playerPersistReducer.saved);

  const [userId, setUserId] = useState(); //8LP0P8LVC
  const [validId, setValidId] = useState(false);
  const [howToClicked, setHowToClicked] = useState(false);
  const [confirmClicked, setConfirmClicked] = useState(false);

  const [message, setMessage] = useState(
    "Please provide your Brawl Stars player ID"
  );

  useEffect(() => {
    {
      if (saved === true) {
        setUserId(playerID);
        async function fetchMySavedData() {
          if (userId) {
            const stats = await getStatsFromDB(userId);
            dispatch(receivedPlayerStatsFromDB(stats));
            const { maps, brawlers, events, icons } = await getBrawlifyFromDB();
            dispatch(brawlersReceived(brawlers));
            dispatch(mapsReceived(maps));
            dispatch(eventsReceived(events));
            dispatch(iconsReceived(icons));
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
            const { maps, brawlers, events, icons } = await getBrawlifyFromDB();
            dispatch(brawlersReceived(brawlers));
            dispatch(mapsReceived(maps));
            dispatch(eventsReceived(events));
            dispatch(iconsReceived(icons));
            let checkDBStats = await getStatsFromDB(userId);
            if (checkDBStats == null) {
              let playerStats = await getStatsFirstLogin(userId);
              console.log(playerStats);
            } else {
              dispatch(receivedPlayerStatsFromDB(checkDBStats));
            }
            dispatch(userIdReceived(userId));
            await eventsData(1,2);
            setValidId(true);
          } catch (error) {
            console.log(error);
            setMessage("Invalid player ID or Supercell is doing maintenance!");
          }
        }
        // console.log("apiHeroku called in player login component!");

        fetchMyDataFirstTime();
      }
    }
  }, [userId, confirmClicked]);

  return (
    <>
      {!validId && saved !== true && (
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
            </View>
            <View style={styles.imagesContainer}>
              <TouchableOpacity
                onPress={(howToClicked) => setHowToClicked(true)}
              >
                <Text style={styles.findIdText}>how to find Player ID</Text>
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
      {saved === true && !validId && (
        <View style={styles.container}>
          <ImageBackground
            source={imageBackground}
            style={styles.imageBackground}
            blurRadius={2}
          ></ImageBackground>
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
  },

  inputContainer: {
    marginTop: 180,
    marginBottom: 50,
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
