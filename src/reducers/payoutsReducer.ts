import { AnyAction } from "redux";
import {
  PAYOUT_SETTINGS_LOADING,
  PAYOUT_SETTINGS_LOADING_ERROR,
  PAYOUT_SETTINGS_LOADING_SUCCESS,
  PAYOUT_SETTINGS_UPDATING,
  PAYOUT_SETTINGS_UPDATE_SUCCESS,
  PAYOUT_SETTINGS_SELECT_INTERVAL,
  PAYOUT_SETTINGS_REMOVING,
  PAYOUT_SETTINGS_REMOVE_SUCCESS,
} from "../actions/payoutsActions";
import { AccountPayoutSettings } from "../types/commonapi";

export type PayoutInterval = "weekly" | "bi-weekly" | "monthly";

export interface IPayoutsState {
  loading?: boolean;
  updating?: boolean;
  error?: any;
  interval?: PayoutInterval;
  settings?: AccountPayoutSettings;
}

const initialState: IPayoutsState = {
  loading: false,
  updating: false,
  interval: "weekly",
  settings: {
    interval: "weekly",
    bankAccount: {
      bankAccountUid: null,
      accountNumber: null,
      bankName: null,
      countryCode: null,
      holderAddress: null,
      holderCountryCode: null,
      holderName: null,
      swiftCode: null,
    },
    pspCode: null,
    externalAccount: {},
  },
};

const payoutsReducer = (
  state = initialState,
  action: AnyAction
): IPayoutsState => {
  switch (action.type) {
    case PAYOUT_SETTINGS_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case PAYOUT_SETTINGS_UPDATING:
    case PAYOUT_SETTINGS_REMOVING:
      return {
        ...state,
        updating: true,
        error: null,
      };
    case PAYOUT_SETTINGS_LOADING_SUCCESS:
      if (Object.keys(action.settings).length === 0) {
        action.settings = initialState.settings;
      }
      return {
        ...state,
        loading: false,
        settings: action.settings,
        interval: action.settings.interval,
      };
    case PAYOUT_SETTINGS_UPDATE_SUCCESS:
      return {
        ...state,
        updating: false,
        settings: action.settings,
        interval: action.settings.interval,
      };
    case PAYOUT_SETTINGS_REMOVE_SUCCESS:
      initialState.settings.pspCode = null;
      return {
        ...state,
        updating: false,
        settings: initialState.settings,
      };
    case PAYOUT_SETTINGS_LOADING_ERROR:
      return {
        ...state,
        loading: false,
        updating: false,
        error: action.error,
      };
    case PAYOUT_SETTINGS_SELECT_INTERVAL:
      const settings = state.settings;
      settings.interval = action.interval;
      return {
        ...state,
        settings: settings,
        interval: action.interval,
      };
    default:
      return state;
  }
};

export default payoutsReducer;
