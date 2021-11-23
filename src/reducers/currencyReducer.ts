import { AnyAction } from "redux";
import {
  CURRENCY_LIST_LOADING_ERROR,
  CURRENCY_LIST_LOADING,
  CURRENCY_LIST_LOADING_SUCCESS,
} from "../actions/currencyActions";

export interface ICurrencyClassificator {
  code: string;
  symbol: string;
  description: string;
  base: boolean;
  test: boolean;
  active: boolean;
  type: string;
}

export interface ICurrencyClassificatorState {
  currencies: ICurrencyClassificator[];
}

const initialState: ICurrencyClassificatorState = {
  currencies: [],
};

const currencyReducer = (
  state = initialState,
  action: AnyAction
): ICurrencyClassificatorState => {
  switch (action.type) {
    case CURRENCY_LIST_LOADING:
      return {
        ...state,
      };
    case CURRENCY_LIST_LOADING_SUCCESS:
      const { currencies } = action;
      return {
        ...state,
        currencies,
      };
    case CURRENCY_LIST_LOADING_ERROR:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default currencyReducer;
