import React, { Component } from "react";
import {
  Navbar,
  Page,
  NavRight,
  Button,
  Block,
  Row,
  BlockTitle,
  Popover,
  NavLeft,
  Preloader,
  Icon,
} from "framework7-react";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";

import { IcPhone, IcMessages, IcRemove, IcComputer, IcEye, IcClose } from "@/components-ui/icons";
import { StoreNav } from "@/pages/store-page/StoreNav";
import connectCategories from "@/store/connectCategories";
import { ICategory, IApplicationStore, ResizeEvent } from "@/store/rootReducer";
import connectCategoriesClassificator from "@/store/connectCategoriesClassificator";
import { ICategoryClassificator } from "@/reducers/categoryReducer";
import {
  storeHomePageBannerAction,
  addStoreHomePageProduct,
  addStoreHomePageWidget,
  deleteStoreHomePageAllProducts,
  deleteStoreHomePageAllWidgets,
  deleteStoreHomePageProduct,
  deleteStoreHomePageWidget,
  getStoreHomePage,
  initStoreHomePage,
  storeHomePagePublish,
} from "@/actions/storeHomePageActions";
import { getStoreCategories } from "@/actions/storeListActions";
import { IStoreState } from "@/reducers/storeReducer";
import { loadMyGoodsList } from "@/actions/myGoodsActions";
import { StoreCatalog } from "@/components/StoreCatalog";
import { getProfile } from "@/selectors/profile";
import { Profile } from "@/reducers/sessionReducer";
import { StoreHomepage } from "@/types/marketplaceapi";
import { getStoreHomePageFile } from "@/actions/fileUploadActions";
import { loadDifferenceProducts } from "@/actions/productActions";

import AddBannerPopup from "./AddBannerPopup";
import AddWidgetPopup from "./AddWidgetPopup";
import AddProductPopup from "./AddProductPopup";
import LeftPanel from "./LeftPanel";
import { PageSlider } from "./PageSlider";

import "./index.less";

type Props = WithTranslation &
  IStoreState & {
    storeId: string;
    profile: Profile;
    hideLast?: boolean;
    categoryCode?: string;
    categories?: ICategory[];
    resizeEvent: ResizeEvent;
    storeHomePage: StoreHomepage;
    storeHomePageLoading: boolean;
    categoriesClassificator: ICategoryClassificator[];
    loadMyGoodsList: () => void;
    handleBackToMain: () => void;
    getStoreHomePage: (...res) => void;
    initStoreHomePage: (...res) => void;
    getStoreCategories: (...res) => void;
    storeHomePagePublish: (...res) => void;
    addStoreHomePageWidget: (...res) => void;
    loadDifferenceProducts: (...res) => void;
    addStoreHomePageProduct: (...res) => void;
    storeHomePageBannerAction: (...res) => void;
    deleteStoreHomePageWidget: (...res) => void;
    deleteStoreHomePageProduct: (...res) => void;
    deleteStoreHomePageAllWidgets: (...res) => void;
    deleteStoreHomePageAllProducts: (...res) => void;
    getStoreHomePageFile: (...res) => void;
  };

type State = {
  homepage: any;
  bannerMobImage: string;
  bannerDeskImage: string;
  isMobile: boolean;
  isMobileEdit: boolean;
  bannerPopupLink: string;
  bannerPopupTitle: string;
  productsForStore: any;
  selectedProducts: Set<string>;
  openedCategories: Set<string>;
  selectedCategories: Set<string>;
  isOpenWidgetPopup: boolean;
  isOpenBannerPopup: boolean;
  isOpenProductsPopup: boolean;
  widgetsPopoverIsOpen: boolean;
  productsPopoverIsOpen: boolean;
};

class StoreHomePage extends Component<Props> {
  state: State = {
    homepage: [],
    bannerMobImage: "",
    bannerDeskImage: "",
    isMobile: false,
    isMobileEdit: false,
    bannerPopupLink: "",
    bannerPopupTitle: "",
    isOpenBannerPopup: false,
    isOpenWidgetPopup: false,
    isOpenProductsPopup: false,
    widgetsPopoverIsOpen: false,
    productsPopoverIsOpen: false,
    productsForStore: [],
    openedCategories: new Set([]),
    selectedCategories: new Set([]),
    selectedProducts: new Set([]),
  };

  handleOpenWidgetPopup = () => this.setState({ isOpenWidgetPopup: true });
  handleOpenBannerPopup = () => this.setState({ isOpenBannerPopup: true });
  handleCloseWidgetPopup = () =>
    this.setState({
      isOpenWidgetPopup: false,
      openedCategories: new Set([]),
      selectedCategories: new Set([]),
    });
  handleOpenProductAddPopup = () =>
    this.setState({
      isOpenProductsPopup: true,
      selectedCategories: new Set([]),
    });
  handleCloseProductsPopup = () =>
    this.setState({
      isOpenProductsPopup: false,
      selectedProducts: new Set([]),
    });

  handleCloseBannerPopup = () => {
    this.setState({
      isOpenBannerPopup: false,
    });
  };

  handleClickCategories = (id) => {
    const { openedCategories } = this.state;

    if (openedCategories.has(id)) {
      openedCategories.delete(id);
    } else {
      openedCategories.add(id);
    }

    this.setState({ openedCategories });
  };

  handleChangeCategories = (id) => {
    const { selectedCategories } = this.state;

    if (selectedCategories.has(id)) {
      selectedCategories.delete(id);
    } else {
      selectedCategories.add(id);
    }

    this.setState({ selectedCategories });
  };

  handleAddWidget = () => {
    const {
      state: { selectedCategories },
      props: { addStoreHomePageWidget, storeHomePage },
      handleCloseWidgetPopup,
    } = this;

    const { storeUid, uid } = storeHomePage || {};

    selectedCategories.forEach((category) =>
      addStoreHomePageWidget(uid, storeUid, {
        category,
        type: "category",
      })
    );

    handleCloseWidgetPopup();
  };

  handleAddProducts = () => {
    const {
      state: { selectedProducts },
      props: { addStoreHomePageProduct, storeHomePage },
      handleCloseProductsPopup,
    } = this;

    const { storeUid, uid } = storeHomePage || {};

    selectedProducts.forEach((productUid) =>
      addStoreHomePageProduct(
        {
          productUid,
          type: "category",
        },
        uid,
        storeUid
      )
    );

    handleCloseProductsPopup();
  };

  selectProductHandle = (id) => {
    const { selectedProducts, productsForStore } = this.state;

    if (id === "check_all") {
      selectedProducts.size !== productsForStore.length
        ? productsForStore.forEach((product) => selectedProducts.add(product.uid))
        : selectedProducts.clear();
    } else {
      selectedProducts.has(id) ? selectedProducts.delete(id) : selectedProducts.add(id);
    }

    this.setState({ selectedProducts: new Set([...selectedProducts]) });
  };

  handleDeleteWidget = (widget) => {
    const {
      props: { deleteStoreHomePageWidget, storeHomePage },
    } = this;

    const { storeUid, uid } = storeHomePage || {};

    deleteStoreHomePageWidget(uid, storeUid, {
      type: "category",
      uid: widget.uid,
    });
  };

  handleDelateAllWidgets = () => {
    const {
      props: { deleteStoreHomePageAllWidgets, storeHomePage },
    } = this;

    const { storeUid, uid, widgets } = storeHomePage || {};
    deleteStoreHomePageAllWidgets(uid, storeUid, widgets);
  };

  handleDeleteProduct = (product) => {
    const {
      props: { deleteStoreHomePageProduct, storeHomePage },
    } = this;

    const { storeUid, uid } = storeHomePage || {};

    deleteStoreHomePageProduct({ productUid: product.productUid }, uid, storeUid);
  };

  handleDeleteAllProducts = () => {
    const {
      props: { deleteStoreHomePageAllProducts, storeHomePage },
    } = this;

    const { storeUid, uid, products } = storeHomePage || {};
    deleteStoreHomePageAllProducts(products, uid, storeUid);
  };

  handleActionBanner = (action: string) => {
    const {
      state: { bannerPopupTitle, bannerPopupLink, bannerMobImage, bannerDeskImage },
      props: { storeHomePageBannerAction, storeHomePage },
    } = this;

    const { storeUid, uid } = storeHomePage || {};

    storeHomePageBannerAction &&
      storeHomePageBannerAction(
        {
          desktopImageUrl: bannerDeskImage,
          mobileImageUrl: bannerMobImage,
          targetUrl: bannerPopupLink,
          title: bannerPopupTitle,
        },
        uid,
        storeUid,
        action
      );

    this.setState({ isOpenBannerPopup: false });
  };

  getHomepageStore = async () => {
    const { storeId, getStoreHomePage, initStoreHomePage } = this.props;

    if (!storeId) return;

    const homepage: any = await getStoreHomePage(storeId);
    (!homepage || homepage?.status === "PBL") && initStoreHomePage(storeId);
  };

  handleChangeFile = (event, type) => {
    const { files } = event.target;
    if (files && files[0]) {
      const img = files[0];
      this.props.getStoreHomePageFile(img);
      // getStoreHomePage()
      this.setState({
        [type]: URL.createObjectURL(img),
      });
    }
  };

  handleChangeBanner = (banner) => {
    this.setState({
      bannerPopupLink: banner?.targetUrl,
      bannerPopupTitle: banner?.title,
      bannerMobImage: banner?.mobileImageUrl,
      bannerDeskImage: banner?.desktopImageUrl,
    });
  };

  handlePublish = () => {
    const {
      props: { storeHomePagePublish, storeHomePage },
    } = this;

    const { storeUid, uid } = storeHomePage || {};
    storeHomePagePublish(uid, storeUid);
  };

  onPageAfterOut = () => {
    setTimeout(() => {
      const el = document.querySelector("#add-store-panel");
      el && el?.remove();
    }, 0);
  };

  getProducts = async (options: any = {}, set?: boolean) => {
    const productsForStore: any = await this.props.loadDifferenceProducts({
      statuses: ["DRF", "APR", "AFR"],
      ...options,
    });
    set && this.setState({ productsForStore });
    return productsForStore;
  };

  componentDidMount() {
    const { storeId, getStoreCategories, loadMyGoodsList } = this.props;

    loadMyGoodsList();
    this.getHomepageStore();
    this.getProducts(null, true);
    getStoreCategories(storeId);
  }

  render() {
    const {
      state: {
        isOpenWidgetPopup,
        openedCategories,
        selectedCategories,
        isOpenBannerPopup,
        isOpenProductsPopup,
        selectedProducts,
        isMobile,
        isMobileEdit,
        bannerPopupLink,
        bannerPopupTitle,
        bannerMobImage,
        bannerDeskImage,
        productsForStore,
      },
      props: {
        t,
        categories,
        resizeEvent,
        storeHomePage,
        storeHomePageLoading,
        currentStoreCategories,
        categoriesClassificator,
      },
      handleOpenWidgetPopup,
      handleCloseWidgetPopup,
      handleClickCategories,
      handleChangeCategories,
      handleCloseProductsPopup,
      handleOpenProductAddPopup,
      handleAddWidget,
      selectProductHandle,
      handleAddProducts,
      handleDelateAllWidgets,
      handleDeleteWidget,
      handleDeleteProduct,
      handleDeleteAllProducts,
      handleCloseBannerPopup,
      handleOpenBannerPopup,
      handleChangeFile,
      handleActionBanner,
      handleChangeBanner,
      onPageAfterOut,
      handlePublish,
      getProducts,
    } = this;

    const { widgets, products: storeHomepageProducts, banner, status } = storeHomePage || {};
    const filteredCategories = categories.filter((category) => category.id !== "all_filtres");
    const { imageUrl, description, name }: any = currentStoreCategories;
    const mediaMobile: boolean = resizeEvent.width < 768;

    return (
      <Page className="add-store" onPageAfterOut={onPageAfterOut}>
        <LeftPanel
          widgets={widgets}
          banner={banner}
          goBack={() => this.$f7router.back()}
          storeHomepageProducts={storeHomepageProducts}
          handleOpenBannerPopup={handleOpenBannerPopup}
          handleOpenWidgetPopup={handleOpenWidgetPopup}
          handleOpenProductAddPopup={handleOpenProductAddPopup}
          handleDeleteProduct={handleDeleteProduct}
          handleDeleteWidget={handleDeleteWidget}
          handleActionBanner={handleActionBanner}
          handleWidgetPopover={() => {
            this.setState((state: State) => ({
              widgetsPopoverIsOpen: !state.widgetsPopoverIsOpen,
            }));
          }}
          handleProductsPopover={() =>
            this.setState((state: State) => ({
              productsPopoverIsOpen: !state.productsPopoverIsOpen,
            }))
          }
          isPanelShowMobile={!isMobileEdit}
        />
        <Navbar className="add-store-nav-bar" noShadow noHairline>
          {mediaMobile && (
            <NavLeft>
              <Block className="add-store-panel-close">
                <Button
                  onClick={() => {
                    !isMobileEdit ? this.$f7router.back() : this.setState({ isMobileEdit: false });
                  }}
                >
                  {!isMobileEdit ? <IcClose /> : <Icon className="icon-back" />}
                </Button>
              </Block>
            </NavLeft>
          )}
          <NavRight>
            <Button
              className="store-resolution-button"
              onClick={() =>
                this.setState((state: State) =>
                  mediaMobile && !isMobileEdit
                    ? {
                        isMobileEdit: !state.isMobileEdit,
                        isMobile: !state.isMobile,
                      }
                    : { isMobile: !state.isMobile }
                )
              }
            >
              {mediaMobile && !isMobileEdit ? <IcEye /> : isMobile ? <IcComputer /> : <IcPhone />}
            </Button>
            <Button className="add-store-nav-bar-publish" round fill large onClick={handlePublish}>
              {status === "DRF" ? "Publish" : "Publish changes"}
            </Button>
          </NavRight>
        </Navbar>
        {storeHomePageLoading ? (
          <Preloader />
        ) : (
          <Block className={`add-store-container ${isMobile ? "mobile" : ""}`}>
            <Row className="add-store-row send-message">
              <div className="add-store-row-box">
                <span
                  className="add-store-row-box-img"
                  style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : null}
                />
                <div>
                  <h2>{name}</h2>
                  <span>{description}</span>
                </div>
              </div>
              <div className="add-store-row-send-message">
                <Button round>
                  <IcMessages fill="#bcbcbc" />
                  {t("Send Message")}
                </Button>
              </div>
            </Row>
            <Row className="add-store-row">
              <StoreNav selectedMenu="homepage" onlyHomepage />
            </Row>

            <Block className="add-store-content">
              {!widgets && !storeHomepageProducts && !banner && (
                <p className="add-store-content-homepage-empty">{t("Homepage is empty")}</p>
              )}
              <div className="add-store-content-homepage active">
                {banner && (
                  <div className="add-store-content-homepage-banner">
                    <img src={isMobile ? banner.mobileImageUrl : banner.desktopImageUrl} alt="" />
                  </div>
                )}
                {!!widgets && (
                  <div className="add-store-content-homepage-widgets">
                    {widgets.map((widget) => (
                      <PageSlider
                        key={widget.uid}
                        category={widget.category}
                        title={widget.categoryName}
                        getProducts={getProducts}
                      />
                    ))}
                  </div>
                )}
                {storeHomepageProducts?.length && (
                  <div className="add-store-content-homepage-products">
                    <BlockTitle medium>{t("Popular Products")}</BlockTitle>
                    <StoreCatalog items={storeHomepageProducts} />
                  </div>
                )}
              </div>
            </Block>
          </Block>
        )}
        <AddBannerPopup
          banner={banner}
          isOpenBannerPopup={isOpenBannerPopup}
          handleCloseBannerPopup={handleCloseBannerPopup}
          title={bannerPopupTitle}
          link={bannerPopupLink}
          bannerMobImage={bannerMobImage}
          bannerDeskImage={bannerDeskImage}
          handleChangeFile={handleChangeFile}
          handleChangeTitle={(bannerPopupTitle) => this.setState({ bannerPopupTitle })}
          handleChangeLink={(bannerPopupLink) => this.setState({ bannerPopupLink })}
          handleActionBanner={handleActionBanner}
          handleChangeBanner={handleChangeBanner}
        />
        <AddWidgetPopup
          isOpenWidgetPopup={isOpenWidgetPopup}
          filteredCategories={filteredCategories}
          selectedCategories={selectedCategories}
          openedCategories={openedCategories}
          handleCloseWidgetPopup={handleCloseWidgetPopup}
          handleChangeCategories={handleChangeCategories}
          handleClickCategories={handleClickCategories}
          categoriesClassificator={categoriesClassificator}
          handleAddWidget={handleAddWidget}
        />
        <AddProductPopup
          products={productsForStore}
          selectedProducts={selectedProducts}
          isOpenProductsPopup={isOpenProductsPopup}
          handleAddProducts={handleAddProducts}
          selectProductHandle={selectProductHandle}
          handleCloseProductsPopup={handleCloseProductsPopup}
        />
        <Popover
          className="widget-popover store-homepage-popover"
          onPopoverClose={() => this.setState({ widgetsPopoverIsOpen: false })}
          backdrop={false}
        >
          <Block>
            <Button popoverClose onClick={handleDelateAllWidgets}>
              <IcRemove fill="var(--base-80)" />
              {t("Delete All")}
            </Button>
          </Block>
        </Popover>
        <Popover
          className="products-popover store-homepage-popover"
          onPopoverClose={() => this.setState({ productsPopoverIsOpen: false })}
          backdrop={false}
        >
          <Block>
            <Button popoverClose onClick={handleDeleteAllProducts}>
              <IcRemove fill="var(--base-80)" />
              {t("Delete All")}
            </Button>
          </Block>
        </Popover>
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  storeWidget: state.storeReducer.storeWidget,
  currentStoreCategories: state.storeReducer.currentStoreCategories,
  currentStoreCategoriesLoading: state.storeReducer.currentStoreCategoriesLoading,
  storeProductsLoading: state.storeReducer.storeProductsLoading,
  resizeEvent: state.rootReducer.resizeEvent,
  storeHomePage: state.storeHomePageReducer.storeHomePage,
  storeHomePageLoading: state.storeHomePageReducer.storeHomePageLoading,
  ...state.myGoodsReducer,
  profile: getProfile(state),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      loadMyGoodsList,
      loadDifferenceProducts,
      getStoreHomePageFile,
      getStoreHomePage,
      initStoreHomePage,
      getStoreCategories,
      storeHomePagePublish,
      addStoreHomePageWidget,
      addStoreHomePageProduct,
      storeHomePageBannerAction,
      deleteStoreHomePageWidget,
      deleteStoreHomePageProduct,
      deleteStoreHomePageAllWidgets,
      deleteStoreHomePageAllProducts,
    },
    dispatch
  ),
});

export default compose(
  withTranslation(),
  connectCategories,
  connectCategoriesClassificator,
  connect(mapStateToProps, mapDispatchToProps)
)(StoreHomePage);
