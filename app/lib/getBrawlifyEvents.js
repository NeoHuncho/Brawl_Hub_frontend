import axios from "axios";
import { store } from "../store/configureStore";
import { eventsReceived } from "../store/reducers/brawlifyReducer";

export default getEvents = async () => {
  await axios.get("https://api.brawlapi.com/v1/events").then((response) => {
    // console.log(response.data);
    store.dispatch(eventsReceived(response.data));
  });
};