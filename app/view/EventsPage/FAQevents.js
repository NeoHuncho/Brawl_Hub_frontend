import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import { useSelector } from "react-redux";

import colors from "../../config/colors";
import { getTranslation } from "../../lib/apiDB";

import explanation3vs3 from "../../assets/explanations/3vs3.png";
import explanationEventsPerformance from "../../assets/explanations/eventsPerformance.png";

export default function FaqPage() {
  const device = useSelector((state) => state.uiReducerNoPersist.deviceType);
  return (
    <View
      style={{
        alignContent: "center",
        alignItems: "center",
        marginTop: -10,
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 20,
        backgroundColor: colors.background2,
        borderRadius: 10,
      }}
    >
      <Text
        style={device != "tablet" ? styles.question : styles.questionTablet}
      >
        {getTranslation("When are events stats updated?")}
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        {getTranslation("Multiple times each day.")}
      </Text>
      <Text
        style={device != "tablet" ? styles.question : styles.questionTablet}
      >
        {getTranslation(
          "How are you calculating the performance of brawlers/teams?","QCalPerf"
        )}
      </Text>
      <Image
        source={explanationEventsPerformance}
        style={{
          width: device != "tablet" ? 350 : 800,
          height: device != "tablet" ? 175 : 375,
          marginTop: device != "tablet" ? 10 : 30,
        }}
      />
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        {getTranslation(
          "I then divide the total winning points of each brawler/team by their losing points.","ACalPerf"
        )}
      </Text>
      <Text
        style={device != "tablet" ? styles.question : styles.questionTablet}
      >
        {getTranslation(
          "Why do the brawlers at the top of the list have 100% performance?"
        )}
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        {getTranslation(
          "As the ratio between winning and losing points is a number that can seem confusing (check question above), I decided to take the brawler/team with the highest ratio and then compare all other brawler/team ratio's with the top one.","A100%"
        )}
      </Text>
      <Text
        style={device != "tablet" ? styles.question : styles.questionTablet}
      >
        {getTranslation("Whose stats are you using?")}
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        {getTranslation(
          "Currently, I am using the top 200 trophy players, and a custom list I created of the top 100 solo PL players and random players from different segments of the trophy/PL ladder.","AWho"
        )}
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        {getTranslation(
          "However I hope to change in the future. If I have enough users, I will compile a list of random users across each trophy/PL ladder segments.","AWho2"
        )}
      </Text>
      <Text
        style={device != "tablet" ? styles.question : styles.questionTablet}
      >
        {getTranslation("How do you avoid stats duplication?")}
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        {getTranslation(
          "Each time I save the stats of a new battle, I add its time (precise to the second) to a list. If this battle time matches a time in the list, then I skip to the next battle.","ADup"
        )}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  question: {
    marginTop: 25,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 17,
    color: colors.primary,
    fontFamily: "Lilita-One",
    textAlign: "center",
  },
  questionTablet: {
    marginTop: 45,
    marginLeft: 55,
    marginRight: 55,
    fontSize: 28,
    lineHeight: 40,
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
  answerTablet: {
    marginTop: 10,
    marginLeft: 55,
    marginRight: 55,
    fontSize: 22,
    lineHeight: 30,
    color: colors.secondary,
    fontFamily: "Lilita-One",
    textAlign: "center",
  },
});
