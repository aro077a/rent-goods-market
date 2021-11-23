import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Col, List, ListItem } from "framework7-react";

import { IcCheckActive } from "../../../components-ui/icons";

import "./productMenu.less";

interface ProductMenuProps {
  step: number;
}

const ProductMenu: FC<ProductMenuProps> = ({ step }) => {
  const { t } = useTranslation();
  return (
    <Col className="menu">
      <List simpleList className="menu__step">
        <ListItem
          title={t("General Information") as string}
          className={step === 1 ? "menu__step--active" : "menu__step--list"}
        >
          <IcCheckActive />
        </ListItem>
        <ListItem title="Price" className={step === 2 ? "menu__step--active" : "menu__step--list"}>
          <IcCheckActive />
        </ListItem>
        <ListItem
          title={t("Characteristics") as string}
          className={step === 3 ? "menu__step--active" : "menu__step--list"}
        >
          <IcCheckActive />
        </ListItem>
        <ListItem
          id="allow"
          title={t("Allow Order from") as string}
          className={step === 4 ? "menu__step--active" : "menu__step--list"}
        >
          <IcCheckActive />
        </ListItem>
        <ListItem
          id="delivery"
          title={t("Delivery options") as string}
          className={step === 5 ? "menu__step--active" : "menu__step--list"}
        >
          <IcCheckActive />
        </ListItem>
        <ListItem
          title={t("Additional Information") as string}
          className={step === 6 ? "menu__step--active" : "menu__step--list"}
        >
          <IcCheckActive />
        </ListItem>
      </List>
    </Col>
  );
};

export default ProductMenu;
