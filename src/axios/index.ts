import axios, { AxiosRequestConfig } from "axios";
import * as Sentry from "@sentry/browser";
import { getQueryParameterFromURL } from "../utils";
import i18n from "i18next";

const apiURL = "";

export const requestConfig: AxiosRequestConfig = {
  baseURL: process.env.HOST + apiURL,
  responseType: "json",
  withCredentials: false,
};

export const client = axios.create(requestConfig);

client.interceptors.request.use(
  (config) => {
    addCompress(config);
    addLanguageQueryParameter(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (res) => {
    const { accessToken } = res.data;
    if (accessToken) {
      updateAxiosClientCredential(accessToken);
    }
    return res;
  },
  (error) => {
    Sentry.captureException(error);
    const { status } = error.response;
    if (status === 403) {
      // refresh token
      const prevReq: AxiosRequestConfig = error.config;
    }
    return error;
  }
);

let axiosCredentialInterceptorsId: number;

export const updateAxiosClientCredential = (accessToken: string) => {
  try {
    client.interceptors.request.eject(axiosCredentialInterceptorsId);
  } catch (error) {}

  axiosCredentialInterceptorsId = client.interceptors.request.use((config) => {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
    return config;
  });
};

const addLanguageQueryParameter = (config: AxiosRequestConfig) => {
  const language = i18n.language;
  if (language && config.url.indexOf("language=") === -1) {
    config.params = {
      language,
      ...config.params,
    };
  }
};

const addCompress = (config: AxiosRequestConfig) => {
  config.headers["Accept-Encoding"] = "qzip";
};

export const marketplaceapiURL = "/marketplaceapi";
export const commonapiURL = "/commonapi";
export const paymentapiURL = "/paymentapi";
