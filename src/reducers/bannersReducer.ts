import { AnyAction } from "redux";
import { Banner } from "../types/marketplaceapi";
import {
  MARKETING_BANNERS_LIST_LOADING,
  MARKETING_BANNERS_LIST_LOADING_SUCCESS,
} from "../actions/bannersActions";

export interface IBannersState {
  loading?: boolean;
  error?: boolean;
  banners?: Banner[];
  count?: 0;
}

const initialState: IBannersState = {
  loading: null,
  error: null,
  banners: [],
  count: 0,
};

const bannersReducer = (state = initialState, action: AnyAction): IBannersState => {
  switch (action.type) {
    case MARKETING_BANNERS_LIST_LOADING:
      return {
        ...state,
        banners: [],
        count: 0,
      };
    case MARKETING_BANNERS_LIST_LOADING_SUCCESS:
      return {
        ...state,
        banners: action.banners,
        count: action.count,
      };
    default:
      return state;
  }
};

export default bannersReducer;
