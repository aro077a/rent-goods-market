import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  Page,
  Navbar,
  Block,
  BlockTitle,
  Link,
  NavRight,
  Icon,
  PageContent,
  List,
  ListItem,
  Fab,
  Row,
  Col,
  Chip,
} from "framework7-react";
import { compose } from "redux";
import HaversineGeolocation from "haversine-geolocation";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";

import connectFilter from "@/store/connectFilter";
import connectCategories from "@/store/connectCategories";
import { IApplicationStore } from "@/store/rootReducer";
import { IProduct } from "@/reducers/productReducer";
import connectCategoriesClassificator from "@/store/connectCategoriesClassificator";
import { Price } from "@/components/Price/index";
import { Slider, SliderType, SliderItem } from "@/components/Slider";
import { loadProductDetails, updateProductDraft } from "@/actions/productCreateActions";
import connectChat from "@/store/connectChat";
import connectShare from "@/store/connectShare";
import {
  DescriptionDetails,
  TechnicalDetails,
  CustomDetails,
  AnaliticDetails,
  ProductStatusNotification,
} from "@/components/ProductDetails";
import { ProductStatusBadge } from "@/components/Badges";
import { Product } from "@/types/marketplaceapi";
import { changeProductStatus, updateProductExpirationDate } from "@/actions/productStatusActions";
import { ThemedButton } from "@/components/ThemedButton";
import { Sheet } from "@/components/Sheet";
import { convertISODateToInputDate, getDaysLeft } from "@/utils";
import { ListInput } from "@/components/ListInput";
import { ShareButton } from "@/components/ShareButton";
import { getProductDetailsLink } from "@/actions/shareActions";
import { PromotionDetailsList } from "@/components/PromotionDetailsList";
import ServicePackageDescription from "@/components/ServicePackageList/ServicePackageDescription";
import { createPromotionOrder } from "@/actions/ordersActions";
import { VideoPlayer } from "@/components/VideoPlayer";
import { analytics } from "@/Setup";
import { getProfile } from "@/selectors/profile";
import { ContactSupportPopup } from "@/components/ContactSupportPopup";
import { IcEdit, IcRemove, IcSupport } from "@/components-ui/icons";
import { ProductCategoryInfo } from "@/components/ProductCategoryInfo";
import Map from "@/components/Map";

import { Props, State } from "./MyGoodsProductDetailsPage.types";
import { deliveryKeysTitles, latLng, mapContainerStyle } from "./constants";

import "@/pages/categories.less";

import "./my-goods-product-details.less";

class MyGoodsProductDetailsPage extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      productActionsSheetOpened: false,
      productActionsSheetSubmitted: false,
      enterExtendPublicationDateSheetOpened: false,
      contactSupportPopupOpened: false,
      featureDetailsSheetOpened: false,
      featureDetails: null,
      expirationDate: "",
      formErrors: { expirationDate: "" },
      formValidFields: { expirationDate: false },
      formValid: false,
      sliderZoom: false,
      activeSlideIndex: 1,
      userLatLng: latLng,
    };
  }

  pageAfterInHandle = () => {
    this.loadProductDetails();
  };

  componentDidUpdate(prevProps: Props) {
    const { loading, error } = this.props;

    loading && !prevProps.loading ? this.$f7.preloader.show() : this.$f7.preloader.hide();

    if (error && error !== prevProps.error) {
      this.$f7.dialog.alert(error);
    }

    this.handleChangeProductStatus(prevProps);
  }

  componentWillUnmount() {
    const { item } = this.props;
    this.props.updateProductDraft({ ...item, uid: null }, true);
  }

  handleChangeProductStatus(prevProps: Props) {
    const { loading, error, action } = this.props.productStatusReducer;
    const { item } = this.props;

    if (loading && !prevProps.loading) {
      this.$f7.preloader.show();
    } else if (!loading && prevProps.loading) {
      this.$f7.preloader.hide();
    }

    if (error && error !== prevProps.productStatusReducer.error) {
      this.$f7.dialog.alert(error);
    } else if (
      !loading &&
      prevProps.productStatusReducer.loading &&
      action === "changeStatus" &&
      item.status === Product.StatusEnum.DLT
    ) {
      this.$f7router.back();
    }
  }

  loadProductDetails = () => {
    const { uid } = this.props;
    this.props.loadProductDetails(uid);
  };

  renderActiveFeatures() {
    const {
      t,
      item: { activeFeatures },
    } = this.props;

    const features = activeFeatures
      ? Object.keys(activeFeatures).reduce((prev, curr, _i) => {
          return [...prev, ...activeFeatures[curr]];
        }, [])
      : [];

    return (
      !!features.length && (
        <>
          <BlockTitle>{t("Promotions")}</BlockTitle>
          <Block>
            <PromotionDetailsList items={features} onClickItem={this.handlePromoClick} />
          </Block>
        </>
      )
    );
  }

  getProductImagesSlides = (): SliderItem[] => {
    const { item } = this.props;
    const thumbnails = Object.keys(item)
      .filter((item) => item.startsWith("imageThumbnailUrl"))
      .map((key) => item[key]);

    return item.images.map((image, i) => ({ image, small: thumbnails[i] })) || [];
  };

  handleBlurInput = (e: React.FocusEvent<HTMLInputElement>) => this.handleUserInput(e);

  handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement> & { target: { rawValue: string | null } }
  ) => {
    let { value } = e.target;
    const { rawValue = null } = e.target;
    const name = e.target.name as keyof State;
    // value = rawValue !== null && name !== "expireDate" ? rawValue : value;
    value = rawValue || value;
    this.setState({ [name]: value }, () => this.validateField(name, value));
  };

  handleInputClear = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof State;
    this.setState({ [name]: "" }, () => this.validateField(name, ""));
  };

  validateField = (fieldName: keyof State, value: string) => {
    const formValidFields = this.state.formValidFields;
    const fieldValidationErrors = this.state.formErrors;
    let errorText = "";
    const requiredFieldErrorText = "Please fill out this field.";

    switch (fieldName) {
      case "expirationDate":
        errorText = value.length ? errorText : requiredFieldErrorText;

        if (value.length) {
          const currentDate = new Date();
          const expirationDate = new Date(value);
          currentDate.setHours(expirationDate.getHours());
          currentDate.setMinutes(expirationDate.getMinutes());
          currentDate.setSeconds(expirationDate.getSeconds());
          currentDate.setMilliseconds(expirationDate.getMilliseconds());
          if (currentDate.getTime() > expirationDate.getTime()) {
            errorText = "Expiration date must be greater or equal to the current date";
          }
        }

        fieldValidationErrors.expirationDate = errorText;
        formValidFields.expirationDate = !errorText.length;

        break;
      default:
        break;
    }

    this.setState(
      {
        formErrors: fieldValidationErrors,
        formValidFields,
      },
      this.validateForm
    );
  };

  validateForm = () => {
    this.setState({
      formValid: !this.formHasErrors(this.state.formValidFields),
    });
  };

  formHasErrors = (formValidFields: any) => {
    return Object.keys(formValidFields).some((key) => !formValidFields[key]);
  };

  getErrorMessagesProps = (fieldName: string) => {
    const { t } = this.props;
    return {
      errorMessage: t(this.state.formErrors[fieldName]),
      errorMessageForce: !!this.state.formErrors[fieldName],
    };
  };

  handlePromoClick = (code: string) => {
    const {
      item: { activeFeatures },
    } = this.props;

    const features = activeFeatures
      ? Object.keys(activeFeatures).reduce((prev, curr, _i) => {
          return [...prev, ...activeFeatures[curr]];
        }, [])
      : [];

    const featureDetails = features.filter((item) => item.typeCode === code)[0];
    this.setState({ featureDetailsSheetOpened: true, featureDetails });
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

  handleShareProduct = () => {
    const { item, profile } = this.props;
    analytics.shareProduct(profile, item);
    this.props.share(item.name, getProductDetailsLink(item.uid));
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
      console.error(err);
    }

    function toLatLgnLiteral(coordinates: string) {
      try {
        const arr = coordinates.split(",");
        return { lat: parseFloat(arr[0]), lng: parseFloat(arr[1]) };
      } catch (err) {
        console.error(err);
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
              containerStyle={mapContainerStyle}
              zoom={12}
              center={toLatLgnLiteral(coordinates)}
              zoomControl
            />
          </div>
        )}
      </Block>
    );
  };

  setSliderZoom = (value) => {
    this.setState({ sliderZoom: value });
  };

  renderProductDetails = () => {
    const { item, t, resizeEvent } = this.props;
    const { sliderZoom } = this.state;

    if (!item) return <Block />;

    const { video, name, description } = item;

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

    let imagesItems = this.getProductImagesSlides();
    if (video) {
      /* Video must be first */
      imagesItems = [{ videoId: video.id, videoType: video.type.toString() }, ...imagesItems];
    }

    return (
      <Row className="my-goods-product">
        <Col width="60">
          <Block>
            <ProductStatusNotification item={item} />
          </Block>
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

          <div className="my-goods-product-left-side">
            {/* for small screen*/}
            {resizeEvent.width <= 768 && (
              <div className="my-goods-product-mobile">
                <Block className="my-goods-product-mobile-add ">
                  <BlockTitle className="product-title">
                    <h2>{name}</h2>
                  </BlockTitle>
                </Block>

                <Block className="my-goods-product-status">
                  <ProductStatusBadge status={item.status} />
                </Block>

                <Block>
                  <div className="product-stats">
                    <AnaliticDetails type="view" count={item.viewCount} />
                    <AnaliticDetails type="wish" count={item.wishCount} />
                  </div>
                  <div className="my-goods-product-price">
                    <Price
                      price={item.price}
                      discountedPrice={item.discountedPrice}
                      currencyCode={item.currencyCode}
                    />
                  </div>
                </Block>

                <div className="my-goods-product-mobile-category">
                  <ProductCategoryInfo item={item} />
                </div>
              </div>
            )}

            <TechnicalDetails product={item} />

            <Block className="my-goods-product-left-side-delivery">
              {this.renderDeliveryInformationBlock()}
            </Block>

            {item.description && (
              <>
                <BlockTitle>{t("Description")}</BlockTitle>
                <Block className="my-goods-product-left-side-description">
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
            {this.renderActiveFeatures()}
            {this.renderAddressBlock()}
          </div>
          <div className="pure-visible-xs my-goods-product-action">
            {this.renderActionBottomButtons()}
          </div>
        </Col>

        <Col width="35" className="my-goods-product-right-col">
          <BlockTitle className="title" medium>
            <div style={{ whiteSpace: "normal" }}>
              <div className="my-goods-product-status">
                <ProductStatusBadge status={item.status} />
              </div>
              <h2 className="my-goods-product-title">{item.name}</h2>
            </div>
            {item.status === Product.StatusEnum.PBL && (
              <div className="buttons-container pure-visible-xs">
                <ShareButton onClick={this.handleShareProduct} />
              </div>
            )}
          </BlockTitle>

          <Block>
            <div className="product-stats">
              <AnaliticDetails type="view" count={item.viewCount} />
              <AnaliticDetails type="wish" count={item.wishCount} />
            </div>
            <div className="my-goods-product-price">
              <Price
                price={item.price}
                discountedPrice={item.discountedPrice}
                currencyCode={item.currencyCode}
              />
            </div>
          </Block>

          <CustomDetails product={item} />

          <div className="my-goods-product-category">
            <ProductCategoryInfo item={item} />
          </div>
        </Col>
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
      </Row>
    );
  };

  publishProduct = () => {
    const { profile, item } = this.props;

    this.props.changeProductStatus(item.uid, item.status, Product.StatusEnum.PBL);

    analytics.publishProduct(profile, item);
  };

  renderActionBottomButtons = () => {
    const { item, t, resizeEvent } = this.props;
    if (!item) return null;

    const { uid, status } = item;

    switch (status) {
      case Product.StatusEnum.DRF:
        return (
          <Block>
            <ThemedButton
              fill
              round
              onClick={() =>
                this.$f7.dialog.confirm(t("Continue?"), () =>
                  this.props.changeProductStatus(uid, status, Product.StatusEnum.AFR)
                )
              }
            >
              {t("Send to Review")}
            </ThemedButton>
          </Block>
        );
      case Product.StatusEnum.APR:
        return (
          <Block>
            <ThemedButton
              fill
              round
              onClick={() => this.$f7.dialog.confirm(t("Continue?"), () => this.publishProduct())}
            >
              {t("Publish")}
            </ThemedButton>
          </Block>
        );
      case Product.StatusEnum.EXP:
        return (
          <Block>
            <ThemedButton
              fill
              round
              onClick={() => this.setState({ enterExtendPublicationDateSheetOpened: true })}
            >
              {t("Extend publication")}
            </ThemedButton>
          </Block>
        );
      case Product.StatusEnum.OOS:
        return (
          <Block>
            <ThemedButton fill round onClick={this.changeQuantity}>
              {t("Replenish Quantity")}
            </ThemedButton>
          </Block>
        );
      case Product.StatusEnum.PBL:
        return (
          <Block>
            <ThemedButton fill round onClick={() => this.$f7router.navigate("./promote/")}>
              {t("Promote the product")}
            </ThemedButton>
          </Block>
        );
      default:
        return null;
    }
  };

  blurHandle = (e) => {
    console.log(e.target.value);
  };

  changeQuantity = () => {
    const {
      t,
      item: { uid, status, quantity },
    } = this.props;
    const dialog = this.$f7.dialog.prompt(
      t("Please, enter quantity"),
      (val: string) => {
        let quantity: number;
        try {
          quantity = parseFloat(val);
        } catch (err) {
          console.error(err);
        }
        if (quantity > 0) {
          /* TODO: move new status to actions! */
          this.setState({
            productActionsSheetOpened: false,
            enterExtendPublicationDateSheetOpened: false,
          });
          this.props.changeProductStatus(uid, status, Product.StatusEnum.PBL, quantity);
        } else {
          this.$f7.dialog.alert(t("Quantity should be positive number!"));
        }
      },
      () => undefined,
      quantity.toString()
    );

    const el = dialog.$el.find("input").attr("type", "number")[0] as HTMLInputElement;
    el.select();
  };

  handleContactSupport = () => {
    this.setState({
      contactSupportPopupOpened: true,
      productActionsSheetOpened: false,
    });
  };

  renderActionSheetItems = () => {
    const { item, t } = this.props;
    if (!item || !this.state.productActionsSheetOpened) return null;

    const { uid, status } = item;

    switch (status) {
      case Product.StatusEnum.APR:
        return (
          <List>
            <ListItem link title={t("Edit").toString()} onClick={() => this.navigateToEdit(uid)} />
            <ListItem
              link
              title={t("Withdraw from sale").toString()}
              onClick={() =>
                this.$f7.dialog.confirm(t("Continue?"), () => {
                  this.setState({ productActionsSheetOpened: false }, () => {
                    /* TODO (fix error with React DOM) */
                    setTimeout(
                      () => this.props.changeProductStatus(uid, status, Product.StatusEnum.DSC),
                      350
                    );
                  });
                })
              }
              noChevron
            />
            <ListItem
              link
              title={t("Contact Support").toString()}
              onClick={this.handleContactSupport}
              noChevron
            />
          </List>
        );
      case Product.StatusEnum.PBL:
        return (
          <List>
            <ListItem link title={t("Edit").toString()} onClick={() => this.navigateToEdit(uid)} />
            <ListItem
              link
              title={t("Change quantity").toString()}
              onClick={this.changeQuantity}
              noChevron
            />
            <ListItem
              link
              title={t("Pause the sale of goods").toString()}
              onClick={() =>
                this.$f7.dialog.confirm(t("Continue?"), () => {
                  this.setState({ productActionsSheetOpened: false }, () => {
                    /* TODO (fix error with React DOM) */
                    setTimeout(
                      () => this.props.changeProductStatus(uid, status, Product.StatusEnum.SUS),
                      350
                    );
                  });
                })
              }
              noChevron
            />
            <ListItem
              link
              title={t("Contact Support").toString()}
              onClick={this.handleContactSupport}
              noChevron
            />
          </List>
        );
      case Product.StatusEnum.SUS:
        return (
          <List>
            <ListItem link title={t("Edit").toString()} onClick={() => this.navigateToEdit(uid)} />
            <ListItem
              link
              title={t("Change quantity").toString()}
              onClick={this.changeQuantity}
              noChevron
            />
            <ListItem
              link
              title={t("Withdraw from sale").toString()}
              onClick={() =>
                this.$f7.dialog.confirm(t("Continue?"), () => {
                  this.setState({ productActionsSheetOpened: false }, () => {
                    /* TODO (fix error with React DOM) */
                    setTimeout(
                      () => this.props.changeProductStatus(uid, status, Product.StatusEnum.DSC),
                      350
                    );
                  });
                })
              }
              noChevron
            />
            <ListItem
              link
              title={t("Resume selling of goods").toString()}
              onClick={() =>
                this.$f7.dialog.confirm(t("Continue?"), () => {
                  this.setState({ productActionsSheetOpened: false }, () => {
                    /* TODO (fix error with React DOM) */
                    setTimeout(
                      () => this.props.changeProductStatus(uid, status, Product.StatusEnum.PBL),
                      350
                    );
                  });
                })
              }
              noChevron
            />
            <ListItem
              link
              title={t("Contact Support").toString()}
              onClick={this.handleContactSupport}
              noChevron
            />
          </List>
        );
    }

    return null;
  };

  navigateToEdit = (uid: string) => {
    this.setState(
      {
        productActionsSheetOpened: false,
        enterExtendPublicationDateSheetOpened: false,
      },
      () => {
        this.$f7router.back();
        setTimeout(() => this.$f7router.navigate(`edit/${uid}/1/`), 500);
      }
    );
  };

  renderLinks() {
    const { item, t } = this.props;
    if (!item) return null;

    const { uid, status } = item;

    if (status === Product.StatusEnum.DRF) {
      return (
        <>
          <Link
            href="#"
            onClick={() => {
              this.$f7.dialog.confirm(t("Really?"), () => {
                this.props.changeProductStatus(uid, status, Product.StatusEnum.DLT);
              });
            }}
          >
            <IcRemove />
          </Link>
          <Link href="#" onClick={() => this.navigateToEdit(uid)}>
            <IcEdit />
          </Link>
          <Link href="#" onClick={this.handleContactSupport}>
            <IcSupport />
          </Link>
        </>
      );
    } else if (status === Product.StatusEnum.DCL) {
      return (
        <>
          <Link href="#" onClick={() => this.navigateToEdit(uid)}>
            <Icon material="create" />
          </Link>
          <Link href="#" onClick={this.handleContactSupport}>
            <IcSupport />
          </Link>
        </>
      );
    } else if (status === Product.StatusEnum.AFR || status === Product.StatusEnum.EXP) {
      return (
        <Link href="#" onClick={this.handleContactSupport}>
          <IcSupport />
        </Link>
      );
    } else if (
      status === Product.StatusEnum.APR ||
      status === Product.StatusEnum.PBL ||
      status === Product.StatusEnum.SUS
    ) {
      return (
        <Link
          href="#"
          onClick={() => {
            this.setState({
              productActionsSheetOpened: !this.state.productActionsSheetOpened,
            });
          }}
        >
          <Icon material="more_vertical" color="black" />
        </Link>
      );
    }

    return null;
  }

  render() {
    const { t, item, profile } = this.props;
    const { featureDetailsSheetOpened, featureDetails, playVideoSheetOpened, videoId, videoType } =
      this.state;

    return (
      <Page
        id="my_goods_product_details"
        name="my-goods-product-details"
        onPageInit={this.pageAfterInHandle}
      >
        <Navbar
          title=""
          backLink={t("Back").toString()}
          noHairline
          noShadow
          className="navbar-shadow"
        >
          <NavRight>
            <ShareButton onClick={this.handleShareProduct} large />
            {this.renderLinks()}
            {/* TODO: replace with container */}
            <div className="pure-hidden-xs my_goods_product_details-actions">
              {this.renderActionBottomButtons()}
            </div>
          </NavRight>
        </Navbar>

        {this.renderProductDetails()}

        {/* Sheet modals */}
        <Sheet
          id="product_actions_sheet"
          swipeToClose
          backdrop
          opened={this.state.productActionsSheetOpened}
          onSheetClosed={() => this.setState({ productActionsSheetOpened: false })}
        >
          <PageContent>{this.renderActionSheetItems()}</PageContent>
        </Sheet>

        {/* TODO */}
        <Sheet
          id="enter_extend_publication_date"
          swipeToClose
          backdrop
          opened={this.state.enterExtendPublicationDateSheetOpened}
          onSheetOpen={() =>
            this.setState(
              {
                expirationDate: convertISODateToInputDate(item.expirationDate.toString()),
                formValidFields: { expirationDate: true },
                formErrors: [],
              },
              () => {
                this.validateField("expirationDate", this.state.expirationDate);
                this.validateForm();
              }
            )
          }
          onSheetClosed={() => {
            if (
              this.state.productActionsSheetSubmitted &&
              this.state.formValidFields.expirationDate
            ) {
              const expdate = new Date(this.state.expirationDate);
              this.props.updateProductExpirationDate(item.uid, expdate);
            }
            this.setState({
              enterExtendPublicationDateSheetOpened: false,
              productActionsSheetSubmitted: false,
            });
          }}
        >
          <PageContent>
            <BlockTitle medium>{t("Extend publication")}</BlockTitle>
            {item && this.state.enterExtendPublicationDateSheetOpened && (
              <>
                <List noHairlines form>
                  <ListInput
                    name="expirationDate"
                    label={t("Expiration date").toString()}
                    floatingLabel
                    type="date"
                    placeholder=""
                    clearButton
                    slot="list"
                    onBlur={this.handleBlurInput}
                    onChange={this.handleUserInput}
                    onInputClear={this.handleInputClear}
                    value={this.state.expirationDate}
                    {...this.getErrorMessagesProps("expirationDate")}
                  />
                </List>
                <Fab
                  position="right"
                  onClick={() => {
                    if (!this.state.formValid) {
                      this.$f7.dialog.alert(t("Please fill field with valid data!"));
                      return;
                    }
                    this.setState({
                      enterExtendPublicationDateSheetOpened: false,
                      productActionsSheetSubmitted: true,
                    });
                  }}
                  slot="fixed"
                >
                  <Icon ios="f7:checkmark_alt" md="material:check" />
                </Fab>
              </>
            )}
          </PageContent>
        </Sheet>

        <Sheet
          id="promo_details_sheet"
          swipeToClose
          backdrop
          opened={featureDetailsSheetOpened}
          onSheetClosed={() =>
            this.setState({
              featureDetailsSheetOpened: false,
              featureDetails: null,
            })
          }
          style={{ height: "auto" }}
        >
          <PageContent>
            {featureDetails && (
              <Block>
                <ServicePackageDescription
                  code={featureDetails.code}
                  typeCode={featureDetails.typeCode}
                  price={featureDetails.price}
                  duration={`${getDaysLeft(featureDetails.expireDate)} ${t("days left")}`}
                  title={featureDetails.typeName}
                  description={featureDetails.typeDescription}
                  full
                />
              </Block>
            )}
          </PageContent>
        </Sheet>

        <Sheet
          id="play_video_sheet"
          swipeToClose
          backdrop
          opened={playVideoSheetOpened}
          onSheetClosed={() =>
            this.setState({
              playVideoSheetOpened: false,
              videoId: null,
              videoType: null,
            })
          }
          style={{ backgroundColor: "#000000" }}
        >
          <VideoPlayer videoId={videoId} videoType={videoType} />
        </Sheet>

        {item && (
          <ContactSupportPopup
            profile={profile}
            category="MyProduct"
            product={item}
            backdrop={false}
            opened={this.state.contactSupportPopupOpened}
            onPopupClosed={() => this.setState({ contactSupportPopupOpened: false })}
          />
        )}
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore, props: Props) => ({
  profile: getProfile(state),
  loading: state.productCreateReducer.loading,
  error: state.productCreateReducer.error,
  item:
    state.productCreateReducer.product && state.productCreateReducer.product.uid === props.uid
      ? state.productCreateReducer.product
      : null,
  productStatusReducer: state.productStatusReducer,
  ordersReducer: state.ordersReducer,
  countryClassificator: state.classificatorReducer.countryClassificator,
  resizeEvent: state.rootReducer.resizeEvent,
});

const mapDispatchToProps = (dispatch) => ({
  loadProductDetails: (uid: string) => dispatch(loadProductDetails(uid)),
  changeProductStatus: (
    uid: string,
    oldStatus: Product.StatusEnum,
    newStatus: Product.StatusEnum,
    quantity?: number
  ) => dispatch(changeProductStatus(uid, oldStatus, newStatus, quantity)),
  updateProductExpirationDate: (uid: string, expirationDate: Date) =>
    dispatch(updateProductExpirationDate(uid, expirationDate)),
  updateProductDraft: (item: IProduct, reset: boolean) => dispatch(updateProductDraft(item, reset)),
  createPromotionOrder: (featureUid: string, productUid: string) =>
    dispatch(createPromotionOrder(featureUid, productUid, { source: "card" })),
});

export default compose(
  withTranslation(),
  connectFilter,
  connectCategories,
  connectCategoriesClassificator,
  connectChat,
  connectShare,
  connect(mapStateToProps, mapDispatchToProps)
)(MyGoodsProductDetailsPage);
