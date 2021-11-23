import React from "react";
import { compose } from "redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { Block, Col } from "framework7-react";

import { formatPrice } from "@/utils";
import { ThemedButton } from "@/components/ThemedButton";
import { ProductFeatureType } from "@/types/marketplaceapi";

import ServicePackageDescription from "./ServicePackageDescription";

import "./style.less";

export default compose(withTranslation())(
  (
    props: ProductFeatureType &
      Partial<WithTranslation> & {
        onClick?(code: string, currencyCode: string): void;
      }
  ) => {
    const { code, typeCode, currencyCode, description, duration, name, price, onClick, t } = props;
    return (
      <Col className="item" width="100" medium="25">
        <div className="inner-container">
          <Block>
            <ServicePackageDescription
              code={code}
              typeCode={typeCode}
              title={name}
              description={description}
              price={price}
              duration={duration}
            />
          </Block>
          <Block className="footer">
            <div className="price-container">
              <p className="price">{formatPrice(price, currencyCode)}</p>
              <span className="duration">{duration}</span>
            </div>
            <ThemedButton fill round onClick={() => onClick && onClick(code, currencyCode)}>
              {t("Get")}
            </ThemedButton>
          </Block>
        </div>
      </Col>
    );
  }
);
