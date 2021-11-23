import _ from "lodash";
import { AnyAction } from "redux";
import {
  SELLERS_ORDERS_LOADING,
  SELLERS_ORDERS_LOADING_ERROR,
  SELLERS_ORDERS_LOADING_SUCCESS,
  SELLERS_ORDERS_ORDER_DETAIL_ERROR,
  SELLERS_ORDERS_ORDER_DETAIL_SUCCESS,
  SET_ORDER_STATUS_ERROR,
  SET_ORDER_STATUS_LOADING,
  SET_ORDER_STATUS_SUCCESS,
} from "../actions/sellersOrdersActions";
import { ProductOrder } from "../types/paymentapi";

export interface ISellersOrdersState {
  loading?: boolean;
  error?: any;
  orders: ProductOrder[];
  orderDetails: ProductOrder;
  setOrderStatusLoading?: boolean;
  setOrderStatusError?: any;
}

const initialState: ISellersOrdersState = {
  loading: false,
  error: null,
  orders: [],
  orderDetails: null,
  setOrderStatusLoading: false,
  setOrderStatusError: null,
};

const sellersOrdersReducer = (
  state = initialState,
  action: AnyAction
): ISellersOrdersState => {
  switch (action.type) {
    case SELLERS_ORDERS_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SELLERS_ORDERS_LOADING_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.orders,
      };
    case SELLERS_ORDERS_LOADING_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case SELLERS_ORDERS_ORDER_DETAIL_SUCCESS: {
      return {
        ...state,
        loading: false,
        orderDetails: action.order,
      };
    }
    case SELLERS_ORDERS_ORDER_DETAIL_ERROR: {
      return {
        ...state,
        loading: false,
        orderDetails: null,
        error: action.error,
      };
    }
    case SET_ORDER_STATUS_LOADING: {
      return {
        ...state,
        setOrderStatusError: null,
        setOrderStatusLoading: true,
      };
    }
    case SET_ORDER_STATUS_SUCCESS: {
      const { orders } = state;
      const orderDetails = orders.filter(
        (item) => item.uid === action.order.uid
      )[0];
      orderDetails.status = action.order.status;

      return {
        ...state,
        setOrderStatusLoading: false,
        orders: _.cloneDeep(orders),
        orderDetails: action.order,
      };
    }
    case SET_ORDER_STATUS_ERROR: {
      return {
        ...state,
        setOrderStatusLoading: false,
        setOrderStatusError: action.error,
      };
    }
  }
  return state;
};

export default sellersOrdersReducer;
