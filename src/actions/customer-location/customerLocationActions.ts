import { IApplicationStore } from "@/store/rootReducer";

export const CUSTOMER_LOCATION_TOGGLE_SELECT_CUSTOMER_LOCATION_SHEET =
  "CUSTOMER_LOCATION_TOGGLE_SELECT_CUSTOMER_LOCATION_SHEET";
export const CUSTOMER_LOCATION_TOGGLE_SELECT_COUNTRY_POPUP =
  "CUSTOMER_LOCATION_TOGGLE_SELECT_COUNTRY_POPUP";
export const CUSTOMER_LOCATION_CHANGE_COUNTRY = "CUSTOMER_LOCATION_CHANGE_COUNTRY";
export const CUSTOMER_LOCATION_CHANGE_ADDRESS = "CUSTOMER_LOCATION_CHANGE_ADDRESS";

export const toggleSelectCustomerLocationSheet = (open = false) => ({
  type: CUSTOMER_LOCATION_TOGGLE_SELECT_CUSTOMER_LOCATION_SHEET,
  open,
});

export const toggleSelectCountryPopup = (open = false) => ({
  type: CUSTOMER_LOCATION_TOGGLE_SELECT_COUNTRY_POPUP,
  open,
});

export const changeCountry =
  (code: string, clearAddressUid = false) =>
  (dispatch, getState: () => IApplicationStore) => {
    const state = getState();
    const country = state.classificatorReducer.countryClassificator.find(
      (item) => item.code === code
    );
    dispatch({
      type: CUSTOMER_LOCATION_CHANGE_COUNTRY,
      country,
      clearAddressUid,
    });
  };

export const changeAddress = (addressUid: string) => ({
  type: CUSTOMER_LOCATION_CHANGE_ADDRESS,
  addressUid,
});
