import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
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
import { getTranslation } from "../../lib/apiDB";
import LanguageSelector from "../../components/modules/LanguageSelector";

export default function Settings() {
  const device = useSelector((state) => state.uiReducerNoPersist.deviceType);
  const dispatch = useDispatch();
  const averageTrophiesPlayer = useSelector(
    (state) => state.battleLogReducer.averageTrophies
  );

  const soloPLTrophies = useSelector(
    (state) => state.battleLogReducer.soloPLTrophies
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

  let logoRanges = {
    trophies: [trophy_1, trophy_2, trophy_3, trophy_4, trophy_5],
    powerLeague: [silver, gold, diamond, mythic, legendary, master],
  };

  rangesFromDB["trophies"].map((range, index) => {
    listRangesItemsTrophies.push({
      label: range,
      value: range,
      icon: () => (
        <Image
          source={logoRanges["trophies"][index]}
          style={{ width: 32, height: 20 }}
        />
      ),
    });
  });
  rangesFromDB["powerLeague"].map((range, index) => {
    listRangesItemsPL.push({
      label: range,
      value: range,
      icon: () => (
        <Image
          source={logoRanges["powerLeague"][index]}
          style={{ width: 20, height: 24 }}
        />
      ),
    });
  });

  return (
    <View
      style={{
        marginTop: -10,
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 20,
        backgroundColor: colors.background2,
        borderRadius: 10,
        marginLeft: 20,
        marginRight: 20,
      }}
    >
      <Text
        style={
          device != "tablet" ? styles.sliderTitle : styles.sliderTitleTablet
        }
      >
        {getTranslation("Change Language") + ":"}
      </Text>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <LanguageSelector type={"DropDownPicker"} />
      </View>

      <Text
        style={
          device != "tablet" ? styles.sliderTitle : styles.sliderTitleTablet
        }
      >
        {getTranslation("Default Category:")}
      </Text>

      <SegmentedControlTab
        values={[getTranslation("Events"), getTranslation("Power League")]}
        selectedIndex={typeIndex}
        onTabPress={(index) => {
          dispatch(typeIndexChanged(index));
          setTypeIndex(index);
        }}
        tabsContainerStyle={
          device == "tablet"
            ? { marginTop: 10, marginLeft: 50, marginRight: 50 }
            : {  marginLeft: 30, marginRight: 30 }
        }
        tabTextStyle={{
          fontSize: device != "tablet" ? 14 : 25,
          fontFamily: "Lilita-One",
        }}
      />
      <View style={{ marginTop: 15 }}>
        <Text
          style={
            device != "tablet" ? styles.sliderTitle : styles.sliderTitleTablet
          }
        >
          {getTranslation("Default Event Range:")}
        </Text>
        <DropDownPicker
          items={listRangesItemsTrophies}
          defaultValue={listRangesItemsTrophies[trophiesRange].label}
          globalTextStyle={{
            fontSize: device == "tablet" ? 20 : 15,
            fontWeight: "900",
          }}
          containerStyle={{
            height: device != "tablet" ? 40 : 60,
            marginLeft: device != "tablet" ? 50 : 250,
            marginRight: device != "tablet" ? 50 : 250,
          }}
          style={{ backgroundColor: "#fafafa" }}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          dropDownStyle={{ backgroundColor: "#fafafa" }}
          onChangeItem={(item, index) => {
            dispatch(trophiesRangeChanged(index));
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
        <Text
          style={
            device != "tablet" ? styles.sliderTitle : styles.sliderTitleTablet
          }
        >
          {getTranslation("Default Power League Range:")}
        </Text>
        <DropDownPicker
          items={listRangesItemsPL}
          defaultValue={listRangesItemsPL[plRange].label}
          globalTextStyle={{
            fontSize: device == "tablet" ? 20 : 15,
            fontWeight: "900",
          }}
          containerStyle={{
            height: device != "tablet" ? 40 : 60,
            marginLeft: device != "tablet" ? 50 : 250,
            marginRight: device != "tablet" ? 50 : 250,
            marginBottom: device != "tablet" ? 20 : 30,
          }}
          style={{ backgroundColor: "#fafafa" }}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          dropDownStyle={{ backgroundColor: "#fafafa" }}
          onChangeItem={(item, index) => {
            dispatch(plRangeChanged(index));
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderTitle: {
    color: colors.secondary,
    fontFamily: "Lilita-One",
    fontSize: 15,
    marginBottom: 10,
    marginLeft: 15,
  },
  sliderTitleTablet: {
    color: colors.secondary,
    fontFamily: "Lilita-One",
    fontSize: 25,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 15,
  },
});
