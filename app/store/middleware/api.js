import { supabase } from "../../lib/initSupabase";
import api from "../api";
export default async function apiMiddleware(userId) {
  let { data, error } = await supabase.from("BattleLog").select("lastMatch");
  let response = await api(userId);
  let TimeStamp = data[0].lastMatch;
  let battlelog = response.items;
  let index = 0;

  for (const element of battlelog) {
    
    if (element.battleTime !== TimeStamp) {
   break;
    }
    index++;
  }
  console.log(index);
  battlelog.splice(6, battlelog.length-index);
  console.log(battlelog);
  return battlelog;
}
