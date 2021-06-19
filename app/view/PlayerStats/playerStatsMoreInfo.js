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
  BackHandler,
} from "react-native";


import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import { moreInfoCarouselClosed } from "../../store/reducers/uiReducerNoPersist";
import colors from "../../config/colors";
import CarouselModule from "../../components/modules/Carousel/CarouselModule";
import { processPlayerStats } from "../../components/modules/Carousel/CarouselData";

export default function PlayerStatsMoreInfo() {
  const device = useSelector((state) => state.uiReducerNoPersist.deviceType);
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
  const preferencesCarouselStored = useSelector(
    (state) => state.uiReducerPersist
  );

  const [backClicked, setBackClicked] = useState(false);
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

 
  return (
    <>
      {carouselInfo.image && (
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            onPress={() => handleReturn()}
            style={{ position: "absolute", left: 5, top: 5 }}
          >
            <Ionicons
              name="arrow-back-circle"
              size={device != "tablet" ? 50 : 70}
              style={{ zIndex: 2 }}
              color={colors.secondary}
            />
          </TouchableOpacity>
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            <TouchableOpacity>
              <Text
                style={[
                  styles.name,
                  device == "tablet" ? { fontSize: 40 } : null,
                ]}
              >
                {carouselInfo.displayName}
              </Text>
            </TouchableOpacity>
            {carouselInfo.mode != undefined && (
              <Image
                source={carouselInfo.mode}
                style={{
                  width: device != "tablet" ? 20 : 40,
                  height: device != "tablet" ? 20 : 40,
                  marginTop: 14,
                  marginLeft: 5,
                }}
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
                <Text
                  style={[
                    styles.categoryName,
                    { marginTop: 30 },
                    device == "tablet"
                      ? { fontSize: 30, marginLeft: 10 }
                      : null,
                  ]}
                >
                  Player Stats by Map
                </Text>
                <CarouselModule
                  dataType="mapMore"
                  style={preferencesCarouselStored.styleIndex}
                  sort={preferencesCarouselStored.sortIndex}
                />
              </>
            )}
            <Text
              style={[
                styles.categoryName,
                carouselInfo.type == "map" ? { marginTop: 20 } : null,
                device == "tablet" ? { fontSize: 30, marginLeft: 10 } : null,
              ]}
            >
              Player Stats by Brawler
            </Text>
            <CarouselModule
              dataType="brawler"
              style={preferencesCarouselStored.styleIndex}
              sort={preferencesCarouselStored.sortIndex}
            />

            <Text
              style={[
                styles.categoryName,
                device == "tablet" ? { fontSize: 30, marginLeft: 10 } : null,
              ]}
            >
              Player Stats by Teams
            </Text>
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
