import { AccountPayoutSettings, AccountPayoutWsControllerApi } from "@/types/commonapi";
import { handleResponseAndThrowAnErrorIfExists } from "@/error-handler";

export const PAYOUT_SETTINGS_LOADING = "PAYOUT_SETTINGS_LOADING";
export const PAYOUT_SETTINGS_LOADING_SUCCESS = "PAYOUT_SETTINGS_LOADING_SUCCESS";
export const PAYOUT_SETTINGS_UPDATING = "PAYOUT_SETTINGS_UPDATING";
export const PAYOUT_SETTINGS_UPDATE_SUCCESS = "PAYOUT_SETTINGS_UPDATE_SUCCESS";
export const PAYOUT_SETTINGS_LOADING_ERROR = "PAYOUT_SETTINGS_LOADING_ERROR";
export const PAYOUT_SETTINGS_SELECT_INTERVAL = "PAYOUT_SETTINGS_SELECT_INTERVAL";
export const PAYOUT_SETTINGS_REMOVING = "PAYOUT_SETTINGS_REMOVING";
export const PAYOUT_SETTINGS_REMOVE_SUCCESS = "PAYOUT_SETTINGS_REMOVE_SUCCESS";

const payoutSettingsLoadingAction = () => ({
  type: PAYOUT_SETTINGS_LOADING,
});

const payoutSettingsUpdatingAction = () => ({
  type: PAYOUT_SETTINGS_UPDATING,
});

const payoutSettingsLoadingSuccessAction = (settings: AccountPayoutSettings) => ({
  type: PAYOUT_SETTINGS_LOADING_SUCCESS,
  settings,
});

const payoutSettingsUpdateSuccessAction = (settings: AccountPayoutSettings) => ({
  type: PAYOUT_SETTINGS_UPDATE_SUCCESS,
  settings,
});

const payoutSettingsLoadingErrorAction = (error: unknown) => ({
  type: PAYOUT_SETTINGS_LOADING_ERROR,
  error,
});

const payoutSettingsRemovingAction = () => ({
  type: PAYOUT_SETTINGS_REMOVING,
});

const payoutSettingsRemovingSuccessAction = () => ({
  type: PAYOUT_SETTINGS_REMOVE_SUCCESS,
});

export const loadPayoutSettings = () => async (dispatch) => {
  dispatch(payoutSettingsLoadingAction());
  try {
    const response = await new AccountPayoutWsControllerApi().getAccountPayoutSettingsUsingPOST({});
    handleResponseAndThrowAnErrorIfExists(response);
    dispatch(payoutSettingsLoadingSuccessAction(response.payoutSettings));
  } catch (error) {
    console.error("at payoutsActions in loadPayoutSettings", error);

    dispatch(payoutSettingsLoadingErrorAction(error.toString()));
  }
};

export const updatePayoutSettings = (settings: AccountPayoutSettings) => async (dispatch) => {
  dispatch(payoutSettingsUpdatingAction());
  try {
    const request: AccountPayoutSettings = {
      interval: settings.interval,
    };

    if (settings.pspCode) {
      request.pspCode = settings.pspCode;
    } else if (settings.bankAccount && !settings.bankAccount.type) {
      request.bankAccount = settings.bankAccount;
      request.bankAccount.type = "I";
    }

    const response = await new AccountPayoutWsControllerApi().updateAccountPayoutSettingsUsingPOST({
      payoutSettings: request,
    });
    handleResponseAndThrowAnErrorIfExists(response);
    dispatch(payoutSettingsUpdateSuccessAction(response.payoutSettings));
  } catch (error) {
    console.error("at payoutsActions in updatePayoutSettings", error);

    dispatch(payoutSettingsLoadingErrorAction(error.toString()));
  }
};

export const removePayoutSettings = () => async (dispatch) => {
  dispatch(payoutSettingsRemovingAction());
  try {
    const response =
      await new AccountPayoutWsControllerApi().deleteAccountPayoutSettingsUsingDELETE({});
    handleResponseAndThrowAnErrorIfExists(response);
    dispatch(payoutSettingsRemovingSuccessAction());
  } catch (error) {
    console.error("at payoutsActions in removePayoutSettings", error);

    dispatch(payoutSettingsLoadingErrorAction(error.toString()));
  }
};

export const selectPayoutInterval = (interval: string) => (dispatch) => {
  dispatch({
    type: PAYOUT_SETTINGS_SELECT_INTERVAL,
    interval,
  });
};
