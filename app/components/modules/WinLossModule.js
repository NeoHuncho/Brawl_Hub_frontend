import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

import colors from "../../config/colors";

export default function WinLossModule() {
  const  trophyWins= useSelector((state) => state.trophyWins);
  const  trophyLosses= useSelector((state) => state.trophyLosses);
  
  let winsRatioLong = (trophyWins / (trophyWins + trophyLosses)) * 100;
  let losesRatioLong = (trophyLosses / (trophyWins + trophyLosses)) * 100;
  let winsRatio = +winsRatioLong.toFixed(2);
  let losesRatio = +losesRatioLong.toFixed(2);

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.trophyWins}> +{trophyWins} Trophies</Text>
        <Text style={styles.trophyLosses}> -{trophyLosses} Trophies</Text>
      </View>
      <View style={styles.mainContainer}>
        <View style={[styles.winsRectangle, { width: `${winsRatioLong}%` }]}>
          <Text style={styles.winningRatio}>{`${winsRatio}%`}</Text>
        </View>
        <View style={[styles.losesRectangle, { width: `${losesRatioLong}%` }]}>
          <Text style={styles.losesRatio}>{`${losesRatio}%`}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
  },
  winsRectangle: {
    height: 70,
    backgroundColor: colors.green,
    justifyContent: "center",
  },
  winningRatio: {
    textAlign: "right",
    color: colors.primary,
    marginRight: 10,
    fontFamily: "Lilita-One",
    fontSize: 20,
  },
  trophyWins: {
    textAlign: "left",
    margin: 10,
    color: colors.secondary,
    fontFamily: "Lilita-One",
    fontSize: 14,
  },
  trophyLosses: {
    textAlign: "right",
    margin: 10,
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 14,
  },
  losesRectangle: {
    height: 70,
    backgroundColor: colors.red,
    justifyContent: "center",
  },
  losesRatio: {
    justifyContent: "flex-start",
    color: colors.primary,
    marginLeft: 10,
    fontFamily: "Lilita-One",
    fontSize: 20,
  },
});
