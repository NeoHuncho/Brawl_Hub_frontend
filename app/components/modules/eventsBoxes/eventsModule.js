import React from "react";
import { View, StyleSheet, ImageBackground, Text, Image } from "react-native";
import moment from "moment";
import { eventsData, eventActiveData, eventUpcomingData } from "./eventsData";
import colors from "../../../config/colors";
import { bestBrawlers, bestTeams } from "../../../lib/getGlobalStatsFunctions";
import { getBrawlerImage } from "../../../lib/getAssetsFunctions";
import { Colors } from "react-native-paper";

const EventsModule = ({ seasonIndex, typeIndex }) => {
  eventsData();

  let eventRectangle = [];

  eventActiveData.map((event) => {
    let sortedBrawlers = bestBrawlers(typeIndex, event.modeName, event.mapID);
    let sortedTeams = bestTeams(typeIndex, event.modeName, event.mapID);
    let teamBrawler1 = null;
    let teamBrawler2 = null;
    let teamBrawler3 = null;
    console.log(sortedTeams);
    if (sortedTeams) {
      if (sortedTeams.length != 0) {
        teamBrawler1 = sortedTeams[0].ID.slice(0, 8);
        teamBrawler2 = sortedTeams[0].ID.slice(10, 18);
        teamBrawler3 = sortedTeams[0].ID.slice(20, 28);
      }
    }

    eventRectangle.push(
      <View key={event.eventID} style={styles.rectangle}>
        <View
          style={{
            height: 30,
            width: 280,
            backgroundColor: event.modeColor,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }}
        >
          <View style={{ margin: 5, marginTop: 7, flexDirection: "row" }}>
            <Image source={{ uri: event.modeImage }} style={styles.modeImage} />
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Lilita-One",
                color: colors.secondary,
              }}
            >
              {event.mapName}
            </Text>

            <Text
              style={{
                fontSize: 11,
                fontFamily: "Lilita-One",
                color: colors.secondary,
                position: "absolute",
                right: 0,
                top: 3,
              }}
            >
              {`${event.eventLeftTime.hours()}h: ${event.eventLeftTime.minutes()}m left`}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: 170,
            width: 280,
            flex: 1,
          }}
        >
          <ImageBackground
            source={{ uri: event.mapEnvironment }}
            style={styles.eventImage}
            imageStyle={{
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
              opacity: 0.4,
            }}
          >
            <View
              style={{ flexDirection: "row", marginTop: 25, marginLeft: 10 }}
            >
              {sortedBrawlers && (
                <>
                  <Text
                    style={[{ position: "absolute", top: -14 }, styles.text]}
                  >
                    Top 3 Brawlers
                  </Text>
                  {sortedBrawlers[0] && (
                    <Image
                      style={[
                        styles.brawlerImage,
                        styles.border,
                        { borderColor: "gold", marginRight: 5 },
                      ]}
                      source={getBrawlerImage(sortedBrawlers[0].ID)}
                    />
                  )}
                  {sortedBrawlers[1] && (
                    <Image
                      style={[
                        styles.brawlerImage,
                        styles.border,
                        { borderColor: "silver", marginRight: 5 },
                      ]}
                      source={getBrawlerImage(sortedBrawlers[1].ID)}
                    />
                  )}
                  {sortedBrawlers[2] && (
                    <Image
                      style={[
                        styles.brawlerImage,
                        styles.border,
                        { borderColor: "#cd7f32", marginRight: 5 },
                      ]}
                      source={getBrawlerImage(sortedBrawlers[2].ID)}
                    />
                  )}
                </>
              )}
              {sortedTeams && (
                <View
                  style={{
                    position: "absolute",
                    flexDirection: "row",
                    right: 10,
                  }}
                >
                  <Text
                    style={[{ position: "absolute", top: -14, right:0 }, styles.text]}
                  >
                    Top Team
                  </Text>
                  <Image
                    style={styles.brawlerImage}
                    source={getBrawlerImage(teamBrawler1)}
                  />

                  <Image
                    style={styles.brawlerImage}
                    source={getBrawlerImage(teamBrawler2)}
                  />

                  {teamBrawler3.length == 8 && (
                    <Image
                      style={styles.brawlerImage}
                      source={getBrawlerImage(teamBrawler3)}
                    />
                  )}
                </View>
              )}
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  });

  return <View>{eventRectangle}</View>;
};

const styles = StyleSheet.create({
  border: {
    borderWidth: 2,
    borderStyle: "solid",
  },
  brawlerImage: {
    width: 35,
    height: 35,
  },
  rectangle: {
    width: 280,
    height: 120,
    marginTop: 15,
  },
  eventImage: {
    flex: 1,
    width: null,
    height: null,
  },
  modeImage: {
    flex: 0.4,
    resizeMode: "contain",
  },
  text: {
    fontFamily: "Lilita-One",
    fontSize: 10,
    color: colors.secondary,
  },
});
export default EventsModule;
