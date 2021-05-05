import React from "react";
import { StyleSheet, Text, View } from "react-native";


export default function LoadingPage() {

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
        Loading this page! Will only be one sec
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
