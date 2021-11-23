import React, { useCallback } from "react";
import { List, ListItem, Col } from "framework7-react";
import { useTranslation } from "react-i18next";

import { StoreNavProps } from "./StoreNav.types";

import "./StoreNav.less";

export const StoreNav = ({ selectedMenu, handleSelect, onlyHomepage }: StoreNavProps) => {
  const { t } = useTranslation();

  const onHomepageClick = useCallback(() => handleSelect("all-products"), [handleSelect]);

  const onAllProductsClick = useCallback(() => handleSelect("all-products"), [handleSelect]);

  return (
    <Col className="store-main-nav" width="100">
      <List className="store-main-nav-list">
        <ListItem
          className={`${selectedMenu === "homepage" ? "active" : ""} store-main-nav-list-item`}
          title={t("Homepage").toString()}
          onClick={onHomepageClick}
        ></ListItem>
        <ListItem
          className={`${selectedMenu === "all-products" ? "active" : ""} store-main-nav-list-item`}
          title={t("All Products").toString()}
          onClick={onAllProductsClick}
          disabled={onlyHomepage}
        />
      </List>
    </Col>
  );
};
