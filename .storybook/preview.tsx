import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";

import i18n from "../src/i18n";
import configureStore from "../src/store/Store";

// Import Framework7 Styles
import "../src/css/framework7-custom.less";

// Import Icons and App Custom Styles
import "../src/css/icons.css";
import "../src/css/app.less";

// Import Storybook CSS
import "./preview.css";

const { store } = configureStore();

export const decorators = [
  (story) => I18nextProvider({ i18n, children: story() }),
  (story) => new Provider({ store, children: story() }),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
