import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, Icon, Popover } from "framework7-react";

import { useAppSelector } from "@/hooks/store";
import { getCountryNameFromState } from "@/selectors/getCountryNameFromState";

import { DeliveryOptionsItem } from "./DeliveryOptionsItem";
import { SmallSelectorProps } from "./SmallSelector.types";
import { TextLine } from "./TextLine";

import "./SmallSelector.less";

export const SmallSelector = ({ item, countryName }: SmallSelectorProps): JSX.Element => {
  const { t } = useTranslation();

  const countryNameFromState = useAppSelector(getCountryNameFromState);

  const country = useMemo(
    () => countryName || countryNameFromState,
    [countryName, countryNameFromState]
  );

  if (item.quantity === 0)
    return (
      <Button
        className="button-selector out-of-stock"
        popoverOpen={`.popover-menu-${item.itemUid}`}
      >
        <div className="selector-bold-text">{t("Out of stock")}</div>
      </Button>
    );

  if (!item.deliveryMethodOption)
    return (
      <Button className="button-selector undelivered" popoverOpen={`.popover-menu-${item.itemUid}`}>
        <div className="selector-red-text">{`${t("Doesn't ship to")} ${country}`}</div>
      </Button>
    );

  return (
    <Button className="button-selector" popoverOpen={`.popover-menu-${item.itemUid}`}>
      <TextLine item={item} />
      <Icon className="button-selector-arrow-icon" material="arrow_drop_down" />
      <Popover className={`popover-menu-${item.itemUid} width`}>
        <div className="popover-inner">
          <div className="list">
            <ul>
              <DeliveryOptionsItem options={item.deliveryMethodOption} />
            </ul>
          </div>
        </div>
      </Popover>
    </Button>
  );
};
