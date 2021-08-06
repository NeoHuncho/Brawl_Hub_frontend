import { AdMobInterstitial } from "expo-ads-admob";

// TEST "ca-app-pub-3940256099942544/6300978111"
// PRODUCTION "ca-app-pub-2795080443480499/9766722308"
const bannerAdID = "ca-app-pub-2795080443480499/9766722308";

// TEST "ca-app-pub-3940256099942544/1033173712"
//PRODUCTION "ca-app-pub-2795080443480499/1284925570"
const imageAdID = "ca-app-pub-2795080443480499/1284925570";

// TEST "ca-app-pub-3940256099942544/8691691433"
//PRODUCTION "ca-app-pub-2795080443480499/4950011872"
const videoAdID = "ca-app-pub-2795080443480499/4950011872";

let countImageAd = 0;
let countVideoAd = 0;

const prepareAdsFirstTime = async () => {
  if (
    (await AdMobInterstitial.getIsReadyAsync()) != true &&
    countImageAd == 0 &&
    countVideoAd == 0
  )
    await AdMobInterstitial.setAdUnitID(videoAdID); // Test ID, Replace with your-admob-unit-id
  await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
};

const showInterstitial = async () => {
  if (countImageAd == countVideoAd)
    try {
      if ((await AdMobInterstitial.getIsReadyAsync()) == true) {
        await AdMobInterstitial.showAdAsync();
        await AdMobInterstitial.setAdUnitID(imageAdID); // Test ID, Replace with your-admob-unit-id

        countVideoAd += 1;
      } else {
        await new Promise((r) => setTimeout(r, 1000));
        if ((await AdMobInterstitial.getIsReadyAsync()) == true) {
          await AdMobInterstitial.showAdAsync();
          await AdMobInterstitial.setAdUnitID(imageAdID); // Test ID, Replace with your-admob-unit-id

          countVideoAd += 1;
        }
      }
    } catch (error) {
      console.log("error in getting image ad", error);
    }
  else if (countVideoAd > countImageAd) {
    try {
      if ((await AdMobInterstitial.getIsReadyAsync()) == true) {
        await AdMobInterstitial.showAdAsync();
        await AdMobInterstitial.setAdUnitID(videoAdID); // Test ID, Replace with your-admob-unit-id

        countImageAd += 1;
      } else {
        await new Promise((r) => setTimeout(r, 1500));
        if ((await AdMobInterstitial.getIsReadyAsync()) == true) {
          await AdMobInterstitial.showAdAsync();
          await AdMobInterstitial.setAdUnitID(videoAdID); // Test ID, Replace with your-admob-unit-id

          countImageAd += 1;
        }
      }
    } catch (error) {
      console.log("error in getting video add", error);
    }
  }
};

const requestAd = async () => {
  await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
};

export {
  bannerAdID,
  imageAdID,
  videoAdID,
  prepareAdsFirstTime,
  showInterstitial,
  requestAd,
};
