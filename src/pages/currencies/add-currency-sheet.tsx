import React from "react";
import {
  Sheet,
  PageContent,
  BlockTitle,
  F7Sheet,
  List,
  ListItem,
  Icon,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { Currency } from "../../types/commonapi";
import classNames from "classnames";

type Props = WithTranslation &
  F7Sheet.Props & {
    currencies: Currency[];
    addCurrencyOnClick?(code: string): void;
  };

const AddCurrencySheet = ({
  currencies,
  addCurrencyOnClick,
  t,
  ...rest
}: Props) => (
  <Sheet id="add_currency_sheet" swipeToClose backdrop {...rest}>
    <PageContent>
      <BlockTitle medium>{t("Add currency")}</BlockTitle>
      <List noHairlines>
        {currencies.map((item) => (
          <ListItem
            key={item.code}
            link
            title={item.symbol + " " + item.description}
            noChevron
            onClick={() => addCurrencyOnClick(item.code)}
          >
            <span slot="media">
              <i
                className={classNames(
                  "icon",
                  `ic-currency-${item.code && item.code.toLowerCase()}`
                )}
              ></i>
            </span>
          </ListItem>
        ))}
      </List>
    </PageContent>
  </Sheet>
);

export default compose(withTranslation())(AddCurrencySheet);
