import { handleResponseAndThrowAnErrorIfExists } from "@/error-handler";
import { getSortByFields } from "@/pages/all-filtres-popup";
import { IProduct, ProductListType } from "@/reducers/productReducer";
import { getCountryCodeFromState } from "@/selectors/getCountryCodeFromState";
import { isLoggedIn } from "@/selectors/isLoggedIn";
import { IApplicationStore } from "@/store/rootReducer";
import {
  ProductControllerApi,
  ProductSearchListRequest,
  PublicControllerApi,
  WishListControllerApi,
} from "@/types/marketplaceapi";
import { LocalStorageItems } from "@/types/shared/localStorage";

import { isProductInWish } from "./profileActions";

export const PRODUCT_LIST_LOADING = "PRODUCT_LIST_LOADING";
export const PRODUCT_LIST_LOADING_SUCCESS = "PRODUCT_LIST_LOADING_SUCCESS";
export const PRODUCT_LIST_LOADING_ERROR = "PRODUCT_LIST_LOADING_ERROR";

export const PRODUCT_LIST_TYPE_LOADING = "PRODUCT_LIST_TYPE_LOADING";
export const PRODUCT_LIST_TYPE_LOADING_SUCCESS = "PRODUCT_LIST_TYPE_LOADING_SUCCESS";
export const PRODUCT_LIST_TYPE_LOADING_ERROR = "PRODUCT_LIST_TYPE_LOADING_ERROR";

export const PRODUCT_DETAILS_LOADING = "PRODUCT_DETAILS_LOADING";
export const PRODUCT_DETAILS_LOADING_SUCCESS = "PRODUCT_DETAILS_LOADING_SUCCESS";
export const PRODUCT_DETAILS_LOADING_ERROR = "PRODUCT_DETAILS_LOADING_ERROR";

export const PRODUCT_ADDED_TO_WISH = "PRODUCT_ADDED_TO_WISH";

export const PRODUCT_WISH_LIST_LOADING = "PRODUCT_WISH_LIST_LOADING";
export const PRODUCT_WISH_LIST_LOADING_SUCCESS = "PRODUCT_WISH_LIST_LOADING_SUCCESS";
export const PRODUCT_WISH_LIST_LOADING_ERROR = "PRODUCT_WISH_LIST_LOADING_ERROR";

export const SEARCH_UPDATE_RESULT_COUNT = "SEARCH_UPDATE_RESULT_COUNT";
export const SEARCH_SAVE_LOADING = "SEARCH_SAVE_LOADING";

export type SortBy = {
  direction?: "ASC" | "DESC";
  field?: string;
  sortingIndex?: number;
};

export type ISearchParams = Pick<
  ProductSearchListRequest,
  | "address"
  | "category"
  | "coordinates"
  | "hashtags"
  | "inStock"
  | "name"
  | "count"
  | "offset"
  | "sortBy"
  | "type"
  | "sellerUid"
> & {
  resetSearch?: boolean;
  resetSorting?: boolean;
  clear?: boolean;
  storeUid?: string;
  returnBody?: boolean;
};

const productListLoadingErrorAction = (error: unknown) => ({
  type: PRODUCT_LIST_LOADING_ERROR,
  error,
});

const productListTypeLoadingAction = (listType: ProductListType) => ({
  type: PRODUCT_LIST_TYPE_LOADING,
  listType,
});

const productListTypeLoadingSuccessAction = (products: IProduct[], listType: ProductListType) => ({
  type: PRODUCT_LIST_TYPE_LOADING_SUCCESS,
  products,
  listType,
});

const productListTypeLoadingErrorAction = (error: unknown, listType: ProductListType) => ({
  type: PRODUCT_LIST_TYPE_LOADING_ERROR,
  error,
  listType,
});

const productDetailsLoadingAction = () => ({
  type: PRODUCT_DETAILS_LOADING,
});

const productDetailsLoadingSuccessAction = (product: IProduct) => ({
  type: PRODUCT_DETAILS_LOADING_SUCCESS,
  product,
});

const productDetailsLoadingErrorAction = (error: unknown) => ({
  type: PRODUCT_DETAILS_LOADING_ERROR,
  error,
});

const productWishListLoadingAction = () => ({
  type: PRODUCT_WISH_LIST_LOADING,
});

const productWishListLoadingSuccessAction = (products: IProduct[]) => ({
  type: PRODUCT_WISH_LIST_LOADING_SUCCESS,
  products,
});

const productWishListLoadingErrorAction = (error: unknown) => ({
  type: PRODUCT_WISH_LIST_LOADING_ERROR,
  error,
});

const productAddedToWish = (uid: string) => ({
  type: PRODUCT_ADDED_TO_WISH,
  uid,
});

const productListLoadingAction = (autocomplete = false) => ({
  type: PRODUCT_LIST_LOADING,
  autocomplete,
});

export const saveSearchLoading = (payload) => ({
  type: SEARCH_SAVE_LOADING,
  payload,
});

const productListLoadingSuccessAction = (
  products: IProduct[],
  is_clear?: boolean,
  searchTerm?: string,
  totalCount?: number,
  is_reset?: boolean,
  isResetSorting?: boolean,
  autocomplete?: boolean,
  offset?: number
) => ({
  type: PRODUCT_LIST_LOADING_SUCCESS,
  products,
  is_clear,
  searchTerm,
  totalCount,
  is_reset,
  isResetSorting,
  autocomplete,
  offset,
});

export function mapProductDetailsImage(item: IProduct) {
  const keys = Object.keys(item);
  const imagesKeys = keys.filter((key) => key.includes("imageUrl"));
  return imagesKeys.map((key) => item[key]);
}

export async function loadProductDetails(uid: string, state: IApplicationStore): Promise<IProduct> {
  const { language } = state.rootReducer;

  const productController = new ProductControllerApi();

  const result = isLoggedIn(state)
    ? await productController.productSearchDetailsUsingPOST(
        { uid },
        getCountryCodeFromState(state),
        language
      )
    : await productController.productSearchDetailsUsingGET(
        uid,
        getCountryCodeFromState(state),
        language
      );

  handleResponseAndThrowAnErrorIfExists(result);

  const item: IProduct = result.body[0];
  item.wish = isProductInWish(item.uid, state);
  item.images = mapProductDetailsImage(item);
  return item;
}

export const searchProducts =
  (searchParams: ISearchParams, autocomplete = false) =>
  async (dispatch, getState: () => IApplicationStore): Promise<void | IProduct[]> => {
    dispatch(productListLoadingAction(autocomplete));

    const state = getState();
    const { language } = state.rootReducer;
    const { chosenCategoryId, chosenSubcategoryId, sortBy } = state.filterReducer;
    const { count, offset, searchTerm } = state.productReducer;

    searchParams.name = typeof searchParams.name === "undefined" ? null : searchParams.name;

    searchParams = {
      ...searchParams,
      category: searchParams.category || chosenSubcategoryId || chosenCategoryId,
      name: searchParams.name ? searchParams.name : searchTerm,
      count: searchParams.count || count,
      offset:
        typeof searchParams.offset === "undefined"
          ? searchParams.name === searchTerm
            ? offset
            : 0
          : searchParams.offset, // ???????????????????????????????
    };

    if (sortBy.length) {
      searchParams.sortBy = getSortByFields(sortBy);
    }

    searchParams.address = {
      city: state.filterReducer.city,
      countryCode: state.filterReducer.countryCode,
    };

    try {
      const response = isLoggedIn(state)
        ? await new ProductControllerApi().productSearchUsingPOST(
            searchParams,
            getCountryCodeFromState(state),
            language
          )
        : await new PublicControllerApi().productSearchUsingPOST1(searchParams, language);

      handleResponseAndThrowAnErrorIfExists(response);
      const body = response.body || [];
      const totalCount = response.totalCount;

      body.forEach((item: IProduct) => {
        item.wish = isProductInWish(item.uid, state);
        item.images = mapProductDetailsImage(item);
      });

      if (searchParams.returnBody) {
        return body;
      }

      return dispatch(
        productListLoadingSuccessAction(
          body,
          searchParams.clear,
          searchParams.name,
          totalCount,
          searchParams.resetSearch,
          searchParams.resetSorting,
          autocomplete,
          searchParams.offset || 0
        )
      );
    } catch (err) {
      console.error("at productActions in searchProducts", err);

      dispatch(productListLoadingErrorAction(err.toString()));
    } finally {
      //  dispatch(saveSearchLoading(false))
    }
  };

export const searchClear = (autocomplete = false) => {
  return productListLoadingSuccessAction([], true, null, 0, true, true, autocomplete);
};

export const updateSearchResultCount =
  (searchParams: ISearchParams) => async (dispatch, getState: () => IApplicationStore) => {
    dispatch(productListLoadingAction());

    const state = getState();
    const { allFiltresChosenCategoryId, allFiltresChosenSubcategoryId, allFiltresSortBy } =
      state.filterReducer;
    const { language } = state.rootReducer;
    const { count, searchTerm } = state.productReducer;

    const defaultCount = allFiltresChosenCategoryId || allFiltresChosenSubcategoryId ? 15 : 10;

    searchParams["name"] =
      typeof searchParams["name"] === "undefined" ? null : searchParams["name"];
    searchParams = {
      ...searchParams,
      category: allFiltresChosenSubcategoryId || allFiltresChosenCategoryId,
      name: searchParams.name ? searchParams.name : searchTerm,
      count: searchParams.name === searchTerm ? count : defaultCount,
      offset: 0,
    };

    if (allFiltresSortBy.length) {
      searchParams.sortBy = getSortByFields(allFiltresSortBy);
    }

    if (searchParams.count === 0) {
      searchParams.count = 15;
    }

    searchParams.address = {
      city: state.filterReducer.locationPlace,
      countryCode: state.filterReducer.allFiltersChosenCountry,
    };

    try {
      const result = await new ProductControllerApi().productSearchUsingPOST(
        searchParams,
        getCountryCodeFromState(state),
        language
      );
      handleResponseAndThrowAnErrorIfExists(result);
      const totalCount = result.totalCount;
      dispatch({ type: SEARCH_UPDATE_RESULT_COUNT, totalCount });
    } catch (error) {
      console.error("at productActions in updateSearchResultCount", error);
    } finally {
      //  dispatch( saveSearchLoading(false))
    }
  };

export const loadProductListType =
  (listType: ProductListType) => async (dispatch, getState: () => IApplicationStore) => {
    dispatch(productListTypeLoadingAction(listType));

    const state = getState();

    try {
      let items: IProduct[];

      const { logged } = state.sessionReducer;
      const { language } = state.rootReducer;
      const country = getCountryCodeFromState(state);

      if (logged) {
        const controller = new ProductControllerApi();
        items =
          (listType === "all"
            ? (await controller.productSearchUsingPOST({}, country, language)).body
            : (await controller.productWidgetListUsingGET(listType, country, language)).body) || [];
      } else {
        // ? https://beta.enauda.com/marketplaceapi/swagger-ui.html#/public-controller/productWidgetListUsingGET_1
        const availableTypes = ["new", "popular", "cheapest", "expensive", "random", "all"];
        if (!availableTypes.includes(listType)) {
          throw new Error(`${listType} in not allowed to be called when not logged`);
        }
        const controller = new PublicControllerApi();
        items =
          (listType === "all"
            ? (await controller.productSearchUsingPOST1({}, language)).body
            : (await controller.productWidgetListUsingGET1(listType, language)).body) || [];
      }

      items.forEach((item) => {
        item.wish = isProductInWish(item.uid, state);
        item.images = mapProductDetailsImage(item);
      });
      dispatch(productListTypeLoadingSuccessAction(items, listType));
    } catch (error) {
      console.error("at productActions in loadProductListType", error);

      dispatch(productListTypeLoadingErrorAction(error.toString(), listType));
    }
  };

export const loadProductListCategory =
  (listType: ProductListType) => async (dispatch, getState: () => IApplicationStore) => {
    dispatch(productListTypeLoadingAction(listType));

    const state = getState();

    try {
      const { logged } = state.sessionReducer;
      const { language } = state.rootReducer;

      let items: IProduct[];

      if (logged) {
        items =
          (
            await new ProductControllerApi().productSearchUsingPOST(
              {
                category: listType,
                count: 7,
                offset: 0,
              },
              getCountryCodeFromState(state),
              language
            )
          ).body || [];
      } else {
        items =
          (
            await new PublicControllerApi().productSearchUsingPOST1(
              {
                category: listType,
                count: 7,
                offset: 0,
              },
              language
            )
          ).body || [];
      }

      items.forEach((item) => {
        item.wish = isProductInWish(item.uid, state);
        item.images = mapProductDetailsImage(item);
      });
      dispatch(productListTypeLoadingSuccessAction(items, listType));
    } catch (error) {
      console.error("at productActions in loadProductListCategory", error);

      dispatch(productListTypeLoadingErrorAction(error.toString(), listType));
    }
  };

export const loadProductDetail =
  (uid?: string) => async (dispatch, getState: () => IApplicationStore) => {
    dispatch(productDetailsLoadingAction());

    const state = getState();

    try {
      const data = await loadProductDetails(uid, state);
      dispatch(productDetailsLoadingSuccessAction(data));
      return data;
    } catch (error) {
      console.error("at productActions in loadProductDetail", error);

      dispatch(productDetailsLoadingErrorAction(error.toString()));
      return undefined;
    }
  };

export const loadProductWishList = () => async (dispatch, getState: () => IApplicationStore) => {
  dispatch(productWishListLoadingAction());

  const state = getState();
  const { language } = state.rootReducer;

  let items: IProduct[];

  try {
    if (isLoggedIn(state)) {
      // ! this handler doesnt provide rentOptions
      const result = await new WishListControllerApi().wishListUsingGET(language);
      handleResponseAndThrowAnErrorIfExists(result);

      items = result.body || [];
    } else {
      const wishListUidsFromLocalStorage: string[] =
        JSON.parse(localStorage.getItem(LocalStorageItems.WISH_LIST)) || [];

      items = await Promise.all(
        wishListUidsFromLocalStorage.map((uid) => loadProductDetails(uid, state))
      );
    }

    items = items.map((item) => ({
      ...item,
      wish: true,
      images: mapProductDetailsImage(item),
    }));

    dispatch(productWishListLoadingSuccessAction(items));
  } catch (error) {
    console.error("at productActions in loadProductWishList", error);

    dispatch(productWishListLoadingErrorAction(error.toString()));
  }
};

export const addToWishList =
  (uid?: string) => async (dispatch, getState: () => IApplicationStore) => {
    /* get before call productAddedToWish! */
    const state = getState();
    const { productsWishList } = state.productReducer;
    const productAlreadyAdded = !!productsWishList.find((item) => item.uid === uid);

    dispatch(productAddedToWish(uid));

    try {
      if (isLoggedIn(state)) {
        const controller = new WishListControllerApi();
        const result = productAlreadyAdded
          ? await controller.removeFromWishListUsingDELETE(uid)
          : await controller.addToWishListUsingPUT(uid);
        handleResponseAndThrowAnErrorIfExists(result);

        const items: IProduct[] = result.body || [];
        items.forEach((item) => {
          item.wish = true;
          item.images = mapProductDetailsImage(item);
        });
        dispatch(productWishListLoadingSuccessAction(items));
        return;
      }

      let newWishList = [...productsWishList];
      if (productAlreadyAdded) {
        newWishList = newWishList.filter((prod) => prod.uid !== uid);
      } else {
        const addedItem = await loadProductDetails(uid, state);
        addedItem.wish = true;
        newWishList.push(addedItem);
      }

      localStorage.setItem(
        LocalStorageItems.WISH_LIST,
        JSON.stringify(newWishList.map(({ uid }) => uid))
      );

      dispatch(productWishListLoadingSuccessAction(newWishList));
    } catch (err) {
      console.error("at productActions in addToWishList", err);
    }
  };

export const loadDifferenceProducts = (options) => async () => {
  try {
    const response = await new ProductControllerApi().productListUsingPOST({
      ...options,
    });
    return response.body || [];
  } catch (err) {
    console.log("at productActions in loadDifferenceProducts", err);
    return undefined;
  }
};

export const sendWishListFromLocalStorage = () => async (dispatch) => {
  try {
    const uids: string[] = JSON.parse(localStorage.getItem(LocalStorageItems.WISH_LIST)) || [];
    const response = await new WishListControllerApi().addProductsToWishListUsingPUT(uids);
    const items = (response.body || []).map((item) => ({
      ...item,
      wish: true,
      images: mapProductDetailsImage(item),
    }));
    dispatch(productWishListLoadingSuccessAction(items));
    localStorage.removeItem(LocalStorageItems.WISH_LIST);
  } catch (error) {
    console.error("at productActions in sendWishListFromLocalStorage", error);
    dispatch(productWishListLoadingErrorAction(error?.toString()));
  }
};
