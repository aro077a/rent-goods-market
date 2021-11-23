import { Currency } from "@/types/commonapi";

export const getCurrencySymbol = (currencies: Currency[], currencyCode: string) => {
  return currencies.find((c) => c.code === currencyCode).symbol ?? "";
};
