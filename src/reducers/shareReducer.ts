import { AnyAction } from "redux";
import { SHARE, SHARE_SUCCESS, SHARE_ERROR } from "../actions/shareActions";

export interface IShareState {
  loading?: boolean | null;
  error?: any;
}

const initialState: IShareState = {
  loading: null,
  error: null,
};

const shareReducer = (state = initialState, action: AnyAction): IShareState => {
  switch (action.type) {
    case SHARE:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SHARE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case SHARE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default shareReducer;
