import { AnyAction } from "redux";

import {
  ALL_DEALS_LOADING,
  ALL_DEALS_LOADING_ERROR,
  ALL_DEALS_LOADING_SUCCESS,
  ALL_DEALS_RELOAD,
} from "@/actions/allDealsActions";
import { PRODUCT_ADDED_TO_WISH } from "@/actions/productActions";

import { IProduct } from "./productReducer";

export interface IAllDealsState {
  loading?: boolean;
  error?: boolean;
  products: IProduct[];
  count?: number;
  offset?: number;
}

const initialState: IAllDealsState = {
  loading: null,
  error: null,
  products: [],
  count: 15,
  offset: 0,
};

const allDealsReducer = (state = initialState, action: AnyAction): IAllDealsState => {
  switch (action.type) {
    case ALL_DEALS_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ALL_DEALS_LOADING_SUCCESS: {
      const { products } = action;
      const { offset } = state;
      return {
        ...state,
        loading: false,
        products: products ? [...state.products, ...products] : state.products,
        offset: offset + (products && products.length ? initialState.count : 0),
        count:
          products && products.length && products.length === initialState.count
            ? initialState.count
            : 0,
      };
    }
    case ALL_DEALS_LOADING_ERROR:
      return {
        ...state,
        loading: null,
        error: action.error,
      };
    case ALL_DEALS_RELOAD:
      return {
        ...state,
        loading: false,
        error: null,
        products: initialState.products,
        offset: initialState.offset,
        count: initialState.count,
      };
    case PRODUCT_ADDED_TO_WISH: {
      const { uid } = action;
      const { products } = state;

      products
        .filter((item) => item.uid === uid)
        .forEach((item) => {
          item.wish = !item.wish;
        });

      return {
        ...state,
        products: [...products],
      };
    }
    default:
      return state;
  }
};

export default allDealsReducer;
