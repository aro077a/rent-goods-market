import React, { ChangeEvent, FC } from "react";
import { useTranslation } from "react-i18next";
import { Block, Card, CardHeader, Icon, List, ListInput, ListItem, Toggle } from "framework7-react";
import Multiselect from "multiselect-react-dropdown";

import { IcRemove } from "../../../../components-ui/icons";
import { countries } from "../../ProductOrders/mockOptions";

interface IShipToCardProps {
  handleCountrySelect?: () => void;
  isPriceToggleActive?: boolean;
  handlePriceToggleActive?: (id: string) => void | boolean;
  setIsPriceToggleActive?: (arg0: boolean) => void;
  handleDeliveryChange?: (e: ChangeEvent) => void;
  handleRemoveDelivery?: (arg0: string) => void;
  id?: string;
  deliveryCard?: any;
  checked?: boolean;
}

const ShipToCard: FC<IShipToCardProps> = ({
  handleCountrySelect,
  handlePriceToggleActive,
  handleDeliveryChange,
  handleRemoveDelivery,
  setIsPriceToggleActive,
  deliveryCard,
  id,
  checked,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Card>
        <CardHeader className="no-border">
          <div className="ship">{t("Ship to")}</div>
          {deliveryCard.length >= 2 && <IcRemove onClick={() => handleRemoveDelivery(id)} />}
        </CardHeader>
        <Multiselect
          options={countries}
          showCheckbox={true}
          hidePlaceholder={true}
          avoidHighlightFirstOption={true}
          closeOnSelect={false}
          customCloseIcon={<Icon ios="f7:multiply" md="material:close" />}
          displayValue="name"
          placeholder={t("Countries")}
          onSelect={handleCountrySelect}
        />
        <List noHairlines form>
          <ListItem>
            <span>{t("Delivery Price")}</span>
            <div>
              <span>{t("Free")}</span>
              <Toggle
                id={id}
                color="red"
                checked={checked}
                onToggleChange={(id) => handlePriceToggleActive(id)}
                onChange={(e) => setIsPriceToggleActive(e.target.checked)}
              />
            </div>
          </ListItem>
          <ListInput
            name="price"
            type="text"
            floatingLabel
            label={t("Price") as string}
            clearButton
            className={handlePriceToggleActive(id) ? "list-items-disabled" : "custom-style"}
            onChange={(e) => handleDeliveryChange(e)}
          />
        </List>
        <List noHairlines form className="days-block">
          <span>{t("Delivery Time")}</span>
          <Block>
            <ListInput
              name="minDays"
              type="text"
              floatingLabel
              label={t("Days Minimum") as string}
              clearButton
              className="custom-style"
              onChange={(e) => handleDeliveryChange(e)}
            />
            <ListInput
              name="maxDays"
              type="text"
              floatingLabel
              label={t("Days Maximum") as string}
              clearButton
              className="custom-style"
              onChange={(e) => handleDeliveryChange(e)}
            />
          </Block>
        </List>
      </Card>
    </>
  );
};

export default ShipToCard;
