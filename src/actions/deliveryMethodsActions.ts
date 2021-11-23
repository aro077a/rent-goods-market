import { handleResponseAndThrowAnErrorIfExists } from "@/error-handler";
import { isLoggedIn } from "@/selectors/isLoggedIn";
import { IApplicationStore } from "@/store/rootReducer";
import { DeliveryMethod, DeliveryMethodControllerApi } from "@/types/marketplaceapi";

export const DELIVERY_METHODS_ADD_LOADING = "DELIVERY_METHODS_ADD_LOADING";
export const DELIVERY_METHODS_ADD_SUCCESS = "DELIVERY_METHODS_ADD_SUCCESS";
export const DELIVERY_METHODS_ADD_ERROR = "DELIVERY_METHODS_ADD_ERROR";

export const DELIVERY_METHODS_ALL_LOADING = "DELIVERY_METHODS_ALL_LOADING";
export const DELIVERY_METHODS_ALL_SUCCESS = "DELIVERY_METHODS_ALL_SUCCESS";
export const DELIVERY_METHODS_ALL_ERROR = "DELIVERY_METHODS_ALL_ERROR";

const VALID_METHOD_UID_LENGTH = 36;

export const addDeliveryMethods = (deliveryMethod: DeliveryMethod) => async (dispatch) => {
  dispatch({ type: DELIVERY_METHODS_ADD_LOADING });
  try {
    let result;
    if (
      // ! Bug
      deliveryMethod.uid &&
      deliveryMethod.uid.length === VALID_METHOD_UID_LENGTH
    ) {
      result = await new DeliveryMethodControllerApi().updateAccountDeliveryMethodUsingPOST(
        deliveryMethod
      );
    } else {
      result = await new DeliveryMethodControllerApi().createAccountDeliveryMethodUsingPUT(
        deliveryMethod
      );
    }

    handleResponseAndThrowAnErrorIfExists(result);

    dispatch({ type: DELIVERY_METHODS_ADD_SUCCESS, item: result.body[0] });
  } catch (err) {
    console.error("at deliveryMethodsActions in addDeliveryMethods", err);

    dispatch({ type: DELIVERY_METHODS_ADD_ERROR, err });
  }
};

export const getAllDeliveryMethods = () => async (dispatch, getState: () => IApplicationStore) => {
  const state = getState();
  if (!isLoggedIn(state)) {
    return;
  }

  dispatch({ type: DELIVERY_METHODS_ALL_LOADING });
  try {
    const result = await new DeliveryMethodControllerApi().getAccountDeliveryMethodsUsingGET();
    handleResponseAndThrowAnErrorIfExists(result);

    dispatch({ type: DELIVERY_METHODS_ALL_SUCCESS, items: result.body || [] });
  } catch (err) {
    console.error("at deliveryMethodsActions in getAllDeliveryMethods", err);

    dispatch({ type: DELIVERY_METHODS_ALL_ERROR, err });
  }
};
