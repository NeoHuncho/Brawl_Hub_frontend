import { AdMobInterstitial } from "expo-ads-admob";
import { IMAGE_AD_ID, VIDEO_AD_ID } from "react-native-dotenv";

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

export { prepareAdsFirstTime, showInterstitial, requestAd };
