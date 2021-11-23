import React, { ChangeEvent, FC, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Col,
  f7,
  Icon,
  Link,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
  Page,
  Row,
} from "framework7-react";

import GeneralInformation from "../GeneralInformation/GeneralInformation";
import { IProductCreateContainer } from "../models";
import ProductAdditionalInfo from "../ProductAdditionalInfo/ProductAdditionalInfo";
import ProductCharacteristics from "../ProductCharacteristics/ProductCharacteristics";
import ProductDelivery from "../ProductDelivery/ProductDelivery";
import ProductMenu from "../ProductMenu/ProductMenu";
import ProductOrders from "../ProductOrders/ProductOrders";
import ProductPriceRent from "../ProductPrice/ProductRent/ProductPriceRent";
import ProductPriceSell from "../ProductPrice/ProductSell/ProductPriceSell";

import "./productCreateContainer.less";

const ProductCreateContainer: FC<IProductCreateContainer> = (props) => {
  const [step, setStep] = useState<number>(1);
  const [dealType, setDealType] = useState<string>("SELL");
  const [text, setText] = useState([]);

  const { t } = useTranslation();

  const { f7router } = props;

  const closeHandle = () => {
    f7router.back();

    f7.dialog.confirm(
      "All changes will be lost_Are you sure you would like to exit screen and discard the changes?",
      () =>
        f7router.back("/profile/seller-area/my-goods/", {
          ignoreCache: true,
          animate: true,
          force: true,
        })
    );
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  // const handleSelectDealType = (e: ChangeEvent<HTMLSelectElement>) => {
  //   setDealType(e?.target.value);
  // };
  const handleSelectDealType = (type: any) => {
    setDealType(type.value);
  };

  const handleSelectItems = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedText = e?.target.value;
    const checkedText = e?.target.checked;
    if (checkedText) {
      setText([...text, selectedText]);
    } else {
      setText(text.filter((element) => element !== selectedText));
    }
  };

  const renderSteps = () => {
    switch (step) {
      case 1:
        return (
          <GeneralInformation dealType={dealType} handleSelectDealType={handleSelectDealType} />
        );
      case 2:
        return dealType === "SELL" ? (
          <ProductPriceSell />
        ) : dealType === "RENT" ? (
          <ProductPriceRent />
        ) : (
          ""
        );
      case 3:
        return <ProductCharacteristics handleSelectItems={handleSelectItems} text={text} />;
      case 4:
        return <ProductOrders />;
      case 5:
        return <ProductDelivery />;
      case 6:
        return <ProductAdditionalInfo />;
      default:
        return (
          <GeneralInformation dealType={dealType} handleSelectDealType={handleSelectDealType} />
        );
    }
  };

  return (
    <Page className="create-page">
      <Navbar noHairline noShadow>
        <NavLeft>
          <Link iconOnly onClick={() => closeHandle()}>
            <Icon ios="f7:multiply" md="material:close" />
          </Link>
        </NavLeft>
        <NavTitle>{t("New Product")}</NavTitle>
        <NavRight>
          <Button className="next-button" fill round onClick={nextStep}>
            {t("Next")} &gt;
          </Button>
          <Button className="next-button" fill round onClick={prevStep}>
            &lt;Prev
          </Button>
        </NavRight>
      </Navbar>
      <Row className="products">
        <ProductMenu step={step} />
        <Col className="products__content">{renderSteps()}</Col>
      </Row>
    </Page>
  );
};

export default ProductCreateContainer;
