import axios from "axios";

export default async function api(userId) {
  return new Promise(function (resolve, reject) {
    //https://brawlhub.herokuapp.com/battleLog
    axios
      // development
      // 192.168.1.4
      //wifi hotspot
      // 192.168.43.50
      .post("http://192.168.1.4:5010/PlayerandBattleLog", {
        playerId: userId,
      })
      .then(
        (response) => {
          if (response.data["reason"]) reject();
          console.log("Fresh out of Axios Api" + response.data);
          console.log(response.data);
          resolve(response.data);
        },
        (error) => {
          reject(error);
          console.log(error);
        }
      );
  });
}
