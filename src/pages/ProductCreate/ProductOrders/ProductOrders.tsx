import React, { ChangeEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Block, BlockTitle, Icon, ListItem } from "framework7-react";
import Multiselect from "multiselect-react-dropdown";

import { countries } from "./mockOptions";

import "./productOrders.less";

const ProductOrders = () => {
  const [isChecked, setIsChecked] = useState(false);
  const multiselectRef = useRef(null);

  const { t } = useTranslation();

  const onSelect = (selectedList) => {
    // setSelectedCountries(selectedList);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(!isChecked);
    multiselectRef?.current.resetSelectedValues();
  };
  return (
    <>
      <BlockTitle large className="type-block-title">
        {t("Allow Order from")}
      </BlockTitle>
      <ListItem
        checkbox
        title={t("Worldwide") as string}
        name="country-checkbox"
        className="country-checkbox"
        checked={isChecked}
        onChange={(e) => handleChange(e)}
      />
      <Block className={isChecked ? "orders-wrapper__content-disabled" : "orders-wrapper__content"}>
        <BlockTitle className="type-block-title">{t("Choose specific countries")}</BlockTitle>
        <Multiselect
          options={countries}
          onSelect={onSelect}
          showCheckbox={true}
          hidePlaceholder={true}
          avoidHighlightFirstOption={true}
          closeOnSelect={false}
          customCloseIcon={<Icon ios="f7:multiply" md="material:close" />}
          displayValue="name"
          placeholder="Countries"
          ref={multiselectRef}
        />
      </Block>
    </>
  );
};

export default ProductOrders;
