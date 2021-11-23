import * as Sentry from "@sentry/browser";

import {
  OrderWsControllerApi,
  Card,
  CardWsControllerApi,
  CreditCardWsControllerApi,
  ErrorData,
  SettingsWsControllerApi,
  Account,
} from "@/types/commonapi";
import { SavedCard } from "@/reducers/paymentCardsReducer";
import { IApplicationStore } from "@/store/rootReducer";
import { Profile } from "@/reducers/sessionReducer";
import { CreditCardPaymentWsControllerApi } from "@/types/paymentapi";
import { createUUID, generateToken } from "@/utils";
import { handleResponseAndThrowAnErrorIfExists } from "@/error-handler";

export const PAYMENT_CARD_LIST_LOADING = "PAYMENT_CARD_LIST_LOADING";
export const PAYMENT_CARD_LIST_LOADING_SUCCESS = "PAYMENT_CARD_LIST_LOADING_SUCCESS";
export const PAYMENT_CARD_LIST_LOADING_ERROR = "PAYMENT_CARD_LIST_LOADING_ERROR";

export const PAYMENT_CARD_SAVING = "PAYMENT_CARD_SAVING";
export const PAYMENT_CARD_SAVING_SUCCESS = "PAYMENT_CARD_SAVING_SUCCESS";
export const PAYMENT_CARD_SAVING_TEMPORARY_SUCCESS = "PAYMENT_CARD_SAVING_TEMPORARY_SUCCESS";
export const PAYMENT_CARD_SAVING_ERROR = "PAYMENT_CARD_SAVING_ERROR";

export const PAYMENT_CARD_DELETING = "PAYMENT_CARD_DELETING";
export const PAYMENT_CARD_DELETING_SUCCESS = "PAYMENT_CARD_DELETING_SUCCESS";
export const PAYMENT_CARD_DELETING_ERROR = "PAYMENT_CARD_DELETING_ERROR";

export const PAYMENT_CARD_SELECT_FOR_PAYMENT = "PAYMENT_CARD_SELECT_FOR_PAYMENT";
export const PAYMENT_CARD_SELECT_FOR_PAYMENT_SUCCESS = "PAYMENT_CARD_SELECT_FOR_PAYMENT_SUCCESS";
export const PAYMENT_CARD_SELECT_FOR_PAYMENT_ERROR = "PAYMENT_CARD_SELECT_FOR_PAYMENT_ERROR";

export const PAYMENT_CARD_VERIFY_LOADING = "PAYMENT_CARD_VERIFY_LOADING";
export const PAYMENT_CARD_VERIFY_SUCCESS = "PAYMENT_CARD_VERIFY_SUCCESS";
export const PAYMENT_CARD_VERIFY_ERROR = "PAYMENT_CARD_VERIFY_ERROR";

const paymentCardListListLoadingAction = () => ({
  type: PAYMENT_CARD_LIST_LOADING,
});

const paymentCardListListLoadingSuccessAction = (cards: Card[]) => ({
  type: PAYMENT_CARD_LIST_LOADING_SUCCESS,
  cards,
});

const paymentCardListListLoadingErrorAction = (error: unknown) => ({
  type: PAYMENT_CARD_LIST_LOADING_ERROR,
  error,
});

const paymentCardSavingAction = () => ({
  type: PAYMENT_CARD_SAVING,
});

const paymentCardSavingSuccessAction = (card: SavedCard) => ({
  type: PAYMENT_CARD_SAVING_SUCCESS,
  card,
});

const paymentCardSavingTemporarySuccessAction = (card: SavedCard) => ({
  type: PAYMENT_CARD_SAVING_TEMPORARY_SUCCESS,
  card,
});

const paymentCardSavingErrorAction = (error: unknown) => ({
  type: PAYMENT_CARD_SAVING_ERROR,
  error,
});

const paymentCardDeletingAction = () => ({
  type: PAYMENT_CARD_DELETING,
});

const paymentCardDeletingSuccessAction = (uid: string) => ({
  type: PAYMENT_CARD_DELETING_SUCCESS,
  uid,
});

const paymentCardDeletingErrorAction = (error: unknown) => ({
  type: PAYMENT_CARD_DELETING_ERROR,
  error,
});

const paymentCardSelectForPaymentAction = () => ({
  type: PAYMENT_CARD_SELECT_FOR_PAYMENT,
});

const paymentCardSelectForPaymentSuccessAction = (uid: string) => ({
  type: PAYMENT_CARD_SELECT_FOR_PAYMENT_SUCCESS,
  uid,
});

const paymentCardSelectForPaymentErrorAction = (error: unknown) => ({
  type: PAYMENT_CARD_SELECT_FOR_PAYMENT_ERROR,
  error,
});

const verifyCreditCardLoadingAction = () => ({
  type: PAYMENT_CARD_VERIFY_LOADING,
});

const verifyCreditCardSuccessAction = (cardList: Card[]) => ({
  type: PAYMENT_CARD_VERIFY_SUCCESS,
  cardList,
});

const verifyCreditCardErrorAction = (error: unknown) => ({
  type: PAYMENT_CARD_VERIFY_ERROR,
  error,
});

interface IErrorData {
  errorData?: ErrorData;
  warningData?: ErrorData;
}

interface ISellerPhoneEmail {
  email?: string;
  phone?: {
    countryCode: string;
    number: string;
  };
}

export const throwIsHasErrorData = (response: IErrorData) => {
  let errorText: string;
  const { errorData, warningData } = response;
  if (errorData && errorData.errorCode) {
    errorText = `${errorData.errorMessage} (${errorData.errorCode})`;
  } else if (warningData && warningData.errorCode) {
    errorText = `${errorData.errorMessage} (${errorData.errorCode})`;
  }
  const error = new Error(errorText);
  Sentry.captureException(error);
  if (errorText) throw error;
};

const getAmountForCardLinking = async (currencyCode: string) => {
  return parseInt(
    (
      await new SettingsWsControllerApi().getSettingsUsingPOST({
        settingsNames: [`LinkCard_Amount_${currencyCode.toUpperCase()}`],
      })
    ).settings[0].value
  );
};

export const loadPaymentCardsList = () => async (dispatch) => {
  dispatch(paymentCardListListLoadingAction());
  try {
    const response = await new CardWsControllerApi().getAccountCreditCardListUsingPOST();
    handleResponseAndThrowAnErrorIfExists(response);

    dispatch(paymentCardListListLoadingSuccessAction(response.cardList || []));
  } catch (err) {
    console.error("at paymentCardsActions in getAmountCardLinking");

    dispatch(paymentCardListListLoadingErrorAction(err.toString()));
  }
};

export const createSeller = (profile: Profile) => {
  const seller: ISellerPhoneEmail = {};
  const primaryEmail = profile.accountEmails && profile.accountEmails.filter((e) => e.primary)[0];
  const primaryPhone = profile.accountPhones && profile.accountPhones.filter((p) => p.primary)[0];
  if (primaryEmail) {
    seller.email = primaryEmail.email;
  } else {
    seller.phone = {
      countryCode: primaryPhone.countryCode,
      number: primaryPhone.number,
    };
  }
  return seller;
};

const createCardNumberMask = (card: SavedCard) => {
  const { cardNumber } = card;
  return cardNumber.substr(0, 6) + "******" + cardNumber.substr(cardNumber.length - 4, 4);
};

const createLinkCardOrder = async (amountTotal: number, currencyCode: string, seller: Account) =>
  (
    await new OrderWsControllerApi().createLinkCardOrderUsingPOST({
      order: {
        amountTotal,
        currencyCode,
        seller,
      },
    })
  ).order;

export const savePaymentCard =
  (card: SavedCard, withOrder = true) =>
  async (dispatch, getState: () => IApplicationStore) => {
    dispatch(paymentCardSavingAction());

    try {
      const state = getState();
      const seller = createSeller(state.sessionReducer.profile);
      const currency = state.myCurrenciesReducer.currencies.filter((item) => item.primary)[0];

      const token = await generateToken(card);

      if (!card.uid) {
        card.uid = createUUID() + "_temporary";
        card.maskedNumber = createCardNumberMask(card);
      }

      card.token = token;

      if (withOrder) {
        const amount = await getAmountForCardLinking(currency.currency.code);
        const order = await createLinkCardOrder(amount, currency.currency.code, seller);

        if (!order || !order.uid) {
          throw new Error("Order was not created");
        }

        const data = {
          orderUid: order.uid,
          amount: order.amountTotal,
          currencyCode: order.currencyCode,
          paymentMethod: "bankcard",
          token,
          saveCard: card.saveCard,
        };

        if (order.seller.email) {
          data["email"] = order.seller.email;
        } else if (order.seller.phone) {
          data["phone"] = order.seller.phone;
        }

        const res = await new CreditCardPaymentWsControllerApi().paymentUsingPOST1(data);
        handleResponseAndThrowAnErrorIfExists(res);
        dispatch(loadPaymentCardsList());
      }

      dispatch(paymentCardSavingSuccessAction(card));
    } catch (err) {
      console.error("at paymentCardsActions in savePaymentCard", err);

      dispatch(paymentCardSavingErrorAction(err.toString()));
    }
  };

export const savePaymentCardTemporary = (card: SavedCard) => async (dispatch) => {
  /* TODO */
  if (!card.uid) {
    card.uid = createUUID() + "_temporary";
  }

  if (!card.maskedNumber && card.cardNumber) {
    card.maskedNumber = createCardNumberMask(card);
  }

  dispatch(paymentCardSavingTemporarySuccessAction(card));
};

export const deletePaymentCard = (uid: string) => async (dispatch) => {
  dispatch(paymentCardDeletingAction());
  try {
    const res = await new CreditCardWsControllerApi().deleteUsingPOST2({
      creditCardUid: uid,
    });
    handleResponseAndThrowAnErrorIfExists(res);
    dispatch(paymentCardDeletingSuccessAction(uid));
  } catch (err) {
    console.error("at paymentCardsActions in createCardNumberMask", err);

    dispatch(paymentCardDeletingErrorAction(err.toString()));
  }
};

export const selectForPayment = (uid: string) => async (dispatch) => {
  dispatch(paymentCardSelectForPaymentAction());
  try {
    const res = await new CreditCardWsControllerApi().setAsPrimaryUsingPOST1({
      creditCardUid: uid,
    });
    handleResponseAndThrowAnErrorIfExists(res);
    dispatch(paymentCardSelectForPaymentSuccessAction(uid));
  } catch (err) {
    console.error("at paymentCardsActions in selectForPayment", err);

    dispatch(paymentCardSelectForPaymentErrorAction(err.toString()));
  }
};

export const verifyCreditCard = (cardUid: string, verificationCode: string) => async (dispatch) => {
  dispatch(verifyCreditCardLoadingAction());
  try {
    const res = await new CardWsControllerApi().verifyCreditCardUsingPOST({
      cardUid,
      verificationCode,
    });
    handleResponseAndThrowAnErrorIfExists(res);
    const { cardList = [] } = res;
    dispatch(loadPaymentCardsList());
    dispatch(verifyCreditCardSuccessAction(cardList));
  } catch (err) {
    console.error("at paymentCardsActions in verifyCreditCard", err);

    dispatch(verifyCreditCardErrorAction(err.toString()));
  }
};
