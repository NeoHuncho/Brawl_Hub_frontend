import { supabase } from "./initSupabase";
import {store} from '../store/configureStore';
import React from 'react'
console.log('look here for real')



    const playerInfoWrite = async ()=>{
      
      let state= store.getState()
      console.log(state.userId)
      
      if(state.player){
        const { data, error } = await supabase
      .from('Player')
    .update([{
      name: state.player.name
    }])
      .eq('playerID', state.userId)
      if(error)console.log(error)
    }
      }

    const playerStatsWrite = async ()=>{
      let state= store.getState()
      console.log(state.userId)
      if(state.player){
        const { data, error } = await supabase
      .from('BattleLog')
    .update([{
      trophyWins: state.trophyWins,
      lastMatch: state.lastMatch,
      modes:state.lastMatch
    }])
      .eq('playerID', state.userId)
      if(error)console.log(error)
    }
      }

    

    export{playerInfoWrite, playerStatsWrite}
  const unsubscribe = store.subscribe(playerInfoWrite)
unsubscribe()