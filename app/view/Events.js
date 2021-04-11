import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SegmentedControlTab from "react-native-segmented-control-tab";
import DropDownPicker from "react-native-dropdown-picker";
import { AdMobBanner } from "expo-ads-admob";

import colors from "../config/colors";
import EventsModule from "../components/modules/eventsBoxes/eventsModule";

import { store } from "../store/configureStore";
import { useSelector } from "react-redux";
import { getRanges } from "../lib/getGlobalStatsFunctions";

export default function Events() {
  const [typeIndex, setTypeIndex] = useState(0);
  const [typeIndexChange, setTypeIndexChange] = useState(false);
  const [seasonIndex, setSeasonIndex] = useState(season - 5);

  const season = useSelector((state) => state.battleLogReducer.season);
  const seasons={5:null}
  // const seasons = useSelector(
  //   (state) => state.battleLogReducer.playerStats.season
  // );
  const rangesFromDB = getRanges();
  const listRangesItems = [];

  let ranges = [
    ["under400", "400-600", "600-800", "800-1000", "1000-1200", "1200+"],
    ["underGold", "gold", "diamond", "mythic", "legendary", "master"],
    ["underGold", "gold", "diamond", "mythic", "legendary", "master"],
  ];

  const rangesOrdered = (ranges, unorderedRanges) => {
    return ranges.filter((el) => {
      return unorderedRanges.includes(el);
    });
  };

  ranges = rangesOrdered(ranges[typeIndex], rangesFromDB[typeIndex][0]);
  console.log(ranges);
  ranges.map((range) => {
    listRangesItems.push({
      label: range,
      value: range,
    });
  });
  const [range, setRange] = useState(ranges[ranges.length - 1]);
  if (typeIndexChange == true) {
    setRange(ranges[ranges.length - 1]);
    setTypeIndexChange(false);
  }

  const sKeys = Object.keys(seasons);
  const seasonsKey = sKeys.map((x) => "season " + x);
  return (
    <>
      <AdMobBanner
        bannerSize="smartBanner"
        adUnitID="ca-app-pub-3940256099942544/6300978111"
        servePersonalizedAds={true} // true or false
        onDidFailToReceiveAdWithError={(e) => console.log(e)}
        style={{marginTop:StatusBar.currentHeight}}
      />
      <ScrollView style={styles.container}>
        <View style={{ marginTop: 20, margin: 20 }}>
          <SegmentedControlTab
            values={["Trophies", "Solo PL", "Teams PL"]}
            selectedIndex={typeIndex}
            onTabPress={(index) => {
              setTypeIndexChange(true);
              setTypeIndex(index);
            }}
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
        <DropDownPicker
          items={listRangesItems}
          defaultValue={range}
          containerStyle={{
            height: 40,
            marginTop: 10,
            marginLeft: 50,
            marginRight: 50,
          }}
          style={{ backgroundColor: "#fafafa" }}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          dropDownStyle={{ backgroundColor: "#fafafa" }}
          onChangeItem={(item) => setRange(item.value)}
        />

        <View style={{ alignContent: "center", alignItems: "center" }}>
          <EventsModule
            seasonIndex={seasonIndex}
            typeIndex={typeIndex}
            range={range}
          />
        </View>
      </ScrollView>
    </>
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
