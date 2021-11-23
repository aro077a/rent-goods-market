import React, { Component } from "react";
import {
  List,
  Block,
  Popup,
  F7Popup,
  NavTitle,
  NavRight,
  Link,
  Navbar,
  Button,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { ProductOrder } from "../../types/paymentapi";
import { ListInput } from "../../components/ListInput";
import { formatPrice } from "../../utils";

type Props = WithTranslation &
  F7Popup.Props & {
    order?: ProductOrder;
    onRefundClick?(amount: number): void;
  };

type State = {
  refundAmount?: number;
};

class OrderRefundPopup extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {};
  }

  getAvailableRefundAmount = () => {
    const { order } = this.props;
    if (!order) {
      return 0;
    }
    const refunded = order.totalRefundAmount ?? 0;
    return order.amount - refunded;
  };

  handleRefundAmountInput = (e: any) => {
    let { value, rawValue = null } = e.target;
    value = rawValue !== null ? rawValue : value;
    this.setState({ refundAmount: value });
  };

  handleRefund = () => {
    const { t, onRefundClick } = this.props;
    const { refundAmount } = this.state;

    if (refundAmount > this.getAvailableRefundAmount()) {
      this.$f7.dialog.alert(
        t("Refund amount cannot be greater than order amount")
      );
      return;
    }

    if (refundAmount < 0) {
      this.$f7.dialog.alert(t("Amount should be positive number"));
      return;
    }

    onRefundClick(refundAmount);
  };

  render() {
    const { t, order, ...rest } = this.props;

    return (
      <Popup id="order_refund_popup" backdrop {...rest}>
        <Navbar noShadow noHairline>
          <NavTitle>{t("Refund")}</NavTitle>
          <NavRight>
            <Link popupClose iconMaterial="clear" />
          </NavRight>
        </Navbar>
        {order && (
          <Block>
            <p>
              <strong>
                {formatPrice(
                  this.getAvailableRefundAmount(),
                  order.currencyCode
                )}
              </strong>
              <span>&nbsp;{t("is available for refund")}</span>
            </p>
          </Block>
        )}
        <List
          noHairlines
          noHairlinesBetween
          form
          className="no-margin-vertical"
        >
          <ListInput
            name="amount"
            label={t("Refund Amount").toString()}
            type="text"
            placeholder=""
            required
            defaultValue={this.getAvailableRefundAmount()}
            onBlur={this.handleRefundAmountInput}
            onChange={this.handleRefundAmountInput}
            slot="list"
          />
        </List>
        <Block className="popup-footer">
          <Button
            fill
            large
            round
            raised
            className="refund-button"
            onClick={this.handleRefund}
          >
            {t("Refund")}
          </Button>
        </Block>
      </Popup>
    );
  }
}

export default compose(withTranslation())(OrderRefundPopup);
