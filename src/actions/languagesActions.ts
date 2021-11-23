import { ClassificatorWsControllerApi } from "@/types/commonapi";

export const SAVE_LANGUAGE_LIST = "SAVE_LANGUAGE_LIST";

const saveLanguageListAction = (languageList) => ({
  type: SAVE_LANGUAGE_LIST,
  payload: languageList,
});

export const getLanguages = () => async (dispatch) => {
  try {
    const { languageList } = await new ClassificatorWsControllerApi().getLanguageListUsingGET();
    dispatch(saveLanguageListAction(languageList));
  } catch (err) {
    console.log(err);
  }
};
