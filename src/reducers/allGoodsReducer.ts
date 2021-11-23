import { AnyAction } from "redux";

import {
  ALL_GOODS_LOADING,
  ALL_GOODS_LOADING_SUCCESS,
  ALL_GOODS_LOADING_ERROR,
} from "@/actions/allGoodsActions";
import { PRODUCT_ADDED_TO_WISH } from "@/actions/productActions";

import { IProduct } from "./productReducer";

export interface IAllGoodsState {
  loading?: boolean;
  error?: boolean;
  products: IProduct[];
  count?: number;
  offset?: number;
}

const initialState: IAllGoodsState = {
  loading: null,
  error: null,
  products: [],
  count: 10,
  offset: 0,
};

const allGoodsReducer = (state = initialState, action: AnyAction): IAllGoodsState => {
  switch (action.type) {
    case ALL_GOODS_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ALL_GOODS_LOADING_SUCCESS: {
      const { products = [] } = action;
      const { offset } = state;
      return {
        ...state,
        loading: false,
        products: [...state.products, ...products],
        offset: offset + (products?.length ? initialState.count : 0),
        count: products?.length && products.length === initialState.count ? initialState.count : 0,
      };
    }
    case ALL_GOODS_LOADING_ERROR:
      return {
        ...state,
        loading: null,
        error: action.error,
      };
    case PRODUCT_ADDED_TO_WISH: {
      const { uid } = action;
      const products = [...state.products]
        .filter((item) => item.uid === uid)
        .map((item) => ({
          ...item,
          wish: !item.wish,
        }));

      return {
        ...state,
        products,
      };
    }
    default:
      return state;
  }
};

export default allGoodsReducer;
