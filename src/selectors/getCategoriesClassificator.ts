import { IApplicationStore } from "@/store/rootReducer";

export const getCategoriesClassificator = (state: IApplicationStore) => ({
  categoriesClassificator: state.categoryReducer.flat || [],
});
