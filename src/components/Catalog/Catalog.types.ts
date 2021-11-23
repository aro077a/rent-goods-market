import { ICategory } from "@/store/rootReducer";
import { ICategoryClassificator } from "@/reducers/categoryReducer";
import { IProduct } from "@/reducers/productReducer";

import { SwipeoutActions } from "./CatalogItem/CatalogItem.types";

export type CatalogProps = {
  items?: IProduct[];
  categories?: ICategory[];
  chosenCategoryId?: string;
  chosenSubcategoryId?: string;
  categoriesClassificator?: ICategoryClassificator[];
  addToWish?(uid?: string): void;
  onClick?(uid: string): void;
  swipeoutActions?: SwipeoutActions[];
  groupBy?: string;
  simplePrice?: boolean;
  showStatus?: boolean;
  showAnalytics?: boolean;
  showFeaturesHiglight?: boolean;
  className?: string;
};
