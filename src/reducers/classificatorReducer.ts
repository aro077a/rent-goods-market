import { AnyAction } from "redux";

import {
  CLASSIFICATOR_LIST_LOADING,
  CLASSIFICATOR_LIST_LOADING_ERROR,
  CLASSIFICATOR_LIST_LOADING_SUCCESS,
  EntityClassificatorType,
} from "@/actions/classificatorActions";
import { Country, Currency } from "@/types/commonapi";
import { Classificator } from "@/types/marketplaceapi";

export interface IClassificator extends Classificator {}

export interface IClassificatorState {
  loading?: boolean;
  error?: unknown;
  currencyClassificator: Currency[];
  countryClassificator: Country[];
  entitiesClassificators: {
    [key in EntityClassificatorType]: IClassificator[];
  };
  claimSubjectsClassificators: {
    Application: IClassificator[];
    Order: IClassificator[];
    Product: IClassificator[];
    MyProduct: IClassificator[];
  };
}

const initialState: IClassificatorState = {
  currencyClassificator: [],
  countryClassificator: [],
  entitiesClassificators: {
    Product_Status: [],
    Account_Status: [],
    Account_Type: [],
    Payment_Options: [],
    Delivery_Duration: [],
    Delivery_Prices: [],
    Order_State: [],
    Url_app: [],
    Company_BusinessType: [],
  },
  claimSubjectsClassificators: {
    Application: [],
    Order: [],
    Product: [],
    MyProduct: [],
  },
};

const classificatorReducer = (state = initialState, action: AnyAction): IClassificatorState => {
  switch (action.type) {
    case CLASSIFICATOR_LIST_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CLASSIFICATOR_LIST_LOADING_SUCCESS: {
      const entitiesClassificators = { ...state.entitiesClassificators };
      if (action.classificatorType && action.items) {
        entitiesClassificators[action.classificatorType] = action.items;
      }

      const claimSubjectsClassificators = {
        ...state.claimSubjectsClassificators,
      };
      if (action.subjectType && action.items) {
        claimSubjectsClassificators[action.subjectType] = action.items;
      }

      return {
        ...state,
        loading: false,
        currencyClassificator: action.currencyClassificator || state.currencyClassificator,
        countryClassificator: action.countryClassificator || state.countryClassificator,
        entitiesClassificators: { ...entitiesClassificators },
        claimSubjectsClassificators: { ...claimSubjectsClassificators },
      };
    }
    case CLASSIFICATOR_LIST_LOADING_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
  }
  return state;
};

export default classificatorReducer;
