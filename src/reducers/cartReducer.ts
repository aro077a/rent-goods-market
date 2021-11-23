import { AnyAction } from "redux";

import {
  // CART_ADD,
  // CART_REMOVE_BY_SELLER,
  // CART_UPDATE,
  // SELECT_FOR_PURCHASE,
  CART_CLEAR,
  CART_LOAD,
  CART_LOAD_ERROR,
  CART_LOAD_SUCCESS,
  CART_REMOVE,
  CART_SET_SELECTED,
} from "@/actions/cartActions";
import { CartItem } from "@/types/marketplaceapi";

export interface ICartState {
  isFetching: boolean;
  isUpdating: boolean;
  error?: unknown;
  items: CartItem[];
  selected: string[];
  discount: number;
  total: number;
  discountSelectedForPurchase: number;
  totalSelectedForPurchase: number;
}

const initialState: ICartState = {
  isFetching: false,
  isUpdating: false,
  items: [],
  selected: [],
  discount: 0,
  total: 0,
  discountSelectedForPurchase: 0,
  totalSelectedForPurchase: 0,
};

const cartReducer = (state = initialState, { type, payload }: AnyAction): ICartState => {
  switch (type) {
    case CART_LOAD: {
      return { ...state, isFetching: true };
    }
    // case CART_ADD: {
    //   const { items } = payload;
    //   return { ...state, items };
    // }
    // case CART_UPDATE: {
    //   return state;
    // }
    case CART_REMOVE: {
      const { uid } = payload;
      return {
        ...state,
        items: state.items.filter(({ itemUid }) => itemUid !== uid),
      };
    }
    case CART_LOAD_ERROR: {
      const { error } = payload;
      return { ...state, error, isFetching: false };
    }
    // case CART_REMOVE_BY_SELLER: {
    //   return state;
    // }
    case CART_CLEAR: {
      return initialState;
    }
    // case SELECT_FOR_PURCHASE: {
    //   return state;
    // }
    case CART_LOAD_SUCCESS: {
      const { items } = payload;
      return { ...state, items, isFetching: false };
    }
    case CART_SET_SELECTED: {
      const { selected } = payload;
      return { ...state, selected };
    }
    default:
      return state;
  }
};

export default cartReducer;
