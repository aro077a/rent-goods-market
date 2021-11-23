import { FetchAPI } from "../types/marketplaceapi";
import { client } from ".";
import { AxiosRequestConfig } from "axios";

const portableFetch: FetchAPI = (
  url: string,
  init?: any
): Promise<Response> => {
  const config: AxiosRequestConfig = {
    url,
    data: init.body,
    ...init,
  };
  return client.request(config).then((res) => {
    return {
      ...res,
      json: () => res.data,
    };
  }) as any;
};

export default portableFetch;
