import React, { FC, useEffect, useState } from "react";
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

import PickUpCard from "./PickUpCard";

import "./newPickUp.less";

interface NewPickUpProps {
  f7router: any;
}

const NewPickUp: FC<NewPickUpProps> = (props) => {
  const [pickupCard, setPickupCard] = useState<cardType[]>([]);

  const { f7router } = props;

  const { t } = useTranslation();

  // useEffect(() => {
  //   handleAddPickup();
  // }, []);

  const handleAddPickup = () => {
    setPickupCard([
      ...pickupCard,
      {
        id: createUUID(),
        card: <PickUpCard />,
        checked: false,
      },
    ]);
  };

  const handleRemovePickup = (id: string) => {
    setPickupCard(pickupCard.filter((item) => item?.id !== id));
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
          <Button className="create-button" fill round>
            {t("Create")} &gt;
          </Button>
        </NavRight>
      </Navbar>
      <Block className="new-delivery__block">
        <BlockTitle large className="new-delivery__block--title">
          {t("New Pick-up Point")}
        </BlockTitle>
        <BlockTitle className="new-delivery__block--subtitle">
          {t("You can specify different prices for specific countries")}
        </BlockTitle>
        <List noHairlines form>
          <ListInput
            name="pickUp"
            type="text"
            floatingLabel
            label={t("Pick-up Name") as string}
            clearButton
            info={`${t("For example")} : 3-5 kg, Eastern Europe, fragile`}
            className="custom-style"
          />
        </List>
        {pickupCard?.map((item: any) => (
          <PickUpCard
            key={item?.id}
            id={item?.id}
            checked={item?.checked}
            pickupCard={pickupCard}
            handleRemovePickup={handleRemovePickup}
          />
        ))}
        <Button className="new-delivery__block--button" onClick={handleAddPickup}>
          <Icon ios="f7:plus" md="material:add" />
          {t(" Add specific countries & prices")}
        </Button>
      </Block>
    </Page>
  );
};

export default NewPickUp;
