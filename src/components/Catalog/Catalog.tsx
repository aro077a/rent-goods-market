import React from "react";
import { List, ListGroup, ListItem } from "framework7-react";
import { compose } from "redux";
import cn from "classnames";
import chain from "lodash/chain";

import connectCategories from "@/store/connectCategories";
import connectFilter from "@/store/connectFilter";
import connectCategoriesClassificator from "@/store/connectCategoriesClassificator";

import { CatalogItem } from "./CatalogItem";
import { CatalogProps } from "./Catalog.types";

import "./Catalog.less";

const Catalog = ({
  items,
  addToWish,
  categoriesClassificator,
  onClick,
  swipeoutActions,
  groupBy,
  simplePrice,
  showStatus,
  showAnalytics,
  showFeaturesHiglight,
  className,
}: CatalogProps) => (
  <List className={cn("catalog", className)} mediaList noChevron noHairlines>
    {!groupBy
      ? items?.map((item) => (
          <CatalogItem
            key={item.uid}
            item={item}
            categories={categoriesClassificator}
            addToWish={addToWish}
            slot="list"
            onClick={onClick}
            swipeoutActions={swipeoutActions}
            simplePrice={simplePrice}
            showStatus={showStatus}
            showAnalytics={showAnalytics}
            showFeaturesHiglight={showFeaturesHiglight}
          />
        ))
      : chain(items)
          .groupBy(groupBy)
          .map((value, key) => (
            <ListGroup key={key}>
              <ListItem title={key} groupTitle />
              {value.map((item) => (
                <CatalogItem
                  key={item.uid}
                  item={item}
                  categories={categoriesClassificator}
                  addToWish={addToWish}
                  slot="list"
                  onClick={onClick}
                  swipeoutActions={swipeoutActions}
                  simplePrice={simplePrice}
                  showStatus={showStatus}
                  showAnalytics={showAnalytics}
                  showFeaturesHiglight={showFeaturesHiglight}
                />
              ))}
            </ListGroup>
          ))
          .value()}
  </List>
);

export default compose<React.FunctionComponent<CatalogProps>>(
  connectFilter,
  connectCategories,
  connectCategoriesClassificator
)(Catalog);
