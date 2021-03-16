import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../config/colors";
import {
  modesByPerformance,
  modesByWins,
  brawlersByPerformance,
  brawlersByWins,
  processPlayerStats,
  mapsByPerformance,
  mapsByWins,
  teamsByPerformance,
  teamsByWins,
} from "./CarouselData";

import moreInfoPage from "./moreInfoPage";

export default function CarouselModule({ dataType, style, sort }) {
  //this is to stop these values re rendering each time the user changes module settings
  const modesPerformance = modesByPerformance.filter(
    (v, i, a) => a.findIndex((t) => t.title === v.title) === i
  );
  //console.log(modesByPerformance);
  const modesWins = modesByWins.filter(
    (v, i, a) => a.findIndex((t) => t.title === v.title) === i
  );
  // console.log(modesWins);
  const brawlersPerformance = brawlersByPerformance.filter(
    (v, i, a) => a.findIndex((t) => t.title === v.title) === i
  );
  const brawlersWins = brawlersByWins.filter(
    (v, i, a) => a.findIndex((t) => t.title === v.title) === i
  );
  // console.log(brawlersWins)
  const mapsPerformance = mapsByPerformance.filter(
    (v, i, a) => a.findIndex((t) => t.title === v.title) === i
  );
  const mapsWins = mapsByWins.filter(
    (v, i, a) => a.findIndex((t) => t.title === v.title) === i
  );
  const teamsPerformance = teamsByPerformance.filter(
    (v, i, a) => a.findIndex((t) => t.title === v.title) === i
  );
  const teamsWins = teamsByWins.filter(
    (v, i, a) => a.findIndex((t) => t.title === v.title) === i
  );

  const carouselRef = useRef(null);
  const [toggleStyle, setToggleStyle] = useState(false);

  const goForward = () => {
    carouselRef.current.snapToNext();
  };

  const { width: screenWidth } = Dimensions.get("window");

  const getBackgroundColor = (item) => {
    if (item.winRatio >= 7) return "#69b34c";
    else if (item.winRatio >= 5) return "#acb334";
    else if (item.winRatio >= 3) return "#fab733";
    else if (item.winRatio >= 2) return "#ff4e11";
    else if (item.winRatio >= 1) return "#ff0d0d";
    else if (item.winRatio < 1) return "#B50A0A";
  };

  const renderItem = ({ item, index }) => {
    // console.log("new");
    // console.log(item);
    return (
      <View style={styles.item}>
        <View
          style={[
            {
              backgroundColor: getBackgroundColor(item),
              borderRadius: 5,
              paddingTop: 10,
              paddingLeft: 10,
              paddingRight: 10,
              paddingBottom: 5,
            },
            //this is where you can change height of each item
            dataType === "team" ? styles.teamItem : null,
            dataType !== "map" ? { height: 250 } : { height: 330 },
          ]}
        >
          <Text
            style={[
              styles.title,
              dataType === "team" ? { fontSize: 14 } : null,
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <View
            style={{ marginLeft: "auto", marginRight: "auto", marginTop: 10 }}
          >
            {dataType !== "team" && (
              <Image
                source={item.image}
                containerStyle={styles.imageContainer}
                style={[dataType !== "map" ? styles.image : styles.mapImage]}
              />
            )}
            {dataType === "team" && (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginTop: 30,
                  marginBottom: 70,
                }}
              >
                <Image source={item.brawler1} style={styles.teamImage} />
                <Image source={item.brawler2} style={styles.teamImage} />
                <Image source={item.brawler3} style={styles.teamImage} />
              </View>
            )}
          </View>

          <View style={{ marginTop: 5 }}>
            {item.duration ? (
              <Text style={[styles.performance, { marginTop: 5 }]}>
                {"GTA: " + item.duration.toFixed(1) + "s"}
              </Text>
            ) : null}
            {item.spRatio ? (
              <Text style={[styles.performance, { marginTop: 0 }]}>
                {"SPR: " + item.spRatio.toFixed(2) * 100 + "%"}
              </Text>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Text style={styles.winLoss}>{"Wins: " + item.wins}</Text>
            <View
              style={[
                {
                  flexDirection: "row",
                  alignContent: "center",
                },
                item.duration && item.spRatio
                  ? { marginTop: 25 }
                  : item.duration || item.spRatio
                  ? { marginTop: 43 }
                  : { marginTop: 65 },
              ]}
            >
              <Text style={styles.winRatio}>
                {"Performance:  " + item.winRatio.toFixed(1)}
              </Text>
            </View>
            <Text style={styles.winLoss}>{"Losses: " + item.losses}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, dataType === "map" ? styles.mapItem : null]}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <Carousel
          shouldOptimizeUpdates={false}
          layout={style === 0 ? "default" : style === 1 ? "tinder" : "stack"}
          layoutCardOffset={30}
          ref={carouselRef}
          sliderWidth={390}
          itemWidth={300}
          data={
            sort === 0
              ? dataType === "mode"
                ? modesPerformance
                : dataType === "brawler"
                ? brawlersPerformance
                : dataType === "map"
                ? mapsPerformance
                : dataType === "team"
                ? teamsPerformance
                : null
              : dataType === "mode"
              ? modesWins
              : dataType === "brawler"
              ? brawlersWins
              : dataType === "map"
              ? mapsWins
              : dataType === "team"
              ? teamsWins
              : null
          }
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    height: 310,
  },
  item: {
    width: 250,

    marginLeft: 30,
  },
  mapItem: {
    height: 400,
  },
  teamItem: {
    height: 240,
  },
  imageContainer: {
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 8,
  },
  image: {
    width: 100,
    height: 100,
  },
  teamImage: {
    width: 70,
    height: 70,
  },

  mapImage: {
    width: 160 / 1.3,
    height: 240 / 1.3,
  },
  text: {},
  title: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 22,

    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  performance: {
    marginTop: 4,
    color: colors.secondary,
    fontFamily: "Lilita-One",
    fontSize: 13,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 0,
    textAlign: "center",
  },
  winRatio: {
    marginTop: 4,
    color: colors.secondary,
    fontFamily: "Lilita-One",
    fontSize: 13,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textAlign: "center",
  },
  winLoss: {
    color: colors.secondary,
    fontFamily: "Lilita-One",
    fontSize: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 0,
  },
});
