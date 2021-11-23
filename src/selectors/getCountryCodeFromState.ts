import { IApplicationStore } from "@/store/rootReducer";

export const getCountryCodeFromState = (state: IApplicationStore): string =>
  state?.customerLocationReducer?.country?.code ||
  state?.sessionReducer?.profile?.country?.code ||
  "";
