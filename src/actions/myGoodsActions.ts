import { IProduct } from "@/reducers/productReducer";
import { IApplicationStore } from "@/store/rootReducer";
import { ProductControllerApi } from "@/types/marketplaceapi";
import { checkProductEditAllowed } from "@/reducers/productCreateReducer";

import { fillClassificatorProductStatusValue } from "./classificatorActions";

export const MY_GOODS_LIST_LOADING = "MY_GOODS_LIST_LOADING";
export const MY_GOODS_LIST_LOADING_SUCCESS = "MY_GOODS_LIST_LOADING_SUCCESS";
export const MY_GOODS_LIST_LOADING_ERROR = "MY_GOODS_LIST_LOADING_ERROR";

const myGoodsListLoadingAction = () => ({
  type: MY_GOODS_LIST_LOADING,
});

const myGoodsListLoadingSuccessAction = (products: IProduct[]) => ({
  type: MY_GOODS_LIST_LOADING_SUCCESS,
  products,
});

const myGoodsListLoadingErrorAction = (error: unknown) => ({
  type: MY_GOODS_LIST_LOADING_ERROR,
  error,
});

export const loadMyGoodsList = () => async (dispatch, getState: () => IApplicationStore) => {
  dispatch(myGoodsListLoadingAction());
  try {
    const state = getState();
    const items: IProduct[] =
      (await new ProductControllerApi().productListUsingPOST({})).body || [];
    fillClassificatorProductStatusValue(items, state);
    // product edit allowed status
    items.forEach((item) => {
      item.isProductEditAllowed = checkProductEditAllowed(item.status);
    });
    dispatch(myGoodsListLoadingSuccessAction(items));
  } catch (err) {
    console.error("at myGoodsActions in loadMyGoodsList", err);

    let errorText = err.toString();
    if (err.response && err.response.data && err.response.data.errorData) {
      errorText = err.response.data.errorData.message;
    }
    dispatch(myGoodsListLoadingErrorAction(errorText));
  }
};
