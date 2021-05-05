import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

import colors from "../../config/colors";
import { messageBoxActions } from "../../store/reducers/uiReducerPersist";

export default function MessageBox({ message, idMessage, color }) {
  const dispatch = useDispatch();
  const onPressClose = (idMessage) => {
    // console.log(idMessage);
    dispatch(messageBoxActions(idMessage));
  };
  return (
    <View style={[styles.rectangle, { backgroundColor: color }]}>
      <Text
        style={[styles.message, idMessage == "pl" ? { fontSize: 12 } : null]}
      >
        {message}
      </Text>
      <TouchableOpacity
        onPress={() => onPressClose(idMessage)}
        style={{ position: "absolute", right: 2 }}
      >
        <Ionicons name="close" color={colors.secondary} size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  rectangle: {
    width: Dimensions.get("window").width,
    height: 50,
  },
  message: {
    color: colors.primary,
    fontFamily: "Lilita-One",
    fontSize: 15,
    textAlign: "center",
    marginRight: 20,
    marginTop: 5,
  },
});
