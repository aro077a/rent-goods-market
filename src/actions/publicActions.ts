import { getCountryCodeFromState } from "@/selectors/getCountryCodeFromState";
import { isLoggedIn } from "@/selectors/isLoggedIn";
import { IApplicationStore } from "@/store/rootReducer";
import { ProductControllerApi, PublicControllerApi } from "@/types/marketplaceapi";

export const productSearchByType =
  (listType: string) => async (_, getState: () => IApplicationStore) => {
    const state = getState();

    try {
      const { language } = state.rootReducer;

      const res = isLoggedIn(state)
        ? await new ProductControllerApi().productWidgetListUsingGET(
            listType,
            getCountryCodeFromState(state),
            language
          )
        : await new PublicControllerApi().productWidgetListUsingGET1(listType, language);
      console.warn("at productSearchByType in publicActions", res);

      return res.body || [];
    } catch (error) {
      console.error("at productSearchByType in publicActions", error);
      return [];
    }
  };
