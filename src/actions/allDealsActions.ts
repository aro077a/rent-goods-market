import { handleResponseAndThrowAnErrorIfExists } from "@/error-handler";
import { IProduct } from "@/reducers/productReducer";
import { getCountryCodeFromState } from "@/selectors/getCountryCodeFromState";
import { IApplicationStore } from "@/store/rootReducer";
import { ProductControllerApi, PublicControllerApi } from "@/types/marketplaceapi";

import { ISearchParams, mapProductDetailsImage } from "./productActions";
import { isProductInWish } from "./profileActions";

export const ALL_DEALS_LOADING = "ALL_DEALS_LOADING";
export const ALL_DEALS_LOADING_SUCCESS = "ALL_DEALS_LOADING_SUCCESS";
export const ALL_DEALS_LOADING_ERROR = "ALL_DEALS_LOADING_ERROR";
export const ALL_DEALS_RELOAD = "ALL_DEALS_RELOAD";

const allDealsLoadingAction = () => ({
  type: ALL_DEALS_LOADING,
});

const allDealsLoadingSuccessAction = (products: IProduct[]) => ({
  type: ALL_DEALS_LOADING_SUCCESS,
  products,
});

const allDealsLoadingErrorAction = (error: unknown) => ({
  type: ALL_DEALS_LOADING_ERROR,
  error,
});

const allDealsReloadAction = () => ({
  type: ALL_DEALS_RELOAD,
});

export const loadAllDeals =
  (searchParams: ISearchParams) => async (dispatch, getState: () => IApplicationStore) => {
    dispatch(allDealsLoadingAction());

    const state = getState();
    const { logged } = state.sessionReducer;
    const { language } = state.rootReducer;

    try {
      const result = logged
        ? await new ProductControllerApi().productSearchUsingPOST(
            searchParams,
            getCountryCodeFromState(state),
            language
          )
        : await new PublicControllerApi().productSearchUsingPOST1(searchParams, language);
      console.error(result);

      handleResponseAndThrowAnErrorIfExists(result);

      const items = (result.body || []).map((item) => ({
        ...item,
        wish: isProductInWish(item.uid, state),
        images: mapProductDetailsImage(item),
      }));

      dispatch(allDealsLoadingSuccessAction(items));
    } catch (error) {
      console.error("at allDealsActions in loadAllDeals", error);

      dispatch(allDealsLoadingErrorAction(error.toString()));
    }
  };

export const reloadAllDeals = () => async (dispatch) => {
  dispatch(allDealsReloadAction());
};
