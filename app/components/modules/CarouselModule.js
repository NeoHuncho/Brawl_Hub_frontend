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
  const [playerModes, setPlayerModes] = useState([]);
  const carouselRef = useRef(null);

  const goForward = () => {
    carouselRef.current.snapToNext();
  };

  useEffect(() => {
    setPlayerModes(modes);
  }, []);

  const { width: screenWidth } = Dimensions.get("window");

  const playerStats = useSelector((state) => state.playerStats);
  console.log(playerStats.brawlBall.winRatio);

  let modes = [
    {
      color: "#8ca0df",
      image: require("../../assets/ModesandMaps/Brawl-Ball/icon/Brawl-Ball.png"),
      title: "Brawl Ball",
      winRatio: playerStats.brawlBall.winRatio,
      wins: playerStats.brawlBall.wins,
      losses: playerStats.brawlBall.losses,
    },
    {
      color: "#01cfff",
      image: require("../../assets/ModesandMaps/Bounty/icon/Bounty.png"),
      title: "Bounty",
      winRatio: playerStats.bounty.winRatio,
      wins: playerStats.bounty.wins,
      losses: playerStats.bounty.losses,
    },
    {
      color: "#8ca0df",
      image: require("../../assets/ModesandMaps/Siege/icon/Siege.png"),
      title: "Siege",
      winRatio: playerStats.siege.winRatio,
      wins: playerStats.siege.wins,
      losses: playerStats.siege.losses,
    },
    {
      color: "#9b3df3",
      image: require("../../assets/ModesandMaps/Gem-Grab/icon/Gem-Grab.png"),
      title: "Gem Grab",
      winRatio: playerStats.gemGrab.winRatio,
      wins: playerStats.gemGrab.wins,
      losses: playerStats.gemGrab.losses,
    },
    {
      color: "#d55cd3",
      image: require("../../assets/ModesandMaps/Heist/icon/Heist.png"),
      title: "Heist",
      winRatio: playerStats.heist.winRatio,
      wins: playerStats.heist.wins,
      losses: playerStats.heist.losses,
    },
    {
      color: "#8ca0df",
      image: require("../../assets/ModesandMaps/Hot-Zone/icon/Hot-Zone.png"),
      title: "Hot Zone",
      winRatio: playerStats.hotZone.winRatio,
      wins: playerStats.hotZone.wins,
      losses: playerStats.hotZone.losses,
    },
    {
      color: "#81d621",
      image: require("../../assets/ModesandMaps/Showdown/icon/Solo-Showdown.png"),
      title: "Solo S/D",
      winRatio: playerStats.soloShowdown.winRatio,
      wins: playerStats.soloShowdown.wins,
      losses: playerStats.soloShowdown.losses,
    },
    {
      color: "#81d621",
      image: require("../../assets/ModesandMaps/Showdown/icon/Duo-Showdown.png"),
      title: "Duo S/D",
      winRatio: playerStats.duoShowdown.winRatio,
      wins: playerStats.duoShowdown.wins,
      losses: playerStats.duoShowdown.losses,
    },
  ];

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <View
          style={{
            backgroundColor: item.color,
            borderRadius: 5,
            height: 220,
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
          </View >
          <View style={{ marginTop: 12 }}>
            <Text style={styles.winRatio}>
              {"win Rate:" + item.winRatio.toFixed(2) + "%"}
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
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
        <Carousel
          layout={"default"}
          ref={carouselRef}
          sliderWidth={300}
          itemWidth={300}
          data={modes}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  item: {
    width: Dimensions.get("window").width - 80,
    height: Dimensions.get("window").width - 80,
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
  winRatio: {
    color: colors.secondary,
    fontFamily: "Lilita-One",
    fontSize: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 0,
    textAlign:"center"
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
