import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/hooks/store";
import { formatPrice } from "@/utils";

import { CartItemPriceProps } from "./CartItemPrice.types";

import "./CartItemPrice.less";

export const CartItemPrice = ({ item }: CartItemPriceProps): JSX.Element => {
  const { t } = useTranslation();

  const currency = useAppSelector((state) => state.classificatorReducer.currencyClassificator);

  const currencySymbol = useMemo(
    () => currency.find((c) => c.code === item.productCurrencyCode)?.symbol ?? "",
    [currency, item.productCurrencyCode]
  );

  const onePiecePrice = useMemo(
    () =>
      item.quantity > 0 ? (
        <div className="one-piece-price">
          {formatPrice(item.productDiscountedPrice ?? item.productPrice, currencySymbol)} /{" "}
          {t("One Piece")}
        </div>
      ) : null,
    [currencySymbol, item.productDiscountedPrice, item.productPrice, item.quantity, t]
  );

  if (item.productDiscountedPrice) {
    return (
      <div className="price-block ml20">
        <div className="no-wrap-row">
          <div className="discount-price">
            {formatPrice(item.productDiscountedPrice * item.quantity, currencySymbol)}
          </div>
          <div className="before-price">
            {formatPrice(item.productPrice * item.quantity, currencySymbol)}
          </div>
        </div>
        {onePiecePrice}
      </div>
    );
  }

  return (
    <div className="price-block ml20">
      <div className="no-wrap-row">
        <div className="regular-price">
          {formatPrice(item.productPrice * item.quantity, currencySymbol)}
        </div>
      </div>
      {onePiecePrice}
    </div>
  );
};
