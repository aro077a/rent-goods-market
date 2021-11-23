// Import React and ReactDOM
import React from "react";
import ReactDOM from "react-dom";

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

// Import Framework7
import Framework7 from "./framework7-custom";

// Import Framework7-React Plugin
import Framework7React from "framework7-react";

// Import Framework7 Styles
import "./css/framework7-custom.less";

// Import Icons and App Custom Styles
import "./css/icons.css";
import "./css/app.less";

import Analytics from "./analytics";
export const analytics = new Analytics(["firebase"]);

// Import App Component
import Setup from "./Setup";

const isLocal = process.env.NODE_ENV === "development";
const isDebug = process.env.DEBUG_ENABLED === "true";
const sentryDsn = process.env.SENTRY_DSN;

if (!isLocal || isDebug) {
  console.log("-------------- Sentry init --------------");
  Sentry.init({
    dsn: sentryDsn,
    integrations: [new Integrations.BrowserTracing()],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

// Init F7 React Plugin
Framework7.use(Framework7React);

// Mount React App
ReactDOM.render(React.createElement(Setup), document.getElementById("app"));
