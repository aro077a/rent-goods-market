import React from "react";
import { Link, Toolbar } from "framework7-react";
import { compose } from "redux";
import connectCategories from "../store/connectCategories";
import { Badge } from "./Badge";
import { ICategory, IApplicationStore } from "../store/rootReducer";
import connectFilter from "../store/connectFilter";
import { ICategoryClassificator } from "../reducers/categoryReducer";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";

import "./CategoriesMenu.less";
import classNames from "classnames";

type Props = WithTranslation & {
  className?: string;
  categories?: ICategory[];
  chosenCategoryId?: string;
  chosenSubcategoryId?: string;
  chosenCategory?: ICategoryClassificator;
  chosenSubcategory?: ICategoryClassificator;
  chosenLocationPlace?: string | null;
  categoryOnClick?(catid: string): void;
  clearFilterOnClick?(): void;
  showBadges?: boolean;
};

const getCategoriesClasses = (empty: boolean) =>
  `categories${empty ? " empty" : ""}`;
export const getItemStyles = (item: ICategory) => ({
  backgroundColor: item.color,
});

const CategoriesMenu = ({
  className,
  categories,
  chosenCategory,
  chosenSubcategory,
  chosenLocationPlace,
  categoryOnClick,
  clearFilterOnClick,
  showBadges,
  t,
}: Props) => {
  return (
    <Toolbar
      className={classNames(
        getCategoriesClasses(!categories || !categories.length),
        className
      )}
      scrollable
      noBorder
      noHairline
      noShadow
    >
      {(chosenCategory || chosenSubcategory || chosenLocationPlace) &&
      showBadges ? (
        <>
          <Link
            tabLink="#"
            className="no-ripple"
            onClick={() => categoryOnClick(categories[0].id)}
          >
            <span
              className="category-item small-item"
              style={getItemStyles(categories[0])}
            >
              <i className={`icon ${categories[0].icon}`}></i>
              <Badge />
            </span>
          </Link>
          {chosenCategory && !chosenSubcategory && (
            <div className="chip">
              <span>{chosenCategory.categoryName}</span>
              <Link onClick={clearFilterOnClick}>
                <i className="icon ic-close-s"></i>
              </Link>
            </div>
          )}
          {chosenSubcategory && (
            <div className="chip">
              <span>{chosenSubcategory.categoryName}</span>
              <Link onClick={clearFilterOnClick}>
                <i className="icon ic-close-s"></i>
              </Link>
            </div>
          )}
          {chosenLocationPlace && (
            <div className="chip">
              <span>{chosenLocationPlace}</span>
              <Link onClick={clearFilterOnClick}>
                <i className="icon ic-close-s"></i>
              </Link>
            </div>
          )}
        </>
      ) : (
        categories.map((item, i) => (
          <Link
            key={i}
            tabLink="#"
            className="no-ripple"
            onClick={() => categoryOnClick(item.id)}
          >
            <span className="category-item" style={getItemStyles(item)}>
              <i className={`icon ${item.icon}`}></i>
            </span>
            <span className="tabbar-label">{t(item.name)}</span>
          </Link>
        ))
      )}
    </Toolbar>
  );
};

const mapStateToProps = (state: IApplicationStore) => {
  const { chosenCategoryId, chosenSubcategoryId, locationPlace } =
    state.filterReducer;
  return {
    chosenLocationPlace: locationPlace,
    chosenCategory: state.categoryReducer.flat
      ? state.categoryReducer.flat.filter(
          (item) => item.categoryCode === chosenCategoryId
        )[0]
      : null,
    chosenSubcategory: state.categoryReducer.flat
      ? state.categoryReducer.flat.filter(
          (item) => item.categoryCode === chosenSubcategoryId
        )[0]
      : null,
  };
};

const connectChosenSubcategory = connect(mapStateToProps);

export default compose<any>(
  withTranslation(),
  connectCategories,
  connectChosenSubcategory,
  connectFilter
)(CategoriesMenu);
