import { AnyAction } from "redux";
import {
  SERVICE_PACKAGES_LOADING_ERROR,
  SERVICE_PACKAGES_LOADING_SUCCESS,
  SERVICE_PACKAGES_LOADING,
  PUBLISHED_PRODUCTS_LOADING,
  PUBLISHED_PRODUCTS_LOADING_SUCCESS,
  PUBLISHED_PRODUCTS_LOADING_ERROR,
} from "../actions/productPromotionActions";
import { ProductFeatureType, Product } from "../types/marketplaceapi";

export interface IProductPromotionState {
  servicePackagesLoading?: boolean;
  servicePackagesLoadingError?: any;
  servicePackages: ProductFeatureType[];
  publishedProductsLoading?: boolean;
  publishedProductsLoadingError?: any;
  publishedProducts: Product[];
}

const initialState: IProductPromotionState = {
  servicePackagesLoading: false,
  servicePackagesLoadingError: null,
  servicePackages: [],
  publishedProductsLoading: false,
  publishedProductsLoadingError: null,
  publishedProducts: [],
};

const productPromotionReducer = (
  state = initialState,
  action: AnyAction
): IProductPromotionState => {
  switch (action.type) {
    case SERVICE_PACKAGES_LOADING:
      return {
        ...state,
        servicePackagesLoading: true,
        servicePackagesLoadingError: null,
      };
    case SERVICE_PACKAGES_LOADING_SUCCESS:
      return {
        ...state,
        servicePackagesLoading: false,
        servicePackages: action.items,
      };
    case SERVICE_PACKAGES_LOADING_ERROR:
      return {
        ...state,
        servicePackagesLoading: false,
        servicePackagesLoadingError: action.error,
      };
    case PUBLISHED_PRODUCTS_LOADING:
      return {
        ...state,
        publishedProductsLoading: true,
        publishedProductsLoadingError: null,
      };
    case PUBLISHED_PRODUCTS_LOADING_SUCCESS:
      return {
        ...state,
        publishedProductsLoading: false,
        publishedProducts: action.items,
      };
    case PUBLISHED_PRODUCTS_LOADING_ERROR:
      return {
        ...state,
        publishedProductsLoading: false,
        publishedProductsLoadingError: action.error,
      };
  }
  return state;
};

export default productPromotionReducer;
