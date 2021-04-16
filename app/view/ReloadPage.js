import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ReloadPage() {
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 30,
          fontFamily: "Lilita-One",
          textAlign: "center",
          marginTop: 200,
          color: "white",
        }}
      >
        Please reload app to sign into another account! Thank you.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C3273",
    alignItems: "center",
    alignContent: "center",
  },
});
