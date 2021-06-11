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
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import SegmentedControlTab from "react-native-segmented-control-tab";
import * as Progress from "react-native-progress";

import colors from "../../config/colors";
import { userIdReset } from "../../store/reducers/playerIdReducer";
import { receivedGameTypeAndSeason } from "../../store/reducers/uiReducerNoPersist";
import { preferencesCarousel } from "../../store/reducers/uiReducerPersist";
import WinLossModule from "../../components/modules/WinLossModule";
import CarouselModule from "../../components/modules/Carousel/CarouselModule";
import { processPlayerStats } from "../../components/modules/Carousel/CarouselData";
import { getAssets, getIconImage } from "../../lib/getAssetsFunctions";
import ReloadPage from "../ReloadPage";
import imageBackground from "../../assets/background-login.jpg";
import PlayerStatsMoreInfo from "../PlayerStats/playerStatsMoreInfo";
import FaqPage from "./FaqPage";
import MessageBox from "../../components/modules/MessageBox";

const PlayerStats = () => {
  console.log("called playerstats");
  getAssets();
  const dispatch = useDispatch();
  const device = useSelector((state) => state.uiReducerNoPersist.deviceType);
  const battleLogReducer = useSelector((state) => state.battleLogReducer);

  // console.log("look here", battleLogReducer.playerStats.brawlers);
  const playerName = battleLogReducer.name;
  const season = 6;
  const icon = battleLogReducer.icon;

  const playerID = useSelector((state) => state.playerPersistReducer.playerID);

  const globalNumbers = useSelector(
    (state) => state.globalStatsReducer.numbers
  );

  const updateMessage = useSelector(
    (state) => state.uiReducerPersist.updateMessage
  );
  const betaMessage = useSelector(
    (state) => state.uiReducerPersist.betaMessage
  );

  const playerAvgs = {
    averageTrophies: battleLogReducer.averageTrophies,
    avg3vs3Victories: battleLogReducer.avg3vs3Victories,
    avgDuoVictories: battleLogReducer.avgDuoVictories,
    avgSoloVictories: battleLogReducer.avgSoloVictories,
  };
  const playerNums = {
    numberOfBrawlers: battleLogReducer.numberOfBrawlers,
    numberOfStarPowers: battleLogReducer.numberOfStarPowers,
    numberOfGadgets: battleLogReducer.numberOfGadgets,
  };
  playerNums.overallPlayerNumber =
    playerNums.numberOfBrawlers +
    playerNums.numberOfStarPowers +
    playerNums.numberOfGadgets;
  playerNums.overallPercentage =
    playerNums.overallPlayerNumber / globalNumbers.totalUnlockables;

  const playerStats = battleLogReducer.playerStats;
  // console.log(playerStats.brawlers)

  const preferencesCarouselStored = useSelector(
    (state) => state.uiReducerPersist
  );

  const iconImage = getIconImage(icon);

  let seasons = null;
  let types = [];

  let typesKey = null;
  // console.log(playerID);
  if (
    playerStats !== "no data" &&
    playerStats !== null &&
    playerStats !== undefined
  ) {
    seasons = useSelector((state) => ["6"]);
    Object.keys(playerStats).map((key) => {
      key.includes("ranked")
        ? types.push("ranked")
        : key.includes("soloRanked")
        ? types.push("soloRanked")
        : key.includes("teamRanked")
        ? types.push("teamRanked")
        : null;
    });
    console.log(2, types);
    typesKey = types
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
    if (typesKey.length == 3) {
      typesKey[1] = "Solo PL";
      typesKey[2] = "Team PL";
    }
  }

  const [styleIndex, setStyleIndex] = useState(
    preferencesCarouselStored.styleIndex
  );
  const [sortIndex, setSortIndex] = useState(
    preferencesCarouselStored.sortIndex
  );
  const [seasonIndex, setSeasonIndex] = useState(season);

  const [showOverallStats, setShowOverallStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  const [moreInfoCarouselOpen, setMoreInfoCarouselOpen] = useState(false);

  const [typeIndex, setTypeIndex] = useState(0);

  console.log(sortIndex, styleIndex, seasonIndex, typesKey[typeIndex]);
  // Infinite Re rendering is happening here!!!!!!

  useEffect(() => {
    dispatch(
      preferencesCarousel({
        sortIndex: sortIndex,
        styleIndex: styleIndex,
      })
    );
    dispatch(
      receivedGameTypeAndSeason({
        seasonIndex: seasonIndex,
        gameType: typesKey[typeIndex],
      })
    );
  }, [sortIndex, styleIndex, seasonIndex, typeIndex]);

  // // console.log(typesKey[typeIndex])
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

  const handleReset = () => {
    // console.log("called");
    try {
      dispatch(userIdReset());
    } catch (error) {
      console.log(error);
    }
  };

  const handleSettingsPress = () => {
    showSettings === false ? setShowSettings(true) : setShowSettings(false);
  };
  const handleFAQPress = () => {
    showFAQ === false ? setShowFAQ(true) : setShowFAQ(false);
  };
  const handleOverallStatsPress = () => {
    showOverallStats === false
      ? setShowOverallStats(true)
      : setShowOverallStats(false);
  };

  //

  //this will intialise the creation of the data for the carousels

  return (
    <>
      <AdMobBanner
        bannerSize="smartBanner"
        adUnitID="ca-app-pub-2795080443480499/9766722308"
        servePersonalizedAds={true} // true or false
        onDidFailToReceiveAdWithError={(e) => console.log(e)}
        style={{ marginTop: StatusBar.currentHeight }}
      />
      {playerID &&
      playerStats !== "no data" &&
      playerStats !== { season: {} } &&
      playerStats !== undefined &&
      moreInfoCarouselOpen === false ? (
        <SafeAreaView>
          <ScrollView>
            <View style={styles.container}>
              <View style={{ marginTop: 20 }}>
                {updateMessage == true && (
                  <MessageBox
                    message={
                      "Your stats will automatically update daily, if you open Brawl Max at least once every 3 DAYS!"
                    }
                    idMessage={"update"}
                    color={colors.red}
                  />
                )}
                {betaMessage == true && (
                  <MessageBox
                    message={
                      "This app is in open beta! please report bugs in the menu. (bottom right)"
                    }
                    idMessage={"beta"}
                    color={colors.green}
                  />
                )}
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
                  <Text
                    style={[
                      styles.name,
                      device == "tablet"
                        ? { fontSize: 45, marginTop: 2 }
                        : null,
                    ]}
                  >
                    {playerName}
                  </Text>
                  <TouchableOpacity onPress={() => handleReset()}>
                    <Ionicons
                      style={styles.icon}
                      name="exit"
                      size={device != "tablet" ? 24 : 40}
                      color={colors.secondary}
                    ></Ionicons>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginLeft: 15,
                    marginTop: 15,
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
                          fontSize: device != "tablet" ? 25 : 35,
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
                      right: 30,
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryName,
                        {
                          textAlign: "center",
                          fontSize: device != "tablet" ? 25 : 35,
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
                {showSettings == true && (
                  <View style={{ marginTop: 20 }}>
                    <Text
                      style={[
                        styles.sliderTitle,
                        { marginLeft: 30 },
                        device == "tablet" ? { fontSize: 28 } : null,
                      ]}
                    >
                      Choose Season:
                    </Text>
                    <View style={{ marginLeft: 20, marginRight: 20 }}>
                      <SegmentedControlTab
                        values={seasons}
                        //The plus 5 is because we are starting 5 seasons late
                        // the minus 5 is to convert it back
                        selectedIndex={seasonIndex - 6}
                        onTabPress={(index) => setSeasonIndex(index + 5)}
                        tabsContainerStyle={
                          device == "tablet"
                            ? {
                                marginLeft: 50,
                                marginRight: 50,
                                marginTop: 10,
                                marginBottom: 10,
                              }
                            : null
                        }
                        tabTextStyle={{
                          fontSize: device != "tablet" ? 14 : 25,
                          fontFamily: "Lilita-One",
                        }}
                      />
                      <View style={{ marginTop: 10 }}>
                        <Text
                          style={[
                            styles.sliderTitle,
                            device == "tablet" ? { fontSize: 28 } : null,
                          ]}
                        >
                          Sort By:
                        </Text>
                        <SegmentedControlTab
                          tabContainerStyle={{ width: "50%" }}
                          values={["Performance", "Wins"]}
                          selectedIndex={sortIndex}
                          onTabPress={(index) => setSortIndex(index)}
                          tabsContainerStyle={
                            device == "tablet"
                              ? {
                                  marginLeft: 50,
                                  marginRight: 50,
                                  marginTop: 10,
                                  marginBottom: 10,
                                }
                              : null
                          }
                          tabTextStyle={{
                            fontSize: device != "tablet" ? 14 : 25,
                            fontFamily: "Lilita-One",
                          }}
                        />
                      </View>
                      <View style={{ marginTop: 10, marginBottom: 20 }}>
                        <Text
                          style={[
                            styles.sliderTitle,
                            device == "tablet" ? { fontSize: 28 } : null,
                          ]}
                        >
                          Style:
                        </Text>
                        <SegmentedControlTab
                          values={["Carousel", "Tinder", "Stack"]}
                          selectedIndex={styleIndex}
                          onTabPress={(index) => setStyleIndex(index)}
                          tabsContainerStyle={
                            device == "tablet"
                              ? {
                                  marginLeft: 50,
                                  marginRight: 50,
                                  marginTop: 10,
                                }
                              : null
                          }
                          tabTextStyle={{
                            fontSize: device != "tablet" ? 14 : 25,
                            fontFamily: "Lilita-One",
                          }}
                        />
                      </View>
                    </View>
                  </View>
                )}
                {showFAQ == true && (
                  <View style={{ marginTop: 20 }}>
                    <FaqPage />
                  </View>
                )}
                <TouchableOpacity onPress={() => handleOverallStatsPress()}>
                  <View
                    style={{
                      alignContent: "center",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      {showOverallStats == false && (
                        <Ionicons
                          color="white"
                          size={device != "tablet" ? 25 : 40}
                          name="caret-up"
                        />
                      )}
                      {showOverallStats == true && (
                        <Ionicons
                          color="white"
                          size={device != "tablet" ? 25 : 40}
                          name="caret-down"
                        />
                      )}
                      <Text
                        style={[
                          styles.categoryName,
                          device == "tablet" ? { fontSize: 35 } : null,
                        ]}
                      >
                        Show Overall Player Stats
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {showOverallStats == true && (
                  <View style={{ marginTop: 20 }}>
                    <Text
                      style={[
                        styles.categoryName,
                        {
                          fontSize: device != "tablet" ? 14 : 25,
                          marginLeft: "auto",
                          marginRight: "auto",
                        },
                      ]}
                    >
                      Percentage Unlocked
                    </Text>
                    <Text
                      style={[
                        styles.categoryName,
                        {
                          marginTop: device != "tablet" ? 4 : 10,
                          marginBottom: 5,
                          fontSize: device != "tablet" ? 13 : 20,
                          marginLeft: "auto",
                          marginRight: "auto",
                        },
                      ]}
                    >
                      {Math.round(playerNums.overallPercentage * 100) + " %"}
                    </Text>
                    <View>
                      <Progress.Bar
                        animated={true}
                        progress={playerNums.overallPercentage}
                        height={device != "tablet" ? 10 : 20}
                        width={device != "tablet" ? 200 : 300}
                        style={{
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: device != "tablet" ? 10 : 30,
                      }}
                    >
                      <View>
                        <Text
                          style={[
                            styles.categoryName,
                            {
                              marginTop: 4,
                              marginBottom: 5,
                              fontSize: device != "tablet" ? 10 : 20,
                            },
                          ]}
                        >
                          Brawlers
                        </Text>
                        <Image
                          style={[
                            styles.imageProgress,
                            device == "tablet"
                              ? {
                                  width: 60,
                                  height: 60,
                                  marginTop: 5,
                                  marginBottom: 5,
                                }
                              : null,
                          ]}
                          source={require("../../assets/icons/brawler.png")}
                        />
                        <Text
                          style={[
                            styles.categoryName,
                            styles.number,
                            device == "tablet" ? { fontSize: 18 } : null,
                          ]}
                        >
                          {Math.round(
                            (playerNums.numberOfBrawlers /
                              globalNumbers.numberOfBrawlers) *
                              100
                          ) + "%"}
                        </Text>
                        <Progress.Bar
                          animated={true}
                          progress={
                            playerNums.numberOfBrawlers /
                            globalNumbers.numberOfBrawlers
                          }
                          height={device != "tablet" ? 4 : 6}
                          width={40}
                          style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        />
                        <Text
                          style={[
                            styles.categoryName,
                            styles.number,
                            device == "tablet"
                              ? { fontSize: 18, marginTop: 10 }
                              : null,
                          ]}
                        >
                          {playerNums.numberOfBrawlers +
                            "/" +
                            globalNumbers.numberOfBrawlers}
                        </Text>
                      </View>
                      <View style={{ marginLeft: 20 }}>
                        <Text
                          style={[
                            styles.categoryName,
                            {
                              marginTop: 4,
                              marginBottom: 5,
                              fontSize: device != "tablet" ? 10 : 20,
                            },
                          ]}
                        >
                          Star Powers
                        </Text>
                        <Image
                          style={[
                            styles.imageProgress,
                            device == "tablet"
                              ? {
                                  width: 60,
                                  height: 60,
                                  marginTop: 5,
                                  marginBottom: 5,
                                }
                              : null,
                          ]}
                          source={require("../../assets/icons/starPower.png")}
                        />
                        <Text
                          style={[
                            styles.categoryName,
                            styles.number,
                            device == "tablet" ? { fontSize: 18 } : null,
                          ]}
                        >
                          {Math.round(
                            (playerNums.numberOfStarPowers /
                              globalNumbers.numberOfStarPowers) *
                              100
                          ) + "%"}
                        </Text>
                        <Progress.Bar
                          animated={true}
                          progress={
                            playerNums.numberOfStarPowers /
                            globalNumbers.numberOfStarPowers
                          }
                          height={device != "tablet" ? 4 : 6}
                          width={40}
                          style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        />
                        <Text
                          style={[
                            styles.categoryName,
                            styles.number,
                            device == "tablet"
                              ? { fontSize: 18, marginTop: 10 }
                              : null,
                          ]}
                        >
                          {playerNums.numberOfStarPowers +
                            "/" +
                            globalNumbers.numberOfStarPowers}
                        </Text>
                      </View>
                      <View style={{ marginLeft: 20 }}>
                        <Text
                          style={[
                            styles.categoryName,
                            {
                              marginTop: 4,
                              marginBottom: 5,
                              fontSize: device != "tablet" ? 10 : 20,
                            },
                          ]}
                        >
                          Gadgets
                        </Text>
                        <Image
                          style={[
                            styles.imageProgress,
                            device == "tablet"
                              ? {
                                  width: 60,
                                  height: 60,
                                  marginTop: 5,
                                  marginBottom: 5,
                                }
                              : null,
                          ]}
                          source={require("../../assets/icons/gadget.png")}
                        />
                        <Text
                          style={[
                            styles.categoryName,
                            styles.number,
                            device == "tablet" ? { fontSize: 18 } : null,
                          ]}
                        >
                          {Math.round(
                            (playerNums.numberOfGadgets /
                              globalNumbers.numberOfGadgets) *
                              100
                          ) + "%"}
                        </Text>
                        <Progress.Bar
                          animated={true}
                          progress={
                            playerNums.numberOfGadgets /
                            globalNumbers.numberOfGadgets
                          }
                          height={device != "tablet" ? 4 : 6}
                          width={40}
                          style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        />
                        <Text
                          style={[
                            styles.categoryName,
                            styles.number,
                            device == "tablet"
                              ? { fontSize: 18, marginTop: 10 }
                              : null,
                          ]}
                        >
                          {playerNums.numberOfGadgets +
                            "/" +
                            globalNumbers.numberOfGadgets}
                        </Text>
                      </View>
                    </View>
                    <View style={{ marginTop: 20 }}>
                      <Text
                        style={[
                          styles.categoryName,
                          {
                            fontSize: device != "tablet" ? 14 : 25,
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: device != "tablet" ? 0 : 15,
                          },
                        ]}
                      >
                        Average Trophies Per Brawler
                      </Text>
                      <Text
                        style={[
                          styles.categoryName,
                          {
                            fontSize: device != "tablet" ? 13 : 20,
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: device != "tablet" ? 5 : 8,
                          },
                        ]}
                      >
                        {playerAvgs.averageTrophies + " Trophies"}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          marginLeft: "auto",
                          marginRight: "auto",
                          marginTop: 10,
                        }}
                      >
                        <View style={{}}>
                          <Text
                            style={[
                              styles.categoryName,
                              {
                                marginTop: 4,
                                marginBottom: 5,
                                fontSize: device != "tablet" ? 10 : 20,
                              },
                            ]}
                          >
                            3 vs 3
                          </Text>
                          <Image
                            style={[
                              styles.imageProgress,
                              {
                                width: device != "tablet" ? 40 : 80,
                                height: device != "tablet" ? 20 : 40,
                                marginBottom: 10,
                                marginTop: device != "tablet" ? 5 : 15,
                              },
                            ]}
                            source={require("../../assets/icons/teams.png")}
                          />
                          <Text
                            style={[
                              styles.categoryName,
                              styles.number,
                              device == "tablet" ? { fontSize: 17 } : null,
                            ]}
                          >
                            {playerAvgs.avg3vs3Victories + "%"}
                          </Text>
                          <Progress.Bar
                            animated={true}
                            progress={playerAvgs.avg3vs3Victories / 100}
                            height={device != "tablet" ? 4 : 6}
                            width={40}
                            style={{
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                          />
                        </View>
                        <View style={{ marginLeft: 35 }}>
                          <Text
                            style={[
                              styles.categoryName,
                              {
                                marginTop: 4,
                                marginBottom: 5,
                                fontSize: device != "tablet" ? 10 : 20,
                                marginLeft: "auto",
                                marginRight: "auto",
                              },
                            ]}
                          >
                            Duo
                          </Text>
                          <Image
                            style={[
                              styles.imageProgress,
                              device == "tablet"
                                ? {
                                    width: 65,
                                    height: 65,
                                  }
                                : null,
                            ]}
                            source={require("../../assets/icons/duoShowdown.png")}
                          />
                          <Text
                            style={[
                              styles.categoryName,
                              styles.number,
                              device == "tablet" ? { fontSize: 17 } : null,
                            ]}
                          >
                            {playerAvgs.avgDuoVictories + "%"}
                          </Text>
                          <Progress.Bar
                            animated={true}
                            progress={playerAvgs.avgDuoVictories / 100}
                            height={device != "tablet" ? 4 : 6}
                            width={40}
                            style={{
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                          />
                        </View>
                        <View style={{ marginLeft: 35 }}>
                          <Text
                            style={[
                              styles.categoryName,
                              {
                                marginTop: 4,
                                marginBottom: 5,
                                fontSize: device != "tablet" ? 10 : 20,
                                marginLeft: "auto",
                                marginRight: "auto",
                              },
                            ]}
                          >
                            Solo
                          </Text>
                          <Image
                            style={[
                              styles.imageProgress,
                              device == "tablet"
                                ? {
                                    width: 65,
                                    height: 65,
                                  }
                                : null,
                            ]}
                            source={require("../../assets/icons/showdown.png")}
                          />
                          <Text
                            style={[
                              styles.categoryName,
                              styles.number,
                              device == "tablet" ? { fontSize: 17 } : null,
                            ]}
                          >
                            {playerAvgs.avgSoloVictories + "%"}
                          </Text>
                          <Progress.Bar
                            animated={true}
                            progress={playerAvgs.avgSoloVictories / 100}
                            height={device != "tablet" ? 4 : 6}
                            width={40}
                            style={{
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                )}
                <View style={{ marginTop: 30 }}>
                  <View style={{ marginLeft: 15, marginRight: 15 }}>
                    <SegmentedControlTab
                      values={typesKey}
                      enabled={typesKey.length > 1 ? true : false}
                      selectedIndex={typeIndex}
                      onTabPress={(index) => setTypeIndex(index)}
                      tabsContainerStyle={
                        device == "tablet"
                          ? {
                              marginLeft: 50,
                              marginRight: 50,
                              marginTop: 10,
                              marginBottom: 10,
                            }
                          : null
                      }
                      tabTextStyle={{
                        fontSize: device != "tablet" ? 14 : 25,
                        fontFamily: "Lilita-One",
                      }}
                    />
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <WinLossModule type={typesKey[typeIndex]} />
                  </View>
                  <View style={{ marginTop: 18, marginBottom: 80 }}>
                    <Text
                      style={[
                        styles.categoryName,
                        device == "tablet"
                          ? { fontSize: 30, marginLeft: 10 }
                          : null,
                      ]}
                    >
                      Player Stats by Mode
                    </Text>
                    <CarouselModule
                      dataType="mode"
                      style={styleIndex}
                      sort={sortIndex}
                    />
                    <Text
                      style={[
                        styles.categoryName,
                        device == "tablet"
                          ? { fontSize: 30, marginLeft: 10 }
                          : null,
                      ]}
                    >
                      Player Stats by Map
                    </Text>
                    <CarouselModule
                      dataType="map"
                      style={styleIndex}
                      sort={sortIndex}
                    />
                    <Text
                      style={[
                        styles.categoryName,
                        device == "tablet"
                          ? { fontSize: 30, marginLeft: 10 }
                          : null,
                      ]}
                    >
                      Player Stats by Brawler
                    </Text>
                    <CarouselModule
                      dataType="brawler"
                      style={styleIndex}
                      sort={sortIndex}
                    />
                    <View style={{ marginBottom: 50 }}>
                      <Text
                        style={[
                          styles.categoryName,
                          device == "tablet"
                            ? { fontSize: 30, marginLeft: 10 }
                            : null,
                        ]}
                      >
                        Player Stats by Teams
                      </Text>
                      <CarouselModule
                        dataType="team"
                        style={styleIndex}
                        sort={sortIndex}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : null}
      {(playerStats === "no data" ||
        playerStats === { season: {} } ||
        playerStats === undefined) &&
      playerID ? (
        <ImageBackground
          source={imageBackground}
          style={[styles.imageBackground]}
          blurRadius={2}
        >
          <View style={[styles.nameContainer, { top: -200 }]}>
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
                onPress={() => {
                  handleReset();
                }}
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
          <Text style={[styles.name, { marginTop: 10, fontSize: 20 }]}>
            {`If you are seeing this and you shouldn't be, reload the app. `}
          </Text>
        </ImageBackground>
      ) : null}
      {!playerID ? <ReloadPage /> : null}
      {moreInfoCarouselOpen !== false && <PlayerStatsMoreInfo />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageProgress: {
    width: 35,
    height: 35,
    marginLeft: "auto",
    marginRight: "auto",
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
  number: {
    marginTop: 4,
    marginBottom: 4,
    fontSize: 10,
    marginLeft: "auto",
    marginRight: "auto",
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
