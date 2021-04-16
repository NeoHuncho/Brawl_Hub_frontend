import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { store } from "../store/configureStore";
import { useSelector } from "react-redux";
import Events from "./EventsPage/Events";
export default function LoadingPage(page) {
  let globalStats = useSelector(
    (state) => state.globalStatsReducer.globalStats
  );
  if (globalStats != undefined && globalStats != null) {
    if (globalStats.trophies) {
      return <Events />;
    } else {
      return (
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 30,
              fontFamily: "Lilita-One",
              textAlign: "center",
              marginTop: 200,
              color: "white",
            }}
          >
            Loading this page! Will only be one sec
          </Text>
        </View>
      );
    }
  } else {
    return (
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 30,
            fontFamily: "Lilita-One",
            textAlign: "center",
            marginTop: 200,
            color: "white",
          }}
        >
          Loading this page! Will only be one sec
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C3273",
    alignItems: "center",
    alignContent: "center",
  },
});
