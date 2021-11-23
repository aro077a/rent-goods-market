import { AnyAction } from "redux";

import { SAVE_LANGUAGE_LIST } from "@/actions/languagesActions";
import { Language } from "@/types/commonapi";

export interface ILanguageListReducerState {
  languageList: Language[];
}

const initialState: ILanguageListReducerState = {
  languageList: [],
};

const languageListReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SAVE_LANGUAGE_LIST:
      return {
        ...state,
        languageList: action.payload,
      };
    default:
      return state;
  }
};

export default languageListReducer;
