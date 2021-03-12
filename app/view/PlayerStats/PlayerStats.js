import React, { useState, useEffect } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";


import colors from "../../config/colors";
import { userIdReset } from "../../store/playerIdReducer";
import WinLossModule from "../../components/modules/WinLossModule";
import CarouselModule from "../../components/modules/Carousel/CarouselModule";
import {
  processPlayerStats,
  brawlersByPerformance,
} from "../../components/modules/Carousel/CarouselData";
import PlayerLogin from "./PlayerLogin";

export default function PlayerStats() {
  const dispatch = useDispatch();
  const player = useSelector((state) => state.battleLogReducer.player);
  const playerName = useSelector((state) => state.battleLogReducer.name);
  const playerID= useSelector((state)=> state.playerPersistReducer.playerID)

  const handleReset = () => {
    console.log("called");
    try {
      dispatch(userIdReset());
      
    } catch (error) {
      console.log(error);
    }
  };
  processPlayerStats();

  
  return (
    <>
    { playerID &&<ScrollView>
      <View style={styles.container}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{player ? player.name : playerName}</Text>

          <TouchableOpacity>
            <Ionicons
              onPress={() => handleReset()}
              style={styles.icon}
              name="exit"
              size={24}
              color={colors.secondary}
            ></Ionicons>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 10 }}>
          <WinLossModule />
        </View>
        <View style={{ marginTop: 60 }}>
          <Text style={styles.categoryName}>Player Stats by Mode</Text>
          <CarouselModule dataType="mode" />
        </View>
        <Text style={styles.categoryName}>Player Stats by Brawler</Text>
        <CarouselModule dataType="brawler" />
        <Text style={styles.categoryName}>Player Stats by Map</Text>
        <CarouselModule dataType="map" />
        <Text style={styles.categoryName}>Player Stats by Teams</Text>
        <CarouselModule dataType="team" />
      </View>
    </ScrollView>}
    {!playerID&& <PlayerLogin/>}
    </>
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
    justifyContent: "center",
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
  icon: {
    paddingTop: 10,
    paddingLeft: 10,
  },
});
