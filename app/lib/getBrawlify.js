import axios from "axios-proxy-fix";
import { store } from "../store/configureStore";
import { eventsReceived } from "../store/reducers/brawlifyReducer";
import { tran } from "../store/reducers/uiReducerNoPersist";

const getBrawlifyMapsAndBrawlers = async () => {
  try {
    // const maps = brawlify["maps"];
    // const brawlers = brawlify["brawlers"];
    // const icons = brawlify["icons"]["player"];
    // const brawlify = await db
    //   .ref("global/brawlify")
    //   .once("value")
    //   .then((snapshot) => snapshot.val());
    let maps = null;
    let brawlers = null;

    await axios.get("https://api.brawlapi.com/v1/maps").then((response) => {
      
      maps = response.data.list;
    });
    await axios.get("https://api.brawlapi.com/v1/brawlers").then((response) => {
      
      brawlers = response.data;
    });

    return { maps, brawlers };
  } catch (error) {
    console.log(error);
  }
};

const getBrawlifyEvents = async () => {
  await axios.get("https://api.brawlapi.com/v1/events").then((response) => {
    // console.log(response.data);
    store.dispatch(eventsReceived(response.data));
  });
};

const getBrawlifyTranslations = async (language) => {
  let data = await axios.get(
    `https://api.brawlapi.com/v1/translations/${language}`
  );
  return data.data.strings;
};

export {
  getBrawlifyMapsAndBrawlers,
  getBrawlifyEvents,
  getBrawlifyTranslations,
};
