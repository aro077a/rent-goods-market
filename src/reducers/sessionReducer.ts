import { AnyAction } from "redux";

import {
  ACCOUNT_ADD_UPDATE_ADDRESS,
  ACCOUNT_ADD_UPDATE_ADDRESS_ERROR,
  ACCOUNT_ADD_UPDATE_ADDRESS_SUCCESS,
  ACCOUNT_REMOVE_ADDRESS,
  ACCOUNT_REMOVE_ADDRESS_ERROR,
  ACCOUNT_REMOVE_ADDRESS_SUCCESS,
} from "@/actions/profileActions";
import {
  AUTHORIZATION_CODE_ERROR,
  AUTHORIZATION_CODE_LOADING,
  AUTHORIZATION_CODE_SUCCESS,
  CHANGE_PASSWORD_ERROR,
  CHANGE_PASSWORD_LOADING,
  CHANGE_PASSWORD_SUCCESS,
  ONETIME_PASSWORD_ERROR,
  ONETIME_PASSWORD_LOADING,
  ONETIME_PASSWORD_LOGIN_ERROR,
  ONETIME_PASSWORD_LOGIN_LOADING,
  ONETIME_PASSWORD_LOGIN_SUCCESS,
  ONETIME_PASSWORD_SUCCESS,
  REGISTRATION_ERROR,
  REGISTRATION_LOADING,
  REGISTRATION_SUCCESS,
  REQUEST_CHANGE,
  SESSION_ERROR,
  SESSION_LOADING,
  SESSION_LOGOUT,
  SESSION_RESTORING,
  SESSION_SUCCESS,
  UPDATE_PROFILE_ERROR,
  UPDATE_PROFILE_LOADING,
  UPDATE_PROFILE_SUCCESS,
  VALIDATION_LOADING,
  VALIDATION_SUCCESS,
} from "@/actions/sessionActions";
import { Account, CommonApiResponse, CreatePersonalAccountRequest } from "@/types/commonapi";

export interface Token extends CommonApiResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  active: boolean;
}

export type Profile = Account;

export interface CreateAccountRequest extends CreatePersonalAccountRequest {
  phone: string;
  passwordRepeat: string;
  accept: boolean;
  referalCode: string;
  city?: string;
  addressLine?: string;
  postalCode?: string;
}

export type CreateAccountField = keyof CreateAccountRequest;

export interface ICreateAccountFormError {
  message: string;
  parameters: CreateAccountField[];
}

export interface ISessionState {
  restoring: boolean;
  loading: boolean;
  profile?: Profile;
  error: unknown;
  logged: boolean;
  registered: boolean;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  formErrors: ICreateAccountFormError[];
  request: CreateAccountRequest;
  registrationLoading: boolean;
  accountAddressState: {
    accountAddOrUpdateAddressLoading?: boolean;
    accountAddOrUpdateAddressError?: boolean;
    accountRemoveAddressLoading?: boolean;
    accountRemoveAddressError?: boolean;
  };
  authorizationCodeLoading: boolean;
  authorizationCode?: string;
  authorizationCodeError?: unknown;
  passwordResetLoading: boolean;
  passwordLoginLoading: boolean;
  passwordChangeLoading: boolean;
  passwordError: unknown;
}

const emptyRequest: CreateAccountRequest = {
  firstName: "",
  lastName: "",
  birthDate: null,
  email: "",
  phone: "",
  country: "",
  city: "",
  postalCode: "",
  addressLine: "",
  password: "",
  passwordRepeat: "",
  referalCode: "",
  accept: false,
};

const initialState: ISessionState = {
  restoring: false,
  loading: false,
  profile: null,
  error: null,
  logged: false,
  registered: false,
  accessToken: null,
  expiresIn: null,
  refreshToken: null,
  formErrors: [],
  request: { ...emptyRequest },
  registrationLoading: false,
  accountAddressState: {
    accountAddOrUpdateAddressLoading: false,
    accountAddOrUpdateAddressError: null,
    accountRemoveAddressLoading: false,
    accountRemoveAddressError: null,
  },
  authorizationCodeLoading: false,
  authorizationCode: null,
  authorizationCodeError: null,
  passwordResetLoading: false,
  passwordLoginLoading: false,
  passwordChangeLoading: false,
  passwordError: null,
};

const sessionReducer = (state = initialState, action: AnyAction): ISessionState => {
  switch (action.type) {
    case SESSION_RESTORING:
      return {
        ...state,
        restoring: true,
      };
    case SESSION_LOADING:
      return {
        ...state,
        restoring: false,
        loading: true,
        error: null,
      };
    case SESSION_SUCCESS:
      return {
        ...state,
        restoring: false,
        loading: false,
        profile: action.profile,
        error: null,
        logged: !!action.profile,
        ...action.authData,
      };
    case SESSION_ERROR:
      return {
        ...state,
        restoring: false,
        loading: false,
        profile: null,
        error: action.error,
        logged: false,
      };
    case SESSION_LOGOUT:
      return { ...initialState };
    case REQUEST_CHANGE:
      return {
        ...state,
        request: { ...state.request, ...action.request },
      };
    case REGISTRATION_LOADING:
      return {
        ...state,
        restoring: false,
        loading: false,
        error: null,
        formErrors: initialState.formErrors,
        logged: false,
        registered: false,
        registrationLoading: true,
      };
    case VALIDATION_LOADING:
      return {
        ...state,
        restoring: false,
        loading: false,
        error: null,
        formErrors: initialState.formErrors,
        logged: false,
        registered: false,
        registrationLoading: true,
      };
    case VALIDATION_SUCCESS:
      return {
        ...state,
        restoring: false,
        loading: false,
        error: null,
        formErrors: initialState.formErrors,
        logged: false,
        registered: false,
        registrationLoading: false,
      };
    case REGISTRATION_SUCCESS:
      return {
        ...state,
        restoring: false,
        loading: false,
        //profile: action.profile,
        error: null,
        logged: false,
        registered: true,
        registrationLoading: false,
      };
    case REGISTRATION_ERROR:
      return {
        ...state,
        restoring: false,
        loading: false,
        profile: null,
        error: action.error.message,
        logged: false,
        registered: false,
        registrationLoading: false,
        formErrors: action.error ? [...state.formErrors, action.error] : state.formErrors,
      };
    case ONETIME_PASSWORD_LOADING:
      return {
        ...state,
        passwordError: null,
        logged: false,
        profile: null,
        passwordResetLoading: true,
      };
    case ONETIME_PASSWORD_SUCCESS:
      return {
        ...state,
        passwordError: null,
        logged: false,
        profile: null,
        passwordResetLoading: false,
      };
    case ONETIME_PASSWORD_ERROR:
      return {
        ...state,
        passwordError: action.error,
        logged: false,
        profile: null,
        passwordResetLoading: false,
      };
    case ONETIME_PASSWORD_LOGIN_LOADING:
      return {
        ...state,
        passwordError: null,
        logged: false,
        profile: null,
        passwordLoginLoading: true,
      };
    case ONETIME_PASSWORD_LOGIN_SUCCESS:
      return {
        ...state,
        logged: true,
        profile: action.profile,
        passwordError: null,
        passwordLoginLoading: false,
        ...action.authData,
      };
    case ONETIME_PASSWORD_LOGIN_ERROR:
      return {
        ...state,
        passwordError: action.error,
        logged: false,
        profile: null,
        passwordLoginLoading: false,
      };
    case CHANGE_PASSWORD_LOADING:
      return {
        ...state,
        passwordError: null,
        passwordChangeLoading: true,
      };
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        passwordError: null,
        passwordChangeLoading: false,
      };
    case CHANGE_PASSWORD_ERROR:
      return {
        ...state,
        passwordError: action.error,
        passwordChangeLoading: false,
      };
    // case ACCOUNT_ADD_UPDATE_ADDRESS_SUCCESS:
    // case ACCOUNT_REMOVE_ADDRESS_SUCCESS: {
    //   const { addresses } = action;
    //   const { profile } = state;

    //   if (!profile) {
    //     return state;
    //   }

    //   profile.addresses = [...addresses];

    //   return {
    //     ...state,
    //     profile: { ...profile },
    //   };
    // }

    case ACCOUNT_ADD_UPDATE_ADDRESS_SUCCESS:
    case ACCOUNT_REMOVE_ADDRESS_SUCCESS: {
      const { addresses } = action;
      const { profile } = state;

      if (!profile) {
        return state;
      }

      profile.addresses = [...addresses];

      return {
        ...state,
        profile: { ...profile },
        accountAddressState: {
          ...state.accountAddressState,
          accountAddOrUpdateAddressLoading: false,
          accountAddOrUpdateAddressError: null,
        },
      };
    }
    case ACCOUNT_ADD_UPDATE_ADDRESS: {
      return {
        ...state,
        accountAddressState: {
          ...state.accountAddressState,
          accountAddOrUpdateAddressLoading: true,
          accountAddOrUpdateAddressError: null,
        },
      };
    }
    case ACCOUNT_ADD_UPDATE_ADDRESS_ERROR: {
      return {
        ...state,
        accountAddressState: {
          ...state.accountAddressState,
          accountAddOrUpdateAddressLoading: false,
          accountAddOrUpdateAddressError: action.error,
        },
      };
    }
    case ACCOUNT_REMOVE_ADDRESS: {
      return {
        ...state,
        accountAddressState: {
          ...state.accountAddressState,
          accountRemoveAddressLoading: true,
          accountRemoveAddressError: null,
        },
      };
    }
    case ACCOUNT_REMOVE_ADDRESS_ERROR: {
      return {
        ...state,
        accountAddressState: {
          ...state.accountAddressState,
          accountRemoveAddressLoading: false,
          accountRemoveAddressError: action.error,
        },
      };
    }
    case UPDATE_PROFILE_LOADING: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case UPDATE_PROFILE_SUCCESS: {
      const { profile } = action;
      return {
        ...state,
        loading: false,
        error: null,
        profile,
      };
    }
    case UPDATE_PROFILE_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }
    case AUTHORIZATION_CODE_LOADING:
      return {
        ...state,
        authorizationCodeLoading: true,
        authorizationCode: null,
        authorizationCodeError: null,
      };
    case AUTHORIZATION_CODE_SUCCESS:
      return {
        ...state,
        authorizationCodeLoading: false,
        authorizationCode: action.code,
        authorizationCodeError: null,
      };
    case AUTHORIZATION_CODE_ERROR:
      return {
        ...state,
        authorizationCodeLoading: false,
        authorizationCode: null,
        authorizationCodeError: action.error,
      };
    default:
      return state;
  }
};

export default sessionReducer;
