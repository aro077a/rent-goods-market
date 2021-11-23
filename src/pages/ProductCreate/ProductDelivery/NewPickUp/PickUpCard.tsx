import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Block, Card, CardHeader, List, ListInput } from "framework7-react";

import { IcLocation, IcRemove } from "../../../../components-ui/icons";

interface IShipToCardProps {
  id?: string;
  pickupCard?: any;
  checked?: boolean;
  handleRemovePickup?: (arg0: string) => void;
}

const PickUpCard: FC<IShipToCardProps> = ({ pickupCard, id, handleRemovePickup }) => {
  const { t } = useTranslation();

  return (
    <>
      <Card>
        <CardHeader className="no-border">
          <div className="pick-up">{t("Pick-up from")}</div>
          {pickupCard.length >= 2 && <IcRemove onClick={() => handleRemovePickup(id)} />}
        </CardHeader>
        <List noHairlines form className="country-block">
          <Block className="pick-up__location">
            <IcLocation fill="var(--danger-90)" slot="" /> {t("Select on the Map")}
          </Block>
          <Block>
            <ListInput
              name="country"
              type="text"
              floatingLabel
              label={t("Country") as string}
              clearButton
              className="custom-style"
            />
            <ListInput
              name="city"
              type="text"
              floatingLabel
              label={t("City") as string}
              clearButton
              className="custom-style"
            />
          </Block>
          <ListInput
            name="address"
            type="text"
            floatingLabel
            label={t("Address") as string}
            clearButton
            className="custom-style"
          />
          <ListInput
            name="postcode"
            type="text"
            floatingLabel
            label={t("Postcode") as string}
            clearButton
            className="custom-style"
          />
          <ListInput
            name="comment"
            type="text"
            floatingLabel
            label={t("Comment (optional)") as string}
            clearButton
            className="custom-style"
          />
        </List>
        <List noHairlines form>
          {/* <ListItemContent>
              <span>Delivery Price</span>
              <Toggle />
            </ListItemContent> */}
          <ListInput
            name="price"
            type="text"
            floatingLabel
            label={t("Price") as string}
            clearButton
            className="custom-style"
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
            />
            <ListInput
              name="maxDays"
              type="text"
              floatingLabel
              label={t("Days Maximum") as string}
              clearButton
              className="custom-style"
            />
          </Block>
        </List>
      </Card>
    </>
  );
};

export default PickUpCard;
