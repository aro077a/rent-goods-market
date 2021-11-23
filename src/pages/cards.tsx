import React, { Component } from "react";
import { Page, Navbar, List, ListItem, Icon, Block, Preloader, BlockTitle } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import cn from "classnames";

import { ThemedButton } from "@/components/ThemedButton";
import connectCards, { ICardsProps } from "@/store/connectCards";
import { Card } from "@/types/commonapi";
import { AddCardListItem } from "@/components/AddCardListItem";

import PaymentCardInfoSheet from "./payment-card-info-sheet";
import PaymentCardCreatePage from "./payment-card-create";
import PaymentCardEnterVerificationCode from "./payment-card-enter-verification-code";

import "./cards.less";

type Props = WithTranslation & ICardsProps;

type State = {
  paymentCardCreateOpened?: boolean;
  paymentCardInfoOpened?: boolean;
  enterVerifyCodeOpened?: boolean;
  cardUid?: string;
};

class CardsPage extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      paymentCardCreateOpened: false,
      paymentCardInfoOpened: false,
      enterVerifyCodeOpened: false,
      cardUid: null,
    };
  }

  pageInitHandle = () => {
    this.props.loadPaymentCardsList();
  };

  componentDidUpdate(prevProps: Props) {
    const { loading, error, hasCards } = this.props;
    if (error && error !== prevProps.error) {
      this.$f7.dialog.alert(error);
    }

    if (!loading && prevProps.loading && this.doneCallback) {
      this.doneCallback();
      this.doneCallback = null;
    }

    if (hasCards && !prevProps.hasCards) {
      const ptr = this.$f7.ptr.create("#cards_page .ptr-content");
      ptr.on("refresh", (_el, done) => this.refreshHandle(done));
    }
  }

  doneCallback: any;

  refreshHandle = (done: () => void) => {
    this.doneCallback = done;
    this.props.loadPaymentCardsList();
  };

  renderStatusLabel = (item: Card) => {
    const { t } = this.props;
    const statusText = getStatusText(item.status);
    return (
      <span slot="footer" className={cn(item.status === "V" && "verified")}>
        {t(statusText)}
      </span>
    );
  };

  openPaymentCardInfoSheetHandle = (item: Card) => {
    this.setState({
      paymentCardInfoOpened: true,
      cardUid: item.uid,
    });
  };

  renderCardsList = () => {
    const { loading, cards, hasCards, t } = this.props;

    if (loading && !this.doneCallback)
      return (
        <Block className="text-align-center">
          <Preloader />
        </Block>
      );

    if (!hasCards) {
      return (
        <Block className="text-align-center">
          <BlockTitle medium>{t("No saved Card yet")}</BlockTitle>
          <p>{t("For a quicker, easier checkout, store your card details here")}</p>
          <Block>
            <ThemedButton
              fill
              large
              round
              raised
              onClick={() => this.setState({ paymentCardCreateOpened: true })}
            >
              {t("Add card")}
            </ThemedButton>
          </Block>
        </Block>
      );
    }

    return (
      <List noHairlines noChevron>
        <ul>
          {cards.map((item, _i) => (
            <ListItem
              key={item.uid}
              link
              title={item.maskedNumber}
              onClick={() => this.openPaymentCardInfoSheetHandle(item)}
              noChevron
            >
              <span slot="media">
                <i className={cn("icon", `ic-${item.type && item.type.toLowerCase()}`)}></i>
              </span>
              {this.renderStatusLabel(item)}
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
            onClick={() => this.setState({ paymentCardCreateOpened: true })}
          />
        </ul>
      </List>
    );
  };

  render() {
    const { hasCards, t } = this.props;
    const { paymentCardCreateOpened, paymentCardInfoOpened, enterVerifyCodeOpened, cardUid } =
      this.state;

    return (
      <Page
        id="cards_page"
        name="cards-page"
        ptr={hasCards}
        onPtrRefresh={this.refreshHandle}
        onPageInit={this.pageInitHandle}
        className={cn(!hasCards && "empty")}
        stacked
      >
        <Navbar
          title={t("My credit / debit cards")}
          backLink={t("Back").toString()}
          noHairline
          noShadow
        />

        {this.renderCardsList()}

        {/* TODO */}
        <div></div>

        <PaymentCardCreatePage
          opened={paymentCardCreateOpened}
          onPopupClosed={() => this.setState({ paymentCardCreateOpened: false })}
          saveCardByDefault={true}
        />

        <PaymentCardInfoSheet
          cardUid={cardUid}
          opened={paymentCardInfoOpened}
          onSheetClosed={() => this.setState({ paymentCardInfoOpened: false })}
          onSelectEditCard={(uid) => {
            console.log(uid);
          }}
          onSelectEnterVerifyCode={(uid) => {
            this.setState({
              paymentCardInfoOpened: false,
            });
            setTimeout(
              () =>
                this.setState({
                  enterVerifyCodeOpened: true,
                  cardUid: uid,
                }),
              380
            );
          }}
        />

        <PaymentCardEnterVerificationCode
          cardUid={cardUid}
          opened={enterVerifyCodeOpened}
          onPopupClosed={() => this.setState({ enterVerifyCodeOpened: false })}
        />
      </Page>
    );
  }
}

export default compose(withTranslation(), connectCards)(CardsPage);

export function getStatusText(status: string) {
  switch (status) {
    case "N":
      return "Verification Required";
    case "V":
      return "Verified";
    case "E":
      return "Expired";
    case "T":
      return "Transaction";
    default:
      return "Not found";
  }
}
