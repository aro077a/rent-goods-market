import {
  ProductFeatureType,
  FeatureControllerApi,
  ProductControllerApi,
  Product,
} from "../types/marketplaceapi";
import { IApplicationStore } from "../store/rootReducer";
import { loadCurrencies } from "./currencyActions";
import {
  handleError,
  handleResponseAndThrowAnErrorIfExists,
} from "../error-handler";

export const SERVICE_PACKAGES_LOADING = "SERVICE_PACKAGES_LOADING";
export const SERVICE_PACKAGES_LOADING_SUCCESS =
  "SERVICE_PACKAGES_LOADING_SUCCESS";
export const SERVICE_PACKAGES_LOADING_ERROR = "SERVICE_PACKAGES_LOADING_ERROR";

export const PUBLISHED_PRODUCTS_LOADING = "PUBLISHED_PRODUCTS_LOADING";
export const PUBLISHED_PRODUCTS_LOADING_SUCCESS =
  "PUBLISHED_PRODUCTS_LOADING_SUCCESS";
export const PUBLISHED_PRODUCTS_LOADING_ERROR =
  "PUBLISHED_PRODUCTS_LOADING_ERROR";

export const loadServicePackages =
  () => async (dispatch: any, getState: () => IApplicationStore) => {
    dispatch(servicePackagesLoadingAction());

    const state = getState();

    try {
      const language = state.sessionReducer.profile.language.code;
      const currency = state.myCurrenciesReducer.currencies.length
        ? state.myCurrenciesReducer.currencies.filter((item) => item.primary)[0]
            .currency.code
        : "USD";

      const result =
        await new FeatureControllerApi().productFeatureListUsingGET(
          currency,
          language
        );

      handleResponseAndThrowAnErrorIfExists(result);

      const items = result.body || [];

      dispatch(servicePackagesLoadingSuccessAction(items));
    } catch (err) {
      dispatch(servicePackagesLoadingErrorAction(err.toString()));
    }
  };

export const loadPublishedProducts = () => async (dispatch: any) => {
  dispatch({ type: PUBLISHED_PRODUCTS_LOADING });
  try {
    const result = await new ProductControllerApi().productListUsingPOST({
      status: Product.StatusEnum.PBL.toString(),
    });

    handleResponseAndThrowAnErrorIfExists(result);

    const items = result.body || [];
    dispatch({ type: PUBLISHED_PRODUCTS_LOADING_SUCCESS, items });
  } catch (err) {
    dispatch({ type: PUBLISHED_PRODUCTS_LOADING_ERROR, error: err.toString() });
  }
};

const servicePackagesLoadingAction = () => ({
  type: SERVICE_PACKAGES_LOADING,
});

const servicePackagesLoadingSuccessAction = (items: ProductFeatureType[]) => ({
  type: SERVICE_PACKAGES_LOADING_SUCCESS,
  items,
});

const servicePackagesLoadingErrorAction = (error: any) => ({
  type: SERVICE_PACKAGES_LOADING_ERROR,
  error,
});
