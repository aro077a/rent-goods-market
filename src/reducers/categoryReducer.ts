import { AnyAction } from "redux";
import {
  CATEGORY_LIST_LOADING,
  CATEGORY_LIST_LOADING_SUCCESS,
  CATEGORY_LIST_LOADING_ERROR,
} from "../actions/categoryActions";

export interface ICategoryClassificator {
  categoryName?: string;
  categoryCode?: string;
  productCount?: number;
  dependency?: string;
  shippingAllowed?: boolean;
  returnAllowed?: boolean;
  pickUpAllowed?: boolean;
  seoText?: string;
  iconCode?: string;
  color?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  children?: ICategoryClassificator[];
  parent?: ICategoryClassificator;
}

export interface ICategoryClassificatorState {
  categories: ICategoryClassificator[];
  flat: ICategoryClassificator[];
}

const initialState: ICategoryClassificatorState = {
  categories: [],
  flat: [],
};

const categoryReducer = (
  state = initialState,
  action: AnyAction
): ICategoryClassificatorState => {
  switch (action.type) {
    case CATEGORY_LIST_LOADING:
      return {
        ...state,
      };
    case CATEGORY_LIST_LOADING_SUCCESS:
      const { categories, flat } = action;
      return {
        ...state,
        categories,
        flat,
      };
    case CATEGORY_LIST_LOADING_ERROR:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default categoryReducer;
