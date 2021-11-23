import { client, commonapiURL } from "@/axios";
import { IProduct } from "@/reducers/productReducer";
import { IApplicationStore } from "@/store/rootReducer";
import { ClassificatorWsControllerApi, Country, Currency } from "@/types/commonapi";
import { Classificator, ClassificatorControllerApi } from "@/types/marketplaceapi";

export const CLASSIFICATOR_LIST_LOADING = "CLASSIFICATOR_LIST_LOADING";
export const CLASSIFICATOR_LIST_LOADING_SUCCESS = "CLASSIFICATOR_LIST_LOADING_SUCCESS";
export const CLASSIFICATOR_LIST_LOADING_ERROR = "CLASSIFICATOR_LIST_LOADING_ERROR";

export const CHANGE_APP_LANGUAGE = "CHANGE_APP_LANGUAGE";

const classificatorListLoadingAction = () => ({
  type: CLASSIFICATOR_LIST_LOADING,
});

const classificatorListLoadingSuccessAction = (
  classificatorType: EntityClassificatorType,
  items: Classificator[]
) => ({
  type: CLASSIFICATOR_LIST_LOADING_SUCCESS,
  classificatorType,
  items,
});

const currencyClassificatorListLoadingSuccessAction = (currencyClassificator: Currency[]) => ({
  type: CLASSIFICATOR_LIST_LOADING_SUCCESS,
  currencyClassificator,
});

const countryClassificatorListLoadingSuccessAction = (countryClassificator: Country[]) => ({
  type: CLASSIFICATOR_LIST_LOADING_SUCCESS,
  countryClassificator,
});

const classificatorListLoadingErrorAction = (error: unknown) => ({
  type: CLASSIFICATOR_LIST_LOADING_ERROR,
  error,
});

const claimSubjectClassificatorListLoadingSuccessAction = (
  subjectType: ClaimSubjectClassificatorType,
  items: Classificator[]
) => ({
  type: CLASSIFICATOR_LIST_LOADING_SUCCESS,
  subjectType,
  items,
});

export const fillClassificatorProductStatusValue = (
  products: IProduct[],
  state: IApplicationStore
) => {
  const { Product_Status } = state.classificatorReducer.entitiesClassificators;
  products.forEach((item) => {
    const status = Product_Status.filter((status) => status.code === item.status.toString())[0];
    if (status) item.statusValue = status.value;
  });
};

export const changeLanguage = (language: string) => ({
  type: CHANGE_APP_LANGUAGE,
  language,
});

export type EntityClassificatorType =
  | "Product_Status"
  | "Account_Status"
  | "Account_Type"
  | "Payment_Options"
  | "Delivery_Prices"
  | "Delivery_Duration"
  | "Order_State"
  | "Url_app"
  | "Company_BusinessType";

// ? maybe 'MyProduct' shouldnt be there
export type ClaimSubjectClassificatorType = "Application" | "Order" | "Product" | "MyProduct";

export const loadClassificator =
  (classificatorType: EntityClassificatorType) =>
  async (dispatch, getState: () => IApplicationStore) => {
    dispatch(classificatorListLoadingAction());
    try {
      const entityFields = classificatorType.toString().split("_");
      const entity = entityFields[0];
      let field = entityFields[1];

      const state = getState();
      const app = state.rootReducer.localConfig.appCode;

      if (entity === "Url") {
        field = app;
      }

      /* TODO */
      if (
        entity === "Product" ||
        entity === "Payment" ||
        entity === "Delivery" ||
        entity === "Order"
      ) {
        dispatch(
          classificatorListLoadingSuccessAction(
            classificatorType,
            (
              await new ClassificatorControllerApi().entityListUsingGET(
                entity,
                field,
                state.rootReducer.language
              )
            ).body || []
          )
        );
      } else if (entity === "Account" || entity === "Url" || entity == "Company") {
        dispatch(
          classificatorListLoadingSuccessAction(
            classificatorType,
            (
              await new ClassificatorWsControllerApi().getClassificatorByEntityAndFieldUsingGET(
                entity,
                field,
                state.rootReducer.language
              )
            ).classificatorList || []
          )
        );
      } else {
        throw new Error("Check entity name!");
      }
    } catch (err) {
      dispatch(classificatorListLoadingErrorAction(err.toString()));
    }
  };

export const loadClaimSubjectsClassificator =
  (subjectType: ClaimSubjectClassificatorType) =>
  async (dispatch, getState: () => IApplicationStore) => {
    dispatch(classificatorListLoadingAction());

    const state = getState();
    try {
      dispatch(
        claimSubjectClassificatorListLoadingSuccessAction(
          subjectType,
          (
            await new ClassificatorControllerApi().entityListUsingGET(
              "ClaimSubjects",
              subjectType,
              state.rootReducer.language
            )
          ).body || []
        )
      );
    } catch (err) {
      dispatch(classificatorListLoadingErrorAction(err.toString()));
    }
  };

const getActiveSTypeCurrencyList = async (lng = "en") =>
  (await new ClassificatorWsControllerApi().getCurrencyListUsingGET(true, lng, false, "S"))
    .currencyList;

export const loadCurrencyClassificator =
  () => async (dispatch, getState: () => IApplicationStore) => {
    dispatch(classificatorListLoadingAction());

    const state = getState();

    try {
      dispatch(
        currencyClassificatorListLoadingSuccessAction(
          await getActiveSTypeCurrencyList(state.rootReducer.language)
        )
      );
    } catch (err) {
      dispatch(classificatorListLoadingErrorAction(err.toString()));
    }
  };

const getActiveCountryList = async (lng = "en") =>
  (await new ClassificatorWsControllerApi().getCountryListUsingGET(lng)).countryList;

export const loadCountryClassificator =
  () => async (dispatch, getState: () => IApplicationStore) => {
    dispatch(classificatorListLoadingAction());

    const state = getState();

    try {
      dispatch(
        countryClassificatorListLoadingSuccessAction(
          await getActiveCountryList(state.rootReducer.language)
        )
      );
    } catch (err) {
      dispatch(classificatorListLoadingErrorAction(err.toString()));
    }
  };

export async function getAvailableLanguage(language: string) {
  const response = await client.get(
    commonapiURL + `/classificator/AvailableLanguage?language=${language}`
  );
  return response.data.languageList[0].code;
}
