import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import Carousel from "react-native-snap-carousel";

import colors from "../../config/colors";

export default function CarouselModule() {
  const carouselRef = useRef(null);

  const goForward = () => {
    carouselRef.current.snapToNext();
  };



  const { width: screenWidth } = Dimensions.get("window");

  const playerStats = useSelector(
    (state) => state.battleLogReducer.playerStats
  );
  const player = useSelector((state) => state.battleLogReducer.player);
  console.log(playerStats.modes.brawlBall.winRatio);

  let modes = [
    {
      color: "#8ca0df",
      image: require("../../assets/ModesandMaps/Brawl-Ball/icon/Brawl-Ball.png"),
      title: "Brawl Ball",
      winRatio: playerStats.modes.brawlBall.winRatio,
      wins: playerStats.modes.modes.brawlBall.wins,
      losses: playerStats.modes.modes.brawlBall.losses,
    },
    {
      color: "#01cfff",
      image: require("../../assets/ModesandMaps/Bounty/icon/Bounty.png"),
      title: "Bounty",
      winRatio: playerStats.modes.bounty.winRatio,
      wins: playerStats.modes.bounty.wins,
      losses: playerStats.modes.bounty.losses,
    },
    {
      color: "#f04f32",
      image: require("../../assets/ModesandMaps/Siege/icon/Siege.png"),
      title: "Siege",
      winRatio: playerStats.modes.siege.winRatio,
      wins: playerStats.modes.siege.wins,
      losses: playerStats.modes.siege.losses,
    },
    {
      color: "#9b3df3",
      image: require("../../assets/ModesandMaps/Gem-Grab/icon/Gem-Grab.png"),
      title: "Gem Grab",
      winRatio: playerStats.modes.gemGrab.winRatio,
      wins: playerStats.modes.gemGrab.wins,
      losses: playerStats.modes.gemGrab.losses,
    },
    {
      color: "#d55cd3",
      image: require("../../assets/ModesandMaps/Heist/icon/Heist.png"),
      title: "Heist",
      winRatio: playerStats.modes.heist.winRatio,
      wins: playerStats.modes.heist.wins,
      losses: playerStats.modes.heist.losses,
    },
    {
      color: "#e33c50",
      image: require("../../assets/ModesandMaps/Hot-Zone/icon/Hot-Zone.png"),
      title: "Hot Zone",
      winRatio: playerStats.modes.hotZone.winRatio,
      wins: playerStats.modes.hotZone.wins,
      losses: playerStats.modes.hotZone.losses,
    },
    {
      color: "#81d621",
      image: require("../../assets/ModesandMaps/Showdown/icon/Solo-Showdown.png"),
      title: "Solo S/D",
      winRatio: playerStats.modes.soloShowdown.winRatio,
      wins: playerStats.modes.soloShowdown.wins,
      losses: playerStats.modes.soloShowdown.losses,
    },
    {
      color: "#81d621",
      image: require("../../assets/ModesandMaps/Showdown/icon/Duo-Showdown.png"),
      title: "Duo S/D",
      winRatio: playerStats.modes.duoShowdown.winRatio,
      wins: playerStats.modes.duoShowdown.wins,
      losses: playerStats.modes.duoShowdown.losses,
    },
  ];

  


  //for some reason this is mutating original array too. Check online
  let modesSortedbyWR = modes.sort((a, b) =>
    a.winRatio > b.winRatio ? -1 : 1
  );
  let modesSorted = modesSortedbyWR.filter((mode) => mode.winRatio !== 0);
  console.log(modes)
  console.log(modesSorted)
  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <View
          style={{
            backgroundColor: item.color,
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
          <View >
            <Text style={styles.performance}>
            performance:
            </Text>
            <Text style={styles.winRatio}>
            {item.winRatio.toFixed(2) + "%"}
            </Text>
           
          </View>
          <View
            style={{
              marginTop: 12,
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

  console.log(modes);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: "row", marginRight: "3.5%",width:'100%' }}>
        <Carousel
          layout={"tinder"}
          layoutCardOffset={30}
          ref={carouselRef}
          sliderWidth={390}
          itemWidth={300}
          data={modesSorted}
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
  winRatio:{
    marginTop:4,
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
