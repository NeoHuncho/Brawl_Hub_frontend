import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

import colors from "../config/colors";

import WinLossModule from "../components/modules/WinLossModule";
import CarouselModule from "../components/modules/CarouselModule";

export default function PlayerStats() {
  
  const player = useSelector((state) => state.player);
  const playerStats = useSelector((state) => state.playerStats);
  console.log(playerStats)
  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{player.name}</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <WinLossModule/>
      
      </View>
      
      <View style={{ marginTop: 60 }}>
        <Text style={styles.categoryName}>Player Stats by Mode</Text>
      <CarouselModule />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  
  },
  nameContainer: {
    marginTop: 60,
  },
  name: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 30,
  },
  categoryName: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize:20,
    marginLeft:6
  },
});
