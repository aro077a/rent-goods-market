import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "framework7-react";

import { getCurrencySymbol } from "@/components/SmallSelector/utils";
import { useAppSelector } from "@/hooks/store";
import { formatPrice } from "@/utils";

import { TextLineProps } from "./TextLine.types";

export const TextLine = ({ item }: TextLineProps): JSX.Element => {
  const { t } = useTranslation();

  const currencies = useAppSelector((state) => state.classificatorReducer.currencyClassificator);

  const priceText = useMemo(() => {
    if (item.deliveryMethodOption?.price === 0 && !item.deliveryMethodOption?.pickupAddress) {
      return t("Free Delivery");
    }
    if (item.deliveryMethodOption?.price > 0) {
      return formatPrice(
        item.deliveryMethodOption?.price,
        getCurrencySymbol(currencies, item.deliveryMethodOption?.currencyCode)
      );
    }
    return "";
  }, [
    currencies,
    item.deliveryMethodOption?.currencyCode,
    item.deliveryMethodOption?.pickupAddress,
    item.deliveryMethodOption?.price,
    t,
  ]);

  const days = useMemo(() => {
    if (item.deliveryMethodOption?.pickupAddress) {
      return `${item.deliveryMethodOption?.pickupAddress?.city} ${item.deliveryMethodOption?.pickupAddress?.postalCode} ${item.deliveryMethodOption?.pickupAddress?.firstAddressLine}`;
    }
    return `${t("Standard Shipping")} (${item.deliveryMethodOption?.deliveryTimeDaysMin}-${
      item.deliveryMethodOption?.deliveryTimeDaysMax
    } ${t("Business days")})`;
  }, [
    item.deliveryMethodOption?.deliveryTimeDaysMax,
    item.deliveryMethodOption?.deliveryTimeDaysMin,
    item.deliveryMethodOption?.pickupAddress,
    t,
  ]);

  return (
    <div className="text-container">
      {item.deliveryMethodOption?.pickupAddress && (
        <Icon className="pick-up-icon" material="place" />
      )}
      <span className="selector-price">{priceText}</span>
      <span className="selector-text">{days}</span>
    </div>
  );
};
