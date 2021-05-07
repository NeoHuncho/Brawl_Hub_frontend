import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Switch } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import colors from "../../config/colors";
import SegmentedControlTab from "react-native-segmented-control-tab";
import DropDownPicker from "react-native-dropdown-picker";

import {
  typeIndexChanged,
  trophiesRangeChanged,
  plRangeChanged,
} from "../../store/reducers/uiReducerPersist";
import trophy_1 from "../../assets/icons/trophy1.png";
import trophy_2 from "../../assets/icons/trophy2.png";
import trophy_3 from "../../assets/icons/trophy3.png";
import trophy_4 from "../../assets/icons/trophy4.png";
import trophy_5 from "../../assets/icons/trophy5.png";

import silver from "../../assets/icons/silver.png";
import gold from "../../assets/icons/gold.png";
import diamond from "../../assets/icons/diamond.png";
import mythic from "../../assets/icons/mythic.png";
import legendary from "../../assets/icons/legendary.png";
import master from "../../assets/icons/master.png";

export default function Settings() {
  const dispatch = useDispatch();
  const averageTrophiesPlayer = useSelector(
    (state) => state.battleLogReducer.averageTrophies
  );

  const soloPLTrophies = useSelector(
    (state) => state.battleLogReducer.soloPLTrophies
  );
  const teamPLTrophies = useSelector(
    (state) => state.battleLogReducer.teamPLTrophies
  );
  const trophiesRange = useSelector(
    (state) => state.uiReducerPersist.trophiesRange
  );
  const plRange = useSelector((state) => state.uiReducerPersist.plRange);
  // console.log(trophiesRange, plRange);
  const typeIndexPersist = useSelector(
    (state) => state.uiReducerPersist.typeIndex
  );
  const [typeIndex, setTypeIndex] = useState(typeIndexPersist);

  const rangesFromDB = useSelector((state) => state.globalStatsReducer.ranges);
  const listRangesItemsTrophies = [];
  const listRangesItemsPL = [];

  let rangesTrophies = [
    "under400",
    "400-600",
    "600-800",
    "800-1000",
    "1000-1200",
    "1200+",
  ];
  let rangesPL = [
    "underGold",
    "gold",
    "diamond",
    "mythic",
    "legendary",
    "master",
  ];

  let logoRangesTrophies = [trophy_1, trophy_2, trophy_3, trophy_4, trophy_5];

  let logoRangesPL = [silver, gold, diamond, mythic, legendary, master];

  const logoRangesOrderedTrophies = [];
  const logoRangesOrderedPL = [];

  const rangesOrderedTrophies = (ranges, logoRanges, unorderedRanges) => {
    return ranges.filter((el, index) => {
      if (unorderedRanges.includes(el)) {
        logoRangesOrderedTrophies.push(logoRanges[index]);
      }
      return unorderedRanges.includes(el);
    });
  };
  const rangesOrderedPL = (ranges, logoRanges, unorderedRanges) => {
    return ranges.filter((el, index) => {
      if (unorderedRanges.includes(el)) {
        logoRangesOrderedPL.push(logoRanges[index]);
      }
      return unorderedRanges.includes(el);
    });
  };

  rangesTrophies = rangesOrderedTrophies(
    rangesTrophies,
    logoRangesTrophies,
    rangesFromDB[0]
  );
  rangesPL = rangesOrderedPL(rangesPL, logoRangesPL, rangesFromDB[1]);
  // console.log("sorted", logoRangesOrdered);

  rangesTrophies.map((range, index) => {
    listRangesItemsTrophies.push({
      label: range,
      value: range,
      icon: () => (
        <Image
          source={logoRangesOrderedTrophies[index]}
          style={{ width: 32, height: 20 }}
        />
      ),
    });
  });
  rangesPL.map((range, index) => {
    listRangesItemsPL.push({
      label: range,
      value: range,
      icon: () => (
        <Image
          source={logoRangesOrderedPL[index]}
          style={{ width: 20, height: 24 }}
        />
      ),
    });
  });
  // console.log(rangesTrophies[2]);

  const rangeFinder = () => {
    let rangeToApply = null;
    typeIndex == 0
      ? averageTrophiesPlayer < 600
        ? (rangeToApply = ranges.length - rangesMinus[0])
        : 600 <= averageTrophiesPlayer < 800
        ? (rangeToApply = ranges.length - rangesMinus[1])
        : averageTrophiesPlayer > 800
        ? (rangeToApply = ranges.length - rangesMinus[2])
        : (rangeToApply = ranges.length - rangesMinus[2])
      : typeIndex == 1
      ? soloPLTrophies == 0
        ? (rangeToApply = ranges.length - rangesPLMinus[0][2])
        : soloPLTrophies <= 6
        ? (rangeToApply = ranges.length - rangesPLMinus[0][0])
        : 6 < soloPLTrophies <= 9
        ? (rangeToApply = ranges.length - rangesPLMinus[0][1])
        : 9 < soloPLTrophies <= 12
        ? (rangeToApply = ranges.length - rangesPLMinus[0][2])
        : 12 < soloPLTrophies <= 15
        ? (rangeToApply = ranges.length - rangesPLMinus[0][3])
        : 15 < soloPLTrophies <= 18
        ? (rangeToApply = ranges.length - rangesPLMinus[0][4])
        : 19 <= soloPLTrophies
        ? (rangeToApply = ranges.length - rangesPLMinus[0][5])
        : null
      : null;

    return rangeToApply;
  };

  const [rangeTrophies, setRangeTrophies] = useState(
    rangesTrophies[trophiesRange]
  );
  const [rangePL, setRangePL] = useState(rangesPL[plRange]);

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.sliderTitle}>Default Category:</Text>
      <View style={{ marginLeft: 20, marginRight: 20 }}>
        <SegmentedControlTab
          values={["Trophies", "Power League"]}
          selectedIndex={typeIndex}
          onTabPress={(index) => {
            dispatch(typeIndexChanged(index));
            setTypeIndex(index);
          }}
        />
        <View style={{ marginTop: 15 }}>
          <Text style={styles.sliderTitle}>Default trophy Range:</Text>
          <DropDownPicker
            items={listRangesItemsTrophies}
            defaultValue={rangeTrophies}
            containerStyle={{
              height: 40,
              marginLeft: 50,
              marginRight: 50,
            }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            onChangeItem={(item, index) => {
              dispatch(trophiesRangeChanged(index));
              setRangeTrophies(item.value);
            }}
          />
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            {/* <Text style={[styles.sliderTitle, { fontSize: 14 }]}>
              Default to your avg brawler trophies
            </Text>
            <Switch /> */}
          </View>
        </View>
        <View style={{ marginTop: 15 }}>
          <Text style={styles.sliderTitle}>Default Power League Range:</Text>
          <DropDownPicker
            items={listRangesItemsPL}
            defaultValue={rangePL}
            containerStyle={{
              height: 40,
              marginLeft: 50,
              marginRight: 50,
            }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            onChangeItem={(item, index) => {
              dispatch(plRangeChanged(index));
              setRangePL(item.value);
            }}
          />
        </View>
      </View>
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
  sliderTitle: {
    color: colors.secondary,
    fontFamily: "Lilita-One",
    fontSize: 15,
    marginBottom: 10,
    marginLeft: 15,
  },
});