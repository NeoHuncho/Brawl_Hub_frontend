import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityeSheet,
} from "react-native";

export default function reloadButton() {
  return (
    <TouchableOpacity style={styles.button} onPress={() => "ddw"}>
      <Text style={styles.text}>{"reload"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    marginLeft: "20%",
    marginRight: "20%",
    marginTop: "5%",
    borderRadius: 10,
  },
  text: {
    fontFamily: "Lilita-One",
    fontSize: 18,
    color: "white",
  },
});
