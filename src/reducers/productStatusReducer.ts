import { AnyAction } from "redux";
import {
  CHANGE_PRODUCT_STATUS_LOADING,
  CHANGE_PRODUCT_STATUS_SUCCESS,
  CHANGE_PRODUCT_STATUS_ERROR,
} from "../actions/productStatusActions";
import { IProduct } from "./productReducer";

export interface IProductStatusState {
  loading?: boolean;
  error?: string;
  item?: IProduct;
  action?: "changeStatus" | "changeQuantity";
}

const initialState: IProductStatusState = {};

const productStatusReducer = (
  state = initialState,
  action: AnyAction
): IProductStatusState => {
  switch (action.type) {
    case CHANGE_PRODUCT_STATUS_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
        item: null,
        action: null,
      };
    case CHANGE_PRODUCT_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        item: action.item,
        action: action.quantity ? "changeQuantity" : "changeStatus",
      };
    case CHANGE_PRODUCT_STATUS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
  }
  return state;
};

export default productStatusReducer;
