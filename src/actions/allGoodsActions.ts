import { handleResponseAndThrowAnErrorIfExists } from "@/error-handler";
import { IProduct } from "@/reducers/productReducer";
import { getCountryCodeFromState } from "@/selectors/getCountryCodeFromState";
import { isLoggedIn } from "@/selectors/isLoggedIn";
import { IApplicationStore } from "@/store/rootReducer";
import { ProductControllerApi, PublicControllerApi } from "@/types/marketplaceapi";

import { ISearchParams, mapProductDetailsImage, saveSearchLoading } from "./productActions";
import { isProductInWish } from "./profileActions";

export const ALL_GOODS_LOADING = "ALL_GOODS_LOADING";
export const ALL_GOODS_LOADING_SUCCESS = "ALL_GOODS_LOADING_SUCCESS";
export const ALL_GOODS_LOADING_ERROR = "ALL_GOODS_LOADING_ERROR";

const allGoodsLoadingAction = () => ({
  type: ALL_GOODS_LOADING,
});

const allGoodsLoadingSuccessAction = (products: IProduct[]) => ({
  type: ALL_GOODS_LOADING_SUCCESS,
  products,
});

const allGoodsLoadingErrorAction = (error: unknown) => ({
  type: ALL_GOODS_LOADING_ERROR,
  error,
});

export const loadAllGoods =
  (searchParams: ISearchParams) => async (dispatch, getState: () => IApplicationStore) => {
    dispatch(allGoodsLoadingAction());

    const state = getState();
    const { language } = state.rootReducer;
    const country = getCountryCodeFromState(state);

    try {
      const result = isLoggedIn(state)
        ? await new ProductControllerApi().productSearchUsingPOST(searchParams, country, language)
        : await new PublicControllerApi().productSearchUsingPOST1(searchParams, language);

      handleResponseAndThrowAnErrorIfExists(result);

      const items: IProduct[] = result.body || [];
      items.forEach((item) => {
        item.wish = isProductInWish(item.uid, state);
        item.images = mapProductDetailsImage(item);
      });
      dispatch(allGoodsLoadingSuccessAction(items));
    } catch (error) {
      console.error("at allGoodsActions in loadAllGoods", error);

      dispatch(allGoodsLoadingErrorAction(error.toString()));
    } finally {
      dispatch(saveSearchLoading(false));
    }
  };
