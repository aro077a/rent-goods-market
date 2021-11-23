import { WalletWsControllerApi } from "@/types/commonapi";
import { handleResponseAndThrowAnErrorIfExists } from "@/error-handler";
import { AppDispatch } from "@/hooks/store";

import { throwIsHasErrorData } from "./paymentCardsActions";

export const MY_CURRENCIES_LIST_LOADING = "MY_CURRENCIES_LIST_LOADING";
export const MY_CURRENCIES_LIST_SUCCESS = "MY_CURRENCIES_LIST_SUCCESS";
export const MY_CURRENCIES_LIST_ERROR = "MY_CURRENCIES_LIST_ERROR";

const MyCurrenciesListLoadingAction = () => ({
  type: MY_CURRENCIES_LIST_LOADING,
});

const MyCurrenciesListSuccessAction = (items: any[]) => ({
  type: MY_CURRENCIES_LIST_SUCCESS,
  items,
});

const MyCurrenciesListErrorAction = (error: string) => ({
  type: MY_CURRENCIES_LIST_ERROR,
  error,
});

export const loadMyCurrencies = () => async (dispatch: AppDispatch) => {
  dispatch(MyCurrenciesListLoadingAction());
  try {
    const res = await new WalletWsControllerApi().getAccountWalletUsingPOST({});
    throwIsHasErrorData(res);
    // handleResponseAndThrowAnErrorIfExists(res);
    dispatch(MyCurrenciesListSuccessAction(res.walletList));
  } catch (err) {
    console.error("at myCurrenciesActions in loadMyCurrencies");

    dispatch(MyCurrenciesListErrorAction(err.toString()));
  }
};

export const addCurrency = (currencyCode: string) => async (dispatch: AppDispatch) => {
  dispatch(MyCurrenciesListLoadingAction());
  try {
    const res = await new WalletWsControllerApi().createWalletUsingPOST({
      currencyCode,
    });
    handleResponseAndThrowAnErrorIfExists(res);

    const items = res.walletList || [];
    dispatch(MyCurrenciesListSuccessAction(items));
  } catch (err) {
    console.error("at myCurrenciesActions in addCurrency");

    dispatch(MyCurrenciesListErrorAction(err.toString()));
  }
};

export const setWalletAsPrimary = (uid: string) => async (dispatch: AppDispatch) => {
  dispatch(MyCurrenciesListLoadingAction());
  try {
    const res = await new WalletWsControllerApi().setWalletAsPrimaryUsingPOST({
      uid,
    });
    handleResponseAndThrowAnErrorIfExists(res);

    const items = res.walletList || [];
    dispatch(MyCurrenciesListSuccessAction(items));
  } catch (err) {
    console.error("at myCurrenciesActions in setWalletAsPrimary");

    dispatch(MyCurrenciesListErrorAction(err.toString()));
  }
};

export const disableWallet = (uid: string) => async (dispatch: AppDispatch) => {
  dispatch(MyCurrenciesListLoadingAction());
  try {
    const res = await new WalletWsControllerApi().disableWalletUsingPOST({
      uid,
    });
    handleResponseAndThrowAnErrorIfExists(res);
    dispatch(MyCurrenciesListSuccessAction(res.walletList));
  } catch (err) {
    console.error("at myCurrenciesActions in disableWallet");

    dispatch(MyCurrenciesListErrorAction(err.toString()));
  }
};

export const removeWallet = (uid: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(MyCurrenciesListLoadingAction());
  } catch (err) {
    console.error("at myCurrenciesActions in removeWallet");

    dispatch(MyCurrenciesListErrorAction(err.toString()));
  }
};
