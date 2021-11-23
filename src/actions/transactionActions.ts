import { IApplicationStore } from "../store/rootReducer";
import { TransactionWsControllerApi, Transaction } from "../types/commonapi";
import {
  handleError,
  handleResponseAndThrowAnErrorIfExists,
} from "../error-handler";

export const TRANSACTIONS_LOADING = "TRANSACTIONS_LOADING";
export const TRANSACTIONS_LOADING_SUCCESS = "TRANSACTIONS_LOADING_SUCCESS";
export const TRANSACTIONS_LOADING_ERROR = "TRANSACTIONS_LOADING_ERROR";

export const loadTransactions =
  (groupByDate = false) =>
  async (dispatch: any, getState: () => IApplicationStore) => {
    dispatch(transactionsLoadingAction());
    const state = getState();
    try {
      const result =
        await new TransactionWsControllerApi().getTransactionListUsingPOST1({
          // TODO: update API
          // @ts-ignore
          language: state.rootReducer.language,
        });

      handleResponseAndThrowAnErrorIfExists(result);

      const items = result.transactionList || [];
      dispatch(transactionsLoadingSuccessAction(items, groupByDate));
    } catch (error) {
      dispatch(transactionsLoadingErrorAction(error.toString()));
    }
  };

const transactionsLoadingAction = () => ({
  type: TRANSACTIONS_LOADING,
});

const transactionsLoadingSuccessAction = (
  transactions: Transaction[],
  groupByDate: boolean
) => ({
  type: TRANSACTIONS_LOADING_SUCCESS,
  transactions,
  groupByDate,
});

const transactionsLoadingErrorAction = (error: any) => ({
  type: TRANSACTIONS_LOADING_ERROR,
  error,
});
