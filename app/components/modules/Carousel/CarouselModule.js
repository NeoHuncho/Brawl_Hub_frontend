import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  Image,
} from "react-native";



import Carousel from "react-native-snap-carousel";
import colors from "../../../config/colors";
import {
  modesByPerformance,
  modesByWins,
  brawlersByPerformance,
  brawlersByWins,
  processPlayerStats,
  mapsByPerformance,
  teamsByPerformance,
  teamsByWins,
} from "./CarouselData";


export default function CarouselModule({ dataType }) {
  console.log(brawlersByPerformance);

  const carouselRef = useRef(null);
  const [toggleStyle, setToggleStyle] = useState(false);

  const goForward = () => {
    carouselRef.current.snapToNext();
  };

  const { width: screenWidth } = Dimensions.get("window");

  const getBackgroundColor = (item) => {
    if (item.winRatio >= 7) return "#009965";
    else if (item.winRatio >= 5) return "#0b7649";
    else if (item.winRatio >= 3) return "#59260b";
    else if (item.winRatio >= 2) return "#af593e";
    else if (item.winRatio >= 1) return "#a52a2b";
    else if (item.winRatio < 1) return "#7c0a02";
  };

  const renderItem = ({ item, index }) => {
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
            dataType === "team" ? styles.teamItem : null,
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
                  marginTop: 40,
                  marginBottom: 108,
                }}
              >
                <Image source={item.brawler1} style={styles.teamImage} />
                <Image source={item.brawler2} style={styles.teamImage} />
                <Image source={item.brawler3} style={styles.teamImage} />
              </View>
            )}
          </View>
          <View style={{ marginTop: 10 }}></View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.winLoss}>{"Wins: " + item.wins}</Text>
            <View>
              <Text style={styles.performance}>performance:</Text>
              <Text style={styles.winRatio}>{item.winRatio.toFixed(1)}</Text>
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
          layout={"tinder"}
          layoutCardOffset={30}
          ref={carouselRef}
          sliderWidth={390}
          itemWidth={300}
          data={
            dataType === "mode"
              ? modesByPerformance
              : dataType === "brawler"
              ? brawlersByPerformance
              : dataType === "map"
              ? mapsByPerformance
              : dataType === "team"
              ? teamsByPerformance
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
    height: 290,
  },
  item: {
    width: Dimensions.get("window").width - 150,
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
  title: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 22,

    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  performance: {
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
    fontSize: 16,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textAlign: "center",
  },
  winLoss: {
    marginTop: 30,
    color: colors.secondary,
    fontFamily: "Lilita-One",
    fontSize: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 0,
  },
});
