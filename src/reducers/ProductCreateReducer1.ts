import {
  UPLOAD_IMAGE_FAILURE,
  UPLOAD_IMAGE_START,
  UPLOAD_IMAGE_SUCCESS,
  UploadImageActionTypes,
} from "@/actions/CreateProductActions/CreateProductActionTypes";

export interface State {
  isLoading: boolean;
  createdProduct: any;
}

export const initialState: State = {
  createdProduct: [],
  isLoading: false,
};

export const createProductReducer = (
  state: State = initialState,
  action: UploadImageActionTypes
) => {
  switch (action.type) {
    case UPLOAD_IMAGE_START:
      return {
        isLoading: true,
      };
    case UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        createdProduct: action.payload,
      };
    case UPLOAD_IMAGE_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};
