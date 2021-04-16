import React from "react";
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
} from "react-native";
import { AdMobBanner, setTestDeviceIDAsync } from "expo-ads-admob";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import { moreInfoCarouselClosed } from "../../store/reducers/uiReducerNoPersist";
import colors from "../../config/colors";
import CarouselModule from "../../components/modules/Carousel/CarouselModule";
import { processPlayerStats } from "../../components/modules/Carousel/CarouselData";

export default function PlayerStatsMoreInfo() {
  const dispatch = useDispatch();
  const carouselInfo = useSelector((state) => state.uiReducerNoPersist);
  const preferencesCarouselStored = useSelector(
    (state) => state.uiReducerPersist
  );
  processPlayerStats(
    carouselInfo.seasonIndex,
    carouselInfo.gameType,
    carouselInfo.name,
    carouselInfo.type
  );
  // console.log(carouselInfo);
  // console.log(carouselInfo.gameType);
  const handleReturn = () => {
    dispatch(moreInfoCarouselClosed());
  };

  const setTest = async () => {
    await setTestDeviceIDAsync("EMULATOR");
  };
  setTest();

  return (
    <>
      {carouselInfo.image && (
        <SafeAreaView style={styles.container}>
          <TouchableHighlight style={{ position: "absolute", left: 5, top: 5 }}>
            <Ionicons
              onPress={() => handleReturn()}
              style={styles.icon}
              name="arrow-back-circle"
              size={50}
              color={colors.secondary}
            />
          </TouchableHighlight>
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            <Text style={[styles.name]}>{carouselInfo.displayName}</Text>
            {carouselInfo.mode != undefined && (
              <Image
                source={carouselInfo.mode}
                style={{ width: 20, height: 20, marginTop: 14, marginLeft: 5 }}
              />
            )}
          </View>
          <View>
            <Image
              source={carouselInfo.image}
              style={[
                carouselInfo.type == "mode"
                  ? { width: 100, height: 100, marginTop: 10 }
                  : carouselInfo.type == "map"
                  ? { width: 105, height: 165, marginTop: 20 }
                  : null,
              ]}
            />
          </View>
          <ScrollView>
            {carouselInfo.type == "mode" && (
              <>
                <Text style={[styles.categoryName, { marginTop: 30 }]}>
                  Player Stats by Map
                </Text>
                <CarouselModule
                  dataType="map"
                  style={preferencesCarouselStored.styleIndex}
                  sort={preferencesCarouselStored.sortIndex}
                />
              </>
            )}
            <Text
              style={[
                styles.categoryName,
                carouselInfo.type == "map" ? { marginTop: 20 } : null,
              ]}
            >
              Player Stats by Brawler
            </Text>
            <CarouselModule
              dataType="brawler"
              style={preferencesCarouselStored.styleIndex}
              sort={preferencesCarouselStored.sortIndex}
            />

            <Text style={styles.categoryName}>Player Stats by Teams</Text>
            <CarouselModule
              dataType="team"
              style={preferencesCarouselStored.styleIndex}
              sort={preferencesCarouselStored.sortIndex}
            />
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#142352",
    alignItems: "center",
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
});
