import { Device } from "framework7";
import { Framework7Params } from "framework7/components/app/app-class";

import routes from "./routes";

const f7params: Framework7Params = {
  // Framework7 Parameters
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
  touch: {
    tapHold: true, //enable tap hold events
  },
};

export default f7params;
