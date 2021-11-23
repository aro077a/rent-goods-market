import React from "react";
import {
  Page,
  Navbar,
  Block,
  BlockTitle,
  Row,
  Col,
  List,
  ListItem,
  Icon,
  Link,
  Button,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import connectChat, { IChatProps } from "../../store/connectChat";
import { IApplicationStore } from "../../store/rootReducer";
import { connect } from "react-redux";
import {
  ProductOrder,
  ProductOrderItem,
  ProductOrderShippingItem,
} from "../../types/paymentapi";
import { formatDateTime, formatPrice } from "../../utils";
import OrderStatusBadge from "../../components/OrderStatusBadge/OrderStatusBadge";
import OrderTrackingInfo from "../../components/OrderTrackingInfo/OrderTrackingInfo";

import "./style.less";
import { changeOrderStatus } from "../../actions/ordersActions";
import { Toast } from "../../components/Toast";

type Props = IChatProps &
  Page.Props & {
    loading?: boolean;
    error?: any;
    order: ProductOrder;
    changeStatus?(uid: string, statusExtended?: string): void;
  };

type State = {
  toastText?: string;
};

class OrderDetailsPage extends React.Component<Props & WithTranslation, State> {
  constructor(props: Readonly<Props & WithTranslation>) {
    super(props);
    this.state = {
      toastText: null,
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { loading, error, t } = this.props;
    if (loading !== prevProps.loading && error) {
      this.$f7.dialog.alert(t(error));
    }

    if (!prevProps.loading && this.props.loading) {
      this.$f7.preloader.show();
    } else {
      this.$f7.preloader.hide();
    }
  }

  shippingAddress = (): string => {
    const { order } = this.props;
    return order.shippingAddress ? order.shippingAddress.fullAddress : "";
  };

  buyer = (): string => {
    const { order } = this.props;
    return order.buyer.name + " " + order.buyer.surname;
  };

  buyerIdentity = (): string => {
    const { order } = this.props;
    const identity: string[] = [];
    if (order.buyer.email) {
      identity.push(order.buyer.email);
    }
    if (order.buyer.phone) {
      identity.push(order.buyer.phone);
    }
    return identity.join(", ");
  };

  deliveryAmount = (): string => {
    const { order } = this.props;
    let deliveryAmount: number = 0;
    if (order.shippingItems) {
      order.shippingItems.forEach((item) => {
        deliveryAmount += item.price;
      });
    }
    return formatPrice(deliveryAmount, order.currencyCode, true);
  };

  startChatHandle = () => {
    const { loading } = this.props.chatReducer;
    if (loading) return;

    const { order, t } = this.props;
    const sellerPhone = order.seller.phone;
    const message = t("Hi! I am contacting you with regards to my order No.", {
      orderNumber: order.orderNumber,
    });
    this.props.startChat(sellerPhone, message);
  };

  copyTrackingInfoHandle = () => {
    const { order, t } = this.props;
    navigator.clipboard.writeText(order.trackingNumber);
    this.setState(
      {
        toastText: t("Track number copied"),
      },
      () => {
        setTimeout(() => {
          this.setState({ toastText: null });
        }, 3000);
      }
    );
  };

  confirmGoodsReceivedHandle = () => {
    const { loading, order } = this.props;
    if (loading) return;
    this.props.changeStatus(order.uid, "DLV");
  };

  payOrderHandle = () => {
    // TODO: implement payment process
  };

  isAwaitingPayment = () => {
    return false;
    //return this.props.order.status == "SE";
  };

  isShipped = () => {
    return ["SHP", "RCV", "DLV"].includes(this.props.order.statusExtended);
  };

  isDelivered = () => {
    return this.props.order.statusExtended == "DLV";
  };

  render() {
    const { t, order } = this.props;

    return (
      <Page id="order_details_page" name="order-details-page">
        <Navbar
          title={t("Order Details")}
          backLink={t("Back").toString()}
          noHairline
          noShadow
        />

        <Block className="order-header">
          <Row>
            <Col width="100">
              <OrderStatusBadge
                status={order.status}
                statusDescription={order.statusDescription}
              />
              {order.statusExtended && (
                <OrderStatusBadge
                  status={order.statusExtended}
                  statusDescription={order.statusExtendedDescription}
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col width="100" className="order-header-info">
              <span>{t("Order")}:</span> {order.orderNumber}
              <br />
              {order.orderDate && (
                <>
                  <span>{t("Order time")}:</span>{" "}
                  {formatDateTime(order.orderDate)}
                </>
              )}
            </Col>
          </Row>
        </Block>

        {this.isShipped() && (
          <div className="pure-visible-xs">
            <BlockTitle>{t("Tracking Information")}</BlockTitle>
            <Block>
              {!order.trackingNumber && (
                <p className="no-tracking-info">
                  {t("No tracking information provided")}
                </p>
              )}
              {order.trackingNumber && (
                <OrderTrackingInfo
                  trackingNumber={order.trackingNumber}
                  trackingCarrier={order.trackingCarrier}
                  showCopyButton={true}
                  onTrackingCopyClick={this.copyTrackingInfoHandle}
                />
              )}
              {!this.isDelivered() && (
                <Button
                  large
                  fill
                  className="confirm-order-received-link"
                  text={t("Confirm Goods Received").toString()}
                  onClick={this.confirmGoodsReceivedHandle}
                />
              )}
            </Block>
          </div>
        )}

        <BlockTitle>{t("Contact")}</BlockTitle>
        <Block>
          {this.buyer()}
          <br />
          {this.buyerIdentity()}
          <br />
          {this.shippingAddress()}
        </Block>

        <BlockTitle>{t("Delivery")}</BlockTitle>
        <Block>
          {order.shippingItems &&
            order.shippingItems.map(
              (shippingItem: ProductOrderShippingItem) => (
                <span key={shippingItem.name}>
                  {shippingItem.name}:{" "}
                  {formatPrice(shippingItem.price, order.currencyCode, true)}
                </span>
              )
            )}
          {!order.shippingItems && <span>{t("Free of charge")}</span>}
        </Block>

        <BlockTitle>{t("Seller")}</BlockTitle>
        <Block>
          <Row>
            <Col width="80">{order.seller.name}</Col>
            {order.seller.phone && (
              <Col width="20" className="text-align-right">
                <Link onClick={() => this.startChatHandle()}>
                  <Icon f7="chat_bubble_text" />
                </Link>
              </Col>
            )}
          </Row>
        </Block>

        <BlockTitle>{t("Order Info")}</BlockTitle>
        <Block className="order-content">
          <List mediaList noHairlines noChevron>
            {order.items.map((item: ProductOrderItem) => (
              <ListItem key={item.productUid} title={item.name}>
                {item.imageUrl && (
                  <img slot="media" src={item.imageUrl} alt={item.name} />
                )}
                <div slot="text">{item.description}</div>
                <div
                  slot="inner-end"
                  className="pure-visible-xs mobile-price-text"
                >
                  <b>{formatPrice(item.price, order.currencyCode, true)}</b>
                  &nbsp;x {item.quantity}
                </div>
              </ListItem>
            ))}
          </List>
        </Block>

        <BlockTitle>{t("Order Summary")}</BlockTitle>
        <Block className="order-footer">
          <Row>
            <Col width="50">{t("Items")}:</Col>
            <Col width="50" className="text-align-right">
              {order.productCount}
            </Col>
          </Row>
          <Row>
            <Col width="50">{t("Delivery")}:</Col>
            <Col width="50" className="text-align-right">
              {this.deliveryAmount()}
            </Col>
          </Row>
          <Row>
            <Col width="50" className="mobile-total-price">
              {t("Total")}:
            </Col>
            <Col width="50" className="text-align-right mobile-total-price">
              {formatPrice(order.amount, order.currencyCode, true)}
            </Col>
          </Row>
        </Block>

        {this.isAwaitingPayment() && (
          <Block className="pure-visible-xs pay-order-block">
            <Button
              round
              large
              fill
              className="pay-order-button"
              onClick={this.payOrderHandle}
            >
              <span>{t("Pay Order")}</span>
            </Button>
          </Block>
        )}

        <Toast
          text={this.state.toastText}
          show={this.state.toastText !== null}
        />
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  loading: state.ordersReducer.orderStatusLoading,
  error: state.ordersReducer.orderStatusLoadingError,
  order: state.ordersReducer.selectedOrder,
});

const mapDispatchToProps = (dispatch: any) => ({
  changeStatus: (uid: string, statusExtended?: string) =>
    dispatch(changeOrderStatus(uid, statusExtended)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  connectChat,
  withTranslation()
)(OrderDetailsPage);
