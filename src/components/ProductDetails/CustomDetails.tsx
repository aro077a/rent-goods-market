import React from "react";
import { IProduct } from "../../reducers/productReducer";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { BlockTitle, Block } from "framework7-react";

import "./style.less";

type Props = WithTranslation & {
  product: IProduct;
};

const TechnicalDescription = (props: Props) => {
  const { product, t } = props;
  const notes = [
    ...Object.keys(product).filter((key) => key.startsWith("Notes")),
    ...Object.keys(product).filter((key) => key.startsWith("customField")),
  ].map((key) => product[key]);

  return notes.length ? (
    <>
      <BlockTitle>{t("More details")}</BlockTitle>
      <Block>
        {notes.map((note, i) => (
          <span key={i.toString()}>
            {note}
            {i < notes.length - 1 && ", "}
          </span>
        ))}
      </Block>
    </>
  ) : null;
};

export default compose(withTranslation())(TechnicalDescription);
