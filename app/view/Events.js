import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import SegmentedControlTab from "react-native-segmented-control-tab";

import colors from "../config/colors";
import {eventsData} from '../components/modules/eventsBoxes/eventsData'
import EventsModule from "../components/modules/eventsBoxes/eventsModule";

import { store } from "../store/configureStore";

export default  function Events() {
  const [typeIndex, setTypeIndex] = useState(0);

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 50, margin: 5 }}>
        <SegmentedControlTab
          values={["Trophies", "Solo PL", "Teams PL"]}
          selectedIndex={typeIndex}
          onTabPress={(index) => setTypeIndex(index)}
        />
      </View>
      <EventsModule />
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
