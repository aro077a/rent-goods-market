import { FileUploadControllerApi } from "../types/marketplaceapi";
import { getCompressedImage } from "../utils";

FileUploadControllerApi;

export const getStoreHomePage =
  (base64File: string, fileName: string, ownerUid: string) => async (dispatch: any) => {
    // dispatch(storeHomePageLoadingAction(true));
    try {
      const data =
        // ! WAS: uploadImageUsingPOST without 1
        (await new FileUploadControllerApi().uploadImageUsingPOST1(base64File, fileName, ownerUid))
          .body || [];

      console.log(data, "file data");

      // dispatch(saveStoreHomePageAction({ ...data[0] }));
      return data[0];
    } catch (error) {
      console.log(error, "error");
    } finally {
      // dispatch(storeHomePageLoadingAction(false));
    }
  };

export const getStoreHomePageFile = (file) => async (dispatch) => {
  try {
    const fileRes = await getCompressedImage(file);
    let imageDataAs: string;
    if (URL.createObjectURL) {
      imageDataAs = URL.createObjectURL(fileRes);
      setTimeout(() => URL.revokeObjectURL(imageDataAs), 1000);
    } /* old */ else {
      const reader = new FileReader();
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        imageDataAs = ev.target.result.toString();
      };
      reader.readAsDataURL(fileRes);
    }
    console.log({ imageDataAs, file });
  } catch (error) {
    console.error("at fileUploadActions in getStoreHomePageFile");

    // dispatch(productCreateAttachingFileErrorAction(index, error.toString()));
  }
};
