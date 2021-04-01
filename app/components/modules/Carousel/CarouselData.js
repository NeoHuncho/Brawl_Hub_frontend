import { store } from "../../../store/configureStore";
import colors from "../../../config/colors";
import {getAssets,getBrawlerImage,getBrawlerName,getMapImage,getMapName,getModeImage} from '../../../lib/getAssetsFunctions';

let modesByPerformance = undefined;
let modesByWins = undefined;
let mapsByWins = undefined;
let mapsByPerformance = undefined;
let brawlersByWins = undefined;
let brawlersByPerformance = undefined;
let teamsByWins = undefined;
let teamsByPerformance = undefined;

let modes = [];
let brawlers = [];
let maps = [];
let teams = [];
let loadedOnceCarouselData = false;


const processPlayerStats = (seasonIndex, gameTypeName) => {

  //reseting variable otherwise they add up
  modesByPerformance = undefined;
  modesByWins = undefined;
  mapsByWins = undefined;
  mapsByPerformance = undefined;
  brawlersByWins = undefined;
  brawlersByPerformance = undefined;
   teamsByWins = undefined;
  teamsByPerformance = undefined;
  modes = [];
  brawlers = [];
  maps = [];
  teams = [];
  loadedOnceCarouselData = false;

  //

  let state = store.getState();
  let playerStats = undefined;
  let season = seasonIndex;
  let gameType = undefined;
  gameTypeName === "Trophies" ? (gameType = "ranked") : gameTypeName=="Solo PL"? (gameType = 'soloRanked'): (gameType = "teamRanked");

  if (
    state.battleLogReducer.playerStats.season[season].type[gameType].keys.teams
  ) {
    playerStats =
      state.battleLogReducer.playerStats.season[season].type[gameType];
    // console.log(playerStats);

    getAssets()

    playerStats.keys.modes.map((mode) => {
      //console.log(mode);
      if (mode !== "duoShowdown" && mode !== "soloShowdown") {
        modes.push({
                    image: getModeImage(mode),
          duration: playerStats.mode[mode].duration/ playerStats.mode[mode].games,
          spRatio:
            playerStats.mode[mode].starPlayer / playerStats.mode[mode].games,
          winRatio: playerStats.mode[mode].winRatio,
          wins: playerStats.mode[mode].wins,
          losses: playerStats.mode[mode].losses,
          title: mode.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
            return str.toUpperCase();
          }),
        });
      } else {
        modes.push({
          
          image: getModeImage(mode),
          winRatio: playerStats.mode[mode].winRatio,
          wins: playerStats.mode[mode].wins,
          losses: playerStats.mode[mode].losses,
          title: mode
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, function (str) {
              return str.toUpperCase();
            })
            .replace(/Showdown/gm, "S/D"),
        });
      }
    });

    modesByPerformance = [...modes]
      .sort((a, b) => (a.winRatio > b.winRatio ? -1 : 1))
      .filter((mode) => mode.winRatio !== 0);

    modesByWins = [...modes]
      .sort((a, b) => (a.wins > b.wins ? -1 : 1))
      .filter((mode) => mode.winRatio !== 0);

    playerStats.keys.brawlers.map((brawler) => {
      //console.log(brawler)
     
      let compiledBrawlers = playerStats.compiled.brawlers[brawler];
      brawlers.push({
        //color: getBrawlerColor(brawler),
        image: getBrawlerImage(brawler),
        duration: compiledBrawlers.duration/ compiledBrawlers.games,
        spRatio: compiledBrawlers.starPlayer / compiledBrawlers.games,
        winRatio: compiledBrawlers.winRatio,
        wins: compiledBrawlers.wins,
        losses: compiledBrawlers.losses,
        title: getBrawlerName(brawler),
      });
    });

    brawlersByPerformance = [...brawlers].sort((a, b) =>
      a.winRatio > b.winRatio ? -1 : 1
    );

    brawlersByWins = [...brawlers].sort((a, b) => (a.wins > b.wins ? -1 : 1));

    playerStats.keys.maps.map((map) => {
      let compiledMaps = playerStats.compiled.maps[map];
      let modeName =undefined;
      playerStats.keys.modes.map((mode)=>{
        if(playerStats.mode[mode].map[map]){
          console.log(mode)
          modeName= mode
        }
      })
      maps.push({
        image: getMapImage(map),
        winRatio: compiledMaps.winRatio,
        spRatio: compiledMaps.starPlayer / compiledMaps.games,
        duration: compiledMaps.duration/ compiledMaps.games,
        wins: compiledMaps.wins,
        losses: compiledMaps.losses,
        title: getMapName(map),
        mode:getModeImage(modeName)
      });
    });
   
    
    mapsByPerformance = [...maps].sort((a, b) =>
      a.winRatio > b.winRatio ? -1 : 1
    );


    mapsByWins = [...maps].sort((a, b) => (a.wins > b.wins ? -1 : 1));

    if (mapsByWins) {
      loadedOnceCarouselData = true;
    }

    playerStats.keys.teams.map((team) => {
      let compiledTeams = playerStats.compiled.teams[team];
      teams.push({
        brawler1: getBrawlerImage(compiledTeams.id1),
        brawler2: getBrawlerImage(compiledTeams.id2),
        brawler3: compiledTeams.id3? getBrawlerImage(compiledTeams.id3):null,
        duration: compiledTeams.duration/ compiledTeams.games,
        spRatio: compiledTeams.starPlayer / compiledTeams.games,
        winRatio: compiledTeams.winRatio,
        wins: compiledTeams.wins,
        losses: compiledTeams.losses,
        title: `${getBrawlerName(compiledTeams.id1)}, ${getBrawlerName(compiledTeams.id2)}${compiledTeams.id3!==0?' , '+ getBrawlerName(compiledTeams.id3):''}`
      });
    });
    console.log(teams)
    teamsByPerformance = [...teams].sort((a, b) =>
      a.winRatio > b.winRatio ? -1 : 1
    );

    teamsByWins = [...teams].sort((a, b) => (a.wins > b.wins ? -1 : 1));
  }
};

const unsubscribe = store.subscribe(processPlayerStats);
unsubscribe();

//console.log(brawlersByPerformance);
export {
  processPlayerStats,
  modesByPerformance,
  modesByWins,
  brawlersByPerformance,
  brawlersByWins,
  mapsByPerformance,
  mapsByWins,
  teamsByPerformance,
  teamsByWins,
  loadedOnceCarouselData,
};
