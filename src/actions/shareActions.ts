import { getPlatform, Platform } from "../utils";

export const SHARE = "SHARE";
export const SHARE_SUCCESS = "SHARE_SUCCESS";
export const SHARE_ERROR = "SHARE_ERROR";

function shareLinkAndroid(message) {
  // eslint-disable-next-line
  Android.shareLink(message);
}

function shareLinkIos(message) {
  // eslint-disable-next-line
  window.webkit.messageHandlers.shareLink.postMessage(message);
}

function shareLinkWeb(title, url) {
  if (window.parent) {
    window.parent.postMessage(
      {
        type: "marketplace",
        title: title,
        url: url,
      },
      "*"
    );
  }
}

export const getProductDetailsLink = (uid: string) => {
  /* TODO */
  const url = window.location.toString();
  return url.substr(0, url.indexOf("#") + 1) + `/product-details/${uid}/`;
};

export const share = (title: string, url: string) => (dispatch) => {
  dispatch({ type: SHARE });
  try {
    const message = title + "\n\n" + url;
    const platform = getPlatform();
    if (platform == Platform.Android) {
      shareLinkAndroid(message);
    } else if (platform == Platform.iOS) {
      shareLinkIos(message);
    } else {
      shareLinkWeb(title, url);
    }
    dispatch({ type: SHARE_SUCCESS });
  } catch (err) {
    dispatch({ type: SHARE_ERROR, error: err.toString() });
  }
};
