import React, { ChangeEvent, FC, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Block,
  BlockTitle,
  Button,
  Card,
  CardHeader,
  Icon,
  Link,
  List,
  ListItem,
  Navbar,
  NavRight,
  NavTitle,
  Popup,
} from "framework7-react";

import { IcDeliveryPurple, IcLocationGreen } from "../../../components-ui/icons";
import { countryType } from "../models";

import CardItem from "./CardItem/CardItem";

import "./productDelivery.less";

const ProductDelivery: FC = () => {
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [deliveryProducts, setDeliveryProducts] = useState<any>({
    method: "",
    country: "",
    price: "",
    minDays: "",
    maxDays: "",
  });

  const { t } = useTranslation();

  const handleDeliveryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value }: any = e.target;

    setDeliveryProducts({ ...deliveryProducts, ...{ [name]: value } });
  };
  const handleCountrySelect = (country: countryType) => {
    setDeliveryProducts({ ...deliveryProducts, country: country[0].name });
  };

  const deliveries = [
    {
      id: 1,
      method: "3-5 kg, Eastern Europe, fragile",
      type: "delivery",
      ship_to: [
        {
          id: "1a",
          countries: "Belarus, Latvia, Poland, Hungary, Bosnia and Herzegovina",
          min_days: "24",
          max_days: "35",
          shipping_cost: "18",
        },
        {
          id: "1b",
          countries: "Russia, Ukraine",
          min_days: "4",
          max_days: "8",
          shipping_cost: "Free Shipping",
        },
        {
          id: "1c",
          countries: "Bulgaria, Croatia, Estonia",
          min_days: "4",
          max_days: "10",
          shipping_cost: "32",
        },
      ],
    },
  ];
  const pickUp = [
    {
      id: 1,
      method: "Main Pick-up points",
      type: "pickup",
      ship_to: [
        {
          id: "1a",
          countries: "Russia, Moscow, Zatonnaya ulitsa, 17 / 1",
          min_days: "24",
          max_days: "35",
          shipping_cost: "18",
        },
        {
          id: "1b",
          countries: "Indonesia, Ubud, Kecamatan, Jl. Suweta, 12",
          min_days: "4",
          max_days: "8",
          shipping_cost: "Free Shipping",
        },
        {
          id: "1c",
          countries: "USA, Broadway Avenue, South Boston, MA 02127, 116998",
          min_days: "4",
          max_days: "10",
          shipping_cost: "32",
        },
      ],
    },
  ];

  return (
    <>
      <BlockTitle large className="type-block-title">
        {t("Delivery Options")}
      </BlockTitle>
      <Block className="delivery">
        <BlockTitle className="delivery__subtitle">
          {t("You can specify different delivery options: delivery methods and pick-up points")}
        </BlockTitle>
        <Card className="delivery__card">
          <CardItem data={deliveries} />
        </Card>
        <Card className="delivery__card">
          <CardItem data={pickUp} />
        </Card>
        <Button className="delivery__button" onClick={() => setOpenPopup(!openPopup)}>
          <Icon ios="f7:plus" md="material:add" />
          {t(" Add a delivery option")}
        </Button>
      </Block>
      <Popup className="delivery-popup" opened={openPopup}>
        <Block className="delivery-popup__header">
          <Navbar>
            <NavTitle>{t(" Add a Delivery Option")}</NavTitle>
            <NavRight>
              <Link iconOnly onClick={() => setOpenPopup(false)}>
                <Icon ios="f7:multiply" md="material:close" />
              </Link>
            </NavRight>
          </Navbar>
        </Block>
        <Block className="delivery-popup__content">
          <BlockTitle className="delivery__subtitle">
            {t("You can specify different delivery options: delivery methods and pick-up points")}
          </BlockTitle>
          <List>
            <ListItem
              link="new-delivery/"
              routeProps={{
                handleDeliveryChange,
                handleCountrySelect,
              }}
              title={t("New Delivery Method") as string}
              onClick={() => setOpenPopup(false)}
            >
              <IcDeliveryPurple />
            </ListItem>
            <ListItem
              link="new-pickup/"
              title={t("New Pick-up Point") as string}
              onClick={() => setOpenPopup(false)}
            >
              <IcLocationGreen />
            </ListItem>
          </List>
        </Block>
      </Popup>
    </>
  );
};

export default ProductDelivery;
