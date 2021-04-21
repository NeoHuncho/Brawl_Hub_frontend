import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

import colors from "../../config/colors";

export default function WinLossModule({ type }) {
  type === "Trophies"
    ? (type = "ranked")
    : type === "Solo PL"
    ? (type = "soloRanked")
    : type === "Team PL"
    ? (type = "teamRanked")
    : null;
  const trophyWins = useSelector((state) => state.battleLogReducer.trophyWins);
  const trophyLosses = useSelector(
    (state) => state.battleLogReducer.trophyLosses
  );
  const season = useSelector((state) => state.battleLogReducer.season);
  const playerStats = useSelector(
    (state) => state.battleLogReducer.playerStats.season[season].type[type]
  );

  if (type == "ranked") {
    let winsRatioLong = (trophyWins / (trophyWins + trophyLosses)) * 100;
    let losesRatioLong = (trophyLosses / (trophyWins + trophyLosses)) * 100;
    let winsRatio = +winsRatioLong.toFixed(2);
    let losesRatio = +losesRatioLong.toFixed(2);

    return (
      <>
        <>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.trophyWins}> +{trophyWins} Trophies</Text>
            <Text style={styles.trophyLosses}> -{trophyLosses} Trophies</Text>
          </View>
          <View style={styles.mainContainer}>
            <View
              style={[styles.winsRectangle, { width: `${winsRatioLong}%` }]}
            >
              <Text style={styles.winningRatio}>{`${winsRatio}%`}</Text>
            </View>
            <View
              style={[styles.losesRectangle, { width: `${losesRatioLong}%` }]}
            >
              <Text style={styles.losesRatio}>{`${losesRatio}%`}</Text>
            </View>
          </View>
        </>
      </>
    );
  } else {
    type === "Solo PL" ? (type = "soloRanked") : (type = "teamRanked");
    const keys = playerStats.keys.modes;
    let wins = 0;
    let losses = 0;
    let winsByTrophies = 0;
    let lossesByTrophies = 0;
    keys.map((x) => {
      wins += playerStats.mode[x].wins;
      losses += playerStats.mode[x].losses;
      winsByTrophies += playerStats.mode[x].winsByTrophies;
      lossesByTrophies += playerStats.mode[x].lossesByTrophies;
    });
    let winsRatioLong =
      (winsByTrophies / (winsByTrophies + lossesByTrophies)) * 100;
    let losesRatioLong =
      (lossesByTrophies / (winsByTrophies + lossesByTrophies)) * 100;
    let winsRatio = +winsRatioLong.toFixed(2);
    let losesRatio = +losesRatioLong.toFixed(2);
    // console.log(wins, losses, winsRatio, losesRatio);
    return (
      <>
        <>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.trophyWins}> +{wins} Wins </Text>
            <Text style={styles.trophyLosses}> -{losses} Losses</Text>
          </View>
          <View style={styles.mainContainer}>
            <View
              style={[styles.winsRectangle, { width: `${winsRatioLong}%` }]}
            >
              <Text style={styles.winningRatio}>{`${winsRatio}%`}</Text>
            </View>
            <View
              style={[styles.losesRectangle, { width: `${losesRatioLong}%` }]}
            >
              <Text style={styles.losesRatio}>{`${losesRatio}%`}</Text>
            </View>
          </View>
        </>
      </>
    );
  }
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
    fontSize: 14,
  },
  trophyWins: {
    textAlign: "left",
    margin: 10,
    color: colors.secondary,
    fontFamily: "Lilita-One",
    fontSize: 12,
  },
  trophyLosses: {
    textAlign: "right",
    margin: 10,
    marginRight: 35,
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 12,
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
    fontSize: 14,
  },
});
