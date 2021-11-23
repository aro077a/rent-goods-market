import { AnyAction } from "redux";
import {
  CHAT_LOADING,
  CHAT_LOADING_SUCCESS,
  CHAT_LOADING_ERROR,
} from "../actions/chatActions";

export interface IChatState {
  loading?: boolean | null;
  error?: any;
}

const initialState: IChatState = {
  loading: null,
  error: null,
};

const chatReducer = (state = initialState, action: AnyAction): IChatState => {
  switch (action.type) {
    case CHAT_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CHAT_LOADING_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case CHAT_LOADING_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default chatReducer;
