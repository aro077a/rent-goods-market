import React, { FC, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { AccordionContent, Block, BlockTitle, List, ListInput, ListItem } from "framework7-react";

import CustomAutoComplete from "../../../components/Autocomplete/CustomAutocomplete";
import { IProductCharacteristics } from "../models";

import { colors } from "./mockColors";

import "./productCharacteristics.less";

const ProductCharacteristics: FC<IProductCharacteristics> = ({ handleSelectItems, text }) => {
  const { t } = useTranslation();

  const brands = [
    {
      id: 1,
      name: "Armani",
    },
    {
      id: 2,
      name: "Gucci",
    },
    {
      id: 3,
      name: "Zara",
    },
    {
      id: 4,
      name: "Zarina",
    },
    {
      id: 5,
      name: "Zarilla design",
    },
  ];

  return (
    <>
      <BlockTitle large className="type-block-title">
        {t("Characteristics")}
      </BlockTitle>
      <Block className="characteristics-wrapper__inputs">
        <List>
          <CustomAutoComplete
            data={brands}
            className="custom-style"
            floatingLabel={true}
            label={t("Brand")}
          />
          <ListInput
            type="text"
            defaultValue=""
            floatingLabel
            label={t("Model") as string}
            className="custom-style"
          />

          <Block className="characteristics-wrapper__nested-inputs">
            <ListInput
              type="text"
              defaultValue=""
              floatingLabel
              label={t("SIze") as string}
              className="custom-style"
            />
            <ListInput
              type="text"
              defaultValue=""
              floatingLabel
              label={t("Weight") as string}
              className="custom-style"
            />
          </Block>
          <Block className="characteristics-wrapper__color-input">
            <ListItem
              accordionItem
              title={text.length === 0 ? `${t("Color")}` : text?.join(",")}
              className="colors-input"
            >
              <AccordionContent>
                <List>
                  {colors.map((item: any) => {
                    return (
                      <Fragment key={item.id}>
                        <ListItem
                          checkbox
                          value={item.title}
                          title={item.title}
                          onChange={handleSelectItems}
                        >
                          <span>{item.icon}</span>
                        </ListItem>
                      </Fragment>
                    );
                  })}
                </List>
              </AccordionContent>
            </ListItem>
          </Block>
        </List>
      </Block>
    </>
  );
};

export default ProductCharacteristics;
