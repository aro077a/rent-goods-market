export const UPLOAD_IMAGE_START = "UPLOAD_IMAGE_START";
export const UPLOAD_IMAGE_SUCCESS = "UPLOAD_IMAGE_SUCCESS";
export const UPLOAD_IMAGE_FAILURE = "UPLOAD_IMAGE_FAILURE";

export const POST_PRODUCTS_START = "POST_PRODUCTS_START";
export const POST_PRODUCTS_SUCCESS = "POST_PRODUCTS_SUCCESS";
export const POST_PRODUCTS_FAILURE = "POST_PRODUCTS_FAILURE";

export interface UploadImageStart {
  type: typeof UPLOAD_IMAGE_START;
}
export interface UploadImageSuccess {
  type: typeof UPLOAD_IMAGE_SUCCESS;
  payload: any;
}
export interface UploadImageFailure {
  type: typeof UPLOAD_IMAGE_FAILURE;
  payload: any;
}

export interface PostProductsStart {
  type: typeof POST_PRODUCTS_START;
}
export interface PostProductsSuccess {
  type: typeof POST_PRODUCTS_SUCCESS;
  payload: any;
}
export interface PostProductsFailure {
  type: typeof POST_PRODUCTS_FAILURE;
  payload: any;
}

export const uploadingImageStart = (): UploadImageStart => {
  return { type: "UPLOAD_IMAGE_START" };
};
export const uploadingImageSuccess = (payload: any): UploadImageSuccess => {
  return { type: "UPLOAD_IMAGE_SUCCESS", payload };
};
export const uploadingImageFailure = (payload: any): UploadImageFailure => {
  return { type: "UPLOAD_IMAGE_FAILURE", payload };
};

export const postProductsStart = (): PostProductsStart => {
  return { type: "POST_PRODUCTS_START" };
};
export const postProductsSuccess = (payload: any): PostProductsSuccess => {
  return { type: "POST_PRODUCTS_SUCCESS", payload };
};
export const postProductsFailure = (payload: any): PostProductsFailure => {
  return { type: "POST_PRODUCTS_FAILURE", payload };
};

export type UploadImageActionTypes =
  | UploadImageStart
  | UploadImageSuccess
  | UploadImageFailure
  | PostProductsStart
  | PostProductsSuccess
  | PostProductsFailure;
