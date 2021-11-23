import { AnyAction } from "redux";

import {
  DELIVERY_METHODS_ADD_ERROR,
  DELIVERY_METHODS_ADD_LOADING,
  DELIVERY_METHODS_ADD_SUCCESS,
  DELIVERY_METHODS_ALL_ERROR,
  DELIVERY_METHODS_ALL_LOADING,
  DELIVERY_METHODS_ALL_SUCCESS,
} from "@/actions/deliveryMethodsActions";
import { DeliveryMethod } from "@/types/marketplaceapi";

export interface IDeliveryMethodsState {
  loading?: boolean;
  error?: unknown;
  item?: DeliveryMethod;
  allDeliveryMethods?: DeliveryMethod[];
}

const initialState: IDeliveryMethodsState = {
  error: null,
  allDeliveryMethods: [],
};

const deliveryMethodsReducer = (state = initialState, action: AnyAction): IDeliveryMethodsState => {
  switch (action.type) {
    case DELIVERY_METHODS_ADD_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
        item: null,
      };
    case DELIVERY_METHODS_ADD_SUCCESS: {
      const current = state.allDeliveryMethods.find((item) => item.uid === action.item.uid);

      return {
        ...state,
        loading: false,
        item: action.item,
        allDeliveryMethods: state.allDeliveryMethods.map((item) =>
          item.uid === current.uid ? action.item : item
        ),
      };
    }
    case DELIVERY_METHODS_ADD_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case DELIVERY_METHODS_ALL_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELIVERY_METHODS_ALL_SUCCESS:
      return {
        ...state,
        loading: false,
        allDeliveryMethods: action.items,
      };
    case DELIVERY_METHODS_ALL_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default deliveryMethodsReducer;
