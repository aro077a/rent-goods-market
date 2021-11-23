import React, { Component } from "react";
import ReactDOM from "react-dom";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import cn from "classnames";
import {
  Block,
  BlockTitle,
  Chip,
  Col,
  Icon,
  Link,
  List,
  ListItem,
  Navbar as F7Navbar,
  NavRight,
  Page,
  Popup,
  Row,
  Sheet,
} from "framework7-react";
import HaversineGeolocation from "haversine-geolocation";
import { compose } from "redux";

import { chooseCategory } from "@/actions/filterActions";
import {
  addToWishList,
  ISearchParams,
  loadProductDetail,
  loadProductListType,
  loadProductWishList,
  searchClear,
  searchProducts,
} from "@/actions/productActions";
import { goToMessenger, isProductInWish } from "@/actions/profileActions";
import { getProductDetailsLink } from "@/actions/shareActions";
import { AboutPopup } from "@/components/AboutPopup";
import { AddWishButton } from "@/components/AddWishButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Catalog } from "@/components/Catalog/index";
import { CategoriesMenuDesktop } from "@/components/categories-menu-desktop";
import { ContactSupportPopup } from "@/components/ContactSupportPopup";
import Map from "@/components/Map";
import { Navbar } from "@/components/navbar";
import { PopoverButton } from "@/components/PopoverButton";
import { PopoverList } from "@/components/PopoverList";
import { Price } from "@/components/Price/index";
import { ProductCategoryInfo } from "@/components/ProductCategoryInfo";
import { DescriptionDetails, TechnicalDetails } from "@/components/ProductDetails";
import { ProfileLink } from "@/components/ProfileLink";
import { ProfilePopover } from "@/components/ProfilePopover";
import { ShareButton } from "@/components/ShareButton";
import { SharePopup } from "@/components/SharePopup";
import { Slider, SliderItem, SliderType } from "@/components/Slider";
import { StartChat } from "@/components/StartChat";
import { ThemedButton } from "@/components/ThemedButton";
import Translation from "@/components/Translation/Translation";
import { VerifyAccountPopup } from "@/components/VerifyAccountPopup";
import { VideoPlayer } from "@/components/VideoPlayer";
import { IcMessage, IcMessageNew } from "@/components-ui/icons";
import { ICategoryClassificator } from "@/reducers/categoryReducer";
import { IProduct, IProductState, ProductListType } from "@/reducers/productReducer";
import { Profile } from "@/reducers/sessionReducer";
import { getProfile } from "@/selectors/profile";
import { analytics } from "@/Setup";
import connectCart, { ICartProps } from "@/store/connectCart";
import connectCategories from "@/store/connectCategories";
import connectCategoriesClassificator from "@/store/connectCategoriesClassificator";
import connectChat, { IChatProps } from "@/store/connectChat";
import connectFilter from "@/store/connectFilter";
import connectSearch, { SearchConnectorProps } from "@/store/connectSearch";
import connectShare, { IShareProps } from "@/store/connectShare";
import { IApplicationStore, ResizeEvent } from "@/store/rootReducer";
import { Country } from "@/types/commonapi";
import { DeliveryMethod, ProductRentOptions } from "@/types/marketplaceapi";
import { createProductUrl, detectLocation, formatPrice } from "@/utils";

import AddToCartSheetPage from "./product-details-add-to-cart__sheet";

import "./categories.less";
import "./product-details.less";

type Props = WithTranslation &
  IChatProps &
  IShareProps &
  ICartProps &
  SearchConnectorProps & {
    uid?: string;
    productDetailsLoading?: boolean;
    productDetailsLoadingError?: any;
    item?: IProduct;
    categoriesClassificator?: ICategoryClassificator[];
    wishList?: IProduct[];
    addToWish?(uid?: string): void;
    updatingProfile?: boolean;
    loadProductDetail?(uid: string): Promise<IProduct>;
    profile?: Profile;
    loadProductWishList?(): () => Promise<void>;
    entryDirect?: boolean;
    resizeEvent?: ResizeEvent;
    goToMessenger?(): void;
    chooseCategory?(catid?: string | null): void;
    countryClassificator: Country[];
    country?: Country;
    loadProducts?(type: ProductListType): void;
    productState?: IProductState;
    logged: boolean;
  };

type State = {
  searchBarEnable?: boolean;
  selectCategorySheetOpened?: boolean;
  categoriesMenuOpened?: boolean;
  profilePopoverOpened?: boolean;
  sortingMenuPopoverOpened?: boolean;
  addToCartSheetOpened?: boolean;
  addToCartSheetItemCount?: number;
  addToCartStepperInit?: boolean /* bug with Stepper */;
  loginPopupOpened?: boolean;
  registerPopupOpened?: boolean;
  contactSupportPopupOpened?: boolean;
  userLatLng?: any;
  startChatSheetOpened?: boolean;
  startChatPopupOpened?: boolean;
  sliderZoom: boolean;
  activeSlideIndex: number;
  translated: boolean;
  aboutPopupOpened?: boolean;
  verifyAccountPopupOpened?: boolean;
  sheetPopoverIsOpen: boolean;
  addedInCard: boolean;
};

const latLng = {
  latitude: 0,
  longitude: 0,
};

const addToCartItemDefaultState = {
  addToCartSheetItemCount: 1,
  addToCartStepperInit: false,
};

const deliveryKeysTitles = {
  shippingAllowed: "Shipping allowed",
  pickupAllowed: "Pick up allowed",
  returnAccepted: "Return allowed",
};

const containerStyle = {
  position: "relative",
  width: "100%",
  height: "526px",
};

class ProductDetailsPage extends Component<
  Props,
  {
    playVideoSheetOpened?: boolean;
    videoId?: string;
    videoType?: string;
    imageHoveredItemImageSwitcher?: number;
    openedFromCart?: boolean;
  } & State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      playVideoSheetOpened: false,
      addToCartSheetOpened: false,
      openedFromCart: false,
      loginPopupOpened: false,
      registerPopupOpened: false,
      contactSupportPopupOpened: false,
      startChatSheetOpened: false,
      startChatPopupOpened: false,
      userLatLng: latLng,
      sliderZoom: false,
      activeSlideIndex: 1,
      translated: true,
      aboutPopupOpened: false,
      verifyAccountPopupOpened: false,
      sheetPopoverIsOpen: false,
      addedInCard: false,
      ...addToCartItemDefaultState,
    };
  }

  pageInitHandle = () => {
    const filteredRoutes = this.$f7router.history.filter((item) => item !== this.$f7route.path);

    if (filteredRoutes.length && filteredRoutes[filteredRoutes.length - 1] === "/cart/") {
      this.setState({ openedFromCart: true });
    }
  };

  pageAfterInHandle = () => {
    const { addedInCard } = this.state;
    addedInCard && this.setState({ addedInCard: false });
    this.loadProductDetails();
  };

  getSellerProducts = (sellerUid: string) => {
    const { search } = this.props;
    if (!sellerUid) return;

    search({
      sellerUid,
      count: 10,
      offset: 0,
      resetSorting: true,
      resetSearch: true,
    });
  };

  async componentDidMount() {
    const location = await detectLocation();
    if (location.latitude !== 0 && location.longitude !== 0) {
      this.setState({
        userLatLng: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });
    }

    this.$f7ready((f7) => {
      f7.once("pageInit", () => {
        // ! WAS: const url = this.props.$f7router.url;
        const url = this.$f7router.currentRoute.url;

        if (url.includes("store")) return;

        this.props.search({
          clear: true,
        });
      });
    });
  }

  async componentDidUpdate(prevProps: Props) {
    const { item, productDetailsLoading, productDetailsLoadingError, loadProductWishList } =
      this.props;

    this.handleChatErrors(prevProps);
    this.handleShareErrors(prevProps);

    if (!productDetailsLoading && !item && !productDetailsLoadingError) {
      loadProductWishList();
      this.loadProductDetails();
    } else if (prevProps.productDetailsLoadingError !== productDetailsLoadingError) {
      this.$f7.dialog.alert(productDetailsLoadingError);
      console.log(productDetailsLoadingError);
    }
  }

  handleChatErrors = (prevProps: Props) => {
    const { error } = this.props.chatReducer;
    if (error && error !== prevProps.chatReducer.error) {
      this.$f7?.dialog.alert(error);
    }
  };

  handleShareErrors = (prevProps: Props) => {
    const { error } = this.props.shareStore;
    if (error && error !== prevProps.shareStore.error) {
      this.$f7?.dialog.alert(error);
    }
  };

  loadProductDetails = async () => {
    const { uid, loadProducts } = this.props;
    const data = await this.props.loadProductDetail(uid);
    this.getSellerProducts(data?.sellerUid);
    if (this.props.logged) {
      loadProducts("recently_viewed");
    }
  };

  addToWish = () => {
    const { logged, profile, item, uid } = this.props;

    if (logged && !this.isAddedToWishList()) {
      analytics.addToWishList(profile, item);
    }

    this.props.addToWish(uid);
  };

  addToCart = (count, isMobile: boolean) => {
    const { profile, item } = this.props;
    this.props.cartAdd(item.uid, count);
    if (isMobile) {
      this.setState({ addToCartSheetOpened: false });
    } else {
      this.setState({ ...addToCartItemDefaultState });
    }
    if (profile && profile.uid !== null) {
      analytics.addToCart(profile, item, count);
    }
  };

  isAddedToWishList = () => {
    const { uid, wishList } = this.props;
    return !!wishList.find((item) => item.uid === uid);
  };

  getProductImagesSlides = (): SliderItem[] => {
    const { item } = this.props;
    const thumbnails = Object.keys(item)
      .filter((item) => item.startsWith("imageThumbnailUrl"))
      .map((key) => item[key]);

    return item.images.map((image, i) => ({ image, small: thumbnails[i] })) || [];
  };

  renderAddressBlock = () => {
    const {
      item: { address, coordinates },
      t,
    } = this.props;
    const { userLatLng } = this.state;

    if (!address) return null;

    let addressString = "";
    try {
      if (address.countryCode) addressString = address.countryCode;
      if (address.city) addressString = addressString + (addressString ? ", " : "") + address.city;
    } catch (err) {
      console.error("at product-details in renderAddressBlock", err);
    }

    function toLatLgnLiteral(coordinates: string) {
      try {
        const arr = coordinates.split(",");
        return { lat: parseFloat(arr[0]), lng: parseFloat(arr[1]) };
      } catch (err) {
        console.error("at product-details in toLatLgnLiteral", err);
      }
      return { lat: 0, lng: 0 };
    }

    function distance() {
      const latLng = toLatLgnLiteral(coordinates);
      if (
        userLatLng.latitude === 0 ||
        userLatLng.longitude === 0 ||
        latLng.lat === 0 ||
        latLng.lng === 0
      ) {
        return <></>;
      }

      const productLatLng = {
        latitude: latLng.lat,
        longitude: latLng.lng,
      };

      const distance = HaversineGeolocation.getDistanceBetween(userLatLng, productLatLng);
      if (distance > 0) {
        return (
          <>
            <span className="distance">
              {distance} {t("km")}
            </span>
          </>
        );
      }

      return <></>;
    }

    return (
      <Block className="location-label-block">
        {this.props.resizeEvent.width <= 768 && <BlockTitle>{t("Location")}</BlockTitle>}
        <div className="location-label">
          <i className="icon ic-location" />
          {addressString && <span className="address">{addressString}</span>}
          {distance()}
        </div>
        {coordinates && (
          <div className="location-label-block-map">
            <Map
              containerStyle={containerStyle}
              zoom={12}
              center={toLatLgnLiteral(coordinates)}
              zoomControl
            />
          </div>
        )}
      </Block>
    );
  };

  startChatHandle = async (message: string) => {
    const { item } = this.props;
    if (!item?.sellerPhone) {
      this.$f7?.dialog.alert("Seller phone not found!");
      return;
    }
    this.props.startChatWithProduct(item, message);
    analytics.startChatWithSeller(this.props.profile, this.props.item);
    this.setState({
      startChatPopupOpened: false,
      startChatSheetOpened: false,
    });
  };

  startChatMessage = () => {
    const { item, t } = this.props;
    const productUrl = createProductUrl(item.uid);
    return t("ChatMessageProduct", { productUrl });
  };

  reportAdvertisementHandle = () => {
    this.setState({ contactSupportPopupOpened: true });
  };

  handleOpenAddToCartSheetClick = () =>
    this.setState({
      ...addToCartItemDefaultState,
      addToCartStepperInit: true,
      addToCartSheetOpened: true,
      addedInCard: false,
    });

  handleAddToCartClick = () => {
    this.setState({ addToCartSheetOpened: false });
  };

  renderBottomImageSwitcher = (imagesItems: any[]) => {
    if (imagesItems.length === 1) return null;

    return (
      <Block className="image-switcher">
        {imagesItems.slice(0, 5).map((item, i) => {
          return (
            <div
              key={i.toString()}
              className="image-switcher-item"
              onMouseOver={() =>
                this.setState({
                  imageHoveredItemImageSwitcher: i,
                })
              }
            >
              {item.videoId ? (
                <i className="icon material-icons">play_circle_filled</i>
              ) : (
                <img src={item.small} />
              )}
            </div>
          );
        })}
      </Block>
    );
  };

  renderRentInfo(mobile: boolean): JSX.Element {
    const { item, t } = this.props;

    return !item.purchasable ? (
      <Block className={cn("product-details-rent-info", { mobile })}>
        <p>{`${formatPrice(item?.rentOptions?.deposit, item.currencyCode, false)} ${t(
          "Deposit"
        )}`}</p>
        <p>{`${t("Rent for at least")} ${item?.rentOptions?.minPeriod} ${t(
          item?.rentOptions?.period as unknown as string
        ).toLowerCase()}`}</p>
      </Block>
    ) : null;
  }

  renderShippingInfo(): JSX.Element {
    const { item, country, t } = this.props;

    if (item.type === "S") {
      return null;
    }

    if (!item.shippingAllowed && !item.pickupAllowed) {
      return null;
    }

    let text = "";
    const countryCode = country ? country.code : "_______";
    const deliveryMethods = item.deliveryMethods || [];
    const byCountry = deliveryMethods.filter((m) =>
      m.options
        ? !!m.options.filter(
            (o) =>
              (o.countries && !!o.countries.filter((c) => c.code === countryCode).length) ||
              (o.pickupAddress && o.pickupAddress.countryCode === countryCode)
          ).length
        : false
    );

    const pickupPoints = byCountry.filter((m) => m.type === DeliveryMethod.TypeEnum.PICKUP);

    if (!deliveryMethods.length) {
      text = t("Contact the seller to discuss shipping details");
    } else if (deliveryMethods.length && !byCountry.length && !pickupPoints.length) {
      text = t("No delivery to selected country");
    } else {
      const lowestPriceMethod = byCountry
        .filter((m) => m.type === DeliveryMethod.TypeEnum.DELIVERY)
        .sort(
          (a, b) =>
            (a.options && a.options.length
              ? a.options
                  .filter((o) => o.countries.filter((c) => c.code === countryCode).length)
                  .sort((a, b) => a.price - b.price)[0].price
              : 0) -
            (b.options && b.options.length
              ? b.options
                  .filter((o) => o.countries.filter((c) => c.code === countryCode).length)
                  .sort((a, b) => a.price - b.price)[0].price
              : 0)
        )[0];

      if (lowestPriceMethod && lowestPriceMethod.options && lowestPriceMethod.options.length) {
        const lowestPriceOption = lowestPriceMethod.options[0];
        text = `+ ${t("Shipping price", {
          price: formatPrice(lowestPriceOption.price, item.currencyCode),
        })}`;
      } else if (pickupPoints[0]) {
        const point = pickupPoints[0];
        if (point.options && point.options[0]) {
          const option = point.options[0];
          text = Object.keys(option.pickupAddress)
            .filter((key) => "postalCode, countryCode, city, firstAddressLine".includes(key))
            .map((key) => option.pickupAddress[key])
            .filter((field) => !!field)
            .join(", ");
        }
      }
    }

    return <div className="shipping-info">{text}</div>;
  }

  renderQtyPopover = (): JSX.Element => {
    const {
      state: { sheetPopoverIsOpen, addToCartSheetItemCount },
      props: {
        item: { quantity, type },
        t,
      },
    } = this;

    const isInfinityType: boolean = type === "I";
    const isServiceType: boolean = type === "S";
    const isPType: boolean = type === "P";
    const itemCount = isServiceType ? 10 : isInfinityType ? 999 : quantity;

    return (
      !(quantity < 1 && isPType) && (
        <div className="popover-qty">
          <PopoverButton
            value={addToCartSheetItemCount}
            text={t(`Qty`)}
            popoverOpen=".popover-qty-menu"
            onChange={this.handleSheetChange}
            onClick={() => this.setState({ sheetPopoverIsOpen: true })}
            quantity={quantity}
            itemType={type}
          />
          <PopoverList
            text={`${t("Available")}: ${itemCount}`}
            className="popover-qty-menu"
            popoverQty={itemCount}
            selectedValue={addToCartSheetItemCount}
            onChange={this.handleSheetChange}
            popoverIsOpen={sheetPopoverIsOpen}
            onClick={() => this.setState({ sheetPopoverIsOpen: false })}
            itemType={type}
          />
        </div>
      )
    );
  };

  setSliderZoom = (value) => {
    this.setState({ sliderZoom: value });
  };

  handleShareProduct = () => {
    const { item, profile } = this.props;
    analytics.shareProduct(profile, item);
    this.props.share(item.name, getProductDetailsLink(item.uid));
  };

  handleTranslate = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        translated: !prevState.translated,
      };
    });
  };

  renderHashTags = () => {
    const { item, t } = this.props;
    let tags = [];
    if (item && item.hashtags) {
      const tagsText = item.hashtags
        .replaceAll(" #", ",")
        .replaceAll("#", "")
        .replaceAll(", ", ",")
        .replaceAll(". ", ",");
      if (tagsText.indexOf(",") !== -1) {
        tags = tagsText.split(",");
      }
    }

    return tags.length ? (
      <>
        <BlockTitle className="tags-title">{t("Tags")}</BlockTitle>
        <Block className="product-details-left-side-tags">
          {tags.map(
            (item, index) =>
              item && (
                <div className="tag-item" key={index}>
                  <Chip text={`#${item}`} />
                </div>
              )
          )}
        </Block>
      </>
    ) : null;
  };

  handleSheetChange = (value) => this.setState({ addToCartSheetItemCount: value });

  handelClickChat = () => {
    this.props.resizeEvent.width > 629
      ? this.setState({ startChatPopupOpened: true })
      : this.setState({ startChatSheetOpened: true });
  };

  renderProductDetails = () => {
    const { t, entryDirect } = this.props;
    const { sliderZoom, translated } = this.state;
    let { item } = this.props;

    if (!item) return <Block></Block>;

    if (!translated && item.localizations) {
      const { originalLanguageCode, category, localizations } = item;

      const originalLanguage = localizations.find((item) => item.language === originalLanguageCode);

      item = {
        ...item,
        ...originalLanguage,
        category,
      };
    }

    const {
      video,
      purchasable,
      category,
      price,
      discountedPrice,
      currencyCode,
      name,
      description,
      localizations,
      store,
      seller,
      rentOptions,
    } = item;
    let imagesItems = this.getProductImagesSlides();

    if (video) {
      /* Video must be first */
      imagesItems = [{ videoId: video.id, videoType: video.type.toString() }, ...imagesItems];
    }

    const handleClickZoomSlider = (e) => {
      const { className } = e.target;

      if (
        className.indexOf("swiper-button-next") !== -1 ||
        className.indexOf("swiper-button-prev") !== -1
      ) {
        return;
      }

      !sliderZoom && this.setSliderZoom(true);
    };

    let image;
    if (store && store.imageUrl) {
      image = store.imageUrl;
    } else if (seller && seller.imageUrl) {
      image = seller.imageUrl;
    }

    return (
      <Row className="product-details-row">
        <Col width="100" className="pure-hidden-xs">
          <F7Navbar
            title=""
            backLink={entryDirect ? false : t("Back").toString()}
            noHairline
            noShadow
          >
            <Breadcrumbs categoryCode={category} handleBackToMain={this.onClickLogoLink} />
          </F7Navbar>
        </Col>
        <Col className="product-details-left-side" width="60">
          <Block className="no-padding images product-details-left-side-slider">
            <div
              className="product-details-left-side-slider-container"
              onClick={handleClickZoomSlider}
            >
              <Slider
                className="slider-images"
                slides={imagesItems}
                type={SliderType.images}
                videoPlayOnClick={(videoId, videoType) => {
                  this.setState({
                    playVideoSheetOpened: true,
                    videoId,
                    videoType,
                  });
                }}
                sliderZoom={sliderZoom}
                changeActiveIndex={(activeSlideIndex) => this.setState({ activeSlideIndex })}
              />
              <div className="pure-hidden-xs">{this.renderBottomImageSwitcher(imagesItems)}</div>
            </div>
          </Block>
          <div className="product-details-left-side-content">
            {/* for small screen*/}
            {this.props.resizeEvent.width <= 768 && (
              <div className="product-details-mobile">
                {localizations && (
                  <Translation translated={translated} onClick={this.handleTranslate} />
                )}
                <Block className="product-details-mobile-add ">
                  <BlockTitle className="product-title">
                    <h2>{name}</h2>
                  </BlockTitle>
                  <div className="buttons-container">
                    <AddWishButton onClick={this.addToWish} active={this.isAddedToWishList()} />
                  </div>
                </Block>

                <Block className="product-details-mobile-price">
                  <Price
                    price={price}
                    discountedPrice={discountedPrice}
                    currencyCode={currencyCode}
                    period={rentOptions?.period}
                  />

                  {this.props.item?.rentOptions
                    ? this.renderRentInfo(true)
                    : this.renderShippingInfo()}

                  <div className="toolbar-container product-details-mobile-actions">
                    {purchasable ? (
                      <>
                        {this.renderQtyPopover()}
                        {this.renderAddToCartButton()}
                      </>
                    ) : (
                      <Block slot="fixed" className="add-to-cart-btn-container pure-visible-xs">
                        <ThemedButton
                          large
                          fill
                          round
                          className="product-details-right-send-message"
                          onClick={this.handelClickChat}
                        >
                          <IcMessageNew />
                          {t("Send Message")}
                        </ThemedButton>
                      </Block>
                    )}
                  </div>
                </Block>

                <ProductCategoryInfo item={item} />
              </div>
            )}
            <Block className="product-details-left-side-characteristics">
              <div>
                <TechnicalDetails product={item} />
              </div>
            </Block>

            <Block className="product-details-left-side-delivery">
              {this.renderDeliveryInformationBlock()}
            </Block>

            {item.description && (
              <>
                <BlockTitle>{t("Description")}</BlockTitle>
                <Block className="product-details-left-side-description">
                  <div>
                    <DescriptionDetails
                      text={description}
                      moreLinkText={t("More")}
                      lessLinkText={t("Less")}
                      textShow={400}
                    />
                  </div>
                </Block>
              </>
            )}

            {this.renderHashTags()}

            {this.renderAddressBlock()}
            {/* for large screen */}
            {this.props.resizeEvent.width > 768 && (
              <Block className="product-details-left-side-report">
                <p>{t("Do you have any complaints about this product?")}</p>
                <ThemedButton
                  round
                  fill
                  className="report-advertisement-button"
                  onClick={this.reportAdvertisementHandle}
                >
                  {t("Report Advertisement")}
                </ThemedButton>
              </Block>
            )}
          </div>
        </Col>
        <Col width="35" className="product-details-right-side">
          {/* for large screen */}
          {this.props.resizeEvent.width > 768 && (
            <>
              {localizations && (
                <Translation translated={translated} onClick={this.handleTranslate} />
              )}
              <Block className="product-details-right-add-share">
                <BlockTitle className="product-title">
                  <h2>{name}</h2>
                </BlockTitle>
                <div className="buttons-container">
                  <AddWishButton
                    onClick={this.addToWish}
                    active={this.isAddedToWishList()}
                    text={t(this.isAddedToWishList() ? "Added to wishlist" : "Add to wishlist")}
                  />
                  {/*<ShareButton onClick={this.handleShareProduct} text={t("Share")} />*/}
                  <SharePopup uid={item.uid} text="share" />
                </div>
              </Block>

              <Block className="product-details-right-price">
                <Block className="product-details-right__price-with-info">
                  <Price
                    price={price}
                    discountedPrice={discountedPrice}
                    currencyCode={currencyCode}
                    period={rentOptions?.period}
                  />

                  {this.props.item?.rentOptions
                    ? this.renderRentInfo(false)
                    : this.renderShippingInfo()}
                </Block>

                <div className="toolbar-container product-details-right-actions">
                  {purchasable ? (
                    <>
                      {this.renderQtyPopover()}
                      {this.renderAddToCartButton()}
                    </>
                  ) : (
                    <ThemedButton
                      round
                      fill
                      className="product-details-right-send-message"
                      onClick={this.handelClickChat}
                    >
                      <IcMessageNew />
                      {t("Send Message")}
                    </ThemedButton>
                  )}
                </div>
              </Block>

              <ProductCategoryInfo item={item} />
            </>
          )}

          <Block className="product-details-right-seller">
            {this.props.resizeEvent.width <= 768 && <BlockTitle>{t("Seller")}</BlockTitle>}
            <div className="product-details-right-seller-block">
              <div className="product-details-right-seller-block-info">
                {image ? (
                  <img className="product-details-right-seller-block-info-img" src={image} />
                ) : (
                  <Icon material="account_circle" />
                )}
                <div>
                  <p>{store ? store.name : seller.name ? seller.name : seller.uid}</p>
                  <span>{t("Last seen recently")}</span>
                </div>
              </div>
              {!this.props.chatReducer.loading && (
                <div
                  className="product-details-right-seller-block-chat"
                  onClick={this.handelClickChat}
                >
                  <IcMessage />
                </div>
              )}
            </div>
          </Block>
          {/* for small screen */}
          {this.props.resizeEvent.width <= 768 && (
            <Block className="product-details-left-side-report mobile">
              <p>{t("Do you have any complaints about this product?")}</p>
              <ThemedButton
                round
                fill
                className="report-advertisement-button"
                onClick={this.reportAdvertisementHandle}
              >
                {t(`${this.props.resizeEvent.width > 567 ? "Report Advertisement" : "Report Ad"}`)}
              </ThemedButton>
            </Block>
          )}
          {sliderZoom &&
            ReactDOM.createPortal(
              <div className="slider-zoom-modal">
                <div className="slider-zoom-modal-container">
                  <div
                    className="slider-zoom-modal-container-head"
                    onClick={() => this.setSliderZoom(false)}
                  >
                    <span className="slider-zoom-modal-container-head-window">{item.name}</span>
                    <Icon material="close" className="slider-zoom-modal-container-head-close" />
                    <span className="slider-zoom-modal-container-head-mobile">
                      {this.state.activeSlideIndex} from {imagesItems.length}
                    </span>
                    <Icon material="arrow_back" className="slider-zoom-modal-container-head-back" />
                  </div>
                  <Slider
                    className="slider-images"
                    slides={imagesItems}
                    type={SliderType.images}
                    videoPlayOnClick={(videoId, videoType) => {
                      this.setState({
                        playVideoSheetOpened: true,
                        videoId,
                        videoType,
                      });
                    }}
                    sliderZoom={sliderZoom}
                    changeActiveIndex={(activeSlideIndex) => this.setState({ activeSlideIndex })}
                  />
                </div>
              </div>,
              document.getElementById("app")
            )}
        </Col>
      </Row>
    );
  };

  renderDeliveryInformationBlock() {
    const { item, t } = this.props;
    const deliveryInfoKeys: (keyof Pick<
      typeof item,
      "shippingAllowed" | "pickupAllowed" | "returnAccepted"
    >)[] = ["shippingAllowed", "returnAccepted", "pickupAllowed"];

    const items = deliveryInfoKeys
      .map((key) => {
        return (
          item[key] && (
            <ListItem key={key}>
              <div slot="media">{item[key] && <Icon material="checkmark_alt" />}</div>
              <div slot="title">{t(deliveryKeysTitles[key])}</div>
            </ListItem>
          )
        );
      })
      .filter((item) => !!item);

    return (
      !!items.length && (
        <>
          <BlockTitle>{t("Delivery Information")}</BlockTitle>
          <List noChevron noHairlines mediaList className="delivery-info">
            {items}
          </List>
        </>
      )
    );
  }

  renderProfileLink = () => {
    const { profile } = this.props;
    return (
      <ProfileLink
        key="profile_link"
        profile={profile}
        href="#"
        onClick={this.handleClickProfileLink}
      />
    );
  };

  handleClickProfileLink = () => {
    this.setState({ profilePopoverOpened: true });
  };

  renderAddToCartButton() {
    const { item, t, resizeEvent } = this.props;
    const { addToCartSheetItemCount, addedInCard } = this.state;
    if (!item) return null;

    const forMobile = resizeEvent.width <= 567;
    const sheetCount = addToCartSheetItemCount === "input" ? "1" : addToCartSheetItemCount;
    const handler = forMobile
      ? this.handleOpenAddToCartSheetClick
      : () => this.addToCart(sheetCount, forMobile);

    if (forMobile) {
      return (
        <Block slot="fixed" className="add-to-cart-btn-container pure-visible-xs">
          {addedInCard ? (
            <ThemedButton href="/cart/" large fill round>
              <>
                <Icon material="done" />
                {t("In Your Cart")}
              </>
            </ThemedButton>
          ) : (
            <ThemedButton large fill round onClick={handler}>
              {t("Add to cart")}
            </ThemedButton>
          )}
        </Block>
      );
    }

    return (
      <div className="add-to-cart-btn-container">
        <ThemedButton large fill round onClick={handler}>
          {t("Add to cart")}
        </ThemedButton>
      </div>
    );
  }

  onClickLogoLink = () => {
    this.$f7.searchbar.disable(".search-bar");
    this.props.chooseCategory(null);
    this.props.clearSearch();
    this.$f7router.navigate("/");
  };

  onClickOpenCategoriesMenu = () =>
    this.setState({
      categoriesMenuOpened: !this.state.categoriesMenuOpened,
    });

  searchbarEnableHandle = () => {
    this.setState({ searchBarEnable: true });
  };

  searchbarDisableHandle = () => {
    this.setState({ searchBarEnable: false }, () => {
      this.props.clearSearch();
    });
  };

  searchbarClearHandle = () => {
    this.props.clearSearch();
  };

  getSlidesPopularProducts = (data: IProduct[]): SliderItem[] => {
    return data?.map((item) => {
      const href = `/product-details/${item.uid}/`;
      return {
        ...item,
        image: item.imageUrl1,
        priceDiscount: item.discountedPrice,
        onClick: () => this.$f7router.navigate(href),
        description: item.shortDescription,
      };
    });
  };

  render() {
    const {
      entryDirect,
      t,
      resizeEvent,
      item,
      profile,
      searchedProducts,
      productState: { productTypeGroups },
    } = this.props;
    const { playVideoSheetOpened, videoId, videoType } = this.state;
    const isMobile = resizeEvent.width < 769;
    const recentlyViewed =
      productTypeGroups?.find((data) => data.type === "recently_viewed")?.products || [];

    console.log("item", item);
    return (
      <Page
        id="product_details"
        name="product-details"
        onPageAfterIn={this.pageAfterInHandle}
        subnavbar={resizeEvent.width < 769}
      >
        <Navbar
          product={item}
          profile={profile}
          showCartLink
          showProfileLink={!isMobile}
          onClickProfileLink={this.handleClickProfileLink}
          onClickLogoLink={this.onClickLogoLink}
          onClickOpenCategoriesMenu={this.onClickOpenCategoriesMenu}
          openCategoriesMenuButton={this.state.categoriesMenuOpened}
          showLanguageLink={false}
          onSearchbarEnable={this.searchbarEnableHandle}
          onSearchbarDisable={this.searchbarDisableHandle}
          onSearchClickClear={this.searchbarClearHandle}
          findedProducts={this.props.searchProductsAutocomplete}
          findProductLoading={this.props.searchLoadingAutocomplete}
          onFindedProductItemClick={(uid) => this.$f7router.navigate(`/product-details/${uid}/`)}
          showMessengerButton
          onClickGoToMessenger={this.props.goToMessenger}
          backLink={isMobile && t("Back").toString()}
          onReportAdvertisementClick={this.reportAdvertisementHandle}
          slot="fixed"
          showShare
        />

        {this.renderProductDetails()}

        <Row className="catalog-block">
          {searchedProducts.length && <BlockTitle>{t("Seller’s Other Products")}</BlockTitle>}
          {resizeEvent.width > 567 && (
            <Catalog
              items={searchedProducts}
              addToWish={this.props.addToWish}
              showFeaturesHiglight
            />
          )}
        </Row>
        {resizeEvent.width <= 567 && (
          <Slider
            slides={this.getSlidesPopularProducts(searchedProducts)}
            type={SliderType.small}
            // showIfEmpty
            showFeaturesHiglight
          />
        )}

        <Row className="catalog-block">
          {recentlyViewed.length && <BlockTitle>{t("Recently Viewed")}</BlockTitle>}
          {resizeEvent.width > 567 && (
            <Catalog items={recentlyViewed} addToWish={this.props.addToWish} showFeaturesHiglight />
          )}
        </Row>

        {resizeEvent.width <= 567 && (
          <Slider
            slides={this.getSlidesPopularProducts(recentlyViewed)}
            type={SliderType.small}
            // showIfEmpty
            showFeaturesHiglight
          />
        )}

        <Popup
          id="play_video_sheet"
          className="play-video-popup"
          swipeToClose
          backdrop
          opened={playVideoSheetOpened && resizeEvent.width >= 768}
          onPopupClosed={() => {
            if (resizeEvent.width >= 768) {
              this.setState({
                playVideoSheetOpened: false,
                videoId: null,
                videoType: null,
              });
            }
          }}
        >
          <Page>
            <F7Navbar title="" bgColor="black">
              <NavRight>
                <Link popupClose>{t("Close")}</Link>
              </NavRight>
            </F7Navbar>
            <VideoPlayer videoId={videoId} videoType={videoType} />
          </Page>
        </Popup>

        <Sheet
          id="play_video_sheet"
          swipeToClose
          backdrop
          opened={playVideoSheetOpened && resizeEvent.width < 768}
          onSheetClosed={() => {
            if (resizeEvent.width < 768) {
              this.setState({
                playVideoSheetOpened: false,
                videoId: null,
                videoType: null,
              });
            }
          }}
        >
          <VideoPlayer videoId={videoId} videoType={videoType} />
        </Sheet>

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

        <AddToCartSheetPage
          opened={this.state.addToCartSheetOpened}
          onSheetClosed={() => this.setState({ addToCartSheetOpened: false })}
          item={item}
          onAddToCartClick={(count) => {
            this.addToCart(count, true);
            this.setState({ addedInCard: true });
          }}
        />

        {item && (
          <ContactSupportPopup
            profile={profile}
            category="Product"
            product={item}
            backdrop={false}
            opened={this.state.contactSupportPopupOpened}
            onPopupClosed={() => this.setState({ contactSupportPopupOpened: false })}
          />
        )}

        {item && (
          <Sheet
            id="start_chat_sheet"
            swipeToClose
            backdrop
            opened={this.state.startChatSheetOpened}
            slot="fixed"
            style={{ height: "auto" }}
          >
            <StartChat
              opened={this.state.startChatSheetOpened}
              productUid={item.uid}
              onClose={() => {
                this.setState({
                  startChatSheetOpened: false,
                });
              }}
              onStartChat={(message) => this.startChatHandle(message)}
            />
          </Sheet>
        )}

        {item && (
          <Popup
            id="start_chat_popup"
            backdrop
            opened={this.state.startChatPopupOpened}
            slot="fixed"
          >
            <StartChat
              opened={this.state.startChatPopupOpened}
              productUid={item.uid}
              onClose={() => {
                this.setState({
                  startChatPopupOpened: false,
                });
              }}
              onStartChat={(message) => this.startChatHandle(message)}
            />
          </Popup>
        )}

        <AboutPopup
          profile={profile}
          backdrop
          opened={this.state.aboutPopupOpened}
          onPopupClosed={() => this.setState({ aboutPopupOpened: false })}
          onContactSupportClick={() => this.setState({ contactSupportPopupOpened: true })}
        />

        <VerifyAccountPopup
          backdrop
          opened={this.state.verifyAccountPopupOpened}
          onPopupClosed={() => this.setState({ verifyAccountPopupOpened: false })}
        />
      </Page>
    );
  }
}
// Helpers
const entryPageNameEqual = (pageName: string, store: IApplicationStore) => {
  return store.rootReducer.entryPageName === pageName;
};

const mapStateToProps = (state: IApplicationStore, props: Props) => {
  const { uid } = props;
  const { productDetails, productDetailsLoading, productDetailsLoadingError } =
    state.productReducer;

  let item = state.productReducer.products.find((item) => item.uid === uid);
  if (!item) {
    const { productTypeGroups } = state.productReducer;
    const group = productTypeGroups.find(
      (item) => !!item.products.find((item) => item.uid === uid)
    );
    if (group) {
      item = group.products.find((item) => item.uid === uid);
    }
  }

  if (!item) {
    const { productsWishList } = state.productReducer;
    item = productsWishList.find((item) => item.uid === uid);
  }

  if (!item) {
    const { products } = state.allGoodsReducer;
    item = products.find((item) => item.uid === uid);
  }

  return {
    productDetailsLoading,
    productDetailsLoadingError,
    item: productDetails && productDetails.uid === uid ? productDetails : item,
    wishList: state.productReducer.productsWishList,
    updatingProfile: state.profileReducer.updating,
    profile: getProfile(state),
    entryDirect: entryPageNameEqual("product-details", state),
    resizeEvent: state.rootReducer.resizeEvent,
    language: state.rootReducer.language,
    countryClassificator: state.classificatorReducer.countryClassificator,
    country: state.customerLocationReducer.country || getProfile({ ...state }).country,
    searchedProducts: state.productReducer.products || [],
    productState: state.productReducer,
    logged: state.sessionReducer.logged,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addToWish: (uid?: string) => dispatch(addToWishList(uid)),
  loadProductDetail: (uid: string) => dispatch(loadProductDetail(uid)),
  loadProductWishList: () => dispatch(loadProductWishList()),
  goToMessenger: () => dispatch(goToMessenger()),
  chooseCategory: (catid?: string) => dispatch(chooseCategory(catid)),
  clearSearch: () => dispatch(searchClear()),
  search: (searchParams: ISearchParams) => dispatch(searchProducts(searchParams)),
  loadProducts: (type: ProductListType) => dispatch(loadProductListType(type)),
});

export default compose(
  withTranslation(),
  connectFilter,
  connectCategories,
  connectChat,
  connectShare,
  connectCart,
  connect(mapStateToProps, mapDispatchToProps),
  connectSearch,
  connectCategoriesClassificator
)(ProductDetailsPage);
