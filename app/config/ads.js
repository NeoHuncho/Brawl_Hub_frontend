import { AdMobInterstitial } from "expo-ads-admob";


// TEST "ca-app-pub-3940256099942544/6300978111"
// PRODUCTION "ca-app-pub-2795080443480499/9766722308"
const BANNER_AD_ID = "ca-app-pub-3940256099942544/";

// TEST "ca-app-pub-3940256099942544/1033173712"
//PRODUCTION "ca-app-pub-2795080443480499/1284925570"
const IMAGE_AD_ID = "ca-app-pub-3940256099942544/";

// TEST "ca-app-pub-3940256099942544/8691691433"
//PRODUCTION "ca-app-pub-2795080443480499/4950011872"
const VIDEO_AD_ID = "ca-app-pub-3940256099942544/";
let countImageAd = 0;
let countVideoAd = 0;

const prepareAdsFirstTime = async () => {
  if (
    (await AdMobInterstitial.getIsReadyAsync()) != true &&
    countImageAd == 0 &&
    countVideoAd == 0
  )
    await AdMobInterstitial.setAdUnitID(VIDEO_AD_ID); // Test ID, Replace with your-admob-unit-id
  await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
};

const showInterstitial = async () => {
  if (countImageAd == countVideoAd)
    try {
      if ((await AdMobInterstitial.getIsReadyAsync()) == true) {
        await AdMobInterstitial.showAdAsync().catch(() => "nothingness");
        await AdMobInterstitial.setAdUnitID(IMAGE_AD_ID).catch(
          () => "nothingness"
        ); // Test ID, Replace with your-admob-unit-id

        countVideoAd += 1;
      } else {
        if ((await AdMobInterstitial.getIsReadyAsync()) == true) {
          await AdMobInterstitial.showAdAsync().catch(() => "nothingness");
          await AdMobInterstitial.setAdUnitID(IMAGE_AD_ID).catch(
            () => "nothingness"
          ); // Test ID, Replace with your-admob-unit-id

          countVideoAd += 1;
        }
      }
    } catch {
      console.log("error in getting image ad");
    }
  else if (countVideoAd > countImageAd) {
    try {
      if ((await AdMobInterstitial.getIsReadyAsync()) == true) {
        await AdMobInterstitial.showAdAsync().catch(() => "nothingness");
        await AdMobInterstitial.setAdUnitID(VIDEO_AD_ID).catch(
          () => "nothingness"
        ); // Test ID, Replace with your-admob-unit-id

        countImageAd += 1;
      } else {
        if ((await AdMobInterstitial.getIsReadyAsync()) == true) {
          await AdMobInterstitial.showAdAsync().catch(() => "nothingness");
          await AdMobInterstitial.setAdUnitID(VIDEO_AD_ID).catch(
            () => "nothingness"
          ); // Test ID, Replace with your-admob-unit-id

          countImageAd += 1;
        }
      }
    } catch {
      console.log("error in getting video add");
    }
  }
};

const requestAd = async () => {
  try {
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
  } catch (error) {
    await AdMobInterstitial.setAdUnitID(IMAGE_AD_ID);
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
  }
};

export {
  VIDEO_AD_ID,
  BANNER_AD_ID,
  IMAGE_AD_ID,
  prepareAdsFirstTime,
  showInterstitial,
  requestAd,
};
