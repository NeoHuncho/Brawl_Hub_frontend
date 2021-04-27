import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "../config/colors";
import explanation3vs3 from "../assets/explanations/3vs3.png";
import explanationEventsPerformance from "../assets/explanations/eventsPerformance.png";

export default function FaqPage() {
  const [playerStatsOpen, setPlayerStatsOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);

  const handlePlayerStatsPress = () => {
    playerStatsOpen === false
      ? setPlayerStatsOpen(true)
      : setPlayerStatsOpen(false);
  };
  const handleEventsPress = () => {
    eventsOpen === false ? setEventsOpen(true) : setEventsOpen(false);
  };
  return (
    <View
      style={{
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        {playerStatsOpen == false && (
          <Ionicons color="white" size={25} name="caret-up" />
        )}
        {playerStatsOpen == true && (
          <Ionicons color="white" size={25} name="caret-down" />
        )}
        <Text
          onPress={() => handlePlayerStatsPress()}
          style={styles.categoryName}
        >
          Player Stats Tab FAQ
        </Text>
      </View>
      {playerStatsOpen == true && (
        <View
          style={{
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.question}>When are my stats updated?</Text>
          <Text style={styles.answer}>
            Your stats will be updated once a day, if you open Brawl Hub at
            least once every 3 DAYS! (This is subject to change)
          </Text>
          <Text style={styles.question}>How is performance calculated?</Text>
          <Image source={explanation3vs3} style={{ width: 350, height: 175 }} />
          <Text style={styles.question}>
            Why is performance calculated this way?
          </Text>
          <Text style={styles.answer}>
            When you win/loose against a team with more trophies your
            performance will be more/less impacted{" "}
          </Text>
          <Text style={styles.answer}>
            When you win/loose against a team with less trophies your
            performance will be less/more impacted{" "}
          </Text>
          <Text style={styles.answer}>
            The ratio between both teams is multiplied with your current brawler
            trophies to make higher up matches more important
          </Text>
          <Text style={styles.question}>What About Solo Showdown?</Text>
          <Text style={styles.answer}>
            If you have won/lost trophies, I take your current brawler trophies
            and multiply it by 3{" "}
          </Text>
          <Text style={styles.answer}>
            I don't take in consideration your position, as a winning/losing
            position changes a lot depending on how many trophies your brawler
            has{" "}
          </Text>
          <Text style={styles.answer}>
            I then multiply by 3 to make the performance comparable with 3vs3
            matches
          </Text>
          <Text style={styles.question}>And Duo Showdown?</Text>
          <Text style={styles.answer}>
            If you have won/lost trophies, I take your current brawler trophies
            and your team mate brawler trophies and multiply it by 1.5{" "}
          </Text>
          <Text style={styles.answer}>
            I don't take in consideration your position, as a winning/losing
            position changes a lot depending on how many trophies your brawler
            has{" "}
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
            For the green/red graph at the top of PL the green/red bars
            represent your actual performance and do not represent win/loss
            ratio
          </Text>
          <Text style={styles.answer}>
            So it is possible that even if you have more wins than losses, the
            red bar can be longer as you may have lost a lot to lower tier
            teams(for example)
          </Text>
        </View>
      )}
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        {eventsOpen == false && (
          <Ionicons color="white" size={25} name="caret-up" />
        )}
        {eventsOpen == true && (
          <Ionicons color="white" size={25} name="caret-down" />
        )}
        <Text onPress={() => handleEventsPress()} style={[styles.categoryName]}>
          Events Tab FAQ
        </Text>
      </View>
      {eventsOpen == true && (
        <View
          style={{
            alignContent: "center",
            alignItems: "center",
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
            style={{ width: 350, height: 175 }}
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
            Currently, I am using the top 200 trophy players, and a custom list
            I created of the top 100 solo PL players and random players from
            different segments of the trophy/PL ladder.
          </Text>
          <Text style={styles.answer}>
            For team PL I made a custom list where I tried to choose players
            from different clubs to avoid duplicate stats.
          </Text>
          <Text style={styles.answer}>
            However I hope to change this by the time season 7 roles around. If
            I have enough users, I will compile a list of random users across
            each trophy/PL ladder segments to avoid stats duplication due to
            players playing in teams!
          </Text>
        </View>
      )}
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
