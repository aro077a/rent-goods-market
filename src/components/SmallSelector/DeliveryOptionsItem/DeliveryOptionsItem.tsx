import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "framework7-react";

import { getCurrencySymbol } from "@/components/SmallSelector/utils";
import { useAppSelector } from "@/hooks/store";
import { formatPrice } from "@/utils";

import { DeliveryOptionsItemProps } from "./DeliveryOptionsItem.types";

export const DeliveryOptionsItem = ({ options }: DeliveryOptionsItemProps) => {
  const { t } = useTranslation();

  const currencies = useAppSelector((state) => state.classificatorReducer.currencyClassificator);

  const price = useMemo(() => {
    if (options.pickupAddress) {
      return options.price === 0
        ? t("Free Pickup")
        : formatPrice(options.price, getCurrencySymbol(currencies, options.currencyCode));
    } else {
      return options.price === 0
        ? t("Free Delivery")
        : formatPrice(options.price, getCurrencySymbol(currencies, options.currencyCode));
    }
  }, [currencies, options.currencyCode, options.pickupAddress, options.price, t]);

  const text = useMemo(
    () =>
      options.pickupAddress
        ? `${options.pickupAddress?.city}, ${options.pickupAddress?.firstAddressLine} ${
            options.pickupAddress?.secondAddressLine
              ? ", " + options.pickupAddress?.secondAddressLine
              : ""
          }`
        : `${t("Standard Shipping")} (${options.deliveryTimeDaysMin}-${
            options.deliveryTimeDaysMax
          } ${t("business day")})`,
    [options.deliveryTimeDaysMax, options.deliveryTimeDaysMin, options.pickupAddress, t]
  );

  return (
    <li>
      <a className="selector-item list-button popover-close">
        <span className="column">
          <div className="selector-price">{price}</div>
          <div className="selector-text">{text}</div>
          <div className="selector-description">{options.description}</div>
        </span>
        <Icon material="done" className="selected-icon" />
      </a>
    </li>
  );
};
