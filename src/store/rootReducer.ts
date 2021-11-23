import Framework7 from "framework7/components/app/app-class";
import { AnyAction, combineReducers } from "redux";
import { REHYDRATE } from "redux-persist";

import { CATEGORY_LIST_LOADING_SUCCESS } from "@/actions/categoryActions";
import { CHANGE_APP_LANGUAGE } from "@/actions/classificatorActions";
import {
  INIT_GEOLOCATION_ERROR,
  INIT_GEOLOCATION_LOADING,
  INIT_GEOLOCATION_SUCCESS,
} from "@/actions/geolocationActions";
import { CHANGE_LANGUAGE } from "@/actions/sessionActions";
import { language } from "@/i18n";
import accountStoresReducer, { IAccountStoresState } from "@/reducers/accountStoresReducer";
import addCompanyReducer, { IAddCompanyState } from "@/reducers/addCompanyReducer";
import allDealsReducer, { IAllDealsState } from "@/reducers/allDealsReducer";
import allGoodsReducer, { IAllGoodsState } from "@/reducers/allGoodsReducer";
import bannersReducer, { IBannersState } from "@/reducers/bannersReducer";
import cartReducer, { ICartState } from "@/reducers/cartReducer";
import categoryReducer, {
  ICategoryClassificator,
  ICategoryClassificatorState,
} from "@/reducers/categoryReducer";
import chatReducer, { IChatState } from "@/reducers/chatReducer";
import checkoutReducer, { ICheckoutState } from "@/reducers/checkoutReducer";
import classificatorReducer, { IClassificatorState } from "@/reducers/classificatorReducer";
import contactSupportReducer, { IContactSupportState } from "@/reducers/contactSupportReducer";
import currencyReducer, { ICurrencyClassificatorState } from "@/reducers/currencyReducer";
import customerLocationReducer, {
  ICustomerLocationReducerState,
} from "@/reducers/customer-location/customerLocationReducer";
import deliveryMethodsReducer, { IDeliveryMethodsState } from "@/reducers/deliveryMethodsReducer";
import filterReducer, { IFilterState } from "@/reducers/filterReducer";
import languageListReducer, { ILanguageListReducerState } from "@/reducers/languagesListReducer";
import myCurrenciesReducer, { IMyCurrenciesState } from "@/reducers/myCurrenciesReducer";
import myGoodsReducer, { IMyGoodsState } from "@/reducers/myGoodsReducer";
import ordersReducer, { IOrdersState } from "@/reducers/ordersReducer";
import paymentCardsReducer, { IPaymentCardsState } from "@/reducers/paymentCardsReducer";
import payoutsReducer, { IPayoutsState } from "@/reducers/payoutsReducer";
import preloaderReducer, { IPreloaderState } from "@/reducers/preloaderReducer";
import productCreateReducer, { IProductCreateState } from "@/reducers/productCreateReducer";
import productPromotionReducer, {
  IProductPromotionState,
} from "@/reducers/productPromotionReducer";
import productReducer, { IProductState } from "@/reducers/productReducer";
import productStatusReducer, { IProductStatusState } from "@/reducers/productStatusReducer";
import profileReducer, { IProfileState } from "@/reducers/profileReducer";
import sellersOrdersReducer, { ISellersOrdersState } from "@/reducers/sellersOrdersReducer";
import sessionReducer, { ISessionState } from "@/reducers/sessionReducer";
import shareReducer, { IShareState } from "@/reducers/shareReducer";
import storeHomePageReducer, { IStoreHomePageState } from "@/reducers/storeHomePageReducer";
import storeReducer, { IStoreState } from "@/reducers/storeReducer";
import transactionReducer, { ITransactionsState } from "@/reducers/transactionReducer";

export const F7_INIT = "F7_INIT";
export const INIT_ENTRY_PAGE_NAME = "INIT_ENTRY_PAGE_NAME";
export const LOCAL_CONFIG_LOADED = "LOCAL_CONFIG_LOADED";
export const LOCAL_CONFIG_UPDATED = "LOCAL_CONFIG_UPDATED";
export const ON_RESIZE_EVENT = "ON_RESIZE_EVENT";

export interface IApplicationStore {
  rootReducer: IAppState;
  sessionReducer: ISessionState;
  filterReducer: IFilterState;
  categoryReducer: ICategoryClassificatorState;
  currencyReducer: ICurrencyClassificatorState;
  productReducer: IProductState;
  profileReducer: IProfileState;
  allGoodsReducer: IAllGoodsState;
  chatReducer: IChatState;
  myGoodsReducer: IMyGoodsState;
  paymentCardsReducer: IPaymentCardsState;
  productCreateReducer: IProductCreateState;
  shareReducer: IShareState;
  productStatusReducer: IProductStatusState;
  classificatorReducer: IClassificatorState;
  bannersReducer: IBannersState;
  preloaderReducer: IPreloaderState;
  productPromotionReducer: IProductPromotionState;
  myCurrenciesReducer: IMyCurrenciesState;
  ordersReducer: IOrdersState;
  transactionReducer: ITransactionsState;
  cartReducer: ICartState;
  checkoutReducer: ICheckoutState;
  contactSupportReducer: IContactSupportState;
  sellersOrdersReducer: ISellersOrdersState;
  allDealsReducer: IAllDealsState;
  payoutsReducer: IPayoutsState;
  deliveryMethodsReducer: IDeliveryMethodsState;
  customerLocationReducer: ICustomerLocationReducerState;
  addCompanyReducer: IAddCompanyState;
  accountStoresReducer: IAccountStoresState;
  storeReducer: IStoreState;
  storeHomePageReducer: IStoreHomePageState;
  languageListReducer: ILanguageListReducerState;
}

export interface ICategory {
  id?: string;
  name?: string;
  color?: string;
  icon?: string;
}

export interface ILocalConfig {
  GoogleMapAPIkey?: string;
  categories: ICategory[];
  settingsEnabled?: boolean;
  theme?: "light" | "dark";
  appCode?: string;
  profileMenuItems?: string[];
}

export interface ResizeEvent {
  width: number;
  height: number;
  isLandscape: boolean;
  ratio: number;
  isXS: boolean;
  isMD: boolean;
  isLG: boolean;
  isXL: boolean;
}

export interface IAppState {
  f7?: Framework7;
  localConfig?: ILocalConfig;
  language?: string;
  isLanguageChanged?: boolean;
  entryPageName?: string;
  resizeEvent: ResizeEvent;
  geolocationLoading?: boolean;
  geolocation?: {
    accuracy: number;
    latitude: number;
    longitude: number;
    country: { long_name: string; short_name: string };
  };
}

const initialState: IAppState = {
  f7: null,
  localConfig: {
    categories: [],
    theme: "light",
  },
  language: language,
  isLanguageChanged: false,
  resizeEvent: {
    width: window.innerWidth,
    height: window.innerHeight,
    ratio: window.devicePixelRatio,
    isLG: false,
    isLandscape: false,
    isMD: false,
    isXL: false,
    isXS: false,
  },
  geolocationLoading: false,
  geolocation: null,
};

const rootReducer = (state = initialState, action: AnyAction): IAppState => {
  const isLanguageChanged = state.language !== language;

  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        language: isLanguageChanged ? language : state.language,
        isLanguageChanged,
      };
    case F7_INIT:
      return {
        ...state,
        f7: action.f7,
      };
    case LOCAL_CONFIG_LOADED:
      return {
        ...state,
        localConfig: { ...state.localConfig, ...action.localConfig },
      };
    case LOCAL_CONFIG_UPDATED:
      return {
        ...state,
        localConfig: { ...state.localConfig, ...action.localConfig },
      };
    case CATEGORY_LIST_LOADING_SUCCESS: {
      const { categories }: { categories: ICategoryClassificator[] } = action as any;
      const { localConfig } = state;

      if (localConfig && categories) {
        localConfig.categories = localConfig.categories.map((item) => {
          const categoryClassificatorItem = categories.filter((c) => c.categoryCode === item.id)[0];
          if (categoryClassificatorItem) {
            return { ...item, name: categoryClassificatorItem.categoryName };
          }
          console.warn("Not found for " + item.name + ", " + item.id);
          return item;
        });
      }

      return {
        ...state,
        localConfig: { ...localConfig },
      };
    }
    case INIT_ENTRY_PAGE_NAME:
      return {
        ...state,
        entryPageName: action.pageName,
      };
    case CHANGE_LANGUAGE:
      return {
        ...state,
        language: isLanguageChanged ? language : state.language,
        isLanguageChanged: isLanguageChanged,
      };
    case CHANGE_APP_LANGUAGE:
      return {
        ...state,
        language: action.language,
        isLanguageChanged: true,
      };
    case ON_RESIZE_EVENT: {
      const { width, height } = action.payload;
      return {
        ...state,
        resizeEvent: {
          ...action.payload,
          isLandscape: width > height,
          ratio: width / height,
          isXL: width > 1280 || height > 1280,
          isLG: (width > 1024 && width < 1279) || (height > 1024 && height < 1279),
          isMD: (width > 768 && width < 1023) || (height > 768 && height < 1023),
          isXS: width <= 567 || height <= 567,
        },
      };
    }
    case INIT_GEOLOCATION_LOADING: {
      return {
        ...state,
        geolocationLoading: true,
      };
    }
    case INIT_GEOLOCATION_SUCCESS: {
      return {
        ...state,
        geolocationLoading: false,
        geolocation: action.data,
      };
    }
    case INIT_GEOLOCATION_ERROR: {
      return {
        ...state,
        geolocation: initialState.geolocation,
        geolocationLoading: false,
      };
    }
  }
  return state;
};

// TODO
// https://redux.js.org/recipes/usage-with-typescript#type-checking-reducers
export default combineReducers<IApplicationStore>({
  rootReducer,
  sessionReducer,
  filterReducer,
  categoryReducer,
  currencyReducer,
  productReducer,
  profileReducer,
  allGoodsReducer,
  chatReducer,
  myGoodsReducer,
  paymentCardsReducer,
  productCreateReducer,
  shareReducer,
  productStatusReducer,
  classificatorReducer,
  bannersReducer,
  preloaderReducer,
  productPromotionReducer,
  myCurrenciesReducer,
  ordersReducer,
  transactionReducer,
  cartReducer,
  checkoutReducer,
  contactSupportReducer,
  sellersOrdersReducer,
  allDealsReducer,
  payoutsReducer,
  deliveryMethodsReducer,
  customerLocationReducer,
  addCompanyReducer,
  accountStoresReducer,
  storeReducer,
  storeHomePageReducer,
  languageListReducer,
});
