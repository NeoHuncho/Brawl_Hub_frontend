import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, Text, Image, TouchableOpacity } from "react-native";

import { useDispatch } from "react-redux";
import { battleLogAndPlayerReceived,} from "../store/battleLogReducer";
import api from "../store/middleware/api";
import PlayerStats from "../view/PlayerStats.js";
import colors from '../config/colors'

export default function PlayerLogin() {
  const dispatch = useDispatch();

  const [userId, setUserId] = useState("8LP0P8LVC");//8LP0P8LVC
  const [validId, setValidId] = useState(false);
  const [howToClicked,setHowToClicked] =useState(false);
  let correctedUserId=''

  const [message, setMessage] = useState(
    "Please provide your Brawl Stars player ID"
  );

  useEffect(() => {
    {
      if (userId && userId.length === 9) {
        async function fetchMyAPI() {
          try {
            console.log(userId);
            correctedUserId='#'+userId;
            let response = await api(userId);
            dispatch(battleLogAndPlayerReceived(response));
            setValidId(true);
            
          } catch (error) {
            console.log(error)
            setMessage("Invalid player ID or Supercell is doing maintenance!");
          }
        }
        console.log("api called in player login component");
        fetchMyAPI();
      }
    }
  });

  return (

    <View style={styles.container}>

      {!validId && (
        <View>
          <View style={styles.inputContainer}>
            <Text style={styles.provideIdText}>{message}</Text>
            <Text style={styles.findIdText}>8LP0P8LVC</Text>
            <TextInput
              value={userId}
              autoCapitalize="characters"
              style={styles.playerIdInput}
              onChangeText={(userId) => setUserId(userId.toUpperCase())}
           
            />
          </View>
          <View style={styles.imagesContainer}>
            <TouchableOpacity onPress={(howToClicked)=>setHowToClicked(true)}>
            <Text style={styles.findIdText}>how to find Player ID</Text>
            </TouchableOpacity>
           {howToClicked &&(
             <>
            <Image
              style={styles.image}
              source={require("../assets/playerLoginImages/brawlStarsmainPage.png")}
            />
            <Image
              style={styles.image}
              source={require("../assets/playerLoginImages/brawlStarsProfilePage.png")}
            />
            </>
           )} 
          </View>
        </View>
      )}

      {validId && <PlayerStats userId={userId}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center"

  },
  inputContainer: {
    marginTop:180,
    marginBottom: 50,
    alignItems: "center"
  },
  playerIdInput: {
    paddingLeft:3,
    color:colors.secondary,
    fontFamily:'Lilita-One',
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
    fontFamily:'Lilita-One',
    color:colors.primary,

  },
  findIdText: {
    textAlign: "center",
    fontSize: 13,
    fontFamily:'Lilita-One',
    color:colors.secondary,

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
