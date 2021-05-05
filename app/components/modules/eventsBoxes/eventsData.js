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
    let slotNumberActive = state.globalStatsReducer.slotNumberActive;
    let slotNumberUpcoming = state.globalStatsReducer.slotNumberUpcoming;

    for (const eventKey in eventsActive) {
      if (eventsActive[eventKey].slot.id <= slotNumberActive) {
        if (
          Math.sign(
            moment.duration(
              moment(eventsActive[eventKey].endTime).diff(moment.now())
            )
          ) == 1
        ) {
          eventActiveData.push({
            modeName: eventsActive[eventKey].map.gameMode.name,
            modeImage: eventsActive[eventKey].map.gameMode.imageUrl,
            modeColor: eventsActive[eventKey].map.gameMode.color,
            mapID: eventsActive[eventKey].map.id,
            mapName: eventsActive[eventKey].map.name,
            mapImage: eventsActive[eventKey].map.imageUrl,
            mapEnvironment: eventsActive[eventKey].map.environment.imageUrl,
            endTime: eventsActive[eventKey].endTime,
            eventID: eventsActive[eventKey].slot.id,
            eventLeftTime: moment.duration(
              moment(eventsActive[eventKey].endTime).diff(moment.now())
            ),
          });
        } 
        else {
          // console.log('called!')
          for (const eventKeyUpcoming in eventsUpcoming) {
            if (
              eventsActive[eventKey].slot.id == eventsUpcoming[eventKeyUpcoming].slot.id
            )
           
              eventActiveData.push({
                modeName: eventsUpcoming[eventKeyUpcoming].map.gameMode.name,
                modeImage: eventsUpcoming[eventKeyUpcoming].map.gameMode.imageUrl,
                modeColor: eventsUpcoming[eventKeyUpcoming].map.gameMode.color,
                mapID: eventsUpcoming[eventKeyUpcoming].map.id,
                mapName: eventsUpcoming[eventKeyUpcoming].map.name,
                mapImage: eventsUpcoming[eventKeyUpcoming].map.imageUrl,
                mapEnvironment:
                  eventsUpcoming[eventKeyUpcoming].map.environment.imageUrl,
                endTime: eventsUpcoming[eventKeyUpcoming].endTime,
                eventID: eventsUpcoming[eventKeyUpcoming].slot.id,
                eventLeftTime: moment.duration(
                  moment(eventsUpcoming[eventKeyUpcoming].endTime).diff(moment.now())
                ),
              });
          }
        }
      }
    }
    // for (const eventKey in eventsUpcoming) {
    //   if (eventsUpcoming[eventKey].slot.id <= slotNumberUpcoming) {
    //     eventUpcomingData.push({
    //       modeName: eventsUpcoming[eventKey].map.gameMode.name,
    //       modeImage: eventsUpcoming[eventKey].map.gameMode.imageUrl,
    //       modeColor: eventsUpcoming[eventKey].map.gameMode.color,
    //       mapID: eventsUpcoming[eventKey].map.id,
    //       mapName: eventsUpcoming[eventKey].map.name,
    //       mapImage: eventsUpcoming[eventKey].map.imageUrl,
    //       mapEnvironment: eventsUpcoming[eventKey].map.environment.imageUrl,
    //       eventID: eventsUpcoming[eventKey].slot.id,
    //       eventLeftTime: moment.duration(
    //         moment(eventsUpcoming[eventKey].endTime).diff(moment.now())
    //       ),
    //     });
    //   }
    // }
  }
  return eventActiveData, eventUpcomingData;
};

export { eventsData, eventUpcomingData, eventActiveData };

const unsubscribe = store.subscribe(eventsData);
unsubscribe();
