import React from "react";
import { Product } from "../../types/marketplaceapi";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { Notification } from "../Notifications";
import { TFunction } from "i18next";
import { IProduct } from "../../reducers/productReducer";

import "./style.less";
import { formatDate } from "../../utils";

const StatusEnum = Product.StatusEnum;

type Props = WithTranslation & {
  item: IProduct;
};

const getProps = (item: IProduct, t: TFunction): any => {
  switch (item.status) {
    case StatusEnum.DCL:
      return {
        title: t("Your Good has been declined"),
        text: t(
          "Your pictures are poor quality. You must replace them and send again"
        ),
        danger: true,
      };
    case StatusEnum.APR:
      return {
        title: t("Your Good has been approved"),
        text: t("Your product will be published on", {
          date: formatDate(item.publishDate.toString()),
        }),
        success: true,
      };
    case StatusEnum.EXP:
      return {
        title: t("Product has expired"),
        text: t("The product was expired on date", {
          date: formatDate(item.expirationDate.toString()),
        }),
        danger: true,
      };
    case StatusEnum.OOS:
      return {
        title: t("The product is out of stock"),
        text: t("You can replenish the quantity of goods"),
        danger: true,
      };
    default:
      return null;
  }
};

const ProductStatusNotification = ({ item, t }: Props) => {
  const notifProps = getProps(item, t);
  return notifProps ? <Notification {...notifProps} /> : null;
};

export default compose(withTranslation())(ProductStatusNotification);
