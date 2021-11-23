import { IProduct } from "@/reducers/productReducer";
import { client, paymentapiURL } from "@/axios";
import {
  OrderWsControllerApi,
  PaymentApiOrder,
  CreditCardPaymentWsControllerApi,
  EWalletPaymentWsControllerApi,
  EWalletPaymentRequest,
  ProductOrder,
} from "@/types/paymentapi";
import { IApplicationStore } from "@/store/rootReducer";
import { generateToken } from "@/utils";
import { SavedCard } from "@/reducers/paymentCardsReducer";
import { PaymentMethods } from "@/reducers/checkoutReducer";
import { Address } from "@/types/commonapi";
import { handleResponseAndThrowAnErrorIfExists } from "@/error-handler";

import { loadProductDetails } from "./productCreateActions";
import { loadMyCurrencies } from "./myCurrenciesActions";

export const ORDERS_PROMO_ORDER_CREATING = "ORDERS_PROMO_ORDER_CREATING";
export const ORDERS_PROMO_ORDER_CREATING_SUCCESS = "ORDERS_PROMO_ORDER_CREATING_SUCCESS";
export const ORDERS_PROMO_ORDER_CREATING_ERROR = "ORDERS_PROMO_ORDER_CREATING_ERROR";

export const ORDERS_PRODUCTS_ORDER_CREATING = "ORDERS_PRODUCTS_ORDER_CREATING";
export const ORDERS_PRODUCTS_ORDER_CREATING_SUCCESS = "ORDERS_PRODUCTS_ORDER_CREATING_SUCCESS";
export const ORDERS_PRODUCTS_ORDER_CREATING_ERROR = "ORDERS_PRODUCTS_ORDER_CREATING_ERROR";

export const ORDERS_LOADING = "ORDERS_LOADING";
export const ORDERS_LOADING_SUCCESS = "ORDERS_LOADING_SUCCESS";
export const ORDERS_LOADING_ERROR = "ORDERS_LOADING_ERROR";

export const ORDER_DETAILS_SUCCESS = "ORDER_DETAILS_SUCCESS";

export const CHANGE_ORDER_STATUS_LOADING = "CHANGE_ORDER_STATUS_LOADING";
export const CHANGE_ORDER_STATUS_SUCCESS = "CHANGE_ORDER_STATUS_SUCCESS";
export const CHANGE_ORDER_STATUS_ERROR = "CHANGE_ORDER_STATUS_ERROR";
export const ORDER_RESET = "ORDER_RESET";

const ordersPromoOrderCreating = () => ({
  type: ORDERS_PROMO_ORDER_CREATING,
});

const ordersPromoOrderCreatingSuccess = (order: PaymentApiOrder) => ({
  type: ORDERS_PROMO_ORDER_CREATING_SUCCESS,
  order,
});

const ordersPromoOrderCreatingError = (error) => ({
  type: ORDERS_PROMO_ORDER_CREATING_ERROR,
  error,
});

const ordersProductsOrderCreating = () => ({
  type: ORDERS_PRODUCTS_ORDER_CREATING,
});

const ordersProductsOrderCreatingSuccess = (order: PaymentApiOrder) => ({
  type: ORDERS_PRODUCTS_ORDER_CREATING_SUCCESS,
  order,
});

const ordersProductsOrderCreatingError = (error) => ({
  type: ORDERS_PRODUCTS_ORDER_CREATING_ERROR,
  error,
});

const ordersLoadingAction = () => ({
  type: ORDERS_LOADING,
});

const ordersLoadingSuccessAction = (orders: ProductOrder[], groupByDate: boolean) => ({
  type: ORDERS_LOADING_SUCCESS,
  orders,
  groupByDate,
});

const ordersLoadingErrorAction = (error: unknown) => ({
  type: ORDERS_LOADING_ERROR,
  error,
});

const orderDetailsAction = (order: ProductOrder) => ({
  type: ORDER_DETAILS_SUCCESS,
  order,
});

const orderReset = () => ({
  type: ORDER_RESET,
});

interface IPaymentApiOrder {
  successUrl?: string;
}

export const createOrder = async (item: IProduct): Promise<IPaymentApiOrder> => {
  const { uid } = item;
  const postData = { productUid: uid, quantity: 1 };
  return await (
    await client.post(paymentapiURL + "/order/product/create", postData)
  ).data;
};

export const createPromotionOrder =
  (
    feature: string,
    _featureCurrency: string,
    productUid: string,
    options: {
      cardUid?: string;
      cvc?: string;
      walletUid?: string;
      source: "card" | "wallet";
    },
    savedCard?: SavedCard
  ) =>
  async (dispatch, getState: () => IApplicationStore) => {
    dispatch(ordersPromoOrderCreating());

    const { source, cardUid, cvc } = options;
    const state = getState();
    const wallet = state.myCurrenciesReducer.currencies.filter((item) => item.primary)[0];

    setTimeout(async () => {
      try {
        const createOrderUsingPOST3Result =
          await new OrderWsControllerApi().createProductFeatureOrderUsingPOST({
            feature,
            productUid,
            currencyCode: wallet.currency.code,
          });
        handleResponseAndThrowAnErrorIfExists(createOrderUsingPOST3Result);
        const { order } = createOrderUsingPOST3Result;

        switch (source) {
          case "card": {
            const card =
              savedCard ||
              state.paymentCardsReducer.cards.filter((item) => item.uid === cardUid)[0];

            /* TODO */
            const token = await generateToken({
              cardNumber: null,
              cvv: cvc,
              cardHolder: null,
              expMonth: null,
              expYear: null,
              ...card,
            });

            const data = {
              orderUid: order.uid,
              amount: order.amountTotal,
              currencyCode: order.currencyCode,
              paymentMethod: "bankcard",
              token,
              saveCard: savedCard ? savedCard.saveCard : true,
            };

            if (order.seller.email) {
              data["email"] = order.seller.email;
            } else if (order.seller.phone) {
              data["phone"] = order.seller.phone;
            }
            const paymentUsingPOST1Result =
              await new CreditCardPaymentWsControllerApi().paymentUsingPOST1(data);

            handleResponseAndThrowAnErrorIfExists(paymentUsingPOST1Result);
            break;
          }
          case "wallet": {
            const data: EWalletPaymentRequest = {
              orderUid: order.uid,
              amount: order.amountTotal,
              currencyCode: order.currencyCode,
              paymentMethod: "wallet",
            };

            if (order.seller.email) {
              data["email"] = order.seller.email;
            } else if (order.seller.phone) {
              data["phone"] = order.seller.phone;
            }

            const paymentUsingPOST2Result =
              await new EWalletPaymentWsControllerApi().paymentUsingPOST2(data);

            handleResponseAndThrowAnErrorIfExists(paymentUsingPOST2Result);
            dispatch(loadMyCurrencies());
            break;
          }
        }

        dispatch(loadProductDetails(productUid));
        dispatch(ordersPromoOrderCreatingSuccess(order));
      } catch (err) {
        console.error("at ordersActions in createPromotionOrder", err);

        dispatch(ordersPromoOrderCreatingError(err.toString()));
      }
    }, 2000);
  };

export const createProductsPurchaseOrder =
  (
    paymentMethod: PaymentMethods,
    deliveryAddress: Address,
    products: {
      productUid: string;
      count: number;
    }[],
    options: {
      cardUid?: string;
      cvc?: string;
    },
    savedCard?: SavedCard
  ) =>
  async (dispatch, getState: () => IApplicationStore) => {
    dispatch(ordersProductsOrderCreating());

    const state = getState();
    const profile = state.sessionReducer.profile;

    try {
      const createProductsPurchaseOrderUsingPOSTResult =
        await new OrderWsControllerApi().createProductsPurchaseOrderUsingPOST({
          deliveryAddress: {
            countryCode: deliveryAddress.country.code,
            city: deliveryAddress.city,
            firstAddressLine: deliveryAddress.firstAddressLine,
            postalCode: deliveryAddress.postalCode,
            secondAddressLine: deliveryAddress.secondAddressLine,
            state: deliveryAddress.state,
          },
          products: products.map((item) => {
            return {
              productUid: item.productUid,
              quantity: item.count,
            };
          }),
        });
      handleResponseAndThrowAnErrorIfExists(createProductsPurchaseOrderUsingPOSTResult);
      const { order } = createProductsPurchaseOrderUsingPOSTResult;

      if (paymentMethod === "bankcard") {
        const { cardUid, cvc } = options;
        // ! WAS: const card = savedCard || state.paymentCardsReducer.cards.filter((item) => item.uid === cardUid)[0];
        const card = state.paymentCardsReducer.cards.find((item) => item.uid === cardUid);

        // ! WAS: let token = card.uid.includes("_temporary") && card.token ? card.token : null;
        let token = savedCard && savedCard.uid.includes("_temporary") ? savedCard.token : null;

        if (!token) {
          token = await generateToken({
            cardNumber: null,
            cvv: cvc,
            cardHolder: null,
            expMonth: null,
            expYear: null,
            ...card,
          });
        }

        const bankCardPaymentOptions = {
          orderUid: order.uid,
          amount: order.amountTotal,
          currencyCode: order.currencyCode,
          paymentMethod: "bankcard",
          token,
          saveCard: savedCard ? savedCard.saveCard : false,
        };

        const primaryEmail = profile.accountEmails
          ? profile.accountEmails.filter((item) => item.primary)[0]
          : null;
        if (primaryEmail) {
          bankCardPaymentOptions["email"] = primaryEmail.email;
        } else {
          const secondaryEmail = profile.accountEmails ? profile.accountEmails[0] : null;
          if (secondaryEmail) {
            bankCardPaymentOptions["email"] = secondaryEmail.email;
          } else {
            const primaryPhone = profile.accountPhones
              ? profile.accountPhones.filter((item) => item.primary)[0]
              : null;
            if (primaryPhone) {
              bankCardPaymentOptions["phone"] = primaryPhone.number;
            }
          }
        }

        const bankCardPaymentUsingPOSTResult =
          await new CreditCardPaymentWsControllerApi().paymentUsingPOST1(bankCardPaymentOptions);
        handleResponseAndThrowAnErrorIfExists(bankCardPaymentUsingPOSTResult);
      }

      dispatch(ordersProductsOrderCreatingSuccess(order));
      //dispatch(cartClear(true));
    } catch (err) {
      console.error("at ordersActions in createProductsPurchaseOrder", err);

      dispatch(ordersProductsOrderCreatingError(err));
    }
  };

export const loadOrders = () => async (dispatch, getState: () => IApplicationStore) => {
  dispatch(ordersLoadingAction());
  try {
    const state = getState();
    const language = state.rootReducer.language;

    const result = await new OrderWsControllerApi().getProductOrderListUsingGET(
      true,
      language,
      null,
      null,
      false
    );
    handleResponseAndThrowAnErrorIfExists(result);

    const items = result.orderList || [];
    //const items = require('@/static/mock/orders.json');
    dispatch(ordersLoadingSuccessAction(items, false));
  } catch (error) {
    dispatch(ordersLoadingErrorAction(error.toString()));
  }
};

export const selectOrder = (order: ProductOrder) => async (dispatch) => {
  dispatch(orderDetailsAction(order));
};

export const changeOrderStatus =
  (uid: string, statusExtended?: string) => async (dispatch, getState: () => IApplicationStore) => {
    dispatch({
      type: CHANGE_ORDER_STATUS_LOADING,
    });

    try {
      const state = getState();
      const result = await new OrderWsControllerApi().setProductOrderStatusUsingPOST(
        {
          uid,
          statusExtended,
        },
        state.rootReducer.language
      );

      handleResponseAndThrowAnErrorIfExists(result);

      dispatch({
        type: CHANGE_ORDER_STATUS_SUCCESS,
        order: result.orderList[0],
      });

      dispatch(loadOrders());
    } catch (error) {
      console.error("at ordersActions in changeOrderStatus", error);

      dispatch({
        type: CHANGE_ORDER_STATUS_ERROR,
        error: error.toString(),
      });
    }
  };

export const resetOrder = () => (dispatch) => {
  dispatch(orderReset());
};
