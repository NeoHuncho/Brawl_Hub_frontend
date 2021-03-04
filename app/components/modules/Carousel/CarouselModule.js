import React, { useRef } from "react";
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
} from "./CarouselData";

export default function CarouselModule({ dataType }) {
  console.log(brawlersByPerformance);

  const carouselRef = useRef(null);

  const goForward = () => {
    carouselRef.current.snapToNext();
  };

  const { width: screenWidth } = Dimensions.get("window");

  const getBackgroundColor = (item) => {
    if (item.winRatio >= 200) return "#009965";
    else if (item.winRatio >= 100) return "#0b7649";
    else if (item.winRatio > 80) return "#59260b";
    else if (item.winRatio > 50) return "#af593e";
    else if (item.winRatio > 20) return "#a52a2b";
    else if (item.winRatio > 10) return "#7c0a02";
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <View
          style={{
            backgroundColor:getBackgroundColor(item),
            borderRadius: 5,
            padding: 10,
            marginLeft: 25,
            marginRight: 25,
          }}
        >
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <View
            style={{ marginLeft: "auto", marginRight: "auto", marginTop: 10 }}
          >
            <Image
              source={item.image}
              containerStyle={styles.imageContainer}
              style={styles.image}
            />
          </View>
          <View style={{marginTop:10}}>
            <Text style={styles.performance}>performance:</Text>
            <Text style={styles.winRatio}>{item.winRatio.toFixed(0)}</Text>
          </View>
          <View
            style={{
              
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.winLoss}>{"Wins: " + item.wins}</Text>
            <Text style={styles.winLoss}>{"Losses: " + item.losses}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginRight: "3.5%",
          width: "100%",
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
    height: 300,
  },
  item: {
    width: Dimensions.get("window").width - 80,
    height: Dimensions.get("window").width - 180,
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
    fontSize: 15,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 0,
    textAlign: "center",
  },
  winRatio: {
    marginTop: 4,
    color: colors.secondary,
    fontFamily: "Lilita-One",
    fontSize: 23,
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
