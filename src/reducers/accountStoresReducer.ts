import { AnyAction } from "redux";
import {
  SAVE_ACCOUNT_STORES,
  SAVE_ACCOUNT_STORES_LOADING,
} from "../actions/accountStore";
import { Store } from "../types/marketplaceapi";

export interface IAccountStoresState {
  accountStores: Store[];
  accountStoresLoading: boolean;
}

const initialState: IAccountStoresState = {
  accountStores: [],
  accountStoresLoading: false,
};

const accountStoresReducer = (
  state = initialState,
  action: AnyAction
): IAccountStoresState => {
  switch (action.type) {
    case SAVE_ACCOUNT_STORES: {
      return {
        ...state,
        accountStores: action.accountStores,
      };
    }
    case SAVE_ACCOUNT_STORES_LOADING: {
      return {
        ...state,
        accountStoresLoading: action.loading,
      };
    }
  }
  return state;
};

export default accountStoresReducer;
