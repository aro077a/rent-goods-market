import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { BlockTitle, Block } from "framework7-react";
import { ICategoryClassificator } from "../../reducers/categoryReducer";

import "./style.less";
import { compose } from "redux";
import connectCategoriesClassificator from "../../store/connectCategoriesClassificator";

type Props = Partial<WithTranslation> & {
  categoryCode: string;
  categoriesClassificator?: ICategoryClassificator[];
};

function getUpperLevelCategoryName(category: ICategoryClassificator) {
  return category.parent
    ? getUpperLevelCategoryName(category.parent)
    : category.categoryName;
}

function getCategoriesSegments(
  category: ICategoryClassificator,
  path: ICategoryClassificator[] = []
) {
  if (category.parent) {
    path.push(category);
    getCategoriesSegments(category.parent, path);
  }
  return path;
}

const CategoryDetails = (props: Props) => {
  const { categoryCode, categoriesClassificator = [], t } = props;
  const category = categoriesClassificator.filter(
    (c) => c.categoryCode === categoryCode
  )[0];

  if (!category) return null;

  const segments = getCategoriesSegments(category);

  return (
    <>
      <BlockTitle>{t("Category")}</BlockTitle>
      <Block className="category">{getUpperLevelCategoryName(category)}</Block>
      {segments.length > 0 && (
        <>
          <BlockTitle>{t("Subcategory")}</BlockTitle>
          <Block className="category subcategory">
            <div>
              {
                segments.reverse().reduce((total, currentValue) => {
                  return {
                    ...total,
                    value:
                      total.categoryName + " / " + currentValue.categoryName,
                  };
                }).categoryName
              }
            </div>
          </Block>
        </>
      )}
    </>
  );
};

export default compose<React.FC<Props>>(
  withTranslation(),
  connectCategoriesClassificator
)(CategoryDetails);
