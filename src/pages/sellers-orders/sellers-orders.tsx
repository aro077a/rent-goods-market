import {
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Badge,
  Block,
  BlockTitle,
  Button,
  Col,
  Icon,
  Link,
  List,
  ListItem,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
  Page,
  Popup,
  Preloader,
  Row,
  Searchbar,
} from "framework7-react";

import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import {
  loadOrders,
  refundOrder,
  setOrderStatus,
  setProductOrderStatus,
} from "../../actions/sellersOrdersActions";
import {
  IcEditSmall,
  IcFilter,
  IcMessagesSmall,
  IcNothingFound,
  IcRefundSmall,
  IcSearch,
  IcHeaderBackRow,
} from "../../components-ui/icons";
import { SellerAreaMenu } from "../../components/SellerAreaMenu";
import connectChat, { IChatProps } from "../../store/connectChat";
import { IApplicationStore } from "../../store/rootReducer";
import { formatDateTime, formatPrice } from "../../utils";
import "./styles.less";
import OrderStatusBadge from "../../components/OrderStatusBadge/OrderStatusBadge";
import AddTrackingInfoPopup from "./add-tracking-info-popup";
import { ProductOrder } from "../../types/paymentapi";
import OrderRefundPopup from "./order-refund-popup";
import EditTrackingInfoMenuPopover from "./edit-tracking-info-menu-popover";
import ChangeOrderStatusPopup from "./change-order-status-popup";
import OrderTrackingInfo from "../../components/OrderTrackingInfo/OrderTrackingInfo";
import StatusFilterPopover from "./status-filter-popover";
import { StartChat } from "../../components/StartChat";

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithTranslation &
  IChatProps;

type State = {
  selectedOrder?: ProductOrder;
  changeOrderStatusPopupOpened?: boolean;
  addTrackingInfoPopupOpened?: boolean;
  editTrackingInfoMenuPopoverOpened?: boolean;
  editTrackingInfoMenuPopoverTarget?: string;
  orderRefundPopupOpened?: boolean;
  statusFilterPopoverOpened?: boolean;
  statusFilterSelected?: string[];
  statusFilterApplied?: boolean;
  searchQuery?: string;
  changeFilterPopupState: ProductOrder;
  filterhangeFilterPopupStaterPopup: boolean;
};

class SellersOrdersPage extends Component<Props, State> {
  private _searchbar: any;

  constructor(props: Readonly<Props & WithTranslation>) {
    super(props);
    this.state = {
      selectedOrder: null,
      changeOrderStatusPopupOpened: false,
      addTrackingInfoPopupOpened: false,
      editTrackingInfoMenuPopoverOpened: false,
      editTrackingInfoMenuPopoverTarget: null,
      orderRefundPopupOpened: false,
      statusFilterPopoverOpened: false,
      statusFilterSelected: [],
      statusFilterApplied: false,
      searchQuery: "",
      changeFilterPopupState: null,
    };
  }

  componentDidMount() {
    if (this.props.orders.length) {
      this.initSearchbar();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { t } = this.props;

    if (prevProps.loading && !this.props.loading && !this._searchbar) {
      this.initSearchbar();
    }

    if (!prevProps.setOrderStatusLoading && this.props.setOrderStatusLoading) {
      this.$f7.preloader.show();
    } else {
      this.$f7.preloader.hide();
    }

    if (!prevProps.setOrderStatusError && this.props.setOrderStatusError) {
      this.$f7.dialog.alert(t(this.props.setOrderStatusError));
    }
  }

  initSearchbar() {
    const el = ".searchbar-orders";
    this._searchbar = this.$f7.searchbar.create({
      el: el,
      expandable: true,
      searchContainer: ".search-list",
      searchIn: ".item-title",
      disableButton: !this.$theme.aurora,
    });
  }

  componentWillUnmount() {
    this.setState({ statusFilterPopoverOpened: false });

    const {
      resizing: { isLG, isMD, isXL },
    } = this.props;
    const isSmallScreen = !isLG && !isMD && !isXL;

    if (this._searchbar && this._searchbar.el && isSmallScreen) {
      try {
        this._searchbar.destroy();
      } catch (err) {}
    }
  }

  handleBackLink = () => {
    this.$f7router.navigate("/", {
      clearPreviousHistory: true,
      force: true,
    });
  };

  startChatHandle = (order: ProductOrder) => {
    const { loading } = this.props.chatReducer;
    if (loading) return;

    const { t } = this.props;
    const buyerPhone = order.buyer && order.buyer.phone;
    const message = t(
      "Hi! I am contacting you with regards to your order No.",
      {
        orderNumber: order.orderNumber,
      }
    );
    this.props.startChat(buyerPhone, message);
  };

  handleRefundButton = (order: ProductOrder) => {
    this.setState({
      selectedOrder: order,
      orderRefundPopupOpened: true,
    });
  };

  handleChangeStatusButton = (order: ProductOrder) => {
    this.setState({
      selectedOrder: order,
      changeOrderStatusPopupOpened: true,
    });
  };

  handleEditTrackingInfo = (order?: ProductOrder) => {
    if (order) {
      this.setState({
        selectedOrder: order,
      });
    }
    this.setState({
      editTrackingInfoMenuPopoverOpened: false,
      addTrackingInfoPopupOpened: true,
    });
  };

  handleRejectButton = (order: ProductOrder) => {
    const { t, setOrderStatus, setOrderStatusLoading } = this.props;
    if (setOrderStatusLoading) {
      return;
    }
    this.$f7.dialog.confirm(
      t("Are you sure you want to reject this order?"),
      () => {
        setOrderStatus(order.uid, "CA");
      }
    );
  };

  handleStatusChange = (status: string) => {
    const { setProductOrderStatus, setOrderStatusLoading } = this.props;
    const selectedOrder = this.state.selectedOrder;
    if (setOrderStatusLoading || !selectedOrder) {
      return;
    }
    this.setState({ changeOrderStatusPopupOpened: false });
    setProductOrderStatus(selectedOrder.uid, selectedOrder.status, status);
    this.setState({ selectedOrder: null });
  };

  handleTrackingInfoUpdate = (
    trackingNumber: string,
    trackingCarrier: string
  ) => {
    const { setProductOrderStatus, setOrderStatusLoading } = this.props;
    const selectedOrder = this.state.selectedOrder;
    if (setOrderStatusLoading || !selectedOrder) {
      return;
    }
    this.setState({ addTrackingInfoPopupOpened: false });
    setProductOrderStatus(
      selectedOrder.uid,
      selectedOrder.status,
      "SHP",
      trackingCarrier,
      trackingNumber
    );
    this.setState({ selectedOrder: null });
  };

  handleRemoveTrackingInfo = () => {
    const { setProductOrderStatus, setOrderStatusLoading } = this.props;
    const selectedOrder = this.state.selectedOrder;
    if (setOrderStatusLoading || !selectedOrder) {
      return;
    }
    this.setState({ editTrackingInfoMenuPopoverOpened: false });
    setProductOrderStatus(
      selectedOrder.uid,
      selectedOrder.status,
      selectedOrder.statusExtended,
      "n/a",
      "n/a"
    );
    this.setState({ selectedOrder: null });
  };

  handleRefund = (amount: number) => {
    const { refundOrder, setOrderStatusLoading } = this.props;
    const selectedOrder = this.state.selectedOrder;
    if (setOrderStatusLoading || !selectedOrder) {
      return;
    }
    this.setState({ orderRefundPopupOpened: false });
    refundOrder(selectedOrder.uid, amount);
    this.setState({ selectedOrder: null });
  };

  isPaid = (order: ProductOrder) => {
    return ["PA", "MP"].includes(order.status);
  };

  isShipped = (order: ProductOrder) => {
    return ["SHP", "RCV", "DLV"].includes(order.statusExtended);
  };

  isDelivered = (order: ProductOrder) => {
    return order.statusExtended == "DLV";
  };

  isCompleted = (order: ProductOrder) => {
    return this.isPaid(order) && this.isDelivered(order);
  };

  reloadOrders = (done: any) => {
    this.props.loadOrders();
    done();
  };

  getStatusFilter = () => {
    let statusFilter = {};
    this.props.statuses.map((status) => {
      statusFilter[status.code] = status.value;
    });
    return statusFilter;
  };

  statusFilterChangeHandle = (status: string) => {
    let selected = this.state.statusFilterSelected;
    if (selected.includes(status)) {
      selected = selected.filter((item) => item !== status);
    } else {
      selected.push(status);
    }
    this.setState({ statusFilterSelected: selected });
  };

  statusFilterClearHandle = () => {
    const {
      resizing: { isLG, isMD, isXL },
    } = this.props;
    const isSmallScreen = !isLG && !isMD && !isXL;

    this.setState({
      statusFilterSelected: [],
      statusFilterApplied: false,
      statusFilterPopoverOpened: !isSmallScreen ? false : true,
    });
  };

  statusFilterApplyHandle = () => {
    this.setState({
      statusFilterApplied: true,
      statusFilterPopoverOpened: false,
    });
  };

  refreshSelectedOrdersData = () => {
    this.setState({
      statusFilterApplied: true,
    });
  };

  statusFilterCheck = (order: ProductOrder) => {
    const { statusFilterApplied, statusFilterSelected } = this.state;

    if (!statusFilterApplied || statusFilterSelected.length === 0) {
      return true;
    }

    return (
      statusFilterSelected.includes(order.status) ||
      statusFilterSelected.includes(order.statusExtended)
    );
  };

  updateSearchQuery = (query: string) => {
    this.setState({ searchQuery: query });
  };

  searchQueryCheck = (order: ProductOrder) => {
    const { searchQuery } = this.state;

    if (searchQuery == "") {
      return true;
    }

    const query = searchQuery.toLowerCase();
    let match: boolean;

    const matchOrderNumber = order.orderNumber.toLowerCase().includes(query);
    const matchTrackingNumber =
      order.trackingNumber &&
      order.trackingNumber.toLowerCase().includes(query);
    match = matchOrderNumber || matchTrackingNumber;

    if (order.buyer) {
      const matchBuyerEmail =
        order.buyer.email && order.buyer.email.includes(query);
      const matchBuyerPhone =
        order.buyer.phone && order.buyer.phone.includes(query);
      const matchBuyerName =
        order.buyer.name && order.buyer.name.toLowerCase().includes(query);
      const matchBuyerSurname =
        order.buyer.surname &&
        order.buyer.surname.toLowerCase().includes(query);
      match =
        match ||
        matchBuyerEmail ||
        matchBuyerPhone ||
        matchBuyerName ||
        matchBuyerSurname;
    }

    if (order.items && order.items.length > 0) {
      order.items.map((item) => {
        match = match || item.name.toLowerCase().includes(query);
      });
    }

    return match;
  };

  onBackClick = () => {
    const { f7router } = this.props;
    const { statusFilterPopoverOpened } = this.state;
    if (statusFilterPopoverOpened) {
      this.setState({ statusFilterPopoverOpened: false });
    } else {
      f7router.back();
    }
  };

  render() {
    const {
      orders,
      loadOrders,
      loading,
      t,
      resizing: { isLG, isMD, isXL },
    } = this.props;
    const { startChatPopupOpenedData, statusFilterPopoverOpened } = this.state;
    /* TODO: replace to isMobile, isDesktop via browser info! note: tablets! */
    const isSmallScreen = !isLG && !isMD && !isXL;
    const selectedOrders = orders
      .filter((item) => this.statusFilterCheck(item))
      .filter((item) => this.searchQueryCheck(item));

    return (
      <Page
        id="sellers_orders_page"
        name="sellers-orders-page"
        onPageInit={() => {
          if (!orders.length) {
            loadOrders();
          }
        }}
        className={
          isSmallScreen /* mobile or desktop first? */ ? "" : "desktop"
        }
        ptr={true}
        onPtrRefresh={this.reloadOrders}
      >
        {isSmallScreen /* ext. to sep. component?! */ ? (
          <Navbar noHairline noShadow>
            <NavLeft>
              <div className="nav-left-icon" onClick={this.onBackClick}>
                <IcHeaderBackRow />
              </div>
            </NavLeft>

            <NavTitle>
              {!statusFilterPopoverOpened ? t("Sellers Orders") : t("Filtres")}
            </NavTitle>
            {!statusFilterPopoverOpened ? (
              <NavRight>
                <Link iconOnly>
                  <Button
                    onClick={() =>
                      this.setState({
                        statusFilterPopoverOpened: !statusFilterPopoverOpened,
                      })
                    }
                    className="filter-button"
                    popoverOpen=".status-filter-popover"
                  >
                    <div>
                      <IcFilter fill="var(--f7-navbar-link-color)" />
                    </div>
                  </Button>
                </Link>
                <Link iconOnly searchbarEnable=".searchbar-orders">
                  <IcSearch fill="var(--f7-navbar-link-color)" />
                </Link>
              </NavRight>
            ) : (
              <Button
                round
                className="clear-button"
                text={t("Clear")}
                onClick={() => {
                  this.statusFilterClearHandle();
                }}
              />
            )}

            <Searchbar
              className="searchbar-orders"
              expandable
              searchContainer=".search-list"
              searchIn=".item-title"
              disableButton={!this.$theme.aurora}
              disableButtonText={t("Cancel").toString()}
              init={false}
              placeholder={t("Search").toString()}
            />
          </Navbar>
        ) : (
          <Navbar noHairline noShadow>
            <NavLeft>
              <Link iconOnly onClick={this.handleBackLink}>
                <Icon className="icon-back" />
              </Link>
            </NavLeft>
            <NavTitle>{t("Sellers Orders")}</NavTitle>
          </Navbar>
        )}
        <Row resizableFixed>
          <Col
            width="0"
            large="25"
            xlarge="20"
            className="pure-hidden-xs pure-hidden-sm pure-hidden-md"
          >
            <SellerAreaMenu selected="SellerArea_Orders" />
          </Col>
          <Col width="100" large="75" xlarge="80" className="sellers-orders">
            {!loading && isSmallScreen && selectedOrders.length < 1 ? (
              <Block
                style={{ display: "block" }}
                className="searchbar-not-found align-self-center"
              >
                <IcNothingFound />
                <span>{t("Nothing found")}</span>
              </Block>
            ) : null}
            {!isSmallScreen && (
              <Block>
                <Row resizableFixed>
                  <Col className="order-count">
                    <div>
                      {orders.length} {t("Orders")}
                    </div>
                  </Col>
                  <Col className="searchbar-filter">
                    <Button
                      round
                      large
                      fill
                      popoverOpen=".status-filter-popover"
                    >
                      <IcFilter fill="var(--base-90)" />
                      {t("Filter")}
                      {this.state.statusFilterSelected.length > 0 && (
                        <Badge className="selected-status-filter">
                          {this.state.statusFilterSelected.length}
                        </Badge>
                      )}
                    </Button>
                  </Col>
                  <Col className="searchbar-area">
                    <Searchbar
                      className="searchbar-orders"
                      backdrop={false}
                      init={true}
                      customSearch={true}
                      disableButton={!this.$theme.aurora}
                      disableButtonText={t("Cancel").toString()}
                      placeholder={t("Search").toString()}
                      onSearchbarSearch={(_searchbar, query) =>
                        this.updateSearchQuery(query)
                      }
                      onSearchbarClear={() => this.updateSearchQuery("")}
                    />
                  </Col>
                </Row>
              </Block>
            )}
            <Block className="searchbar-not-found align-self-center">
              <IcNothingFound />
              <span>{t("Nothing found")}</span>
            </Block>
            {loading && (
              <Block className="text-align-center">
                <Preloader />
              </Block>
            )}
            <List
              noHairlines
              noChevron={isSmallScreen}
              className="search-list searchbar-found"
              accordionList={!isSmallScreen}
            >
              {orders
                .filter((item) => this.statusFilterCheck(item))
                .filter((item) => this.searchQueryCheck(item))
                .map((item) =>
                  isSmallScreen ? (
                    <ListItem
                      className="product-item"
                      key={item.uid}
                      link={`order-details/${item.uid}/`}
                    >
                      <div slot="title">
                        <span>{`№ ${item.orderNumber}`}</span>
                        <span>{formatDateTime(item.orderDate)}</span>
                      </div>
                      <div slot="footer">
                        {(!item.statusExtended ||
                          item.statusExtended !== "DLV") && (
                          <OrderStatusBadge
                            status={item.status}
                            statusDescription={item.statusDescription}
                          />
                        )}
                        {item.statusExtended && (
                          <OrderStatusBadge
                            status={item.statusExtended}
                            statusDescription={item.statusExtendedDescription}
                          />
                        )}
                      </div>
                    </ListItem>
                  ) : (
                    <AccordionItem key={item.uid}>
                      <Row className="item-content item-inner" noGap>
                        <Col className="col-25 order-number">
                          {item.orderNumber}
                        </Col>
                        <Col className="col-25">
                          {formatDateTime(item.orderDate)}
                        </Col>
                        <Col className="col-40">
                          {(!item.statusExtended ||
                            !this.isDelivered(item)) && (
                            <OrderStatusBadge
                              status={item.status}
                              statusDescription={item.statusDescription}
                            />
                          )}
                          {item.statusExtended && (
                            <OrderStatusBadge
                              status={item.statusExtended}
                              statusDescription={item.statusExtendedDescription}
                            />
                          )}
                        </Col>
                        <Col className="col-10">
                          <strong>
                            {formatPrice(item.amount, item.currencyCode)}
                          </strong>
                        </Col>
                        <Col className="button-expand">
                          <AccordionToggle>
                            <div className="item-inner" />
                          </AccordionToggle>
                        </Col>
                      </Row>
                      <AccordionContent>
                        <Row className="order-details" noGap>
                          <Col width="60">
                            <List noHairlines noChevron mediaList>
                              <ul className="items">
                                {item.items.map((productItem) => (
                                  <ListItem
                                    key={productItem.productUid}
                                    subtitle={productItem.description}
                                  >
                                    <div slot="title" className="product-title">
                                      {productItem.name}
                                    </div>
                                    <div slot="media" className="image">
                                      {productItem.imageUrl && (
                                        <img src={productItem.imageUrl} />
                                      )}
                                    </div>
                                    <div slot="after">
                                      <span className="price">
                                        {formatPrice(
                                          productItem.price,
                                          item.currencyCode
                                        )}
                                      </span>{" "}
                                      x {productItem.quantity}
                                    </div>
                                  </ListItem>
                                ))}
                              </ul>
                            </List>
                            {this.isPaid(item) && (
                              <div className="tracking-info-content">
                                <BlockTitle>
                                  {t("Tracking Information")}
                                </BlockTitle>
                                <Block>
                                  {!item.trackingNumber && (
                                    <List
                                      noHairlines
                                      noChevron
                                      className="no-margin-vertical"
                                    >
                                      <ListItem
                                        className="item-add-link"
                                        link
                                        title={t(
                                          "Add Tracking Information"
                                        ).toString()}
                                        noChevron
                                        onClick={() =>
                                          this.handleEditTrackingInfo(item)
                                        }
                                      >
                                        <span slot="media">
                                          <Icon
                                            ios="f7:plus"
                                            md="material:add"
                                          />
                                        </span>
                                      </ListItem>
                                    </List>
                                  )}
                                  {item.trackingNumber && (
                                    <OrderTrackingInfo
                                      trackingNumber={item.trackingNumber}
                                      trackingCarrier={item.trackingCarrier}
                                      showEditButton={!this.isDelivered(item)}
                                      onTrackingEditClick={() => {
                                        this.setState({ selectedOrder: item });
                                      }}
                                      openPopover=".edit-tracking-info-popover"
                                    />
                                  )}
                                </Block>
                              </div>
                            )}
                            <div className="customer-info-content">
                              <BlockTitle>{t("Customer")}</BlockTitle>
                              <Block>
                                <span className="details">
                                  {item.buyer &&
                                    `${item.buyer.name} {${item.buyer.surname}}`}
                                </span>
                                <span className="details">
                                  {item.buyer && item.buyer.email}
                                </span>
                                <span>
                                  {item.shippingAddress &&
                                    item.shippingAddress.address}
                                </span>
                              </Block>
                            </div>
                          </Col>
                          <Col width="40">
                            <Block>
                              <Row className="order-total">
                                <Col width="50">{t("Total")}</Col>
                                <Col width="50">
                                  {formatPrice(item.amount, item.currencyCode)}
                                </Col>
                              </Row>
                              <Row className="order-total-items">
                                <Col width="50">
                                  {t("Items") + `(${item.items.length})`}
                                </Col>
                                <Col width="50">
                                  {formatPrice(
                                    item.amount -
                                      (item.shippingItems
                                        ? item.shippingItems.reduce(
                                            (prev, cur) => {
                                              return prev + cur.price;
                                            },
                                            0
                                          )
                                        : 0),
                                    item.currencyCode
                                  )}
                                </Col>
                              </Row>
                              <Row className="order-total-delivery">
                                <Col width="50">{t("Delivery")}</Col>
                                <Col width="50">
                                  {formatPrice(
                                    item.shippingItems
                                      ? item.shippingItems.reduce(
                                          (prev, cur) => {
                                            return prev + cur.price;
                                          },
                                          0
                                        )
                                      : 0,
                                    item.currencyCode,
                                    true
                                  )}
                                </Col>
                              </Row>
                              {item.totalRefundAmount && (
                                <Row className="order-total-refunded">
                                  <Col width="50">{t("Refunded")}</Col>
                                  <Col width="50">
                                    {formatPrice(
                                      item.totalRefundAmount,
                                      item.currencyCode
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
                                title={t("Message to the Customer").toString()}
                                noChevron
                                onClick={() =>
                                  this.setState({
                                    startChatPopupOpenedData: item,
                                  })
                                }
                              >
                                <IcMessagesSmall slot="media" />
                              </ListItem>
                              {this.isPaid(item) &&
                                item.statusExtended !== "DLV" && (
                                  <ListItem
                                    link
                                    title={t("Change Order Status").toString()}
                                    noChevron
                                    onClick={() =>
                                      this.handleChangeStatusButton(item)
                                    }
                                  >
                                    <IcEditSmall slot="media" />
                                  </ListItem>
                                )}
                              {this.isPaid(item) && (
                                <ListItem
                                  link
                                  title={t("Refund").toString()}
                                  noChevron
                                  onClick={() => this.handleRefundButton(item)}
                                >
                                  <IcRefundSmall slot="media" />
                                </ListItem>
                              )}
                            </List>
                          </Col>
                        </Row>
                      </AccordionContent>
                    </AccordionItem>
                  )
                )}
            </List>
          </Col>
        </Row>

        <ChangeOrderStatusPopup
          opened={this.state.changeOrderStatusPopupOpened}
          onPopupClosed={() =>
            this.setState({ changeOrderStatusPopupOpened: false })
          }
          onStatusChangeClick={(status) => this.handleStatusChange(status)}
          order={this.state.selectedOrder}
        />

        <EditTrackingInfoMenuPopover
          backdrop={false}
          className="edit-tracking-info-popover"
          opened={this.state.editTrackingInfoMenuPopoverOpened}
          onPopoverClosed={() =>
            this.setState({ editTrackingInfoMenuPopoverOpened: false })
          }
          onEditClick={() => this.handleEditTrackingInfo()}
          onRemoveClick={() => this.handleRemoveTrackingInfo()}
        />

        <AddTrackingInfoPopup
          desktop={true}
          className="add-tracking-info-popup-desktop"
          opened={this.state.addTrackingInfoPopupOpened}
          onPopupClosed={() =>
            this.setState({ addTrackingInfoPopupOpened: false })
          }
          onTrackingInfoChange={(trackingNumber, trackingCarrier) => {
            this.handleTrackingInfoUpdate(trackingNumber, trackingCarrier);
          }}
          order={this.state.selectedOrder}
        />

        <OrderRefundPopup
          opened={this.state.orderRefundPopupOpened}
          onPopupClosed={() => this.setState({ orderRefundPopupOpened: false })}
          onRefundClick={(amount) => this.handleRefund(amount)}
          order={this.state.selectedOrder}
        />

        <StatusFilterPopover
          backdrop={false}
          selectedOrders={selectedOrders}
          className="status-filter-popover"
          opened={this.state.statusFilterPopoverOpened}
          onPopoverClosed={() =>
            this.setState({ statusFilterPopoverOpened: false })
          }
          filter={this.getStatusFilter()}
          selected={this.state.statusFilterSelected}
          onSelect={this.statusFilterChangeHandle}
          onClear={this.statusFilterClearHandle}
          onApply={this.statusFilterApplyHandle}
          isSmallScreen={isSmallScreen}
          refreshSelectedOrdersData={this.refreshSelectedOrdersData}
        />
        <Popup
          id="start_chat_popup"
          backdrop
          opened={!!startChatPopupOpenedData}
          slot="fixed"
        >
          <StartChat
            opened={!!startChatPopupOpenedData}
            productUid={startChatPopupOpenedData?.uid}
            onClose={() => {
              this.setState({
                startChatPopupOpenedData: null,
              });
            }}
            onStartChat={() => this.startChatHandle(startChatPopupOpenedData)}
            type="seller"
            orderNumber={startChatPopupOpenedData?.orderNumber}
          />
        </Popup>
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  ...state.sellersOrdersReducer,
  orders: state.sellersOrdersReducer.orders,
  loading: state.sellersOrdersReducer.loading,
  error: state.sellersOrdersReducer.error,
  resizing: state.rootReducer.resizeEvent,
  statuses: state.classificatorReducer.entitiesClassificators.Order_State,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      loadOrders,
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
)(SellersOrdersPage);
