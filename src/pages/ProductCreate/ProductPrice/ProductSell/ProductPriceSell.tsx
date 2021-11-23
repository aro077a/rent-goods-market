import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  AccordionContent,
  BlockTitle,
  Col,
  f7,
  F7ListItem,
  Icon,
  List,
  ListInput,
  ListItem,
} from "framework7-react";

import { IcCAD, IcEURO, IcIndRupiah, IcRUBLE, IcUA, IcUSA } from "../../../../components-ui/icons";

import "./productPriceSell.less";

const ProductPriceSell: FC = () => {
  const [currencyType, setCurrencyType] = useState<string>("Euro");
  const [symbol, setSymbol] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const currencies = useSelector((state: any) => state.classificatorReducer.currencyClassificator);

  const { t } = useTranslation();

  const checkConcurrency = (currency: string) => {
    switch (currency) {
      case "Euro":
        return <IcEURO />;
      case "United States Dollar":
        return <IcUSA />;
      case "Russian Ruble":
        return <IcRUBLE />;
      case "Canadian Dollar":
        return <IcCAD />;
      case "Ukrainian Hryvnia":
        return <IcUA />;
      case "Indonesian Rupiah":
        return <IcIndRupiah />;
      default:
        return <></>;
    }
  };

  const handleCurrencySelect = (code: string) => {
    const currencyCode = currencies.find((item: any) => item.code === code);
    checkConcurrency(currencyCode.description);
    setCurrencyType(currencyCode.description);
    setSymbol(currencyCode.symbol);
    f7.accordion.toggle("#currency");
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <>
      <Col className="price-wrapper">
        <BlockTitle large className="price-wrapper__title">
          {t("Price")}
        </BlockTitle>
      </Col>
      <Col className="sell-inputs-block">
        <List>
          <ListItem accordionItem title={currencyType} id="currency" className="currency-block">
            <AccordionContent>
              <List>
                {currencies.map((currency: any) => {
                  return (
                    <div className="currency" key={currency.code}>
                      <F7ListItem
                        title={currency.description}
                        onClick={() => handleCurrencySelect(currency.code)}
                      >
                        {checkConcurrency(currency.description)}
                      </F7ListItem>
                      {currencyType === currency.code && <Icon material="done" />}
                    </div>
                  );
                })}
              </List>
            </AccordionContent>
          </ListItem>
          <ListInput
            type="text"
            name="sellingPrice"
            className="custom-style"
            floatingLabel
            label={`${t("Selling Price")} ${t("(Required)")}`}
            onBlur={handleBlur}
            onFocus={handleFocus}
          />
          {isFocused ? <span className="currency-symbol">{symbol}</span> : <></>}
          <ListInput
            type="text"
            name="sellingDiscountPrice"
            className="custom-style"
            floatingLabel
            label={t("Selling Price with Discount") as string}
            onBlur={handleBlur}
            onFocus={handleFocus}
          />
          {isFocused ? <span className="currency-symbol">{symbol}</span> : <></>}
        </List>
      </Col>
    </>
  );
};

export default ProductPriceSell;
