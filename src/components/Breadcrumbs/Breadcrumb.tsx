import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { getCategoriesClassificator } from "@/selectors/getCategoriesClassificator";
import { chooseCategorySubcategory } from "@/actions/filterActions";
import { getCategory, getSubRoutes } from "@/utils";
import { useAppSelector } from "@/hooks/store";

import { BreadcrumbsProps } from "./Breadcrumbs.types";

import "./Breadcrumbs.less";

export const Breadcrumbs = React.memo(
  ({ categoryCode, hideLast, handleBackToMain }: BreadcrumbsProps) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const categoriesClassificator = useAppSelector(getCategoriesClassificator);

    const [subRoutes, setSubRoutes] = useState([]);

    useEffect(() => {
      const category = getCategory(categoriesClassificator, categoryCode);
      const subRoutes = getSubRoutes(category);

      if (hideLast) {
        subRoutes.pop();
      }
      setSubRoutes(subRoutes);
    }, [categoryCode, categoriesClassificator, hideLast]);

    const handleClick = useCallback(
      (categoryCode) => {
        dispatch(chooseCategorySubcategory(subRoutes[0].categoryCode, categoryCode));
      },
      [dispatch, subRoutes]
    );

    return (
      <div className="breadcrumb block-title" slot="before-inner">
        <span onClick={handleBackToMain}>{t("Main")}</span>
        {categoryCode &&
          subRoutes.map((route) => (
            <span key={route.categoryCode} onClick={() => handleClick(route.categoryCode)}>
              {route.categoryName}
            </span>
          ))}
      </div>
    );
  }
);
Breadcrumbs.displayName = "Breadcrumb";
