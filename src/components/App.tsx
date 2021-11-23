import React from "react";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { Framework7Params } from "framework7/components/app/app-class";
import { App, View } from "framework7-react";
import { AnyAction, Dispatch } from "redux";
import { PersistGate } from "redux-persist/integration/react";

import { loadCategories } from "@/actions/categoryActions";
import {
  EntityClassificatorType,
  loadClassificator,
  loadCurrencyClassificator,
} from "@/actions/classificatorActions";
import { loginWithCode, loginWithUserPassword } from "@/actions/sessionActions";
import cordovaApp from "@/cordova-app";
import { Device } from "@/framework7-custom";
import i18n from "@/i18n";
import routes from "@/routes";
import { F7_INIT, LOCAL_CONFIG_LOADED } from "@/store/rootReducer";
import configureStore from "@/store/Store";
import { getAuthCodeFromURL, loadLocalConfig } from "@/utils";

export const { store, persistor } = configureStore();
const isDebuggingInChrome = !!window.navigator.userAgent;

if (isDebuggingInChrome) {
  window["store"] = store;
}

type State = {
  f7params: Framework7Params;
  username?: string;
  password?: string;
  init?: boolean;
};

const classificatorTypes: EntityClassificatorType[] = ["Product_Category", "Product_Status"];

export default class MyApp extends React.Component<any, State> {
  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      // Framework7 Parameters
      f7params: {
        id: "com.qrentart.app", // App bundle ID
        name: "QRent Art", // App name
        theme: "auto", // Automatic theme detection

        // App routes
        routes: routes,

        // Register service worker
        /*
        serviceWorker: Device.cordova ? {} : {
          path: process.env.APP_PATH + 'service-worker.js',
        },
         */
        // Input settings
        input: {
          scrollIntoViewOnFocus: Device.cordova && !Device.electron,
          scrollIntoViewCentered: Device.cordova && !Device.electron,
        },
        // Cordova Statusbar settings
        statusbar: {
          iosOverlaysWebView: true,
          androidOverlaysWebView: false,
        },
        view: {
          pushState: true,
          stackPages: true,
          pushStateSeparator: "#",
        },
        swipeout: {
          removeElements: false,
        },
      },
      // Login screen demo data
      username: "",
      password: "",
      init: false,
    };
  }

  componentDidMount() {
    const { $f7ready } = this;
    $f7ready(async (f7) => {
      f7.preloader.show();

      // Init cordova APIs (see cordova-app.js)
      if (Device.cordova) {
        cordovaApp.init(f7);
      }

      await this.loadLocalConfig();
      this.auth();

      /* TODO expire state with interval */
      const state = store.getState();
      this.loadAllClassificators(classificatorTypes, store.dispatch);

      store.dispatch({ type: F7_INIT, f7 });
      store.subscribe(this.listener);
    });
  }

  listener = () => {
    const state = store.getState();
    const { profile } = state.sessionReducer;
    if (profile && profile.uid && !this.state.init) {
      this.setState({ init: true }, () => this.$f7.preloader.hide());
    }
  };

  auth() {
    const authCode = getAuthCodeFromURL();
    if (authCode) {
      store.dispatch(loginWithCode(authCode) as unknown as AnyAction);
    }
    console.log("%c Oh my heavens! ", "background: #00ff00; color: #ffffff");
    if (process.env.USERNAME && process.env.PASSWORD) {
      store.dispatch(
        loginWithUserPassword(process.env.USERNAME, process.env.PASSWORD) as unknown as AnyAction
      );
    }
  }

  loadLocalConfig = async () => {
    const localConfig = await loadLocalConfig();
    store.dispatch({ type: LOCAL_CONFIG_LOADED, localConfig });
  };

  alertLoginData() {
    this.$f7?.dialog.alert(
      "Username: " + this.state.username + "<br>Password: " + this.state.password,
      () => {
        this.$f7?.loginScreen.close();
      }
    );
  }

  loadAllClassificators = (types: EntityClassificatorType[], dispatch: Dispatch<AnyAction>) => {
    // Entities classificators
    types.forEach((type) => dispatch(loadClassificator(type) as unknown as AnyAction));
    // Single classificators
    dispatch(loadCurrencyClassificator() as unknown as AnyAction);
    dispatch(loadCategories() as unknown as AnyAction);
  };

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <I18nextProvider i18n={i18n}>
            <App params={this.state.f7params}>
              {this.state.init && <View className="safe-areas" main url="/" />}
            </App>
          </I18nextProvider>
        </PersistGate>
      </Provider>
    );
  }
}
