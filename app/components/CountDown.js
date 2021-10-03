import moment from "moment";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import { store } from "../store/configureStore";
export default function CountDown({ eventEndTime, device, max }) {
  const translations =
    store.getState().uiReducerNoPersist.translations == undefined
      ? {}
      : store.getState().uiReducerNoPersist.translations;
  const [remainingTime, setRemainingTime] = useState(
    moment.duration(moment(eventEndTime).diff(moment.now().valueOf()))
  );

  setTimeout(() => {
    setRemainingTime(
      moment.duration(moment(eventEndTime).diff(moment.now().valueOf()))
    );
  }, 1000);

  if (max == "hours") {
    return (
      <>
        <Text
          style={{
            fontSize: device != "tablet" ? 11 : 20,
            fontFamily: "Lilita-One",
            color: colors.secondary,
            color:
              remainingTime.hours() < 1
                ? "orange"
                : remainingTime.hours() < 1 && remainingTime.minutes() < 15
                ? "red"
                : colors.primary,
          }}
        >
          {`${remainingTime.hours()}${
            translations["time_left_hour"] == undefined
              ? "h:"
              : translations["time_left_hour"] + ":"
          } ${remainingTime.minutes()}${
            translations["time_left_minute"] == undefined
              ? "m:"
              : translations["time_left_minute"] + ":"
          }${remainingTime.seconds()}${
            translations["time_left_second"] == undefined
              ? "s"
              : translations["time_left_second"]
          }`}
        </Text>
      </>
    );
  } else if (max == "days") {
    return (
      <>
        <Text
          style={{
            fontSize: device != "tablet" ? 11 : 20,
            fontFamily: "Lilita-One",
            color: colors.secondary,
            color:
              remainingTime.hours() < 3
                ? "red"
                : remainingTime.days() < 1
                ? "orange"
                : colors.primary,
          }}
        >
          {`${remainingTime.days()}${
            translations["time_left_day"] == undefined
              ? "d:"
              : translations["time_left_day"] + ":"
          }${remainingTime.hours()}${
            translations["time_left_hour"] == undefined
              ? "h:"
              : translations["time_left_hour"] + ":"
          } ${remainingTime.minutes()}${
            translations["time_left_minute"] == undefined
              ? "m:"
              : translations["time_left_minute"] + ":"
          }${remainingTime.seconds()}${
            translations["time_left_second"] == undefined
              ? "s"
              : translations["time_left_second"]
          }`}
        </Text>
      </>
    );
  }
}

const styles = StyleSheet.create({});
