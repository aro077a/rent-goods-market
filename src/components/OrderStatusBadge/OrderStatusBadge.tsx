import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { Badge } from "framework7-react";
import classNames from "classnames";

import "./style.less";

type Props = Partial<WithTranslation> & {
  status: string;
  statusDescription?: string;
};

const getOrderStatusText = (
  status: string,
  statusDescription?: string
): string => {
  if (statusDescription) {
    return statusDescription;
  }

  switch (status) {
    case "CA":
      return "Rejected";
    case "PA":
    case "MP":
      return "Paid";
    case "EX":
      return "Expired";
    case "PRC":
      return "Processing";
    case "RCV":
      return "Ready for Pickup";
    case "SHP":
      return "Shipped";
    case "DLV":
      return "Completed";
    default:
      return statusDescription;
  }
};

const OrderStatusBadge = ({ status, statusDescription, t }: Props) =>
  status ? (
    <Badge
      className={classNames(
        "order-status-badge",
        `order-status-badge-${status.toString()}`
      )}
    >
      {t(getOrderStatusText(status, statusDescription))}
    </Badge>
  ) : null;

export default compose<React.FC<Props>>(withTranslation())(OrderStatusBadge);
