import React from "react";
import {
  PageContent,
  BlockTitle,
  F7Sheet,
  List,
  ListItem,
  Block,
  Preloader,
  Icon,
} from "framework7-react";
import { Sheet } from "../components/Sheet";
import { compose } from "redux";
import classNames from "classnames";
import connectCards, { ICardsProps } from "../store/connectCards";
import { WithTranslation, withTranslation } from "react-i18next";
import { Card } from "../types/commonapi";
import { getStatusText } from "./cards";
import connectF7, { WithFramework7Props } from "../store/connectF7";
import { IOrdersState } from "../reducers/ordersReducer";
import { AddCardListItem } from "../components/AddCardListItem";
import { ListItemCurrentBalance } from "../components-ui/list-item-current-balance";
import connectCurrencies, { ICurrencyProps } from "../store/connectCurrencies";
import connectWallet, { IWalletProps } from "../store/connectWallet";

type Props = F7Sheet.Props & {
  onSelectPaymentCard?(uid: string): void;
  onSelectWallet?(uid: string): void;
  onSelectAddCard?(): void;
};

const PaymentCardSelectPaymentMethodSheetPage = (
  props: Props &
    ICardsProps &
    WithTranslation &
    WithFramework7Props &
    IOrdersState &
    ICurrencyProps &
    IWalletProps
) => {
  const handleSelectPaymentCard = (uid: string) =>
    props.onSelectPaymentCard(uid);

  const renderCardsList = () => {
    const { loading, cards, onSelectAddCard, t, wallets, onSelectWallet } =
      props;
    const wallet = wallets.filter((item) => item.primary)[0];

    if (loading)
      return (
        <Block className="text-align-center">
          <Preloader />
        </Block>
      );

    return (
      <List noHairlines noChevron>
        <ul>
          {wallet && (
            <ListItemCurrentBalance
              balance={wallet.balance}
              currencyCode={wallet.currency.code}
              title={t("Current Balance")}
              onClick={() => onSelectWallet(wallet.uid)}
            />
          )}
          {cards.map((item) => (
            <ListItem
              key={item.uid}
              link
              title={item.maskedNumber}
              onClick={() => handleSelectPaymentCard(item.uid)}
              noChevron
            >
              <span slot="media">
                <i
                  className={classNames(
                    "icon",
                    `ic-${item.type && item.type.toLowerCase()}`
                  )}
                ></i>
              </span>
              {renderStatusLabel(item)}
              {item.primary && (
                <div slot="after">
                  <Icon f7="checkmark_alt" />
                </div>
              )}
            </ListItem>
          ))}
          <AddCardListItem
            title={t("Add card").toString()}
            noChevron
            onClick={onSelectAddCard}
          />
        </ul>
      </List>
    );
  };

  const renderStatusLabel = (item: Card) => {
    const { t } = props;
    const statusText = getStatusText(item.status);
    return (
      <span
        slot="footer"
        className={classNames(item.status === "V" && "verified")}
      >
        {t(statusText)}
      </span>
    );
  };

  return (
    <Sheet
      id="payment_card_select_payment_method_sheet"
      {...props}
      onSheetOpened={() => {
        if (!props.cards || !props.cards.length) {
          props.loadPaymentCardsList();
        }
      }}
      backdrop
      closeByBackdropClick
      closeByOutsideClick
    >
      <PageContent>
        <BlockTitle medium>Select Payment Method</BlockTitle>
        {renderCardsList()}
      </PageContent>
    </Sheet>
  );
};

export default compose(
  withTranslation(),
  connectCards,
  connectCurrencies,
  connectWallet,
  connectF7
)(PaymentCardSelectPaymentMethodSheetPage) as React.FC<Props>;
