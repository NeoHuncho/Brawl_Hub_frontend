import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";

import SegmentedControlTab from "react-native-segmented-control-tab";
import DropDownPicker from "react-native-dropdown-picker";
import { AdMobBanner } from "expo-ads-admob";


import colors from "../../config/colors";
import EventsModule from "../../components/modules/eventsBoxes/eventsModule";
import EventsMoreInfo from "../EventsPage/EventsMoreInfo";
import MessageBox from "../../components/modules/MessageBox";

import { store } from "../../store/configureStore";
import { useSelector } from "react-redux";
import { getRanges } from "../../lib/getGlobalStatsFunctions";

import trophy_1 from "../../assets/icons/trophy1.png";
import trophy_2 from "../../assets/icons/trophy2.png";
import trophy_3 from "../../assets/icons/trophy3.png";
import trophy_4 from "../../assets/icons/trophy4.png";
import trophy_5 from "../../assets/icons/trophy5.png";

import silver from "../../assets/icons/silver.png";
import gold from "../../assets/icons/gold.png";
import diamond from "../../assets/icons/diamond.png";
import mythic from "../../assets/icons/mythic.png";
import legendary from "../../assets/icons/legendary.png";
import master from "../../assets/icons/master.png";

export default function Events() {

  const [typeIndex, setTypeIndex] = useState(0);
  const [typeIndexChange, setTypeIndexChange] = useState(false);
  const [seasonIndex, setSeasonIndex] = useState(season - 5);
  const seasons = { 6: null };

  const [moreInfoEventOpen, setMoreInfoEventOpen] = useState(false);
  const season = useSelector((state) => state.battleLogReducer.season);
  const isOpen = useSelector((state) => state.uiReducerNoPersist.isOpenEvents);
  const averageTrophiesPlayer = useSelector(
    (state) => state.battleLogReducer.averageTrophies
  );

  const soloPLTrophies = useSelector(
    (state) => state.battleLogReducer.soloPLTrophies
  );
  const teamPLTrophies = useSelector(
    (state) => state.battleLogReducer.teamPLTrophies
  );

  const rangesMinus = useSelector(
    (state) => state.globalStatsReducer.rangesMinus
  );
  const rangesPLMinus = useSelector(
    (state) => state.globalStatsReducer.rangesPLMinus
  );

  const plMessage = useSelector((state) => state.uiReducerPersist.plMessage);

  // console.log(soloPLTrophies, teamPLTrophies);
  if (moreInfoEventOpen === false) {
    if (isOpen === true) {
      setMoreInfoEventOpen(isOpen);
    }
  } else if (moreInfoEventOpen === true) {
    if (isOpen === false) {
      setMoreInfoEventOpen(isOpen);
    }
  }

  const rangesFromDB = getRanges();
  const listRangesItems = [];

  let ranges = [
    ["under400", "400-600", "600-800", "800-1000", "1000-1200", "1200+"],
    ["underGold", "gold", "diamond", "mythic", "legendary", "master"],
    ["underGold", "gold", "diamond", "mythic", "legendary", "master"],
  ];

  let logoRanges = [
    [trophy_1, trophy_2, trophy_3, trophy_4, trophy_5],
    [silver, gold, diamond, mythic, legendary, master],
    [silver, gold, diamond, mythic, legendary, master],
  ];
  const logoRangesOrdered = [];

  const rangesOrdered = (ranges, logoRanges, unorderedRanges) => {
    return ranges.filter((el, index) => {
      if (unorderedRanges.includes(el)) {
        logoRangesOrdered.push(logoRanges[index]);
      }
      return unorderedRanges.includes(el);
    });
  };

  ranges = rangesOrdered(
    ranges[typeIndex],
    logoRanges[typeIndex],
    rangesFromDB[typeIndex][0]
  );
  // console.log("sorted", logoRangesOrdered);
  ranges.map((range, index) => {
    listRangesItems.push({
      label: range,
      value: range,
      icon: () => (
        <Image
          source={logoRangesOrdered[index]}
          style={
            typeIndex == 0
              ? { width: 32, height: 20 }
              : { width: 20, height: 24 }
          }
        />
      ),
    });
  });
  // console.log(listRangesItems);

  const rangeFinder = () => {
    let rangeToApply = null;
    typeIndex == 0
      ? averageTrophiesPlayer < 600
        ? (rangeToApply = ranges.length - rangesMinus[0])
        : 600 <= averageTrophiesPlayer < 800
        ? (rangeToApply = ranges.length - rangesMinus[1])
        : averageTrophiesPlayer > 800
        ? (rangeToApply = ranges.length - rangesMinus[2])
        : (rangeToApply = ranges.length - rangesMinus[2])
      : typeIndex == 1
      ? soloPLTrophies == 0
        ? (rangeToApply = ranges.length - rangesPLMinus[0][2])
        : soloPLTrophies <= 6
        ? (rangeToApply = ranges.length - rangesPLMinus[0][0])
        : 6 < soloPLTrophies <= 9
        ? (rangeToApply = ranges.length - rangesPLMinus[0][1])
        : 9 < soloPLTrophies <= 12
        ? (rangeToApply = ranges.length - rangesPLMinus[0][2])
        : 12 < soloPLTrophies <= 15
        ? (rangeToApply = ranges.length - rangesPLMinus[0][3])
        : 15 < soloPLTrophies <= 18
        ? (rangeToApply = ranges.length - rangesPLMinus[0][4])
        : 19 <= soloPLTrophies
        ? (rangeToApply = ranges.length - rangesPLMinus[0][5])
        : null
      : typeIndex == 2
      ? teamPLTrophies == 0
        ? (rangeToApply = ranges.length - rangesPLMinus[1][2])
        : teamPLTrophies <= 6
        ? (rangeToApply = ranges.length - rangesPLMinus[1][0])
        : 6 < teamPLTrophies <= 9
        ? (rangeToApply = ranges.length - rangesPLMinus[1][1])
        : 9 < teamPLTrophies <= 12
        ? (rangeToApply = ranges.length - rangesPLMinus[1][2])
        : 12 < teamPLTrophies <= 15
        ? (rangeToApply = ranges.length - rangesPLMinus[1][3])
        : 15 < teamPLTrophies <= 18
        ? (rangeToApply = ranges.length - rangesPLMinus[1][4])
        : 19 <= teamPLTrophies
        ? (rangeToApply = ranges.length - rangesPLMinus[1][5])
        : null
      : null;
    return rangeToApply;
  };
  console.log(plMessage);
  const [range, setRange] = useState(ranges[rangeFinder()]);
  if (typeIndexChange == true) {
    setRange(ranges[rangeFinder()]);
    setTypeIndexChange(false);
  }

  // const seasonsKey = sKeys.map((x) => "season " + x);
  return (
    <>
      <AdMobBanner
        bannerSize="smartBanner"
        adUnitID="ca-app-pub-3940256099942544/6300978111"
        servePersonalizedAds={true} // true or false
        onDidFailToReceiveAdWithError={(e) => console.log(e)}
        style={{ marginTop: StatusBar.currentHeight }}
      />
      {plMessage == true && typeIndex != 0 && (
        <MessageBox
          message={
            "Open this app BEFORE starting a power league game!   Otherwise switching back and forth could lead to a disconnect."
          }
          idMessage={"pl"}
          color={colors.red}
        />
      )}
      {moreInfoEventOpen === false && (
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
            {/* <View> */}
            {/* <SegmentedControlTab
                values={seasonsKey}
                //The plus 5 is because we are starting 5 seasons late
                // the minus 5 is to convert it back
                selectedIndex={seasonIndex - 5}
                onTabPress={(index) => setSeasonIndex(index + 5)}
              /> */}
            {/* </View> */}
          </View>
          <DropDownPicker
            items={listRangesItems}
            defaultValue={range}
            containerStyle={{
              height: 40,
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
      )}
      {moreInfoEventOpen == true && <EventsMoreInfo />}
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
