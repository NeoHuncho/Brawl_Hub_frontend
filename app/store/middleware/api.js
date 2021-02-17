import axios from "axios";

export default async function api(userId) {
  const userIdJson = JSON.stringify({ userId });
  return new Promise(function (resolve, reject) {
    axios
      .post("https://brawlhub.herokuapp.com/battleLog", {
        playerId: userId,
      })
      .then(
        (response) => {
          if (response.data["reason"])
            reject();
          console.log("Fresh out of Axios Api" + response.data);
          console.log(response);
          resolve(response.data);
        },
        (error) => {
          reject(error);
          console.log(error);
        }
      );
  });
}
