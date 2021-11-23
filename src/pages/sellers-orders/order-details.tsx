import React, { Component } from "react";
import {
  Page,
  Navbar,
  List,
  ListItem,
  BlockTitle,
  Badge,
  Block,
  NavLeft,
  Link,
  Icon,
  NavTitle,
  NavRight,
  Sheet,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";

import { IApplicationStore } from "@/store/rootReducer";
import {
  loadOrderDetails,
  setOrderStatus,
  setProductOrderStatus,
  refundOrder,
} from "@/actions/sellersOrdersActions";
import { formatDateTime, formatPrice } from "@/utils";
import { IcMessages } from "@/components-ui/icons";
import connectChat, { IChatProps } from "@/store/connectChat";
import { ThemedButton } from "@/components/ThemedButton";
import OrderStatusBadge from "@/components/OrderStatusBadge/OrderStatusBadge";
import OrderTrackingInfo from "@/components/OrderTrackingInfo/OrderTrackingInfo";
import { StartChat } from "@/components/StartChat";
import { ProductOrder } from "@/types/paymentapi";

import ChangeOrderStatusSheet from "./change-order-status-sheet";
import AddTrackingInfoPopup from "./add-tracking-info-popup";
import EditTrackingInfoMenuSheet from "./edit-tracking-info-menu-sheet";
import OrderRefundSheet from "./order-refund-sheet";

import "./styles.less";

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithTranslation &
  IChatProps;

type State = {
  changeOrderStatusSheetOpened?: boolean;
  addTrackingInfoPopupOpened?: boolean;
  editTrackingInfoMenuSheetOpened?: boolean;
  orderRefundSheetOpened?: boolean;
  startChatSheetOpenedData: ProductOrder;
};

class OrderDetailsPage extends Component<Props, State> {
  constructor(props: Readonly<Props & WithTranslation>) {
    super(props);
    this.state = {
      changeOrderStatusSheetOpened: false,
      addTrackingInfoPopupOpened: false,
      editTrackingInfoMenuSheetOpened: false,
      orderRefundSheetOpened: false,
      startChatSheetOpenedData: null,
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { setOrderStatusLoading, setOrderStatusError } = this.props;
    if (setOrderStatusLoading !== prevProps.setOrderStatusLoading && setOrderStatusError) {
      this.$f7.dialog.alert(setOrderStatusError);
    }

    if (!prevProps.setOrderStatusLoading && this.props.setOrderStatusLoading) {
      this.$f7.preloader.show();
    } else {
      this.$f7.preloader.hide();
    }
  }

  startChatHandle = () => {
    const { loading } = this.props.chatReducer;
    if (loading) return;

    const { orderDetails, t } = this.props;
    const buyerPhone = orderDetails.buyer && orderDetails.buyer.phone;
    const message = t("Hi! I am contacting you with regards to your order No.", {
      orderNumber: orderDetails.orderNumber,
    });
    this.props.startChat(buyerPhone, message);
  };

  handleRefundButton = () => {
    if (this.props.resizing.isXS) {
      this.setState({ orderRefundSheetOpened: true });
    } else {
      const { orderDetails, refundOrder, setOrderStatusLoading, t } = this.props;
      if (setOrderStatusLoading) {
        return;
      }
      const dialog = this.$f7.dialog.prompt(
        t("Please, enter amount"),
        (val: string) => {
          let quantity: number;
          try {
            quantity = parseFloat(val);
          } catch (err) {
            console.error(err);
          }
          if (quantity > 0) {
            refundOrder(orderDetails.uid, quantity);
          } else {
            this.$f7.dialog.alert(t("Amount should be positive number!"));
          }
        },
        () => undefined,
        orderDetails.amount.toString()
      );
      const el = dialog.$el.find("input").attr("type", "number")[0] as any;
      el.select();
    }
  };

  handleRejectButton = () => {
    const { t, orderDetails, setOrderStatus, setOrderStatusLoading } = this.props;
    if (setOrderStatusLoading) {
      return;
    }
    this.$f7.dialog.confirm(t("Are you sure you want to reject this order?"), () => {
      setOrderStatus(orderDetails.uid, "CA");
    });
  };

  handleStatusChange = (status: string) => {
    const { orderDetails, setProductOrderStatus, setOrderStatusLoading } = this.props;
    if (setOrderStatusLoading) {
      return;
    }
    this.setState({ changeOrderStatusSheetOpened: false });
    setProductOrderStatus(orderDetails.uid, orderDetails.status, status);
  };

  handleTrackingInfoUpdate = (trackingNumber: string, trackingCarrier: string) => {
    const { orderDetails, setProductOrderStatus, setOrderStatusLoading } = this.props;
    if (setOrderStatusLoading) {
      return;
    }
    this.setState({ addTrackingInfoPopupOpened: false });
    setProductOrderStatus(
      orderDetails.uid,
      orderDetails.status,
      "SHP",
      trackingCarrier,
      trackingNumber
    );
  };

  handleEditTrackingInfo = () => {
    this.setState({
      editTrackingInfoMenuSheetOpened: false,
      addTrackingInfoPopupOpened: true,
    });
  };

  handleRemoveTrackingInfo = () => {
    const { orderDetails, setProductOrderStatus, setOrderStatusLoading } = this.props;
    if (setOrderStatusLoading) {
      return;
    }
    this.setState({ editTrackingInfoMenuSheetOpened: false });
    setProductOrderStatus(
      orderDetails.uid,
      orderDetails.status,
      orderDetails.statusExtended,
      "n/a",
      "n/a"
    );
  };

  handleRefund = (amount: number) => {
    const { orderDetails, refundOrder, setOrderStatusLoading } = this.props;
    if (setOrderStatusLoading) {
      return;
    }
    this.setState({ orderRefundSheetOpened: false });
    refundOrder(orderDetails.uid, amount);
  };

  renderAddressLine = () => {
    const {
      orderDetails: { shippingAddress },
    } = this.props;

    if (!shippingAddress) return null;

    return <span>{shippingAddress.fullAddress}</span>;
  };

  isPaid = () => {
    return ["PA", "MP"].includes(this.props.orderDetails.status);
  };

  isShipped = () => {
    return ["SHP", "RCV", "DLV"].includes(this.props.orderDetails.statusExtended);
  };

  render() {
    const { orderDetails, loadOrderDetails, t } = this.props;
    const { startChatSheetOpenedData } = this.state;
    const uid = this.$f7route.params["uid"];

    if (!uid) return null;

    return (
      <Page
        id="sellers_order__order_details_page"
        name="sellers-order__order-details-page"
        onPageInit={() => {
          if (!orderDetails || orderDetails.uid !== uid) {
            loadOrderDetails(uid);
          }
        }}
      >
        <Navbar noHairline noShadow>
          <NavLeft>
            <Link iconOnly back>
              <Icon className="icon-back" />
            </Link>
          </NavLeft>
          <NavTitle>{t("Order Details")}</NavTitle>
          <NavRight>
            <Link iconOnly onClick={this.startChatHandle} className="pure-hidden-xs">
              <IcMessages />
            </Link>
            {orderDetails && orderDetails.status === "PA" /* awaiting fullfilment */ && (
              <Link
                className="navbar-button"
                text={t("Refund")}
                onClick={this.handleRefundButton}
              />
            )}
            {orderDetails && orderDetails.status === "SE" /* awaiting payment */ && (
              <Link
                className="navbar-button"
                text={t("Reject")}
                onClick={this.handleRejectButton}
              />
            )}
          </NavRight>
        </Navbar>
        {orderDetails && (
          <>
            <Block>
              {(!orderDetails.statusExtended || orderDetails.statusExtended !== "DLV") && (
                <OrderStatusBadge
                  status={orderDetails.status}
                  statusDescription={orderDetails.statusDescription}
                />
              )}
              {orderDetails.statusExtended && (
                <OrderStatusBadge
                  status={orderDetails.statusExtended}
                  statusDescription={orderDetails.statusExtendedDescription}
                />
              )}
            </Block>

            <Block>
              <span className="details">
                <span className="light-text">{t("Order")}: </span>№ {orderDetails.orderNumber}
              </span>
              <span className="details">
                <span className="light-text">{t("Order time")}: </span>{" "}
                {formatDateTime(orderDetails.orderDate)}
              </span>
            </Block>

            {this.isPaid() && !this.isShipped() && (
              <div className="pure-visible-xs">
                <Block className="no-margin-vertical">
                  <hr />
                </Block>
                <List noHairlines noChevron className="no-margin-vertical pure-visible-xs">
                  <ListItem
                    className="item-add-link"
                    link
                    title={t("Add Tracking Information").toString()}
                    noChevron
                    onClick={() => this.setState({ addTrackingInfoPopupOpened: true })}
                  >
                    <span slot="media">
                      <Icon ios="f7:plus" md="material:add" />
                    </span>
                  </ListItem>
                </List>
                <Block className="no-margin-vertical">
                  <hr />
                </Block>
              </div>
            )}

            {orderDetails.trackingNumber && (
              <div className="pure-visible-xs">
                <BlockTitle medium>{t("Tracking Information")}</BlockTitle>
                <Block>
                  <OrderTrackingInfo
                    trackingNumber={orderDetails.trackingNumber}
                    trackingCarrier={orderDetails.trackingCarrier}
                    showEditButton={true}
                    onTrackingEditClick={() =>
                      this.setState({
                        editTrackingInfoMenuSheetOpened: true,
                      })
                    }
                  />
                </Block>
              </div>
            )}

            <BlockTitle medium>{t("Contact")}</BlockTitle>
            <Block>
              <span className="details">
                {orderDetails.buyer && `${orderDetails.buyer.name} ${orderDetails.buyer.surname}`}
              </span>
              <span className="details">{orderDetails.buyer && orderDetails.buyer.email}</span>
              {this.renderAddressLine()}
            </Block>

            <div className="pure-visible-xs">
              <BlockTitle medium>{t("Buyer")}</BlockTitle>
              <List noHairlines noHairlinesBetween className="margin-vertical-half">
                <ListItem>
                  <div slot="title">
                    {orderDetails.buyer &&
                      `${orderDetails.buyer.name} ${orderDetails.buyer.surname}`}
                  </div>
                  <div slot="after-title">
                    <Link
                      iconOnly
                      onClick={() =>
                        this.setState({
                          startChatSheetOpenedData: orderDetails,
                        })
                      }
                    >
                      <IcMessages />
                    </Link>
                  </div>
                </ListItem>
              </List>
            </div>

            <BlockTitle medium>{t("Order Info")}</BlockTitle>
            <List noHairlines noChevron mediaList>
              <ul className="items">
                {orderDetails.items.map((item) => (
                  <ListItem key={item.productUid} title={item.name} subtitle={item.description}>
                    <div slot="media" className="image">
                      {item.imageUrl && <img src={item.imageUrl} />}
                    </div>
                    <div slot="footer">
                      <span className="price">${item.price}</span> x {item.quantity}
                    </div>
                  </ListItem>
                ))}
              </ul>
            </List>

            <BlockTitle medium>{t("Order Summary")}</BlockTitle>
            <Block className="order-summary">
              <div className="row">
                <div className="col-50">{t("Items") + `(${orderDetails.items.length})`}</div>
                <div className="text-align-right col-50">
                  {formatPrice(
                    orderDetails.amount -
                      (orderDetails.shippingItems
                        ? orderDetails.shippingItems.reduce((prev, cur) => {
                            return prev + cur.price;
                          }, 0)
                        : 0),
                    orderDetails.currencyCode
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-50">{t("Delivery")}:</div>
                <div className="text-align-right col-50">
                  {formatPrice(
                    orderDetails.shippingItems
                      ? orderDetails.shippingItems.reduce((prev, cur) => {
                          return prev + cur.price;
                        }, 0)
                      : 0,
                    orderDetails.currencyCode,
                    true
                  )}
                </div>
              </div>
              <div className="row order-total">
                <div className="col-50">{t("Total") + ""}</div>
                <div className="text-align-right col-50">
                  {formatPrice(orderDetails.amount, orderDetails.currencyCode)}
                </div>
              </div>
            </Block>

            {this.isPaid() && orderDetails.statusExtended !== "DLV" && (
              <Block className="order-details-action pure-visible-xs">
                <ThemedButton
                  round
                  large
                  fill
                  onClick={() => {
                    this.setState({ changeOrderStatusSheetOpened: true });
                  }}
                >
                  <span>{t("Change Order Status")}</span>
                </ThemedButton>
              </Block>
            )}
          </>
        )}

        <ChangeOrderStatusSheet
          opened={this.state.changeOrderStatusSheetOpened}
          onSheetClosed={() => this.setState({ changeOrderStatusSheetOpened: false })}
          onStatusChangeClick={(status) => this.handleStatusChange(status)}
          order={orderDetails}
        />

        <EditTrackingInfoMenuSheet
          opened={this.state.editTrackingInfoMenuSheetOpened}
          onSheetClosed={() => this.setState({ editTrackingInfoMenuSheetOpened: false })}
          onEditClick={this.handleEditTrackingInfo}
          onRemoveClick={this.handleRemoveTrackingInfo}
        />

        <AddTrackingInfoPopup
          desktop={false}
          opened={this.state.addTrackingInfoPopupOpened}
          onPopupClosed={() => this.setState({ addTrackingInfoPopupOpened: false })}
          onTrackingInfoChange={(trackingNumber, trackingCarrier) => {
            this.handleTrackingInfoUpdate(trackingNumber, trackingCarrier);
          }}
          order={orderDetails}
        />

        <OrderRefundSheet
          opened={this.state.orderRefundSheetOpened}
          onSheetClosed={() => this.setState({ orderRefundSheetOpened: false })}
          onRefundClick={(amount) => this.handleRefund(amount)}
          order={orderDetails}
        />

        <Sheet
          id="start_chat_sheet"
          swipeToClose
          backdrop
          opened={!!startChatSheetOpenedData}
          slot="fixed"
          style={{ height: "auto" }}
        >
          <StartChat
            opened={!!startChatSheetOpenedData}
            productUid={startChatSheetOpenedData?.uid}
            onClose={() => {
              this.setState({
                startChatSheetOpenedData: null,
              });
            }}
            onStartChat={this.startChatHandle}
            type="buyer"
            orderNumber={startChatSheetOpenedData?.orderNumber}
          />
        </Sheet>
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore, props) => {
  const {
    $f7route: {
      params: { uid },
    },
  } = props;
  return {
    ...state.sellersOrdersReducer,
    orderDetails: state.sellersOrdersReducer.orders.filter((item) => item.uid === uid)[0],
    resizing: state.rootReducer.resizeEvent,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      loadOrderDetails,
      setOrderStatus,
      setProductOrderStatus,
      refundOrder,
    },
    dispatch
  );

export default compose(
  withTranslation(),
  connectChat,
  connect(mapStateToProps, mapDispatchToProps)
)(OrderDetailsPage);
