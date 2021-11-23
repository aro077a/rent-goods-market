import React from "react";
import { I18nextProvider } from "react-i18next";
import { connect, Provider } from "react-redux";
import firebase from "firebase/app";
import moment from "moment";
import { PersistGate } from "redux-persist/integration/react";

import { loadCategories } from "./actions/categoryActions";
import {
  changeLanguage,
  ClaimSubjectClassificatorType,
  EntityClassificatorType,
  getAvailableLanguage,
  loadClaimSubjectsClassificator,
  loadClassificator,
  loadCountryClassificator,
  loadCurrencyClassificator,
} from "./actions/classificatorActions";
import { getAllDeliveryMethods } from "./actions/deliveryMethodsActions";
import { initGeolocation } from "./actions/geolocationActions";
import { authByUrl } from "./actions/sessionActions";
import { persistor, store } from "./components/App";
import { IClassificatorState } from "./reducers/classificatorReducer";
import { Profile } from "./reducers/sessionReducer";
import { getProfile } from "./selectors/profile";
import { IPreloaderProps } from "./store/connectPreloader";
import { IApplicationStore, ILocalConfig } from "./store/rootReducer";
import Analytics from "./analytics";
import F7App from "./F7App";
import i18n, { availableLanguages, language } from "./i18n";
import { getQueryParameterFromURL, loadLocalConfig, setLayoutTheme } from "./utils";

const loadingClassificatorTypes: EntityClassificatorType[] = [
  "Product_Status",
  "Account_Status",
  "Account_Type",
  "Payment_Options",
  "Delivery_Duration",
  "Delivery_Prices",
  "Order_State",
  "Url_app",
  "Company_BusinessType",
];

const loadingSubjectClassificatorTypes: ClaimSubjectClassificatorType[] = [
  "Application",
  "Order",
  "Product",
  "MyProduct",
];

type Props = IPreloaderProps & {
  profile?: Profile;
  loading?: boolean;
  error?: unknown;
  updateLocalConfig?: (localConfig: ILocalConfig) => void;
  authByUrl?: () => void;
  loadClassificators?: () => void;
  loadMyCurrencies?(): void;
  initGeolocation?(): void;
  classificators: IClassificatorState;
  changeLanguage?(language: string): void;
};

const checkTheme = () => {
  const isDarkModeEnabled = getQueryParameterFromURL("darkMode") === "true";
  setLayoutTheme(isDarkModeEnabled ? "dark" : "light");
};

export const analytics = new Analytics([]);

const isLocal = process.env.NODE_ENV === "development";
if (isLocal) {
  analytics.addProvider("console");
}

const firebaseConfigFile = process.env.FIREBASE_CONFIG;
if (firebaseConfigFile && firebaseConfigFile.length > 0) {
  const firebaseConfig = require("./analytics/" + firebaseConfigFile);
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  analytics.addProvider("firebase");
}

const isLanguageAvailable = () => {
  return availableLanguages.includes(language);
};

class Setup extends React.Component<Props> {
  async componentDidMount() {
    checkTheme();

    if (!isLanguageAvailable()) {
      const availableLanguage = await getAvailableLanguage(language);
      this.props.changeLanguage(availableLanguage);

      moment.locale(language);
      await i18n.changeLanguage(availableLanguage);
    }

    const localConfig = await loadLocalConfig();
    this.props.updateLocalConfig(localConfig);
    this.props.authByUrl();
    this.props.loadClassificators();
    this.props.initGeolocation();
  }

  componentDidUpdate(prevProps: Props) {
    const { profile } = this.props;
    if (prevProps.profile && profile && prevProps.profile.uid !== profile.uid) {
      this.props.loadClassificators();
    }

    if (
      !prevProps.classificators.countryClassificator.length &&
      this.props.classificators.countryClassificator.length
    ) {
      this.props.initGeolocation();
    }
  }

  render() {
    return <F7App />;
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  profile: getProfile(state),
  loading: state.sessionReducer.loading || state.sessionReducer.restoring,
  error: state.sessionReducer.error,
  classificators: state.classificatorReducer,
});

const mapDispatchToProps = (dispatch) => ({
  updateLocalConfig: (localConfig: ILocalConfig) =>
    dispatch({ type: "LOCAL_CONFIG_LOADED", localConfig }),
  authByUrl: () => dispatch(authByUrl()),
  loadClassificators: () => {
    // Entities classificators
    loadingClassificatorTypes.forEach((type) => dispatch(loadClassificator(type)));
    // Claim Subject classificators
    loadingSubjectClassificatorTypes.forEach((subjectType) =>
      dispatch(loadClaimSubjectsClassificator(subjectType))
    );
    // Single classificators
    dispatch(loadCurrencyClassificator());
    dispatch(loadCountryClassificator());
    dispatch(loadCategories());

    // Account delivery methods
    dispatch(getAllDeliveryMethods());
  },
  initGeolocation: () => dispatch(initGeolocation()),
  changeLanguage: (language: string) => dispatch(changeLanguage(language)),
});

const ConnectedSetup = connect(mapStateToProps, mapDispatchToProps)(Setup);

const Wrappers = () =>
  new Provider({
    store,
    children: (
      <PersistGate loading={null} persistor={persistor}>
        <I18nextProvider i18n={i18n}>
          <ConnectedSetup />
        </I18nextProvider>
      </PersistGate>
    ),
  });

export default Wrappers;
