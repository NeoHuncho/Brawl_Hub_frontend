import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SegmentedControlTab from "react-native-segmented-control-tab";

import colors from "../config/colors";
import EventsModule from "../components/modules/eventsBoxes/eventsModule";

import { store } from "../store/configureStore";
import { useSelector } from "react-redux";

export default function Events() {
  const [typeIndex, setTypeIndex] = useState(0);
  const [seasonIndex, setSeasonIndex] = useState(season);

  const season = useSelector((state) => state.battleLogReducer.season);
  const seasons = useSelector(
    (state) => state.battleLogReducer.playerStats.season
  );

  const sKeys = Object.keys(seasons);
  const seasonsKey = sKeys.map((x) => "season " + x);
  return (
    <View style={styles.container}>
      <View style={{ marginTop: 50, margin: 5 }}>
        <SegmentedControlTab
          values={["Trophies", "Solo PL", "Teams PL"]}
          selectedIndex={typeIndex}
          onTabPress={(index) => setTypeIndex(index)}
        />
        <View style={{ marginTop: 10 }}>
          <SegmentedControlTab
            values={seasonsKey}
            //The plus 5 is because we are starting 5 seasons late
            // the minus 5 is to convert it back
            selectedIndex={seasonIndex - 5}
            onTabPress={(index) => setSeasonIndex(index + 5)}
          />
        </View>
      </View>
      <View style={{ alignContent: "center", alignItems: "center" }}>
        <EventsModule seasonIndex={seasonIndex} typeIndex={typeIndex} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C3273",
  },
});
const unsubscribe = store.subscribe(Events);
unsubscribe();
