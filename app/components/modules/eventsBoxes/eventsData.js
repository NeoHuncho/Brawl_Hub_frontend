import { store } from "../../../store/configureStore";
let eventActiveData = [];
let eventUpcomingData = [];
const eventsData = (seasonIndex, gameTypeName) => {
  let state = store.getState();

  if (state.brawlifyReducer.eventsList) {
    let eventsActive = state.brawlifyReducer.eventsList.active;
    let eventsUpcoming = state.brawlifyReducer.eventsList.upcoming;
    for (const eventKey in eventsActive) {
      eventActiveData.push({
        modeName: eventsActive[eventKey].map.gameMode.name,
        modeImage: eventsActive[eventKey].map.gameMode.imageUrl,
        modeColor: eventsActive[eventKey].map.gameMode.color,
        mapName: eventsActive[eventKey].map.name,
        mapEnvironment: eventsActive[eventKey].map.environment.imageUrl,
        endTime: eventsActive[eventKey].endTime,
      });
    }
    for (const eventKey in eventsUpcoming) {
      eventUpcomingData.push({
        modeName: eventsUpcoming[eventKey].map.gameMode.name,
        modeImage: eventsUpcoming[eventKey].map.gameMode.imageUrl,
        modeColor: eventsUpcoming[eventKey].map.gameMode.color,
        mapName: eventsUpcoming[eventKey].map.name,
        mapEnvironment: eventsUpcoming[eventKey].map.environment.imageUrl,
        endTime: eventsUpcoming[eventKey].endTime,
      });
    }
  }
  return eventActiveData, eventUpcomingData;
};

export { eventsData, eventUpcomingData, eventActiveData };

const unsubscribe = store.subscribe(eventsData);
unsubscribe();
