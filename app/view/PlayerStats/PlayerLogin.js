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
import {mapsReceived,brawlersReceived} from '../../store/brawlifyReducer'

import apiHeroku from "../../store/middleware/apiHeroku";
import PlayerStats from "./PlayerStats.js";
import colors from "../../config/colors";
import { playerInfoWrite } from "../../lib/writer";
import imageBackground from "../../assets/background-login.jpg";
import { db } from "../../lib/initFirebase";
import { findBrawlerList, findMapsList } from "../../store/APIbrawlify";
export default function PlayerLogin() {
  const dispatch = useDispatch();
  const playerID = useSelector((state) => state.playerPersistReducer.playerID);
  const saved = useSelector((state) => state.playerPersistReducer.saved);

  const [userId, setUserId] = useState(); //8LP0P8LVC
  const [validId, setValidId] = useState(false);
  const [howToClicked, setHowToClicked] = useState(false);
  const [confirmClicked, setConfirmClicked] = useState(false);
  const [playerStatsFromDB, setplayerStatsFromDb] = useState();

  const [message, setMessage] = useState(
    "Please provide your Brawl Stars player ID"
  );
  const getDataFromDB = async () => {
    console.log("called!");
    const playerStats = await db.collection("PlayerStats").doc(userId);
    const stats = await playerStats.get();
    const data = await stats.data();
    return data;
  };

  useEffect(() => {
    {
      if (saved === true) {
        setMessage("loading");
        setUserId(playerID)}
        ;
      if (
        saved === true ||
        (!validId && userId && userId.length >= 6 && confirmClicked === true)
      ) {
        async function fetchMyAPI() {
          try {
            let response = await apiHeroku(userId);

            let brawlersList = await findBrawlerList();
            let brawlersMaps= await findMapsList();
            dispatch(brawlersReceived(brawlersList));
            dispatch(mapsReceived(brawlersMaps));

            
            //response will be an array like this if stats already in the db
            //check apiHeroku
            if (response.db == true) {
             
              const dbData = await getDataFromDB();
              console.log(playerStatsFromDB);
              await dispatch(receivedPlayerStatsFromDB(dbData));
              await dispatch(processedPlayerStats(response));
              await dispatch(compiledPlayerStats());
             await  dispatch(userIdReceived(userId));
              await playerInfoWrite();
              setValidId(true);
            }

            //response will be like this if no player stats are saved in db
            //check apiHeroku
            else {
              await dispatch(battleLogAndPlayerReceived(response));
              await dispatch(processedPlayerStats(userId));
              await  dispatch(compiledPlayerStats());
              await   dispatch(userIdReceived(userId));
              await  playerInfoWrite();
              await   setValidId(true);
            }
          } catch (error) {
          
            console.log(error);
            setMessage("Invalid player ID or Supercell is doing maintenance!");
          }
        }
        console.log("apiHeroku called in player login component!");
       
          fetchMyAPI();
        
      }
    }
  }, [userId, confirmClicked]);

  return (
    <>
      {!validId && (
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
                value={userId}
                autoCapiHerokutalize="characters"
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

      {validId && <PlayerStats />}
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
