import { ListItem } from "framework7-react";
import React from "react";
import { formatPrice } from "../../utils";
import classNames from "classnames";
import "./style.less";

type Props = ListItem.Props & {
  balance: number;
  currencyCode: string;
  title: string;
};

export default ({ balance, currencyCode, title, ...rest }: Props) => (
  <ListItem
    className="current-balance-item"
    link="#"
    title={title}
    after={formatPrice(balance, currencyCode)}
    {...rest}
  >
    <span slot="media">
      <i
        className={classNames(
          "icon",
          `ic-currency-${currencyCode.toLowerCase()}`
        )}
      ></i>
    </span>
  </ListItem>
);
