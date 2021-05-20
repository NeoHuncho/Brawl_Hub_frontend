import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import colors from "../../config/colors";
import { messageBoxActions } from "../../store/reducers/uiReducerPersist";

export default function MessageBox({ message, idMessage, color }) {
  const dispatch = useDispatch();
  const device = useSelector((state) => state.uiReducerNoPersist.deviceType);
  const onPressClose = (idMessage) => {
    // console.log(idMessage);
    dispatch(messageBoxActions(idMessage));
  };
  return (
    <View
      style={[
        device != "tablet" ? styles.rectangle : styles.rectangleTablet,
        { backgroundColor: color },
      ]}
    >
      <Text
        style={[
          device != "tablet" ? styles.message : styles.messageTablet,
          idMessage == "pl" ? { fontSize: device != "tablet" ? 12 : 25 } : null,
        ]}
      >
        {message}
      </Text>
      <TouchableOpacity
        onPress={() => onPressClose(idMessage)}
        style={{ position: "absolute", right: 2 }}
      >
        <Ionicons
          name="close"
          color={colors.secondary}
          size={device != "tablet" ? 20 : 30}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  rectangle: {
    width: Dimensions.get("window").width,
    height: 50,
  },
  rectangleTablet: {
    width: Dimensions.get("window").width,
    height: 80,
  },
  message: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 15,
    textAlign: "center",
    marginRight: 20,
    marginTop: 5,
  },
  messageTablet: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 25,
    textAlign: "center",
    marginRight: 20,
    marginTop: 5,
  },
});
