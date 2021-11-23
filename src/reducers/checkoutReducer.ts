import { AnyAction } from "redux";

import {
  CHECKOUT_SELECT_DELIVERY_ADDRESS,
  CHECKOUT_SELECT_PAYMENT_METHOD,
} from "@/actions/checkoutActions";
import { Address, Card } from "@/types/commonapi";

export type PaymentMethods = "cash" | "bankcard";

export interface ICheckoutState {
  selectedPaymentMethod?: PaymentMethods;
  selectedPaymentCard?: Card;
  selectedDeliveryAddress?: Address;
}

const initialState: ICheckoutState = {};

const checkoutReducer = (state = initialState, action: AnyAction): ICheckoutState => {
  switch (action.type) {
    case CHECKOUT_SELECT_PAYMENT_METHOD: {
      return {
        ...state,
        selectedPaymentMethod: action.method,
        selectedPaymentCard: action.paymentCard,
      };
    }
    case CHECKOUT_SELECT_DELIVERY_ADDRESS: {
      return {
        ...state,
        selectedDeliveryAddress: action.address,
      };
    }
    default: {
      return state;
    }
  }
};

export default checkoutReducer;
