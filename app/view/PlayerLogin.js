import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";

import { useDispatch } from "react-redux";
import { battleLogReceived } from "../store/battleLog";
import api from "../store/middleware/api";

import PlayerStats from "../view/PlayerStats";

export default function PlayerLogin() {
  const dispatch = useDispatch();
  const [battleLog, setbattleLog] = useState();

  const [userId, setUserId] = useState(
    "Please provide your brawl stars player ID"
  );
  const [validId, setValidId] = useState(false);

  useEffect(() => {
    {
      if (userId && userId.length === 9) {
        async function fetchMyAPI() {
          try{
            console.log(userId);
            let response = await api(userId)
            dispatch(battleLogReceived(response));
            setValidId(true);
          }
          catch(error){
            setUserId('Invalid player ID or supercell is doing maintenance!')
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
        <TextInput
          value={userId}
          autoCapitalize="characters"
          style={styles.playerIdInput}
          onFocus={(userId) => setUserId("")}
          onChangeText={(userId) => setUserId(userId)}
        />
      )}
      {validId && <PlayerStats />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
  },
  playerIdInput: {
    height: 60,
    width: 400,
    borderColor: "white",
    borderWidth: 1,
  },
});
