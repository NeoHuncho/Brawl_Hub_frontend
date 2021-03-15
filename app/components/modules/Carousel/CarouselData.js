import { store } from "../../../store/configureStore";
import colors from "../../../config/colors";

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
let loadedOnceCarouselData=false;

const processPlayerStats = (seasonIndex) => {
  let state = store.getState();
  let playerStats = undefined;
  let season = seasonIndex;
  let gameType = "ranked";
  if (
    state.battleLogReducer.playerStats.season[season].type[gameType].keys.teams
  ) {
    playerStats =
      state.battleLogReducer.playerStats.season[season].type[gameType];
    console.log(playerStats);

    //not currently in use
    const getModeColors = (mode) => {
      //console.log(mode);
      let color = undefined;
      mode === "brawlBall"
        ? (color = colors.modes.brawlBall)
        : mode === "bounty"
        ? (color = colors.modes.bounty)
        : mode === "siege"
        ? (color = colors.modes.siege)
        : mode === "gemGrab"
        ? (color = colors.modes.gemGrab)
        : mode === "heist"
        ? (color = colors.modes.heist)
        : mode === "hotZone"
        ? (color = colors.modes.hotZone)
        : mode === "soloShowdown" || mode === "duoShowdown"
        ? (color = colors.modes.showdown)
        : (color = "#0a122a");
      return color;
    };

    const getBrawlerColor = (brawler) => {
      //console.log(brawler);
      let color = undefined;
      if (
        brawler === "8-BIT" ||
        brawler === "BO" ||
        brawler === "BROCK" ||
        brawler === "BULL" ||
        brawler === "COLT" ||
        brawler === "DYNAMIKE" ||
        brawler === "EMZ" ||
        brawler === "JESSIE" ||
        brawler === "NITA" ||
        brawler === "SHELLY" ||
        brawler === "TICK"
      )
        color = colors.brawlers.trophyRoad;
      if (
        brawler === "EL PRIMO" ||
        brawler === "BARLEY" ||
        brawler === "POCO" ||
        brawler === "ROSA"
      )
        color = colors.brawlers.rare;
      if (
        brawler === "RICO" ||
        brawler === "DARRYL" ||
        brawler === "PENNY" ||
        brawler === "CARL" ||
        brawler === "JACKY"
      )
        color = colors.brawlers.superRare;
      if (
        brawler === "PIPER" ||
        brawler === "FRANK" ||
        brawler === "PAM" ||
        brawler === "BIBI" ||
        brawler === "BEA" ||
        brawler === "NANI" ||
        brawler === "EDGAR"
      )
        color = colors.brawlers.epic;
      if (
        brawler === "MORTIS" ||
        brawler === "TARA" ||
        brawler === "GENE" ||
        brawler === "MAX" ||
        brawler === "MR. P" ||
        brawler === "SPROUT" ||
        brawler === "BYRON"
      )
        color = colors.brawlers.mythic;
      if (
        brawler === "SPIKE" ||
        brawler === "CROW" ||
        brawler === "LEON" ||
        brawler === "SANDY" ||
        brawler === "AMBER"
      )
        color = colors.brawlers.legendary;

      if (
        brawler === "GALE" ||
        brawler === "SURGE" ||
        brawler === "COLETTE" ||
        brawler === "LOU" ||
        brawler === "COLONEL RUFFS"
      )
        color = "linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1))";
      return color;
    };

    const getBrawlerImageOld = (brawler) => {
      switch (brawler) {
        case "8-BIT":
          return require("../../../assets/Brawlers_icons/8-BIT.png");

        case "AMBER":
          return require("../../../assets/Brawlers_icons/AMBER.png");

        case "BARLEY":
          return require("../../../assets/Brawlers_icons/BARLEY.png");

        case "BEA":
          return require("../../../assets/Brawlers_icons/BEA.png");

        case "BIBI":
          return require("../../../assets/Brawlers_icons/BIBI.png");

        case "BO":
          return require("../../../assets/Brawlers_icons/BO.png");

        case "BROCK":
          return require("../../../assets/Brawlers_icons/BROCK.png");

        case "BULL":
          return require("../../../assets/Brawlers_icons/BULL.png");

        case "BYRON":
          return require("../../../assets/Brawlers_icons/BYRON.png");

        case "CARL":
          return require("../../../assets/Brawlers_icons/CARL.png");

        case "COLETTE":
          return require("../../../assets/Brawlers_icons/COLETTE.png");

        case "COLONEL RUFFS":
          //console.log("called ruff");
          return require("../../../assets/Brawlers_icons/COLONEL_RUFFS.png");

        case "COLT":
          return require("../../../assets/Brawlers_icons/COLT.png");

        case "CROW":
          return require("../../../assets/Brawlers_icons/CROW.png");

        case "DARRYL":
          return require("../../../assets/Brawlers_icons/DARRYL.png");

        case "DYNAMIKE":
          return require("../../../assets/Brawlers_icons/DYNAMIKE.png");

        case "EDGAR":
          return require("../../../assets/Brawlers_icons/EDGAR.png");

        case "EL PRIMO":
          return require("../../../assets/Brawlers_icons/EL_PRIMO.png");

        case "EMZ":
          return require("../../../assets/Brawlers_icons/EMZ.png");

        case "FRANK":
          return require("../../../assets/Brawlers_icons/FRANK.png");

        case "GALE":
          return require("../../../assets/Brawlers_icons/GALE.png");

        case "GENE":
          return require("../../../assets/Brawlers_icons/GENE.png");

        case "JACKY":
          return require("../../../assets/Brawlers_icons/JACKY.png");

        case "JESSIE":
          return require("../../../assets/Brawlers_icons/JESSIE.png");

        case "LEON":
          return require("../../../assets/Brawlers_icons/LEON.png");

        case "LOU":
          return require("../../../assets/Brawlers_icons/LOU.png");

        case "MAX":
          return require("../../../assets/Brawlers_icons/MAX.png");

        case "MORTIS":
          return require("../../../assets/Brawlers_icons/MORTIS.png");

        case "MR. P":
          return require("../../../assets/Brawlers_icons/MR_P.png");

        case "NANI":
          return require("../../../assets/Brawlers_icons/NANI.png");

        case "NITA":
          return require("../../../assets/Brawlers_icons/NITA.png");

        case "PAM":
          return require("../../../assets/Brawlers_icons/PAM.png");

        case "PENNY":
          return require("../../../assets/Brawlers_icons/PENNY.png");

        case "PIPER":
          return require("../../../assets/Brawlers_icons/PIPER.png");

        case "POCO":
          return require("../../../assets/Brawlers_icons/POCO.png");

        case "RICO":
          return require("../../../assets/Brawlers_icons/RICO.png");

        case "ROSA":
          return require("../../../assets/Brawlers_icons/ROSA.png");

        case "SANDY":
          return require("../../../assets/Brawlers_icons/SANDY.png");

        case "SHELLY":
          return require("../../../assets/Brawlers_icons/SHELLY.png");

        case "SPIKE":
          return require("../../../assets/Brawlers_icons/SPIKE.png");

        case "SPROUT":
          return require("../../../assets/Brawlers_icons/SPROUT.png");

        case "SURGE":
          return require("../../../assets/Brawlers_icons/SURGE.png");

        case "TARA":
          return require("../../../assets/Brawlers_icons/TARA.png");

        case "TICK":
          return require("../../../assets/Brawlers_icons/TICK.png");
      }
    };
    //not currently in use

    const getModeImage = (mode) => {
      switch (mode) {
        case "brawlBall":
          return require("../../../assets/ModesandMaps/brawlBall/icon/brawlBall.png");
        case "bounty":
          return require("../../../assets/ModesandMaps/siege/icon/siege.png");
        case "gemGrab":
          return require("../../../assets/ModesandMaps/gemGrab/icon/gemGrab.png");
        case "heist":
          return require("../../../assets/ModesandMaps/heist/icon/heist.png");
        case "hotZone":
          return require("../../../assets/ModesandMaps/hotZone/icon/hotZone.png");
        case "siege":
          return require("../../../assets/ModesandMaps/siege/icon/siege.png");
        case "soloShowdown":
          return require("../../../assets/ModesandMaps/showdown/icon/soloShowdown.png");
        case "duoShowdown":
          return require("../../../assets/ModesandMaps/showdown/icon/duoShowdown.png");
      }
    };

    const getBrawlerImage = (brawlerID) => {
      let brawlerUrl = undefined;
      state.brawlifyReducer.brawlersList.list.map((brawler) => {
        if (brawler.id === brawlerID) {
          brawlerUrl = brawler.imageUrl;
        }
      });
      return { uri: brawlerUrl };
    };

    const getMapImage = (mapID) => {
      let mapUrl = undefined;
      state.brawlifyReducer.mapsList.list.map((map) => {
        if (map.id === mapID) {
          mapUrl = map.imageUrl;
        }
      });
      return { uri: mapUrl };
    };

    playerStats.keys.modes.map((mode) => {
      //console.log(mode);
      if (mode !== "duoShowdown" && mode !== "soloShowdown") {
        modes.push({
          color: getModeColors(mode),
          image: getModeImage(mode),
          duration: playerStats.mode[mode].avgDuration,
          spRatio: (playerStats.mode[mode].starPlayer/playerStats.mode[mode].games),
          winRatio: playerStats.mode[mode].winRatio,
          wins: playerStats.mode[mode].wins,
          losses: playerStats.mode[mode].losses,
          title: mode.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
            return str.toUpperCase();
          }),
        });
      } else {
        modes.push({
          color: getModeColors(mode),
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
        color: getBrawlerColor(brawler),
        image: getBrawlerImage(compiledBrawlers.brawlerID),
        duration: compiledBrawlers.avgDuration,
        spRatio: (compiledBrawlers.starPlayer/compiledBrawlers.games),
        winRatio: compiledBrawlers.winRatio,
        wins: compiledBrawlers.wins,
        losses: compiledBrawlers.losses,
        title: brawler,
      });
    });

    brawlersByPerformance = [...brawlers].sort((a, b) =>
      a.winRatio > b.winRatio ? -1 : 1
    );

    brawlersByWins = [...brawlers].sort((a, b) => (a.wins > b.wins ? -1 : 1));

    playerStats.keys.maps.map((map) => {
      let compiledMaps = playerStats.compiled.maps[map];
      maps.push({
        image: getMapImage(compiledMaps.mapID),
        winRatio: compiledMaps.winRatio,
        spRatio:(compiledMaps.starPlayer/compiledMaps.games),
        duration: compiledMaps.avgDuration,
        wins: compiledMaps.wins,
        losses: compiledMaps.losses,
        title: map,
      });
    });
    mapsByPerformance = [...maps].sort((a, b) =>
      a.winRatio > b.winRatio ? -1 : 1
    );

    mapsByWins = [...maps].sort((a, b) => (a.wins > b.wins ? -1 : 1));

    if(mapsByWins){
      loadedOnceCarouselData=true;
    }

    playerStats.keys.teams.map((team) => {
      let compiledTeams = playerStats.compiled.teams[team];
      teams.push({
        brawler1: getBrawlerImage(compiledTeams.id1),
        brawler2: getBrawlerImage(compiledTeams.id2),
        brawler3: getBrawlerImage(compiledTeams.id3),
        duration:compiledTeams.avgDuration,
        spRatio:(compiledTeams.starPlayer/compiledTeams.games),
        winRatio: compiledTeams.winRatio,
        wins: compiledTeams.wins,
        losses: compiledTeams.losses,
        title: team,
      });
    });
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
  loadedOnceCarouselData
};
