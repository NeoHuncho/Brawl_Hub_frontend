import React from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import nestedProperty from "nested-property";
import colors from "../../config/colors";
import { userIdReset } from "../../store/playerIdReducer";
import WinLossModule from "../../components/modules/WinLossModule";

//import CarouselModule from "../../components/modules/Carousel/CarouselModule";

export default function PlayerStats() {
  const dispatch = useDispatch();
  const player = useSelector((state) => state.battleLogReducer.player);
  let playerStats = useSelector((state) => state.battleLogReducer.playerStats);
  const handleReset = () => {
    console.log("called");
    try {
      dispatch(userIdReset());
    } catch (error) {
      console.log(error);
    }
  };

  let mKeys = [];
  let bKeys = [];
  let tKeys = [];

  let modeKeys = Object.keys(playerStats.mode);

  let maps = modeKeys
    .map((mode) => playerStats.mode[mode].map)
    .reduce((r, c) => Object.assign(r, c), {});

  modeKeys.map((mode) => mKeys.push(Object.keys(playerStats.mode[mode].map)));

  let mapKeys = mKeys.flat();

  modeKeys.map((mode) =>
    mapKeys.map((map) => {
      if (playerStats.mode[mode].map[map]) {
        bKeys.push(Object.keys(playerStats.mode[mode].map[map].brawler));
      }
    })
  );

  let brawlerKeys = bKeys.flat().filter((v, i, a) => a.indexOf(v) === i);

  modeKeys.map((mode) =>
    mapKeys.map((map) => {
      brawlerKeys.map((brawler) => {
        if (playerStats.mode[mode].map[map]) {
          if (playerStats.mode[mode].map[map].brawler[brawler])
            tKeys.push(
              Object.keys(playerStats.mode[mode].map[map].brawler[brawler].team)
            );
        }
      });
    })
  );
  let teamKeys = tKeys.flat().filter((v, i, a) => a.indexOf(v) === i);

  let reducerBrawler = (stored, next) => {
    let result = {};
    brawlerKeys.map((brawler) => {
      if (stored === undefined || (stored === {} && next !== undefined)) {
       // console.log("called 1");
        return next;
      } else if (stored !== undefined && next === undefined) {
       // console.log("called 2");
        result = stored;
      }

      if (stored && next) {
      //  console.log("called 3");
        if (stored[brawler] && next[brawler]) {
        //  console.log("called 4");
          result[brawler] = {
            wins: stored[brawler].wins + next[brawler].wins,
            losses: stored[brawler].losses + next[brawler].losses,
            lossesByTrophies:
              stored[brawler].lossesByTrophies + next[brawler].lossesByTrophies,
            winsByTrophies:
              stored[brawler].winsByTrophies + next[brawler].winsByTrophies,
            winRatio: stored[brawler].winRatio + next[brawler].winRatio,
          };
        } else if (next[brawler]) {
         // console.log("called 5");
          result[brawler] = {
            wins: next[brawler].wins,
            losses: next[brawler].losses,
            lossesByTrophies: next[brawler].lossesByTrophies,
            winsByTrophies: next[brawler].winsByTrophies,
            winRatio: next[brawler].winRatio,
          };
        } else if (stored[brawler]) {
        //  console.log("called 6");
          result[brawler] = stored[brawler];
        }
      }
    });

    return result;
  };

  let reducerTeams = (stored, next) => {
    //console.log(next);
    //console.log(stored);
    let result = {};
    teamKeys.map((team) => {
      if (stored === undefined || (stored === {} && next !== undefined)) {
       // console.log("called 1");
        return next;
      } else if (stored !== undefined && next === undefined) {
        //console.log("called 2");
        result = stored;
      }

      if (stored && next) {
       // console.log("called 3");
        if (stored[team] && next[team]) {
         // console.log("called 4");
          result[team] = {
            wins: stored[team].wins + next[team].wins,
            losses: stored[team].losses + next[team].losses,
            lossesByTrophies:
              stored[team].lossesByTrophies + next[team].lossesByTrophies,
            winsByTrophies:
              stored[team].winsByTrophies + next[team.winsByTrophies],
            winRatio: stored[team].winRatio + next[team].winRatio,
          };
        } else if (next[team]) {
        //  console.log("called 5");
          result[team] = {
            wins: next[team].wins,
            losses: next[team].losses,
            lossesByTrophies: next[team].lossesByTrophies,
            winsByTrophies: next[team].winsByTrophies,
            winRatio: next[team].winRatio,
          };
        } else if (stored[team]) {
          //console.log("called 6");
          result[team] = stored[team];
        }
      }
    });
    console.log(result);
    return result;
  };

  let brawlers = modeKeys
    .map((mode) =>
      mapKeys.map((map) => {
        if (playerStats.mode[mode].map[map]) {
          return playerStats.mode[mode].map[map].brawler;
        }
      })
    )
    .flat()
    .reduce(reducerBrawler);

  let savedTeams = [];

  let saveTeams = (x) => {
    savedTeams.push(x);
  };

  let brokenTeams = modeKeys
    .map((mode) =>
      mapKeys.map((map) =>
        brawlerKeys.map((brawler) => {
          if (playerStats.mode[mode].map[map]) {
            if (playerStats.mode[mode].map[map].brawler[brawler]) {
              return playerStats.mode[mode].map[map].brawler[brawler].team;
            }
          }
        })
      )
    )
    .flat(1)
    .map((team) => team.filter((x) => x !== undefined))
    .filter((el) => (el.length <= 0 ? null : el))
    .map((team) => team.map((x) => saveTeams(x)));
  let teams = savedTeams.reduce(reducerTeams);

  // let brawlersData=[]
  // for(const brawler in brawlers){
  //   brawlersData.push({
  //     image: require("../../assets/Brawlers_icons/")
  //   })
  // }
  console.log(
    modeKeys,
    mapKeys,
    brawlerKeys,
    teamKeys,
    maps,
    brawlers,
   teams
  );
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{player.name}</Text>

          <TouchableHighlight onPress={() => handleReset()}>
            <Ionicons
              style={styles.icon}
              name="exit"
              size={24}
              color={colors.secondary}
            ></Ionicons>
          </TouchableHighlight>
        </View>
        <View style={{ marginTop: 10 }}>
          <WinLossModule />
        </View>

        <View style={{ marginTop: 60 }}>
          <Text style={styles.categoryName}>Player Stats by Mode</Text>
          {/* <CarouselModule />  */}
        </View>
        <View style={{}}>
          <Text style={styles.categoryName}>Player Stats by Brawler</Text>
          {/* <CarouselModule />  */}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  nameContainer: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "center",
  },
  name: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 30,
    textAlign: "center",
  },
  categoryName: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 20,
    marginLeft: 6,
  },
  icon: {
    paddingTop: 10,
    paddingLeft: 10,
  },
});
