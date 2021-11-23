import { AnyAction } from "redux";

import {
  ACCOUNT_UPDATE_SETTINGS,
  ACCOUNT_UPDATE_SETTINGS_ERROR,
  ACCOUNT_UPDATE_SETTINGS_SUCCESS,
  PROFILE_UPDATING,
  PROFILE_UPDATING_ERROR,
  PROFILE_UPDATING_SUCCESS,
} from "@/actions/profileActions";

import { Profile } from "./sessionReducer";

export interface IProfileState {
  profile?: Profile;
  updating?: boolean;
  error?: unknown;
}

const initialState: IProfileState = {
  profile: {},
  updating: false,
  error: null,
};

const profileReducer = (state = initialState, action: AnyAction): IProfileState => {
  switch (action.type) {
    case PROFILE_UPDATING:
      return {
        ...state,
        updating: true,
        error: null,
      };
    case PROFILE_UPDATING_SUCCESS:
      return {
        ...state,
        updating: false,
        profile: action.profile,
      };
    case PROFILE_UPDATING_ERROR:
      return {
        ...state,
        updating: false,
        error: action.error,
      };
    case ACCOUNT_UPDATE_SETTINGS:
      return {
        ...state,
        updating: true,
        error: null,
      };
    case ACCOUNT_UPDATE_SETTINGS_SUCCESS:
      return {
        ...state,
        updating: false,
        profile: action.profile,
      };
    case ACCOUNT_UPDATE_SETTINGS_ERROR:
      return {
        ...state,
        updating: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default profileReducer;
