import {
  Block,
  Card,
  Col,
  List,
  ListItem,
  Navbar,
  Page,
  Preloader,
  Row,
  BlockTitle,
  Button,
  Sheet,
  Popup,
} from "framework7-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  changeOrderStatus,
  loadOrders,
  selectOrder,
} from "../../actions/ordersActions";
import { IcArrowRight, IcMessagesSmall } from "../../components-ui/icons";
import { IClassificator } from "../../reducers/classificatorReducer";
import connectChat, { IChatProps } from "../../store/connectChat";
import { IApplicationStore, ResizeEvent } from "../../store/rootReducer";
import {
  ProductOrder,
  ProductOrderBuyer,
  ProductOrderItem,
  ProductOrderShippingAddress,
} from "../../types/paymentapi";
import { formatDateTime, formatPrice } from "../../utils";

import "./style.less";
import OrderStatusBadge from "../../components/OrderStatusBadge/OrderStatusBadge";
import OrderTrackingInfo from "../../components/OrderTrackingInfo/OrderTrackingInfo";
import { Toast } from "../../components/Toast";
import { StartChat } from "../../components/StartChat";

type Props = IChatProps &
  Page.Props & {
    resizeEvent?: ResizeEvent;
    loading?: boolean;
    error?: any;
    orders: ProductOrder[];
    orderStates: IClassificator[];
    loadOrders?(): void;
    selectOrder?(order: ProductOrder): void;
    changeStatus?(uid: string, statusExtended?: string): void;
  };

type State = {
  toastText?: string;
  startChatSheetOpened: boolean;
  startChatPopupOpened: boolean;
  selectedOrderId: string;
};

class OrdersPage extends React.Component<Props & WithTranslation, State> {
  constructor(props: Readonly<Props & WithTranslation>) {
    super(props);
    this.state = {
      toastText: null,
      startChatSheetOpened: false,
      startChatPopupOpened: false,
      selectedOrderId: undefined,
    };
  }

  pageInitHandle = () => {
    if (!this.props.orders.length) {
      this.props.loadOrders();
    }
  };

  componentDidUpdate(prevProps: Props) {
    const { loading, error, t } = this.props;
    if (loading !== prevProps.loading && error && !prevProps.error) {
      this.$f7.dialog.alert(t(error));
    }
  }

  shippingAddress = (shippingAddress: ProductOrderShippingAddress): string => {
    return shippingAddress ? shippingAddress.fullAddress : "";
  };

  buyer = (buyer: ProductOrderBuyer): string => {
    return buyer.name + " " + buyer.surname;
  };

  buyerIdentity = (buyer: ProductOrderBuyer): string => {
    const identity: string[] = [];
    if (buyer.email) {
      identity.push(buyer.email);
    }
    if (buyer.phone) {
      identity.push(buyer.phone);
    }
    return identity.join(", ");
  };

  orderClickHandler = (order: ProductOrder) => {
    this.props.selectOrder(order);
    this.$f7router.navigate("details");
  };

  startChatHandle = (data) => {
    const { loading } = this.props.chatReducer;
    if (loading || !data) return;
    const sellerPhone = data.seller.phone;
    const message = this.props.t(
      "Hi! I am contacting you with regards to my order No.",
      { orderNumber: data.orderNumber }
    );
    this.props.startChat(sellerPhone, message);
  };

  copyTrackingInfoHandle = (order: ProductOrder) => {
    const { t } = this.props;
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

  confirmGoodsReceivedHandle = (order: ProductOrder) => {
    const { loading } = this.props;
    if (loading) return;
    this.props.changeStatus(order.uid, "DLV");
  };

  isShipped = (order: ProductOrder) => {
    return ["SHP", "RCV", "DLV"].includes(order.statusExtended);
  };

  isDelivered = (order: ProductOrder) => {
    return order.statusExtended == "DLV";
  };

  renderSmallScreenOrder(order: ProductOrder) {
    const { t } = this.props;

    return (
      <Card className="order" outline>
        <Block className="order-header">
          <Row
            className="pure-visible-xs"
            onClick={() => this.orderClickHandler(order)}
          >
            <Col width="70">
              <Row>
                <Col width="100" className="no-padding">
                  <b>{order.orderNumber}</b>
                </Col>
                <Col width="100" className="order-status">
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
            </Col>
            <Col width="30" className="text-align-right padding-top-half">
              <IcArrowRight />
            </Col>
          </Row>
        </Block>
        <Block className="order-content">{this.renderOrderItems(order)}</Block>
        <Block className="order-footer">
          <Row>
            <Col width="50">{t("Items")}:</Col>
            <Col width="50" className="text-align-right">
              {order.productCount}
            </Col>
          </Row>
          <Row>
            <Col width="50">{t("Total")}:</Col>
            <Col width="50" className="text-align-right mobile-total-price">
              {formatPrice(order.amount, order.currencyCode, true)}
            </Col>
          </Row>
        </Block>
      </Card>
    );
  }

  renderOrderItems(order: ProductOrder) {
    return (
      <List
        mediaList
        noHairlines
        noHairlinesBetweenAurora
        noChevron
        className="items"
      >
        {order.items.map((item: ProductOrderItem) => (
          <ListItem key={item.productUid} title={item.name}>
            {item.imageUrl && (
              <img slot="media" src={item.imageUrl} alt={item.name} />
            )}
            <div slot="text">{item.description}</div>
            <div slot="after" className="pure-hidden-xs">
              <span className="price">
                {formatPrice(item.price, order.currencyCode, true)}
              </span>{" "}
              x {item.quantity}
            </div>
            <div slot="inner-end" className="pure-visible-xs mobile-price-text">
              <b>{formatPrice(item.price, order.currencyCode, true)}</b>&nbsp;x{" "}
              {item.quantity}
            </div>
          </ListItem>
        ))}
      </List>
    );
  }

  render() {
    const {
      t,
      loading,
      orders,
      resizeEvent: { isLG, isMD, isXL },
      resizeEvent,
    } = this.props;
    const { startChatSheetOpened, startChatPopupOpened, selectedOrderId } =
      this.state;
    const isSmallScreen = !isLG && !isMD && !isXL;
    const selectedOrderForChat = orders.find(
      (order: any) => order.uid === selectedOrderId
    );

    return (
      <Page
        id="orders_page"
        name="orders-page"
        onPageInit={this.pageInitHandle}
        onPageReinit={this.pageInitHandle}
        className={isSmallScreen ? "mobile" : "desktop"}
      >
        <Navbar
          title={t("My Orders")}
          backLink={t("Back").toString()}
          noHairline
          noShadow
        />

        <Block />

        {loading && (
          <Block className="text-align-center">
            <Preloader />
          </Block>
        )}

        {!loading && (
          <Block className="orders">
            {orders.map((order: any) => (
              <div key={order.uid}>
                {isSmallScreen ? (
                  this.renderSmallScreenOrder(order)
                ) : (
                  <Card className="order" outline>
                    <Row className="order-details" noGap>
                      <Col width="60">
                        <Block className="order-header">
                          <Row>
                            <Col className="order-header-info">
                              <span>{t("Order")}:</span> {order.orderNumber}
                              <br />
                              {order.orderDate && (
                                <>
                                  <span>{t("Order time")}:</span>{" "}
                                  {formatDateTime(order.orderDate)}
                                </>
                              )}
                            </Col>
                            <Col>
                              <OrderStatusBadge
                                status={order.status}
                                statusDescription={order.statusDescription}
                              />
                              {order.statusExtended && (
                                <OrderStatusBadge
                                  status={order.statusExtended}
                                  statusDescription={
                                    order.statusExtendedDescription
                                  }
                                />
                              )}
                            </Col>
                            <Col> </Col>
                          </Row>
                        </Block>
                        {this.renderOrderItems(order)}
                        {order.trackingNumber && (
                          <div className="tracking-info-content">
                            <BlockTitle>{t("Tracking Information")}</BlockTitle>
                            <Block>
                              <OrderTrackingInfo
                                trackingNumber={order.trackingNumber}
                                trackingCarrier={order.trackingCarrier}
                                showCopyButton={true}
                                onTrackingCopyClick={() =>
                                  this.copyTrackingInfoHandle(order)
                                }
                              />
                            </Block>
                          </div>
                        )}
                        <div className="customer-info-content">
                          <BlockTitle>{t("Contact")}</BlockTitle>
                          <Block>
                            <span className="details">
                              {this.buyer(order.buyer)}
                            </span>
                            <span className="details">
                              {this.buyerIdentity(order.buyer)}
                            </span>
                            <span>
                              {this.shippingAddress(order.shippingAddress)}
                            </span>
                          </Block>
                        </div>
                      </Col>
                      <Col width="40">
                        <Block>
                          <Row className="order-total">
                            <Col width="50">{t("Total")}</Col>
                            <Col width="50">
                              {formatPrice(order.amount, order.currencyCode)}
                            </Col>
                          </Row>
                          <Row className="order-total-items">
                            <Col width="50">
                              {t("Items") + `(${order.items.length})`}
                            </Col>
                            <Col width="50">
                              {formatPrice(
                                order.amount -
                                  (order.shippingItems
                                    ? order.shippingItems.reduce(
                                        (prev, cur) => {
                                          return prev + cur.price;
                                        },
                                        0
                                      )
                                    : 0),
                                order.currencyCode
                              )}
                            </Col>
                          </Row>
                          <Row className="order-total-delivery">
                            <Col width="50">{t("Delivery")}</Col>
                            <Col width="50">
                              {formatPrice(
                                order.shippingItems
                                  ? order.shippingItems.reduce((prev, cur) => {
                                      return prev + cur.price;
                                    }, 0)
                                  : 0,
                                order.currencyCode,
                                true
                              )}
                            </Col>
                          </Row>
                          {order.totalRefundAmount && (
                            <Row className="order-total-refunded">
                              <Col width="50">{t("Refunded")}</Col>
                              <Col width="50">
                                {formatPrice(
                                  order.totalRefundAmount,
                                  order.currencyCode
                                )}
                              </Col>
                            </Row>
                          )}
                        </Block>
                        <List
                          noHairlines
                          noHairlinesBetween
                          className="order-actions"
                        >
                          <ListItem
                            link
                            title={t("Message to the Seller").toString()}
                            noChevron
                            onClick={() =>
                              resizeEvent.width < 630
                                ? this.setState({
                                    startChatSheetOpened: true,
                                    selectedOrderId: order.uid,
                                  })
                                : this.setState({
                                    startChatPopupOpened: true,
                                    selectedOrderId: order.uid,
                                  })
                            }
                          >
                            <IcMessagesSmall slot="media" />
                          </ListItem>
                        </List>
                        {this.isShipped(order) && !this.isDelivered(order) && (
                          <Block>
                            <Button
                              large
                              fill
                              className="confirm-order-received-link"
                              text={t("Confirm Goods Received").toString()}
                              onClick={() =>
                                this.confirmGoodsReceivedHandle(order)
                              }
                            />
                          </Block>
                        )}
                      </Col>
                    </Row>
                  </Card>
                )}
              </div>
            ))}
          </Block>
        )}

        <Toast
          text={this.state.toastText}
          show={this.state.toastText !== null}
        />

        <Sheet
          id="start_chat_sheet"
          swipeToClose
          backdrop
          opened={startChatSheetOpened}
          slot="fixed"
          style={{ height: "auto" }}
          onSheetClose={() => {
            this.setState({
              startChatSheetOpened: false,
            });
          }}
        >
          <StartChat
            opened={startChatSheetOpened}
            productUid={selectedOrderForChat?.uid}
            onClose={() => {
              this.setState({
                startChatSheetOpened: false,
              });
            }}
            onStartChat={() => this.startChatHandle(selectedOrderForChat)}
            type="buyer"
            orderNumber={selectedOrderForChat?.orderNumber}
          />
        </Sheet>

        <Popup
          id="start_chat_popup"
          backdrop
          opened={startChatPopupOpened}
          slot="fixed"
          onPopupClose={() => {
            this.setState({
              startChatPopupOpened: false,
            });
          }}
        >
          <StartChat
            opened={startChatPopupOpened}
            productUid={selectedOrderForChat?.uid}
            onClose={() => {
              this.setState({
                startChatPopupOpened: false,
              });
            }}
            onStartChat={() => this.startChatHandle(selectedOrderForChat)}
            orderNumber={selectedOrderForChat?.orderNumber}
            type="buyer"
          />
        </Popup>
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  loading: state.ordersReducer.ordersLoading,
  error: state.ordersReducer.ordersLoadingError,
  orders: state.ordersReducer.orders,
  orderStates: state.classificatorReducer.entitiesClassificators.Order_State,
  resizeEvent: state.rootReducer.resizeEvent,
});

const mapDispatchToProps = (dispatch: any) => ({
  loadOrders: () => dispatch(loadOrders()),
  selectOrder: (order: ProductOrder) => dispatch(selectOrder(order)),
  changeStatus: (uid: string, statusExtended?: string) =>
    dispatch(changeOrderStatus(uid, statusExtended)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  connectChat,
  withTranslation()
)(OrdersPage);
