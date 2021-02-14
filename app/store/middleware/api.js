import axios from "axios";


export default function api(userId){
  return new Promise(function (resolve, reject) {
    
    axios
      .post("http://127.0.0.1:5000/battle-log", {
        playerId: userId,
      })
      .then(
        (response) => {
          console.log('Fresh out of Axios Api'+response.data)
          resolve(response.data);
        },
        (error) => {
          reject(error);
        }
      );
  });
};

