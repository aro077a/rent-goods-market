import { IApplicationStore } from "../store/rootReducer";
import { OrderWsControllerApi } from "../types/paymentapi";
import * as Sentry from "@sentry/browser";
import {
  handleError,
  handleResponseAndThrowAnErrorIfExists,
} from "../error-handler";

export const SELLERS_ORDERS_LOADING = "SELLERS_ORDERS_LOADING";
export const SELLERS_ORDERS_LOADING_SUCCESS = "SELLERS_ORDERS_LOADING_SUCCESS";
export const SELLERS_ORDERS_LOADING_ERROR = "SELLERS_ORDERS_LOADING_ERROR";
export const SELLERS_ORDERS_ORDER_DETAIL_SUCCESS =
  "SELLERS_ORDERS_ORDER_DETAIL_SUCCESS";
export const SELLERS_ORDERS_ORDER_DETAIL_ERROR =
  "SELLERS_ORDERS_ORDER_DETAIL_ERROR";
export const SET_ORDER_STATUS_LOADING = "SET_ORDER_STATUS_LOADING";
export const SET_ORDER_STATUS_SUCCESS = "SET_ORDER_STATUS_SUCCESS";
export const SET_ORDER_STATUS_ERROR = "SET_ORDER_STATUS_ERROR";

export const loadMockOrders = () => async (dispatch: any) => {
  dispatch({ type: SELLERS_ORDERS_LOADING });
  try {
    const ORDERS = require("./mock/sellerOrders.json");
    const items = ORDERS.orderList || [];
    dispatch({
      type: SELLERS_ORDERS_LOADING_SUCCESS,
      orders: items,
    });
  } catch (error) {
    dispatch({
      type: SELLERS_ORDERS_LOADING_ERROR,
      error: error.toString(),
    });
  }
};

export const loadOrders =
  () => async (dispatch: any, getState: () => IApplicationStore) => {
    dispatch({
      type: SELLERS_ORDERS_LOADING,
    });
    try {
      const state = getState();
      const language = state.rootReducer.language;

      const result =
        await new OrderWsControllerApi().getProductOrderListUsingGET(
          false,
          language,
          null,
          null,
          true
        );
      handleResponseAndThrowAnErrorIfExists(result);
      const items = result.orderList || [];

      dispatch({
        type: SELLERS_ORDERS_LOADING_SUCCESS,
        orders: items,
      });
    } catch (error) {
      dispatch({
        type: SELLERS_ORDERS_LOADING_ERROR,
        error: error.toString(),
      });
    }
  };

export const loadOrderDetails = (uid: string) => async (dispatch: any) => {
  try {
    const item = (
      await new OrderWsControllerApi().getOrderDetailsUsingPOST({ uid })
    ).orderList[0];
    dispatch({
      type: SELLERS_ORDERS_ORDER_DETAIL_SUCCESS,
      order: item,
    });
  } catch (error) {
    dispatch({
      type: SELLERS_ORDERS_ORDER_DETAIL_ERROR,
      error: error.toString(),
    });
  }
};

export const setOrderStatus =
  (uid: string, status: string) => async (dispatch: any) => {
    dispatch({
      type: SET_ORDER_STATUS_LOADING,
    });

    try {
      const result = await new OrderWsControllerApi().setOrderStatusUsingPOST({
        uid,
        status,
      });
      handleResponseAndThrowAnErrorIfExists(result);

      dispatch({
        type: SET_ORDER_STATUS_SUCCESS,
        order: result.order,
      });

      dispatch(loadOrders());
    } catch (error) {
      dispatch({
        type: SET_ORDER_STATUS_ERROR,
        error: error.toString(),
      });
    }
  };

export const setProductOrderStatus =
  (
    uid: string,
    status: string,
    statusExtended?: string,
    trackingCarrier?: string,
    trackingNumber?: string
  ) =>
  async (dispatch: any, getState: () => IApplicationStore) => {
    dispatch({
      type: SET_ORDER_STATUS_LOADING,
    });

    try {
      const state = getState();
      const result =
        await new OrderWsControllerApi().setProductOrderStatusUsingPOST(
          {
            uid,
            status,
            statusExtended,
            trackingCarrier,
            trackingNumber,
          },
          state.rootReducer.language
        );

      handleResponseAndThrowAnErrorIfExists(result);

      dispatch({
        type: SET_ORDER_STATUS_SUCCESS,
        order: result.orderList[0],
      });

      dispatch(loadOrders());
    } catch (error) {
      dispatch({
        type: SET_ORDER_STATUS_ERROR,
        error: error.toString(),
      });
    }
  };

export const refundOrder =
  (uid: string, amount: number) => async (dispatch: any) => {
    dispatch({
      type: SET_ORDER_STATUS_LOADING,
    });

    try {
      const result = await new OrderWsControllerApi().refundOrderUsingPOST({
        uid,
        amount,
      });

      handleResponseAndThrowAnErrorIfExists(result);

      dispatch({
        type: SET_ORDER_STATUS_SUCCESS,
        order: result.order,
      });
    } catch (error) {
      dispatch({
        type: SET_ORDER_STATUS_ERROR,
        error: error.toString(),
      });
    }
  };
