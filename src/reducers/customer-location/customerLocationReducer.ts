import {
  CUSTOMER_LOCATION_CHANGE_ADDRESS,
  CUSTOMER_LOCATION_CHANGE_COUNTRY,
  CUSTOMER_LOCATION_TOGGLE_SELECT_COUNTRY_POPUP,
  CUSTOMER_LOCATION_TOGGLE_SELECT_CUSTOMER_LOCATION_SHEET,
} from "@/actions/customer-location/customerLocationActions";
import { Country } from "@/types/commonapi";

export interface ICustomerLocationReducerState {
  selectCustomerLocationSheetOpened?: boolean;
  countrySelectPopupOpened?: boolean;
  country?: Country; // TODO: ?
  addressUid?: string;
}

const initialState: ICustomerLocationReducerState = {
  selectCustomerLocationSheetOpened: false,
  countrySelectPopupOpened: false,
  country: null,
  addressUid: null,
};

const customerLocationReducer = (state = initialState, action): ICustomerLocationReducerState => {
  switch (action.type) {
    case CUSTOMER_LOCATION_TOGGLE_SELECT_CUSTOMER_LOCATION_SHEET:
      return {
        ...state,
        selectCustomerLocationSheetOpened: action.open,
      };
    case CUSTOMER_LOCATION_TOGGLE_SELECT_COUNTRY_POPUP:
      return {
        ...state,
        countrySelectPopupOpened: action.open,
      };
    case CUSTOMER_LOCATION_CHANGE_COUNTRY:
      return {
        ...state,
        country: action.country,
        addressUid: action.clearAddressUid ? null : state.addressUid,
      };
    case CUSTOMER_LOCATION_CHANGE_ADDRESS:
      return {
        ...state,
        addressUid: action.addressUid,
      };
    default:
      return state;
  }
};

export default customerLocationReducer;
