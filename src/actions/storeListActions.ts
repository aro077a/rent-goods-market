import { IApplicationStore } from "../store/rootReducer";
import { PublicControllerApi } from "../types/marketplaceapi";
import { handleError } from "../error-handler";

export const SAVE_ALL_STORE_WIDGET = "SAVE_ALL_STORE_WIDGET";
export const SAVE_CURRENT_STORE_CATEGORIES = "SAVE_CURRENT_STORE_CATEGORIES";
export const SAVE_STORE_PRODUCTS = "SAVE_STORE_PRODUCTS";
export const RESET_STORE_DATA = "RESET_STORE_DATA";
export const GET_STORES_CATEGORIES_LOADING = "GET_STORES_CATEGORIES_LOADING";

//
export const getAllStoreWidget = () => async (dispatch: any) => {
  try {
    const storeWidget = await new PublicControllerApi().storeWidgetUsingGET();
    storeWidget.body && dispatch(saveStoreWidget(storeWidget.body[0]));
  } catch (err) {
    console.log(err);
  }
};

export const getStoreCategories =
  (storeUid, category) =>
  async (dispatch: any, getState: () => IApplicationStore) => {
    dispatch(getStoreCategoriesLoading(true));

    const state = getState();
    const { language } = state.rootReducer;

    try {
      const store = await new PublicControllerApi().storeInfoUsingGET(
        storeUid,
        language,
        category
      );
      store.body && dispatch(saveStoreCategories(store.body[0]));
    } catch (err) {
      console.log(err);
    }

    dispatch(getStoreCategoriesLoading(false));
  };

export const saveStoreWidget = (storeWidget: []) => ({
  type: SAVE_ALL_STORE_WIDGET,
  storeWidget,
});

export const saveStoreCategories = (currentStoreCategories: {}) => ({
  type: SAVE_CURRENT_STORE_CATEGORIES,
  currentStoreCategories,
});

export const getStoreCategoriesLoading = (loading: boolean) => ({
  type: GET_STORES_CATEGORIES_LOADING,
  loading,
});

export const resetStoreData = () => ({
  type: RESET_STORE_DATA,
});
