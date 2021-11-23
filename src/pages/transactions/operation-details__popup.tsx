import moment from "moment";
import React, { Component } from "react";
import {
  Page,
  Block,
  Popup,
  F7Popup,
  NavRight,
  Link,
  Navbar,
} from "framework7-react";
import { Transaction } from "../../reducers/transactionReducer";
import { compose } from "redux";
import { WithTranslation, withTranslation } from "react-i18next";
import { formatPrice } from "../../utils";

import "./style.less";
import { IcClose } from "../../components-ui/icons";

type Props = WithTranslation &
  F7Popup.Props & {
    item: Transaction;
  };

type State = {};

class OperationDetailsPopup extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {};
  }

  transactionDate = () => {
    const { item } = this.props;
    return moment(item.transactionTime, "YYYYMMDDHHmmss").format(
      "DD MMM, YYYY"
    );
  };

  transactionTime = () => {
    const { item } = this.props;
    return moment(item.transactionTime, "YYYYMMDDHHmmss").format("H:mm:ss");
  };

  buyerIdentity = () => {
    const { item } = this.props;
    return item.buyerPhone || item.buyerEmail || item.buyerUid;
  };

  payerIdentity = () => {
    const { item } = this.props;
    return item.payerPhone || item.payerEmail || item.payerUid;
  };

  transactionAmount = () => {
    const { item } = this.props;
    return item.transactionAmount || item.amount;
  };

  render() {
    const { t, item, ...rest } = this.props;

    return (
      <Popup
        id="operation_details_sheet"
        className="operation-details-sheet"
        backdrop
        {...rest}
      >
        <Page>
          <Navbar noShadow noHairline title={t("Operation Details")}>
            <NavRight>
              <Link popupClose>
                <IcClose />
              </Link>
            </NavRight>
          </Navbar>
          {item ? (
            <>
              <Block className="item-title">{t("Receiver name")}</Block>
              <Block className="item-value">{this.buyerIdentity()}</Block>
              <Block className="item-title">{t("Sender Name")}</Block>
              <Block className="item-value">{this.payerIdentity()}</Block>
              <Block className="item-title">{t("Type Transaction")}</Block>
              <Block className="item-value">{item.transactionTypeName}</Block>
              <Block className="item-title">
                {t("Additional Information")}
              </Block>
              <Block className="item-value">None</Block>
              <Block className="item-title">{t("ID")}</Block>
              <Block className="item-value">{item.transactionUid}</Block>
              {item.creditCard && (
                <>
                  <Block className="item-title">{t("Card")}</Block>
                  <Block className="item-value">
                    {item.creditCard.cardMask}
                  </Block>
                </>
              )}
              <Block className="item-title">{t("Amount")}</Block>
              <Block className="item-value">
                {formatPrice(this.transactionAmount(), item.currencyCode)}
              </Block>
              <Block className="item-title">{t("Date")}</Block>
              <Block className="item-value">{this.transactionDate()}</Block>
              <Block className="item-title">{t("Time")}</Block>
              <Block className="item-value">{this.transactionTime()}</Block>
              <Block className="item-title">{t("State")}</Block>
              <Block className="item-value">{item.transactionStateName}</Block>
            </>
          ) : null}
        </Page>
      </Popup>
    );
  }
}

export default compose<
  React.ComponentClass<
    F7Popup.Props & {
      item: Transaction;
    }
  >
>(withTranslation())(OperationDetailsPopup);
