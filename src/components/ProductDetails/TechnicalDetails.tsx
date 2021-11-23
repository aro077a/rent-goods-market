import React from "react";
import { IProduct } from "../../reducers/productReducer";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { Block, BlockTitle } from "framework7-react";

import "./style.less";

type Props = WithTranslation & {
  product: IProduct;
};

const TechnicalDetails = (props: Props) => {
  const { product, t } = props;
  const fields: Pick<
    IProduct,
    "manufacturer" | "model" | "color" | "size" | "weight"
  > = {
    manufacturer: product.manufacturer,
    model: product.model,
    color: product.color,
    size: product.size,
    weight: product.weight,
  };

  let isEmptyFields = !Object.keys(fields).some(
    (key) => fields[key] !== undefined && fields[key].length > 0
  );

  if (isEmptyFields) {
    return null;
  }

  return (
    <div className="data-table data-table-collapsible data-table-init block technical-details">
      <BlockTitle medium className="medium-small">
        {t("Characteristics")}
      </BlockTitle>
      <table>
        <thead>
          <tr>
            {Object.keys(fields).map(
              (key, i) =>
                product[key] && (
                  <th key={i.toString()} className="label-cell">
                    {t(key)}
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.keys(fields).map(
              (key, i) =>
                product[key] && (
                  <td
                    key={i.toString()}
                    className={
                      typeof product[key] === "number"
                        ? "numeric-cell"
                        : "label-cell"
                    }
                    data-collapsible-title={t(key)}
                  >
                    {product[key]}
                    {key === "weight" &&
                      product.weightUnit &&
                      ` ${product.weightUnit}`}
                  </td>
                )
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default compose(withTranslation())(TechnicalDetails);
