import { store } from "../../../store/configureStore";
import moment from "moment";
let eventActiveData = [];
let eventUpcomingData = [];
const eventsData = () => {
  let state = store.getState();
  eventActiveData = [];
  eventUpcomingData = [];
  if (state.brawlifyReducer.eventsList) {
    let eventsActive = state.brawlifyReducer.eventsList.active;
    let eventsUpcoming = state.brawlifyReducer.eventsList.upcoming;
    for (const eventKey in eventsActive) {
      if (eventsActive[eventKey].slot.id <= 6) {
        eventActiveData.push({
          modeName: eventsActive[eventKey].map.gameMode.name,
          modeImage: eventsActive[eventKey].map.gameMode.imageUrl,
          modeColor: eventsActive[eventKey].map.gameMode.color,
          mapID: eventsActive[eventKey].map.id,
          mapName: eventsActive[eventKey].map.name,
          mapEnvironment: eventsActive[eventKey].map.environment.imageUrl,
          endTime: eventsActive[eventKey].endTime,
          eventID: eventsActive[eventKey].slot.id,
          eventLeftTime: moment.duration(
            moment(eventsActive[eventKey].endTime).diff(moment.now())
          ),
        });
      }
    }
    for (const eventKey in eventsUpcoming) {
      if (eventsUpcoming[eventKey].slot.id <=6) {
        eventUpcomingData.push({
          modeName: eventsUpcoming[eventKey].map.gameMode.name,
          modeImage: eventsUpcoming[eventKey].map.gameMode.imageUrl,
          modeColor: eventsUpcoming[eventKey].map.gameMode.color,
          mapID: eventsActive[eventKey].map.id,
          mapName: eventsUpcoming[eventKey].map.name,
          mapEnvironment: eventsUpcoming[eventKey].map.environment.imageUrl,
          eventID: eventsUpcoming[eventKey].slot.id,
          eventLeftTime: moment.duration(
            moment(eventsActive[eventKey].endTime).diff(moment.now())
          ),
        });
      }
    }
  }
  return eventActiveData, eventUpcomingData;
};

export { eventsData, eventUpcomingData, eventActiveData };

const unsubscribe = store.subscribe(eventsData);
unsubscribe();
