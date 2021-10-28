import { store } from "../../../store/configureStore";
import moment from "moment";
import { camelize } from "../../../lib/getGlobalStatsFunctions";

const sortEventsData = (typeIndex, challenge_hash) => {
  let state = store.getState();
  let normalEvents = [];
  let specialEvents = [];
  // console.log(333, moment.now().valueOf());

  if (state.brawlifyReducer.eventsList) {
    let events = state.brawlifyReducer.eventsList.active;
    let eventsUpcoming = state.brawlifyReducer.eventsList.upcoming;

    for (const eventKey in events) {
      if (events[eventKey].slot.id < state.globalStatsReducer.slotIDMaximum) {
        if (
          Math.sign(
            moment.duration(
              moment(events[eventKey].endTime).diff(moment.now().valueOf())
            )
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
                modeName: camelize(
                  eventsUpcoming[eventKeyUpcoming].map.gameMode.name
                ),
                modeImage:
                  eventsUpcoming[eventKeyUpcoming].map.gameMode.imageUrl,
                modeColor: eventsUpcoming[eventKeyUpcoming].map.gameMode.color,
                mapID: eventsUpcoming[eventKeyUpcoming].map.id,
                mapName: eventsUpcoming[eventKeyUpcoming].map.name,
                mapImage: eventsUpcoming[eventKeyUpcoming].map.imageUrl,
                mapEnvironment:
                  eventsUpcoming[eventKeyUpcoming].map.environment.imageUrl,
                endTime: moment(eventsUpcoming[eventKeyUpcoming].endTime),
                eventID: eventsUpcoming[eventKeyUpcoming].slot.id,
                eventLeftTime: moment.duration(
                  moment(eventsUpcoming[eventKeyUpcoming].endTime).diff(
                    moment.now()
                  )
                ),
              });
          }
        }
      } else if (
        typeIndex == "challenge" &&
        events[eventKey].slot.hash.includes(challenge_hash)
      ) {
        specialEvents.push({
          eventImage: events[eventKey].slot.background,
          modeName: camelize(events[eventKey].map.gameMode.name),
          modeImage: events[eventKey].map.gameMode.imageUrl,
          modeColor: events[eventKey].map.gameMode.color,
          mapID: events[eventKey].map.id,
          mapName: events[eventKey].map.name,
          mapImage: events[eventKey].map.imageUrl,
          mapEnvironment: events[eventKey].map.environment.imageUrl,

          eventStartTime: moment.duration(
            moment(events[eventKey].startTime).diff(moment.now())
          ),
          eventID: events[eventKey].slot.id,
          challengeNumber: events[eventKey].slot.name,
        });
      }
    }
    for (const eventKeyUpcoming in eventsUpcoming) {
      // console.log(eventsUpcoming[eventKeyUpcoming].slot.hash);
      if (
        typeIndex == "challenge" &&
        eventsUpcoming[eventKeyUpcoming].slot.hash.includes(challenge_hash) ==
          true
      ) {
        specialEvents.push({
          eventImage: eventsUpcoming[eventKeyUpcoming].slot.background,
          modeName: camelize(
            eventsUpcoming[eventKeyUpcoming].map.gameMode.name
          ),
          modeImage: eventsUpcoming[eventKeyUpcoming].map.gameMode.imageUrl,
          modeColor: eventsUpcoming[eventKeyUpcoming].map.gameMode.color,
          mapID: eventsUpcoming[eventKeyUpcoming].map.id,
          mapName: eventsUpcoming[eventKeyUpcoming].map.name,
          mapImage: eventsUpcoming[eventKeyUpcoming].map.imageUrl,
          mapEnvironment:
            eventsUpcoming[eventKeyUpcoming].map.environment.imageUrl,

          eventStartTime: moment.duration(
            moment(events[eventKeyUpcoming].startTime).diff(moment.now())
          ),
          eventID: eventsUpcoming[eventKeyUpcoming].slot.id,
          challengeNumber: eventsUpcoming[eventKeyUpcoming].slot.name,
        });
      }
    }
  }
  return { normalEvents, specialEvents };
};

export { sortEventsData };

const unsubscribe = store.subscribe(sortEventsData);
unsubscribe();
