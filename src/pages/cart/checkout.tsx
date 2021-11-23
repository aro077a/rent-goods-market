import React from "react";
import {
  Page,
  Block,
  Navbar,
  List,
  ListItem,
  // ListGroup,
  // Stepper,
  // F7Stepper,
  Icon,
  Link,
  PageContent,
  BlockTitle,
  Popup,
  NavRight,
  Searchbar,
  NavLeft,
  NavTitle,
  Preloader,
  Fab,
  Row,
  Col,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { connect } from "react-redux";
import { chain } from "lodash";
import cn from "classnames";

import { IApplicationStore, ResizeEvent } from "@/store/rootReducer";
import connectCart, { ICartProps } from "@/store/connectCart";
import { Sheet } from "@/components/Sheet";
import { AddCardListItem } from "@/components/AddCardListItem";
import PaymentCardCreatePage from "@/pages/payment-card-create";
import { IClassificator } from "@/reducers/classificatorReducer";
import { PaymentMethods } from "@/reducers/checkoutReducer";
import { selectDeliveryAddress, selectPaymentMethod } from "@/actions/checkoutActions";
import connectCards, { ICardsProps } from "@/store/connectCards";
import { getStatusText } from "@/pages/cards";
import { Address, Card, Country } from "@/types/commonapi";
import { Profile } from "@/reducers/sessionReducer";
import connectProfile from "@/store/connectProfile";
import { SavedCard } from "@/reducers/paymentCardsReducer";
import { savePaymentCard } from "@/actions/paymentCardsActions";
import { formatPrice } from "@/utils";
import { IOrdersState } from "@/reducers/ordersReducer";
import { createProductsPurchaseOrder } from "@/actions/ordersActions";
import { IProduct } from "@/reducers/productReducer";
import { ThemedButton } from "@/components/ThemedButton";
import connectAccountAddress, { IAccountAddressProps } from "@/store/connectAccountAddress";
// import CartProductList from "@/components/cart-product-list";
// import { Price } from "@/components/Price";
// import { IcDelivery } from "@/components-ui/icons";

import { CongratulationsPage } from "./congratulations";
import { PaymentFailedPage } from "./payment-failed";
import DeliveryInfoEditPopup from "./delivery-info-edit__popup";
import DeliveryInfoChoosePopup from "./delivery-info-choose__popup";

import "./style.less";

type Props = Page.Props &
  ICardsProps &
  ICartProps &
  IOrdersState &
  IAccountAddressProps & {
    resizeEvent?: ResizeEvent;
    paymentMethods: IClassificator[];
    selectedPaymentMethod: PaymentMethods;
    selectPaymentMethod?(method: PaymentMethods, paymentCard?: Card): void;
    selectedPaymentCard?: Card;
    selectDeliveryAddress?(address: Address): void;
    selectedDeliveryAddress?: Address;
    profile?: Profile;
    saveCard?(card: SavedCard): () => void;
    createProductsPurchaseOrder?(
      paymentMethod: PaymentMethods,
      deliveryAddress: Address,
      products: {
        productUid: string;
        count: number;
      }[],
      options: {
        cardUid?: string;
        cvc?: string;
      },
      savedCard?: SavedCard
    ): () => void;
    countryClassificator: Country[];
  };

class CheckoutPage extends React.Component<
  Props & WithTranslation,
  {
    addPaymentMethodSheetOpened?: boolean;
    paymentCardCreateOpened?: boolean;
    congratulationsPageOpened?: boolean;
    failedPageOpened?: boolean;
    deliveryInfoEditOpened?: boolean;
    chooseCountryPopupOpened?: boolean;
    country?: Country /* TODO: move to container component */;
    countryChoosed?: boolean /* TODO: move to container component */;
    deliveryInfoEditResetState?: boolean;
    deliveryInfoChooseOpened?: boolean;
    selectDeliveryAddress?(address: Address): () => void;
  }
> {
  constructor(props: Readonly<Props & WithTranslation>) {
    super(props);
    this.state = {};
  }

  pageInitHandle = () => {
    const { addresses } = this.props.accountAddressState;
    if (!addresses.length) {
      this.setState({ deliveryInfoEditOpened: true });
    }

    if (!this.props.cards.length) {
      this.props.loadPaymentCardsList();
    }

    this.setState({ deliveryInfoEditResetState: true });
  };

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.orderCreatingError !== this.props.orderCreatingError &&
      !this.props.orderCreating
    ) {
      this._lock = false;
      this.setState({ failedPageOpened: true });
    }

    if (prevProps.orderCreating && !this.props.orderCreating && !this.props.orderCreatingError) {
      this._lock = false;
      this.setState({ congratulationsPageOpened: true });
    }

    if (!prevProps.orderCreating && this.props.orderCreating) {
      this.$f7.preloader.show();
    } else if (prevProps.orderCreating && !this.props.orderCreating) {
      this.$f7.preloader.hide();
    }

    if (this.props.itemsCart.length === 0) {
      if (this.$f7router.history.length > 0) {
        this.$f7router.back();
      } else {
        this.$f7router.navigate("/", {
          animate: false,
          clearPreviousHistory: true,
          force: true,
          ignoreCache: true,
          reloadAll: true,
        });
      }
    }
  }

  renderStatusLabel = (item: Card) => {
    const { t } = this.props;
    const statusText = getStatusText(item.status);
    return (
      <span slot="footer" className={cn(item.status === "V" && "verified")}>
        {t(statusText)}
      </span>
    );
  };

  renderCardsList = () => {
    const { loading, cards, selectedPaymentCard, t } = this.props;

    return (
      <List noHairlines noChevron>
        <ul>
          {/*
          <ListItem
            link="#"
            title={t("Cash on delivery").toString()}
            onClick={() => {
              this.setState({ addPaymentMethodSheetOpened: false });
              setTimeout(() => this.props.selectPaymentMethod("cash"), 380);
            }}
          >
            <Icon slot="media" material="account_balance_wallet" />
          </ListItem>
          */}
          {loading && (
            <ListItem className="cards-loading-item">
              <Preloader size={18} />
            </ListItem>
          )}
          {cards.map((item) => (
            <ListItem
              key={item.uid}
              link
              title={item.maskedNumber}
              onClick={() => {
                this.setState({ addPaymentMethodSheetOpened: false });
                setTimeout(() => this.props.selectPaymentMethod("bankcard", item), 380);
              }}
              noChevron
            >
              <span slot="media">
                <i className={cn("icon", `ic-${item.type && item.type.toLowerCase()}`)}></i>
              </span>
              <span slot="footer">
                {item.expMonth}/{item.expYear}
              </span>
              {selectedPaymentCard && selectedPaymentCard.uid === item.uid && (
                <div slot="after">
                  <Icon f7="checkmark_alt" />
                </div>
              )}
            </ListItem>
          ))}
          <AddCardListItem
            title={t("Add card").toString()}
            noChevron
            onClick={() => {
              this.setState({ addPaymentMethodSheetOpened: false });
              setTimeout(() => this.setState({ paymentCardCreateOpened: true }), 380);
            }}
          />
        </ul>
      </List>
    );
  };

  renderSelectableCardsList = () => {
    const { loading, cards, t } = this.props;
    // const itemsHasTypeS = !!this.props.itemsCart.find((item) => item.type === "S");

    return (
      <List noHairlines noChevron className="pure-hidden-xs">
        <ul>
          {/* !itemsHasTypeS && (
            <ListItem
              radio
              name="payment-method-media-radio"
              value={"cash"}
              title={t("Cash on delivery").toString()}
              onClick={() => this.props.selectPaymentMethod("cash")}
              checked={this.props.selectedPaymentMethod === "cash"}
            >
              <Icon slot="media" material="account_balance_wallet" />
            </ListItem>
          )*/}

          {loading && (
            <ListItem className="cards-loading-item">
              <Preloader size={18} />
            </ListItem>
          )}
          {cards.map((item) => (
            <ListItem
              key={item.uid}
              radio
              name="payment-method-media-radio"
              value={item.uid}
              title={item.maskedNumber}
              onClick={() => {
                this.props.selectPaymentMethod("bankcard", item);
              }}
              checked={
                this.props.selectedPaymentCard && this.props.selectedPaymentCard.uid === item.uid
              }
              noChevron
            >
              <span slot="media">
                <i className={cn("icon", `ic-${item.type && item.type.toLowerCase()}`)}></i>
              </span>
              <span slot="footer">
                {item.expMonth}/{item.expYear}
              </span>
            </ListItem>
          ))}
          <AddCardListItem
            title={t("Add card").toString()}
            noChevron
            onClick={() => {
              this.setState({ addPaymentMethodSheetOpened: false });
              setTimeout(() => this.setState({ paymentCardCreateOpened: true }), 380);
            }}
          />
        </ul>
      </List>
    );
  };

  enterCVC = async (): Promise<string> => {
    return new Promise((resolve) => {
      const { t } = this.props;

      const dialog = this.$f7.dialog.prompt(
        t("Please, enter CVC/CVV"),
        (val: string) => {
          resolve(val);
        },
        () => resolve()
      );

      const elem = dialog.$el
        .find("input")
        .attr("type", "number")
        .attr("minlength", "3")
        .attr("maxlength", "4")[0] as HTMLInputElement;

      /* TODO */
      elem.addEventListener("keypress", (ev) => {
        if (elem.value.length === elem.maxLength) {
          ev.preventDefault();
          return false;
        }
        return true;
      });
      elem.select();
    });
  };

  _lock = false;

  handleConfirmCheckoutClick = async () => {
    if (this._lock) return;
    this._lock = true;

    const {
      selectedPaymentMethod,
      itemsCart,
      selectedPaymentCard,
      savedCard,
      selectedDeliveryAddress,
      t,
    } = this.props;

    if (!selectedPaymentMethod) {
      this.$f7.dialog.alert(t("Add payment method"));
      this._lock = false;
      return;
    }

    if (!selectedDeliveryAddress) {
      this.$f7.dialog.alert(t("Add delivery address"));
      this._lock = false;
      return;
    }

    if (selectedPaymentMethod === "bankcard" && selectedPaymentCard) {
      if (selectedPaymentCard.uid.includes("temporary")) {
        this.props.createProductsPurchaseOrder(
          selectedPaymentMethod,
          selectedDeliveryAddress,
          itemsCart.map((item) => ({ productUid: item.productUid, count: item.quantity })),
          {},
          savedCard
        );
      } else {
        const cvc = await this.enterCVC();
        if (cvc) {
          this.props.createProductsPurchaseOrder(
            selectedPaymentMethod,
            selectedDeliveryAddress,
            itemsCart.map((item) => ({ productUid: item.productUid, count: item.quantity })),
            {
              cardUid: selectedPaymentCard.uid,
              cvc,
            }
          );
        }
      }
    } else {
      this.props.createProductsPurchaseOrder(
        selectedPaymentMethod,
        selectedDeliveryAddress,
        itemsCart.map((item) => ({ productUid: item.productUid, count: item.quantity })),
        {}
      );
    }
  };

  handleOnChangeStepper = (item: IProduct, value: number) => {
    if (value === 0) {
      this.props.cartRemove(item, 1);
      return;
    }

    this.props.cartUpdate(item, value);
  };

  renderFreeDeliveryListItem() {
    /* TODO */
    const { t } = this.props;
    return (
      <ListItem
        className="free-delivery-item-container free-delivery-item"
        title={t("Free delivery").toString()}
        footer={t("Estimated delivery time: 14-23 days").toString()}
        noChevron
      ></ListItem>
    );
  }

  handleDeliveryMethodsClick = () => undefined;

  renderDeliveryInfoListWeb = () => {
    const {
      accountAddressState: { addresses },
      selectedDeliveryAddress,
      t,
    } = this.props;
    return (
      <List mediaList noChevron noHairlines noHairlinesBetween className="pure-hidden-xs">
        {addresses.map((item) => {
          return (
            <ListItem
              key={item.uid}
              radio
              name="delivery-media-radio"
              value={item.uid}
              title={item.firstAddressLine}
              onClick={() => {
                this.props.selectDeliveryAddress(item);
              }}
              checked={item.uid === (selectedDeliveryAddress ? selectedDeliveryAddress.uid : null)}
            >
              <div slot="text">
                {item.country.name}, {item.city} <br />
                {item.firstAddressLine} <br />
                {item.postalCode}
              </div>
            </ListItem>
          );
        })}
        <ListItem
          className="item-add-link"
          link
          title={t("Add delivery Information").toString()}
          noChevron
          onClick={() => {
            this.setState({ deliveryInfoEditOpened: true });
          }}
        >
          <span slot="media">
            <Icon ios="f7:plus" md="material:add" />
          </span>
        </ListItem>
      </List>
    );
  };

  render() {
    const {
      selectedPaymentMethod,
      selectedPaymentCard,
      selectedDeliveryAddress,
      t,
      itemsCart,
      totalSelectedForPurchase,
    } = this.props;

    // TODO
    const groupedItems = chain(itemsCart)
      .groupBy((item) => item.sellerUid)
      .map((value, key) => ({ key, items: value }))
      .value();

    const currencyCode = groupedItems.length ? groupedItems[0].items[0].productCurrencyCode : "";

    return (
      <Page id="checkout_page" name="checkout-page" onPageInit={this.pageInitHandle}>
        <Navbar title={t("Checkout")} backLink={t("Back").toString()} noHairline noShadow />
        <Row>
          <Col width="100" medium="70">
            <BlockTitle medium>
              <span>{t("Delivery information")}</span>
              <Link
                href="#"
                onClick={() => this.setState({ deliveryInfoChooseOpened: true })}
                className="pure-visible-xs"
              >
                <Icon material="create" />
              </Link>
            </BlockTitle>
            {selectedDeliveryAddress && (
              <Block className="pure-visible-xs">
                {selectedDeliveryAddress.country.name}, {selectedDeliveryAddress.city}
                <br />
                {selectedDeliveryAddress.firstAddressLine}
              </Block>
            )}
            {this.renderDeliveryInfoListWeb()}
            <Block className="no-margin-vertical">
              <hr />
            </Block>
            {selectedPaymentMethod && (
              <>
                <BlockTitle medium className="pure-visible-xs">
                  <span>{t("Payment method")}</span>
                  <Link
                    href="#"
                    onClick={() => this.setState({ addPaymentMethodSheetOpened: true })}
                  >
                    <Icon material="create" />
                  </Link>
                </BlockTitle>
                <List noHairlines noChevron className="no-margin-vertical pure-visible-xs">
                  {selectedPaymentMethod === "cash" ? (
                    <ListItem link="#" title={t("Cash on delivery").toString()}>
                      <Icon slot="media" material="account_balance_wallet" />
                    </ListItem>
                  ) : null}
                  {selectedPaymentMethod === "bankcard" ? (
                    <ListItem
                      key={selectedPaymentCard.uid}
                      link
                      title={selectedPaymentCard.maskedNumber}
                      // onClick={() => {}}
                      noChevron
                    >
                      <span slot="media">
                        <i
                          className={cn("icon", `ic-${selectedPaymentCard?.type?.toLowerCase()}`)}
                        ></i>
                      </span>
                      <span slot="footer">
                        {selectedPaymentCard.expMonth}/{selectedPaymentCard.expYear}
                      </span>
                    </ListItem>
                  ) : null}
                </List>
              </>
            )}

            <BlockTitle medium className="pure-hidden-xs">
              <span>{t("Payment method")}</span>
            </BlockTitle>

            {this.renderSelectableCardsList()}

            {!selectedPaymentMethod && (
              <List noHairlines noChevron className="no-margin-vertical pure-visible-xs">
                <ListItem
                  className="item-add-link"
                  link
                  title={t("Add payment method").toString()}
                  noChevron
                  onClick={() => this.setState({ addPaymentMethodSheetOpened: true })}
                >
                  <span slot="media">
                    <Icon ios="f7:plus" md="material:add" />
                  </span>
                </ListItem>
              </List>
            )}
            <Block className="no-margin-vertical">
              <hr />
            </Block>

            {!this.props.resizeEvent?.isXS && (
              <BlockTitle medium>
                <span>{t("Order list")}</span>
              </BlockTitle>
            )}

            {/* // ? What is this */}
            {/* {!this.props.resizeEvent?.isXS && (
              <CartProductList
                estimatedDeliveryTimeLabel={t("Estimated delivery time: 14-23 days")}
                freeDeliveryLabel={t("Free delivery")}
                items={itemsCart}
                onMoreLinkClick={(group) => {}}
                onProductCountStepperChange={this.handleOnChangeStepper}
                onSelectDeliveryMethodClick={this.handleDeliveryMethodsClick}
                onAddToWishListClick={(product) => {}}
                wishList={[]}
                onDeleteItemClick={(product) => {}}
                onPayOnlyThisSellerClick={(sellerUid) => {}}
                payOnlyThisSellerLabel={t("Pay only this Seller")}
              />
            )} */}

            <BlockTitle medium className="pure-visible-xs">
              {t("Order summary")}
            </BlockTitle>
            <List
              className="order-summary pure-visible-xs"
              noHairlines
              noChevron
              noHairlinesBetween
            >
              <ListItem
                title={t("Items") + ` (${itemsCart.length})`}
                after={formatPrice(totalSelectedForPurchase, currencyCode)}
              ></ListItem>
              <ListItem
                title={t("Delivery").toString()}
                after={formatPrice(0, currencyCode)}
              ></ListItem>
              <ListItem
                title={t("Total").toString()}
                after={formatPrice(totalSelectedForPurchase, currencyCode)}
                className="total"
              ></ListItem>
            </List>
          </Col>
          <Col width="100" medium="30" className="pure-hidden-xs" style={{ position: "relative" }}>
            <div className="order-summary-container">
              <BlockTitle medium>{t("Order summary")}</BlockTitle>
              <List className="order-summary" noHairlines noChevron noHairlinesBetween>
                <ListItem
                  title={t("Items") + ` (${itemsCart.length})`}
                  after={formatPrice(totalSelectedForPurchase, currencyCode)}
                ></ListItem>
                <ListItem
                  title={t("Delivery").toString()}
                  after={formatPrice(0, currencyCode)}
                ></ListItem>
                <ListItem
                  title={t("Total").toString()}
                  after={formatPrice(totalSelectedForPurchase, currencyCode)}
                  className="total"
                ></ListItem>
              </List>
              <Block>
                {/* TODO move to component */}
                <ThemedButton
                  round
                  large
                  fill
                  onClick={this.handleConfirmCheckoutClick}
                  disabled={this.props.orderCreating}
                >
                  <span>{t("Confirm and pay")}</span>
                </ThemedButton>
              </Block>
            </div>
          </Col>
        </Row>

        <Fab
          position="right-bottom"
          onClick={this.handleConfirmCheckoutClick}
          slot="fixed"
          className="pure-visible-xs"
        >
          <Icon ios="f7:checkmark_alt" md="material:check" />
        </Fab>

        <PaymentCardCreatePage
          opened={this.state.paymentCardCreateOpened}
          onPopupClosed={() => this.setState({ paymentCardCreateOpened: false })}
          onSaveCard={(card) => {
            this.setState({ paymentCardCreateOpened: false });
            setTimeout(() => {
              this.props.saveCard(card);
              this.props.selectPaymentMethod("bankcard", card);
            }, 380);
          }}
        />

        {/* TODO move to component */}
        <Sheet
          id="add_payment_method_sheet"
          swipeToClose
          backdrop
          opened={this.state.addPaymentMethodSheetOpened}
          onSheetOpened={() => {
            if (!this.props.cards || (!this.props.cards.length && this.props.profile.uid)) {
              this.props.loadPaymentCardsList();
            }
          }}
          onSheetClosed={() => {
            this.setState({
              addPaymentMethodSheetOpened: false,
            });
          }}
          slot="fixed"
          style={{ height: "auto" }}
        >
          <BlockTitle medium>
            <span>{t("Add payment method")}</span>
          </BlockTitle>
          {this.renderCardsList()}
        </Sheet>

        <CongratulationsPage
          slot="fixed"
          opened={this.state.congratulationsPageOpened}
          onPopupClosed={() => {
            this.setState({ congratulationsPageOpened: false });
            this.$f7router.navigate(
              { name: "HomePage" },
              { clearPreviousHistory: true, force: true, reloadAll: true }
            );
          }}
        />

        <PaymentFailedPage
          slot="fixed"
          opened={this.state.failedPageOpened}
          onPopupClosed={() => this.setState({ failedPageOpened: false })}
        />

        <DeliveryInfoEditPopup
          opened={this.state.deliveryInfoEditOpened}
          onPopupClosed={(_, chooseCountry) => {
            this.setState({
              deliveryInfoEditOpened: false,
              deliveryInfoEditResetState: true,
              country: null,
            });
            if (chooseCountry) {
              setTimeout(() => {
                this.setState({
                  chooseCountryPopupOpened: true,
                  countryChoosed: false,
                });
              }, 300);
            } else {
              if (this.props.resizeEvent.width < 768) {
                this.setState({ deliveryInfoChooseOpened: true });
              }
            }
          }}
          onAddOrUpdateInfo={(address) => {
            console.log(address);
          }}
          country={this.state.country}
          reset={this.state.deliveryInfoEditResetState}
        />

        <DeliveryInfoChoosePopup
          opened={this.state.deliveryInfoChooseOpened}
          onPopupClosed={(_, addDeliveryInformation) =>
            this.setState({
              deliveryInfoChooseOpened: false,
              deliveryInfoEditOpened: addDeliveryInformation,
            })
          }
        />

        {/* TODO move to component */}
        <Popup
          id="choose_country__popup"
          className="choose-country__popup"
          opened={this.state.chooseCountryPopupOpened}
          onPopupClosed={() => {
            this.setState({ chooseCountryPopupOpened: false });
            if (this.state.countryChoosed) {
              this.setState({
                deliveryInfoEditOpened: true,
                deliveryInfoEditResetState: false,
              });
            }
          }}
        >
          <Navbar backLink={false} noHairline noShadow sliding>
            <NavLeft>
              <Link iconOnly onClick={() => this.$f7.popup.close()}>
                <Icon className="icon-back" />
              </Link>
            </NavLeft>
            <NavTitle>{t("Choose country")}</NavTitle>
            <NavRight>
              <Link
                searchbarEnable=".searchbar-demo-1"
                iconIos="f7:search"
                iconAurora="f7:search"
                iconMd="material:search"
              ></Link>
            </NavRight>
            <Searchbar
              className="searchbar-demo-1"
              expandable
              searchContainer=".search-list"
              searchIn=".item-title"
              disableButton={!this.$theme.aurora}
            ></Searchbar>
          </Navbar>
          <PageContent style={{ paddingTop: 0 }}>
            <List className="searchbar-not-found" noChevron noHairlines noHairlinesBetween>
              <ListItem title={t("Nothing found").toString()} />
            </List>
            {/* TODO replace with VirtualList! */}
            <List className="search-list searchbar-found" noChevron noHairlines noHairlinesBetween>
              {this.props.countryClassificator.map((val) => (
                <ListItem
                  link
                  key={val.code}
                  title={val.name}
                  onClick={() => {
                    this.setState({ country: val, countryChoosed: true }, () => {
                      this.$f7.popup.close();
                    });
                  }}
                />
              ))}
            </List>
          </PageContent>
        </Popup>
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  resizeEvent: state.rootReducer.resizeEvent,
  paymentMethods: state.classificatorReducer.entitiesClassificators.Payment_Options,
  selectedPaymentMethod: state.checkoutReducer.selectedPaymentMethod,
  selectedPaymentCard: state.checkoutReducer.selectedPaymentCard,
  selectedDeliveryAddress: state.checkoutReducer.selectedDeliveryAddress,
  countryClassificator: state.classificatorReducer.countryClassificator,
  // ! WAS: itemsCart: state.cartReducer.items.filter((item) => item.selectedForPurchase),
  itemsCart: state.cartReducer.items.filter((item) =>
    state.cartReducer.selected.includes(item.itemUid)
  ),
  ...state.ordersReducer,
});

const mapDispatchToProps = (dispatch) => ({
  selectPaymentMethod: (method: PaymentMethods, paymentCard?: Card) =>
    dispatch(selectPaymentMethod(method, paymentCard)),
  selectDeliverAddress: (address: Address) => dispatch(selectDeliveryAddress(address)),
  saveCard: (card: SavedCard) => dispatch(savePaymentCard(card, false)),
  createProductsPurchaseOrder: (
    paymentMethod: PaymentMethods,
    deliveryAddress: Address,
    products: {
      productUid: string;
      count: number;
    }[],
    options: {
      cardUid?: string;
      cvc?: string;
    },
    savedCard?: SavedCard
  ) =>
    dispatch(
      createProductsPurchaseOrder(paymentMethod, deliveryAddress, products, options, savedCard)
    ),
  selectDeliveryAddress: (address: Address) => dispatch(selectDeliveryAddress(address)),
});

export default compose(
  connectCart,
  connectCards,
  connectProfile,
  connectAccountAddress,
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation()
)(CheckoutPage);
