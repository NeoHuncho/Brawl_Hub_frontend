import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Modal,
  TextInput,
  Button,
  Dimensions,
} from "react-native";
import { AdMobBanner } from "expo-ads-admob";
import { useSelector } from "react-redux";
import { getStatusBarHeight } from "react-native-status-bar-height";

import { BANNER_AD_ID } from "../../config/ads";
import { getTranslation, writeError } from "../../lib/apiDB";
import MessageBox from "../../components/modules/MessageBox";
import colors from "../../config/colors";

import errorReportingGraphic from "../../assets/graphicsMenu/errorReporting.png";
import brawlerTinderGraphic from "../../assets/graphicsMenu/brawlerTinder.png";
import questBotGraphic from "../../assets/graphicsMenu/questBot.png";
import memeStarsGraphic from "../../assets/graphicsMenu/memeStars.png";
import brawlQuizGraphic from "../../assets/graphicsMenu/brawlQuiz.png";

export default function Menu() {
  const device = useSelector((state) => state.uiReducerNoPersist.deviceType);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationText, setExplanationText] = useState(false);
  const [error, setError] = useState(error);
  const [sent, setSent] = useState("error not sent.");
  const menuMessage = useSelector(
    (state) => state.uiReducerPersist.menuMessage
  );
  const playerID = useSelector((state) => state.playerPersistReducer.playerID);
  // console.log(error);
  let modules = [];
  const moduleCreator = (titlePart1, titlePart2, color, image, explanation) => {
    modules.push(
      <>
        <TouchableOpacity
          onPress={() => {
            setExplanationText(explanation);
            setShowExplanation(true);
          }}
        >
          <View
            style={[
              device != "tablet" ? styles.rectangle : styles.rectangleTablet,
              { backgroundColor: color },
              titlePart1 == "Meme" ? { marginBottom: 50 } : null,
            ]}
          >
            <View
              style={{ flexDirection: "row", marginLeft: 10, marginTop: 15 }}
            >
              <View>
                <Text
                  style={device != "tablet" ? styles.title : styles.titleTablet}
                >
                  {titlePart1}
                </Text>
                <Text
                  style={device != "tablet" ? styles.title : styles.titleTablet}
                >
                  {titlePart2}
                </Text>
              </View>
              <Image
                style={device != "tablet" ? styles.image : styles.imageTablet}
                source={image}
              />
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  moduleCreator("Report", "Error", "#eb2f06", errorReportingGraphic, "error");
  moduleCreator(
    "Quest",
    "Bot",
    "#fa983a",
    questBotGraphic,
    "Have a brawler/mode you need to play? Find out which map/brawler is best for this!"
  );
  moduleCreator(
    "Brawler",
    "Tinder",
    "#b71540",
    brawlerTinderGraphic,
    "Like/dislike brawlers and see which brawlers are loved right now!"
  );
  moduleCreator(
    "Brawl",
    "Quiz",
    "#0c2461",
    brawlQuizGraphic,
    "Test your knowledge on your play style & the current meta."
  );
  moduleCreator(
    "Meme",
    "Stars",
    "#079992",
    memeStarsGraphic,
    "Upvote/downvote memes and find out which are the most popular this week/month."
  );

  return (
    <>
      <AdMobBanner
        bannerSize="smartBanner"
        adUnitID={BANNER_AD_ID}
        servePersonalizedAds={true} // true or false
        onDidFailToReceiveAdWithError={(e) => console.log(e)}
        style={{ marginTop: getStatusBarHeight() }}
      />
      <ScrollView>
        {menuMessage == true && (
          <MessageBox
            message={getTranslation(
              "All these modules are ideas I want to build in the next few weeks/months!"
            )}
            idMessage={"menu"}
            color={colors.green}
          />
        )}
        <View
          style={[
            styles.container,
            device == "tablet"
              ? { height: Dimensions.get("window").height }
              : null,
          ]}
        >
          <Text
            style={[
              device != "tablet"
                ? device != "tablet"
                  ? styles.explanation
                  : styles.explanationTablet
                : device != "tablet"
                ? styles.explanationTablet
                : styles.explanationTablet,
              { opacity: 0.9, marginTop: 20 },
            ]}
          >
            --Available--
          </Text>
          {modules[0]}
          <Text
            style={[
              device != "tablet"
                ? device != "tablet"
                  ? styles.explanation
                  : styles.explanationTablet
                : device != "tablet"
                ? styles.explanationTablet
                : styles.explanationTablet,
              ,
              { opacity: 0.9, marginTop: 20 },
            ]}
          >
            --Not Available Yet--
          </Text>
          {modules[1]}
          {modules[2]}
          {modules[3]}
          {modules[4]}
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={showExplanation}
          onRequestClose={() => {
            setShowExplanation(false);
          }}
        >
          {explanationText != "error" && (
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text
                  style={
                    device != "tablet"
                      ? styles.explanation
                      : styles.explanationTablet
                  }
                >
                  {explanationText}
                </Text>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setExplanationText("");
                    setShowExplanation(false);
                  }}
                >
                  <Text
                    style={[
                      device != "tablet"
                        ? styles.explanation
                        : styles.explanationTablet,
                      { marginTop: 10 },
                    ]}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {explanationText == "error" && (
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text
                  style={
                    device != "tablet"
                      ? styles.explanation
                      : styles.explanationTablet
                  }
                >
                  {`Your ID:  ${playerID}`}{" "}
                </Text>
                <TextInput
                  style={
                    device != "tablet"
                      ? styles.playerIdInput
                      : styles.playerIdInputTablet
                  }
                  type="flat"
                  placeholder="please describe your bug."
                  placeholderTextColor={colors.secondary}
                  onChangeText={(errorText) => setError(errorText)}
                />
                <Text
                  style={[
                    device != "tablet"
                      ? styles.explanation
                      : styles.explanationTablet,
                    { marginBottom: 5, marginTop: 10 },
                  ]}
                >
                  {sent}
                </Text>
                <View style={device == "tablet" ? styles.buttonTablet : null}>
                  <Button
                    title="Confirm"
                    onPress={() => {
                      writeError(playerID, error);
                      setSent("error sent!");
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setExplanationText("");
                    setShowExplanation(false);
                    setSent("error not sent.");
                  }}
                >
                  <Text
                    style={[
                      device != "tablet"
                        ? styles.explanation
                        : styles.explanationTablet,
                      { marginTop: 15 },
                    ]}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Modal>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background3,
    alignItems: "center",
  },

  rectangle: {
    height: 100,
    width: 280,
    marginTop: 30,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  rectangleTablet: {
    height: 150,
    width: 480,
    marginTop: 30,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.background2,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  title: {
    fontSize: 27,
    color: colors.primary,
    fontFamily: "Lilita-One",
    textAlign: "center",
    marginLeft: 5,
  },
  titleTablet: {
    fontSize: 47,
    color: colors.primary,
    fontFamily: "Lilita-One",
    textAlign: "center",
    marginLeft: 5,
  },
  explanation: {
    fontSize: 15,
    color: colors.primary,
    fontFamily: "Lilita-One",
    textAlign: "center",
  },
  explanationTablet: {
    fontSize: 30,
    color: colors.primary,
    fontFamily: "Lilita-One",
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 75,
    position: "absolute",
    right: 0,
  },
  imageTablet: {
    width: 225,
    height: 112.5,
    position: "absolute",
    right: 0,
  },
  playerIdInput: {
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 3,
    color: colors.secondary,
    fontFamily: "Lilita-One",
    fontSize: 15,
    height: 50,
    width: 250,
    borderColor: "white",
    borderWidth: 1,
  },
  playerIdInputTablet: {
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 3,
    color: colors.secondary,
    fontFamily: "Lilita-One",
    fontSize: 15,
    height: 50,
    width: 400,
    borderColor: "white",
    borderWidth: 1,
  },
  buttonTablet: {
    marginTop: 10,
  },
});
