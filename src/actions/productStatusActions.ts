import { IProduct } from "../reducers/productReducer";
import { IApplicationStore } from "../store/rootReducer";
import { fillClassificatorProductStatusValue } from "./classificatorActions";
import { ProductControllerApi, Product } from "../types/marketplaceapi";
import {
  handleError,
  handleResponseAndThrowAnErrorIfExists,
} from "../error-handler";

export const CHANGE_PRODUCT_STATUS_LOADING = "CHANGE_PRODUCT_STATUS_LOADING";
export const CHANGE_PRODUCT_STATUS_SUCCESS = "CHANGE_PRODUCT_STATUS_SUCCESS";
export const CHANGE_PRODUCT_STATUS_ERROR = "CHANGE_PRODUCT_STATUS_ERROR";

export function getProductStatusRules(): {
  from: Product.StatusEnum;
  to: Product.StatusEnum[];
}[] {
  return "DRF->DRF/AFR/DLT, DCL->DRF, APR->PBL/DSC, PBL->AFR/PBL/SUS/DSC, SUS->SUS/DSC, OOS->OOS/DSC"
    .split(", ")
    .map((item) => {
      return {
        from: Product.StatusEnum[item.substr(0, item.indexOf("->"))],
        to: item
          .substr(item.indexOf("->") + 2)
          .split("/")
          .map((item) => Product.StatusEnum[item]),
      };
    });
}

export function getAllowedStatuses(
  status: Product.StatusEnum
): Product.StatusEnum[] {
  return (
    getProductStatusRules().filter((item) => item.from === status)[0]?.to || []
  );
}

export const changeProductStatus =
  (
    uid: string,
    oldStatus: Product.StatusEnum,
    newStatus: Product.StatusEnum,
    quantity?: number
  ) =>
  async (dispatch: any, getState: () => IApplicationStore) => {
    dispatch(changeProductStatusAction());
    if (oldStatus === newStatus && !quantity) {
      dispatch(changeProductStatusSuccessAction(null));
    } else {
      setTimeout(async () => {
        const state = getState();

        try {
          const data = { uid, status: newStatus, quantity };
          const controller = new ProductControllerApi();

          let result;
          let item: IProduct = null;

          if (newStatus === Product.StatusEnum.DLT) {
            // (fix) Error
            result = await controller.productDetailsUsingPOST({ uid });
            handleResponseAndThrowAnErrorIfExists(result);

            item = result.body[0];
            item.status = Product.StatusEnum.DLT;
            result = await controller.deleteProductUsingDELETE({ uid });
            handleResponseAndThrowAnErrorIfExists(result);
          } else {
            result = quantity
              ? await controller.updateProductQuantityUsingPOST(data)
              : await controller.updateProductStatusUsingPOST(data);
            handleResponseAndThrowAnErrorIfExists(result);

            item = result.body[0];
          }

          fillClassificatorProductStatusValue([item], state);
          dispatch(changeProductStatusSuccessAction(item, quantity));
        } catch (err) {
          dispatch(changeProductStatusErrorAction(err.toString()));
        }
      }, 800);
    }
  };

export const updateProductExpirationDate =
  (uid: string, expirationDate: Date) =>
  async (dispatch: any, getState: () => IApplicationStore) => {
    dispatch(changeProductStatusAction());
    const state = getState();
    try {
      /* TODO */
      const result =
        await new ProductControllerApi().updateProductExpirationDateUsingPOST({
          uid,
          expirationDate: expirationDate
            .toISOString()
            .substr(0, expirationDate.toISOString().lastIndexOf(".")) as any,
        });

      handleResponseAndThrowAnErrorIfExists(result);

      const item = result.body[0];

      fillClassificatorProductStatusValue([item], state);
      dispatch(changeProductStatusSuccessAction(item));
    } catch (err) {
      dispatch(changeProductStatusErrorAction(err.toString()));
    }
  };

const changeProductStatusAction = () => ({
  type: CHANGE_PRODUCT_STATUS_LOADING,
});

const changeProductStatusSuccessAction = (
  item: IProduct,
  quantity?: number
) => ({
  type: CHANGE_PRODUCT_STATUS_SUCCESS,
  item,
  quantity,
});

const changeProductStatusErrorAction = (error: any) => ({
  type: CHANGE_PRODUCT_STATUS_ERROR,
  error,
});
