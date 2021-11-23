import Compressor from "compressorjs";
import CreditCardType from "credit-card-type";
import Dom7 from "dom7";
import i18n from "i18next";
import luhn from "luhn";
import moment from "moment";
import numeral from "numeral";
import urlParse from "url-parse";

import { ICategoryClassificator } from "@/reducers/categoryReducer";
import { SavedCard } from "@/reducers/paymentCardsReducer";
import { ILocalConfig } from "@/store/rootReducer";

export enum Platform {
  Android,
  iOS,
}

export type Location = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

// window.webkit in undefined even in chrome
export const getPlatform = () => {
  if (typeof Android !== "undefined") {
    return Platform.Android;
  } else if (typeof window.webkit !== "undefined") {
    return Platform.iOS;
  } else {
    return null;
  }
};

export function formatPrice(
  val: number,
  currencyCode?: string,
  alwaysDecimal?: boolean,
  pediod?: string
): string {
  return `${numeral(val).format(alwaysDecimal ? "0,0.00" : "0,0[.]00")}${
    currencyCode ? ` ${currencyCode}` : ""
  } ${pediod ? `${pediod.toLowerCase()}` : ""}`;
}

export const getQueryParameterFromURL = (name: string, url?: string) => {
  if (!url) url = window.location.href;
  const locationHref = url.replace("/#/", "");
  const parsedUrl = urlParse(locationHref, true);

  return Object.prototype.hasOwnProperty.call(parsedUrl.query, name) ? parsedUrl.query[name] : null;
};

const config = process.env.CONFIG;
const localConfigPath = config ? "static/config-" + config + ".json" : "static/config.json";

const mapsApiKey = process.env.MAPS_API_KEY;

export async function loadLocalConfig(): Promise<ILocalConfig> {
  return new Promise((resolve, reject) => {
    try {
      const xmlReq = new XMLHttpRequest();
      xmlReq.open("GET", localConfigPath);
      xmlReq.onreadystatechange = () => {
        if (xmlReq.readyState === xmlReq.DONE && xmlReq.status === 200) {
          const config: ILocalConfig = {
            ...JSON.parse(xmlReq.responseText),
            settingsEnabled: !!process.env.SETTINGS_ENABLED,
          };

          if (mapsApiKey && mapsApiKey.length > 0) {
            config.GoogleMapAPIkey = mapsApiKey;
          }

          try {
            const darkMode = getQueryParameterFromURL("darkMode");
            if (darkMode === "true") {
              config.theme = "dark";
            }
          } catch (err) {
            console.error("at utils in loadLocalConfig", err);
          }

          resolve(config);
        }
      };
      xmlReq.send(null);
    } catch (err) {
      reject(err);
    }
  });
}

export function getCategoryNameByCategoryId(
  catid: string,
  categoriesClassificator: ICategoryClassificator[]
) {
  const item = categoriesClassificator.filter(
    (item) => item.children && item.children.filter((item) => item.categoryCode === catid).length
  )[0];
  return item ? item.categoryName : catid;
}

export function getSubcategoryNameBySubcategoryId(catid: string, flat: ICategoryClassificator[]) {
  const item = flat.filter((item) => item.categoryCode === catid)[0];
  return item ? item.categoryName : "";
}

export const formatDate = (date: string | number) => moment(date).format("LL");

export const formatDateTime = (dateTime: string) => {
  return moment(dateTime, "YYYYMMDDHHmmss").format("DD MMM, YYYY H:mm");
};

export const getAuthCodeFromURL = () => {
  return getQueryParameterFromURL("authCode");
};

export const getCreditCardType = (cardNumber: string) => {
  return CreditCardType(cardNumber)[0];
};

export const convertISODateToInputDate = (dateISO: string) => {
  if (!dateISO) return "";
  const date = new Date(dateISO);
  return date.toISOString().substring(0, 10);
};

const MAX_FILE_SIZE = 1024 * 1024 * 2;
const MAX_IMAGE_SIZE_ = 2000;
const DEFAULT_QUALITY = 0.73;

export const getCompressedImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: DEFAULT_QUALITY,
      convertSize: MAX_FILE_SIZE,
      maxWidth: MAX_IMAGE_SIZE_,
      success(result) {
        resolve(result as File);
      },
      error(err) {
        reject(err);
      },
    });
  });
};

export const generateToken = async (saveCard: SavedCard): Promise<string> => {
  const card = {
    uid: null,
    ...saveCard,
    expDateMonth: saveCard.expMonth.toString(),
    expDateYear: saveCard.expYear.toString(),
  };
  return new Promise((resolve, reject) => {
    (window as any).cardTokenCallback = (token: any) => {
      (window as any).cardToken = token;
    };
    (window as any).ccTokenizer = new (window as any).CCTokenizer({
      card: card,
      format: !card.cardNumber ? "3" : "1",
      errorHandler: function (errorCode: any, errorMessage: any) {
        reject(`${errorCode} ${errorMessage}`);
      },
    });
    (window as any).ccTokenizer.loadToken = (cardToken: string) => {
      (window as any).cardToken = cardToken;
    };

    const tokenizerScriptUrlWithToken =
      (window as any).ccTokenizer.tokenServiceUrl +
      "?value=" +
      encodeURIComponent((window as any).ccTokenizer.generateToken());

    const tokenScriptId = "tokenScript_ccTokenizer____script";

    document.querySelectorAll(`#${tokenScriptId}`).forEach((el) => el.remove());

    const tokenScript = document.createElement("script");
    tokenScript.id = tokenScriptId;
    tokenScript.setAttribute("src", tokenizerScriptUrlWithToken);
    tokenScript.async = true;
    tokenScript.addEventListener("error", (ev) => {
      reject(ev.error);
    });
    document.head.appendChild(tokenScript);

    (window as any).cardTokenCallback = (cardToken: string) => resolve(cardToken);
  });
};

function normalizeYear(year: number) {
  // Century fix
  const YEARS_AHEAD = 20;
  if (year < 100) {
    const nowYear = new Date().getFullYear();
    year += Math.floor(nowYear / 100) * 100;
    if (year > nowYear + YEARS_AHEAD) {
      year -= 100;
    } else if (year <= nowYear - 100 + YEARS_AHEAD) {
      year += 100;
    }
  }
  return year;
}

export function isValidCardExpDate(value: string /* MM/YY */) {
  const match = value.match(/^\s*(0?[1-9]|1[0-2])\/(\d\d|\d{4})\s*$/);
  if (!match) {
    return false;
  }
  const exp = new Date(
    normalizeYear(1 * parseInt(match[2])),
    1 * parseInt(match[1]) - 1,
    1
  ).valueOf();
  const now = new Date();
  const currMonth = new Date(now.getFullYear(), now.getMonth(), 1).valueOf();
  return exp >= currMonth;
}

export function isValidCardFormat(value: string) {
  return luhn.validate(value);
}

export const setLayoutTheme = (theme: "light" | "dark") => {
  const $html = Dom7("html");
  $html.removeClass("theme-dark theme-light").addClass("theme-" + theme);
};

export const getDaysLeft = (date: Date) => {
  if (!date) return 0;
  return moment(date).diff(new Date(), "days");
};

// Parse URL helpers
const supportedProvidersRegexes = {
  youtu: {
    parse: (url: string) => {
      const match = url.match(
        /(?:(?:v|vi|be|videos|embed)\/(?!videoseries)|(?:v|ci)=)?([\w-]{11})/i
      );
      if (!match) {
        return null;
      }
      return { id: match[1], type: "youtube" };
    },
  },
  youtube: {
    parse: (url: string) => {
      const match = url.match(
        /(?:(?:v|vi|be|videos|embed)\/(?!videoseries)|(?:v|ci)=)?([\w-]{11})/i
      );
      if (!match) {
        return null;
      }
      return { id: match[1], type: "youtube" };
    },
  },
  vimeo: {
    parse: (url: string) => {
      const match = url.match(
        /(vimeo(?:cdn|pro)?)\.com\/(?:(?:channels\/[\w]+|(?:(?:album\/\d+|groups\/[\w]+|staff\/frame)\/)?videos?)\/)?(\d+)(?:_(\d+)(?:x(\d+))?)?(\.\w+)?/i
      );
      if (!match) {
        return null;
      }
      return { id: match[2], type: "vimeo" };
    },
  },
  vk: {
    parse: (url: string) => {
      const match = url.match(/(vk(?:cdn|pro)?)\.com\/(?:(?:video)([\d+_d+]+))/i);
      if (!match) {
        return null;
      }
      return { id: match[2], type: "vk" };
    },
  },
};

export const parseProvider = (url: string) => {
  const match = url.match(/(?:(?:https?:)?\/\/)?(?:[^.]+\.)?(\w+)\./i);
  return match ? match[1] : undefined;
};

export const parseVideoURL = (url: string): { id: string; type: string } => {
  if (typeof url === "undefined") {
    return undefined;
  }
  const provider = parseProvider(url);
  const providerRegex = supportedProvidersRegexes[provider];
  if (!provider || !providerRegex) {
    return undefined;
  }
  return providerRegex.parse(url);
};

export const createVideoURLLink = (id: string, type: "YOUTUBE" | "VIMEO" | "VK" | string) => {
  switch (type) {
    case "VIMEO":
      return `https://vimeo.com/${id}`;
    case "YOUTUBE":
      return `https://www.youtube.com/watch?v=${id}`;
    case "VK":
      return `https://vk.com/video?q=&z=video-${id}`;
    default:
      return "";
  }
};

export const createThumbnailVideoURLLink = (
  id: string,
  type: "YOUTUBE" | "VIMEO" | "VK" | string
) => {
  switch (type) {
    case "VIMEO":
      return `https://api.vimeo.com/videos/${id}/pictures`;
    case "YOUTUBE":
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    case "VK":
      return "";
    default:
      return "";
  }
};

export const createUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const createProductUrl = (uid: string, language?: string) => {
  if (!language) {
    language = i18n.language;
  }
  return `https://${window.location.host}/market/#/product-details/${uid}/?language=${language}`;
};

export const detectNavigatorLocation = async (): Promise<Location> =>
  new Promise((resolve, reject) => {
    if ("geolocation" in window.navigator) {
      window.navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      });
    } else {
      reject("Not supported");
    }
  });

export const detectIPLocation = async (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    try {
      const xmlReq = new XMLHttpRequest();
      xmlReq.open("GET", "https://ipapi.co/json/");
      xmlReq.onreadystatechange = () => {
        if (xmlReq.readyState === xmlReq.DONE && xmlReq.status === 200) {
          const response = JSON.parse(xmlReq.responseText);
          resolve({
            latitude: response.latitude,
            longitude: response.longitude,
            accuracy: 0,
          });
        }
      };
      xmlReq.send(null);
    } catch (err) {
      console.error("at utils in detectIPLocation", err);
      reject(err);
    }
  });
};

export const detectLocation = async () => {
  const location = await detectNavigatorLocation();
  if (location && location.longitude !== 0 && location.accuracy < 10000) {
    return location;
  }
  return await detectIPLocation();
};

export async function reverseGeocoding(lat: number, lng: number): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const xmlReq = new XMLHttpRequest();
      xmlReq.open(
        "GET",
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=country&key=${mapsApiKey}`
      );
      xmlReq.onreadystatechange = () => {
        if (xmlReq.readyState === xmlReq.DONE && xmlReq.status === 200) {
          const response = JSON.parse(xmlReq.responseText);
          resolve(response);
        }
      };
      xmlReq.send(null);
    } catch (err) {
      console.error("at utils in detectLocation", err);
      reject(err);
    }
  });
}

export function safeParseInt(value) {
  let n = 0;
  try {
    n = parseInt(value);
  } catch (err) {
    console.error(err);
  }
  return n;
}

// ! CHANGE TO NAVIGATOR
export const execCopyText = (text: string) =>
  navigator.clipboard
    .writeText(text)
    .then(() => false)
    .catch((err) => console.error("at utils in execCopyText", err));

export const getCategory = (
  categoriesClassificator: ICategoryClassificator[],
  categoryCode: string
) =>
  !!categoriesClassificator.length &&
  categoriesClassificator.find(
    (item) => categoryCode === item.categoryCode || categoryCode === item.categoryName
  );

export const getSubRoutes = (category: ICategoryClassificator) => {
  if (!category) {
    return [];
  } else if (category.parent) {
    return getSubRoutes(category.parent).concat(category);
  } else {
    return [category];
  }
};

// ! never used
export const getChildRoutes = (category, key?) => {
  if (!category) {
    return [];
  }
  if (category.children?.length) {
    const arr = category.children.map((elem) => getChildRoutes(elem, key));
    key && arr.push(category[key]);
    return arr.flat();
  } else {
    return key ? category[key] : category;
  }
};

const EMAIL_REGEX = /(^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$)/;

export const isEmail = (email: string) => EMAIL_REGEX.test(email);

const PHONE_REGEX = /(^\d{11}$)/;

export const isPhone = (phone: string) => PHONE_REGEX.test(phone);

export const isDefined = (value: unknown) =>
  typeof value !== "undefined" && value !== null && value.toString() !== "NaN";

export const deepEqual = <T extends unknown>(a: T, b: T) => {
  if (typeof a !== "object" && typeof b !== "object") {
    return a === b;
  }

  if (Object.keys(a || {}).length !== Object.keys(b).length) return false;

  for (const key in a as Record<string, unknown>) {
    if (!(key in (b as Record<string, unknown>))) return false;
    if (!deepEqual<unknown>(a[key], b[key])) return false;
  }

  return true;
};

export const equalItemsInArrays = <T extends unknown>(
  a: T[],
  b: T[],
  comp?: (a: T, b: T) => number
): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  const sortedA = a.sort(comp);
  const sortedB = b.sort(comp);

  return deepEqual(sortedA, sortedB);
};

export const noop = () => undefined;

export const getBackgroundStyle = (url: string) =>
  url ? { backgroundImage: `url(${url})` } : null;

export const valueInRange = (min: number, max: number, value: number): number =>
  Math.max(min, Math.min(max, value));
