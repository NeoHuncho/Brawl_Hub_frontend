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
  getAssets();
  const dispatch = useDispatch();
  const battleLogReducer = useSelector((state) => state.battleLogReducer);
  const playerName = battleLogReducer.name;
  const season = battleLogReducer.season;
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
  // console.log(playerAvgs, playerNums);

  const playerStats = battleLogReducer.playerStats;

  const preferencesCarouselStored = useSelector(
    (state) => state.uiReducerPersist
  );

  const iconImage = getIconImage(icon);

  let seasons = null;
  let types = null;
  let sKeys = null;
  let seasonsKey = null;
  let typesKey = null;
  // console.log(playerID);
  if (
    playerStats !== "no data" &&
    playerStats !== { season: {} } &&
    playerStats !== undefined
  ) {
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

  if (
    playerStats !== "no data" &&
    playerStats != { season: {} } &&
    playerStats !== undefined
  ) {
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
    // console.log(typesKey[typeIndex])
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

  const setTest = async () => {
    await setTestDeviceIDAsync("EMULATOR");
  };
  setTest();
  //

  //this will intialise the creation of the data for the carousels

  return (
    <>
      <AdMobBanner
        bannerSize="smartBanner"
        adUnitID="ca-app-pub-3940256099942544/6300978111"
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
                      "Your stats will automatically update daily, if you open Brawl Hub at least once every 3 DAYS!"
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
                  <Text style={styles.name}>{playerName}</Text>
                  <TouchableOpacity onPress={() => handleReset()}>
                    <Ionicons
                      style={styles.icon}
                      name="exit"
                      size={24}
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
                      size={24}
                      color={colors.secondary}
                    />
                    <Text
                      style={[
                        styles.categoryName,
                        {
                          textAlign: "center",
                          fontSize: 25,
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
                          fontSize: 25,
                        },
                      ]}
                    >
                      F.A.Q
                    </Text>
                    <Ionicons
                      style={{ marginLeft: 5, marginTop: 5 }}
                      name="book"
                      size={24}
                      color={colors.secondary}
                    />
                  </TouchableOpacity>
                </View>
                {showSettings == true && (
                  <View style={{ marginTop: 20 }}>
                    <Text style={styles.sliderTitle}>Choose Season:</Text>
                    <View style={{ marginLeft: 20, marginRight: 20 }}>
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
                        <Ionicons color="white" size={25} name="caret-up" />
                      )}
                      {showOverallStats == true && (
                        <Ionicons color="white" size={25} name="caret-down" />
                      )}
                      <Text style={styles.categoryName}>
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
                          fontSize: 14,
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
                          marginTop: 4,
                          marginBottom: 5,
                          fontSize: 13,
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
                        height={10}
                        width={200}
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
                              fontSize: 10,
                            },
                          ]}
                        >
                          Brawlers
                        </Text>
                        <Image
                          style={styles.imageProgress}
                          source={require("../../assets/icons/brawler.png")}
                        />
                        <Text style={[styles.categoryName, styles.number]}>
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
                          height={4}
                          width={40}
                          style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        />
                        <Text style={[styles.categoryName, styles.number]}>
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
                              fontSize: 10,
                            },
                          ]}
                        >
                          Star Powers
                        </Text>
                        <Image
                          style={styles.imageProgress}
                          source={require("../../assets/icons/starPower.png")}
                        />
                        <Text style={[styles.categoryName, styles.number]}>
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
                          height={4}
                          width={40}
                          style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        />
                        <Text style={[styles.categoryName, styles.number]}>
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
                              fontSize: 10,
                            },
                          ]}
                        >
                          Gadgets
                        </Text>
                        <Image
                          style={styles.imageProgress}
                          source={require("../../assets/icons/gadget.png")}
                        />
                        <Text style={[styles.categoryName, styles.number]}>
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
                          height={4}
                          width={40}
                          style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        />
                        <Text style={[styles.categoryName, styles.number]}>
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
                            fontSize: 14,
                            marginLeft: "auto",
                            marginRight: "auto",
                          },
                        ]}
                      >
                        Average Trophies Per Brawler
                      </Text>
                      <Text
                        style={[
                          styles.categoryName,
                          {
                            fontSize: 13,
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: 5,
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
                                fontSize: 10,
                              },
                            ]}
                          >
                            3 vs 3
                          </Text>
                          <Image
                            style={[
                              styles.imageProgress,
                              {
                                width: 40,
                                height: 20,
                                marginBottom: 10,
                                marginTop: 5,
                              },
                            ]}
                            source={require("../../assets/icons/teams.png")}
                          />
                          <Text style={[styles.categoryName, styles.number]}>
                            {playerAvgs.avg3vs3Victories + "%"}
                          </Text>
                          <Progress.Bar
                            animated={true}
                            progress={playerAvgs.avg3vs3Victories / 100}
                            height={4}
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
                                fontSize: 10,
                                marginLeft: "auto",
                                marginRight: "auto",
                              },
                            ]}
                          >
                            Duo
                          </Text>
                          <Image
                            style={styles.imageProgress}
                            source={require("../../assets/icons/duoShowdown.png")}
                          />
                          <Text style={[styles.categoryName, styles.number]}>
                            {playerAvgs.avgDuoVictories + "%"}
                          </Text>
                          <Progress.Bar
                            animated={true}
                            progress={playerAvgs.avgDuoVictories / 100}
                            height={4}
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
                                fontSize: 10,
                                marginLeft: "auto",
                                marginRight: "auto",
                              },
                            ]}
                          >
                            Solo
                          </Text>
                          <Image
                            style={styles.imageProgress}
                            source={require("../../assets/icons/showdown.png")}
                          />
                          <Text style={[styles.categoryName, styles.number]}>
                            {playerAvgs.avgSoloVictories + "%"}
                          </Text>
                          <Progress.Bar
                            animated={true}
                            progress={playerAvgs.avgSoloVictories / 100}
                            height={4}
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
                    />
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <WinLossModule type={typesKey[typeIndex]} />
                  </View>
                  <View style={{ marginTop: 18, marginBottom: 80 }}>
                    <Text style={styles.categoryName}>
                      Player Stats by Mode
                    </Text>
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
                    <View style={{ marginBottom: 50 }}>
                      <Text style={styles.categoryName}>
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
