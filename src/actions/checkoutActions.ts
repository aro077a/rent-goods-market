import { PaymentMethods } from "../reducers/checkoutReducer";
import { Address, Card } from "../types/commonapi";

export const CHECKOUT_SELECT_PAYMENT_METHOD = "CHECKOUT_SELECT_PAYMENT_METHOD";
export const CHECKOUT_SELECT_DELIVERY_ADDRESS =
  "CHECKOUT_SELECT_DELIVERY_ADDRESS";

export const selectPaymentMethod =
  (method: PaymentMethods, paymentCard?: Card) => (dispatch: any) => {
    dispatch({
      type: CHECKOUT_SELECT_PAYMENT_METHOD,
      method,
      paymentCard,
    });
  };

export const selectDeliveryAddress = (address: Address) => (dispatch: any) => {
  dispatch({
    type: CHECKOUT_SELECT_DELIVERY_ADDRESS,
    address,
  });
};
