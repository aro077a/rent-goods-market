import React from "react";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import { Badge } from "framework7-react";
import { connect } from "react-redux";
import cn from "classnames";

import { IApplicationStore } from "@/store/rootReducer";

import { ProductStatusBadgeProps } from "./ProductStatusBadge.types";
import { getProductStatusText } from "./utils";

import "./ProductStatusBadge.less";

const ProductStatusBadge = ({ status, statusText, t }: ProductStatusBadgeProps): JSX.Element => (
  <Badge className={cn("product-status-badge", `product-status-badge-${status.toString()}`)}>
    {t(statusText)}
  </Badge>
);

const mapStateToProps = (state: IApplicationStore, ownProps: ProductStatusBadgeProps) => {
  let { statusText } = ownProps;
  if (!statusText) {
    const val = state.classificatorReducer.entitiesClassificators.Product_Status.filter(
      (item) => item.code.toLowerCase() === ownProps.status.toString().toLowerCase()
    )[0];
    // ! WAS: statusText = val ? val.value : ownProps.status.toString();
    statusText = val ? val.value : getProductStatusText(ownProps.status);
  }
  return {
    ...ownProps,
    statusText,
  };
};

export default compose<React.FC<ProductStatusBadgeProps>>(
  withTranslation(),
  connect(mapStateToProps, null)
)(ProductStatusBadge);
