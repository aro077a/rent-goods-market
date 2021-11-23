import React from "react";
import ServicePackageListItem from "./ServicePackageListItem";
import { Row } from "framework7-react";
import { ProductFeatureType } from "../../types/marketplaceapi";

type Props = {
  items?: ProductFeatureType[];
  onClick?(code: string, currencyCode: string): void;
};

export default ({ items = [], onClick }: Props) => (
  <Row className="service-package-list">
    {items.map((item) => (
      <ServicePackageListItem key={item.code} onClick={onClick} {...item} />
    ))}
  </Row>
);
