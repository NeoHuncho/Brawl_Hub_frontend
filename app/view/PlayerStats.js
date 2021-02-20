import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

import colors from "../config/colors";
import WinLossModule from "../components/modules/WinLossModule";

export default function PlayerStats({ userId }) {
  const player = useSelector((state) => state.player);
 

  console.log("look here 3!");


  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{player.name}</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <WinLossModule/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  nameContainer: {
    marginTop: 60,
  },
  name: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 30,
  },
});
