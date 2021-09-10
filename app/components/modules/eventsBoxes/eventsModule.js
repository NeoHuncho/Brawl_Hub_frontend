import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { AdMobInterstitial } from "expo-ads-admob";
import { ActivityIndicator } from "react-native-paper";
import { showInterstitial, requestAd } from "../../../config/ads";
import { sortEventsData } from "./eventsData";
import colors from "../../../config/colors";

import {
  getBrawlerImage,
  getMapName,
  getBrawlerName,
  getMapImage,
  getModeImage,
  getModeColor,
} from "../../../lib/getAssetsFunctions";
import { useSelector, useDispatch } from "react-redux";
import { moreInfoEventOpen } from "../../../store/reducers/uiReducerNoPersist";
import { getGlobalStatsFromDB } from "../../../lib/apiDB";
import { globalStatsReceived } from "../../../store/reducers/globalStatsReducer";
const windowWidth = Dimensions.get("window").width;
let device = null;
const EventsModule = ({ season, typeIndex, range }) => {
  console.log(typeIndex);
  const [loading, setLoading] = useState(false);
  const [challengeClicked, setChallengeClicked] = useState(false);

  device = useSelector((state) => state.uiReducerNoPersist.deviceType);
  let globalNumbers = useSelector((state) => state.globalStatsReducer);
  let globalStats = globalNumbers.globalStats;
  const dispatch = useDispatch();
  const onPressEvent = (
    type,
    mapName,
    modeImage,
    mapImage,
    sortedBrawlers,
    sortedTeams
  ) => {
    // console.log(type);
    dispatch(
      moreInfoEventOpen({
        isOpen: true,
        type: type,
        name: mapName,
        mode: modeImage,
        image: mapImage,
        sortedBrawlers: sortedBrawlers,
        sortedTeams: sortedTeams,
      })
    );
    setLoading(false);
  };
  let { normalEvents, specialEvents } = sortEventsData(
    typeIndex,
    globalNumbers.challenge_hash
  );

  let eventModule = [];

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  if (typeIndex == 0) {
    // console.log(range)
    let trophiesStats = useSelector(
      (state) => state.globalStatsReducer.globalStats["trophies"][range]
    );
    // console.log("look here g", range);

    normalEvents.map((event) => {
      console.log(5, event.modeName);
      let sortedBrawlers = null;
      let sortedTeams = null;
      if (trophiesStats[event.modeName]) {
        if (trophiesStats[event.modeName][event.mapID]) {
          sortedBrawlers =
            trophiesStats[event.modeName][event.mapID][
              "performanceBrawlersReduced"
            ];
          sortedTeams =
            trophiesStats[event.modeName][event.mapID][
              "performanceTeamsReduced"
            ];
        }
      }

      let teamBrawler1 = null;
      let teamBrawler2 = null;
      let teamBrawler3 = null;
      // console.log(sortedTeams);
      if (sortedTeams) {
        if (sortedTeams.length != 0) {
          teamBrawler1 = sortedTeams[0].ID.slice(0, 8);
          teamBrawler2 = sortedTeams[0].ID.slice(10, 18);
          teamBrawler3 = sortedTeams[0].ID.slice(20, 28);
        }
      }

      eventModule.push(
        <TouchableOpacity
          key={event.mapID}
          style={[
            styles.rectangle,
            device == "tablet" ? { width: 500, height: 150 } : null,
          ]}
          activeOpacity={0.7}
          onPress={async () => {
            // console.log(11122, sortedBrawlers, sortedTeams);
            if (sortedBrawlers.length > 0 || sortedTeams.length > 0) {
              await showInterstitial();
              let globalStatsFromDB = await getGlobalStatsFromDB(
                globalStats,
                season,
                [event.modeName, event.mapID],
                typeIndex,
                range
              );
              await dispatch(globalStatsReceived(globalStatsFromDB));

              onPressEvent(
                "trophies",
                event.mapName,
                event.modeImage,
                event.mapImage,
                globalStatsFromDB["trophies"][range][event.modeName][
                  event.mapID
                ]["performanceBrawlers"],
                globalStatsFromDB["trophies"][range][event.modeName][
                  event.mapID
                ]["performanceTeams"]
              );
              await requestAd();
            }
          }}
        >
          <View
            style={{
              height: device != "tablet" ? 30 : 50,
              width: device != "tablet" ? windowWidth - 100 : 500,
              backgroundColor: event.modeColor,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}
          >
            <View
              style={{
                margin: 5,
                marginTop: device != "tablet" ? 7 : 10,
                flexDirection: "row",
              }}
            >
              <Image
                source={{ uri: event.modeImage }}
                style={[
                  styles.modeImage,
                  device == "tablet" ? { width: 30, height: 30 } : null,
                ]}
              />
              <Text
                style={{
                  fontSize: device != "tablet" ? 14 : 25,
                  fontFamily: "Lilita-One",
                  color: colors.secondary,
                  marginLeft: 4,
                }}
              >
                {event.mapName}
              </Text>

              <Text
                style={{
                  fontSize: device != "tablet" ? 11 : 20,
                  fontFamily: "Lilita-One",
                  color: colors.secondary,
                  position: "absolute",
                  right: device != "tablet" ? 10 : 40,
                  top: 3,
                }}
              >
                {`${event.eventLeftTime.hours()}h: ${event.eventLeftTime.minutes()}m left`}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: device != "tablet" ? windowWidth - 100 : 500,
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
                style={{ flexDirection: "row", marginTop: 30, marginLeft: 20 }}
              >
                {sortedBrawlers && (
                  <>
                    {sortedBrawlers[0] && (
                      <Text
                        style={[
                          {
                            position: "absolute",
                            top: device != "tablet" ? -20 : -22,
                            left: 16,
                            fontSize: device != "tablet" ? 10 : 15,
                          },
                          styles.text,
                        ]}
                      >
                        Top 3 Brawlers
                      </Text>
                    )}
                    {sortedBrawlers[0] && (
                      <Image
                        style={[
                          device != "tablet"
                            ? styles.brawlerImage
                            : styles.brawlerImageTablet,
                          styles.border,
                          { borderColor: "gold", marginRight: 5 },
                        ]}
                        source={getBrawlerImage(sortedBrawlers[0].ID)}
                      />
                    )}
                    {sortedBrawlers[1] && (
                      <Image
                        style={[
                          device != "tablet"
                            ? styles.brawlerImage
                            : styles.brawlerImageTablet,
                          styles.border,
                          { borderColor: "silver", marginRight: 5 },
                        ]}
                        source={getBrawlerImage(sortedBrawlers[1].ID)}
                      />
                    )}
                    {sortedBrawlers[2] && (
                      <Image
                        style={[
                          device != "tablet"
                            ? styles.brawlerImage
                            : styles.brawlerImageTablet,
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
                      right: 20,
                    }}
                  >
                    {sortedTeams[0] && (
                      <Text
                        style={[
                          {
                            position: "absolute",
                            top: device != "tablet" ? -20 : -22,
                            fontSize: device != "tablet" ? 10 : 15,
                            right: 25,
                          },
                          styles.text,
                        ]}
                      >
                        Top Team
                      </Text>
                    )}
                    <Image
                      style={
                        device != "tablet"
                          ? styles.brawlerImageTeam
                          : styles.brawlerImageTablet
                      }
                      source={getBrawlerImage(teamBrawler1)}
                    />

                    <Image
                      style={
                        device != "tablet"
                          ? styles.brawlerImageTeam
                          : styles.brawlerImageTablet
                      }
                      source={getBrawlerImage(teamBrawler2)}
                    />

                    {teamBrawler3 ? (
                      teamBrawler3.length == 8 ? (
                        <Image
                          style={
                            device != "tablet"
                              ? styles.brawlerImageTeam
                              : styles.brawlerImageTablet
                          }
                          source={getBrawlerImage(teamBrawler3)}
                        />
                      ) : null
                    ) : null}
                  </View>
                )}
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      );
    });

    return (
      <View style={{ marginBottom: 10 }}>
        {loading && (
          <ActivityIndicator
            animating={true}
            color={"blue"}
            size={"large"}
            style={{
              position: "absolute",
              top: 0,
              margin: "auto",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 8,
            }}
          />
        )}
        {eventModule}
      </View>
    );
  } else if (typeIndex == 1) {
    let powerLeagueStats = useSelector(
      (state) => state.globalStatsReducer.globalStats["powerLeagueSolo"][range]
    );
    for (let modeName in powerLeagueStats) {
      let maps = [];
      let sortedBrawlers = {};
      let sortedTeams = {};

      let teamBrawler1 = {};
      let teamBrawler2 = {};
      let teamBrawler3 = {};
      for (let mapID in powerLeagueStats[modeName]) {
        if (powerLeagueStats[modeName]) {
          if (powerLeagueStats[modeName][mapID]) {
            sortedBrawlers[mapID] =
              powerLeagueStats[modeName][mapID]["performanceBrawlersReduced"];
            sortedTeams[mapID] =
              powerLeagueStats[modeName][mapID]["performanceTeamsReduced"];

            for (const team in sortedTeams[mapID]) {
              // console.log(team);
              if (sortedTeams[mapID][team].ID) {
                teamBrawler1[mapID] = sortedTeams[mapID][team].ID.slice(0, 8);
                teamBrawler2[mapID] = sortedTeams[mapID][team].ID.slice(10, 18);
                teamBrawler3[mapID] = sortedTeams[mapID][team].ID.slice(20, 28);
              }
            }
          }
        }

        maps.push(mapID);
      }

      eventModule.push(
        <>
          {modeName != "count" && (
            <View>
              <View>
                <Text
                  style={[
                    styles.text,
                    { fontSize: device != "tablet" ? 20 : 30, marginTop: 20 },
                  ]}
                >
                  {capitalizeFirstLetter(
                    modeName
                      .replace(/([A-Z]+)/g, " $1")
                      .replace(/([A-Z][a-z])/g, " $1")
                  )}
                </Text>
              </View>
              {/*Top Row */}
              <View style={{ flexDirection: "row" }}>
                {maps.map((mapID, index) => {
                  return index <= 1 ? (
                    <TouchableOpacity
                      onPress={async () => {
                        if (sortedBrawlers[mapID] || sortedTeams[mapID]) {
                          await showInterstitial();
                          // console.log('look here', modeName,mapID)
                          let globalStatsFromDB = await getGlobalStatsFromDB(
                            globalStats,
                            season,
                            [modeName, mapID],
                            typeIndex,
                            range
                          );
                          await dispatch(
                            globalStatsReceived(globalStatsFromDB)
                          );
                          onPressEvent(
                            "powerLeague",
                            mapID,
                            mapID,
                            mapID,
                            globalStatsFromDB["powerLeagueSolo"][range][
                              modeName
                            ][mapID]["performanceBrawlers"],
                            globalStatsFromDB["powerLeagueSolo"][range][
                              modeName
                            ][mapID]["performanceTeams"]
                          );
                          await requestAd();
                        }
                      }}
                      style={{
                        position: "absolute",
                        right: 4,
                        top: 3.5,
                      }}
                      style={[
                        device != "tablet"
                          ? styles.square
                          : styles.squareTablet,
                        {
                          backgroundColor: getModeColor(modeName),
                          marginRight: 10,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.text,
                          {
                            marginTop: 4,
                            marginLeft: 4,
                            fontSize: device != "tablet" ? 13 : 25,
                          },
                        ]}
                      >
                        {getMapName(mapID)}
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        <View style={{ marginLeft: 4 }}>
                          {sortedBrawlers && (
                            <>
                              {sortedBrawlers[mapID] && (
                                <>
                                  <Text
                                    style={[
                                      styles.text,
                                      {
                                        fontSize: device != "tablet" ? 8 : 15,
                                        marginTop: 3,
                                        marginBottom: 2,
                                      },
                                    ]}
                                  >
                                    Top 3 Brawlers
                                  </Text>

                                  <View style={{ flexDirection: "row" }}>
                                    {sortedBrawlers[mapID][0] && (
                                      <Image
                                        style={[
                                          styles.border,
                                          {
                                            borderColor: "gold",
                                            width: device != "tablet" ? 28 : 50,
                                            height:
                                              device != "tablet" ? 28 : 50,
                                            borderWidth:
                                              device != "tablet" ? 2 : 3,
                                          },
                                        ]}
                                        source={getBrawlerImage(
                                          sortedBrawlers[mapID][0].ID
                                        )}
                                      />
                                    )}
                                    {sortedBrawlers[mapID][1] && (
                                      <Image
                                        style={[
                                          styles.border,
                                          {
                                            borderColor: "silver",
                                            width: device != "tablet" ? 28 : 50,
                                            height:
                                              device != "tablet" ? 28 : 50,
                                            borderWidth:
                                              device != "tablet" ? 2 : 3,
                                            marginLeft:
                                              device != "tablet" ? 2 : 5,
                                          },
                                        ]}
                                        source={getBrawlerImage(
                                          sortedBrawlers[mapID][1].ID
                                        )}
                                      />
                                    )}
                                    {sortedBrawlers[mapID][2] && (
                                      <Image
                                        style={[
                                          styles.border,
                                          {
                                            borderColor: "#cd7f32",
                                            width: device != "tablet" ? 28 : 50,
                                            height:
                                              device != "tablet" ? 28 : 50,
                                            borderWidth:
                                              device != "tablet" ? 2 : 3,
                                            marginLeft:
                                              device != "tablet" ? 2 : 5,
                                          },
                                        ]}
                                        source={getBrawlerImage(
                                          sortedBrawlers[mapID][2].ID
                                        )}
                                      />
                                    )}
                                  </View>
                                </>
                              )}
                            </>
                          )}
                          {teamBrawler1[mapID] && (
                            <>
                              <Text
                                style={[
                                  styles.text,
                                  {
                                    fontSize: device != "tablet" ? 8 : 15,
                                    marginTop: 5,
                                    marginBottom: 2,
                                  },
                                ]}
                              >
                                Top Team
                              </Text>

                              <View
                                style={{
                                  flexDirection: "row",
                                }}
                              >
                                <Image
                                  style={[
                                    {
                                      width: device != "tablet" ? 28 : 50,
                                      height: device != "tablet" ? 28 : 50,
                                    },
                                  ]}
                                  source={getBrawlerImage(teamBrawler1[mapID])}
                                />

                                <Image
                                  style={[
                                    {
                                      width: device != "tablet" ? 28 : 50,
                                      height: device != "tablet" ? 28 : 50,
                                    },
                                  ]}
                                  source={getBrawlerImage(teamBrawler2[mapID])}
                                />

                                {teamBrawler3[mapID] ? (
                                  <Image
                                    style={[
                                      {
                                        width: device != "tablet" ? 28 : 50,
                                        height: device != "tablet" ? 28 : 50,
                                      },
                                    ]}
                                    source={getBrawlerImage(
                                      teamBrawler3[mapID]
                                    )}
                                  />
                                ) : null}
                              </View>
                            </>
                          )}
                        </View>

                        <Image
                          source={getMapImage(mapID)}
                          style={{
                            width: device != "tablet" ? 55 : 75,
                            height: device != "tablet" ? 93.5 : 127.5,
                            position: "absolute",
                            right: 10,
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : null;
                })}
              </View>
              {/*Bottom Row */}
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                {maps.map((mapID, index) => {
                  return index >= 2 ? (
                    <TouchableOpacity
                      style={[
                        device != "tablet"
                          ? styles.square
                          : styles.squareTablet,
                        {
                          backgroundColor: getModeColor(modeName),
                          marginRight: 10,
                        },
                      ]}
                      onPress={async () => {
                        if (sortedBrawlers[mapID] || sortedTeams[mapID]) {
                          await showInterstitial();
                          let globalStatsFromDB = await getGlobalStatsFromDB(
                            globalStats,
                            season,
                            [modeName, mapID],
                            typeIndex,
                            range
                          );
                          await dispatch(
                            globalStatsReceived(globalStatsFromDB)
                          );
                          onPressEvent(
                            "powerLeague",
                            mapID,
                            mapID,
                            mapID,
                            globalStatsFromDB["powerLeagueSolo"][range][
                              modeName
                            ][mapID]["performanceBrawlers"],
                            globalStatsFromDB["powerLeagueSolo"][range][
                              modeName
                            ][mapID]["performanceTeams"]
                          );
                          await requestAd();
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.text,
                          {
                            marginTop: 4,
                            marginLeft: 4,
                            fontSize: device != "tablet" ? 13 : 25,
                          },
                        ]}
                      >
                        {getMapName(mapID)}
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        <View style={{ marginLeft: 4 }}>
                          {sortedBrawlers && (
                            <>
                              {sortedBrawlers[mapID] && (
                                <>
                                  <Text
                                    style={[
                                      styles.text,
                                      {
                                        fontSize: device != "tablet" ? 8 : 15,
                                        marginTop: 3,
                                        marginBottom: 2,
                                      },
                                    ]}
                                  >
                                    Top 3 Brawlers
                                  </Text>

                                  <View style={{ flexDirection: "row" }}>
                                    {sortedBrawlers[mapID][0] && (
                                      <Image
                                        style={[
                                          device != "tablet"
                                            ? styles.brawlerImage
                                            : styles.brawlerImageTablet,
                                          styles.border,
                                          {
                                            borderColor: "gold",
                                            width: device != "tablet" ? 28 : 50,
                                            height:
                                              device != "tablet" ? 28 : 50,
                                            borderWidth:
                                              device != "tablet" ? 2 : 3,
                                          },
                                        ]}
                                        source={getBrawlerImage(
                                          sortedBrawlers[mapID][0].ID
                                        )}
                                      />
                                    )}
                                    {sortedBrawlers[mapID][1] && (
                                      <Image
                                        style={[
                                          device != "tablet"
                                            ? styles.brawlerImage
                                            : styles.brawlerImageTablet,
                                          styles.border,
                                          {
                                            borderColor: "silver",
                                            width: device != "tablet" ? 28 : 50,
                                            height:
                                              device != "tablet" ? 28 : 50,
                                            borderWidth:
                                              device != "tablet" ? 2 : 3,
                                            marginLeft:
                                              device != "tablet" ? 2 : 5,
                                          },
                                        ]}
                                        source={getBrawlerImage(
                                          sortedBrawlers[mapID][1].ID
                                        )}
                                      />
                                    )}
                                    {sortedBrawlers[mapID][2] && (
                                      <Image
                                        style={[
                                          device != "tablet"
                                            ? styles.brawlerImage
                                            : styles.brawlerImageTablet,
                                          styles.border,
                                          {
                                            borderColor: "#cd7f32",
                                            width: device != "tablet" ? 28 : 50,
                                            height:
                                              device != "tablet" ? 28 : 50,
                                            borderWidth:
                                              device != "tablet" ? 2 : 3,
                                            marginLeft:
                                              device != "tablet" ? 2 : 5,
                                          },
                                        ]}
                                        source={getBrawlerImage(
                                          sortedBrawlers[mapID][2].ID
                                        )}
                                      />
                                    )}
                                  </View>
                                </>
                              )}
                            </>
                          )}
                          {teamBrawler1[mapID] && (
                            <>
                              <Text
                                style={[
                                  styles.text,
                                  {
                                    fontSize: device != "tablet" ? 8 : 15,
                                    marginTop: 5,
                                    marginBottom: 2,
                                  },
                                ]}
                              >
                                Top Team
                              </Text>

                              <View
                                style={{
                                  flexDirection: "row",
                                }}
                              >
                                <Image
                                  style={[
                                    device != "tablet"
                                      ? styles.brawlerImage
                                      : styles.brawlerImageTablet,
                                    {
                                      width: device != "tablet" ? 28 : 50,
                                      height: device != "tablet" ? 28 : 50,
                                    },
                                  ]}
                                  source={getBrawlerImage(teamBrawler1[mapID])}
                                />

                                <Image
                                  style={[
                                    device != "tablet"
                                      ? styles.brawlerImage
                                      : styles.brawlerImageTablet,
                                    {
                                      width: device != "tablet" ? 28 : 50,
                                      height: device != "tablet" ? 28 : 50,
                                    },
                                  ]}
                                  source={getBrawlerImage(teamBrawler2[mapID])}
                                />

                                {teamBrawler3[mapID] ? (
                                  <Image
                                    style={[
                                      device != "tablet"
                                        ? styles.brawlerImage
                                        : styles.brawlerImageTablet,
                                      {
                                        width: device != "tablet" ? 28 : 50,
                                        height: device != "tablet" ? 28 : 50,
                                      },
                                    ]}
                                    source={getBrawlerImage(
                                      teamBrawler3[mapID]
                                    )}
                                  />
                                ) : null}
                              </View>
                            </>
                          )}
                        </View>

                        <Image
                          source={getMapImage(mapID)}
                          style={{
                            width: device != "tablet" ? 55 : 75,
                            height: device != "tablet" ? 93.5 : 127.5,
                            position: "absolute",
                            right: 10,
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : null;
                })}
              </View>
            </View>
          )}
        </>
      );
    }
    // console.log(eventModule);
    return (
      <View>
        {loading && (
          <ActivityIndicator
            animating={true}
            color={"blue"}
            size={"large"}
            style={{
              position: "absolute",
              top: 0,
              margin: "auto",
              left: 0,
              right: 0,
              zIndex: 8,
            }}
          />
        )}

        {eventModule}
      </View>
    );
  } else if (typeIndex == "challenge") {
    let trophiesStats = useSelector(
      (state) => state.globalStatsReducer.globalStats["trophies"][range]
    );
    let challengeImage = null;
    let challenge_endTime = undefined;
    let challenge_startTime = undefined;

    specialEvents.map((event) => {
      let sortedBrawlers = null;
      let sortedTeams = null;
      challengeImage = event.eventImage;
      challenge_startTime == undefined
        ? (challenge_startTime = event.eventStartTime)
        : null;
      challenge_endTime == undefined
        ? (challenge_endTime = event.eventLeftTime)
        : null;
      if (trophiesStats[event.modeName]) {
        if (trophiesStats[event.modeName][event.mapID]) {
          sortedBrawlers =
            trophiesStats[event.modeName][event.mapID][
              "performanceBrawlersReduced"
            ];
          sortedTeams =
            trophiesStats[event.modeName][event.mapID][
              "performanceTeamsReduced"
            ];
        }
      }

      let teamBrawler1 = null;
      let teamBrawler2 = null;
      let teamBrawler3 = null;
      // console.log(sortedTeams);
      if (sortedTeams) {
        if (sortedTeams.length != 0) {
          teamBrawler1 = sortedTeams[0].ID.slice(0, 8);
          teamBrawler2 = sortedTeams[0].ID.slice(10, 18);
          teamBrawler3 = sortedTeams[0].ID.slice(20, 28);
        }
      }

      eventModule.push(
        <TouchableOpacity
          key={event.mapID}
          style={[
            styles.rectangle,
            device == "tablet" ? { width: 500, height: 150 } : null,
          ]}
          onPress={async () => {
            if (sortedBrawlers != undefined || sortedTeams != undefined) {
            }
            await showInterstitial();
            let globalStatsFromDB = await getGlobalStatsFromDB(
              globalStats,
              season,
              [event.modeName, event.mapID],
              0,
              range
            );
            await dispatch(globalStatsReceived(globalStatsFromDB));

            onPressEvent(
              "trophies",
              event.mapName,
              event.modeImage,
              event.mapImage,
              globalStatsFromDB["trophies"][range][event.modeName][event.mapID][
                "performanceBrawlers"
              ],
              globalStatsFromDB["trophies"][range][event.modeName][event.mapID][
                "performanceTeams"
              ]
            );
            await requestAd();
          }}
        >
          <View
            style={{
              height: device != "tablet" ? 30 : 50,
              width: device != "tablet" ? windowWidth - 100 : 500,
              backgroundColor: event.modeColor,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}
          >
            <View
              style={{
                margin: 5,
                marginTop: device != "tablet" ? 7 : 10,
                flexDirection: "row",
              }}
            >
              <Image
                source={{ uri: event.modeImage }}
                style={[
                  styles.modeImage,
                  device == "tablet" ? { width: 30, height: 30 } : null,
                ]}
              />
              <Text
                style={{
                  fontSize: device != "tablet" ? 14 : 25,
                  fontFamily: "Lilita-One",
                  color: colors.secondary,
                  marginLeft: 4,
                }}
              >
                {event.mapName}
              </Text>

              <Text
                style={{
                  fontSize: device != "tablet" ? 14 : 20,
                  fontFamily: "Lilita-One",
                  color: colors.secondary,
                  position: "absolute",
                  right: device != "tablet" ? 30 : 40,
                  top: 3,
                }}
              >
                {event.challengeNumber}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: device != "tablet" ? windowWidth - 100 : 500,
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
                style={{ flexDirection: "row", marginTop: 30, marginLeft: 20 }}
              >
                {sortedBrawlers && (
                  <>
                    {sortedBrawlers[0] && (
                      <Text
                        style={[
                          {
                            position: "absolute",
                            top: device != "tablet" ? -20 : -22,
                            left: 16,
                            fontSize: device != "tablet" ? 10 : 15,
                          },
                          styles.text,
                        ]}
                      >
                        Top 3 Brawlers
                      </Text>
                    )}
                    {sortedBrawlers[0] && (
                      <Image
                        style={[
                          device != "tablet"
                            ? styles.brawlerImage
                            : styles.brawlerImageTablet,
                          styles.border,
                          { borderColor: "gold", marginRight: 5 },
                        ]}
                        source={getBrawlerImage(sortedBrawlers[0].ID)}
                      />
                    )}
                    {sortedBrawlers[1] && (
                      <Image
                        style={[
                          device != "tablet"
                            ? styles.brawlerImage
                            : styles.brawlerImageTablet,
                          styles.border,
                          { borderColor: "silver", marginRight: 5 },
                        ]}
                        source={getBrawlerImage(sortedBrawlers[1].ID)}
                      />
                    )}
                    {sortedBrawlers[2] && (
                      <Image
                        style={[
                          device != "tablet"
                            ? styles.brawlerImage
                            : styles.brawlerImageTablet,
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
                      right: 20,
                    }}
                  >
                    {sortedTeams[0] && (
                      <Text
                        style={[
                          {
                            position: "absolute",
                            top: device != "tablet" ? -20 : -22,
                            fontSize: device != "tablet" ? 10 : 15,
                            right: 25,
                          },
                          styles.text,
                        ]}
                      >
                        Top Team
                      </Text>
                    )}
                    <Image
                      style={
                        device != "tablet"
                          ? styles.brawlerImage
                          : styles.brawlerImageTablet
                      }
                      source={getBrawlerImage(teamBrawler1)}
                    />

                    <Image
                      style={
                        device != "tablet"
                          ? styles.brawlerImage
                          : styles.brawlerImageTablet
                      }
                      source={getBrawlerImage(teamBrawler2)}
                    />

                    {teamBrawler3 ? (
                      teamBrawler3.length == 8 ? (
                        <Image
                          style={
                            device != "tablet"
                              ? styles.brawlerImage
                              : styles.brawlerImageTablet
                          }
                          source={getBrawlerImage(teamBrawler3)}
                        />
                      ) : null
                    ) : null}
                  </View>
                )}
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      );
    });
    console.log(challenge_startTime);
    return (
      <View style={{ marginBottom: 10 }}>
        {loading && (
          <ActivityIndicator
            animating={true}
            color={"blue"}
            size={"large"}
            style={{
              position: "absolute",
              top: 0,
              margin: "auto",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 8,
            }}
          />
        )}

        <TouchableOpacity
          onPress={() =>
            challengeClicked == false
              ? setChallengeClicked(true)
              : setChallengeClicked(false)
          }
        >
          <View style={{ alignItems: "center" }}>
            <Image
              source={{ uri: challengeImage }}
              style={{
                height: globalNumbers.challenge_imageHeight,
                width: globalNumbers.challenge_imageWidth,
                marginTop: 20,
              }}
            />
            <Text
              style={{
                fontFamily: "Lilita-One",
                color: colors.primary,
                fontSize: 13,
                marginTop: 5,
              }}
            >
              {globalNumbers.challenge_name}
            </Text>
          </View>
        </TouchableOpacity>

        {challengeClicked == true && eventModule}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  border: {
    borderWidth: 2,
    borderRadius: 3,
  },
  brawlerImage: {
    width: 34,
    height: 34,
  },
  brawlerImageTeam: {
    width: 33,
    height: 33,
    marginLeft: 2,
  },
  brawlerImageTablet: {
    width: 50,
    height: 50,
  },
  rectangle: {
    width: windowWidth - 100,
    height: 120,
    marginTop: 20,
  },
  square: {
    width: 175,
    height: 120,
    marginTop: 10,
  },
  squareTablet: {
    width: 350,
    height: 180,
    marginTop: 15,
  },
  eventImage: {
    flex: 1,
    width: null,
    height: null,
  },
  modeImage: {
    flex: 0.15,
    resizeMode: "contain",
  },
  text: {
    fontFamily: "Lilita-One",

    color: colors.secondary,
  },
});
export default EventsModule;
