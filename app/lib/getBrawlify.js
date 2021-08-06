import axios from "axios-proxy-fix";

export default getBrawlify = async () => {
  try {
    // const maps = brawlify["maps"];
    // const brawlers = brawlify["brawlers"];
    // const icons = brawlify["icons"]["player"];
    // const brawlify = await db
    //   .ref("global/brawlify")
    //   .once("value")
    //   .then((snapshot) => snapshot.val());
    let maps = null;
    let brawlers = null;

    await axios.get("https://api.brawlapi.com/v1/maps").then((response) => {
      maps = response.data.list;
    });
    await axios.get("https://api.brawlapi.com/v1/brawlers").then((response) => {
      brawlers = response.data;
    });

    return { maps, brawlers };
  } catch (error) {
    console.log(error);
  }
};
