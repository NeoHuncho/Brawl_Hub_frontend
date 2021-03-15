import { db } from "../../lib/initFirebase";
import api from "../apiHeroku";
export default async function apiMiddleware(userId) {
  const playerStats = await  db.collection("PlayerStats").doc(userId);
  const stats = await playerStats.get();
  if(userId){
   
    if (!stats.exists) {
      console.log('called in state does not exist!')
      let response = await api(userId);
      return response;
    } else {
      const { lastMatch } = await stats.data();
      let response = await api(userId);
      response.db=true;
      let battlelog = response.items;
      let index = 0;
  
      for (const element of battlelog) {
        if (element.battleTime == lastMatch) {
          break;
        }
        index++;
      }
      console.log('this is the index!'+index);
      battlelog.splice(index, battlelog.length - index);
     // console.log(response)
     // console.log(battlelog);
      return(response);
    }
  }
}
