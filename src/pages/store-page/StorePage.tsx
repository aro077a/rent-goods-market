import React, { PureComponent } from "react";
import {
  Page,
  BlockTitle,
  List,
  ListItem,
  Row,
  Col,
  Button,
  Popover,
  Popup,
  Block,
  Sheet,
} from "framework7-react";
import { compose } from "redux";
import { connect } from "react-redux";
import { WithTranslation, withTranslation } from "react-i18next";

import { Navbar } from "@/components/navbar";
import connectFilter from "@/store/connectFilter";
import connectCategories from "@/store/connectCategories";
import connectCategoriesClassificator from "@/store/connectCategoriesClassificator";
import connectChat, { IChatProps } from "@/store/connectChat";
import connectShare, { IShareProps } from "@/store/connectShare";
import connectCart, { ICartProps } from "@/store/connectCart";
import connectSearch, { SearchConnectorProps } from "@/store/connectSearch";
import { getProfile } from "@/selectors/profile";
import { IApplicationStore, ResizeEvent } from "@/store/rootReducer";
import { Profile } from "@/reducers/sessionReducer";
import { IStoreState } from "@/reducers/storeReducer";
import {
  addToWishList,
  ISearchParams,
  searchProducts,
  searchClear,
} from "@/actions/productActions";
import { getStoreCategories } from "@/actions/storeListActions";
import ChatWithSeller from "@/components/ChatWithSeller";
import { chooseCategorySubcategory } from "@/actions/filterActions";
import { formatDate, getCategory, getSubRoutes } from "@/utils";
import { ICategoryClassificator } from "@/reducers/categoryReducer";
import { Catalog } from "@/components/Catalog";
import { ProfilePopover } from "@/components/ProfilePopover";
import { CategoriesMenuDesktop } from "@/components/categories-menu-desktop";
import { goToMessenger } from "@/actions/profileActions";
import { StartChat } from "@/components/StartChat";
import { startChatWithStore } from "@/actions/chatActions";
import { IProduct, IProductState } from "@/reducers/productReducer";

import { StoreNav } from "./StoreNav";

import "./StorePage.less";

type Props = WithTranslation &
  IChatProps &
  IShareProps &
  ICartProps &
  IStoreState &
  SearchConnectorProps & {
    profile?: Profile;
  } & {
    storeId: string;
    profile?: Profile;
    categoriesClassificator: ICategoryClassificator[];
    resizeEvent?: ResizeEvent;
    addToWish?(uid?: string): void;
    goToMessenger?(): void;
    loadProductDetail?(uid: string): void;
    startChatWithStore(data): void;
    entryDirect: boolean;
    getStoreCategories(data, category?): void;
    productState?: IProductState;
    search?(searchParams: ISearchParams): void;
    searchedProducts?: IProduct[];
    uid?: string;
  };

class StorePage extends PureComponent<Props> {
  state = {
    selectedMenu: "all-products",
    categoryName: "",
    popoverIsOpen: false,
    profilePopoverOpened: false,
    categoriesMenuOpened: false,
    startChatPopupOpened: false,
    startChatSheetOpened: false,
    subRoutes: [],
    storeUid: undefined,
  };

  onClickLogoLink = () => {
    this.$f7.searchbar.disable(".search-bar");
    this.props.clearSearch();
    this.$f7router.navigate("/");
  };

  handleSelectMenu = (selectedMenu: string) => this.setState({ selectedMenu });

  handleClickPrevStateData = (key: string) => {
    this.setState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  startChatHandle = (message: string) => {
    const {
      currentStoreCategories: { phone },
      startChatWithStore,
    } = this.props;
    // Analytics.startChatWithSeller(this.props.profile, this.props.item);
    startChatWithStore({
      sellerPhone: phone,
      message,
    });
    this.setState({
      startChatPopupOpened: false,
      startChatSheetOpened: false,
    });
  };

  handleCategoryClick = (categoryCode?: string) => {
    const { getStoreCategories, categoriesClassificator } = this.props;

    const { storeUid } = this.state;

    const data = {
      offset: 10,
      resetSorting: true,
      category: undefined,
    };

    if (categoryCode) {
      data.category = categoryCode;
      const category = getCategory(categoriesClassificator, categoryCode);
      const { categoryName } = category;
      const subRoutes = getSubRoutes(category);

      this.setState(
        {
          categoryName,
          subRoutes,
        },
        () => {
          getStoreCategories(storeUid, categoryCode);
          this.searchStoreProducts(data);
        }
      );
    } else {
      this.setState(
        {
          categoryName: "",
          subRoutes: [],
        },
        () => {
          getStoreCategories(storeUid);
          this.searchStoreProducts(data);
        }
      );
    }
  };

  searchStoreProducts = (data) => {
    const { searchLoading, uid, productState } = this.props;
    const { subRoutes } = this.state;
    const { count, offset } = productState;

    const subRouteCode = subRoutes.length && subRoutes[subRoutes.length - 1]?.categoryCode;
    if (subRouteCode) data.category = subRouteCode;

    if (!searchLoading && count) {
      this.props.search({
        storeUid: uid,
        count,
        offset,
        ...data,
      });
    }
  };

  componentDidUpdate(prevProps) {
    const {
      currentStoreCategories: { uid },
    } = this.props;

    if (uid !== prevProps.currentStoreCategories.uid) {
      this.setState({ storeUid: uid }, () => {
        this.searchStoreProducts({ storeUid: uid });
      });
    }
  }

  componentDidMount() {
    const { storeId, getStoreCategories } = this.props;
    getStoreCategories(storeId);
  }

  componentWillUnmount() {
    this.props.clearSearch();
  }

  render() {
    const {
      state: {
        selectedMenu,
        popoverIsOpen,
        categoryName,
        profilePopoverOpened,
        categoriesMenuOpened,
        startChatPopupOpened,
        startChatSheetOpened,
        subRoutes,
      },
      props: {
        t,
        profile,
        searchProductsAutocomplete,
        searchLoadingAutocomplete,
        currentStoreCategories,
        searchedProducts,
        currentStoreCategoriesLoading,
        resizeEvent,
        searchLoading,
        addToWish,
        clearSearch,
        goToMessenger,
      },
      handleSelectMenu,
      handleClickPrevStateData,
      onClickLogoLink,
      startChatHandle,
      handleCategoryClick,
      searchStoreProducts,
    } = this;

    const {
      imageUrl,
      description,
      name,
      productCategories,
      modificationDate,
      email,
      phone,
      accountUid,
      uid,
    } = currentStoreCategories;

    return (
      <Page
        id="store"
        name="store"
        subnavbar={resizeEvent.width < 769}
        onInfinite={searchStoreProducts}
        infinite
        infinitePreloader={searchLoading}
        infiniteDistance={300}
        onPageAfterIn={() => setTimeout(() => this.forceUpdate(), 1000)}
      >
        <Navbar
          className="store-navbar"
          profile={profile}
          slot="fixed"
          showShare
          hideDisableButton
          showMessengerButton
          findedProducts={searchProductsAutocomplete}
          findProductLoading={searchLoadingAutocomplete}
          onClickLogoLink={onClickLogoLink}
          openCategoriesMenuButton={categoriesMenuOpened}
          onClickOpenCategoriesMenu={() => handleClickPrevStateData("categoriesMenuOpened")}
          onClickProfileLink={() => handleClickPrevStateData("profilePopoverOpened")}
          onSearchClickClear={clearSearch}
          onClickGoToMessenger={goToMessenger}
          onSearchbarEnable={() => this.setState({ searchBarEnable: true })}
          onSearchbarDisable={() => this.setState({ searchBarEnable: false })}
          onFindedProductItemClick={(uid) => this.$f7router.navigate(`/product-details/${uid}/`)}
          backLink={resizeEvent.width < 568 && t("Back").toString()}
          showSearchbar={resizeEvent.width < 769}
          searchIconShow={resizeEvent.width < 769}
          wishButtonShow={resizeEvent.width > 476}
          showProfileLink={resizeEvent.width > 476}
          showCartLink={resizeEvent.width > 476}
          showChatLink={resizeEvent.width <= 476}
          chatCallback={() => handleClickPrevStateData("startChatSheetOpened")}
          storeData={currentStoreCategories}
        />
        <Row className="store-head">
          <Col className="store-head-left">
            <Button
              className={`store-head-left-popover ${popoverIsOpen ? "opened" : ""}`}
              popoverOpen=".store-popover"
              onClick={() => handleClickPrevStateData("popoverIsOpen")}
            >
              <span
                className="store-head-left-popover-img"
                style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : null}
              />
              <div className="store-head-left-popover-text">
                <h2>{name}</h2>
                <p>{description}</p>
              </div>
            </Button>
            <Popover
              className="store-popover"
              opened={popoverIsOpen}
              backdrop={false}
              onPopoverClosed={() => popoverIsOpen && this.setState({ popoverIsOpen: false })}
            >
              <div className="store-popover-info">
                <span
                  className="store-popover-info-img"
                  style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : null}
                />
                <h3>{name}</h3>
                {formatDate && <p>{`${t("Member since")} ${formatDate(modificationDate)}`}</p>}
              </div>
              <div className="store-popover-contact">
                <p>
                  {t("Email")}
                  <span>{email}</span>
                </p>
                <p>
                  {t("Phone Number")}
                  <span>{phone}</span>
                </p>
              </div>
              <div className="store-popover-location">
                <p>{name}</p>
                <p>{accountUid}</p>
              </div>
            </Popover>
          </Col>
          <Col className="store-head-right">
            <ChatWithSeller
              text={t("Chat with Store")}
              onClick={() =>
                handleClickPrevStateData(
                  resizeEvent.width > 629 ? "startChatPopupOpened" : "startChatSheetOpened"
                )
              }
            />
          </Col>
        </Row>
        <Row className="store-main">
          <StoreNav selectedMenu={selectedMenu} handleSelect={handleSelectMenu} />
          <Col className="store-main-left" width="20">
            <Block className="store-main-left-title">
              <p
                className="store-main-left-title-all"
                onClick={() => categoryName && handleCategoryClick()}
              >
                {t("All Categories")}
              </p>
              {categoryName && <div className="store-main-left-title-subtitle">{categoryName}</div>}
            </Block>
            <List className="store-main-left-list">
              {productCategories &&
                productCategories.length &&
                !currentStoreCategoriesLoading &&
                productCategories.map((category) => (
                  <ListItem
                    key={category.categoryCode}
                    className="store-main-left-list-item"
                    title={category.categoryName}
                    onClick={() => handleCategoryClick(category.categoryCode)}
                  />
                ))}
            </List>
          </Col>
          <Col className="store-main-right" width="75">
            {!currentStoreCategoriesLoading && (
              <>
                <BlockTitle className="store-main-right-title">
                  {searchedProducts.length
                    ? subRoutes.length
                      ? subRoutes[subRoutes.length - 1].categoryName
                      : t("All Products")
                    : t("No items found")}
                </BlockTitle>
                <Catalog items={searchedProducts} addToWish={addToWish} showFeaturesHiglight />
              </>
            )}
          </Col>
        </Row>

        <ProfilePopover
          backdrop={false}
          opened={profilePopoverOpened}
          target=".profile-link"
          onPopoverClosed={() => this.setState({ profilePopoverOpened: false })}
          onAboutClick={() => this.setState({ aboutPopupOpened: true })}
          onVerifyClick={() => this.setState({ verifyAccountPopupOpened: true })}
          slot="fixed"
        />

        <div slot="fixed">
          <CategoriesMenuDesktop
            className="pure-hidden-xs"
            opened={categoriesMenuOpened}
            onSearchbarDisable={() => handleClickPrevStateData("categoriesMenuOpened")}
          />
        </div>

        <Popup id="start_chat_popup" backdrop opened={startChatPopupOpened} slot="fixed">
          <StartChat
            opened={startChatPopupOpened}
            productUid={uid}
            onClose={() => {
              this.setState({
                startChatPopupOpened: false,
              });
            }}
            onStartChat={startChatHandle}
            type="store"
          />
        </Popup>

        <Sheet
          id="start_chat_sheet"
          swipeToClose
          backdrop
          opened={startChatSheetOpened}
          slot="fixed"
          style={{ height: "auto" }}
        >
          <StartChat
            opened={startChatSheetOpened}
            productUid={uid}
            onClose={() => handleClickPrevStateData("startChatSheetOpened")}
            onStartChat={(message) => startChatHandle(message)}
            type="store"
          />
        </Sheet>
      </Page>
    );
  }
}

const entryPageNameEqual = (pageName: string, store: IApplicationStore) =>
  store.rootReducer.entryPageName === pageName;

const mapStateToProps = (state: IApplicationStore) => ({
  profile: getProfile(state),
  storeWidget: state.storeReducer.storeWidget,
  currentStoreCategories: state.storeReducer.currentStoreCategories,
  currentStoreCategoriesLoading: state.storeReducer.currentStoreCategoriesLoading,
  resizeEvent: state.rootReducer.resizeEvent,
  entryDirect: entryPageNameEqual("store", state),
  productState: state.productReducer,
  searchLoading: state.productReducer.loading,
  searchedProducts: state.productReducer.products || [],
});

const mapDispatchToProps = (dispatch) => ({
  search: (searchParams: ISearchParams) => dispatch(searchProducts(searchParams)),
  getStoreCategories: (uid: string, category?: string) =>
    dispatch(getStoreCategories(uid, category)),
  chooseCategorySubcategory: (catId, subId) => dispatch(chooseCategorySubcategory(catId, subId)),
  addToWish: (uid?: string) => dispatch(addToWishList(uid)),
  clearSearch: () => dispatch(searchClear()),
  goToMessenger: () => dispatch(goToMessenger()),
  startChatWithStore: (data) => dispatch(startChatWithStore(data)),
});

export default compose(
  withTranslation(),
  connectFilter,
  connectCategories,
  connectChat,
  connectShare,
  connectCart,
  connectSearch,
  connectCategoriesClassificator,
  connect(mapStateToProps, mapDispatchToProps)
)(StorePage);
