import { AnyAction } from "redux";
import {
  GET_STORES_CATEGORIES_LOADING,
  RESET_STORE_DATA,
  SAVE_ALL_STORE_WIDGET,
  SAVE_CURRENT_STORE_CATEGORIES,
} from "../actions/storeListActions";

export interface IStoreState {
  storeWidget: any;
  currentStoreCategories: any;
  currentStoreCategoriesLoading: boolean;
}

const initialState: IStoreState = {
  storeWidget: {},
  currentStoreCategories: {},
  currentStoreCategoriesLoading: false,
};

const storeReducer = (state = initialState, action: AnyAction): IStoreState => {
  switch (action.type) {
    case SAVE_ALL_STORE_WIDGET: {
      return {
        ...state,
        storeWidget: action.storeWidget,
      };
    }

    case SAVE_CURRENT_STORE_CATEGORIES: {
      return {
        ...state,
        currentStoreCategories: action.currentStoreCategories,
      };
    }
    case GET_STORES_CATEGORIES_LOADING: {
      return {
        ...state,
        currentStoreCategoriesLoading: action.loading,
      };
    }
    case RESET_STORE_DATA: {
      return { ...initialState };
    }
    default: {
      return state;
    }
  }
};

export default storeReducer;
