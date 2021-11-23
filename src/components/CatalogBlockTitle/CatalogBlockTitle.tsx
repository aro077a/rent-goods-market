import React from "react";
import { Link, BlockTitle } from "framework7-react";
import { useTranslation } from "react-i18next";

import { CatalogBlockTitleProps, SeeAllLinkProps } from "./CatalogBlockTitle.types";

import "./CatalogBlockTitle.less";

const SeeAllLink = ({ onClick }: SeeAllLinkProps) => {
  const { t } = useTranslation();
  return onClick ? (
    <Link href="#" onClick={onClick}>
      {t("See all")}
    </Link>
  ) : null;
};

export const CatalogBlockTitle: React.FC<CatalogBlockTitleProps> = ({ children, ...props }) => (
  <BlockTitle className="catalog-block-title" {...props}>
    <span>{children}</span>
    <SeeAllLink {...props} />
  </BlockTitle>
);
