import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import moment from "moment";
import { getQueryParameterFromURL } from "./utils";

export const language = getQueryParameterFromURL("language") || "en";
moment.locale(language);

i18n.use(initReactI18next).init({
  lng: language,
  fallbackLng: "en",
  resources: {
    en: require("./static/locales/en.json"),
    ru: require("./static/locales/ru.json"),
    es: require("./static/locales/es.json"),
    id: require("./static/locales/id.json"),
    lv: require("./static/locales/lv.json"),
  },
  interpolation: {
    escapeValue: false,
  },
  /* https://stackoverflow.com/questions/27015970/i18next-json-dot-in-key-or-label/34037706 */
  nsSeparator: ":::",
  keySeparator: "::",
});

export const availableLanguages = ["en", "ru", "es", "id", "lv"];

export default i18n;
