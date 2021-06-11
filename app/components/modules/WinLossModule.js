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
  const device = useSelector((state) => state.uiReducerNoPersist.deviceType);
  const trophyWins = useSelector((state) => state.battleLogReducer.trophyWins);
  const trophyLosses = useSelector(
    (state) => state.battleLogReducer.trophyLosses
  );

  let playerStats = useSelector(
    (state) => state.battleLogReducer.playerStats[`${type}_maps`]
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
            <Text
              style={[
                styles.trophyWins,
                device == "tablet" ? { fontSize: 20 } : null,
              ]}
            >
              {" "}
              +{trophyWins} Trophies
            </Text>
            <Text
              style={[
                styles.trophyLosses,
                device == "tablet" ? { fontSize: 20 } : null,
              ]}
            >
              {" "}
              -{trophyLosses} Trophies
            </Text>
          </View>
          <View style={styles.mainContainer}>
            <View
              style={[styles.winsRectangle, { width: `${winsRatioLong}%` }]}
            >
              <Text
                style={[
                  styles.winningRatio,
                  device == "tablet" ? { fontSize: 20 } : null,
                ]}
              >{`${winsRatio}%`}</Text>
            </View>
            <View
              style={[styles.losesRectangle, { width: `${losesRatioLong}%` }]}
            >
              <Text
                style={[
                  styles.losesRatio,
                  device == "tablet" ? { fontSize: 20 } : null,
                ]}
              >{`${losesRatio}%`}</Text>
            </View>
          </View>
        </>
      </>
    );
  } else {
    let wins = 0;
    let losses = 0;
    let winsByTrophies = 0;
    let lossesByTrophies = 0;

    Object.values(playerStats).map((map) => {
      wins += map.wins;
      losses += map.losses;
      winsByTrophies += map.winsByTrophies;
      lossesByTrophies += map.lossesByTrophies;
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
            <Text
              style={[
                styles.trophyWins,
                device == "tablet" ? { fontSize: 20 } : null,
              ]}
            >
              {" "}
              +{wins} Wins{" "}
            </Text>
            <Text
              style={[
                styles.trophyLosses,
                device == "tablet" ? { fontSize: 20 } : null,
              ]}
            >
              {" "}
              -{losses} Losses
            </Text>
          </View>
          <View style={styles.mainContainer}>
            <View
              style={[styles.winsRectangle, { width: `${winsRatioLong}%` }]}
            >
              <Text
                style={[
                  styles.winningRatio,
                  device == "tablet" ? { fontSize: 20 } : null,
                ]}
              >{`${winsRatio}%`}</Text>
            </View>
            <View
              style={[styles.losesRectangle, { width: `${losesRatioLong}%` }]}
            >
              <Text
                style={[
                  styles.losesRatio,
                  device == "tablet" ? { fontSize: 20 } : null,
                ]}
              >{`${losesRatio}%`}</Text>
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
