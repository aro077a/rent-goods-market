import { ChatControllerApi } from "../types/marketplaceapi";
import { createProductUrl, getPlatform, Platform } from "../utils";
import { IProduct } from "../reducers/productReducer";
import { createOrder } from "./ordersActions";
import { loadProductDetails } from "./productActions";
import { IApplicationStore } from "../store/rootReducer";
import i18n from "../i18n";

export const CHAT_LOADING = "CHAT_LOADING";
export const CHAT_LOADING_SUCCESS = "CHAT_LOADING_SUCCESS";
export const CHAT_LOADING_ERROR = "CHAT_LOADING_ERROR";

function openChatAndroid(phoneNumber: string, link: string) {
  window.Android.openChat(phoneNumber, link);
}

function openChatIos(phoneNumber: string, link: string) {
  window.webkit.messageHandlers.jsHandlerMyJSFunc.postMessage({
    userID: phoneNumber,
    url: link,
  });
}

function openChatWeb(phoneNumber: string, link: string) {
  if (window.parent) {
    const message = {
      type: "marketplace",
      userID: phoneNumber,
      url: link,
    };
    window.parent.postMessage(message, "*");
  }
}

function sendMessage(phone: string, message: string) {
  const platform = getPlatform();
  if (platform == Platform.Android) {
    openChatAndroid(phone, message);
  } else if (platform == Platform.iOS) {
    openChatIos(phone, message);
  } else {
    openChatWeb(phone, message);
  }
}

export const startChat = (sellerPhone: string, message: string) => (dispatch) => {
  dispatch({ type: CHAT_LOADING });
  setTimeout(() => {
    try {
      sendMessage(sellerPhone, message);
      dispatch({ type: CHAT_LOADING_SUCCESS });
    } catch (err) {
      dispatch({ type: CHAT_LOADING_ERROR, error: err.toString() });
    }
  }, 1000);
};

export const startChatWithOrder =
  (item: IProduct) => async (dispatch, getState: () => IApplicationStore) => {
    dispatch({ type: CHAT_LOADING });
    const state = getState();
    const { uid } = item;
    let { sellerPhone } = item;
    try {
      if (!sellerPhone) {
        item = await loadProductDetails(uid, state);
        sellerPhone = item.sellerPhone;
        if (!sellerPhone) throw new Error(i18n.t("Seller phone not found."));
      }
      const data = (await createOrder(item)) as any;
      const { order } = data;
      if (order) {
        const orderUrl = data.redirectUrl.replace(order.uid, "marketspace/view/" + order.uid);
        const message = i18n.t("ChatMessageOrder", { orderUrl });
        sendMessage(sellerPhone, message);
      }
      dispatch({ type: CHAT_LOADING_SUCCESS });
    } catch (err) {
      dispatch({ type: CHAT_LOADING_ERROR, error: err.toString() });
    }
  };

export const startChatWithProduct =
  (item: IProduct, message?: string) => async (dispatch, getState: () => IApplicationStore) => {
    dispatch({ type: CHAT_LOADING });
    const state = getState();
    const { uid } = item;
    let { sellerPhone } = item;
    try {
      if (!sellerPhone) {
        item = await loadProductDetails(uid, state);
        sellerPhone = item.sellerPhone;
        if (!sellerPhone) throw new Error(i18n.t("Seller phone not found."));
      }
      const data = (
        await new ChatControllerApi().registerProductChatUsingPUT({
          uid: item.uid,
        })
      ).body[0];
      if (data) {
        if (!message) {
          const productUrl = createProductUrl(item.uid);
          message = i18n.t("ChatMessageProduct", { productUrl });
        }
        sendMessage(sellerPhone, message);
      }
      dispatch({ type: CHAT_LOADING_SUCCESS });
    } catch (err) {
      dispatch({ type: CHAT_LOADING_ERROR, error: err.toString() });
    }
  };

export const startChatWithStore = (storeData) => async (dispatch) => {
  dispatch({ type: CHAT_LOADING });
  const { sellerPhone, message } = storeData;

  try {
    sendMessage(sellerPhone, message);

    dispatch({ type: CHAT_LOADING_SUCCESS });
  } catch (err) {
    dispatch({ type: CHAT_LOADING_ERROR, error: err.toString() });
  }
};
