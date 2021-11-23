import { client, marketplaceapiURL } from "../axios";
import { ICategoryClassificator } from "../reducers/categoryReducer";
import { IApplicationStore } from "../store/rootReducer";
import { handleError } from "../error-handler";
import { ClassificatorControllerApi } from "@/types/marketplaceapi";

export const CATEGORY_LIST_LOADING = "CATEGORY_LIST_LOADING";
export const CATEGORY_LIST_LOADING_SUCCESS = "CATEGORY_LIST_LOADING_SUCCESS";
export const CATEGORY_LIST_LOADING_ERROR = "CATEGORY_LIST_LOADING_ERROR";

const categoryListLoadingAction = () => ({
  type: CATEGORY_LIST_LOADING,
});

const categoryListLoadingSuccessAction = (
  categories: ICategoryClassificator[],
  flat: ICategoryClassificator[]
) => ({
  type: CATEGORY_LIST_LOADING_SUCCESS,
  categories,
  flat,
});

const categoryListLoadingErrorAction = (error: unknown) => ({
  type: CATEGORY_LIST_LOADING_ERROR,
  error,
});

function mapCategories(
  categories: ICategoryClassificator[],
  allCategories: ICategoryClassificator[],
  parent?: ICategoryClassificator,
  top?: ICategoryClassificator
) {
  return categories.map((item) => {
    const { categoryCode } = item;
    item.children = mapCategories(
      allCategories.filter((item) => item.dependency === categoryCode),
      allCategories,
      item,
      !parent ? item : top
    );

    item.parent = parent;
    /* TODO */
    // @ts-ignore
    item.topParent = top;

    return item;
  });
}

export const loadCategories = () => async (dispatch, getState: () => IApplicationStore) => {
  dispatch(categoryListLoadingAction());

  const state = getState();
  const { language } = state.rootReducer;

  // ? maybe its better to use api class here
  try {
    const result = await client.get(
      marketplaceapiURL + `/classificator/productCategory?language=${language}`
    );

    if (!result) {
      throw new Error(handleError(result));
    }

    const categories: ICategoryClassificator[] = await result.data.body;

    dispatch(
      categoryListLoadingSuccessAction(
        mapCategories(
          categories.filter((item) => !item.dependency /* root elements */),
          categories
        ),
        categories
      )
    );
  } catch (err) {
    dispatch(categoryListLoadingErrorAction(err.toString()));
  }
};
