import { client, commonapiURL } from "../axios";

export const CURRENCY_LIST_LOADING = "CURRENCY_LIST_LOADING";
export const CURRENCY_LIST_LOADING_SUCCESS = "CURRENCY_LIST_LOADING_SUCCESS";
export const CURRENCY_LIST_LOADING_ERROR = "CURRENCY_LIST_LOADING_ERROR";

export const loadCurrencies = () => async (dispatch: any) => {
  dispatch(currencyListLoadingAction());
  try {
    const currencies: any[] = await (
      await client.get(
        commonapiURL + "/classificator/Currency?type=S&active=true&test=false"
      )
    ).data.currencyList;
    dispatch(currencyListLoadingSuccessAction(currencies));
  } catch (err) {
    dispatch(currencyListLoadingErrorAction(err.toString()));
  }
};

const currencyListLoadingAction = () => ({
  type: CURRENCY_LIST_LOADING,
});

const currencyListLoadingSuccessAction = (currencies: any[]) => ({
  type: CURRENCY_LIST_LOADING_SUCCESS,
  currencies,
});

const currencyListLoadingErrorAction = (error: any) => ({
  type: CURRENCY_LIST_LOADING_ERROR,
  error,
});
