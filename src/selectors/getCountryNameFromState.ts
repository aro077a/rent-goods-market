import { IApplicationStore } from "@/store/rootReducer";

export const getCountryNameFromState = (state: IApplicationStore): string =>
  state?.customerLocationReducer?.country?.name ||
  state?.sessionReducer?.profile?.country?.name ||
  "";
