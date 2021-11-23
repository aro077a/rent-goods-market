import { client, marketplaceapiURL } from "../axios";
import { handleError, handleResponseAndThrowAnErrorIfExists } from "../error-handler";
import { ICategoryClassificator } from "../reducers/categoryReducer";
import {
  IProductCreateFormError,
  IProductCreateUploadedFileInfo,
  MIN_DAYS_BETWEEN_DATES,
} from "../reducers/productCreateReducer";
import { IProduct } from "../reducers/productReducer";
import { IApplicationStore } from "../store/rootReducer";
import { Product, ProductControllerApi } from "../types/marketplaceapi";
import { getCompressedImage } from "../utils";

import { fillClassificatorProductStatusValue } from "./classificatorActions";
import { throwIsHasErrorData } from "./paymentCardsActions";
import { mapProductDetailsImage } from "./productActions";
import { loadServicePackages } from "./productPromotionActions";

export const PRODUCT_UPDATE_DRAFT_LOADING = "PRODUCT_UPDATE_DRAFT_LOADING";
export const PRODUCT_UPDATE_DRAFT = "PRODUCT_UPDATE_DRAFT";

export const PRODUCT_CREATE_LOADING = "PRODUCT_CREATE_LOADING";
export const PRODUCT_CREATE_LOADING_SUCCESS = "PRODUCT_CREATE_LOADING_SUCCESS";
export const PRODUCT_CREATE_LOADING_ERROR = "PRODUCT_CREATE_LOADING_ERROR";

export const PRODUCT_CREATE_DETAILS_LOADING = "PRODUCT_CREATE_DETAILS_LOADING";
export const PRODUCT_CREATE_DETAILS_SUCCESS = "PRODUCT_CREATE_DETAILS_SUCCESS";
export const PRODUCT_CREATE_DETAILS_ERROR = "PRODUCT_CREATE_DETAILS_ERROR";

export const PRODUCT_CREATE_CHOOSE_CATEGORY = "PRODUCT_CREATE_CHOOSE_CATEGORY";
export const PRODUCT_CREATE_CHOOSE_SUB_CATEGORY = "PRODUCT_CREATE_CHOOSE_SUB_CATEGORY";

export const PRODUCT_CREATE_ATTACHING_FILE = "PRODUCT_CREATE_ATTACHING_FILE";
export const PRODUCT_CREATE_ATTACHING_FILE_SUCCESS = "PRODUCT_CREATE_ATTACHING_FILE_SUCCESS";
export const PRODUCT_CREATE_ATTACHING_FILE_ERROR = "PRODUCT_CREATE_ATTACHING_FILE_ERROR";
export const PRODUCT_CREATE_DETACHING_FILE = "PRODUCT_CREATE_DETACHING_FILE";
export const PRODUCT_CREATE_DETACHING_FILE_SUCCESS = "PRODUCT_CREATE_DETACHING_FILE_SUCCESS";
export const PRODUCT_CREATE_DETACHING_FILE_ERROR = "PRODUCT_CREATE_DETACHING_FILE_ERROR";

export const PRODUCT_DELETE_SUCCESS = "PRODUCT_DELETE_SUCCESS";

function getUpperLevelCategory(category: ICategoryClassificator): ICategoryClassificator {
  if (!category) return {};
  return category.parent ? getUpperLevelCategory(category.parent) : category;
}

function checkFormErrors(item: IProduct, parameters: string[]) {
  const requiredFields = ["name", "price", "category", "quantity", "shortDescription"];
  requiredFields.forEach((field) => {
    if (
      typeof item[field] === "undefined" ||
      item[field] === null ||
      !item[field].toString().length
    ) {
      parameters.push(field);
    }
  });
}

const uploadFileForProduct = async (uid: string, fileInfo: IProductCreateUploadedFileInfo) => {
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  let filename = fileInfo.file.name;
  const ext = filename.split(".").pop();
  if (!ext || ext.length < 3) {
    filename += ".jpg";
  }

  const formData = new FormData();
  formData.append("file", fileInfo.file, filename);
  return (await client.post(marketplaceapiURL + `/product/${uid}/upload`, formData, config)).data;
};

export const createSaveProduct =
  (item: IProduct, files: IProductCreateUploadedFileInfo[] = []) =>
  async (dispatch: any, getState: () => IApplicationStore) => {
    dispatch(productCreateLoadingAction());

    // (fix) Invalid field value: localizations[0].category (must not be null), category (must not be null)
    if (item.localizations) {
      if (item.localizations.length === 0) {
        item.localizations = null;
      } else {
        // (fix) update ALL locales with some fields
        item.localizations.forEach((itemloc) => {
          Object.keys(item).forEach((key) => {
            if (key in itemloc) {
              itemloc[key] = item[key];
            }
          });
        });
      }
    }

    // (fix) status null
    if (!item.status) item.status = Product.StatusEnum.DRF;

    const parameters: string[] = [];

    checkFormErrors(item, parameters);

    if (parameters.length) {
      dispatch(productCreateLoadingErrorAction("Check all fields", [{ message: "", parameters }]));
      return;
    }

    const currentDate = new Date();
    const publishDate = new Date(item.publishDate);

    currentDate.setHours(publishDate.getHours());
    currentDate.setMinutes(publishDate.getMinutes());
    currentDate.setSeconds(publishDate.getSeconds());
    currentDate.setMilliseconds(publishDate.getMilliseconds());

    if (currentDate.getTime() > publishDate.getTime()) {
      dispatch(
        productCreateLoadingErrorAction(
          "Publication date must be greater or equal to the current date",
          [
            {
              message: "Publication date must be greater than or equal to the current date",
              parameters: ["publishDate"],
            },
          ]
        )
      );
      return;
    }

    const expiredDate = new Date(item.expirationDate);

    expiredDate.setHours(publishDate.getHours());
    expiredDate.setMinutes(publishDate.getMinutes());
    expiredDate.setSeconds(publishDate.getSeconds());
    expiredDate.setMilliseconds(publishDate.getMilliseconds());

    if (
      expiredDate.getTime() < publishDate.getTime() ||
      expiredDate.getTime() < publishDate.getTime() + 1000 * 60 * 60 * 24 * MIN_DAYS_BETWEEN_DATES
    ) {
      dispatch(
        productCreateLoadingErrorAction(
          "Expiration date must be greater than publish date and no less than 21 days",
          [
            {
              message: "Expiration date must be greater than publish date and no less than 21 days",
              parameters: ["expirationDate"],
            },
          ]
        )
      );
      return;
    }

    const state = getState();

    try {
      const controller = new ProductControllerApi();
      let result = item.uid
        ? await controller.editProductUsingPOST(item)
        : await controller.addProductUsingPUT(item);

      handleResponseAndThrowAnErrorIfExists(result);

      item = result.body[0];

      for (const fileInfo of files.filter((item) => item.file)) {
        item = { ...item, ...(await uploadFileForProduct(item.uid, fileInfo)) };
      }

      result = await controller.editProductUsingPOST(item);

      handleResponseAndThrowAnErrorIfExists(result);

      item = result.body[0];

      fillClassificatorProductStatusValue([item], state);
      item.images = mapProductDetailsImage(item);
      dispatch(productCreateLoadingSuccessAction(item));
    } catch (err) {
      const {
        response: {
          data: {
            errorData: { message = err.toString(), parameters = [] },
          },
        },
      } = err;
      dispatch(productCreateLoadingErrorAction(message, parameters));
    }
  };

export const attachFile = (index: number, file: File) => async (dispatch: any) => {
  dispatch(productCreateAttachingFileAction(index));
  try {
    file = await getCompressedImage(file);
    let imageDataAs: string;
    if (URL.createObjectURL) {
      imageDataAs = URL.createObjectURL(file);
      setTimeout(() => URL.revokeObjectURL(imageDataAs), 1000);
    } /* old */ else {
      const reader = new FileReader();
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        imageDataAs = ev.target.result.toString();
      };
      reader.readAsDataURL(file);
    }
    dispatch(productCreateAttachingFileSuccessAction(index, imageDataAs, file));
  } catch (error) {
    dispatch(productCreateAttachingFileErrorAction(index, error.toString()));
  }
};

export const detachFile =
  (index: number, productUid: string) =>
  async (dispatch: any, getState: () => IApplicationStore) => {
    dispatch(productCreateDetachingFileAction(index));

    const state = getState();

    try {
      const imageLink = state.productCreateReducer.product.images[index];
      let product = state.productCreateReducer.product;

      if (imageLink) {
        const res = await new ProductControllerApi().deleteProductImageUsingDELETE({
          imageLink,
          uid: productUid,
        });
        handleResponseAndThrowAnErrorIfExists(res);
        product = res.body[0];
      }

      dispatch(productCreateDetachingFileSuccessAction(index, product));
    } catch (error) {
      dispatch(productCreateDetachingFileErrorAction(index, error.toString()));
    }
  };

export const updateProductDraft =
  (item?: IProduct, reset = false) =>
  async (dispatch: any, getState: () => IApplicationStore) => {
    const state = getState();
    const { uid } = item;

    if (typeof item.video !== "undefined" && !item.video.id) {
      delete item["video"];
    }

    if (uid && reset) {
      dispatch({ type: PRODUCT_UPDATE_DRAFT_LOADING });
      try {
        const result = await new ProductControllerApi().productDetailsUsingPOST({ uid });
        handleResponseAndThrowAnErrorIfExists(result);

        const item: IProduct = result.body[0];
        const categoryId = item.category
          ? getUpperLevelCategory(
              state.categoryReducer.flat.filter((c) => c.categoryCode === item.category)[0]
            ).categoryCode
          : "";
        fillClassificatorProductStatusValue([item], state);
        item.images = mapProductDetailsImage(item);
        dispatch({ type: PRODUCT_UPDATE_DRAFT, item, categoryId, reset });
      } catch (err) {
        dispatch(productCreateLoadingErrorAction(err.toString(), []));
      }
      return;
    } else {
      if (item.video && !item.video.type) {
        return dispatch(
          productCreateLoadingErrorAction("Unable to download video from this link", [
            {
              message: "Unable to download video from this link",
              parameters: ["video"],
            },
          ])
        );
      }
      dispatch({ type: PRODUCT_UPDATE_DRAFT, item, reset });
    }
  };

export const loadProductDetails =
  (uid: string) => async (dispatch: any, getState: () => IApplicationStore) => {
    dispatch(productCreateDetailsLoadingAction());
    try {
      const state = getState();

      const result = await new ProductControllerApi().productDetailsUsingPOST({
        uid,
      });
      handleResponseAndThrowAnErrorIfExists(result);
      const item: IProduct = result.body[0];

      fillClassificatorProductStatusValue([item], state);
      item.images = mapProductDetailsImage(item);

      /* TODO */
      if (item.featureCodes && item.featureCodes.length) {
        let { servicePackages } = state.productPromotionReducer;
        if (!servicePackages.length) {
          await dispatch(loadServicePackages());
        }
        /* TODO */
        servicePackages = getState().productPromotionReducer.servicePackages;
        //@ts-ignore
        item.features = servicePackages
          .filter((packageItem) => item.featureCodes.includes(packageItem.code))
          .map((item) => {
            return {
              active: true,
              duration: item.duration,
              expireDate: new Date(),
              type: {
                ...item,
              },
              uid: item.uid,
            };
          });
      }

      /*
    item.features = [
      {
        active: true,
        expireDate: new Date(2020, 6, 1),
        type: {
          code: "higlight_bold",
          currencyCode: "EUR",
          description:
            "Объявление в течение 7 дней будет выделено цветом в результатах поиска бонусом идет поднятие в поиске на первую позицию на этот же промежуток времени",
          duration: "7 days",
          name: "Выделить объявление",
          price: 29,
          uid: "HIGHLIGHT14D",
        },
      },
      {
        active: true,
        expireDate: new Date(2020, 6, 1),
        type: {
          code: "vip",
          currencyCode: "EUR",
          description:
            "Объявление в течение 7 дней будет выделено цветом в результатах поиска бонусом идет поднятие в поиске на первую позицию на этот же промежуток времени",
          duration: "7 days",
          name: "Выделить объявление",
          price: 29,
          uid: "HIGHLIGHT15D",
        },
      },
    ];
    */

      dispatch(productCreateDetailsSuccessAction(item));
    } catch (err) {
      dispatch(productCreateDetailsErrorAction(errorText));
    }
  };

export const chooseCategory = (catid: string) => ({
  type: PRODUCT_CREATE_CHOOSE_CATEGORY,
  catid,
});
export const chooseSubcategory = (catid: string) => ({
  type: PRODUCT_CREATE_CHOOSE_SUB_CATEGORY,
  catid,
});

export const deleteProduct = (uid: string) => async (dispatch: any) => {
  try {
    await new ProductControllerApi().deleteProductUsingDELETE({ uid });
    dispatch(productDeleteSuccessAction(uid));
  } catch (err) {}
};

const productCreateLoadingAction = () => ({
  type: PRODUCT_CREATE_LOADING,
});

const productCreateLoadingSuccessAction = (product: IProduct) => ({
  type: PRODUCT_CREATE_LOADING_SUCCESS,
  product,
});

const productCreateLoadingErrorAction = (error: any, parameters: IProductCreateFormError[]) => ({
  type: PRODUCT_CREATE_LOADING_ERROR,
  error,
  parameters,
});

const productCreateDetailsLoadingAction = () => ({
  type: PRODUCT_CREATE_DETAILS_LOADING,
});

const productCreateDetailsSuccessAction = (product: IProduct) => ({
  type: PRODUCT_CREATE_DETAILS_SUCCESS,
  product,
});

const productCreateDetailsErrorAction = (error: any) => ({
  type: PRODUCT_CREATE_DETAILS_ERROR,
  error,
});

const productCreateAttachingFileAction = (index: number) => ({
  type: PRODUCT_CREATE_ATTACHING_FILE,
  index,
});

const productCreateAttachingFileSuccessAction = (index: number, imageLink: string, file: File) => ({
  type: PRODUCT_CREATE_ATTACHING_FILE_SUCCESS,
  index,
  imageLink,
  file,
});

const productCreateAttachingFileErrorAction = (index: number, error: any) => ({
  type: PRODUCT_CREATE_ATTACHING_FILE_ERROR,
  index,
  error,
});

const productCreateDetachingFileAction = (index: number) => ({
  type: PRODUCT_CREATE_DETACHING_FILE,
  index,
});

const productCreateDetachingFileSuccessAction = (index: number, product: IProduct) => ({
  type: PRODUCT_CREATE_DETACHING_FILE_SUCCESS,
  index,
  product,
});

const productCreateDetachingFileErrorAction = (index: number, error: any) => ({
  type: PRODUCT_CREATE_DETACHING_FILE_ERROR,
  index,
  error,
});

const productDeleteSuccessAction = (uid: string) => ({
  type: PRODUCT_DELETE_SUCCESS,
  uid,
});
