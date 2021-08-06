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
  Dimensions,
} from "react-native";

import SegmentedControlTab from "react-native-segmented-control-tab";
import DropDownPicker from "react-native-dropdown-picker";
import { AdMobBanner } from "expo-ads-admob";
import { Ionicons } from "@expo/vector-icons";
import { store } from "../../store/configureStore";
import { useSelector, useDispatch } from "react-redux";

import { bannerAdID } from "../../config/ads";
import Settings from "./Settings";
import colors from "../../config/colors";
import EventsModule from "../../components/modules/eventsBoxes/eventsModule";
import EventsMoreInfo from "../EventsPage/EventsMoreInfo";
import MessageBox from "../../components/modules/MessageBox";
import FAQevents from "./FAQevents";
import ReloadButton from "../../components/reloadButton";

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
import { getGlobalStatsFromDB } from "../../lib/apiDB";
import { globalStatsReceived } from "../../store/reducers/globalStatsReducer";

export default function Events() {
  const dispatch = useDispatch();
  const device = useSelector((state) => state.uiReducerNoPersist.deviceType);

  const typeIndexPersist = useSelector(
    (state) => state.uiReducerPersist.typeIndex
  );
  const [typeIndex, setTypeIndex] = useState(typeIndexPersist);
  const [typeIndexChange, setTypeIndexChange] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [moreInfoEventOpen, setMoreInfoEventOpen] = useState(false);
  const [typeIndexChanging, setTypeIndexChanging] = useState(false);

  const season = useSelector((state) => state.globalStatsReducer.seasonStats);
  const powerLeagueActive = useSelector(
    (state) => state.globalStatsReducer.powerLeagueActive
  );

  const globalStatsInStore = useSelector(
    (state) => state.globalStatsReducer.globalStats
  );
  const seasonIndex = season - 5;
  const isOpen = useSelector((state) => state.uiReducerNoPersist.isOpenEvents);

  const trophiesRange = useSelector(
    (state) => state.uiReducerPersist.trophiesRange
  );
  const plRange = useSelector((state) => state.uiReducerPersist.plRange);

  const handleSettingsPress = () => {
    showSettings === false ? setShowSettings(true) : setShowSettings(false);
  };
  const handleFAQPress = () => {
    showFAQ === false ? setShowFAQ(true) : setShowFAQ(false);
  };

  const plMessage = useSelector((state) => state.uiReducerPersist.plMessage);
  const adMessage = useSelector((state) => state.uiReducerPersist.adMessage);

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

  const rangesFromDB = useSelector((state) => state.globalStatsReducer.ranges);

  const listRangesItems = [];

  let ranges = [
    ["under400", "400-600", "600-800", "800-1000", "1000-1200", "1200+"],
    ["underGold", "gold", "diamond", "mythic", "legendary", "master"],
  ];

  let logoRanges = {
    trophies: [trophy_1, trophy_2, trophy_3, trophy_4, trophy_5],
    powerLeague: [silver, gold, diamond, mythic, legendary, master],
  };
  // const logoRangesOrdered = [];

  // const rangesOrdered = (ranges, logoRanges, unorderedRanges) => {
  //   return ranges.filter((el, index) => {
  //     if (unorderedRanges.includes(el)) {
  //       logoRangesOrdered.push(logoRanges[index]);
  //     }
  //     return unorderedRanges.includes(el);
  //   });
  // };

  ranges = rangesFromDB[typeIndex == 0 ? "trophies" : "powerLeague"];
  console.log(1982, ranges);
  // console.log("sorted", logoRangesOrdered);
  ranges.map((range, index) => {
    listRangesItems.push({
      label: range,
      value: range,
      icon: () => (
        <Image
          source={
            logoRanges[typeIndex == 0 ? "trophies" : "powerLeague"][index]
          }
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

  const [range, setRange] = useState(
    typeIndex == 0 ? ranges[trophiesRange] : ranges[plRange]
  );
  if (typeIndexChange == true) {
    setRange(typeIndex == 0 ? ranges[trophiesRange] : ranges[plRange]);
    setTypeIndexChange(false);
  }
  // console.log(range);

  // const seasonsKey = sKeys.map((x) => "season " + x);
  return (
    <>
      <AdMobBanner
        bannerSize="smartBanner"
        adUnitID={bannerAdID}
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
      {adMessage == true && (
        <MessageBox
          message={"The possibility to remove ads will be coming very soon !!"}
          idMessage={"ad"}
          color={colors.red}
        />
      )}

      {moreInfoEventOpen === false && (
        <ScrollView style={styles.container}>
          <View style={{ marginTop: 20, margin: 20 }}>
            <View
              style={{
                flexDirection: "row",
                marginLeft: 15,
                marginBottom: 15,
                width: Dimensions.get("window").width,
                alignContent: "space-around",
              }}
            >
              <TouchableOpacity
                onPress={() => handleSettingsPress()}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Ionicons
                  name="settings"
                  size={device != "tablet" ? 24 : 40}
                  color={colors.secondary}
                />
                <Text
                  style={[
                    styles.categoryName,
                    {
                      textAlign: "center",
                      fontSize: device != "tablet" ? 25 : 40,
                    },
                  ]}
                >
                  Settings
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleFAQPress()}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  position: "absolute",
                  right: 60,
                }}
              >
                <Text
                  style={[
                    styles.categoryName,
                    {
                      textAlign: "center",
                      fontSize: device != "tablet" ? 25 : 40,
                    },
                  ]}
                >
                  F.A.Q
                </Text>
                <Ionicons
                  style={{ marginLeft: 5, marginTop: 5 }}
                  name="book"
                  size={device != "tablet" ? 24 : 40}
                  color={colors.secondary}
                />
              </TouchableOpacity>
            </View>
            {showFAQ == true && <FAQevents />}
            {showSettings == true && <Settings />}

            <SegmentedControlTab
              values={["Trophies", "Power League"]}
              tabsContainerStyle={
                device == "tablet"
                  ? { marginTop: 10, marginLeft: 50, marginRight: 50 }
                  : null
              }
              tabTextStyle={{
                fontSize: device != "tablet" ? 14 : 25,
                fontFamily: "Lilita-One",
              }}
              selectedIndex={typeIndex}
              onTabPress={async (index) => {
                setTypeIndexChanging(true);
                let globalStats = await getGlobalStatsFromDB(
                  globalStatsInStore,
                  season,
                  "global",
                  index
                );
                await dispatch(globalStatsReceived(globalStats));
                setTypeIndex(index);
                setTypeIndexChange(true);
                setTypeIndexChanging(false);
              }}
              enabled={powerLeagueActive == false ? false : true}
            />
            {/* <ReloadButton /> */}
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
          {typeIndexChanging == false && (
            <DropDownPicker
              items={listRangesItems}
              globalTextStyle={{
                fontSize: device == "tablet" ? 20 : 15,
                fontWeight: "900",
              }}
              defaultValue={range}
              containerStyle={{
                height: device != "tablet" ? 40 : 60,
                marginLeft: device != "tablet" ? 50 : 250,
                marginRight: device != "tablet" ? 50 : 250,
              }}
              style={{ backgroundColor: "#fafafa" }}
              itemStyle={{
                justifyContent: "flex-start",
              }}
              dropDownStyle={{ backgroundColor: "#fafafa" }}
              onChangeItem={async (item, index) => {
                setTypeIndexChanging(true);
                let globalStats = await getGlobalStatsFromDB(
                  globalStatsInStore,
                  season,
                  "global",
                  typeIndex,
                  item.value
                );

                await dispatch(globalStatsReceived(globalStats));
                setRange(item.value);

                setTypeIndexChanging(false);
              }}
            />
          )}

          <View style={{ alignContent: "center", alignItems: "center" }}>
            {typeIndexChanging == false && (
              <EventsModule
                season={season}
                typeIndex={typeIndex}
                range={range}
              />
            )}
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
  categoryName: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 20,
    marginLeft: 6,
  },
});
const unsubscribe = store.subscribe(Events);
unsubscribe();
