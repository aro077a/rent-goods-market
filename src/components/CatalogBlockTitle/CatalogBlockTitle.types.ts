import { F7BlockTitle } from "framework7-react";

export type SeeAllLinkProps = {
  onClick?: () => void;
};

export type CatalogBlockTitleProps = F7BlockTitle.Props & SeeAllLinkProps;
