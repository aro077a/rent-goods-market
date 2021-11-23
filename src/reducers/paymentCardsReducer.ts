import { AnyAction } from "redux";

import {
  PAYMENT_CARD_DELETING,
  PAYMENT_CARD_DELETING_ERROR,
  PAYMENT_CARD_DELETING_SUCCESS,
  PAYMENT_CARD_LIST_LOADING,
  PAYMENT_CARD_LIST_LOADING_ERROR,
  PAYMENT_CARD_LIST_LOADING_SUCCESS,
  PAYMENT_CARD_SAVING,
  PAYMENT_CARD_SAVING_ERROR,
  PAYMENT_CARD_SAVING_SUCCESS,
  PAYMENT_CARD_SAVING_TEMPORARY_SUCCESS,
  PAYMENT_CARD_SELECT_FOR_PAYMENT,
  PAYMENT_CARD_SELECT_FOR_PAYMENT_ERROR,
  PAYMENT_CARD_SELECT_FOR_PAYMENT_SUCCESS,
  PAYMENT_CARD_VERIFY_ERROR,
  PAYMENT_CARD_VERIFY_LOADING,
  PAYMENT_CARD_VERIFY_SUCCESS,
} from "@/actions/paymentCardsActions";
import { Card } from "@/types/commonapi";

export type SavedCard = Pick<
  Card,
  "cardHolder" | "expMonth" | "expYear" | "uid" | "maskedNumber"
> & {
  cardNumber: string;
  cvv: string;
  saveCard?: boolean;
  token?: string;
};

export interface IPaymentCardsState {
  loading: boolean;
  loaded: boolean;
  error: unknown;
  cards: Card[];
  saveCardLoading: boolean;
  saveCardError: unknown;
  savedCard: SavedCard;
  deleteCardLoading?: boolean;
  deleteCardError?: unknown;
  selectForPaymentLoading?: boolean;
  selectForPaymentError?: unknown;
  verifyCreditCardLoading?: boolean;
  verifyCreditCardError?: unknown;
}

const initialState: IPaymentCardsState = {
  loading: false,
  loaded: false,
  error: null,
  cards: [],
  saveCardLoading: false,
  saveCardError: null,
  savedCard: null,
  deleteCardLoading: false,
  deleteCardError: null,
  selectForPaymentLoading: false,
  selectForPaymentError: null,
  verifyCreditCardLoading: false,
  verifyCreditCardError: null,
};

const paymentCardsReducer = (state = initialState, action: AnyAction): IPaymentCardsState => {
  switch (action.type) {
    case PAYMENT_CARD_LIST_LOADING:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case PAYMENT_CARD_LIST_LOADING_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        cards: action.cards,
      };
    case PAYMENT_CARD_LIST_LOADING_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case PAYMENT_CARD_SAVING:
      return {
        ...state,
        saveCardLoading: true,
        saveCardError: null,
        savedCard: null,
      };
    case PAYMENT_CARD_SAVING_SUCCESS: {
      const { card } = action;
      const { cards } = state;
      return {
        ...state,
        cards: [...cards.filter((item) => !item.uid.includes("_temporary")), card],
        saveCardLoading: false,
        savedCard: action.card,
      };
    }
    case PAYMENT_CARD_SAVING_ERROR:
      return {
        ...state,
        saveCardLoading: false,
        saveCardError: action.error,
      };
    case PAYMENT_CARD_DELETING:
      return {
        ...state,
        deleteCardLoading: true,
        deleteCardError: null,
      };
    case PAYMENT_CARD_DELETING_SUCCESS:
      return {
        ...state,
        deleteCardLoading: false,
        cards: state.cards.filter((item) => item.uid !== action.uid),
      };
    case PAYMENT_CARD_DELETING_ERROR:
      return {
        ...state,
        deleteCardLoading: false,
        deleteCardError: action.error,
      };
    case PAYMENT_CARD_SELECT_FOR_PAYMENT:
      return {
        ...state,
        selectForPaymentLoading: true,
        selectForPaymentError: null,
      };
    case PAYMENT_CARD_SELECT_FOR_PAYMENT_SUCCESS: {
      const { uid } = action;
      return {
        ...state,
        selectForPaymentLoading: false,
        cards: state.cards.map((item) => {
          return { ...item, primary: item.uid === uid };
        }),
      };
    }
    case PAYMENT_CARD_SELECT_FOR_PAYMENT_ERROR:
      return {
        ...state,
        selectForPaymentLoading: false,
        selectForPaymentError: action.error,
      };
    case PAYMENT_CARD_VERIFY_LOADING:
      return {
        ...state,
        verifyCreditCardLoading: true,
        verifyCreditCardError: null,
      };
    case PAYMENT_CARD_VERIFY_SUCCESS:
      return {
        ...state,
        verifyCreditCardLoading: false,
        cards: action.cardList,
      };
    case PAYMENT_CARD_VERIFY_ERROR:
      return {
        ...state,
        verifyCreditCardLoading: false,
        verifyCreditCardError: action.error,
      };
    case PAYMENT_CARD_SAVING_TEMPORARY_SUCCESS: {
      const { card } = action;
      const { cards } = state;

      return {
        ...state,
        cards: [...cards.filter((item) => !item.uid.includes("temporary")), card],
      };
    }
    default:
      return state;
  }
};

export default paymentCardsReducer;
