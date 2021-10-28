import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  BackHandler,
  Dimensions,
} from "react-native";

import {
  getBrawlerImage,
  getBrawlerName,
  getMapImage,
  getMapName,
  getModeImage,
} from "../../lib/getAssetsFunctions";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import SegmentedControlTab from "react-native-segmented-control-tab";

import { moreInfoEventClosed } from "../../store/reducers/uiReducerNoPersist";
import colors from "../../config/colors";

import performanceImg from "../../assets/explanations/performance.png";
import pickRateImg from "../../assets/explanations/pickRate.png";
import trophy1 from "../../assets/icons/trophy1.png";
import trophy2 from "../../assets/icons/trophy2.png";
import trophy3 from "../../assets/icons/trophy3.png";
import trophyLoss1 from "../../assets/icons/trophyLoss1.png";
import trophyLoss2 from "../../assets/icons/trophyLoss2.png";
import trophyLoss3 from "../../assets/icons/trophyLoss3.png";
import { getTranslation } from "../../lib/apiDB";
// const deviceId = Expo.Constants.deviceId;
// console.log("oh hello", deviceId);
const width = Dimensions.get("window").width;
export default function EventsMoreInfo() {
  const device = useSelector((state) => state.uiReducerNoPersist.deviceType);
  const handleReturn = () => {
    dispatch(moreInfoEventClosed());
  };

  useEffect(() => {
    const backAction = () => {
      handleReturn();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => {
      backHandler.remove();
    };
  }, []);
  const dispatch = useDispatch();
  const carouselInfo = useSelector((state) => state.uiReducerNoPersist);
  const brawlersInfo = useSelector(
    (state) => state.brawlifyReducer.brawlersList
  );

  const [typeIndex, setTypeIndex] = useState(
    carouselInfo.sortedBrawlers == undefined &&
      carouselInfo.sortedTeams != undefined
      ? 1
      : 0
  );
  const [showAdvancedPerformance, setShowAdvancedPerformance] = useState(false);

  // console.log(carouselInfo.sortedTeams);
  let topPointsBrawlers = undefined;
  let totalCountBrawlers = 0;
  let totalNumberOfBrawlers = 0;
  let topPointsTeams = undefined;
  let totalCountTeams = 0;
  // console.log(444, carouselInfo.starPowers_gadgets_votes);
  if (carouselInfo.sortedBrawlers != undefined) {
    topPointsBrawlers = carouselInfo.sortedBrawlers[0].points;
    carouselInfo.sortedBrawlers.map((brawler) => {
      totalNumberOfBrawlers++;
      totalCountBrawlers += parseInt(brawler.count);
    });
  }
  if (
    carouselInfo.sortedTeams != undefined &&
    carouselInfo.sortedTeams.length !== 0
  ) {
    topPointsTeams = carouselInfo.sortedTeams[0].points;
    carouselInfo.sortedTeams.map(
      (team) => (totalCountTeams += parseInt(team.count))
    );
  }
  let voteString = getTranslation("1 vote = no ads for 1 hour");
  // console.log(44, voteString, voteString.length);
  let brawlerStarPowers_Gadgets = {};

  const handleVote = (vote) => {};

  const listItem = ({ item, index }) => {
    let brawlerindexImage = null;

    let [starPower1_votes, starPower2_votes, gadget1_votes, gadget2_votes] = [
      null,
      null,
      null,
      null,
    ];
    if (typeIndex == 0) {
      //brawlify brawler list
      
    }

    if (index <= totalNumberOfBrawlers) {
      // console.log(index, totalNumberOfBrawlers);

      if (index <= totalNumberOfBrawlers * 0.1) {
        brawlerindexImage = trophy3;
      } else if (index <= totalNumberOfBrawlers * 0.25) {
        brawlerindexImage = trophy2;
      } else if (index <= totalNumberOfBrawlers * 0.5) {
        brawlerindexImage = trophy1;
      } else if (index <= totalNumberOfBrawlers * 0.6) {
        brawlerindexImage = trophyLoss1;
      } else if (index <= totalNumberOfBrawlers * 0.75) {
        brawlerindexImage = trophyLoss2;
      } else brawlerindexImage = trophyLoss3;
    }
    let performanceAgainstBrawler = [];
    let performanceAgainstTeam = [];

    if (item.performanceAgainstBrawler) {
      let brawlerKeys = Object.keys(item.performanceAgainstBrawler);
      brawlerKeys.map((key) => {
        performanceAgainstBrawler.push(item.performanceAgainstBrawler[key]);
      });
    }

    // console.log(performanceAgainstBrawler)

    if (item.performanceAgainstTeam) {
      let teamKeys = Object.keys(item.performanceAgainstTeam);
      teamKeys.map((key) => {
        performanceAgainstTeam.push(item.performanceAgainstTeam[key]);
      });
    }

    // console.log(performanceAgainstTeam);

    let performanceBrawlers = Math.round(
      (item.points / topPointsBrawlers) * 100
    );
    let pickRateBrawlers = (
      (parseInt(item.count) / totalCountBrawlers) *
      100
    ).toFixed(
      ((parseInt(item.count) / totalCountBrawlers) * 100).toFixed(0) == 0
        ? 1
        : 0
    );
    let performanceTeams = Math.round((item.points / topPointsTeams) * 100);
    let pickRateTeams = Math.round(
      (parseInt(item.count) / totalCountTeams) * 100
    );
    return (
      <>
        {typeIndex == 0 && (
          <View
            style={
              device == "tablet" ? styles.itemBrawlerTablet : styles.itemBrawler
            }
          >
            <View
              style={{
                width: 15,
                height: 14,
                backgroundColor: "black",
                position: "absolute",
                bottom: 10,
                zIndex: 4,
              }}
            >
              <Text
                style={[
                  device != "tablet" ? styles.stats : styles.statsTablet,
                  {
                    color: "white",
                    fontSize: 10,
                  },
                ]}
              >
                {index + 1}
              </Text>
            </View>
            <Image
              style={[
                device == "tablet"
                  ? styles.brawlerImageTablet
                  : styles.brawlerImage,
              ]}
              source={getBrawlerImage(item.ID)}
            />
            {/* <Text
              style={[
                device != "tablet" ? styles.stats : styles.statsTablet,
                { marginLeft: device != "tablet" ? 20 : 40 },
                performanceBrawlers == 100
                  ? { fontSize: device != "tablet" ? 12 : 23 }
                  : null,
              ]}
            >
              {performanceBrawlers + "%"}
            </Text> */}
            <TouchableOpacity
              onPress={() =>
                setShowAdvancedPerformance(
                  showAdvancedPerformance == false ? true : false
                )
              }
              style={{ marginLeft: width * 0.05 }}
            >
              {showAdvancedPerformance == false && (
                <Image
                  style={
                    device == "tablet"
                      ? styles.trophyImageTablet
                      : styles.trophyImage
                  }
                  source={brawlerindexImage}
                />
              )}
              {showAdvancedPerformance == true && (
                <Text
                  style={[
                    device != "tablet" ? styles.stats : styles.statsTablet,
                    { marginLeft: device != "tablet" ? 2 : 40 },
                    performanceBrawlers == 100
                      ? { fontSize: device != "tablet" ? 12 : 23 }
                      : null,
                  ]}
                >
                  {performanceBrawlers + "%"}
                </Text>
              )}
            </TouchableOpacity>
            <Text
              style={[
                device != "tablet" ? styles.stats : styles.statsTablet,
                {
                  position: "absolute",
                  left: width * 0.3,
                },
              ]}
            >
              {pickRateBrawlers + "%"}
            </Text>
            {brawlerStarPowers_Gadgets[item.ID] && (
              <View style={{ flexDirection: "row", marginLeft: width * 0.22 }}>
                <View style={{ flexDirection: "row" }}>
                  {brawlerStarPowers_Gadgets[item.ID].starPower1 && (
                    <TouchableOpacity
                      style={{
                        alignContent: "center",
                        marginRight: width * 0.06,
                      }}
                      onPress={() => {
                        handleVote("starPower1");
                      }}
                    >
                      <Image
                        source={{
                          uri: brawlerStarPowers_Gadgets[item.ID].starPower1
                            .imageUrl,
                        }}
                        style={{
                          width: 22,
                          height: 22,
                          resizeMode: "contain",
                        }}
                      />
                      <Text
                        style={[
                          device != "tablet"
                            ? {
                                color: colors.primary,
                                fontFamily: "Lilita-One",
                                fontSize: 8,
                                textAlign: "center",
                              }
                            : styles.statsTablet,
                          {},
                        ]}
                      >
                        {starPower1_votes !== null && starPower2_votes !== null
                          ? `${
                              (starPower1_votes /
                                (starPower1_votes + starPower2_votes)) *
                              100
                            }%`
                          : "100%"}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {brawlerStarPowers_Gadgets[item.ID].starPower2 && (
                    <TouchableOpacity
                      style={{
                        alignContent: "center",
                        marginRight: width * 0.06,
                      }}
                      onPress={() => {
                        handleVote("starPower2");
                      }}
                    >
                      <Image
                        source={{
                          uri: brawlerStarPowers_Gadgets[item.ID].starPower2
                            .imageUrl,
                        }}
                        style={{
                          width: 22,
                          height: 22,
                          resizeMode: "contain",
                        }}
                      />
                      <Text
                        style={[
                          device != "tablet"
                            ? {
                                color: colors.primary,
                                fontFamily: "Lilita-One",
                                fontSize: 8,
                                textAlign: "center",
                              }
                            : styles.statsTablet,
                          {},
                        ]}
                      >
                        {starPower1_votes !== null && starPower2_votes !== null
                          ? `${
                              (starPower2_votes /
                                (starPower1_votes + starPower2_votes)) *
                              100
                            }%`
                          : "100%"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={{ flexDirection: "row" }}>
                  {brawlerStarPowers_Gadgets[item.ID].gadget1 && (
                    <TouchableOpacity
                      style={{
                        alignContent: "center",
                        marginRight: width * 0.06,
                      }}
                      onPress={() => {
                        handleVote("gadget1");
                      }}
                    >
                      <Image
                        source={{
                          uri: brawlerStarPowers_Gadgets[item.ID].gadget1
                            .imageUrl,
                        }}
                        style={{
                          width: 22,
                          height: 22,
                          resizeMode: "contain",
                        }}
                      />
                      <Text
                        style={[
                          device != "tablet"
                            ? {
                                color: colors.primary,
                                fontFamily: "Lilita-One",
                                fontSize: 8,
                                textAlign: "center",
                              }
                            : styles.statsTablet,
                          {},
                        ]}
                      >
                        {gadget1_votes !== null && gadget2_votes !== null
                          ? `${
                              (gadget1_votes /
                                (gadget1_votes + gadget2_votes)) *
                              100
                            }%`
                          : "100%"}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {brawlerStarPowers_Gadgets[item.ID].gadget2 && (
                    <TouchableOpacity
                      style={{
                        alignContent: "center",
                      }}
                      onPress={() => {
                        handleVote("gadget2");
                      }}
                    >
                      <Image
                        source={{
                          uri: brawlerStarPowers_Gadgets[item.ID].gadget2
                            .imageUrl,
                        }}
                        style={{
                          width: 22,
                          height: 22,
                          resizeMode: "contain",
                        }}
                      />
                      <Text
                        style={[
                          device != "tablet"
                            ? {
                                color: colors.primary,
                                fontFamily: "Lilita-One",
                                fontSize: 8,
                                textAlign: "center",
                              }
                            : styles.statsTablet,
                          {},
                        ]}
                      >
                        {gadget1_votes !== null && gadget2_votes !== null
                          ? `${
                              (gadget2_votes /
                                (gadget1_votes + gadget2_votes)) *
                              100
                            }%`
                          : "100%"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
        {typeIndex == 1 && (
          <View
            style={device == "tablet" ? styles.itemTeamTablet : styles.itemTeam}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                style={
                  device == "tablet"
                    ? styles.brawlerImageTablet
                    : styles.brawlerImage
                }
                source={getBrawlerImage(item.ID.slice(0, 8))}
              />
              <Image
                style={
                  device == "tablet"
                    ? styles.brawlerImageTablet
                    : styles.brawlerImage
                }
                source={getBrawlerImage(item.ID.slice(10, 18))}
              />
              <Image
                style={
                  device == "tablet"
                    ? styles.brawlerImageTablet
                    : styles.brawlerImage
                }
                source={getBrawlerImage(item.ID.slice(20, 28))}
              />
            </View>

            <Text
              style={[
                device != "tablet" ? styles.stats : styles.statsTablet,
                { marginLeft: device != "tablet" ? 20 : 50 },
                performanceTeams == 100
                  ? { fontSize: device != "tablet" ? 16 : 23 }
                  : null,
              ]}
            >
              {performanceTeams + "%"}
            </Text>
            <Text
              style={[
                device != "tablet" ? styles.stats : styles.statsTablet,
                { position: "absolute", left: device != "tablet" ? 200 : 300 },
              ]}
            >
              {pickRateTeams + "%"}
            </Text>
            {performanceAgainstTeam[0] && (
              <View
                style={{ flexDirection: "row", position: "absolute", right: 0 }}
              >
                <Image
                  style={[
                    device != "tablet"
                      ? styles.brawlerAgainstTeam
                      : styles.brawlerAgainstTablet,
                  ]}
                  source={getBrawlerImage(
                    performanceAgainstTeam[0].ID.slice(0, 8)
                  )}
                />

                <Image
                  style={[
                    device != "tablet"
                      ? styles.brawlerAgainstTeam
                      : styles.brawlerAgainstTablet,
                  ]}
                  source={getBrawlerImage(
                    performanceAgainstTeam[0].ID.slice(10, 18)
                  )}
                />

                <Image
                  style={[
                    device != "tablet"
                      ? styles.brawlerAgainstTeam
                      : styles.brawlerAgainstTablet,
                  ]}
                  source={getBrawlerImage(
                    performanceAgainstTeam[0].ID.slice(20, 28)
                  )}
                />
              </View>
            )}
          </View>
        )}
      </>
    );
  };

  return (
    <>
      {carouselInfo.image && (
        <>
          <SafeAreaView style={styles.container}>
            <TouchableOpacity
              style={{ position: "absolute", left: 5, top: 5 }}
              onPress={() => handleReturn()}
            >
              <Ionicons
                style={styles.icon}
                name="arrow-back-circle"
                size={device != "tablet" ? 50 : 70}
                color={colors.secondary}
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Image
                source={
                  carouselInfo.type == "trophies"
                    ? { uri: carouselInfo.mode }
                    : getModeImage(carouselInfo.mode)
                }
                style={
                  carouselInfo.type == "trophies"
                    ? carouselInfo.mode.includes("Hot")
                      ? { width: 30, height: 35, marginLeft: 5, marginRight: 5 }
                      : carouselInfo.mode.includes("Knock")
                      ? { width: 30, height: 30, marginLeft: 5, marginRight: 5 }
                      : carouselInfo.mode.includes("Gem")
                      ? { width: 30, height: 30, marginLeft: 5, marginRight: 5 }
                      : carouselInfo.mode.includes("Duo")
                      ? { width: 30, height: 30, marginLeft: 5, marginRight: 5 }
                      : carouselInfo.mode.includes("/Show")
                      ? {
                          width: 30,
                          height: 35,
                          marginLeft: 5,
                          marginRight: 5,
                          marginTop: 5,
                        }
                      : {
                          width: 35,
                          height: 30,
                          marginLeft: 5,
                          marginRight: 5,
                          marginBottom: 5,
                        }
                    : { width: 30, height: 30, marginLeft: 5 }
                }
              />
              <Text
                style={[
                  styles.name,
                  {
                    marginRight: width * 0.06,
                    fontSize: device != "tablet" ? 18 : 40,
                  },
                ]}
              >
                {carouselInfo.type == "trophies"
                  ? getMapName(carouselInfo.mapID).length > 21
                    ? getMapName(carouselInfo.mapID).slice(0, 21) + ".."
                    : getMapName(carouselInfo.mapID)
                  : getMapName(carouselInfo.name).length > 21
                  ? getMapName(carouselInfo.name).slice(0, 21) + ".."
                  : getMapName(carouselInfo.name)}
              </Text>
              {/* {console.log(carouselInfo.mode)} */}

              <Image
                source={
                  carouselInfo.type == "trophies"
                    ? { uri: carouselInfo.image }
                    : getMapImage(carouselInfo.image)
                }
                style={{
                  width: device != "tablet" ? 60 : 180,
                  height: device != "tablet" ? 90 : 270,
                  marginTop: 10,
                  marginRight: width * -0.1,
                }}
              />
            </View>
            {!carouselInfo.mode.includes("/Show") && (
              <View
                style={{ width: device != "tablet" ? 300 : 600, marginTop: 10 }}
              >
                <SegmentedControlTab
                  values={["brawlers", "teams"]}
                  enabled={
                    carouselInfo.sortedBrawlers != undefined &&
                    carouselInfo.sortedTeams != undefined
                      ? true
                      : carouselInfo.sortedBrawlers == undefined ||
                        carouselInfo.sortedTeams == undefined
                      ? false
                      : false
                  }
                  selectedIndex={typeIndex}
                  tabTextStyle={{
                    fontSize: device != "tablet" ? 14 : 25,
                    fontFamily: "Lilita-One",
                  }}
                  onTabPress={(index) => {
                    setTypeIndex(index);
                  }}
                  tabStyle={{ height: device != "tablet" ? 30 : 40 }}
                />
              </View>
            )}

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Image
                source={performanceImg}
                style={[
                  device != "tablet"
                    ? {
                        position: "absolute",
                        right: width * 0.2,
                        width: width * 0.19,
                        height: 23,
                      }
                    : styles.columnNameTablet,

                  typeIndex !== 0 ? { right: -12 } : null,
                ]}
              />

              <Image
                source={pickRateImg}
                style={[
                  device != "tablet"
                    ? {
                        position: "absolute",
                        right: width * 0.1,
                        top: width * -0.01,
                        height: 28,
                        width: width * 0.09,
                      }
                    : styles.columnNameTablet,
                  ,
                  typeIndex !== 0 ? { right: width * -0.16 } : null,
                ]}
              />

              <Text
                style={[
                  device != "tablet"
                    ? {
                        color: colors.primary,
                        fontFamily: "Lilita-One",
                        fontSize: 10,
                        position: "absolute",
                        left:
                          voteString.length > 35
                            ? -20
                            : voteString.length > 30
                            ? -5
                            : voteString.length > 26
                            ? 0
                            : 20,
                      }
                    : styles.columnNameTablet,
                  typeIndex !== 0 ? { left: width * 0.2 } : null,
                ]}
              >
                {typeIndex === 0
                  ? voteString
                  : getTranslation("Best Against Team")}
              </Text>
            </View>

            <ScrollView style={{ marginTop: 30 }}>
              <FlatList
                data={
                  typeIndex == 0
                    ? carouselInfo.sortedBrawlers
                    : carouselInfo.sortedTeams
                }
                renderItem={listItem}
                keyExtractor={(item) => item.ID}
              />
            </ScrollView>
          </SafeAreaView>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background2,
    alignItems: "center",
    justifyContent: "space-around",
  },
  stats: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 16,
    textAlign: "center",
  },
  statsTablet: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 30,
    textAlign: "center",
    marginLeft: 10,
  },
  name: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 25,
    textAlign: "center",
  },
  categoryName: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 20,
  },
  itemBrawler: {
    height: 60,
    flex: 1,
    width: width - 20,
    flexDirection: "row",

    alignItems: "center",
    alignContent: "center",
  },
  itemBrawlerTablet: {
    width: 430,
    height: 70,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemTeam: {
    height: 60,
    width: 340,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemTeamTablet: {
    width: 570,
    height: 70,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  trophyImage: {
    width: 35,
    height: 25,
  },
  trophyImageTablet: {
    width: 50,
    height: 50,
  },
  brawlerImage: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  brawlerImageTablet: { width: 50, height: 50, resizeMode: "contain" },
  columnName: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 11,
    marginLeft: 0,
  },
  columnNameTablet: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 20,
    marginLeft: 6,
    marginTop: 20,
  },
  brawlerAgainst: {
    width: 35,
    height: 35,
    borderWidth: 2,
    marginLeft: 2,
  },
  brawlerAgainstTablet: {
    width: 50,
    height: 50,
    borderWidth: 4,
    marginLeft: 4,
  },
  brawlerAgainstTeam: {
    width: 30,
    height: 30,
    borderWidth: 2,
  },
});
