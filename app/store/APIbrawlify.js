import axios from "axios";

async function findBrawlerList() {
  return new Promise(function (resolve, reject) {
    axios.get("https://api.brawlapi.com/v1/brawlers").then(
      (response) => {
        resolve(response.data);
      },
      (error) => {
        reject(error);
        console.log(error);
      }
    );
  });
}

async function findMapsList() {
  return new Promise(function (resolve, reject) {
    axios.get("https://api.brawlapi.com/v1/maps").then(
      (response) => {
        resolve(response.data);
      },
      (error) => {
        reject(error);
        console.log(error);
      }
    );
  });
} 

export { findBrawlerList,findMapsList };
