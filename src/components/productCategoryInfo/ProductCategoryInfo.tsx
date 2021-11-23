import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Block } from "framework7-react";

import { useAppSelector } from "@/hooks/store";
import { getCategoriesClassificator } from "@/selectors/getCategoriesClassificator";
import { formatDate, getCategory, getSubRoutes } from "@/utils";

import { ProductCategoryInfoProps } from "./ProductCategoryInfo.types";

import "./ProductCategoryInfo.less";

export const ProductCategoryInfo = React.memo(
  ({ item: { category, productDate, store } }: ProductCategoryInfoProps) => {
    const { t } = useTranslation();

    const { categoriesClassificator } = useAppSelector(getCategoriesClassificator);

    const itemCategory = useMemo(
      () => getCategory(categoriesClassificator, category),
      [categoriesClassificator, category]
    );

    const [mainCategory, subCategory] = useMemo(() => getSubRoutes(itemCategory), [itemCategory]);

    const storeCode = useMemo(() => store?.homepage?.split("/").pop(), [store?.homepage]);

    // ! WAS !categoriesClassificator.length || !item
    if (!categoriesClassificator.length) {
      return null;
    }

    return (
      <Block className="category-info">
        <div className="category-info-content">
          <p>
            <span>{t("Posted")}</span> {formatDate(productDate.toString())}
          </p>
          {mainCategory && (
            <p>
              <span>{t("Category")}</span> <a>{mainCategory.categoryName}</a>
            </p>
          )}
          {subCategory && (
            <p>
              <span>{t("Subcategory")}</span> <a>{subCategory.categoryName}</a>
            </p>
          )}
          {storeCode && (
            <p>
              <span>{t("Store")}</span> <a href={`/store/${storeCode}`}>{store.name}</a>
            </p>
          )}
        </div>
      </Block>
    );
  }
);
ProductCategoryInfo.displayName = "ProductCategoryInfo";
