import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import { eventsData, eventActiveData, eventUpcomingData } from "./eventsData";
import colors from "../../../config/colors";
import { bestBrawlers, bestTeams } from "../../../lib/getGlobalStatsFunctions";
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

const EventsModule = ({ seasonIndex, typeIndex, range }) => {
  const dispatch = useDispatch();
  const onPressEvent = (
    type,
    mapName,
    modeImage,
    mapImage,
    sortedBrawlers,
    sortedTeams
  ) => {
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
  };
  eventsData();
  let powerLeagueStats = null;
  let powerLeagueStatsSolo = useSelector(
    (state) => state.globalStatsReducer.globalStats["powerLeagueSolo"][range]
  );
  let powerLeagueStatsTeam = useSelector(
    (state) => state.globalStatsReducer.globalStats["powerLeagueTeam"][range]
  );
  if (typeIndex == 1) {
    powerLeagueStats = powerLeagueStatsSolo;
  } else if (typeIndex == 2) {
    powerLeagueStats = powerLeagueStatsTeam;
  }

  let eventModule = [];

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  if (typeIndex == 0) {
    eventActiveData.map((event) => {
      let sortedBrawlers = bestBrawlers(
        typeIndex,
        range,
        event.modeName,
        event.mapID
      );
      let sortedTeams = bestTeams(
        typeIndex,
        range,
        event.modeName,
        event.mapID
      );

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
              <Image
                source={{ uri: event.modeImage }}
                style={styles.modeImage}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Lilita-One",
                  color: colors.secondary,
                  marginLeft: 4,
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
                  right: 30,
                  top: 3,
                }}
              >
                {`${event.eventLeftTime.hours()}h: ${event.eventLeftTime.minutes()}m left`}
              </Text>
              {(sortedBrawlers != undefined || sortedTeams != undefined) && (
                <TouchableOpacity
                  onPress={() =>
                    onPressEvent(
                      "trophies",
                      event.mapName,
                      event.modeImage,
                      event.mapImage,
                      sortedBrawlers,
                      sortedTeams
                    )
                  }
                  style={{
                    position: "absolute",
                    right: 0,
                    top: -3,
                  }}
                >
                  <Image
                    source={require("../../../assets/icons/infoButton.png")}
                    style={{
                      width: 25,
                      height: 25,
                    }}
                  />
                </TouchableOpacity>
              )}
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
                    {sortedBrawlers[0] && (
                      <Text
                        style={[
                          { position: "absolute", top: -14 },
                          styles.text,
                        ]}
                      >
                        Top 3 Brawlers
                      </Text>
                    )}
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
                    {sortedTeams[0] && (
                      <Text
                        style={[
                          { position: "absolute", top: -14, right: 0 },
                          styles.text,
                        ]}
                      >
                        Top Team
                      </Text>
                    )}
                    <Image
                      style={styles.brawlerImage}
                      source={getBrawlerImage(teamBrawler1)}
                    />

                    <Image
                      style={styles.brawlerImage}
                      source={getBrawlerImage(teamBrawler2)}
                    />

                    {teamBrawler3 ? (
                      teamBrawler3.length == 8 ? (
                        <Image
                          style={styles.brawlerImage}
                          source={getBrawlerImage(teamBrawler3)}
                        />
                      ) : null
                    ) : null}
                  </View>
                )}
              </View>
            </ImageBackground>
          </View>
        </View>
      );
    });

    return <View style={{ marginBottom: 10 }}>{eventModule}</View>;
  } else if (typeIndex >= 1) {
    for (let modeName in powerLeagueStats) {
      let maps = [];
      let sortedBrawlers = {};
      let sortedTeams = {};

      let teamBrawler1 = {};
      let teamBrawler2 = {};
      let teamBrawler3 = {};
      for (let mapID in powerLeagueStats[modeName]) {
        sortedBrawlers[mapID] = bestBrawlers(typeIndex, range, modeName, mapID);
        sortedTeams[mapID] = bestTeams(typeIndex, range, modeName, mapID);

        let bestTeam = bestTeams(typeIndex, range, modeName, mapID);
        if (bestTeam) {
          if (bestTeam.length != 0) {
            teamBrawler1[mapID] = bestTeam[0].ID.slice(0, 8);
            teamBrawler2[mapID] = bestTeam[0].ID.slice(10, 18);
            teamBrawler3[mapID] = bestTeam[0].ID.slice(20, 28);
          }
        }
        maps.push(mapID);
      }

      eventModule.push(
        <>
          {modeName != "count" && (
            <View>
              <View>
                <Text style={[styles.text, { fontSize: 20, marginTop: 10 }]}>
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
                    <View
                      style={[
                        styles.square,
                        {
                          backgroundColor: getModeColor(modeName),
                          marginRight: 10,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.text,
                          { marginTop: 4, marginLeft: 4, fontSize: 11 },
                        ]}
                      >
                        {getMapName(mapID) == "Some Assembly Required"
                          ? "Some Assembly R."
                          : getMapName(mapID)}
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
                                      { fontSize: 8, marginTop: 3 },
                                    ]}
                                  >
                                    Top 3 Brawlers
                                  </Text>

                                  <View style={{ flexDirection: "row" }}>
                                    {sortedBrawlers[mapID][0] && (
                                      <Image
                                        style={[
                                          styles.brawlerImage,
                                          styles.border,
                                          {
                                            borderColor: "gold",
                                            width: 28,
                                            height: 28,
                                            borderWidth: 1,
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
                                          styles.brawlerImage,
                                          styles.border,
                                          {
                                            borderColor: "silver",
                                            width: 28,
                                            height: 28,
                                            borderWidth: 1,
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
                                          styles.brawlerImage,
                                          styles.border,
                                          {
                                            borderColor: "#cd7f32",
                                            width: 28,
                                            height: 28,
                                            borderWidth: 1,
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
                                  { fontSize: 8, marginTop: 5 },
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
                                    styles.brawlerImage,
                                    { width: 28, height: 28 },
                                  ]}
                                  source={getBrawlerImage(teamBrawler1[mapID])}
                                />

                                <Image
                                  style={[
                                    styles.brawlerImage,
                                    { width: 28, height: 28 },
                                  ]}
                                  source={getBrawlerImage(teamBrawler2[mapID])}
                                />

                                {teamBrawler3[mapID] ? (
                                  <Image
                                    style={[
                                      styles.brawlerImage,
                                      { width: 28, height: 28 },
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
                            width: 55,
                            height: 85,
                            position: "absolute",
                            right: 10,
                            top: 6,
                          }}
                        />
                      </View>
                      {(sortedBrawlers[mapID] || sortedTeams[mapID]) && (
                        <TouchableOpacity
                          onPress={() =>
                            onPressEvent(
                              "powerLeague",
                              mapID,
                              mapID,
                              mapID,
                              sortedBrawlers[mapID],
                              sortedTeams[mapID]
                            )
                          }
                          style={{
                            position: "absolute",
                            right: 4,
                            top: 3.5,
                          }}
                        >
                          <Image
                            source={require("../../../assets/icons/infoButton.png")}
                            style={{
                              width: 20,
                              height: 20,
                            }}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : null;
                })}
              </View>
              {/*Bottom Row */}
              <View style={{ flexDirection: "row" }}>
                {maps.map((mapID, index) => {
                  return index >= 2 ? (
                    <View
                      style={[
                        styles.square,
                        {
                          backgroundColor: getModeColor(modeName),
                          marginRight: 10,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.text,
                          { marginTop: 4, marginLeft: 4, fontSize: 11 },
                        ]}
                      >
                        {getMapName(mapID) == "Some Assembly Required"
                          ? "Some Assembly R."
                          : getMapName(mapID)}
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
                                      { fontSize: 8, marginTop: 3 },
                                    ]}
                                  >
                                    Top 3 Brawlers
                                  </Text>

                                  <View style={{ flexDirection: "row" }}>
                                    {sortedBrawlers[mapID][0] && (
                                      <Image
                                        style={[
                                          styles.brawlerImage,
                                          styles.border,
                                          {
                                            borderColor: "gold",
                                            width: 28,
                                            height: 28,
                                            borderWidth: 1,
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
                                          styles.brawlerImage,
                                          styles.border,
                                          {
                                            borderColor: "silver",
                                            width: 28,
                                            height: 28,
                                            borderWidth: 1,
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
                                          styles.brawlerImage,
                                          styles.border,
                                          {
                                            borderColor: "#cd7f32",
                                            width: 28,
                                            height: 28,
                                            borderWidth: 1,
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
                                  { fontSize: 8, marginTop: 5 },
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
                                    styles.brawlerImage,
                                    { width: 28, height: 28 },
                                  ]}
                                  source={getBrawlerImage(teamBrawler1[mapID])}
                                />

                                <Image
                                  style={[
                                    styles.brawlerImage,
                                    { width: 28, height: 28 },
                                  ]}
                                  source={getBrawlerImage(teamBrawler2[mapID])}
                                />

                                {teamBrawler3[mapID] ? (
                                  <Image
                                    style={[
                                      styles.brawlerImage,
                                      { width: 28, height: 28 },
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
                            width: 55,
                            height: 85,
                            position: "absolute",
                            right: 10,
                            top: 6,
                          }}
                        />
                      </View>
                      {(sortedBrawlers[mapID] || sortedTeams[mapID]) && (
                        <TouchableOpacity
                          onPress={() =>
                            onPressEvent(
                              "powerLeague",
                              mapID,
                              mapID,
                              mapID,
                              sortedBrawlers[mapID],
                              sortedTeams[mapID]
                            )
                          }
                          style={{
                            position: "absolute",
                            right: 4,
                            top: 3.5,
                          }}
                        >
                          <Image
                            source={require("../../../assets/icons/infoButton.png")}
                            style={{
                              width: 20,
                              height: 20,
                            }}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : null;
                })}
              </View>
            </View>
          )}
        </>
      );
    }
    // console.log(eventModule);
    return <View>{eventModule}</View>;
  }
};

const styles = StyleSheet.create({
  border: {
    borderWidth: 2,
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
  square: {
    width: 175,
    height: 110,
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
    fontSize: 10,
    color: colors.secondary,
  },
});
export default EventsModule;
