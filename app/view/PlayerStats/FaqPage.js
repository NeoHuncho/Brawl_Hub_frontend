import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import colors from "../../config/colors";
import explanation3vs3 from "../../assets/explanations/3vs3.png";

export default function FaqPage() {
  return (
    <View
      style={{
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={styles.question}>When are my stats updated?</Text>
      <Text style={styles.answer}>
        Your stats will be updated once a day, if you open Brawl Hub at least
        once every 3 DAYS! (This is subject to change)
      </Text>
      <Text style={styles.question}>How is performance calculated?</Text>
      <Image source={explanation3vs3} style={{ width: 350, height: 175 }} />
      <Text style={styles.question}>
        Why is performance calculated this way?
      </Text>
      <Text style={styles.answer}>
        When you win/loose against a team with more trophies your performance
        will be more/less impacted{" "}
      </Text>
      <Text style={styles.answer}>
        When you win/loose against a team with less trophies your performance
        will be less/more impacted{" "}
      </Text>
      <Text style={styles.answer}>
        The ratio between both teams is multiplied with your current brawler
        trophies to make higher up matches more important
      </Text>
      <Text style={styles.question}>What About Solo Showdown?</Text>
      <Text style={styles.answer}>
        If you have won/lost trophies, I take your current brawler trophies and
        multiply it by 3{" "}
      </Text>
      <Text style={styles.answer}>
        I don't take in consideration your position, as a winning/losing
        position changes a lot depending on how many trophies your brawler has{" "}
      </Text>
      <Text style={styles.answer}>
        I then multiply by 3 to make the performance comparable with 3vs3
        matches
      </Text>
      <Text style={styles.question}>And Duo Showdown?</Text>
      <Text style={styles.answer}>
        If you have won/lost trophies, I take your current brawler trophies and
        your team mate brawler trophies and multiply it by 1.5{" "}
      </Text>
      <Text style={styles.answer}>
        I don't take in consideration your position, as a winning/losing
        position changes a lot depending on how many trophies your brawler has{" "}
      </Text>
      <Text style={styles.answer}>
        I then multiply by 1.5 to make the performance comparable with 3vs3
        matches
      </Text>
      <Text style={styles.question}>
        Is Power League performance calculated in the same way?
      </Text>
      <Text style={styles.answer}>Yes.</Text>
      <Text style={styles.answer}>
        For the green/red graph at the top of PL the green/red bars represent
        your actual performance and do not represent win/loss ratio
      </Text>
      <Text style={styles.answer}>
        So it is possible that even if you have more wins than losses, the red
        bar can be longer as you may have lost a lot to lower tier teams(for
        example)
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
