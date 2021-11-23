import { AnyAction } from "redux";
import { Transaction as CTransaction } from "../types/commonapi";
import {
  TRANSACTIONS_LOADING,
  TRANSACTIONS_LOADING_SUCCESS,
  TRANSACTIONS_LOADING_ERROR,
} from "../actions/transactionActions";
import _, { times } from "lodash";

export interface Transaction extends CTransaction {
  transactionTime?: string;
  sellerPhone?: string;
  buyerPhone?: string;
  payerPhone?: string;
  transactionAmount?: number;
}

export interface ITransactionsState {
  loading?: boolean;
  error?: any;
  transactions: Transaction[];
}

const initialState: ITransactionsState = {
  transactions: [],
};

const transactionReducer = (
  state = initialState,
  action: AnyAction
): ITransactionsState => {
  switch (action.type) {
    case TRANSACTIONS_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case TRANSACTIONS_LOADING_SUCCESS: {
      let { transactions, groupByDate } = action;

      if (groupByDate) {
        transactions = _.chain(
          transactions.map((item: any) => {
            return {
              ...item,
              transactionTime: item.transactionDate,
              transactionDate: item.transactionDate.toString().substr(0, 8),
            };
          })
        )
          .groupBy("transactionDate")
          .value();
      }

      return {
        ...state,
        loading: false,
        transactions: transactions,
      };
    }
    case TRANSACTIONS_LOADING_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default transactionReducer;
