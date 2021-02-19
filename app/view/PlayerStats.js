import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

import colors from "../config/colors";
import WinLossModule from "../components/modules/WinLossModule";

export default function PlayerStats({ userId }) {
  const battleLog = useSelector((state) => state.battleLog);
  const player = useSelector((state) => state.player);
  const lastFetch = useSelector((state) => state.lastFetch);

  const playerId = "#" + userId;
  console.log("look here 2!");
  console.log(player);
  console.log(battleLog);
  console.log(userId);

  let wins = 0;
  let losses = 0;
  let trophyLosses = 0;
  let trophyWins = 0;
  let numberOfGames = 0;

  let playerStats = {};

  for (const element of battleLog) {
    if (element.battle.trophyChange) {
      numberOfGames++;
      let mapName = element.event.map;
      let mode = element.event.mode;

      let findBrawler = (element) => {
        if (element.battle.teams) {
          for (const team of element.battle.teams)
            for (const player of team)
              if (player.tag == playerId) return player.brawler.name;
        } else {
          for (const player of element.battle.players)
            if (player.tag == playerId) return player.brawler.name;
        }
      };

      let brawler = findBrawler(element);

      // let brawler=findBrawler(element)

      if (element.battle.trophyChange > 0) {
        trophyWins += element.battle.trophyChange;

        wins = wins + 1;

        if (playerStats[mode]) {
          playerStats[mode].wins += 1;
        } else playerStats[mode] = { wins: 1, losses: 0 };

        if (playerStats[mode][mapName]) {
          playerStats[mode][mapName].wins += 1;
        } else playerStats[mode][mapName] = { wins: 1, losses: 0 };

        if (playerStats[mode][mapName][brawler]) {
          playerStats[mode][mapName][brawler].wins += 1;
        } else playerStats[mode][mapName][brawler] = { wins: 1, losses: 0 };
        //
      } else if (element.battle.trophyChange) {
        trophyLosses += Math.abs(element.battle.trophyChange);
        losses = losses + 1;

        if (playerStats[mode]) {
          playerStats[mode].losses += 1;
        } else playerStats[mode] = { wins: 0, losses: 1 };

        if (playerStats[mode][mapName]) {
          playerStats[mode][mapName].losses += 1;
        } else playerStats[mode][mapName] = { wins: 0, losses: 1 };

        if (playerStats[mode][mapName][brawler]) {
          playerStats[mode][mapName][brawler].losses += 1;
        } else playerStats[mode][mapName][brawler] = { wins: 0, losses: 1 };
      }
    }
  }

  console.log(player.name);

  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{player.name}</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <WinLossModule
          wins={wins}
          losses={losses}
          numberOfGames={numberOfGames}
          trophyLosses={trophyLosses}
          trophyWins={trophyWins}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  nameContainer:{
    marginTop: 60,
  },
  name: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 30,
  },

});
