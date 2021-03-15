import store from "../store/configureStore";

let select = (state) => state.playerStats;

let modes = [];
const carouselCardData = () => {
  let playerStats = select(store.getState());
  if (playerStats) {
      //console.log('received!!!')
    modes = [
      {
        image: require("../assets/ModesandMaps/Brawl-Ball/icon/Brawl-Ball.png"),
        title: "Brawl-Ball",
        winRate: playerStats.brawlBall.winRate,
      },
    ];
  }
};

const unsubscribe = store.subscribe(carouselCardData);
unsubscribe();

carouselCardData();
export { modes };
