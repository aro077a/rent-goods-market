import { AnyAction } from "redux";
import {
  MY_CURRENCIES_LIST_LOADING,
  MY_CURRENCIES_LIST_SUCCESS,
  MY_CURRENCIES_LIST_ERROR,
} from "../actions/myCurrenciesActions";
import { Wallet } from "../types/commonapi";

export interface IMyCurrenciesState {
  loading?: boolean;
  error?: any;
  currencies: Wallet[];
}

const initialState: IMyCurrenciesState = {
  currencies: [],
};

const myCurrenciesReducer = (
  state = initialState,
  action: AnyAction
): IMyCurrenciesState => {
  switch (action.type) {
    case MY_CURRENCIES_LIST_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case MY_CURRENCIES_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        currencies: action.items,
      };
    case MY_CURRENCIES_LIST_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default myCurrenciesReducer;
