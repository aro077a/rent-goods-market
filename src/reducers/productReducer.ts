import { AnyAction } from "redux";

import {
  PRODUCT_ADDED_TO_WISH,
  PRODUCT_DETAILS_LOADING,
  PRODUCT_DETAILS_LOADING_ERROR,
  PRODUCT_DETAILS_LOADING_SUCCESS,
  PRODUCT_LIST_LOADING,
  PRODUCT_LIST_LOADING_ERROR,
  PRODUCT_LIST_LOADING_SUCCESS,
  PRODUCT_LIST_TYPE_LOADING_SUCCESS,
  PRODUCT_WISH_LIST_LOADING,
  PRODUCT_WISH_LIST_LOADING_ERROR,
  PRODUCT_WISH_LIST_LOADING_SUCCESS,
  SEARCH_SAVE_LOADING,
  SEARCH_UPDATE_RESULT_COUNT,
} from "@/actions/productActions";
import { Product } from "@/types/marketplaceapi";

export interface IProduct extends Product {
  images?: string[];
  imageThumbnails?: string[];
  wish?: boolean;
  statusValue?: string;
  isProductEditAllowed?: boolean;
  place?: string;
  placeId?: string;
  promotion?: boolean;
}

export interface IProductState {
  loading?: boolean;
  error?: boolean;
  products: IProduct[];
  productsListType?: ProductListType;
  totalCount?: number;
  count?: number;
  offset?: number;
  searchTerm?: string;
  productsAllGoods?: IProduct[];
  productDetails?: IProduct;
  productDetailsLoading?: boolean;
  productDetailsLoadingError?: unknown;
  productTypeGroups?: { type: ProductListType; products: IProduct[] }[];
  productsWishListLoading?: boolean;
  productsWishList?: IProduct[];
  productsWishListLoadingError?: unknown;

  loadingAutocomplete?: boolean;
  productsAutocomplete: IProduct[];
}

export type ProductListType =
  | "cheapest"
  | "expensive"
  | "new"
  | "popular"
  | "random"
  | "all"
  | string;

const initialState: IProductState = {
  loading: null,
  error: null,
  products: [],
  productsListType: null,
  count: 10,
  offset: 0,
  searchTerm: null,
  productsAllGoods: [],
  productDetails: null,
  productDetailsLoading: false,
  productDetailsLoadingError: null,
  productTypeGroups: [],
  productsWishListLoading: null,
  productsWishList: [],
  productsWishListLoadingError: null,

  loadingAutocomplete: false,
  productsAutocomplete: [],
};

const productReducer = (state = initialState, action: AnyAction): IProductState => {
  switch (action.type) {
    case PRODUCT_LIST_LOADING:
      if (action.autocomplete) {
        return {
          ...state,
          loadingAutocomplete: true,
        };
      }

      return {
        ...state,
        loading: true,
        error: null,
      };
    case PRODUCT_LIST_LOADING_SUCCESS: {
      const { products, is_clear, searchTerm, totalCount, is_reset, isResetSorting } = action;

      if (action.autocomplete) {
        return {
          ...state,
          loadingAutocomplete: false,
          productsAutocomplete: is_clear ? [] : products,
        };
      }

      const { offset } = state;
      const prevSearchTerm = state.searchTerm;

      if (is_clear) {
        return {
          ...state,
          loading: false,
          error: null,
          products: [],
          productsAutocomplete: [],
          totalCount: null,
          offset: 0,
          searchTerm: null,
        };
      }

      if (searchTerm !== prevSearchTerm || isResetSorting) {
        return {
          ...state,
          loading: false,
          error: null,
          products: [...products],
          totalCount,
          offset: initialState.count, /// ?????????????????????????
          searchTerm,
        };
      }

      return {
        ...state,
        loading: false,
        error: null,
        products: is_reset ? [] : products ? [...state.products, ...products] : state.products,
        totalCount,
        offset: offset + (products && products.length ? initialState.count : 0),
        searchTerm: searchTerm,
      };
    }
    case PRODUCT_LIST_LOADING_ERROR: {
      const { error } = action;
      return {
        ...state,
        loading: false,
        error,
      };
    }
    case PRODUCT_LIST_TYPE_LOADING_SUCCESS: {
      const { products, listType } = action;
      const productTypeGroups = [...state.productTypeGroups];

      const group = productTypeGroups.find((item) => item.type === listType);

      if (!group) {
        productTypeGroups.push({ type: listType, products: products || [] });
      }

      return {
        ...state,
        productTypeGroups,
      };
    }
    case PRODUCT_DETAILS_LOADING: {
      return {
        ...state,
        productDetailsLoading: true,
        productDetailsLoadingError: null,
      };
    }
    case PRODUCT_DETAILS_LOADING_SUCCESS: {
      return {
        ...state,
        productDetails: action.product,
        productDetailsLoading: false,
      };
    }
    case PRODUCT_DETAILS_LOADING_ERROR: {
      return {
        ...state,
        productDetails: null,
        productDetailsLoading: false,
        productDetailsLoadingError: action.error,
      };
    }
    case PRODUCT_ADDED_TO_WISH: {
      const { uid } = action;

      const item = state.products.find((item) => item.uid === uid);
      if (item) {
        item.wish = !item.wish;
      }

      const { productTypeGroups } = state;
      const groups = productTypeGroups.filter(
        (item) => !!item.products.find((item) => item.uid === uid)
      );
      groups.forEach((item) => {
        item.products
          .filter((item) => item.uid === uid)
          .forEach((item) => {
            item.wish = !item.wish;
          });
      });

      const { productsWishList } = state;

      return {
        ...state,
        products: [...state.products],
        productsWishList: productsWishList.find((item) => item.uid === uid)
          ? productsWishList.filter((item) => item.uid !== uid)
          : [...productsWishList],
      };
    }
    case PRODUCT_WISH_LIST_LOADING: {
      return {
        ...state,
        productsWishListLoading: true,
        productsWishListLoadingError: null,
      };
    }
    case PRODUCT_WISH_LIST_LOADING_SUCCESS: {
      const { productDetails } = state;
      const wishList = action.products as IProduct[];

      if (productDetails && wishList.filter((item) => item.uid === productDetails.uid)) {
        state.productDetails = { ...productDetails, wish: true };
      }

      return {
        ...state,
        productsWishListLoading: false,
        productsWishList: action.products || [],
      };
    }
    case PRODUCT_WISH_LIST_LOADING_ERROR: {
      return {
        ...state,
        productsWishListLoading: false,
        productsWishListLoadingError: action.error,
      };
    }
    case SEARCH_UPDATE_RESULT_COUNT: {
      return {
        ...state,
        loading: false,
        error: null,
        totalCount: action.totalCount,
      };
    }
    case SEARCH_SAVE_LOADING: {
      return {
        ...state,
        loading: action.patload,
      };
    }
    default: {
      return state;
    }
  }
};

export default productReducer;
