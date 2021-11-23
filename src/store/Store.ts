import { applyMiddleware, createStore, Store } from "redux";
import axiosMiddleware from "redux-axios-middleware";
import logger from "redux-logger";
import { PersistConfig, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import reduxThunk from "redux-thunk";

import { CHOOSE_CATEGORY_SUB_CATEGORY } from "@/actions/filterActions";
import { client } from "@/axios";

import rootReducer, { IApplicationStore } from "./rootReducer";
import SetTransform from "./transforms";

const persistConfig: PersistConfig<IApplicationStore> & {
  whitelist: (keyof IApplicationStore)[];
} = {
  key: "root",
  storage,
  transforms: [SetTransform],
  whitelist: ["classificatorReducer"],
};

const persistedReducer = persistReducer<IApplicationStore>(persistConfig, rootReducer);

const options = {
  returnRejectedPromiseOnError: true,
};

const isDebuggingInChrome = !!(window as Window).navigator.userAgent;

const modifyUrl = (store: Store) => (next: any) => (action: any) => {
  const state = store.getState() as IApplicationStore;
  const { f7 } = state.rootReducer;

  if (action.type === CHOOSE_CATEGORY_SUB_CATEGORY) {
    f7.view.current.router.navigate(
      "/category/" + action.catid + "/subcategory/" + action.subcatid + "/",
      { reloadAll: true }
    );
  }

  return next(action);
};

const configureStore = () => {
  const middlewares = [reduxThunk, axiosMiddleware(client, options)];

  if (isDebuggingInChrome) {
    middlewares.push(logger);
  }

  /* TODO */
  middlewares.push(modifyUrl);

  const store = createStore(persistedReducer, applyMiddleware(...middlewares));
  const persistor = persistStore(store);

  return { store, persistor };
};

export default configureStore;
