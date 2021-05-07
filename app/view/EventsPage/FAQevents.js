import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "../../config/colors";
import explanation3vs3 from "../../assets/explanations/3vs3.png";
import explanationEventsPerformance from "../../assets/explanations/eventsPerformance.png";

export default function FaqPage() {
  return (
    <View
      style={{
        alignContent: "center",
        alignItems: "center",
        marginBottom:20
      }}
    >
     
        <Text style={styles.question}>When are events stats updated?</Text>
        <Text style={styles.answer}>
          Daily. However, they will update more often at the beginning of the
          season than at the end
        </Text>
        <Text style={styles.answer}>
          This does not mean I wont be updating then daily during the whole
          season, as I want to show changes in meta that happen during the
          season
        </Text>
        <Text style={styles.question}>
          How are you calculating the performance of brawlers/teams?
        </Text>
        <Image
          source={explanationEventsPerformance}
          style={{ width: 350, height: 175, marginTop:10 }}
        />
        <Text style={styles.answer}>
          I then divide the total winning points of each brawler/team by their
          losing points.
        </Text>
        <Text style={styles.question}>
          Why do the brawlers at the top of the list have 100% performance?
        </Text>
        <Text style={styles.answer}>
          As the ratio between winning and losing points is a number that can
          seem confusing (check question above), I decided to take the
          brawler/team with the highest ratio and then compare all other
          brawler/team ratio's with the top one.
        </Text>
        <Text style={styles.question}>Whose stats are you using?</Text>
        <Text style={styles.answer}>
          Currently, I am using the top 200 trophy players, and a custom list I
          created of the top 100 solo PL players and random players from
          different segments of the trophy/PL ladder.
        </Text>
        <Text style={styles.answer}>
          However I hope to change this by the time season 7 roles around. If I
          have enough users, I will compile a list of random users across each
          trophy/PL ladder segments to avoid stats duplication due to players
          playing in teams!
        </Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  categoryName: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 20,
    marginLeft: 6,
  },
  question: {
    marginTop: 25,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 17,
    color: colors.primary,
    fontFamily: "Lilita-One",
    textAlign: "center",
  },
  answer: {
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 12,
    color: colors.secondary,
    fontFamily: "Lilita-One",
    textAlign: "center",
  },
});