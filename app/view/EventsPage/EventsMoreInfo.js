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
          <View style={styles.itemBrawler}>
            <Image
              style={styles.brawlerImage}
              source={getBrawlerImage(item.ID)}
            />
            <Text
              style={[
                styles.stats,
                { marginLeft: 20 },
                performanceBrawlers == 100 ? { fontSize: 16 } : null,
              ]}
            >
              {performanceBrawlers + "%"}
            </Text>
            <Text style={[styles.stats, { position: "absolute", left: 130 }]}>
              {pickRateBrawlers + "%"}
            </Text>
            {performanceAgainstBrawler[0] && (
              <View
                style={{ flexDirection: "row", position: "absolute", right: 0 }}
              >
                <Image
                  style={[styles.brawlerAgainst, { borderColor: "gold" }]}
                  source={getBrawlerImage(performanceAgainstBrawler[0].ID)}
                />
                {performanceAgainstBrawler[1] && (
                  <Image
                    style={[styles.brawlerAgainst, { borderColor: "silver" }]}
                    source={getBrawlerImage(performanceAgainstBrawler[1].ID)}
                  />
                )}
                {performanceAgainstBrawler[2] && (
                  <Image
                    style={[styles.brawlerAgainst, { borderColor: "#cd7f32" }]}
                    source={getBrawlerImage(performanceAgainstBrawler[2].ID)}
                  />
                )}
              </View>
            )}
          </View>
        )}
        {typeIndex == 1 && (
          <View style={styles.itemTeam}>
            <View style={{ flexDirection: "row" }}>
              <Image
                style={styles.brawlerImage}
                source={getBrawlerImage(item.ID.slice(0, 8))}
              />
              <Image
                style={styles.brawlerImage}
                source={getBrawlerImage(item.ID.slice(10, 18))}
              />
              <Image
                style={styles.brawlerImage}
                source={getBrawlerImage(item.ID.slice(20, 28))}
              />
            </View>

            <Text
              style={[
                styles.stats,
                { marginLeft: 20 },
                performance == 100 ? { fontSize: 16 } : null,
              ]}
            >
              {performanceTeams + "%"}
            </Text>
            <Text style={[styles.stats, { position: "absolute", left: 200 }]}>
              {pickRateTeams + "%"}
            </Text>
            {performanceAgainstTeam[0] && (
              <View
                style={{ flexDirection: "row", position: "absolute", right: 0 }}
              >
                <Image
                  style={[styles.brawlerAgainstTeam]}
                  source={getBrawlerImage(
                    performanceAgainstTeam[0].ID.slice(0, 8)
                  )}
                />

                <Image
                  style={[styles.brawlerAgainstTeam]}
                  source={getBrawlerImage(
                    performanceAgainstTeam[0].ID.slice(10, 18)
                  )}
                />

                <Image
                  style={[styles.brawlerAgainstTeam]}
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
                size={50}
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
              <Text style={[styles.name, { marginRight: 20, fontSize: 18 }]}>
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
                style={{ width: 90, height: 135, marginTop: 10 }}
              />
            </View>
            {!carouselInfo.mode.includes("/Show") && (
              <View style={{ width: 300, marginTop: 10 }}>
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
                  onTabPress={(index) => {
                    setTypeIndex(index);
                  }}
                  tabStyle={{ height: 30 }}
                />
              </View>
            )}

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text
                style={[
                  styles.columnName,
                  carouselInfo.mode.includes("Show") && typeIndex == 0
                    ? { paddingRight: 10 }
                    : typeIndex == 0
                    ? { paddingLeft: 15 }
                    : { paddingLeft: 100 },
                  null,
                ]}
              >
                Performance
              </Text>
              <Text
                style={[
                  styles.columnName,
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
                    styles.columnName,
                    typeIndex == 0 ? { paddingLeft: 30 } : { paddingLeft: 5 },
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
  itemTeam: {
    height: 60,
    width: 340,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  brawlerImage: {
    width: 35,
    height: 35,
  },
  columnName: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 11,
    marginLeft: 6,
  },
  brawlerAgainst: {
    width: 35,
    height: 35,
    borderWidth: 2,
    marginLeft: 2,
  },
  brawlerAgainstTeam: {
    width: 30,
    height: 30,
    borderWidth: 2,
  },
});
