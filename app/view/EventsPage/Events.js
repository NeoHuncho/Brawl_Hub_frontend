import React, { useState, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import * as Localization from "expo-localization";

import SegmentedControlTab from "react-native-segmented-control-tab";
import DropDownPicker from "react-native-dropdown-picker";
import { AdMobBanner } from "expo-ads-admob";
import { Ionicons } from "@expo/vector-icons";
import { store } from "../../store/configureStore";
import { useSelector, useDispatch } from "react-redux";

import { BANNER_AD_ID } from "react-native-dotenv";
import Settings from "./Settings";
import colors from "../../config/colors";
import EventsModule from "../../components/modules/eventsBoxes/eventsModule";
import EventsMoreInfo from "../EventsPage/EventsMoreInfo";
import MessageBox from "../../components/modules/MessageBox";
import FAQevents from "./FAQevents";
import { languageChanged } from "../../store/reducers/uiReducerPersist";

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
import { getGlobalStatsFromDB, getTranslation } from "../../lib/apiDB";
import { globalStatsReceived } from "../../store/reducers/globalStatsReducer";
import LanguageSelector from "../../components/modules/LanguageSelector";
import { getURL } from "../../lib/getUrls";

let firstLoginLanguageCall = false;
export default function Events() {
  const dispatch = useDispatch();
  const device = useSelector((state) => state.uiReducerNoPersist.deviceType);
  let topRef = useRef();
  const typeIndexPersist = useSelector(
    (state) => state.uiReducerPersist.typeIndex
  );
  const [typeIndex, setTypeIndex] = useState(typeIndexPersist);
  const [typeIndexChange, setTypeIndexChange] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [moreInfoEventOpen, setMoreInfoEventOpen] = useState(false);
  const [typeIndexChanging, setTypeIndexChanging] = useState(false);
  const [menuClicked, setMenuClicked] = useState(false);

  const season = useSelector((state) => state.globalStatsReducer.seasonEvents);
  const powerLeagueActive = useSelector(
    (state) => state.globalStatsReducer.powerLeagueActive
  );
  const globalNumbers = useSelector((state) => state.globalStatsReducer);

  const globalStatsInStore = globalNumbers.globalStats;
  const seasonIndex = season - 5;
  const isOpen = useSelector((state) => state.uiReducerNoPersist.isOpenEvents);

  const trophiesRange = useSelector(
    (state) => state.uiReducerPersist.trophiesRange
  );
  const plRange = useSelector((state) => state.uiReducerPersist.plRange);

  const handleSettingsPress = () => {
    setShowFAQ(false);
    showSettings === false ? setShowSettings(true) : setShowSettings(false);
  };
  const handleFAQPress = () => {
    setShowSettings(false);
    showFAQ === false ? setShowFAQ(true) : setShowFAQ(false);
  };
  const handleMenuPress = (condition) => {
    if (condition == "open") {
      setMenuClicked(true);
    } else {
      setMenuClicked(false);
      setShowFAQ(false);
      setShowSettings(false);
    }
  };

  const plMessage = useSelector((state) => state.uiReducerPersist.plMessage);
  const adMessage = useSelector((state) => state.uiReducerPersist.adMessage);
  const languageChanging = useSelector(
    (state) => state.uiReducerNoPersist.languageChanging
  );
  const language = useSelector((state) => state.uiReducerPersist.language);

  const languages = useSelector((state) => state.uiReducerNoPersist.languages);
  // console.log(11222, language);
  if (
    language === undefined ||
    Object.values(languages).includes(language) == false
  ) {
    // console.log(44, Localization.locale);
    firstLoginLanguageCall = true;
    let localizationLanguage = Localization.locale.substr(3, 5).toLowerCase();
    // console.log(44, localizationLanguage);
    if (Object.values(languages).includes(localizationLanguage) == true)
      dispatch(languageChanged(Localization.locale.substr(3, 5)));
  }
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

  let ranges = rangesFromDB[typeIndex == 0 ? "trophies" : "powerLeague"];
  let logoRanges = {
    trophies: [trophy_1, trophy_2, trophy_3, trophy_4, trophy_5],
    powerLeague: [silver, gold, diamond, mythic, legendary, master],
  };

  let rangesDisplayFromFirebase = useSelector(
    (state) => state.globalStatsReducer.rangesDisplay
  );
  // console.log("HEY", language);

  let rangesDisplay =
    language != "en" && language !== undefined
      ? getTranslation("rangesDisplay")
      : rangesDisplayFromFirebase;

  // console.log("sorted", logoRangesOrdered);
  ranges.map((range, index) => {
    listRangesItems.push({
      label: typeIndex == 0 ? rangesDisplay[index] : range,
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
        adUnitID={BANNER_AD_ID}
        servePersonalizedAds={true} // true or false
        onDidFailToReceiveAdWithError={(e) => console.log(e)}
        style={{ marginTop: getStatusBarHeight() }}
      />

      {plMessage == true && typeIndex != 0 && (
        <MessageBox
          message={getTranslation(
            "Open this app BEFORE starting a power league game!   Otherwise switching back and forth could lead to a disconnect"
          )}
          idMessage={"pl"}
          color={colors.red}
        />
      )}
      {/* {adMessage == true && (
        <MessageBox
          message={getTranslation(
            getTranslation(
              "The possibility to remove ads will be coming very soon !!"
            )
          )}
          idMessage={"ad"}
          color={colors.red}
        />
      )} */}
      {firstLoginLanguageCall == true && <LanguageSelector type={"Modal"} />}
      {moreInfoEventOpen === false && languageChanging == false && (
        <View style={styles.back}>
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 10,
              right: 5,

              zIndex: 2,
            }}
            onPress={() => {
              menuClicked == false
                ? handleMenuPress("open")
                : handleMenuPress("closed");
            }}
          >
            <Image source={getURL("menu")} style={{ width: 35, height: 35 }} />
          </TouchableOpacity>
          {menuClicked == true && (
            <View
              style={{
                flexDirection: "row",
                height: 50,
                left: 15,
                width: Dimensions.get("window").width - 15,
                alignContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  topRef.current.scrollTo({
                    x: 0,
                    y: 0,
                    animated: true,
                  });
                  handleSettingsPress();
                }}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Ionicons
                  name="settings"
                  size={device != "tablet" ? 20 : 40}
                  color={colors.secondary}
                />
                <Text
                  style={[
                    styles.categoryName,
                    {
                      textAlign: "center",
                      fontSize: device != "tablet" ? 15 : 40,
                    },
                  ]}
                >
                  {getTranslation("Settings")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  topRef.current.scrollTo({
                    x: 0,
                    y: 0,
                    animated: true,
                  });
                  handleFAQPress();
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  position: "absolute",
                  right: 15,
                  top: 11.5,
                }}
              >
                <Text
                  style={[
                    styles.categoryName,
                    {
                      textAlign: "center",
                      fontSize: device != "tablet" ? 15 : 40,
                    },
                  ]}
                >
                  {getTranslation("Questions & Answers")}
                </Text>
                <Ionicons
                  style={{ marginLeft: 5, marginTop: 3 }}
                  name="book"
                  size={device != "tablet" ? 20 : 40}
                  color={colors.secondary}
                />
              </TouchableOpacity>
            </View>
          )}

          <ScrollView style={styles.container} ref={topRef}>
            <View style={{ marginTop: 20, margin: 20 }}>
              {showFAQ == true && <FAQevents />}
              {showSettings == true && <Settings />}

              <SegmentedControlTab
                values={[
                  getTranslation("Events"),
                  getTranslation("Power League"),
                ]}
                tabsContainerStyle={
                  device == "tablet"
                    ? { marginTop: 10, marginLeft: 50, marginRight: 50 }
                    : { marginLeft: 10, marginRight: 10 }
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
                }}
                defaultValue={range}
                containerStyle={{
                  height: device != "tablet" ? 40 : 60,
                  marginTop: device != "tablet" ? -5 : 60,
                  marginLeft: device != "tablet" ? 80 : 250,
                  marginRight: device != "tablet" ? 80 : 250,
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

            <View
              style={{
                alignContent: "center",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              {typeIndexChanging == false &&
                typeIndex == 0 &&
                globalNumbers.challenge_active == true && (
                  <EventsModule
                    season={season}
                    typeIndex={"challenge"}
                    range={range}
                  />
                )}

              {typeIndexChanging == false && (
                <EventsModule
                  season={season}
                  typeIndex={typeIndex}
                  range={range}
                />
              )}
            </View>
          </ScrollView>
        </View>
      )}
      {moreInfoEventOpen == true && <EventsMoreInfo />}
    </>
  );
}

const styles = StyleSheet.create({
  back: {
    flex: 1,
    backgroundColor: "#1C3273",
  },
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
