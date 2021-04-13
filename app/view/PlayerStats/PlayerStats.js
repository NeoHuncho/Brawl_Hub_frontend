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
  ImageBackground,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import SegmentedControlTab from "react-native-segmented-control-tab";

import colors from "../../config/colors";
import { userIdReset } from "../../store/reducers/playerIdReducer";
import { receivedGameTypeAndSeason } from "../../store/reducers/uiReducerNoPersist";
import {preferencesCarousel } from "../../store/reducers/uiReducerPersist";
import WinLossModule from "../../components/modules/WinLossModule";
import CarouselModule from "../../components/modules/Carousel/CarouselModule";
import { processPlayerStats } from "../../components/modules/Carousel/CarouselData";
import { getAssets, getIconImage } from "../../lib/getAssetsFunctions";
import LoadingPage from "../../components/LoadingPage";
import imageBackground from "../../assets/background-login.jpg";
import PlayerStatsMoreInfo from "../PlayerStats/playerStatsMoreInfo";

const PlayerStats = () => {
  getAssets();
  const dispatch = useDispatch();
  const playerName = useSelector((state) => state.battleLogReducer.name);
  const playerID = useSelector((state) => state.playerPersistReducer.playerID);
  const season = useSelector((state) => state.battleLogReducer.season);
  const icon = useSelector((state) => state.battleLogReducer.icon);
  const playerStats = useSelector(
    (state) => state.battleLogReducer.playerStats
  );
  const preferencesCarouselStored = useSelector((state) => state.uiReducerPersist);

  const iconImage = getIconImage(icon);

  let seasons = null;
  let types = null;
  let sKeys = null;
  let seasonsKey = null;
  let typesKey = null;

  if (playerStats !== "no data"|| playerStats!=={'season':{}}) {
    seasons = useSelector((state) => state.battleLogReducer.playerStats.season);
    types = useSelector(
      (state) => state.battleLogReducer.playerStats.season[season].type
    );
    sKeys = Object.keys(seasons);
    seasonsKey = sKeys.map((x) => "season " + x);

    typesKey = Object.keys(types)
      .map((x) =>
        x === "ranked"
          ? "Trophies"
          : x === "soloRanked"
          ? "PL Solo"
          : x == "teamRanked"
          ? "PL Team"
          : null
      )
      .sort()
      .reverse();
  }

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
  // console.log(typesKey);

  const [styleIndex, setStyleIndex] = useState(preferencesCarouselStored.styleIndex);
  const [sortIndex, setSortIndex] = useState(preferencesCarouselStored.sortIndex);
  const [seasonIndex, setSeasonIndex] = useState(season);
  const [showPreferences, setShowPreferences] = useState(false);
  const [moreInfoCarouselOpen, setMoreInfoCarouselOpen] = useState(false);

  const [typeIndex, setTypeIndex] = useState(0);
  if (playerStats !== "no data"|| playerStats!={'season':{}}) {
    dispatch(
      preferencesCarousel({
        sortIndex:sortIndex,
        styleIndex:styleIndex
      })
    );
    dispatch(
      receivedGameTypeAndSeason({
        seasonIndex: seasonIndex,
        gameType: typesKey[typeIndex],
      })
    );
    processPlayerStats(seasonIndex, typesKey[typeIndex], null, null);
    const isOpen = useSelector((state) => state.uiReducerNoPersist.isOpen);
    if (moreInfoCarouselOpen === false) {
      if (isOpen === true) {
        setMoreInfoCarouselOpen(isOpen);
      }
    } else if (moreInfoCarouselOpen === true) {
      if (isOpen === false) {
        setMoreInfoCarouselOpen(isOpen);
      }
    }
  }

  const handleReset = () => {
    // console.log("called");
    try {
      dispatch(userIdReset());
    } catch (error) {
      // console.log(error);
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
  //

  //this will intialise the creation of the data for the carousels

  return (
    <>
      {playerID &&
      playerStats !== "no data" && playerStats!=={'season':{}} &&
      moreInfoCarouselOpen === false ? (
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
                  <Text style={styles.categoryName}>Player Stats by Map</Text>
                  <CarouselModule
                    dataType="map"
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
      {playerStats === "no data" && playerID ? (
        <ImageBackground
          source={imageBackground}
          style={[styles.imageBackground]}
          blurRadius={2}
        >
          <View style={[styles.nameContainer, { top: -280 }]}>
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
          <Text style={[styles.name, { fontSize: 20 }]}>
            {`You don't have any ranked or Power League games in your battlelog.
Your stats will be automatically updated when you do!`}
          </Text>
        </ImageBackground>
      ) : null}
      {!playerID ? <LoadingPage /> : null}
      {moreInfoCarouselOpen !== false && <PlayerStatsMoreInfo />}
    </>
  );
};

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
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
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
export default PlayerStats;
