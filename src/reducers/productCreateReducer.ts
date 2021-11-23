import { AnyAction } from "redux";
import { IProduct } from "./productReducer";
import {
  PRODUCT_UPDATE_DRAFT,
  PRODUCT_CREATE_LOADING,
  PRODUCT_CREATE_LOADING_SUCCESS,
  PRODUCT_CREATE_LOADING_ERROR,
  PRODUCT_CREATE_CHOOSE_CATEGORY,
  PRODUCT_CREATE_CHOOSE_SUB_CATEGORY,
  PRODUCT_CREATE_ATTACHING_FILE,
  PRODUCT_CREATE_ATTACHING_FILE_SUCCESS,
  PRODUCT_CREATE_ATTACHING_FILE_ERROR,
  PRODUCT_CREATE_DETACHING_FILE,
  PRODUCT_CREATE_DETACHING_FILE_SUCCESS,
  PRODUCT_CREATE_DETACHING_FILE_ERROR,
  PRODUCT_UPDATE_DRAFT_LOADING,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_CREATE_DETAILS_ERROR,
  PRODUCT_CREATE_DETAILS_LOADING,
  PRODUCT_CREATE_DETAILS_SUCCESS,
} from "../actions/productCreateActions";
import { Product } from "../types/marketplaceapi";
import { CHANGE_PRODUCT_STATUS_SUCCESS } from "../actions/productStatusActions";

export interface IProductCreateFormError {
  message: string;
  parameters: string[];
}

export interface IProductCreateState {
  loading?: boolean;
  saving?: boolean;
  error?: any;
  formErrors?: IProductCreateFormError[];
  product?: IProduct;

  chosenCategoryId?: string;

  catid?: string;
  subcatid?: string;
  name?: string;
  description?: string;
  hashtags?: string;
  price?: number;
  priceDiscount?: number;
  currency?: string;
  countOfProduct?: number;
  instock?: boolean;
  files?: IProductCreateUploadedFileInfo[];
}

export interface IProductCreateUploadedFileInfo {
  uid?: string;
  imageLink?: string;
  imageLinkFull?: string;
  file: File;
  attaching?: boolean;
  detaching?: boolean;
  error?: any;
}

// @ts-ignore
const emptyProduct: IProduct = {
  name: "",
  description: "",
  shortDescription: "",
  model: "",
  type: "P",
  category: "",
  price: null,
  currencyCode: "USD",
  images: [],
  imageThumbnails: [],
  featureCodes: [],
  features: [],
  localizations: [],
  inStock: false,
  pickupAllowed: false,
  returnAccepted: false,
  shippingAllowed: false,
  isProductEditAllowed: false,
};

export const MAX_FILES_COUNT = 5;
export const MIN_DAYS_BETWEEN_DATES = 21;

const initialState: IProductCreateState = {
  loading: false,
  error: null,
  formErrors: [],
  product: { ...emptyProduct },
  files: new Array(MAX_FILES_COUNT).fill({}),
};

const getFileInfoItems = (item: IProduct): IProductCreateUploadedFileInfo[] =>
  Object.keys(item)
    .filter((k) => k.includes("imageThumbnailUrl"))
    .map((k) => {
      return {
        uid: item.uid,
        imageLink: item[k],
        imageLinkFull: item[k],
        file: null,
      };
    });

export const checkProductEditAllowed = (status: Product.StatusEnum) => {
  return status && (status === Product.StatusEnum.DRF || status === Product.StatusEnum.DCL);
};

const productCreateReducer = (state = initialState, action: AnyAction): IProductCreateState => {
  switch (action.type) {
    case PRODUCT_UPDATE_DRAFT_LOADING:
      return {
        ...state,
        chosenCategoryId: null,
        product: null,
        files: new Array(MAX_FILES_COUNT).fill({}),
        error: null,
        formErrors: [],
        loading: true,
      };
    case PRODUCT_UPDATE_DRAFT: {
      const { formErrors } = state;
      const { item, reset, categoryId } = action;

      let existsFiles = getFileInfoItems(item);
      if (existsFiles.length < MAX_FILES_COUNT) {
        existsFiles = [...existsFiles, ...new Array(MAX_FILES_COUNT - existsFiles.length).fill({})];
      }

      if (item.uid) {
        return {
          ...state,
          loading: false,
          chosenCategoryId: categoryId || state.chosenCategoryId,
          product: { ...item },
          files: reset ? existsFiles : state.files,
          error: null,
          formErrors: [],
        };
      }

      let publishDate = new Date();
      let expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() + MIN_DAYS_BETWEEN_DATES);
      let publishDateISO = publishDate
        .toISOString()
        .substr(0, publishDate.toISOString().lastIndexOf("."));
      let expiredDateISO = expiredDate
        .toISOString()
        .substr(0, expiredDate.toISOString().lastIndexOf("."));

      return {
        ...state,
        loading: false,
        chosenCategoryId: reset ? "" : state.chosenCategoryId,
        product: reset
          ? {
              ...initialState.product,
              publishDate: publishDateISO,
              expirationDate: expiredDateISO,
              isProductEditAllowed: checkProductEditAllowed(initialState.product.status),
            }
          : {
              ...item,
              isProductEditAllowed: checkProductEditAllowed(item.status),
            },
        files: reset ? new Array(MAX_FILES_COUNT).fill({}) : state.files,
        error: reset ? null : state.error,
        formErrors: formErrors
          .map((e) => {
            const parameters = e.parameters.filter((e) => {
              return (
                item.hasOwnProperty(e) &&
                typeof item[e] !== "undefined" &&
                item[e] !== null &&
                item[e].length
              );
            });
            return { ...e, parameters };
          })
          .filter((e) => e.parameters.length),
      };
    }
    case PRODUCT_CREATE_LOADING:
      return {
        ...state,
        loading: true,
        saving: true,
        error: null,
        formErrors: initialState.formErrors,
      };
    case PRODUCT_CREATE_LOADING_SUCCESS: {
      const { product } = action;
      return {
        ...state,
        loading: false,
        saving: false,
        product: {
          ...product,
          isProductEditAllowed: checkProductEditAllowed(product.status),
        },
      };
    }
    case PRODUCT_CREATE_LOADING_ERROR:
      return {
        ...state,
        loading: false,
        saving: false,
        error: action.error,
        formErrors: action.parameters
          ? [...state.formErrors, { message: action.error, parameters: action.parameters }]
          : state.formErrors,
      };
    case PRODUCT_CREATE_CHOOSE_CATEGORY:
      return {
        ...state,
        chosenCategoryId: action.catid,
        product: { ...state.product, category: null },
      };
    case PRODUCT_CREATE_CHOOSE_SUB_CATEGORY:
      return {
        ...state,
        product: { ...state.product, category: action.catid },
      };
    case PRODUCT_CREATE_ATTACHING_FILE: {
      const { index } = action;
      const { files } = state;

      return {
        ...state,
        files: files.map((item, i) => {
          if (i === index) return { ...item, attaching: true, error: null };
          return item;
        }),
      };
    }
    case PRODUCT_CREATE_ATTACHING_FILE_SUCCESS: {
      const { index, imageLink, file } = action;
      const { files } = state;

      return {
        ...state,
        files: files.map((item, i) => {
          if (i === index) return { ...item, attaching: false, imageLink, file };
          return item;
        }),
      };
    }
    case PRODUCT_CREATE_ATTACHING_FILE_ERROR: {
      const { index, error } = action;
      const { files } = state;

      return {
        ...state,
        files: files.map((item, i) => {
          if (i === index) return { ...item, attaching: false, error };
          return item;
        }),
      };
    }
    case PRODUCT_CREATE_DETACHING_FILE: {
      const { index } = action;
      const { files } = state;

      files[index] = { ...files[index], detaching: true, error: null };
      return {
        ...state,
        files: [...files],
      };
    }
    case PRODUCT_CREATE_DETACHING_FILE_SUCCESS: {
      const { index, product } = action;
      const { files } = state;

      files[index] = {
        ...files[index],
        detaching: false,
        uid: null,
        imageLink: null,
      };

      return {
        ...state,
        product,
        files: [...files],
      };
    }
    case PRODUCT_CREATE_DETACHING_FILE_ERROR: {
      const { index, error } = action;
      const { files } = state;

      files[index] = { ...files[index], detaching: false, error };
      return {
        ...state,
        files: [...files],
      };
    }
    case PRODUCT_DELETE_SUCCESS:
      return {
        ...state,
      };
    case PRODUCT_CREATE_DETAILS_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case PRODUCT_CREATE_DETAILS_SUCCESS:
      const { product } = action;
      return {
        ...state,
        loading: false,
        product: {
          ...product,
          isProductEditAllowed: checkProductEditAllowed(product.status),
        },
      };
    case PRODUCT_CREATE_DETAILS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case CHANGE_PRODUCT_STATUS_SUCCESS: {
      const { item } = action;
      const { product } = state;

      if (item) {
        return {
          ...state,
          product: {
            ...product,
            status: item.status,
            isProductEditAllowed: checkProductEditAllowed(item.status),
          },
        };
      }
      return {
        ...state,
      };
    }
    default:
      return state;
  }
};

export default productCreateReducer;
