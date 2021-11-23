import React from "react";
import { ListItem, F7ListItem } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import connectCurrencies from "../../store/connectCurrencies";
import { Currency } from "../../types/commonapi";

type Props = F7ListItem.Props &
  WithTranslation & {
    defaultValue?: string | number | string[];
    currencies?: Currency[];
  };

const CurrencyListItem = (props: Props) => (
  <ListItem
    title={props.t("Currency").toString()}
    smartSelect
    smartSelectParams={{ openIn: "popover", closeOnSelect: true }}
    after={props.value.toString()}
    {...props}
  >
    <select name="currency" value={props.value}>
      {props.currencies.map((item) => (
        <option key={item.code} value={item.code}>
          {item.code}
        </option>
      ))}
    </select>
  </ListItem>
);

export default compose(
  withTranslation(),
  connectCurrencies
)(CurrencyListItem) as React.FC<Props>;
