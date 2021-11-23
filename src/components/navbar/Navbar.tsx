import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import cn from "classnames";
import Dom7 from "dom7";
import { Button, F7Navbar, Icon, Link, NavLeft, NavRight, Subnavbar } from "framework7-react";
import debounce from "lodash/debounce";
import { bindActionCreators, compose } from "redux";

import { loadCart } from "@/actions/cartActions";
import { toggleSelectCustomerLocationSheet } from "@/actions/customer-location/customerLocationActions";
import { searchProducts } from "@/actions/productActions";
import { getProductDetailsLink } from "@/actions/shareActions";
import { CartLink } from "@/components/CartLink";
import { Logo } from "@/components/Logo";
import MyWishButton from "@/components/MyWishButton";
import { NavbarTop } from "@/components/navbar/NavbarTop";
import { OpenCategoriesButton } from "@/components/open-categories-button";
import { ProfileLink } from "@/components/ProfileLink";
import { RegisterDesktopPopup } from "@/components/RegisterDesktop";
import { SearchBar } from "@/components/search-bar";
import { SelectCustomerLocationButton } from "@/components/SelectCustomerLocationButton";
import { ShareButton } from "@/components/ShareButton";
import { SharePopup } from "@/components/SharePopup";
import { IcMessages } from "@/components-ui/icons";
import { IProduct } from "@/reducers/productReducer";
import { Profile } from "@/reducers/sessionReducer";
import { getProfile } from "@/selectors/profile";
import { analytics } from "@/Setup";
import { ICartProps } from "@/store/connectCart";
import connectShare, { IShareProps } from "@/store/connectShare";
import { IApplicationStore, ResizeEvent } from "@/store/rootReducer";
import { Country } from "@/types/commonapi";
import { Store } from "@/types/marketplaceapi";
import { createUUID } from "@/utils";

import "./styles.less";

type Props = Partial<WithTranslation> &
  IShareProps &
  Partial<ICartProps> &
  F7Navbar.Props & {
    uid?: string;
    product?: any;
    onClickLogoLink?(): void;
    onClickOpenCategoriesMenu?(): void;
    openCategoriesMenuButton?: boolean;
    onSearchbarEnable?(): void;
    onSearchbarDisable?(): void;
    onSearchInputChange?(val: string, autocomplete?: boolean, prop?: { storeUid?: string }): void;
    onSearchClickClear?(): void;
    showSearchbar?: boolean;
    showCartLink?: boolean;
    profile?: Profile;
    onClickProfileLink?(): void;
    showProfileLink?: boolean;
    findedProducts?: IProduct[];
    findProductLoading?: boolean;
    onFindedProductItemClick?(uid: string): void;
    resizeEvent?: ResizeEvent;
    toggleSelectCustomerLocationSheet?(open: boolean): void;
    country?: Country;
    showShare?: boolean;
    searchIconShow?: boolean;
    wishButtonShow?: boolean;
    showChatLink?: boolean;
    showStoreAction?: boolean;
    chatCallback?(): void;
    cartLoad?(): void;
    className?: string;
    storeData?: Store;
    hideDisableButton?: boolean;
    onLoginClick?: () => void;
  };

type State = {
  searchBarFocus: boolean;
  searchValue: string;
  isOpenedRegistrationPopup: boolean;
};

class Navbar extends Component<Props, State> {
  private _searchbarId: string;
  private _searchbar: any;

  constructor(props: any) {
    super(props);
    this._searchbarId = "_" + createUUID().replace(/-/g, "_");
    this.state = {
      searchBarFocus: false,
      searchValue: "",
      isOpenedRegistrationPopup: false,
    };
  }

  isMdRes: boolean = this.props.resizeEvent.width >= 768;
  isSmRes: boolean = this.props.resizeEvent.width > 567 && this.props.resizeEvent.width <= 850;

  componentDidUpdate(prevProps) {
    const { openCategoriesMenuButton, resizeEvent } = this.props;
    this.initSearhbar();
    this.isMdRes = resizeEvent.width >= 768;
    this.isSmRes = resizeEvent.width > 567 && resizeEvent.width <= 850;

    if (openCategoriesMenuButton !== prevProps.openCategoriesMenuButton && this.isMdRes) {
      const navBars = this.$f7.$(".navbars .navbar-main");

      openCategoriesMenuButton
        ? navBars.addClass("category-opened")
        : navBars.removeClass("category-opened");
    }
  }

  componentWillUnmount() {
    this.$f7.off("click", this.onClickOutsideSearchbarHandler);
  }

  initSearhbar() {
    if (!this._searchbar) {
      const el = Dom7(`#${this._searchbarId}`)[0];
      if (el) {
        this._searchbar = this.$f7.searchbar.create({
          el: Dom7(`#${this._searchbarId}`)[0] as HTMLElement,
        });
        this.initSearchbarDisableBehavior();
      }
    }
  }

  initSearchbarDisableBehavior() {
    this.$f7.on("click", this.onClickOutsideSearchbarHandler);
  }

  onClickOutsideSearchbarHandler = (ev: Event) => {
    const selector = `#${this._searchbarId}`;
    if (this._searchbar) {
      if (!Dom7(ev.target).closest(selector).length && !this._searchbar.value) {
        this._searchbar.disable();
      }
    }
  };

  renderProfileLink() {
    const { onClickProfileLink, profile, showProfileLink, resizeEvent, t } = this.props;
    const props = { profile };
    const isMobile = resizeEvent?.width < 568;

    if (!isMobile) {
      props["href"] = "#";
      props["onClick"] = onClickProfileLink;
    }

    return showProfileLink ? (
      profile?.uid ? (
        <ProfileLink key="profile_link" {...props} />
      ) : (
        <div>
          <Button
            className={cn("header-log_in", {
              "is-mobile": isMobile,
            })}
            round
            raised
            onClick={this.props.onLoginClick}
          >
            {!isMobile ? t("Log In") : <Icon material="account_circle" />}
          </Button>
        </div>
      )
    ) : null;
  }

  onSearchInputChange = (e) => {
    const value = e.target.value;
    const { storeData } = this.props;
    const { uid: storeUid = "" } = storeData || {};
    const prop: { storeUid?: string } = {};
    if (storeData) {
      if (storeUid) {
        prop.storeUid = storeUid;
      } else {
        return;
      }
    }

    this.setState({ searchValue: value });
    if (value.length > 2) {
      this._searchbar = this.$f7.searchbar.create({
        el: Dom7(`#${this._searchbarId}`)[0] as HTMLElement,
      });
      this.delayedQuery(this._searchbar.value || value, { ...prop });
    }
  };

  delayedQuery = debounce((q, prop = {}) => {
    this.props.onSearchInputChange(
      q,
      this.props.resizeEvent.width > 567 || this.props.searchIconShow,
      { ...prop }
    );
  }, 500);

  handleShareProduct = () => {
    const { item, profile } = this.props;
    analytics.shareProduct(profile, item);
    this.props.share(item.name, getProductDetailsLink(item.uid));
  };

  handleShareStore = () => {
    const { storeData, profile } = this.props;
    analytics.shareProduct(profile, storeData);
    this.props.share(storeData.name, storeData.homepage);
  };

  renderCartWIshButtonShow = () => {
    const { showCartLink, wishButtonShow, itemsCart } = this.props;
    return showCartLink && wishButtonShow ? (
      itemsCart?.length ? (
        <CartLink cartCount={itemsCart?.length} />
      ) : (
        <MyWishButton />
      )
    ) : (
      <>
        {showCartLink && <CartLink cartCount={itemsCart?.length} />}
        {wishButtonShow && <MyWishButton />}
      </>
    );
  };

  componentDidMount() {
    this.$f7ready((f7) => {
      const pageContent = f7.$(".view-main .page-content");

      let prevScrollpos = pageContent.scrollTop;

      pageContent.on("scroll", (e: any) => {
        const isPageScroll = e.target?.closest(".view-main");
        if (this.props.resizeEvent.width < 768 || !isPageScroll) return;

        const currentScrollPos = e.srcElement.scrollTop;

        if (prevScrollpos > currentScrollPos) {
          f7.$(".navbar-main").addClass("show");
          f7.$(".navbar-main").removeClass("hide");
        } else {
          f7.$(".navbar-main").addClass("hide");
          f7.$(".navbar-main").removeClass("show");
        }

        prevScrollpos = currentScrollPos;
      });
      this.props.cartLoad();
    });
  }

  handleClickStartSelling = () => {
    const { profile } = this.props;
    profile?.uid
      ? this.$f7.views.main.router.navigate("/profile/seller-area/my-goods/")
      : this.setState({ isOpenedRegistrationPopup: true });
  };

  render() {
    const {
      product,
      onClickLogoLink,
      onClickOpenCategoriesMenu,
      openCategoriesMenuButton,
      onSearchClickClear,
      onSearchInputChange,
      onSearchbarDisable,
      onSearchbarEnable,
      showCartLink,
      showSearchbar,
      findedProducts,
      findProductLoading,
      onFindedProductItemClick,
      resizeEvent,
      toggleSelectCustomerLocationSheet,
      t,
      chatCallback,
      country,
      showShare,
      searchIconShow,
      wishButtonShow,
      showChatLink,
      showStoreAction,
      className,
      storeData,
      hideDisableButton,
      itemsCart,
      profile,
      ...rest
    } = this.props;
    const { searchBarFocus, searchValue, isOpenedRegistrationPopup } = this.state;
    const { isMdRes, isSmRes, handleShareProduct, handleShareStore } = this;

    return (
      <>
        {isMdRes && <NavbarTop />}
        <F7Navbar
          sliding
          noShadow
          noHairline
          className={cn(
            {
              "category-opened": openCategoriesMenuButton,
              "search-bar-focused": searchBarFocus,
              "delivery-is-show": isMdRes,
              "delivery-is-hide": !isMdRes,
            },
            "navbar-main",
            "navbar-shadow",
            className
          )}
          {...rest}
        >
          <NavLeft>
            <Link
              className="pure-hidden-xs navbar-logo-content"
              style={{ flex: "0 0 auto" }}
              onClick={onClickLogoLink}
            >
              <Logo full />
            </Link>
          </NavLeft>
          <div className="navbar-center">
            <div>
              <OpenCategoriesButton
                className="pure-hidden-xs"
                text={t("Categories")}
                onClick={onClickOpenCategoriesMenu}
                opened={openCategoriesMenuButton}
              />
            </div>
            <div className="search-container">
              {showSearchbar && (
                <SearchBar
                  id={this._searchbarId}
                  noShadow
                  noHairline
                  backdrop
                  customSearch
                  disableButton={!hideDisableButton}
                  onSearchbarEnable={() => {
                    onSearchbarEnable();
                    this.setState({ searchBarFocus: true });
                  }}
                  onSearchbarDisable={() => {
                    onSearchbarDisable();
                    this.setState({ searchBarFocus: false });
                  }}
                  onChange={this.onSearchInputChange}
                  onClickClear={onSearchClickClear}
                  findedProducts={findedProducts}
                  onFindedProductItemClick={(uid) => {
                    this._searchbar.disable();
                    onFindedProductItemClick(uid);
                  }}
                  autocomplete={
                    (findProductLoading || (findedProducts && findedProducts.length > 0)) &&
                    this._searchbar &&
                    this._searchbar.enabled &&
                    (resizeEvent.width > 567 || searchIconShow) &&
                    !!(searchValue.length > 2)
                  }
                  preloader={findProductLoading}
                  isIconShow={isSmRes || searchIconShow}
                  searchBarFocus={searchBarFocus}
                />
              )}
            </div>
          </div>
          <NavRight>
            {searchBarFocus && (isSmRes || searchIconShow) ? (
              <span
                className="search-bar-cancel"
                onClick={() => {
                  onSearchbarDisable();
                  this.setState({ searchBarFocus: false });
                }}
              >
                {t("Cancel")}
              </span>
            ) : (
              <>
                {showChatLink && (
                  <div className="nav-right-chat" onClick={chatCallback}>
                    <IcMessages fill="#f1f1f1" />
                  </div>
                )}
                {resizeEvent.width < 567 && showShare && (
                  <div className="nav-right-card-share">
                    <SharePopup uid={product ? product.uid : ""} large={true} />
                  </div>
                )}
                <div className="nav-right-card-wish">
                  {isMdRes ? (
                    <>
                      <MyWishButton />
                      <CartLink cartCount={itemsCart?.length} />
                    </>
                  ) : (
                    this.renderCartWIshButtonShow()
                  )}
                </div>
                <div className="nav-right-start-selling">
                  <Button onClick={this.handleClickStartSelling} round fill>
                    {t("Start Selling")}
                  </Button>
                </div>
                {this.renderProfileLink()}
              </>
            )}
            {resizeEvent.width < 567 && showStoreAction && (
              <div className="nav-right-card-share">
                <ShareButton onClick={this.handleShareProduct} large />
              </div>
            )}
          </NavRight>
          {country && resizeEvent.width <= 768 && (
            <Subnavbar className="no-shadow no-hairline">
              <SelectCustomerLocationButton
                title={t("Deliver to {{country}}", {
                  country: country.name,
                }).toString()}
                onClick={() => toggleSelectCustomerLocationSheet(true)}
              />
            </Subnavbar>
          )}
          <RegisterDesktopPopup
            className="pure-hidden-xs"
            opened={isOpenedRegistrationPopup}
            onPopupClosed={() => this.setState({ isOpenedRegistrationPopup: false })}
            slot="fixed"
          />
        </F7Navbar>
      </>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  resizeEvent: state.rootReducer.resizeEvent,
  itemsCart: state.cartReducer.items,
  country: state.customerLocationReducer.country || getProfile(state).country,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      toggleSelectCustomerLocationSheet,
      cartLoad: loadCart,
    },
    dispatch
  );

const mapStateToPropsDependsOfRoute = (
  state: IApplicationStore,
  ownProps: Props & WithTranslation
) => {
  const {
    rootReducer: { resizeEvent },
    productReducer: { productDetails },
  } = state;

  const isMobile = resizeEvent.width < 567;

  if (!isMobile) {
    ownProps.showSearchbar = true;
  }

  return {
    ...ownProps,
    item: productDetails,
  };
};

const mapDispatchToPropsSearchBehaviorConnector = (dispatch) =>
  bindActionCreators(
    {
      onSearchInputChange: (
        val: string,
        autocomplete = false,
        prop: { storeUid?: string } = {}
      ) => {
        return searchProducts(
          {
            name: val,
            ...prop,
          },
          autocomplete
        );
      },
    },
    dispatch
  );

export default compose<React.FC<Omit<Props, "shareStore">>>(
  withTranslation(),
  connectShare,
  connect(mapStateToProps, mapDispatchToProps),
  connect(null, mapDispatchToPropsSearchBehaviorConnector),
  connect(mapStateToPropsDependsOfRoute)
)(Navbar);
