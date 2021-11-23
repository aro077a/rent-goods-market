import { ICategoryClassificator } from "@/reducers/categoryReducer";
import { F7SwipeoutButton, F7ListItem, F7SwipeoutActions } from "framework7-react";

import { IProduct } from "@/reducers/productReducer";

export type SwipeoutActions = F7SwipeoutActions.Props & {
  buttons: F7SwipeoutButton.Props[];
};

export type CatalogItemProps = F7ListItem.Props & {
  item: IProduct;
  categories?: ICategoryClassificator[];
  addToWish(uid: string): void;
  swipeoutActions?: SwipeoutActions[];
  simplePrice?: boolean;
  showStatus?: boolean;
  showAnalytics?: boolean;
  showFeaturesHiglight?: boolean;
};
