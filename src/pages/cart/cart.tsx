import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import cn from "classnames";
import Dom7 from "dom7";
import {
  Block,
  BlockTitle,
  Checkbox,
  Icon,
  List,
  ListItem,
  Navbar,
  NavRight,
  Page,
  PageContent,
  Popup,
  Subnavbar,
} from "framework7-react";
import { groupBy } from "lodash";
import { compose } from "redux";

import {
  loadCart,
  removeFromCart,
  selectForPurchaseBySeller,
  setSelectedToCart,
} from "@/actions/cartActions";
import { toggleSelectCustomerLocationSheet } from "@/actions/customer-location/customerLocationActions";
import { resetOrder } from "@/actions/ordersActions";
import { addToWishList, loadProductWishList } from "@/actions/productActions";
import { AppNavBar } from "@/components/AppNavBar";
import { RegisterDesktopPopup } from "@/components/RegisterDesktop";
import { SelectCustomerLocationButton } from "@/components/SelectCustomerLocationButton";
import { SellerCart } from "@/components/SellerCart";
import { Sheet } from "@/components/Sheet";
import { ThemedButton } from "@/components/ThemedButton";
import { IcRemove } from "@/components-ui/icons";
import { IProduct } from "@/reducers/productReducer";
import { ISessionState } from "@/reducers/sessionReducer";
import { isLoggedIn } from "@/selectors/isLoggedIn";
import { getProfile } from "@/selectors/profile";
import connectCart, { ICartProps } from "@/store/connectCart";
import { IApplicationStore, ResizeEvent } from "@/store/rootReducer";
import { Country } from "@/types/commonapi";
import { CartItem } from "@/types/marketplaceapi";

import DeliveryMethodsSheet from "./delivery-methods__sheet";

import "./style.less";

const deliveryTitlesTypes = {
  free: "Free",
  // eslint-disable-next-line @typescript-eslint/camelcase
  fast_fixed: "Shipping",
};

type Props = Page.Props &
  ICartProps & {
    addToWish?(uid?: string): void;
    resetOrder?(): void;
    countryClassificator: Country[];
    sessionState: ISessionState;
    resizeEvent?: ResizeEvent;
    items: CartItem[];
    itemsSelected: string[];
    isFetching: boolean;
    deliveryMethods: {
      title: string;
      description: string;
      uid: string;
    }[];
    removeCartItem?(Item: CartItem): void;
    cartLoad?(): void;
    loadProductWishList?(): void;
    cartSetSelected(items: string[]): void;
    wishList?: IProduct[];
    selectForPurchaseBySeller?(sellerUid: string): void;
    toggleSelectCustomerLocationSheet?(open: boolean): void;
    country?: Country;
    logged: boolean;
  };

class CartPage extends React.Component<
  Props & WithTranslation,
  {
    groupInfoMoreSheetOpened?: boolean;
    groupInfoKey?: string;
    itemInfoMoreSheetOpened?: boolean;
    itemInfoId?: string;
    deliveryMethodsSheetOpened?: boolean;
    chooseCountryPopupOpened?: boolean;
    choosedCountry?: string;
    loginPopupOpened?: boolean;
    registerPopupOpened?: boolean;
    isRemovePopupOpened: boolean;
  }
> {
  constructor(props: Readonly<Props & WithTranslation>) {
    super(props);
    this.state = {
      groupInfoMoreSheetOpened: false,
      itemInfoMoreSheetOpened: false,
      deliveryMethodsSheetOpened: false,
      chooseCountryPopupOpened: false,
      choosedCountry: props.countryClassificator[0]?.code,
      isRemovePopupOpened: false,
    };
  }

  pageInitHandler = () => undefined;

  componentDidMount() {
    this.props.cartLoad();
    this.props.loadProductWishList();

    const selected = this.props.items
      .filter((i) => i.deliveryMethodOption && i.quantity > 0)
      .map((i) => i.itemUid);
    this.props.cartSetSelected(selected);
  }

  componentDidUpdate() {
    this.props.isFetching ? this.$f7.preloader.show() : this.$f7.preloader.hide();

    // if (!deepEqual(this.props.country, prevProps.country)) {
    //   this.props.cartLoad();
    // }
  }

  componentWillUnmount() {
    Dom7(".cart-product-list .product-item").off("taphold", this.itemLinkTapholdListener);
  }

  itemLinkTapholdListener = (ev) => {
    const $el = Dom7(ev.target).closest("li")[0];
    if ($el) {
      const id = $el.getAttribute("id");
      if (id) {
        this.setState({
          itemInfoId: id,
          itemInfoMoreSheetOpened: true,
        });
      }
    }
  };

  getCartTitle = () => {
    const { t, items } = this.props;
    return `${t("Cart")} ${items.length > 0 ? `(${items.length})` : ""}`;
  };

  handleOnChangeStepper = (item: IProduct, value: number) => {
    if (value === 0) {
      this.props.cartRemove(item, 1);
      return;
    }

    this.props.cartUpdate(item, value);
  };

  handlePayOnlyThisSellerClick = () => {
    const { groupInfoKey } = this.state;
    this.setState({ groupInfoMoreSheetOpened: false });
    this.props.selectForPurchaseBySeller(groupInfoKey);
    this.$f7router.navigate("checkout/");
  };

  handleRemoveGoodsFromThisSeller = () => {
    const { groupInfoKey } = this.state;
    this.setState({ groupInfoMoreSheetOpened: false });
    setTimeout(() => {
      this.props.cartRemoveBySeller(groupInfoKey);
    }, 380);
  };

  handleLogin = () => {
    const { resizeEvent } = this.props;
    if (resizeEvent && resizeEvent.width > 567) {
      this.setState({ loginPopupOpened: true });
    } else {
      this.$f7router.navigate("/login/");
    }
  };

  goToCheckout = (sellerUid: string) => {
    const { logged } = this.props;

    if (!logged) {
      this.handleLogin();
      return;
    }

    const filteredBySeller = this.props.items.filter((i) => i.sellerUid === sellerUid);
    const filteredSelected = [];
    filteredBySeller.forEach((value) => {
      if (this.props.itemsSelected.includes(value.itemUid)) {
        filteredSelected.push(value.itemUid);
      }
    });
    this.props.cartSetSelected(filteredSelected);
    this.props.resetOrder();
    this.$f7router.navigate("/checkout/");
  };

  deleteSelected = () =>
    this.props.items
      .filter((item) => this.props.itemsSelected.includes(item.itemUid))
      .forEach((item) => this.props.removeCartItem(item));

  openRemovePopup = () => this.setState({ isRemovePopupOpened: true });

  handleCheckboxChange = () => {
    if (this.props.itemsSelected.length > 0) {
      this.props.cartSetSelected([]);
    } else {
      const selected = this.props.items.reduce(
        (accum, item) => (item.quantity > 0 ? [...accum, item.itemUid] : accum),
        []
      );
      this.props.cartSetSelected(selected);
    }
  };

  render() {
    const { t, items, resizeEvent, toggleSelectCustomerLocationSheet, country } = this.props;
    const { isRemovePopupOpened } = this.state;

    const grouped = groupBy(items, (el: CartItem) => el.sellerUid);

    return (
      <Page
        id="cart_page"
        className="cart-page"
        name="cart-page"
        onPageInit={this.pageInitHandler}
        subnavbar={resizeEvent.width < 769}
      >
        {resizeEvent.width > 768 ? (
          <AppNavBar f7router={this.$f7router} />
        ) : (
          <Navbar title={this.getCartTitle()} backLink={t("Back").toString()} noHairline noShadow>
            <NavRight>
              <ThemedButton onClick={this.openRemovePopup}>
                <IcRemove />
              </ThemedButton>
            </NavRight>
            <Subnavbar className="no-shadow no-hairline">
              <SelectCustomerLocationButton
                title={t("Deliver to {{country}}", {
                  country: country?.name,
                }).toString()}
                onClick={() => toggleSelectCustomerLocationSheet(true)}
              />
            </Subnavbar>
          </Navbar>
        )}
        {resizeEvent.width > 768 && items.length > 0 ? (
          <div className="block-title block-title-medium pure-hidden-xs cart-page-head">
            <div className="cart-page-head-check">
              <div>
                <Checkbox
                  className={cn("checkbox-cart", { selected: this.props.itemsSelected.length > 0 })}
                  checked={this.props.itemsSelected.length > 0}
                  onChange={this.handleCheckboxChange}
                />
                {`${t("Shopping cart")} (${items.length})`}
              </div>
            </div>
            <div className="cart-page-head-remove">
              <ThemedButton onClick={this.deleteSelected}>
                <IcRemove fill="var(--base-110)" />
                <span>{t("Remove Selected Items")}</span>
              </ThemedButton>
            </div>
          </div>
        ) : null}
        {items.length ? (
          Object.entries(grouped).map(([sellerUid, items]) => (
            <SellerCart
              key={sellerUid}
              items={items}
              onCheckout={this.goToCheckout}
              f7router={this.$f7router}
              onLogin={this.handleLogin}
            />
          ))
        ) : !this.props.isFetching ? (
          <PageContent
            className="display-flex justify-content-center align-items-center"
            style={{ flexDirection: "column", paddingTop: "0" }}
          >
            <BlockTitle medium>{t("Your Cart is empty")}</BlockTitle>
            <Block className="text-align-center">
              <p>{t("You haven't added anything to your cart yet")}</p>
            </Block>
            <ThemedButton fill large raised round href="/">
              {t("Continue shopping")}
            </ThemedButton>
          </PageContent>
        ) : null}

        {/* TODO move to component */}
        <Sheet
          id="group_info_more_sheet"
          swipeToClose
          backdrop
          opened={this.state.groupInfoMoreSheetOpened}
          onSheetClosed={() =>
            this.setState({
              groupInfoMoreSheetOpened: false,
            })
          }
          slot="fixed"
          style={{ height: "auto" }}
        >
          <List noHairlines noChevron noHairlinesBetween>
            <ListItem
              link="#"
              title={t("Pay only this Seller").toString()}
              onClick={this.handlePayOnlyThisSellerClick}
            >
              <Icon slot="media" material="account_balance_wallet" />
            </ListItem>
            <ListItem
              link="#"
              title={t("Remove goods from this seller").toString()}
              onClick={this.handleRemoveGoodsFromThisSeller}
            >
              <Icon slot="media" material="delete_outline" />
            </ListItem>
          </List>
        </Sheet>

        <DeliveryMethodsSheet
          opened={this.state.deliveryMethodsSheetOpened}
          onSheetClosed={() => this.setState({ deliveryMethodsSheetOpened: false })}
          items={[
            {
              title: t("Free delivery"),
              description: t("Estimated delivery time period", {
                period: "14-23",
              }),
              uid: "-",
            },
          ]}
          selectedItemUid={"-"}
          choosedCountry={
            this.props.countryClassificator.find((item) => item?.code === this.state.choosedCountry)
              ?.name
          }
          onChooseCountryClick={() => {
            this.setState({ deliveryMethodsSheetOpened: false });
            setTimeout(() => {
              this.setState({ chooseCountryPopupOpened: true });
            }, 380);
          }}
          onApplyClick={() => {
            this.setState({ deliveryMethodsSheetOpened: false });
          }}
          slot="fixed"
        />

        {/* TODO move to component */}
        <Popup
          id="choose_country__popup"
          className="choose-country__popup"
          opened={this.state.chooseCountryPopupOpened}
          onPopupClosed={() => this.setState({ chooseCountryPopupOpened: false })}
        >
          <PageContent style={{ paddingTop: 0 }}>
            <List className="searchbar-not-found" noChevron noHairlines noHairlinesBetween>
              <ListItem title={t("Nothing found").toString()} />
            </List>
            {/* TODO replace with VirtualList! */}
            <List className="search-list searchbar-found" noChevron noHairlines noHairlinesBetween>
              {this.props.countryClassificator.map((val) => (
                <ListItem
                  link
                  key={val?.code}
                  title={val?.name}
                  onClick={() => {
                    this.$f7.popup.close();
                    val?.code && this.setState({ choosedCountry: val.code });
                  }}
                />
              ))}
            </List>
          </PageContent>
        </Popup>

        <RegisterDesktopPopup
          className="pure-hidden-xs"
          opened={this.state.registerPopupOpened}
          onPopupClosed={() => this.setState({ registerPopupOpened: false })}
          slot="fixed"
        />
        <Popup
          id="remove-items-popup"
          backdrop
          opened={isRemovePopupOpened}
          tabletFullscreen={false}
          onPopupClose={() => {
            this.setState({
              isRemovePopupOpened: false,
            });
          }}
        >
          <Block className="remove-items-popup">
            <Block className="remove-items-popup-desc">
              <p>{t("Are you sure you want to remove the items selected?")}</p>
            </Block>

            <Block className="remove-items-popup-actions">
              <ThemedButton
                className="remove-items-popup-actions-cancel"
                onClick={() => this.setState({ isRemovePopupOpened: false })}
              >
                {t("Cancel")}
              </ThemedButton>
              <ThemedButton className="remove-items-popup-actions-remove">
                {t("Remove")}
              </ThemedButton>
            </Block>
          </Block>
        </Popup>
      </Page>
    );
  }
}

const buildDeliveryMethods = () =>
  Object.keys(deliveryTitlesTypes).map((key) => ({
    title: deliveryTitlesTypes[key],
  }));

const mapStateToProps = (state: IApplicationStore) => ({
  countryClassificator: state.classificatorReducer.countryClassificator,
  sessionState: state.sessionReducer,
  resizeEvent: state.rootReducer.resizeEvent,
  items: state.cartReducer.items,
  itemsSelected: state.cartReducer.selected,
  isFetching: state.cartReducer.isFetching,
  deliveryMethods: buildDeliveryMethods(),
  // state.classificatorReducer.entitiesClassificators.Delivery_Duration,
  // state.classificatorReducer.entitiesClassificators.Delivery_Prices
  wishList: state.productReducer.productsWishList,
  country: state.customerLocationReducer.country || getProfile({ ...state }).country,
  logged: isLoggedIn(state),
});

const mapDispatchToProps = (dispatch) => ({
  addToWish: (uid?: string) => dispatch(addToWishList(uid)),
  removeCartItem: (item: CartItem) => dispatch(removeFromCart(item)),
  cartLoad: () => dispatch(loadCart()),
  resetOrder: () => dispatch(resetOrder()),
  loadProductWishList: () => dispatch(loadProductWishList()),
  cartSetSelected: (items: string[]) => dispatch(setSelectedToCart(items)),
  selectForPurchaseBySeller: (sellerUid: string) => dispatch(selectForPurchaseBySeller(sellerUid)),
  toggleSelectCustomerLocationSheet: (open) => dispatch(toggleSelectCustomerLocationSheet(open)),
});

export default compose(
  connectCart,
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation()
)(CartPage);
