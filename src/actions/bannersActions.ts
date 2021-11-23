import { IApplicationStore } from "@/store/rootReducer";
import { getPlatform, Platform } from "@/utils";
import { BannerControllerApi, PublicControllerApi } from "@/types/marketplaceapi";

export const MARKETING_BANNERS_LIST_LOADING = "MARKETING_BANNERS_LIST_LOADING";
export const MARKETING_BANNERS_LIST_LOADING_SUCCESS = "MARKETING_BANNERS_LIST_LOADING_SUCCESS";

function getChannel() {
  const platform = getPlatform();
  switch (platform) {
    case Platform.Android:
      return "android";
    case Platform.iOS:
      return "ios";
    default:
      return "web";
  }
}

const BANNER_COUNT = 5;

export const loadMarketingBanners = () => async (dispatch, getState: () => IApplicationStore) => {
  const state = getState();
  const { logged } = state.sessionReducer;

  dispatch({ type: MARKETING_BANNERS_LIST_LOADING });
  try {
    const { language } = state.rootReducer;
    const channel = getChannel();

    const res =
      (logged
        ? await new BannerControllerApi().bannerListUsingGET(channel, BANNER_COUNT, language)
        : await new PublicControllerApi().bannerListUsingGET1(channel, BANNER_COUNT, language)) ||
      {};
    dispatch({
      type: MARKETING_BANNERS_LIST_LOADING_SUCCESS,
      banners: res.body,
      count: res.count,
    });
  } catch (error) {
    console.error("at registerBannerClick in loadMarketingBanners", error);
  }
};

export const registerBannerClick =
  (bannerUid: string, channel?: string) =>
  async (_dispatch, _getState: () => IApplicationStore) => {
    try {
      if (!channel) channel = getChannel();
      await new BannerControllerApi().processManualClickUsingGET(bannerUid, channel);
    } catch (error) {
      console.error("at bannersActions in registerBannerClick", error);
    }
  };
