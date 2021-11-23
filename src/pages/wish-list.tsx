import React, { Component } from "react";
import { Page, F7Navbar, Block, BlockTitle, Link, NavLeft, NavRight } from "framework7-react";
import { withTranslation, WithTranslation } from "react-i18next";
import { compose } from "redux";
import { connect } from "react-redux";

import { IApplicationStore, ResizeEvent } from "@/store/rootReducer";
import connectSearch, { SearchConnectorProps } from "@/store/connectSearch";
import { IProduct, IProductState } from "@/reducers/productReducer";
import { Profile } from "@/reducers/sessionReducer";
import { loadProductWishList, addToWishList, searchClear } from "@/actions/productActions";
import { chooseCategory } from "@/actions/filterActions";
import { goToMessenger } from "@/actions/profileActions";
import { getProfile } from "@/selectors/profile";
import { Catalog } from "@/components/Catalog";
import { Slider, SliderType, SliderItem } from "@/components/Slider";
// import { Logo } from "@/components/Logo";
// import MyWishButton from "@/components/MyWishButton";
// import { OpenCategoriesButton } from "@/components/open-categories-button";
// import { SearchBar } from "@/components/search-bar";
// import ToMessengerButton from "@/components/to-messenger-button/ToMessengerButton";
import { ProfileLink } from "@/components/ProfileLink";
import { CategoriesMenuDesktop } from "@/components/categories-menu-desktop";
import { ProfilePopover } from "@/components/ProfilePopover";
import { Navbar } from "@/components/navbar";
import { AboutPopup } from "@/components/AboutPopup";
import { VerifyAccountPopup } from "@/components/VerifyAccountPopup";
import { ContactSupportPopup } from "@/components/ContactSupportPopup";

import "./categories.less";
import "./wish-list.less";

type Props = WithTranslation &
  SearchConnectorProps & {
    productsWishListLoading?: boolean;
    productsWishList?: IProduct[];
    productsWishListLoadingError?: any;
    loadProductWishList?(): void;
    productState?: IProductState;
    addToWish?(uid?: string): void;
    resizeEvent?: ResizeEvent;
    goToMessenger?(): void;
    chooseCategory?(catid?: string | null): void;
    clearSearch?(): void;
    profile?: Profile;
  };

class WishListPage extends Component<
  Props,
  {
    searchBarEnable?: boolean;
    selectCategorySheetOpened?: boolean;
    categoriesMenuOpened?: boolean;
    profilePopoverOpened?: boolean;
    sortingMenuPopoverOpened?: boolean;
    aboutPopupOpened?: boolean;
    verifyAccountPopupOpened?: boolean;
    contactSupportPopupOpened: boolean;
  }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      aboutPopupOpened: false,
      verifyAccountPopupOpened: false,
      contactSupportPopupOpened: false,
    };
  }

  pageInitHandle = () => {
    this.props.loadProductWishList();
  };

  componentDidUpdate(prevProps: Props) {
    const { productsWishListLoadingError } = this.props;
    if (
      productsWishListLoadingError &&
      productsWishListLoadingError !== prevProps.productsWishListLoadingError
    ) {
      this.$f7.dialog.alert(productsWishListLoadingError);
    }
  }

  sliderItemClickHandle = (item: SliderItem) => {
    this.$f7router.navigate(item.href);
  };

  getSlidesItems = (catid?: string): SliderItem[] => {
    const {
      productState: { productTypeGroups },
    } = this.props;
    if (productTypeGroups) {
      const popularType = productTypeGroups.filter((item) => item.type === catid)[0];
      if (popularType) {
        return popularType.products
          ? popularType.products.map((item) => {
              return {
                ...item,
                image: item.imageUrl1,
                priceDiscount: item.discountedPrice,
                href: `/product-details/${item.uid}/`,
                onClick: this.sliderItemClickHandle,
              };
            })
          : [];
      }
    }

    return [];
  };

  renderProfileLink = () => {
    const { profile, resizeEvent } = this.props;
    const props = { profile };
    if (resizeEvent && resizeEvent.width > 567) {
      props["href"] = "#";
      props["onClick"] = this.handleClickProfileLink;
    }
    return <ProfileLink key="profile_link" {...props} />;
  };

  handleClickProfileLink = () => {
    this.setState({ profilePopoverOpened: true });
  };

  onClickProfileLink = () => {
    const { profile, resizeEvent } = this.props;
    if (resizeEvent && resizeEvent.width > 567 && profile && profile.uid) {
      this.handleClickProfileLink();
    } else if (resizeEvent && resizeEvent.width > 567) {
      this.handleClickLoginLink();
    }
  };

  handleClickLoginLink = () => undefined;

  onClickLogoLink = () => {
    const { searchbar } = this.$f7;
    searchbar.disable(".search-bar");
    this.props.chooseCategory(null);
    this.clearSearch();
    this.setState({
      categoriesMenuOpened: false,
      searchBarEnable: false,
    });
    this.$f7router.navigate("/", {
      reloadAll: true,
    });
  };

  clearSearch = () => {
    const { resizeEvent } = this.props;
    const isMobile = resizeEvent.width < 567;
    this.props.clearSearch(!isMobile);
  };

  searchbarEnableHandle = () => {
    this.setState({ searchBarEnable: true });
  };

  searchbarDisableHandle = () => {
    this.setState({ searchBarEnable: false });
    this.clearSearch();
    this.props.search({});
  };

  searchbarClearHandle = () => {
    this.clearSearch();
  };

  onClickOpenCategoriesMenu = () =>
    this.setState({
      categoriesMenuOpened: !this.state.categoriesMenuOpened,
    });

  render() {
    const { productsWishList, profile, t, resizeEvent } = this.props;

    return (
      <Page
        id="wish_list"
        name="wish-list"
        onPageInit={this.pageInitHandle}
        subnavbar={resizeEvent.width <= 768}
      >
        {resizeEvent.width < 568 ? (
          <F7Navbar
            title={t("Your wish list")}
            backLink={t("Back").toString()}
            noHairline
            noShadow
          />
        ) : (
          <Navbar
            profile={profile}
            showProfileLink={true}
            onClickLogoLink={this.onClickLogoLink}
            onClickOpenCategoriesMenu={this.onClickOpenCategoriesMenu}
            onClickProfileLink={this.onClickProfileLink}
            openCategoriesMenuButton={this.state.categoriesMenuOpened}
            showLanguageLink={false}
            onSearchbarEnable={this.searchbarEnableHandle}
            onSearchbarDisable={this.searchbarDisableHandle}
            onSearchClickClear={this.searchbarClearHandle}
            showSearchbar
            findedProducts={this.props.searchProductsAutocomplete}
            findProductLoading={this.props.searchLoadingAutocomplete}
            onFindedProductItemClick={(uid) => this.$f7router.navigate(`/product-details/${uid}/`)}
            showMessengerButton
            onClickGoToMessenger={this.props.goToMessenger}
            slot="fixed"
          />
        )}

        {/* {resizeEvent.width < 567 && (
          <F7Navbar sliding noShadow noHairline>
            <NavLeft
              style={{
                flex: "auto"
              }}
            >
              <ToMessengerButton
                text={t("To Messenger")}
                className="pure-hidden-xs"
                onClick={this.props.goToMessenger}
              />
              <Link
                className="pure-hidden-xs"
                style={{ flex: "0 0 auto" }}
                onClick={() => {
                  this.$f7.searchbar.disable(".search-bar");
                  this.props.chooseCategory(null);
                  this.props.clearSearch();
                  this.$f7router.back();
                }}
              >
                <Logo full />
              </Link>
              <div
                style={{
                  display: "flex",
                  flex: "1 1 auto",
                  justifyContent: "center",
                }}
              >
                <OpenCategoriesButton
                  className="pure-hidden-xs"
                  text={t("Categories")}
                  onClick={() => {
                    this.setState({
                      categoriesMenuOpened: !this.state.categoriesMenuOpened,
                    });
                  }}
                  opened={this.state.categoriesMenuOpened}
                />
                <SearchBar
                  noShadow
                  noHairline
                  init
                  backdrop
                  customSearch
                  onSearchbarEnable={() => {}}
                  onSearchbarDisable={() => {}}
                  onChange={() => {}}
                  onClickClear={() => {}}
                />
              </div>
            </NavLeft>
            <NavRight>
              <MyWishButton />
              {this.renderProfileLink()}
            </NavRight>
          </F7Navbar>
        )} */}

        <div className="catalog-block-title block-title block-title-medium pure-hidden-xs">
          {t("Your wish list")}
        </div>

        {/* //! here */}
        <Catalog
          className="wish-list-catalog"
          items={productsWishList}
          addToWish={this.props.addToWish}
          showFeaturesHiglight
        />
        <BlockTitle medium>{t("Similar products")}</BlockTitle>
        <Slider slides={this.getSlidesItems("011")} type={SliderType.small} />

        <div slot="fixed">
          <CategoriesMenuDesktop
            className="pure-hidden-xs"
            opened={this.state.categoriesMenuOpened}
          />
        </div>

        <ProfilePopover
          backdrop={false}
          opened={this.state.profilePopoverOpened}
          target=".profile-link"
          onPopoverClosed={() => this.setState({ profilePopoverOpened: false })}
          onAboutClick={() => this.setState({ aboutPopupOpened: true })}
          onVerifyClick={() => this.setState({ verifyAccountPopupOpened: true })}
          slot="fixed"
        />

        <AboutPopup
          profile={profile}
          backdrop={true}
          opened={this.state.aboutPopupOpened}
          onPopupClosed={() => this.setState({ aboutPopupOpened: false })}
          onContactSupportClick={() => this.setState({ contactSupportPopupOpened: true })}
        />

        <ContactSupportPopup
          profile={profile}
          category="Application"
          backdrop={true}
          opened={this.state.contactSupportPopupOpened}
          onPopupClosed={() => this.setState({ contactSupportPopupOpened: false })}
        />

        <VerifyAccountPopup
          backdrop={true}
          opened={this.state.verifyAccountPopupOpened}
          onPopupClosed={() => this.setState({ verifyAccountPopupOpened: false })}
        />
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  productsWishListLoading: state.productReducer.productsWishListLoading,
  productsWishList: state.productReducer.productsWishList,
  productsWishListLoadingError: state.productReducer.productsWishListLoadingError,

  productState: state.productReducer,
  resizeEvent: state.rootReducer.resizeEvent,
  profile: getProfile(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadProductWishList: () => dispatch(loadProductWishList()),
  addToWish: (uid?: string) => dispatch(addToWishList(uid)),
  goToMessenger: () => dispatch(goToMessenger()),
  chooseCategory: (catid?: string) => dispatch(chooseCategory(catid)),
  clearSearch: () => dispatch(searchClear()),
});

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
  connectSearch
)(WishListPage);
