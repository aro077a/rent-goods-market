import { Dispatch } from "redux";

import { StoreControllerApi } from "@/types/marketplaceapi";

export const SAVE_ACCOUNT_STORES = "SAVE_ACCOUNT_STORES";
export const SAVE_ACCOUNT_STORES_LOADING = "SAVE_ACCOUNT_STORES_LOADING";

const accountStoresLoading = (loading) => ({
  type: SAVE_ACCOUNT_STORES_LOADING,
  loading,
});

const saveAccountStoresAction = (accountStores) => ({
  type: SAVE_ACCOUNT_STORES,
  accountStores,
});

export const getAccountStores = () => async (dispatch: Dispatch) => {
  dispatch(accountStoresLoading(true));
  try {
    const accountStores = (await new StoreControllerApi().accountStoreListUsingGET()).body || [];
    dispatch(saveAccountStoresAction(accountStores));
  } catch (error) {
    console.log(error);
  }
  dispatch(accountStoresLoading(false));
};
