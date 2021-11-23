import { IApplicationStore, ICategory } from "../store/rootReducer";
import { ICategoryClassificator } from "../reducers/categoryReducer";

export const getCategory = ({
  rootReducer,
  filterReducer,
}: IApplicationStore): ICategory => {
  const { localConfig } = rootReducer;
  if (!localConfig) return null;
  const { categories } = localConfig;
  return categories
    ? categories.filter((item) => item.id === filterReducer.chosenCategoryId)[0]
    : null;
};

export const getSubcategories = (
  state: IApplicationStore
): ICategoryClassificator[] => {
  const category = getCategory(state);
  const { categories } = state.categoryReducer;
  const categoryClassificatorItem =
    category && categories
      ? categories.filter((item) => item.categoryCode === category.id)[0]
      : null;

  return categoryClassificatorItem ? categoryClassificatorItem.children : [];
};
