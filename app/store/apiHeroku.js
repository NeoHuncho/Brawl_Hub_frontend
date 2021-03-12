import axios from "axios";

export default async function api(userId) {
  return new Promise(function (resolve, reject) {
    //https://brawlhub.herokuapp.com/PlayerandBattleLog
    axios
      // development
      // 192.168.1.4
      //wifi hotspot
      // 192.168.43.50
      .post("https://brawlhub.herokuapp.com/PlayerandBattleLog", {
        playerId: userId,
      })
      .then(
        (response) => {
          if (response.data["reason"]) reject();
          console.log(response.data);
          console.log("Fresh out of Heroku Api")
          resolve(response.data);
        },
        (error) => {
          reject(error);
          console.log(error);
        }
      );
  });
}
