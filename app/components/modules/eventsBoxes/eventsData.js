import { store } from "../../../store/configureStore";
import moment from "moment";
import { camelize } from "../../../lib/getGlobalStatsFunctions";

const sortEventsData = () => {
  let state = store.getState();
  let normalEvents = [];
  let specialEvents = [];

  if (state.brawlifyReducer.eventsList) {
    let events = state.brawlifyReducer.eventsList.active;
    let eventsUpcoming = state.brawlifyReducer.eventsList.upcoming;

    for (const eventKey in events) {
      if (events[eventKey].slot.id < state.globalStatsReducer.slotIDMaximum) {
        if (
          Math.sign(
            moment.duration(moment(events[eventKey].endTime).diff(moment.now()))
          ) == 1
        ) {
          normalEvents.push({
            modeName: camelize(events[eventKey].map.gameMode.name),
            modeImage: events[eventKey].map.gameMode.imageUrl,
            modeColor: events[eventKey].map.gameMode.color,
            mapID: events[eventKey].map.id,
            mapName: events[eventKey].map.name,
            mapImage: events[eventKey].map.imageUrl,
            mapEnvironment: events[eventKey].map.environment.imageUrl,
            endTime: events[eventKey].endTime,
            eventID: events[eventKey].slot.id,
            eventLeftTime: moment.duration(
              moment(events[eventKey].endTime).diff(moment.now())
            ),
          });
        } else {
          // console.log('called!')
          for (const eventKeyUpcoming in eventsUpcoming) {
            if (
              events[eventKey].slot.id ==
              eventsUpcoming[eventKeyUpcoming].slot.id
            )
              normalEvents.push({
                modeName: eventsUpcoming[eventKeyUpcoming].map.gameMode.hash,
                modeImage:
                  eventsUpcoming[eventKeyUpcoming].map.gameMode.imageUrl,
                modeColor: eventsUpcoming[eventKeyUpcoming].map.gameMode.color,
                mapID: eventsUpcoming[eventKeyUpcoming].map.id,
                mapName: eventsUpcoming[eventKeyUpcoming].map.name,
                mapImage: eventsUpcoming[eventKeyUpcoming].map.imageUrl,
                mapEnvironment:
                  eventsUpcoming[eventKeyUpcoming].map.environment.imageUrl,
                endTime: eventsUpcoming[eventKeyUpcoming].endTime,
                eventID: eventsUpcoming[eventKeyUpcoming].slot.id,
                eventLeftTime: moment.duration(
                  moment(eventsUpcoming[eventKeyUpcoming].endTime).diff(
                    moment.now()
                  )
                ),
              });
          }
        }
      }
    }
  }
  return { normalEvents, specialEvents };
};

export { sortEventsData };

const unsubscribe = store.subscribe(sortEventsData);
unsubscribe();
