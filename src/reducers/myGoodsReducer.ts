import { AnyAction } from "redux";

import {
  MY_GOODS_LIST_LOADING,
  MY_GOODS_LIST_LOADING_ERROR,
  MY_GOODS_LIST_LOADING_SUCCESS,
} from "@/actions/myGoodsActions";
import {
  PRODUCT_CREATE_LOADING_SUCCESS,
  PRODUCT_DELETE_SUCCESS,
} from "@/actions/productCreateActions";
import { CHANGE_PRODUCT_STATUS_SUCCESS } from "@/actions/productStatusActions";
import { Product } from "@/types/marketplaceapi";

import { IProduct } from "./productReducer";

export interface IMyGoodsState {
  loading?: boolean;
  error?: unknown;
  products?: IProduct[];
}

const initialState: IMyGoodsState = {
  loading: false,
  error: null,
  products: [],
};

const myGoodsReducer = (state = initialState, action: AnyAction): IMyGoodsState => {
  switch (action.type) {
    case MY_GOODS_LIST_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case MY_GOODS_LIST_LOADING_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.products,
      };
    case MY_GOODS_LIST_LOADING_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case PRODUCT_CREATE_LOADING_SUCCESS: {
      const product = action.product;
      const { products } = state;

      if (product) {
        const current = products.filter((item) => item.uid === product.uid)[0];
        if (current) {
          products[products.indexOf(current)] = { ...product };
        } else {
          products.unshift(product);
        }
      }

      return {
        ...state,
        products: [...products],
      };
    }
    case PRODUCT_DELETE_SUCCESS:
      return {
        ...state,
        products: state.products.filter((item) => item.uid !== action.uid),
      };
    case CHANGE_PRODUCT_STATUS_SUCCESS: {
      const { item } = action;
      const { products } = state;

      if (item) {
        const searchedItem = products.filter((_item) => _item.uid === item.uid)[0];
        if (searchedItem) {
          products[products.indexOf(searchedItem)] = { ...item };
        }
        return {
          ...state,
          products: products.filter((item) => item.status !== Product.StatusEnum.DLT),
        };
      }

      return {
        ...state,
      };
    }
    default:
      return state;
  }
};

export default myGoodsReducer;
