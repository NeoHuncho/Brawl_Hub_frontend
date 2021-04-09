import React, { useState, useEffect } from "react";
import { AdMobBanner, setTestDeviceIDAsync } from "expo-ads-admob";

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
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import SegmentedControlTab from "react-native-segmented-control-tab";

import colors from "../../config/colors";
import { userIdReset } from "../../store/playerIdReducer";
import WinLossModule from "../../components/modules/WinLossModule";
import CarouselModule from "../../components/modules/Carousel/CarouselModule";
import { processPlayerStats } from "../../components/modules/Carousel/CarouselData";
import { getAssets, getIconImage } from "../../lib/getAssetsFunctions";
import LoadingPage from "../../components/LoadingPage";

export default function PlayerStats() {
  getAssets();
  const dispatch = useDispatch();
  const playerName = useSelector((state) => state.battleLogReducer.name);
  const playerID = useSelector((state) => state.playerPersistReducer.playerID);
  const season = useSelector((state) => state.battleLogReducer.season);
  const seasons = useSelector(
    (state) => state.battleLogReducer.playerStats.season
  );
  const types = useSelector(
    (state) => state.battleLogReducer.playerStats.season[season].type
  );

  const icon = useSelector((state) => state.battleLogReducer.icon);
  const iconImage = getIconImage(icon);

  const sKeys = Object.keys(seasons);
  const seasonsKey = sKeys.map((x) => "season " + x);


  const typesKey = Object.keys(types)
    .map((x) =>
      x === "ranked"
        ? "Trophies"
        : x === "soloRanked"
        ? "Solo PL"
        : x == "teamRanked"
        ? "Team PL"
        : null
    )
    .sort()
    .reverse();


  // const typesKey = [
  //   trophiesExist == true ? (
  //     <>
  //       <Text>Trophies</Text>
  //     </>
  //   ) : null,
  //   soloPLExist == true ? (
  //     <>
  //       <Text>Solo PL</Text>
  //     </>
  //   ) : null,
  //   teamPLExist == true ? (
  //     <>
  //       <Text>Team PL</Text>
  //     </>
  //   ) : null,
  // ];
  console.log(typesKey)

  const [styleIndex, setStyleIndex] = useState(0);
  const [sortIndex, setSortIndex] = useState(0);
  const [seasonIndex, setSeasonIndex] = useState(season);
  const [showPreferences, setShowPreferences] = useState(false);

  const [typeIndex, setTypeIndex] = useState(0);

  const handleReset = () => {
    // console.log("called");
    try {
      dispatch(userIdReset());
    } catch (error) {
      console.log(error);
    }
  };

  const handlePress = () => {
    showPreferences === false
      ? setShowPreferences(true)
      : setShowPreferences(false);
  };
  const setTest = async () => {
    await setTestDeviceIDAsync("EMULATOR");
  };
  setTest();
  // console.log("calleddd!");

  //this will intialise the creation of the data for the carousels

  processPlayerStats(seasonIndex, typesKey[typeIndex]);

  return (
    <>
      {playerID ? (
        <SafeAreaView>
          <AdMobBanner
            bannerSize="smartBanner"
            adUnitID="ca-app-pub-3940256099942544/6300978111"
            servePersonalizedAds={true} // true or false
            onDidFailToReceiveAdWithError={(e) => console.log(e)}
            style={{ marginTop: StatusBar.currentHeight }}
          />
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.nameContainer}>
                {iconImage ? (
                  <Image
                    source={{ uri: iconImage }}
                    style={{
                      width: 30,
                      height: 30,
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                ) : null}
                <Text style={styles.name}>{playerName}</Text>
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
              <TouchableOpacity onPress={handlePress}>
                <Text
                  style={[
                    styles.categoryName,
                    { textAlign: "center", marginTop: 30 },
                  ]}
                >
                  Show Preferences and History
                </Text>
              </TouchableOpacity>
              <View style={{ marginTop: 20 }}>
                {showPreferences && (
                  <>
                    <Text style={styles.sliderTitle}>Choose Season:</Text>
                    <SegmentedControlTab
                      values={seasonsKey}
                      //The plus 5 is because we are starting 5 seasons late
                      // the minus 5 is to convert it back
                      selectedIndex={seasonIndex - 5}
                      onTabPress={(index) => setSeasonIndex(index + 5)}
                    />
                    <View style={{ marginTop: 10 }}>
                      <Text style={styles.sliderTitle}>Sort By:</Text>
                      <SegmentedControlTab
                        tabContainerStyle={{ width: "50%" }}
                        values={["Performance", "Wins"]}
                        selectedIndex={sortIndex}
                        onTabPress={(index) => setSortIndex(index)}
                      />
                    </View>
                    <View style={{ marginTop: 10, marginBottom: 20 }}>
                      <Text style={styles.sliderTitle}>Style:</Text>
                      <SegmentedControlTab
                        values={["Carousel", "Tinder", "Stack"]}
                        selectedIndex={styleIndex}
                        onTabPress={(index) => setStyleIndex(index)}
                      />
                    </View>
                  </>
                )}
                <View style={{ marginLeft: 15, marginRight: 15 }}>
                  <SegmentedControlTab
                    values={typesKey}
                    enabled={typesKey.length > 1 ? true : false}
                    selectedIndex={typeIndex}
                    onTabPress={(index) => setTypeIndex(index)}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  {typesKey[typeIndex] === "Trophies" ? (
                    <WinLossModule type={typeIndex} />
                  ) : null}
                </View>
                <View style={{ marginTop: 18, marginBottom: 80 }}>
                  <Text style={styles.categoryName}>Player Stats by Mode</Text>
                  <CarouselModule
                    dataType="mode"
                    style={styleIndex}
                    sort={sortIndex}
                  />
                  <Text style={styles.categoryName}>
                    Player Stats by Brawler
                  </Text>
                  <CarouselModule
                    dataType="brawler"
                    style={styleIndex}
                    sort={sortIndex}
                  />

                  <Text style={styles.categoryName}>Player Stats by Map</Text>
                  <CarouselModule
                    dataType="map"
                    style={styleIndex}
                    sort={sortIndex}
                  />

                  <Text style={styles.categoryName}>Player Stats by Teams</Text>
                  <CarouselModule
                    dataType="team"
                    style={styleIndex}
                    sort={sortIndex}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : null}
      {!playerID ? <LoadingPage /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  nameContainer: {
    marginTop: 20,
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
  sliderTitle: {
    color: colors.secondary,
    fontFamily: "Lilita-One",
    fontSize: 18,
    marginBottom: 10,
    marginLeft: 15,
  },
  radioBtn: {},
  seasonPicker: {
    color: colors.primary,
    width: "100%",
  },
  seasonItem: {
    fontFamily: "Lilita-One",
    fontSize: 20,
  },
});
