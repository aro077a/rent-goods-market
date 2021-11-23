import { AnyAction } from "redux";
import {
  MESSAGE_FILE_ATTACHING,
  MESSAGE_FILE_ATTACHING_ERROR,
  MESSAGE_FILE_ATTACHING_SUCCESS,
  MESSAGE_FILE_DETACHING_SUCCESS,
  MESSAGE_FILES_CLEAR,
  MESSAGE_SENDING,
  MESSAGE_SENDING_ERROR,
  MESSAGE_SENDING_SUCCESS,
} from "../actions/contactSupportActions";

export interface SupportMessage {
  email?: string;
  subject?: string;
  message?: string;
  parameters?: { [key: string]: string };
}

export interface IUploadedFileInfo {
  imageLink?: string;
  file?: File;
}

export interface IContactSupportState {
  sending?: boolean;
  error?: any;
  fileAttaching?: boolean;
  fileAttachingError?: any;
  files?: IUploadedFileInfo[];
}

const initialState: IContactSupportState = {
  sending: false,
  error: null,
  fileAttaching: false,
  fileAttachingError: null,
  files: [],
};

const profileReducer = (
  state = initialState,
  action: AnyAction
): IContactSupportState => {
  switch (action.type) {
    case MESSAGE_SENDING:
      return {
        ...state,
        sending: true,
        error: null,
      };
    case MESSAGE_SENDING_SUCCESS:
      return {
        ...state,
        sending: false,
        error: null,
      };
    case MESSAGE_SENDING_ERROR:
      return {
        ...state,
        sending: false,
        error: action.error,
      };
    case MESSAGE_FILE_ATTACHING:
      return {
        ...state,
        fileAttaching: true,
        fileAttachingError: null,
      };
    case MESSAGE_FILE_ATTACHING_SUCCESS:
      const { imageLink, file } = action;
      const { files } = state;

      const fileInfo: IUploadedFileInfo = {
        imageLink,
        file,
      };
      files[files.length] = fileInfo;

      return {
        ...state,
        fileAttaching: false,
        fileAttachingError: null,
        files,
      };
    case MESSAGE_FILE_ATTACHING_ERROR:
      return {
        ...state,
        fileAttaching: false,
        fileAttachingError: action.error,
      };
    case MESSAGE_FILE_DETACHING_SUCCESS:
      const { index } = action;

      let j = 0;
      const newFiles: IUploadedFileInfo[] = [];
      state.files.forEach((fileInfo, i) => {
        if (i !== index) {
          newFiles[j] = {
            imageLink: fileInfo.imageLink,
            file: fileInfo.file,
          };
          j++;
        }
      });

      return {
        ...state,
        fileAttaching: false,
        fileAttachingError: null,
        files: newFiles,
      };
    case MESSAGE_FILES_CLEAR:
      return {
        ...state,
        fileAttaching: false,
        fileAttachingError: null,
        files: [],
      };
    default:
      return state;
  }
};

export default profileReducer;
