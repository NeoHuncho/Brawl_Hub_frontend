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

  const [typeIndex, setTypeIndex] = useState(
    carouselInfo.sortedBrawlers == undefined &&
      carouselInfo.sortedTeams != undefined
      ? 1
      : 0
  );
  // console.log(carouselInfo.sortedTeams);

  let topPointsBrawlers = undefined;
  let totalCountBrawlers = 0;
  let topPointsTeams = undefined;
  let totalCountTeams = 0;

  if (carouselInfo.sortedBrawlers != undefined) {
    topPointsBrawlers = carouselInfo.sortedBrawlers[0].points;
    carouselInfo.sortedBrawlers.map(
      (brawler) => (totalCountBrawlers += parseInt(brawler.count))
    );
  }
  if (carouselInfo.sortedTeams != undefined) {
    topPointsTeams = carouselInfo.sortedTeams[0].points;
    carouselInfo.sortedTeams.map(
      (team) => (totalCountTeams += parseInt(team.count))
    );
  }

  const listItem = ({ item }) => {
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
            <Image
              style={
                device == "tablet"
                  ? styles.brawlerImageTablet
                  : styles.brawlerImage
              }
              source={getBrawlerImage(item.ID)}
            />
            <Text
              style={[
                device != "tablet" ? styles.stats : styles.statsTablet,
                { marginLeft: device != "tablet" ? 20 : 40 },
                performanceBrawlers == 100
                  ? { fontSize: device != "tablet" ? 16 : 23 }
                  : null,
              ]}
            >
              {performanceBrawlers + "%"}
            </Text>
            <Text
              style={[
                device != "tablet" ? styles.stats : styles.statsTablet,
                { position: "absolute", left: device != "tablet" ? 130 : 180 },
              ]}
            >
              {pickRateBrawlers + "%"}
            </Text>
            {performanceAgainstBrawler[0] && (
              <View
                style={{ flexDirection: "row", position: "absolute", right: 0 }}
              >
                <Image
                  style={[
                    device != "tablet"
                      ? styles.brawlerAgainst
                      : styles.brawlerAgainstTablet,
                    { borderColor: "gold" },
                  ]}
                  source={getBrawlerImage(performanceAgainstBrawler[0].ID)}
                />
                {performanceAgainstBrawler[1] && (
                  <Image
                    style={[
                      device != "tablet"
                        ? styles.brawlerAgainst
                        : styles.brawlerAgainstTablet,
                      { borderColor: "silver" },
                    ]}
                    source={getBrawlerImage(performanceAgainstBrawler[1].ID)}
                  />
                )}
                {performanceAgainstBrawler[2] && (
                  <Image
                    style={[
                      device != "tablet"
                        ? styles.brawlerAgainst
                        : styles.brawlerAgainstTablet,
                      { borderColor: "#cd7f32" },
                    ]}
                    source={getBrawlerImage(performanceAgainstBrawler[2].ID)}
                  />
                )}
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                  { marginRight: 20, fontSize: device != "tablet" ? 18 : 40 },
                ]}
              >
                {carouselInfo.type == "trophies"
                  ? carouselInfo.name
                  : getMapName(carouselInfo.name)}
              </Text>
              {console.log(carouselInfo.mode)}

              <Image
                source={
                  carouselInfo.type == "trophies"
                    ? { uri: carouselInfo.image }
                    : getMapImage(carouselInfo.image)
                }
                style={{
                  width: device != "tablet" ? 90 : 180,
                  height: device != "tablet" ? 135 : 270,
                  marginTop: 10,
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
              <Text
                style={[
                  device != "tablet"
                    ? styles.columnName
                    : styles.columnNameTablet,
                  carouselInfo.mode.includes("Show") && typeIndex == 0
                    ? { paddingRight: 10 }
                    : typeIndex == 0
                    ? { paddingLeft: 15 }
                    : { paddingLeft: device != "tablet" ? 100 : 150 },
                  null,
                ]}
              >
                Performance
              </Text>
              <Text
                style={[
                  device != "tablet"
                    ? styles.columnName
                    : styles.columnNameTablet,
                  ,
                  carouselInfo.mode.includes("Show")
                    ? { paddingRight: 80 }
                    : typeIndex == 0
                    ? { paddingLeft: 10 }
                    : { paddingLeft: 5 },
                ]}
              >
                Pick Rate
              </Text>
              {!carouselInfo.mode.includes("Show") && (
                <Text
                  style={[
                    device != "tablet"
                      ? styles.columnName
                      : styles.columnNameTablet,
                    typeIndex == 0
                      ? { paddingLeft: 30 }
                      : { paddingLeft: device != "tablet" ? 5 : 50 },
                  ]}
                >
                  Best Against
                </Text>
              )}
            </View>

            <ScrollView>
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
  },
  stats: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 20,
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
    width: 300,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
  brawlerImage: {
    width: 35,
    height: 35,
  },
  brawlerImageTablet: { width: 50, height: 50 },
  columnName: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 11,
    marginLeft: 6,
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
