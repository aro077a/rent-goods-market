import { AnyAction } from "redux";
import {
  ORDERS_PROMO_ORDER_CREATING,
  ORDERS_PROMO_ORDER_CREATING_SUCCESS,
  ORDERS_PROMO_ORDER_CREATING_ERROR,
  ORDERS_PRODUCTS_ORDER_CREATING,
  ORDERS_PRODUCTS_ORDER_CREATING_SUCCESS,
  ORDERS_PRODUCTS_ORDER_CREATING_ERROR,
  ORDERS_LOADING,
  ORDERS_LOADING_SUCCESS,
  ORDERS_LOADING_ERROR,
  ORDER_DETAILS_SUCCESS,
  CHANGE_ORDER_STATUS_LOADING,
  CHANGE_ORDER_STATUS_SUCCESS,
  CHANGE_ORDER_STATUS_ERROR,
  ORDER_RESET,
} from "../actions/ordersActions";
import { PaymentApiOrder, ProductOrder } from "../types/paymentapi";

export interface IOrdersState {
  orderCreating?: boolean;
  orderCreatingError?: any;
  order?: PaymentApiOrder;
  ordersLoading?: boolean;
  ordersLoadingError?: any;
  orders?: ProductOrder[];
  selectedOrder?: ProductOrder;
  orderStatusLoading?: boolean;
  orderStatusLoadingError?: any;
}

const initialState: IOrdersState = {
  orderCreating: false,
  orderCreatingError: null,
  ordersLoadingError: null,
  ordersLoading: false,
  orderStatusLoading: false,
  orderStatusLoadingError: null,
  orders: [],
  selectedOrder: null,
};

const ordersReducer = (
  state = initialState,
  action: AnyAction
): IOrdersState => {
  switch (action.type) {
    case ORDERS_PROMO_ORDER_CREATING:
      return {
        ...state,
        orderCreating: true,
        orderCreatingError: null,
      };
    case ORDERS_PROMO_ORDER_CREATING_SUCCESS:
      return {
        ...state,
        orderCreating: false,
        order: action.order,
      };
    case ORDERS_PROMO_ORDER_CREATING_ERROR:
      return {
        ...state,
        orderCreating: false,
        orderCreatingError: action.error,
      };
    case ORDERS_PRODUCTS_ORDER_CREATING:
      return {
        ...state,
        orderCreating: true,
        orderCreatingError: null,
      };
    case ORDERS_PRODUCTS_ORDER_CREATING_SUCCESS:
      return {
        ...state,
        orderCreating: false,
        order: action.order,
      };
    case ORDERS_PRODUCTS_ORDER_CREATING_ERROR:
      return {
        ...state,
        orderCreating: false,
        orderCreatingError: action.error,
      };
    case ORDERS_LOADING:
      return {
        ...state,
        ordersLoading: true,
        ordersLoadingError: null,
      };
    case ORDERS_LOADING_SUCCESS:
      let { orders } = action;
      return {
        ...state,
        ordersLoading: false,
        orders: [...orders.reverse()],
      };
    case ORDERS_LOADING_ERROR:
      return {
        ...state,
        ordersLoading: false,
        ordersLoadingError: action.error,
      };
    case ORDER_DETAILS_SUCCESS:
      let { order } = action;
      return {
        ...state,
        selectedOrder: order,
      };
    case CHANGE_ORDER_STATUS_LOADING:
      return {
        ...state,
        orderStatusLoading: true,
        orderStatusLoadingError: null,
      };
    case CHANGE_ORDER_STATUS_SUCCESS:
      return {
        ...state,
        orderStatusLoading: false,
        selectedOrder: action.order,
      };
    case CHANGE_ORDER_STATUS_ERROR:
      return {
        ...state,
        orderStatusLoading: false,
        orderStatusLoadingError: action.error,
      };
    case ORDER_RESET:
      return initialState;
    default:
      return state;
  }
};

export default ordersReducer;
