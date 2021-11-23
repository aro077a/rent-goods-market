import { Dispatch } from "react";

import { client, commonapiURL } from "@/axios";
import {
  CreateAccountField,
  CreateAccountRequest,
  ICreateAccountFormError,
  Profile,
  Token,
} from "@/reducers/sessionReducer";
import { IApplicationStore } from "@/store/rootReducer";
import {
  Account,
  AccountForgotPasswordRequest,
  AccountPhone,
  AccountResetPasswordRequest,
  AccountWsControllerApi,
} from "@/types/commonapi";
import { getAuthCodeFromURL, getQueryParameterFromURL, isDefined, isEmail, isPhone } from "@/utils";

import { CHANGE_APP_LANGUAGE } from "./classificatorActions";
import { loadMyCurrencies } from "./myCurrenciesActions";

export const CHANGE_LANGUAGE = "CHANGE_LANGUAGE";

export const SESSION_RESTORING = "SESSION_RESTORING";
export const SESSION_LOADING = "SESSION_LOADING";
export const SESSION_SUCCESS = "SESSION_SUCCESS";
export const SESSION_LOGOUT = "SESSION_LOGOUT";
export const SESSION_ERROR = "SESSION_ERROR";
export const VALIDATION_LOADING = "VALIDATION_LOADING";
export const VALIDATION_SUCCESS = "VALIDATION_SUCCESS";
export const REGISTRATION_LOADING = "REGISTRATION_LOADING";
export const REGISTRATION_SUCCESS = "REGISTRATION_SUCCESS";
export const REGISTRATION_ERROR = "REGISTRATION_ERROR";
export const UPDATE_PROFILE_LOADING = "UPDATE_PROFILE_LOADING";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_ERROR = "UPDATE_PROFILE_ERROR";
export const AUTHORIZATION_CODE_LOADING = "AUTHORIZATION_CODE_LOADING";
export const AUTHORIZATION_CODE_SUCCESS = "AUTHORIZATION_CODE_SUCCESS";
export const AUTHORIZATION_CODE_ERROR = "AUTHORIZATION_CODE_ERROR";

export const ONETIME_PASSWORD_LOADING = "ONETIME_PASSWORD_LOADING";
export const ONETIME_PASSWORD_SUCCESS = "ONETIME_PASSWORD_SUCCESS";
export const ONETIME_PASSWORD_ERROR = "ONETIME_PASSWORD_ERROR";
export const ONETIME_PASSWORD_LOGIN_LOADING = "ONETIME_PASSWORD_LOGIN_LOADING";
export const ONETIME_PASSWORD_LOGIN_SUCCESS = "ONETIME_PASSWORD_LOGIN_SUCCESS";
export const ONETIME_PASSWORD_LOGIN_ERROR = "ONETIME_PASSWORD_LOGIN_ERROR";
export const CHANGE_PASSWORD_LOADING = "CHANGE_PASSWORD_LOADING";
export const CHANGE_PASSWORD_SUCCESS = "CHANGE_PASSWORD_SUCCESS";
export const CHANGE_PASSWORD_ERROR = "CHANGE_PASSWORD_ERROR";

export const REQUEST_CHANGE = "REGISTRATION_REQUEST_CHANGE";

const sessionRestoring = () => ({
  type: SESSION_RESTORING,
});

const sessionLoading = () => ({
  type: SESSION_LOADING,
});

const sessionSuccess = (profile: Profile, authData: Token) => ({
  type: SESSION_SUCCESS,
  profile,
  authData,
});

const sessionError = (error: unknown) => ({
  type: SESSION_ERROR,
  error,
});

const sessionLogout = () => ({
  type: SESSION_LOGOUT,
});

const validationLoading = () => ({
  type: VALIDATION_LOADING,
});

const validationSuccess = () => ({
  type: VALIDATION_SUCCESS,
});

const registrationLoading = () => ({
  type: REGISTRATION_LOADING,
});

const registrationSuccess = (profile: Profile) => ({
  type: REGISTRATION_SUCCESS,
  profile,
});

const changeLanguage = (language: string) => ({
  type: CHANGE_APP_LANGUAGE,
  language,
});

const registrationError = (error: ICreateAccountFormError) => ({
  type: REGISTRATION_ERROR,
  error,
});

const updateProfileLoading = () => ({
  type: UPDATE_PROFILE_LOADING,
});

const updateProfileSuccess = (profile: Profile) => ({
  type: UPDATE_PROFILE_SUCCESS,
  profile,
});

const updateProfileError = (error: unknown) => ({
  type: UPDATE_PROFILE_ERROR,
  error,
});

const authorizationCodeLoading = () => ({
  type: AUTHORIZATION_CODE_LOADING,
});

const authorizationCodeSuccess = (code: string) => ({
  type: AUTHORIZATION_CODE_SUCCESS,
  code,
});

const authorizationCodeError = (error: unknown) => ({
  type: AUTHORIZATION_CODE_ERROR,
  error,
});

const changePasswordLoading = () => ({
  type: CHANGE_PASSWORD_LOADING,
});

const changePasswordError = (error: unknown) => ({
  type: CHANGE_PASSWORD_ERROR,
  error,
});

const changePasswordSuccess = () => ({
  type: CHANGE_PASSWORD_SUCCESS,
});

const oneTimePasswordLoading = () => ({
  type: ONETIME_PASSWORD_LOADING,
});

const oneTimePasswordSuccess = () => ({
  type: ONETIME_PASSWORD_SUCCESS,
});

const oneTimePasswordError = (error: unknown) => ({
  type: ONETIME_PASSWORD_ERROR,
  error,
});

const oneTimePasswordLoginLoading = () => ({
  type: ONETIME_PASSWORD_LOGIN_LOADING,
});

const oneTimePasswordLoginSuccess = (profile: Account, authData: Token) => ({
  type: ONETIME_PASSWORD_LOGIN_SUCCESS,
  profile,
  authData,
});

const oneTimePasswordLoginError = (error: unknown) => ({
  type: ONETIME_PASSWORD_LOGIN_ERROR,
  error,
});

const requestChange = (request: Partial<CreateAccountRequest>) => ({
  type: REQUEST_CHANGE,
  request,
});

const requiredFields = [
  "email",
  "phone",
  "password",
  "passwordRepeat",
  "firstName",
  "lastName",
  "accept",
  "referalCode",
  "country",
] as const;

export type RequiredRegField = typeof requiredFields[number];

export const changeRegistrationRequest = (dispatch, request: Partial<CreateAccountRequest>) =>
  dispatch(requestChange(request));

export const replaceAccountLanguage =
  (account: Account) => (dispatch, getState: () => IApplicationStore) => {
    const { isLanguageChanged } = getState().rootReducer;
    if (!isLanguageChanged && account && (account.language || account.communicationLanguage)) {
      const languageQueryParam = getQueryParameterFromURL("language");
      const accountLanguage = account.language || account.communicationLanguage;
      if (!languageQueryParam && accountLanguage) {
        dispatch(changeLanguage(accountLanguage.code));
      }
    }
  };

const getAuthorizationCodeByUsernamePassword = async (username: string, password: string) => {
  const res = await client.post(commonapiURL + `/auth/mobile/authorization_code`, {
    username,
    password,
  });
  const { code } = res.data;
  return code;
};

const getAuthorizationCodeByAccessToken = async (accessToken: string) => {
  const res = await client.post(commonapiURL + `/auth/mobile/authorization_code`, { accessToken });
  const { code } = res.data;
  return code;
};

const getAuthorizationData = async (code: string) => {
  const res = await client.post(commonapiURL + `/auth/mobile/token`, { code });
  return { ...res.data };
};

const fetchProfile = async () => {
  return (await new AccountWsControllerApi().getFullAccountUsingPOST()).account;
};

export const restoreSession = () => (dispatch: Dispatch<unknown>) => {
  const user = {};
  dispatch(sessionLoading());
  dispatch(sessionRestoring());
  dispatch(sessionSuccess(user, null));
};

export const loginWithCode = (code: string) => async (dispatch: Dispatch<unknown>) => {
  dispatch(sessionLoading());
  try {
    const authData: Token = await getAuthorizationData(code);
    if (!authData) {
      throw new Error("Auth data is null.");
    }
    const profile = await fetchProfile();
    dispatch(loadMyCurrencies());
    dispatch(sessionSuccess(profile, authData));
    dispatch(replaceAccountLanguage(profile));
  } catch (error) {
    console.error("at sessionActions in restoreSession", error);
    dispatch(sessionError(error.toString()));
  }
};

const getAuthorizationDataByUsernameAndPassword = async (username: string, password: string) => {
  const res = await client.post(commonapiURL + `/auth/mobile/token`, { username, password });
  return { ...res.data };
};

export const loginWithUserPassword =
  (username: string, password: string) => async (dispatch: Dispatch<unknown>) => {
    dispatch(sessionLoading());
    try {
      if (!username || !password) {
        throw new Error("Empty username or password");
      }
      //const code: string = await getAuthorizationCode(username, password);
      const authData: Token = await getAuthorizationDataByUsernameAndPassword(username, password);
      if (!authData || !authData.accessToken) {
        throw new Error("Authentication error");
      }
      const profile = await fetchProfile();
      dispatch(loadMyCurrencies());
      dispatch(sessionSuccess(profile, authData));
    } catch (error) {
      console.error("at sessionActions in loginWithUserPassword", error);
      dispatch(sessionError(error.toString()));
    }
  };

export const authByUrl = () => async (dispatch: Dispatch<unknown>) => {
  const authCode = getAuthCodeFromURL();
  return authCode
    ? dispatch(loginWithCode(authCode))
    : process.env.USERNAME &&
        process.env.PASSWORD &&
        dispatch(loginWithUserPassword(process.env.USERNAME, process.env.PASSWORD));
};

export const updateProfile = async (dispatch: Dispatch<unknown>) => {
  dispatch(updateProfileLoading());
  try {
    const profile = await fetchProfile();
    dispatch(updateProfileSuccess(profile));
  } catch (error) {
    console.error("at sessionActions in updateProfile", error);
    dispatch(updateProfileError(error.toString()));
  }
};

export const createAuthorizationCode =
  () => async (dispatch: Dispatch<unknown>, getState: () => IApplicationStore) => {
    dispatch(authorizationCodeLoading());
    try {
      const accessToken = getState().sessionReducer.accessToken;
      const code: string = await getAuthorizationCodeByAccessToken(accessToken);
      dispatch(authorizationCodeSuccess(code));
    } catch (error) {
      console.error("at sessionActions in createAuthorizationCode", error);
      dispatch(authorizationCodeError(error.toString()));
    }
  };

const checkRegistrationFormErrors = (
  request: CreateAccountRequest,
  fields: readonly CreateAccountField[]
) => fields.flatMap<CreateAccountField>((field) => (!isDefined(request[field]) ? field : []));

const SPECIAL_CHARS_REGEX = /[!@#$%^&*-]+/;
const LETTERS_REGEX = /[a-z]+/;
const UPPER_LETTERS_REGEX = /[A-Z]+/;
const NUMBER_REGEX = /[0-9]+/;
const STRONG_PASSWORD_REGEX = /^[!@#$%^&*a-zA-Z0-9-]+$/;

const isValidPassword = (password: string) => {
  const isOutOfRange = password.length > 50 || password.length < 8;
  const passwordValid =
    password.length < 12
      ? SPECIAL_CHARS_REGEX.test(password) &&
        LETTERS_REGEX.test(password) &&
        UPPER_LETTERS_REGEX.test(password) &&
        NUMBER_REGEX.test(password) &&
        STRONG_PASSWORD_REGEX.test(password)
      : STRONG_PASSWORD_REGEX.test(password);

  return !isOutOfRange && passwordValid;
};

const constructPhone = (request: CreateAccountRequest) =>
  request.mobilePhone?.countryCode.replace(/[+-]/g, "") + request.phone;

export const validateRequest =
  (request: CreateAccountRequest, fields: readonly CreateAccountField[]) =>
  (dispatch: Dispatch<unknown>) => {
    dispatch(validationLoading());

    const parameters = checkRegistrationFormErrors(request, fields);

    if (parameters.length) {
      dispatch(registrationError({ message: "Please fill out this field", parameters }));
      return;
    }

    if (!isEmail(request.email)) {
      dispatch(
        registrationError({
          message: "Please make sure your email is correct",
          parameters: ["email"],
        })
      );
      return;
    }

    if (!isPhone(constructPhone(request))) {
      dispatch(
        registrationError({
          message: "Please make sure your phone number is correct",
          parameters: ["phone"],
        })
      );
      return;
    }

    if (!isValidPassword(request.password)) {
      dispatch(
        registrationError({
          message:
            "Invalid password. The password must be at least 8 characters long and consist of uppercase and lowercase Latin letters of the as well as numbers and one of special characters [!@#$%^&*-]",
          parameters: ["password"],
        })
      );
      return;
    }

    if (request.password !== request.passwordRepeat) {
      dispatch(
        registrationError({
          message: "Please make sure your passwords match",
          parameters: ["password", "passwordRepeat"],
        })
      );
      return;
    }

    if (!request.accept) {
      dispatch(
        registrationError({
          message: "You must accept our Privacy Policy and Terms of Use before continue",
          parameters: ["accept"],
        })
      );
      return;
    }

    dispatch(validationSuccess());
  };

export const register =
  (request: CreateAccountRequest) =>
  async (dispatch: Dispatch<unknown>, getState: () => IApplicationStore) => {
    dispatch(registrationLoading());
    const state = getState();

    validateRequest(request, requiredFields);

    if (state.sessionReducer.error) {
      return;
    }

    // request.address = {
    //   countryCode: request.country,
    //   city: request.city || "-",
    //   postalCode: request.postalCode || "-",
    //   firstAddressLine: request.addressLine || "-",
    // };

    request.mobilePhone = { fullNumber: constructPhone(request) } as AccountPhone;

    // delete request.city;
    // delete request.postalCode;
    // delete request.addressLine;
    // delete request.phone;
    // delete request.passwordRepeat;
    // delete request.accept;

    // const date = moment(request.birthDate, "YYYY-MM-DD");
    // request.birthDate = date.format("YYYYMMDDHHmmss");

    let profile: Profile;

    try {
      const response = await new AccountWsControllerApi().createPersonalAccountUsingPOST(request);

      if (response.errorData) {
        const errorMessage = response.errorData.errorMessage;
        const parameters = response.errorData.parameters || [];
        if (parameters.length > 0) {
          const error: ICreateAccountFormError = {
            message: errorMessage || "Please fill out this field.",
            parameters: [],
          };
          parameters.forEach((parameter: CreateAccountField) => {
            requiredFields.forEach((field) =>
              parameter.includes(field) ? error.parameters.push(field) : undefined
            );
          });
          dispatch(registrationError(error));
        } else {
          throw new Error(errorMessage);
        }
      }
      profile = response.account;
      dispatch(registrationSuccess(profile));
    } catch (err) {
      console.error("at sessionActions in register", err);
      dispatch(registrationError({ message: err.message, parameters: [] }));
      return;
    }
  };

export const logoutUser = () => sessionLogout();

export const changePassword = (password: string) => async (dispatch) => {
  dispatch(changePasswordLoading());
  try {
    if (!password) {
      throw new Error("Empty password");
    }
    const request: AccountResetPasswordRequest = {
      password: password,
    };
    const response = await new AccountWsControllerApi().resetPasswordUsingPOST(request);
    if (response.errorData && response.errorData.errorMessage) {
      dispatch(changePasswordError(response.errorData.errorMessage));
    } else {
      dispatch(changePasswordSuccess());
    }
  } catch (error) {
    console.error("at sessionActions in changePassword", error);
    dispatch(changePasswordError(error.toString()));
  }
};

export const loginWithOneTimePassword =
  (username: string, password: string) => async (dispatch) => {
    dispatch(oneTimePasswordLoginLoading());
    try {
      if (!username || !password) {
        throw new Error("Empty username or password");
      }
      const authData: Token = await getAuthorizationDataByUsernameAndPassword(username, password);
      if (authData.errorData && authData.errorData.errorMessage) {
        dispatch(oneTimePasswordLoginError(authData.errorData.errorMessage));
      } else {
        const profile = await fetchProfile();
        if (profile) {
          dispatch(loadMyCurrencies());
          dispatch(oneTimePasswordLoginSuccess(profile, authData));
        }
      }
    } catch (error) {
      console.error("at sessionActions in loginWithOneTimePassword", error);
      dispatch(oneTimePasswordLoginError(error.toString()));
    }
  };

export const oneTimePassword =
  (username: string) => async (dispatch, getState: () => IApplicationStore) => {
    dispatch(oneTimePasswordLoading());
    try {
      if (!username) {
        throw new Error("Empty username");
      }
      const state = getState();
      const request: AccountForgotPasswordRequest = {
        username: username,
        language: state.rootReducer.language,
      };
      const response = await new AccountWsControllerApi().oneTimePasswordUsingPOST(request);
      if (response.errorData && response.errorData.errorMessage) {
        dispatch(oneTimePasswordError(response.errorData.errorMessage));
      } else {
        dispatch(oneTimePasswordSuccess());
      }
    } catch (error) {
      console.error("at sessionActions in oneTimePassword", error);
      dispatch(oneTimePasswordError(error.toString()));
    }
  };
