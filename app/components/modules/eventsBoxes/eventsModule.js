import React from "react";
import { View, StyleSheet } from "react-native";
import { eventsData, eventActiveData, eventUpcomingData } from "./eventsData";

const EventsModule = () => {
  eventsData(1, 2);
  let eventRectangle = [];

  eventActiveData.map((event) => {
    eventRectangle.push(
      <View style={styles.rectangle}>
        <View style={{ height: 20, width: 200 }} />
      </View>
    );
  });
  console.log(eventRectangle);
  return <View>{eventRectangle}</View>;
};

const styles = StyleSheet.create({
  rectangle: {
    width: 100 * 2,
    height: 100,
    backgroundColor: "black",
  },
});
export default EventsModule;
