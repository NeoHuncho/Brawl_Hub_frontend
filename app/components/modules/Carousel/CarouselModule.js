import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
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

import { showInterstitial, requestAd } from "../../../config/ads";
import { imageAdID, videoAdID } from "../../../config/ads";
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
import infoButton from "../../../assets/icons/infoButton.png";
import { useDispatch } from "react-redux";
import {
  moreInfoCarouselOpen,
  moreInfoCarouselClosed,
} from "../../../store/reducers/uiReducerNoPersist";
import { compose } from "@reduxjs/toolkit";

let countImageAd = 0;
let countVideoAd = 0;
export default function CarouselModule({ dataType, style, sort }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const carouselRef = useRef(null);

  const getBackgroundColor = (item) => {
    if (item.winRatio >= 5) return "#003924";
    else if (item.winRatio >= 3) return "#005841";
    else if (item.winRatio >= 2) return "#AF9500";
    else if (item.winRatio >= 1) return "#CCB33B";
    else if (item.winRatio >= 0.2) return "#850000";
    else if (item.winRatio < 0.2) return "#650000";
  };

  const getMessage = (item) => {
    if (item.winRatio >= 5) return "GREAT";
    else if (item.winRatio >= 3) return "GOOD";
    else if (item.winRatio >= 2) return "OKAY";
    else if (item.winRatio >= 1) return "AVERAGE";
    else if (item.winRatio >= 0.2) return "BAD";
    else if (item.winRatio < 0.2) return "AWFUL";
  };

  const onPressCarousel = async (displayName, name, mode, image) => {
    // console.log(displayName, dataType, name, mode, image);
    dispatch(
      moreInfoCarouselOpen({
        isOpen: true,
        displayName: displayName,
        type: dataType,
        name: name,
        mode: mode,
        image: image,
      })
    );
    setLoading(false);
  };

  const renderItem = ({ item, index }) => {
    // console.log(item.name, item.mode);
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
            dataType !== "map" && dataType !== "mapMore"
              ? { height: 250 }
              : { height: 330 },
          ]}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                styles.title,
                dataType === "team" ? { fontSize: 15 } : null,
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text
              style={[
                styles.title,
                { fontSize: 8, position: "absolute", left: 1, top: 30 },
                dataType == "team" ? { top: 24 } : null,
              ]}
            >
              {getMessage(item)}
            </Text>
            <Image
              source={
                dataType === "map" || dataType === "mapMore" ? item.mode : null
              }
              style={{ width: 20, height: 20, marginTop: 8, marginLeft: 5 }}
            />
            {dataType !== "team" &&
              dataType !== "brawler" &&
              dataType !== "mapMore" && (
                <TouchableOpacity
                  onPress={async () => {
                    setLoading(true);
                    await showInterstitial();
                    onPressCarousel(
                      item.title,
                      item.titleCamel,
                      item.mode,
                      item.image
                    );
                    await requestAd();
                  }}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                  }}
                >
                  <Text style={styles.statsTextMode}>More stats</Text>
                  <Image
                    source={require("../../../assets/icons/infoButton.png")}
                    style={{ width: 30, height: 30 }}
                  />
                </TouchableOpacity>
              )}
          </View>

          <View
            style={{ marginLeft: "auto", marginRight: "auto", marginTop: 10 }}
          >
            {dataType !== "team" && (
              <Image
                source={item.image}
                containerStyle={styles.imageContainer}
                style={[
                  dataType !== "map" && dataType !== "mapMore"
                    ? styles.image
                    : styles.mapImage,
                ]}
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
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Image source={item.brawler1} style={styles.teamImage} />
                  <Image source={item.brawler2} style={styles.teamImage} />
                  {item.brawler3 != null ? (
                    <Image source={item.brawler3} style={styles.teamImage} />
                  ) : null}
                </View>
              </View>
            )}
          </View>

          <View style={{ marginTop: 5 }}>
            {item.duration ? (
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Ionicons
                  style={{ marginTop: 6, marginRight: 3 }}
                  name="timer"
                  size={15}
                  color={colors.secondary}
                />
                <Text style={[styles.performance, { marginTop: 5 }]}>
                  {item.duration.toFixed(1) + "s"}
                </Text>
              </View>
            ) : null}
            {item.spRatio ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 4,
                }}
              >
                <Ionicons
                  style={{ marginRight: 3 }}
                  name="star"
                  size={15}
                  color={colors.secondary}
                />
                <Text style={[styles.performance]}>
                  {(item.spRatio * 100).toFixed(1) + "%"}
                </Text>
              </View>
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
                  ? { marginTop: 20 }
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
      style={[
        styles.container,
        dataType === "map" || dataType === "mapMore" ? styles.mapItem : null,
      ]}
    >
      {loading && (
        <ActivityIndicator
          animating={true}
          color={"blue"}
          size={"large"}
          style={{
            position: "absolute",
            top: -100,
            margin: "auto",
            bottom: 0,
            right: 0,
            left: 0,
            zIndex: 8,
          }}
        />
      )}
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
          sliderWidth={Dimensions.get("window").width - 20}
          itemWidth={300}
          data={
            sort === 0
              ? dataType === "mode"
                ? modesByPerformance
                : dataType === "brawler"
                ? brawlersByPerformance
                : dataType === "map" || dataType === "mapMore"
                ? mapsByPerformance
                : dataType === "team"
                ? teamsByPerformance
                : null
              : dataType === "mode"
              ? modesByWins
              : dataType === "brawler"
              ? brawlersByWins
              : dataType === "map" || dataType === "mapMore"
              ? mapsByWins
              : dataType === "team"
              ? teamsByWins
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
  statsTextMode: {
    position: "absolute",
    fontSize: 7,
    color: colors.secondary,
    fontFamily: "Lilita-One",
    right: 1,
    top: 30,
    textAlign: "center",
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
