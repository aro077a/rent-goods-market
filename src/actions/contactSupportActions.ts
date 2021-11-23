import { SupportMessage } from "@/reducers/contactSupportReducer";
import { IApplicationStore } from "@/store/rootReducer";
import { OmnideskTicket, OmnideskTicketControllerApi } from "@/types/marketplaceapi";
import { getCompressedImage, getPlatform, Platform } from "@/utils";
import { client, marketplaceapiURL } from "@/axios";
import { handleResponseAndThrowAnErrorIfExists } from "@/error-handler";

const pjson = require("../../package.json");

export const MESSAGE_SENDING = "MESSAGE_SENDING";
export const MESSAGE_SENDING_SUCCESS = "MESSAGE_SENDING_SUCCESS";
export const MESSAGE_SENDING_ERROR = "MESSAGE_SENDING_ERROR";

export const MESSAGE_FILE_ATTACHING = "MESSAGE_FILE_ATTACHING";
export const MESSAGE_FILE_ATTACHING_SUCCESS = "MESSAGE_FILE_ATTACHING_SUCCESS";
export const MESSAGE_FILE_ATTACHING_ERROR = "MESSAGE_FILE_ATTACHING_ERROR";

export const MESSAGE_FILE_DETACHING_SUCCESS = "MESSAGE_FILE_DETACHING_SUCCESS";

export const MESSAGE_FILES_CLEAR = "MESSAGE_FILES_CLEAR";

const sendMessageAction = () => ({
  type: MESSAGE_SENDING,
});

const sendMessageSuccessAction = () => ({
  type: MESSAGE_SENDING_SUCCESS,
});

const sendMessageErrorAction = (error: unknown) => ({
  type: MESSAGE_SENDING_ERROR,
  error,
});

const messageFileAttachingAction = () => ({
  type: MESSAGE_FILE_ATTACHING,
});

const messageFileAttachingSuccessAction = (imageLink: string, file: File) => ({
  type: MESSAGE_FILE_ATTACHING_SUCCESS,
  imageLink,
  file,
});

const messageFileAttachingErrorAction = (error: unknown) => ({
  type: MESSAGE_FILE_ATTACHING_ERROR,
  error,
});

const messageFileDetachingSuccessAction = (index: number) => ({
  type: MESSAGE_FILE_DETACHING_SUCCESS,
  index,
});

const uploadFile = async (accountUid: string, bucket: string, file: File) => {
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  const url = `${marketplaceapiURL}/image/${accountUid}/upload`;
  const formData = new FormData();
  formData.append("bucket", bucket);
  formData.append("file", file);
  const response = await client.post(url, formData, config);
  if (!response.data) {
    throw new Error("Could not upload image");
  }
  return response.data.body[0].url;
};

export const sendMessage =
  (message: SupportMessage) => async (dispatch, getState: () => IApplicationStore) => {
    dispatch(sendMessageAction());

    const state = getState();
    const profile = state.sessionReducer.profile;

    try {
      const ticket: OmnideskTicket = {
        accountUid: profile.uid,
        firstName: profile.person.name,
        lastName: profile.person.surname,
        languageCode: state.rootReducer.language,
      };

      const phone = profile.accountPhones && profile.accountPhones.filter((p) => p.primary)[0];
      if (phone) {
        ticket.phone = phone.countryCode + phone.number;
      }

      ticket.email = message.email;
      ticket.subject = message.subject;
      ticket.body = message.message;
      ticket.customParameters = message.parameters || {};

      ticket.customParameters.version = pjson.version;

      const platform = getPlatform();
      switch (platform) {
        case Platform.Android:
          ticket.customParameters.platform = "Android";
          break;
        case Platform.iOS:
          ticket.customParameters.platform = "iOS";
          break;
        default:
          ticket.customParameters.platform = "WEB";
      }

      const attachments = [];
      const files = state.contactSupportReducer.files;
      if (files.length > 0) {
        const bucket = "omnidesk";
        for (const fileInfo of files) {
          const url = await uploadFile(profile.uid, bucket, fileInfo.file);
          attachments.push(url);
        }
        ticket.attachments = attachments;
      }

      const result = await OmnideskTicketControllerApi.prototype.createOmnideskTicketUsingPUT(
        ticket
      );

      handleResponseAndThrowAnErrorIfExists(result);

      const createdTicket = result.body;
      console.log(createdTicket);

      dispatch(sendMessageSuccessAction());
    } catch (err) {
      console.error("atcontactSupportActions in sendMessage", err);

      let errorText = err.toString();
      if (err.response && err.response.data && err.response.data.error) {
        errorText = err.response.data.error;
      }
      dispatch(sendMessageErrorAction(errorText));
    }
  };

export const attachFile = (file: File) => async (dispatch) => {
  dispatch(messageFileAttachingAction());
  try {
    file = await getCompressedImage(file);
    let imageDataAs: string;
    const reader = new FileReader();
    reader.onload = (ev: ProgressEvent<FileReader>) => {
      imageDataAs = ev.target.result.toString();
      dispatch(messageFileAttachingSuccessAction(imageDataAs, file));
    };
    reader.readAsDataURL(file);
  } catch (error) {
    dispatch(messageFileAttachingErrorAction(error.toString()));
  }
};

export const detachFile = (index: number) => async (dispatch) => {
  dispatch(messageFileDetachingSuccessAction(index));
};

export const deleteFiles = () => (dispatch) => {
  dispatch({ type: MESSAGE_FILES_CLEAR });
};
