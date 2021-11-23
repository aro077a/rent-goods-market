import React, { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Block,
  BlockTitle,
  Button,
  Icon,
  Link,
  List,
  ListInput,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
  Page,
} from "framework7-react";

import { createUUID } from "../../../../utils";
import { cardType } from "../ProductDekiver.types";

import ShipToCard from "./ShipToCard";

import "./newDelivery.less";

interface NewDeliveryProps {
  f7router: any;
  handleDeliveryChange: (arg0: ChangeEvent) => void;
  handleCountrySelect: () => void;
  submitDelivery: () => void;
  handleAddDelivery: () => void;
  handleRemoveDelivery: () => void;
  setDeliveryCard: (arg0: any) => void;
}

const NewDelivery: FC<NewDeliveryProps> = (props) => {
  const [isPriceToggleActive, setIsPriceToggleActive] = useState<boolean>(false);
  const [deliveryCard, setDeliveryCard] = useState<cardType[]>([]);

  const { f7router, handleDeliveryChange, handleCountrySelect, submitDelivery } = props;

  const { t } = useTranslation();

  const handleAddDelivery = useCallback(() => {
    setDeliveryCard([
      ...deliveryCard,
      {
        id: createUUID(),
        card: <ShipToCard />,
        checked: false,
      },
    ]);
  }, [deliveryCard]);

  // useEffect(() => {
  //   handleAddDelivery();
  // });

  const handleRemoveDelivery = (id: string) => {
    setDeliveryCard(deliveryCard.filter((item) => item?.id !== id));
  };
  const handlePriceToggleActive = (id: string) => {
    // const t = deliveryCard.forEach((item) => {
    //   if (item?.id === id) {
    //     item.checked = true;
    //   } else return false;
    // });
  };

  return (
    <Page pageContent={false} className="new-delivery">
      <Navbar noHairline noShadow>
        <NavLeft>
          <Link iconOnly onClick={() => f7router.back()}>
            <Icon icon="icon-back"></Icon>
          </Link>
        </NavLeft>
        <NavTitle>{t("Add a Delivery Options")}</NavTitle>
        <NavRight>
          <Button className="create-button" fill round onClick={submitDelivery}>
            {t("Create")} &gt;
          </Button>
        </NavRight>
      </Navbar>
      <Block className="new-delivery__block">
        <BlockTitle large className="new-delivery__block--title">
          {t("New Delivery Method")}
        </BlockTitle>
        <BlockTitle className="new-delivery__block--subtitle">
          {t("You can specify different prices for specific countries")}
        </BlockTitle>
        <List noHairlines form>
          <ListInput
            name="method"
            type="text"
            floatingLabel
            label={t("Method Name") as string}
            clearButton
            info={`${t("For example")} : 3-5 kg, Eastern Europe, fragile`}
            className="custom-style"
            onChange={(e) => handleDeliveryChange(e)}
          />
          {deliveryCard?.map((item: any) => (
            <ShipToCard
              key={item?.id}
              id={item?.id}
              checked={item?.checked}
              deliveryCard={deliveryCard}
              handleRemoveDelivery={handleRemoveDelivery}
              handleCountrySelect={handleCountrySelect}
              handlePriceToggleActive={handlePriceToggleActive}
              isPriceToggleActive={isPriceToggleActive}
              setIsPriceToggleActive={setIsPriceToggleActive}
              handleDeliveryChange={handleDeliveryChange}
            />
          ))}
        </List>
        <Button className="new-delivery__block--button" onClick={handleAddDelivery}>
          <Icon ios="f7:plus" md="material:add" />
          {t("Add specific countries & prices")}
        </Button>
      </Block>
    </Page>
  );
};

export default NewDelivery;
