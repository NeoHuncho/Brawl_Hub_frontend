import { supabase } from "./initSupabase";
import { store } from "../store/configureStore";
import { db } from "./initFirebase";

const playerInfoWrite = async () => {
  let state = store.getState();
  console.log(state);
  if (state.battleLogReducer.battleLog[0]) {
    console.log('called writer when battlelog has changed')
    db.collection("PlayerStats").doc(state.battleLogReducer.userId).set({
      playerId: state.battleLogReducer.userId,
      name: state.battleLogReducer.player.name,
      nameColor: state.battleLogReducer.player.nameColor,
      trophyWins: state.battleLogReducer.trophyWins,
      trophyLosses: state.battleLogReducer.trophyLosses,
      lastMatch: state.battleLogReducer.lastMatch,
      numberOfGames: state.battleLogReducer.numberOfGames,
      playerStats: state.battleLogReducer.playerStats,
    });
  } else
    db.collection("PlayerStats").doc(state.battleLogReducer.userId).update({
      playerId: state.battleLogReducer.userId,
      name: state.battleLogReducer.player.name,
      nameColor: state.battleLogReducer.player.nameColor,
    });
};

export { playerInfoWrite };
const unsubscribe = store.subscribe(playerInfoWrite);
unsubscribe();
