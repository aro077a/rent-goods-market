import { Profile } from "../reducers/sessionReducer";
import { IApplicationStore } from "../store/rootReducer";
import { getPlatform, Platform } from "../utils";
import { AccountAddressWsControllerApi, AccountWsControllerApi, Address } from "../types/commonapi";
import { handleError, handleResponseAndThrowAnErrorIfExists } from "../error-handler";

export const PROFILE_UPDATING = "PROFILE_UPDATING";
export const PROFILE_UPDATING_SUCCESS = "PROFILE_UPDATING_SUCCESS";
export const PROFILE_UPDATING_ERROR = "PROFILE_UPDATING_ERROR";

export const PROFILE_GO_TO_MESSENGER = "PROFILE_GO_TO_MESSENGER";

export const ACCOUNT_ADD_UPDATE_ADDRESS = "ACCOUNT_ADD_UPDATE_ADDRESS";
export const ACCOUNT_ADD_UPDATE_ADDRESS_SUCCESS = "ACCOUNT_ADD_UPDATE_ADDRESS_SUCCESS";
export const ACCOUNT_ADD_UPDATE_ADDRESS_ERROR = "ACCOUNT_ADD_UPDATE_ADDRESS_ERROR";

export const ACCOUNT_REMOVE_ADDRESS = "ACCOUNT_REMOVE_ADDRESS";
export const ACCOUNT_REMOVE_ADDRESS_SUCCESS = "ACCOUNT_REMOVE_ADDRESS_SUCCESS";
export const ACCOUNT_REMOVE_ADDRESS_ERROR = "ACCOUNT_REMOVE_ADDRESS_ERROR";

export const ACCOUNT_UPDATE_SETTINGS = "ACCOUNT_UPDATE_SETTINGS";
export const ACCOUNT_UPDATE_SETTINGS_SUCCESS = "ACCOUNT_UPDATE_SETTINGS_SUCCESS";
export const ACCOUNT_UPDATE_SETTINGS_ERROR = "ACCOUNT_UPDATE_SETTINGS_ERROR";

export const TC_AGREEMENT_SETTINGS_KEY = "marketTermsAgreed";

const profileUpdatingAction = () => ({
  type: PROFILE_UPDATING,
});

const profileUpdatingSuccessAction = (profile?: Profile) => ({
  type: PROFILE_UPDATING_SUCCESS,
  profile,
});

const addOrUpdateAddressAction = () => ({
  type: ACCOUNT_ADD_UPDATE_ADDRESS,
});

const addOrUpdateAddressSuccessAction = (addresses: Address[]) => ({
  type: ACCOUNT_ADD_UPDATE_ADDRESS_SUCCESS,
  addresses,
});

const addOrUpdateAddressErrorAction = (error: unknown) => ({
  type: ACCOUNT_ADD_UPDATE_ADDRESS_ERROR,
  error,
});

const removeAddressAction = () => ({
  type: ACCOUNT_REMOVE_ADDRESS,
});

const removeAddressSuccessAction = (addresses: Address[]) => ({
  type: ACCOUNT_REMOVE_ADDRESS_SUCCESS,
  addresses,
});

const removeAddressErrorAction = (error: unknown) => ({
  type: ACCOUNT_REMOVE_ADDRESS_ERROR,
  error,
});

const updateSettingsAction = () => ({
  type: ACCOUNT_UPDATE_SETTINGS,
});

const updateSettingsSuccessAction = (profile: Profile) => ({
  type: ACCOUNT_UPDATE_SETTINGS_SUCCESS,
  profile,
});

const updateSettingsErrorAction = (error: unknown) => ({
  type: ACCOUNT_UPDATE_SETTINGS_ERROR,
  error,
});

export const isProductInWish = (uid: string, state: IApplicationStore): boolean => {
  const { productsWishList = [] } = state.productReducer;
  return !!productsWishList.find((item) => item.uid === uid);
};

export const updateProfile = (profile: Profile) => (dispatch) => {
  dispatch(profileUpdatingAction());

  setTimeout(() => {
    dispatch(profileUpdatingSuccessAction(profile));
  }, 1000);
};

export const goToMessenger = () => (dispatch) => {
  const platform = getPlatform();
  if (platform == Platform.Android) {
  } else if (platform == Platform.iOS) {
  } else {
    window.parent.postMessage({ goToMessenger: true }, "*");
  }
  dispatch({ type: PROFILE_GO_TO_MESSENGER });
};

export const addOrUpdateAddress =
  (address: Address, update = false) =>
  async (dispatch) => {
    dispatch(addOrUpdateAddressAction());
    if (update) {
      try {
        const result = await new AccountAddressWsControllerApi().updateAddressUsingPOST({
          address: {
            city: address.city,
            countryCode: address.country.code,
            firstAddressLine: address.firstAddressLine,
            postalCode: address.postalCode,
            secondAddressLine: address.secondAddressLine,
            state: address.state || "",
            uid: address.uid,
          },
          primary: false,
          type: "O",
        });

        handleResponseAndThrowAnErrorIfExists(result);
        const addresses = result.account.addresses;
        dispatch(addOrUpdateAddressSuccessAction(addresses));
      } catch (err) {
        dispatch(addOrUpdateAddressErrorAction(err));
      }
    } else {
      try {
        const result = await new AccountAddressWsControllerApi().addAddressUsingPUT({
          address: {
            city: address.city,
            countryCode: address.country.code,
            firstAddressLine: address.firstAddressLine,
            postalCode: address.postalCode,
            secondAddressLine: address.secondAddressLine,
            state: address.state || "",
            uid: null,
          },
          primary: false,
          type: "O",
        });

        handleResponseAndThrowAnErrorIfExists(result);
        const addresses = result.account.addresses;

        dispatch(addOrUpdateAddressSuccessAction(addresses));
      } catch (err) {
        dispatch(addOrUpdateAddressErrorAction(err));
      }
    }
  };

export const removeAddress =
  (uid: string) => async (dispatch, getState: () => IApplicationStore) => {
    dispatch(removeAddressAction());
    const state = getState();
    try {
      const address = state.sessionReducer.profile.addresses.find((item) => item.uid === uid);

      const result = await new AccountAddressWsControllerApi().deleteAddressUsingDELETE({
        address,
      });

      handleResponseAndThrowAnErrorIfExists(result);

      const addresses = result.account.addresses;
      dispatch(removeAddressSuccessAction(addresses));
    } catch (err) {
      dispatch(removeAddressErrorAction(err));
    }
  };

export const updateSettings = (settings: any) => async (dispatch) => {
  dispatch(updateSettingsAction());

  try {
    const request = {
      settings: settings,
    };
    const result = await new AccountWsControllerApi().addSettingsUsingPOST(request);

    handleResponseAndThrowAnErrorIfExists(result);

    const profile = result.account;

    dispatch(updateSettingsSuccessAction(profile));
  } catch (err) {
    dispatch(updateSettingsErrorAction(err));
  }
};
