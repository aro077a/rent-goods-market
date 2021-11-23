import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  Block,
  BlockTitle,
  Col,
  Link,
  List,
  ListInput,
  Tab,
  Tabs,
  Toolbar,
} from "framework7-react";

import "./productPriceRent.less";

const ProductPriceRent: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Col className="price-rent">
        <BlockTitle large className="price-rent__title">
          {t("Price Rent")}
        </BlockTitle>
        <Toolbar tabbar position="top">
          <Link tabLink="#tab-1" tabLinkActive>
            {t("Per Month")}
          </Link>
          <Link tabLink="#tab-2"> {t("Per Day")}</Link>
          <Link tabLink="#tab-3"> {t("Per Hours")}</Link>
        </Toolbar>

        <Tabs>
          <Tab id="tab-1" className="page-content" tabActive>
            <Block>
              <p>Coming soon ...</p>
            </Block>
          </Tab>
          <Tab id="tab-2" className="page-content">
            <Col className="rent-inputs-block">
              <List>
                <ListInput
                  type="text"
                  defaultValue=""
                  className="custom-style"
                  floatingLabel
                  label={t("Rental Price (Required)") as string}
                />
                <ListInput
                  type="text"
                  defaultValue=""
                  className="custom-style"
                  floatingLabel
                  label={t("Rental Price with Discount") as string}
                />
                <ListInput
                  type="text"
                  defaultValue=""
                  className="custom-style"
                  floatingLabel
                  label={t("Deposit") as string}
                />
              </List>
              <BlockTitle className="price-rent__subtitle">
                {t("Reservation Availability")}
              </BlockTitle>
              <p>
                {t(
                  "You can set up minimum reservation availability. No time slots will be available to reserve outside of these limits."
                )}
              </p>
              <List>
                <ListInput
                  type="text"
                  defaultValue=""
                  className="custom-style"
                  floatingLabel
                  label="Minimum Rental Period"
                />
              </List>
            </Col>
          </Tab>
          <Tab id="tab-3" className="page-content">
            <Block>
              <p>Coming soon ...</p>
            </Block>
          </Tab>
        </Tabs>
      </Col>
    </>
  );
};

export default ProductPriceRent;
