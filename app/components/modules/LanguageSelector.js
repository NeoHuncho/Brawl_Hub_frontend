import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import colors from "../../config/colors";
import { languageChanging } from "../../store/reducers/uiReducerNoPersist";
import { languageChanged } from "../../store/reducers/uiReducerPersist";
import { getTranslations } from "../../lib/apiDB";
import { translationsChanged } from "../../store/reducers/uiReducerNoPersist";
import { getAssets } from "../../lib/getAssetsFunctions";
import { drop } from "lodash";
import { getURL } from "../../lib/getUrls";
export default function LanguageSelector({ type }) {
  const dispatch = useDispatch();
  const device = useSelector((state) => state.uiReducerNoPersist.deviceType);
  const supportedLanguages = useSelector(
    (state) => state.uiReducerNoPersist.languages
  );
  const [language, setLanguage] = useState(
    useSelector((state) => state.uiReducerPersist.language)
  );
  const [showModal, setShowModal] = useState(true);

  const [dropdownTextColor, setDropdownTextColor] = useState("black");

  const listLanguages = [];
  for (const [key, value] of Object.entries(supportedLanguages)) {
    listLanguages.push({
      label: key,
      value: value,
      icon: () => (
        <Image
          source={{
            uri: `https://www.countryflags.io/${
              value == "en" ? "us" : value
            }/flat/64.png`,
          }}
          style={{ width: 20, height: 20 }}
        />
      ),
    });
  }
  if (type == "Modal") {
    return (
      <Modal animationType="fade" visible={showModal} transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  textAlign: "center",
                  color: colors.primary,
                  fontFamily: "Lilita-One",
                  fontSize: 25,
                }}
              >
                Language
              </Text>
              <Image
                source={getURL("languages")}
                style={{ width: 25, height: 25, marginLeft: 5, marginTop: 5 }}
              />
            </View>
            <DropDownPicker
              items={listLanguages}
              defaultValue={language}
              globalTextStyle={{
                fontSize: device == "tablet" ? 20 : 16,
                color: dropdownTextColor,
              }}
              containerStyle={{
                height: device != "tablet" ? 45 : 60,
                marginTop: device != "tablet" ? 20 : 60,
                width: 160,
              }}
              style={{ backgroundColor: "#fafafa" }}
              itemStyle={{
                justifyContent: "flex-start",
              }}
              dropDownStyle={{ backgroundColor: "#fafafa" }}
              onChangeItem={(item) => {
                setLanguage(item.value);
              }}
            />
            <View style={{ marginTop: 30, zIndex: 0 }}>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 32,
                  borderRadius: 4,
                  elevation: 3,
                  backgroundColor: colors.background3,
                }}
                onPress={async () => {
                  if (
                    Object.values(supportedLanguages).includes(language) !==
                    false
                  ) {
                    console.log(455, language);
                    dispatch(languageChanging(true));
                    dispatch(languageChanged(language));
                    if (language !== "en") {
                      let translations = await getTranslations(language);
                      // console.log(444444444, translations);
                      dispatch(translationsChanged(translations));
                      getAssets();
                    }
                    dispatch(languageChanging(false));
                    setShowModal(false);
                  } else {
                    setDropdownTextColor("red");
                  }
                }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontFamily: "Lilita-One",
                    fontSize: 20,
                    color: colors.primary,
                  }}
                >
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  } else if ((type = "DropDownSelector")) {
    return (
      <>
        <DropDownPicker
          items={listLanguages}
          defaultValue={language}
          globalTextStyle={{
            fontSize: device == "tablet" ? 20 : 16,
            color: dropdownTextColor,
          }}
          containerStyle={{
            height: device != "tablet" ? 45 : 60,

            width: 160,
          }}
          style={{ backgroundColor: "#fafafa" }}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          dropDownStyle={{ backgroundColor: "#fafafa" }}
          onChangeItem={async (item) => {
            let languageSelected = item.value;
            if (
              Object.values(supportedLanguages).includes(languageSelected) !==
              false
            ) {
              console.log(455, languageSelected);
              dispatch(languageChanging(true));
              dispatch(languageChanged(languageSelected));
              if (languageSelected !== "en") {
                let translations = await getTranslations(languageSelected);
                // console.log(444444444, translations);
                dispatch(translationsChanged(translations));
                getAssets();
              }
              dispatch(languageChanging(false));
              setShowModal(false);
            } else {
              setDropdownTextColor("red");
            }
          }}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    paddingBottom: 30,
    marginBottom: 50,
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
    height: 280,
    width: 300,
  },
});
