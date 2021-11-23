import { AnyAction } from "redux";
import {
  SAVE_STORE_HOMEPAGE,
  SAVE_STORE_HOMEPAGE_LOADING,
} from "../actions/storeHomePageActions";
import { StoreHomepage } from "../types/marketplaceapi";

export interface IStoreHomePageState {
  storeHomePage: StoreHomepage;
  storeHomePageLoading: boolean;
}

const initialState: IStoreHomePageState = {
  storeHomePage: null,
  storeHomePageLoading: false,
};

const storeHomePageReducer = (
  state = initialState,
  action: AnyAction
): IStoreHomePageState => {
  switch (action.type) {
    case SAVE_STORE_HOMEPAGE: {
      return {
        ...state,
        storeHomePage: { ...action.data },
      };
    }
    case SAVE_STORE_HOMEPAGE_LOADING: {
      return {
        ...state,
        storeHomePageLoading: action.loading,
      };
    }
  }
  return state;
};

export default storeHomePageReducer;
