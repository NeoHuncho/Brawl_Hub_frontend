import { createSlice} from '@reduxjs/toolkit';
import moment from 'moment';

const slice = createSlice({
    name:'battleLog',
    initialState:{
        battleLog:null,
        lastFetch:null,
        wins:null,
        loses:null

    },
    reducers:{
       battleLogReceived:(battleLog,action)=>{
           battleLog.battleLog=action.payload
           battleLog.lastFetch=Date.now()
       } 
    }

})
export const {battleLogReceived} = slice.actions;
export default slice.reducer;