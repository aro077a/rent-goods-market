import i18n from "i18next";

import { ErrorData } from "./types/marketplaceapi";

const PAYMENTAPI_AUTHORIZATION_CLIENT_ERROR = 4101;
const PAYMENTAPI_AUTHORIZATION_ERROR = 4102;
const PAYMENTAPI_ERROR_VALIDATION = 4103;
const PAYMENTAPI_ERROR_OPERATION_IS_NOT_ALLOWED = 4106;
const PAYMENTAPI_ORDER_ITEMS_TOTAL_AMOUNTS_IS_INCORRECT = 4201;
const PAYMENTAPI_ORDER_TOTAL_AMOUNT_IS_INCORRECT = 4202;
const PAYMENTAPI_ORDER_ITEMS_DISCOUNT_IS_INCORRECT = 4203;
const PAYMENTAPI_INCORRECT_ORDER_TAX_INFORMATION = 4204;
const PAYMENTAPI_INVALID_SELLER = 4501;
const PAYMENTAPI_ERROR_PARTIAL_PAYMENT_OPERATION_IS_NOT_ALLOWED = 4107;
const PAYMENTAPI_PAYMENT_AMOUNT_IS_GREATER_THAN_ORDER_AMOUNT = 4108;
const PAYMENTAPI_TOTAL_OF_PARTIAL_PAYMENT_AMOUNTS_IS_GREATER_THAN_ORDER_AMOUNT = 4109;
const PAYMENTAPI_PAYMENT_AMOUNT_IS_SMALLER_THAN_ALLOWED_MIN_AMOUNT_FOR_FIRST_PAYMENT = 4110;

const COMMONAPI_AUTHORIZATION_CLIENT_ERROR = 5101;
const COMMONAPI_AUTHORIZATION_ERROR = 5102;
const COMMONAPI_ERROR_VALIDATION = 5103;
const COMMONAPI_ERROR_OBJECT_NOT_FOUND = 5104;
const COMMONAPI_ERROR_OPERATION_IS_NOT_ALLOWED = 5106;
const COMMONAPI_ERROR_OERATION_LIMIT = 5107;
const COMMONAPI_ERROR_PHONE_ALREADY_USED = 5108;
const COMMONAPI_ERROR_USER_INSUFFICIENT_PERMISSIONS = 5155;
const COMMONAPI_ERROR_USER_NOT_FOUND = 5156;
const COMMONAPI_ERROR_REGISTRATION_IS_NOT_ALLOWED = 5157;
const COMMONAPI_ERROR_INVALID_AMOUNT = 5160;
const COMMONAPI_ERROR_INSUFFICIENT_FUNDS = 5161;
const COMMONAPI_ERROR_CARD_TOPUP = 5162;
const COMMONAPI_ERROR_TRANSFER_OPERATION = 5200;
const COMMONAPI_ERROR_LINKED_ACCOUNT = 5201;
const COMMONAPI_ERROR_ONE_CARD_PER_CURRENCY = 5202;
const COMMONAPI_ERROR_IBAN_NOT_FOUND = 5401;
const COMMONAPI_ERROR_IBAN_UNAVAILABLE_FOR_OPERATION = 5402;
const COMMONAPI_WARNING_BELONGS_SAME_ACCOUNT = 5403;

const MARKETPLACE_ERROR_VALIDATION = 8103;
const MARKETPLACE_AUTHORIZATION_CLIENT_ERROR = 8101;
const MARKETPLACE_AUTHORIZATION_ERROR = 8102;
const MARKETPLACE_ERROR_OBJECT_NOT_FOUND = 8104;
const MARKETPLACE_ERROR_PRODUCT_IMAGE_IS_EMPTY = 8107;
const MARKETPLACE_PRODUCT_INVALID_STATUS = 8501;
const MARKETPLACE_PRODUCT_INVALID_QUANTITY = 8502;
const MARKETPLACE_PRODUCT_INVALID_EXPIRATION_DATE = 8503;
const MARKETPLACE_PRODUCT_INVALID_PARAMETERS = 8504;
const MARKETPLACE_ERROR_FILE_UPLOAD = 8140;
const MARKETPLACE_ERROR_FILE_DELETE = 8141;
const MARKETPLACE_ERROR_FILE_DOWNLOAD = 8142;
const MARKETPLACE_ERROR_INVALID_PRODUCT_SOURCE = 8201;
const MARKETPLACE_ERROR_DELIVERY_NOT_AVAILABLE = 8300;
const MARKETPLACE_INVALID_DISCOUNT_AMOUNT_RANGE_FROM = 8400;

const getMessageByCode = (code: number): string | null => {
  switch (code) {
    case MARKETPLACE_ERROR_VALIDATION:
    case COMMONAPI_ERROR_VALIDATION:
    case PAYMENTAPI_ERROR_VALIDATION:
      return "Request validation error";

    case MARKETPLACE_AUTHORIZATION_CLIENT_ERROR:
    case MARKETPLACE_AUTHORIZATION_ERROR:
    case COMMONAPI_AUTHORIZATION_CLIENT_ERROR:
    case COMMONAPI_AUTHORIZATION_ERROR:
    case PAYMENTAPI_AUTHORIZATION_CLIENT_ERROR:
    case PAYMENTAPI_AUTHORIZATION_ERROR:
      return "Authorization error";

    case MARKETPLACE_ERROR_OBJECT_NOT_FOUND:
    case COMMONAPI_ERROR_OBJECT_NOT_FOUND:
      return "Object not found";

    case MARKETPLACE_PRODUCT_INVALID_STATUS:
      return "Product invalid status";

    case MARKETPLACE_ERROR_FILE_UPLOAD:
      return "Image upload error";

    case MARKETPLACE_ERROR_FILE_DELETE:
      return "Image delete error";

    case MARKETPLACE_ERROR_FILE_DOWNLOAD:
      return "File download error";

    case MARKETPLACE_ERROR_PRODUCT_IMAGE_IS_EMPTY:
      return "Product must have at least one image";

    case MARKETPLACE_ERROR_INVALID_PRODUCT_SOURCE:
      return "Invalid product source";

    case MARKETPLACE_PRODUCT_INVALID_QUANTITY:
      return "Incorrect product quantity";

    case MARKETPLACE_PRODUCT_INVALID_EXPIRATION_DATE:
      return "Incorrect expiration date";

    case MARKETPLACE_PRODUCT_INVALID_PARAMETERS:
      return "Incorrect product parameters";

    case MARKETPLACE_ERROR_DELIVERY_NOT_AVAILABLE:
      return "Delivery is not available";

    case MARKETPLACE_INVALID_DISCOUNT_AMOUNT_RANGE_FROM:
      return "Discount amount range from must be greater then fixed discount amount";

    case COMMONAPI_ERROR_OPERATION_IS_NOT_ALLOWED:
    case PAYMENTAPI_ERROR_OPERATION_IS_NOT_ALLOWED:
      return "Operation is not allowed";

    case COMMONAPI_ERROR_OERATION_LIMIT:
      return "Operation limit reached";

    case COMMONAPI_ERROR_PHONE_ALREADY_USED:
      return "Phone already used";

    case COMMONAPI_ERROR_USER_INSUFFICIENT_PERMISSIONS:
      return "User has insufficient permissions";

    case COMMONAPI_ERROR_USER_NOT_FOUND:
      return "User not found";

    case COMMONAPI_ERROR_REGISTRATION_IS_NOT_ALLOWED:
      return "Registration from this country is not allowed";

    case COMMONAPI_ERROR_INVALID_AMOUNT:
      return "Invalid topup amount";

    case COMMONAPI_ERROR_INSUFFICIENT_FUNDS:
      return "Insufficient funds";

    case COMMONAPI_ERROR_CARD_TOPUP:
      return "Card topup error";

    case COMMONAPI_ERROR_TRANSFER_OPERATION:
      return "Transfer operation problem";

    case COMMONAPI_ERROR_LINKED_ACCOUNT:
      return "Account does not have linked account";

    case COMMONAPI_ERROR_ONE_CARD_PER_CURRENCY:
      return "Only one card per currency is allowed";

    case COMMONAPI_ERROR_IBAN_NOT_FOUND:
      return "Wrong Account Number";

    case COMMONAPI_ERROR_IBAN_UNAVAILABLE_FOR_OPERATION:
      return "Account Number is not available for operations";

    case COMMONAPI_WARNING_BELONGS_SAME_ACCOUNT:
      return "Account Number belongs to Sender Account";

    case PAYMENTAPI_ORDER_ITEMS_TOTAL_AMOUNTS_IS_INCORRECT:
      return "Order items total amounts is incorrect";

    case PAYMENTAPI_ORDER_TOTAL_AMOUNT_IS_INCORRECT:
      return "Order total amount is incorrect";

    case PAYMENTAPI_ORDER_ITEMS_DISCOUNT_IS_INCORRECT:
      return "Order items discount is incorrect";

    case PAYMENTAPI_INCORRECT_ORDER_TAX_INFORMATION:
      return "Incorrect order tax information";

    case PAYMENTAPI_INVALID_SELLER:
      return "Invalid order seller";

    case PAYMENTAPI_ERROR_PARTIAL_PAYMENT_OPERATION_IS_NOT_ALLOWED:
      return "Partial payment operation is not allowed";

    case PAYMENTAPI_PAYMENT_AMOUNT_IS_GREATER_THAN_ORDER_AMOUNT:
      return "Payment amount is greater than order amount";

    case PAYMENTAPI_TOTAL_OF_PARTIAL_PAYMENT_AMOUNTS_IS_GREATER_THAN_ORDER_AMOUNT:
      return "Total payment amount is greater than order amount";

    case PAYMENTAPI_PAYMENT_AMOUNT_IS_SMALLER_THAN_ALLOWED_MIN_AMOUNT_FOR_FIRST_PAYMENT:
      return "Payment amount is smaller than allowed minimum amount for the first payment";

    default:
      return null;
  }
};

export const handleError = (error): string => {
  let errorMessage = error.toString();

  if ("errorData" in error) {
    const errorData: ErrorData = error.errorData;
    const message = getMessageByCode(errorData.code);

    if (message !== null) {
      errorMessage = message;
    }
  }

  if ("warningData" in error) {
    const message = error.warningData.errorMessage;

    if (message !== null) {
      errorMessage = message;
    }
  }

  return i18n.t(errorMessage);
};

export const handleResponseAndThrowAnErrorIfExists = (response) => {
  if (response.errorData) {
    throw new Error(handleError(response));
  }
};
