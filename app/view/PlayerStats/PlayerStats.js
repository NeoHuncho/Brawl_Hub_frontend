import React from "react";
import { Button, ScrollView, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import colors from "../../config/colors";
import { userIdReset } from "../../store/playerIdReducer";
import WinLossModule from "../../components/modules/WinLossModule";

//import CarouselModule from "../../components/modules/CarouselModule";

export default function PlayerStats() {
  const dispatch = useDispatch();
  const player = useSelector((state) => state.battleLogReducer.player);
  const playerStats = useSelector(
    (state) => state.battleLogReducer.playerStats
  );
  const handleReset = () => {
    console.log("called");
    try {
      dispatch(userIdReset());
    } catch (error) {
      console.log(error);
    }
  };

  console.log(playerStats);
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{player.name}</Text>

          <TouchableHighlight onPress={() => handleReset()}>
            <Ionicons style={styles.icon} name="exit" size={24} color={colors.secondary}></Ionicons>
          </TouchableHighlight>
        </View>
        <View style={{ marginTop: 10 }}>
          <WinLossModule />
        </View>

        <View style={{ marginTop: 60 }}>
          <Text style={styles.categoryName}>Player Stats by Mode</Text>
           {/* <CarouselModule />  */}
        </View>
        <View style={{}}>
          <Text style={styles.categoryName}>Player Stats by Brawler</Text>
           {/* <CarouselModule />  */}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  nameContainer: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent:"center"
  },
  name: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 30,
    textAlign: "center",
  },
  categoryName: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 20,
    marginLeft: 6,
  },
  icon:{
    paddingTop:10,
    paddingLeft:10
  }
});