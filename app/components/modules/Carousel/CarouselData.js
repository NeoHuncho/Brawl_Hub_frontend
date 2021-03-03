import { store } from "../store/configureStore";

let modesByPerformance= undefined;
let modesByWins= undefined;
let mapsByWins= undefined;
let mapsByPerformance= undefined;
let brawlersByWins= undefined;
let brawlersByPerformance =undefined;
let teamsByWins= undefined;
let teamsByPerformance =undefined;

const processPlayerStats= ()=>{
    let modes = [
        {
          color: "#8ca0df",
          image: require("../../assets/ModesandMaps/Brawl-Ball/icon/Brawl-Ball.png"),
          title: "Brawl Ball",
          winRatio: playerStats.modes.brawlBall.winRatio,
          wins: playerStats.modes.modes.brawlBall.wins,
          losses: playerStats.modes.modes.brawlBall.losses,
        },
        {
          color: "#01cfff",
          image: require("../../assets/ModesandMaps/Bounty/icon/Bounty.png"),
          title: "Bounty",
          winRatio: playerStats.modes.bounty.winRatio,
          wins: playerStats.modes.bounty.wins,
          losses: playerStats.modes.bounty.losses,
        },
        {
          color: "#f04f32",
          image: require("../../assets/ModesandMaps/Siege/icon/Siege.png"),
          title: "Siege",
          winRatio: playerStats.modes.siege.winRatio,
          wins: playerStats.modes.siege.wins,
          losses: playerStats.modes.siege.losses,
        },
        {
          color: "#9b3df3",
          image: require("../../assets/ModesandMaps/Gem-Grab/icon/Gem-Grab.png"),
          title: "Gem Grab",
          winRatio: playerStats.modes.gemGrab.winRatio,
          wins: playerStats.modes.gemGrab.wins,
          losses: playerStats.modes.gemGrab.losses,
        },
        {
          color: "#d55cd3",
          image: require("../../assets/ModesandMaps/Heist/icon/Heist.png"),
          title: "Heist",
          winRatio: playerStats.modes.heist.winRatio,
          wins: playerStats.modes.heist.wins,
          losses: playerStats.modes.heist.losses,
        },
        {
          color: "#e33c50",
          image: require("../../assets/ModesandMaps/Hot-Zone/icon/Hot-Zone.png"),
          title: "Hot Zone",
          winRatio: playerStats.modes.hotZone.winRatio,
          wins: playerStats.modes.hotZone.wins,
          losses: playerStats.modes.hotZone.losses,
        },
        {
          color: "#81d621",
          image: require("../../assets/ModesandMaps/Showdown/icon/Solo-Showdown.png"),
          title: "Solo S/D",
          winRatio: playerStats.modes.soloShowdown.winRatio,
          wins: playerStats.modes.soloShowdown.wins,
          losses: playerStats.modes.soloShowdown.losses,
        },
        {
          color: "#81d621",
          image: require("../../assets/ModesandMaps/Showdown/icon/Duo-Showdown.png"),
          title: "Duo S/D",
          winRatio: playerStats.modes.duoShowdown.winRatio,
          wins: playerStats.modes.duoShowdown.wins,
          losses: playerStats.modes.duoShowdown.losses,
        },
      ];
    modesByPerformance = [...modes].sort((a, b) =>
    a.winRatio > b.winRatio ? -1 : 1
  ).filter((mode) => mode.winRatio !== 0);

    modesByWins =[...modes].sort((a, b) =>
  a.wins > b.wins ? -1 : 1
).filter((mode) => mode.winRatio !== 0);
}

const unsubscribe = store.subscribe(processPlayerStats);
unsubscribe();

export{modesByPerformance,modesByWins}
