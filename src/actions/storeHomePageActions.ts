import { IProduct } from "../reducers/productReducer";
import {
  StoreControllerApi,
  StoreHomepageBanner,
  StoreHomepageProduct,
  StoreHomepageWidget,
} from "../types/marketplaceapi";

export const SAVE_STORE_HOMEPAGE = "SAVE_STORE_HOMEPAGE";
export const SAVE_STORE_HOMEPAGE_LOADING = "SAVE_STORE_HOMEPAGE_LOADING";
export const SAVE_STORE_HOMEPAGE_WIDGET = "SAVE_STORE_HOMEPAGE_WIDGET";
export const SAVE_STORE_HOMEPAGE_WIDGET_LOADING =
  "SAVE_STORE_HOMEPAGE_WIDGET_LOADING";
export const SAVE_STORE_HOMEPAGE_PRODUCT_LOADING =
  "SAVE_STORE_HOMEPAGE_PRODUCT_LOADING";

export const getStoreHomePage = (storeUid: string) => async (dispatch: any) => {
  dispatch(storeHomePageLoadingAction(true));
  try {
    const data =
      (await new StoreControllerApi().getStoreHomepageUsingGET(storeUid))
        .body || [];

    dispatch(saveStoreHomePageAction({ ...data[0] }));
    return data[0];
  } catch (error) {
    console.log(error, "error");
  } finally {
    dispatch(storeHomePageLoadingAction(false));
  }
};

export const initStoreHomePage =
  (storeUid: string) => async (dispatch: any) => {
    dispatch(storeHomePageLoadingAction(true));
    try {
      const data =
        (await new StoreControllerApi().addStoreHomepageUsingPUT(storeUid))
          .body || [];
      dispatch(saveStoreHomePageAction({ ...data[0] }));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(storeHomePageLoadingAction(false));
    }
  };

export const addStoreHomePageWidget =
  (storeHomepageUid: string, storeUid: string, widget: StoreHomepageWidget) =>
  async (dispatch: any) => {
    dispatch(storeHomePageLoadingAction(true));
    try {
      const data =
        (
          await new StoreControllerApi().addStoreHomepageWidgetUsingPUT(
            storeHomepageUid,
            storeUid,
            widget
          )
        ).body || [];
      dispatch(saveStoreHomePageAction({ ...data[0] }));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(storeHomePageLoadingAction(false));
    }
  };

export const deleteStoreHomePageWidget =
  (storeHomepageUid: string, storeUid: string, widget: StoreHomepageWidget) =>
  async (dispatch: any) => {
    dispatch(storeHomePageLoadingAction(true));
    try {
      const data =
        (
          await new StoreControllerApi().deleteStoreHomepageWidgetUsingDELETE(
            storeHomepageUid,
            storeUid,
            widget
          )
        ).body || [];
      dispatch(saveStoreHomePageAction({ ...data[0] }));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(storeHomePageLoadingAction(false));
    }
  };

export const deleteStoreHomePageAllWidgets =
  (
    storeHomepageUid: string,
    storeUid: string,
    widgets: Array<StoreHomepageWidget>
  ) =>
  async (dispatch: any) => {
    dispatch(storeHomePageLoadingAction(true));
    try {
      const data =
        (
          await new StoreControllerApi().deleteStoreHomepageWidgetsUsingDELETE(
            storeHomepageUid,
            storeUid,
            widgets
          )
        ).body || [];
      dispatch(saveStoreHomePageAction({ ...data[0] }));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(storeHomePageLoadingAction(false));
    }
  };

export const addStoreHomePageProduct =
  (
    products: StoreHomepageProduct,
    storeHomepageUid: string,
    storeUid: string
  ) =>
  async (dispatch: any) => {
    dispatch(storeHomePageLoadingAction(true));
    try {
      const data =
        (
          await new StoreControllerApi().addStoreHomepageProductUsingPUT(
            products,
            storeHomepageUid,
            storeUid
          )
        ).body || [];
      dispatch(saveStoreHomePageAction({ ...data[0] }));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(storeHomePageLoadingAction(false));
    }
  };

export const deleteStoreHomePageProduct =
  (
    product: IProduct,
    storeHomepageUid: string,
    storeUid: string,
    options?: any
  ) =>
  async (dispatch: any) => {
    dispatch(storeHomePageLoadingAction(true));
    try {
      const data =
        (
          await new StoreControllerApi().deleteStoreHomepageProductUsingDELETE(
            product,
            storeHomepageUid,
            storeUid,
            options
          )
        ).body || [];
      dispatch(saveStoreHomePageAction({ ...data[0] }));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(storeHomePageLoadingAction(false));
    }
  };

export const deleteStoreHomePageAllProducts =
  (
    products: Array<StoreHomepageProduct>,
    storeHomepageUid: string,
    storeUid: string
  ) =>
  async (dispatch: any) => {
    dispatch(storeHomePageLoadingAction(true));
    try {
      const data =
        (
          await new StoreControllerApi().deleteStoreHomepageProductsUsingDELETE(
            products,
            storeHomepageUid,
            storeUid
          )
        ).body || [];
      dispatch(saveStoreHomePageAction({ ...data[0] }));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(storeHomePageLoadingAction(false));
    }
  };

export const storeHomePageBannerAction =
  (
    banner: StoreHomepageBanner,
    storeHomepageUid: string,
    storeUid: string,
    action: string
  ) =>
  async (dispatch: any) => {
    const apiCall =
      action === "add"
        ? (...args) =>
            new StoreControllerApi().createStoreHomepageBannerUsingPUT(...args)
        : action === "remove"
        ? (...args) =>
            new StoreControllerApi().deleteStoreHomepageBannerUsingDELETE(
              ...args
            )
        : null;

    try {
      const data =
        (apiCall && (await apiCall(banner, storeHomepageUid, storeUid)).body) ||
        [];
      dispatch(saveStoreHomePageAction({ ...data[0] }));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(storeHomePageLoadingAction(false));
    }
  };

export const storeHomePagePublish =
  (storeHomepageUid: string, storeUid: string) => async (dispatch: any) => {
    dispatch(storeHomePageLoadingAction(true));
    try {
      const data =
        (
          await new StoreControllerApi().publishStoreHomepageUsingPOST(
            storeHomepageUid,
            storeUid
          )
        ).body || [];
      dispatch(saveStoreHomePageAction({ ...data[0] }));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(storeHomePageLoadingAction(false));
    }
  };

export const storeHomePageDelete =
  (storeHomepageUid: string, storeUid: string) => async (dispatch: any) => {
    dispatch(storeHomePageLoadingAction(true));
    try {
      await new StoreControllerApi().deleteStoreHomepageUsingDELETE(
        storeHomepageUid,
        storeUid
      );
      dispatch(saveStoreHomePageAction(null));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(storeHomePageLoadingAction(false));
    }
  };

const storeHomePageLoadingAction = (loading) => ({
  type: SAVE_STORE_HOMEPAGE_LOADING,
  loading,
});

const saveStoreHomePageAction = (data) => ({
  type: SAVE_STORE_HOMEPAGE,
  data,
});

const storeHomePageWidgetLoadingAction = (loading) => ({
  type: SAVE_STORE_HOMEPAGE_WIDGET_LOADING,
  loading,
});

const storeHomePageProductLoadingAction = (loading) => ({
  type: SAVE_STORE_HOMEPAGE_PRODUCT_LOADING,
  loading,
});

const saveStoreHomePageWidgetAction = (widgets) => ({
  type: SAVE_STORE_HOMEPAGE_WIDGET,
  widgets,
});
