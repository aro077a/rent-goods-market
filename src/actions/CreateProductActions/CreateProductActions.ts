import { AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { ProductControllerApi } from "@/types/marketplaceapi";

import {
  uploadingImageFailure,
  uploadingImageStart,
  uploadingImageSuccess,
} from "./CreateProductActionTypes";

export const addNewProduct = (product: any): ThunkAction<void, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    try {
      dispatch(uploadingImageStart());
      const controller = new ProductControllerApi();
      const res = await controller.addProductUsingPUT(product);
      dispatch(uploadingImageSuccess(res));
    } catch (res) {
      dispatch(uploadingImageFailure(res));
    }
  };
};
