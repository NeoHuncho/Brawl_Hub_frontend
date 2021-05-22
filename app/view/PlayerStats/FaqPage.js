import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useSelector } from "react-redux";

import colors from "../../config/colors";
import explanation3vs3 from "../../assets/explanations/3vs3.png";

export default function FaqPage() {
  const device = useSelector((state) => state.uiReducerNoPersist.deviceType);
  return (
    <View
      style={{
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={device != "tablet" ? styles.question : styles.questionTablet}
      >
        When are my stats updated?
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        Your stats will be updated once a day, if you open Brawl Hub at least
        once every 3 DAYS! (This is subject to change)
      </Text>
      <Text
        style={device != "tablet" ? styles.question : styles.questionTablet}
      >
        How is performance calculated?
      </Text>
      <Image source={explanation3vs3} style={{ width: 350, height: 175 }} />
      <Text
        style={device != "tablet" ? styles.question : styles.questionTablet}
      >
        Why is performance calculated this way?
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        When you win/loose against a team with more trophies your performance
        will be more/less impacted{" "}
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        When you win/loose against a team with less trophies your performance
        will be less/more impacted{" "}
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        The ratio between both teams is multiplied with your current brawler
        trophies to make higher up matches more important
      </Text>
      <Text
        style={device != "tablet" ? styles.question : styles.questionTablet}
      >
        What About Solo Showdown?
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        If you have won/lost trophies, I take your current brawler trophies and
        multiply it by 3{" "}
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        I don't take in consideration your position, as a winning/losing
        position changes a lot depending on how many trophies your brawler has{" "}
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        I then multiply by 3 to make the performance comparable with 3vs3
        matches
      </Text>
      <Text
        style={device != "tablet" ? styles.question : styles.questionTablet}
      >
        And Duo Showdown?
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        If you have won/lost trophies, I take your current brawler trophies and
        your team mate brawler trophies and multiply it by 1.5{" "}
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        I don't take in consideration your position, as a winning/losing
        position changes a lot depending on how many trophies your brawler has{" "}
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        I then multiply by 1.5 to make the performance comparable with 3vs3
        matches
      </Text>
      <Text
        style={device != "tablet" ? styles.question : styles.questionTablet}
      >
        Is Power League performance calculated in the same way?
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        Yes.
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        For the green/red graph at the top of PL the green/red bars represent
        your actual performance and do not represent win/loss ratio
      </Text>
      <Text style={device != "tablet" ? styles.answer : styles.answerTablet}>
        So it is possible that even if you have more wins than losses, the red
        bar can be longer as you may have lost a lot to lower tier teams(for
        example)
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
