import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Device } from "framework7";
import Framework7, { Framework7Params } from "framework7/components/app/app-class";
import { Router } from "framework7/modules/router/router";
import { App, View } from "framework7-react";
import cloneDeep from "lodash/cloneDeep";
import { compose } from "redux";

import { chooseCategorySubcategory } from "./actions/filterActions";
import { initGeolocation } from "./actions/geolocationActions";
import { getLanguages } from "./actions/languagesActions";
import { store } from "./components/App";
import { SelectCustomerLocationContainer } from "./pages/select-customer-location-container";
import { ISessionState } from "./reducers/sessionReducer";
import connectPreloader, { IPreloaderProps } from "./store/connectPreloader";
import {
  F7_INIT,
  IApplicationStore,
  INIT_ENTRY_PAGE_NAME,
  ON_RESIZE_EVENT,
} from "./store/rootReducer";
import cordovaApp from "./cordova-app";
import f7params from "./f7params";

type Props = IPreloaderProps &
  WithTranslation & {
    initF7?(f7instance: Framework7): void;
    initEntryPageName?(pageName: string): void;
    chooseCategorySubcategory?(catid?: string, subcatid?: string): void;
    session?: ISessionState;
    initGeolocation?(): void;
    getLanguages?: () => void;
  };

type State = {
  f7params: Framework7Params;
  f7Init?: boolean;
};

class F7App extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      f7params: null,
      f7Init: false,
    };
  }

  componentDidMount() {
    this.initF7Params();

    this.$f7ready((f7) => {
      console.log("~~~~~~~~~~~~~~~ F7 initialized ~~~~~~~~~~~~~~~");

      this.toggleF7PreloaderSafe(this.props.preloader);

      // Init cordova APIs (see cordova-app.js)
      if (Device.cordova) {
        cordovaApp.init(f7);
      }

      f7.once("pageInit", this.handleOnPageInitOnce);
      f7.on("resize", this.handleOnResize);

      this.handleOnResize();

      // ? handler can looks like (newRoute, _prevRoute, _router) => void
      f7.once("routeChange", (newRoute) => {
        if (newRoute.route.name === "FilterByCategory") {
          const { catid, subcatid } = newRoute.params;
          this.props.chooseCategorySubcategory(catid, subcatid);
        }
      });

      this.props.initF7(f7);

      this.setState({
        f7Init: true,
      });
    });
  }

  initF7Params() {
    let initParams = cloneDeep(f7params);
    const { t } = this.props;

    if (Device.desktop) {
      initParams.view.animate = false;
      initParams.theme = "md"; // theme for desktop must be Material
      initParams.touch = { ...initParams.touch, mdTouchRipple: false };
    }

    // Check localStorage access
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const length = window.localStorage.length;
    } catch (err) {
      initParams.view.pushState = false;
    }

    initParams = {
      ...initParams,
      dialog: {
        buttonOk: t("OK"),
        buttonCancel: t("Cancel"),
      },
    };

    this.setState({ f7params: initParams });
  }

  handleOnPageInitOnce = (page: Router.Page) => {
    this.props.initEntryPageName(page.name);
    this.props.getLanguages();
  };

  _timeout: NodeJS.Timeout;

  handleOnResize() {
    /* TODO move to actions */
    clearTimeout(this._timeout);

    this._timeout = setTimeout(() => {
      clearTimeout(this._timeout);

      const { innerWidth, innerHeight } = window;

      store.dispatch({
        type: ON_RESIZE_EVENT,
        payload: { width: innerWidth, height: innerHeight },
      });
    }, 350);
  }

  componentDidUpdate(prevProps: Props) {
    this.handlePreloader(prevProps);

    const {
      session: { loading, restoring },
      t,
    } = this.props;

    this.toggleF7PreloaderSafe(loading || restoring);
  }

  handlePreloader(prevProps: Props) {
    const { preloader } = this.props;
    if (
      preloader &&
      (preloader !== prevProps.preloader || typeof prevProps.preloader === "undefined")
    ) {
      this.toggleF7PreloaderSafe(preloader);
    }
  }

  toggleF7PreloaderSafe(show = true) {
    this.$f7ready((f7) => (show ? f7.preloader.show() : f7.preloader.hide()));
  }

  render() {
    const { f7params, f7Init } = this.state;
    return (
      f7params && (
        <App params={f7params}>
          {f7Init && (
            <>
              <View className="safe-areas" main url="/" />
              <SelectCustomerLocationContainer />
            </>
          )}
        </App>
      )
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  session: state.sessionReducer,
});

const mapDispatchToProps = (dispatch) => ({
  initF7: (f7: Framework7) => dispatch({ type: F7_INIT, f7 }),
  initEntryPageName: (pageName: string) => dispatch({ type: INIT_ENTRY_PAGE_NAME, pageName }),
  chooseCategorySubcategory: (catid?: string, subcatid?: string) =>
    dispatch(chooseCategorySubcategory(catid, subcatid)),
  initGeolocation: () => dispatch(initGeolocation()),
  getLanguages: () => dispatch(getLanguages()),
});

export default compose<React.FC<Pick<Props, "preloader">>>(
  withTranslation(),
  connectPreloader,
  connect(mapStateToProps, mapDispatchToProps)
)(F7App);
