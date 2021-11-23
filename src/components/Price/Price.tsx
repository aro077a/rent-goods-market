import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";

import { formatPrice } from "@/utils";
import { IcSale } from "@/components-ui/icons";

import { PriceProps } from "./Price.types";

import "./Price.less";

export const Price = ({
  price,
  discountedPrice,
  currencyCode,
  className,
  period,
  withSaleIcon = false,
  direction = "row",
  size = "medium",
}: PriceProps): JSX.Element => {
  const { t } = useTranslation();

  const makeFormattedPrice = useCallback(
    (price: number) =>
      formatPrice(
        price,
        currencyCode,
        false,
        period ? `${t("per")} ${t(period as unknown as string)}` : ""
      ),
    [currencyCode, period, t]
  );

  return (
    <div className={cn("price", { discounted: !!discountedPrice }, direction, size, className)}>
      {discountedPrice ? (
        <>
          <ins className={size}>
            {withSaleIcon && <IcSale className={cn("icon", size)} />}
            <span>{makeFormattedPrice(discountedPrice)}</span>
          </ins>
          <del className={size}>
            <span>{makeFormattedPrice(price)}</span>
          </del>
        </>
      ) : (
        <ins className={size}>
          <span>{makeFormattedPrice(price)}</span>
        </ins>
      )}
    </div>
  );
};
