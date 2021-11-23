import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import classNames from "classnames";
import {
  AccordionContent,
  Block,
  BlockTitle,
  Button,
  Chip,
  Col,
  Fab,
  Icon,
  Input,
  Link,
  List,
  ListItem,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
  Page,
  Row,
  Toggle,
} from "framework7-react";
import i18n from "i18next";
import _ from "lodash";
import { compose } from "redux";

import { getAllDeliveryMethods } from "../../actions/deliveryMethodsActions";
import {
  attachFile,
  chooseCategory,
  chooseSubcategory,
  createSaveProduct,
  detachFile,
  updateProductDraft,
} from "../../actions/productCreateActions";
import { ListInput } from "../../components/ListInput";
import { MapPopup } from "../../components/MapPopup";
import { SliderImageUploader } from "../../components/SliderImageUploader";
import { IcArrowRight, IcVimeo, IcYoutube } from "../../components-ui/icons";
import { ListItemVideoPreview } from "../../components-ui/list-item-video-preview";
import { ICategoryClassificator } from "../../reducers/categoryReducer";
import {
  IProductCreateFormError,
  IProductCreateUploadedFileInfo,
} from "../../reducers/productCreateReducer";
import { IProduct } from "../../reducers/productReducer";
import { Profile } from "../../reducers/sessionReducer";
import { analytics } from "../../Setup";
import connectCurrencies, { ICurrencyProps } from "../../store/connectCurrencies";
import { IApplicationStore, ICategory } from "../../store/rootReducer";
import { Country } from "../../types/commonapi";
import { DeliveryMethod, ProductVideo } from "../../types/marketplaceapi";
import {
  convertISODateToInputDate,
  createThumbnailVideoURLLink,
  createVideoURLLink,
  formatPrice,
  getSubcategoryNameBySubcategoryId,
  parseVideoURL,
} from "../../utils";

import AddDeliveryMethodPopup from "./add-delivery-method__popup";
import AddDeliveryOptionsSheet from "./add-delivery-options__sheet";
import AddPickupPointPopup from "./add-pickup-point__popup";
import ChooseCountryPopup from "./choose-country__popup";
import EditDeliveryOptionsSheet from "./edit-delivery-options__sheet";

import "./style.less";

const videoSocialIcons = {
  YOUTUBE: <IcYoutube />,
  VIMEO: <IcVimeo />,
};

const MAX_STEPS = 6;

type Props = WithTranslation &
  ICurrencyProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & {
    categories?: ICategoryClassificator[];
    category?: ICategory;
    chosenCategoryId?: string;
    loading?: boolean;
    saving?: boolean;
    error?: any;
    formErrors?: IProductCreateFormError[];
    product?: IProduct;
    files?: IProductCreateUploadedFileInfo[];
    profile?: Profile;
    updateProductDraft?(item: IProduct, reset?: boolean): void;
    chooseCategory?(catid?: string): void;
    chooseSubCategory?(catid?: string): void;
    createSaveProduct?(item: IProduct, files: IProductCreateUploadedFileInfo[]): void;
    attachFile?(index: number, file: File): void;
    detachFile?(index: number, productUid: string): void;
    countryClassificator?: Country[];
  };

type State = {
  step: number;
  mapPopupOpened: boolean;

  worldwidePurchase: boolean;
  chooseCountryPopupOpened: boolean;
  selectDeliveryOptionsSheetOpened: boolean;
  addDeliveryMethodPopupOpened?: boolean;
  addPickupPointPopupOpened?: boolean;
  editDeliveryMethodSheetOpened?: boolean;
  editedDeliveryMethod?: DeliveryMethod;
  isStateValue: string;
};

class ProductCreatePage1 extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      step: 1,
      mapPopupOpened: false,
      worldwidePurchase: true,
      chooseCountryPopupOpened: false,
      selectDeliveryOptionsSheetOpened: false,
      addDeliveryMethodPopupOpened: false,
      addPickupPointPopupOpened: false,
      isStateValue: "",
    };
  }

  handleChenge = (event) => {
    this.setState({ isStateValue: event.target.value });
  };

  pageInitHandle = () => {
    const { product, profile, currentLanguage } = this.props;
    const { params } = this.$f7route;
    const step = parseInt(params.step);

    if (params.uid && !product.uid) {
      this.$f7.preloader.show();
    }

    if (!params.uid) {
      analytics.openCreateProduct(profile);
    }

    product.uid = params.uid; /* update to val or null */

    if (!product.languageCode) {
      product.languageCode =
        currentLanguage ||
        i18n.language ||
        (profile.language ? profile.language.code : i18n.language);
    }

    this.setState({ step }, () => this.props.updateProductDraft(product, step === 1));

    if (product.address) {
      let place = "";
      if (product.address.firstAddressLine) {
        place = product.address.firstAddressLine;
      }
      if (product.address.city) {
        place += (place.length > 0 ? ", " : "") + product.address.firstAddressLine;
      }
      if (place.length < 10 && product.address.countryCode) {
        place += (place.length > 0 ? ", " : "") + product.address.countryCode;
      }
      product.place = place.length > 30 ? place.substring(0, 30) + "..." : place;
    }

    if (product.allowedCountries && product.allowedCountries.length > 0) {
      this.setState({ worldwidePurchase: false });
    }
  };

  handlePageBeforeRemove = () => {
    console.log("product-create -> handlePageBeforeRemove");

    if (this.state.step === 1) {
      const { product } = this.props;
      this.props.updateProductDraft({ ...product, uid: null }, true);
    }
  };

  _preloader: any;

  componentDidUpdate(prevProps: Props) {
    console.log("product-create -> componentDidUpdate");

    const { loading } = this.props;
    if (!loading) {
      this.$f7.preloader.hide();
    }
    this.handleAttachingFileErrors(prevProps, this.props);
    this.handleStep(prevProps);
  }

  handleAttachingFileErrors = (prevProps: Props, nextProps: Props) => {
    const { files } = nextProps;
    if (files.length === prevProps.files.length) {
      let errorText = "";
      files.forEach((item, i) => {
        if (item.error && prevProps.files[i].error !== item.error) {
          errorText += item.error + "\n";
        }
      });
      if (errorText.length > 0) this.$f7.dialog.alert(errorText);
    }
  };

  handleStep = (prevProps: Props) => {
    const { loading, error, formErrors, product, t, profile } = this.props;
    const { step } = this.state;

    if (!product) return;

    if (step === MAX_STEPS) {
      if (error && error !== prevProps.error) {
        if (this._preloader) this._preloader.close();
        this.$f7.dialog.alert(t(error));
      }

      if (loading && !prevProps.loading) {
        this._preloader = this.$f7.dialog.preloader(
          !product.uid ? t("Creating...") : t("Saving...")
        );
      }

      if (!loading && prevProps.loading && !error && !formErrors.length && product.uid) {
        if (this._preloader) this._preloader.close();
        this.$f7.dialog.alert(
          !product.uid
            ? t("You successfully created your product")
            : t("You successfully saved your product"),
          "",
          () => {
            analytics.createProduct(profile, product);

            this.$f7router.back("/profile/seller-area/my-goods/", {
              ignoreCache: true,
              animate: true,
              force: true,
            });
          }
        );
      }
    }
  };

  nextStepHandle = () => {
    if (!this.props.product) return;

    const { step } = this.state;
    const {
      product: { uid },
    } = this.props;

    if (step < MAX_STEPS) {
      const url = !uid
        ? `/profile/seller-area/my-goods/add/${step + 1}/`
        : `/profile/seller-area/my-goods/edit/${uid}/${step + 1}/`;
      this.$f7router.navigate(url, {
        ignoreCache: true,
        animate: true,
        force: true,
      });
    } else {
      const { product, files } = this.props;
      this.props.createSaveProduct(product, files);
    }
  };

  prevStepHandle = () => this.$f7router.back();

  blurInputHandle = (e: { target: { name: any; value: any; type: any; checked: boolean } }) => {
    const { name, value, type } = e.target;
    const { product } = this.props;
    if (!name || !type) throw new Error("Name or type for field is not defined!");

    try {
      switch (type) {
        case "number":
          product[name] = parseFloat(value);
          break;
        case "checkbox":
          product[name] = e.target.checked;
          break;
        case "date": {
          const dateISO = new Date(value).toISOString();
          product[name] = dateISO.substr(0, dateISO.lastIndexOf("."));
          break;
        }
        default: {
          /* TODO */
          if (name === "video" && !!value && !!value.length) {
            const info = parseVideoURL(value) || {
              id: null,
              type: null,
            };
            product.video = {
              id: info.id,
              type: info.type ? ProductVideo.TypeEnum[info.type.toUpperCase()] : "",
              enabled: true,
            };
          } else {
            product[name] = value;
          }
        }
      }
    } catch (err) {}

    this.props.updateProductDraft(product);
  };

  smartSelectInputChangeHandle = (e: { target: { value: any; name?: any; type?: any } }) => {
    const { name, value } = e.target;
    const { product } = this.props;
    product[name] = value;
    this.props.updateProductDraft(product);
  };

  selectCategoryHandle = () =>
    this.$f7router.navigate("/select-category-subcategory/", {
      props: {
        onSheetClosed: this.sheetClosedHandle,
      },
    });

  selectSubCategoryHandle = () =>
    this.props.chosenCategoryId &&
    this.$f7router.navigate("/select-category-subcategory/", {
      props: {
        catid: this.props.chosenCategoryId,
        onSheetClosed: (selectedId?: string) => {
          if (selectedId) {
            this.props.chooseSubCategory(selectedId);
          }
        },
      },
    });

  sheetClosedHandle = (selectedId?: string) => {
    const { chosenCategoryId } = this.props;
    if (selectedId && selectedId !== chosenCategoryId) {
      this.props.chooseCategory(selectedId);
    }
  };

  selectProductTypeHandle = (type: any) =>
    this.props.updateProductDraft({ ...this.props.product, type });

  selectLocationHandle = () => {
    this.setState({
      mapPopupOpened: true,
    });
  };

  attachFileHandle = (index: number, file?: File) => {
    if (file) {
      this.props.attachFile(index, file);
    }
  };

  /* TODO */
  detachFileHandle = (index: number) =>
    this.$f7.dialog.confirm(this.props.t("Sure?"), null, () =>
      this.props.detachFile(index, this.props.product.uid)
    );

  getDefaultValue = (fieldName: string, defaultValue: any = ""): any => {
    const { product } = this.props;

    if (fieldName === "video") {
      return product[fieldName] ? product[fieldName].id : defaultValue;
    }

    if (
      typeof product[fieldName] !== "undefined" &&
      product[fieldName] !== null &&
      product[fieldName].toString() !== "NaN"
    ) {
      return product[fieldName];
    } else {
      return defaultValue;
    }
  };

  getValue = (fieldName: string): any => {
    const { product } = this.props;
    if (
      typeof product[fieldName] !== "undefined" &&
      product[fieldName] !== null &&
      product[fieldName].toString() !== "NaN"
    ) {
      return product[fieldName];
    }
  };

  getErrorProps = (fieldName: string, properties?: any) => {
    const { t } = this.props;
    const optionalProps = properties || {};
    let errorMessage = t("Please fill out this field.");

    let errorMessageForce =
      this.props.formErrors.filter((e) => e.parameters.includes(fieldName)).length > 0;

    if (!errorMessageForce) {
      const formError = this.props.formErrors.filter(
        (item) =>
          !!item.parameters.filter((__item) => {
            // @ts-ignore
            if (__item.parameters) {
              // @ts-ignore
              return !!__item.parameters.includes(fieldName);
            }
            return __item == fieldName;
          }).length
      )[0];

      if (formError) {
        errorMessageForce = true;
        errorMessage = t(formError.message);
      }
    }

    return {
      info: t("required").toString(),
      required: true,
      validateOnBlur: true,
      errorMessage,
      errorMessageForce,
      ...optionalProps,
    };
  };

  onAddDeliveryMethodHandle = (_instance, deliveryMethod) => {
    this.setState({
      addDeliveryMethodPopupOpened: false,
      addPickupPointPopupOpened: false,
      editedDeliveryMethod: null,
    });

    if (deliveryMethod) {
      const { product } = this.props;
      if (!product.deliveryMethods) product.deliveryMethods = [];
      const existsMethod = product.deliveryMethods.filter(
        // @ts-ignore
        (m) => m.uid === deliveryMethod.uid
      )[0];
      if (!existsMethod) {
        // @ts-ignore
        product.deliveryMethods.push(deliveryMethod);
        this.props.getAllDeliveryMethods();
      } else {
        // @ts-ignore
        const indexOf = product.deliveryMethods.indexOf(existsMethod);
        // @ts-ignore
        product.deliveryMethods[indexOf] = deliveryMethod;
        product.deliveryMethods = _.cloneDeep(product.deliveryMethods);
      }
      this.props.updateProductDraft(product);
    }
  };

  changeShortDecriptionValue = (ev) => {
    const { product, updateProductDraft } = this.props;
    product["shortDescription"] = ev.target.value;
    updateProductDraft(product);
  };

  renderSteps = () => {
    const {
      loading,
      saving,
      product,
      category,
      categories = [],
      currencies = [],
      files,
      t,
    } = this.props;
    const { step } = this.state;
    // eslint-disable-next-line no-undef
    console.log(files, "**********************************");
    // TODO: when the files(images) will be ready implement instead of fake images
    const file = [{}, {}, {}];
    if ((loading && !saving) /* prevent destroy slider image */ || !product) {
      return null;
    }

    switch (step) {
      case 1:
        return (
          <div className="fff">
            <BlockTitle medium>{t("General Information")}</BlockTitle>
            <SliderImageUploader
              slidesPerView={1}
              images={files}
              onSelectFile={this.attachFileHandle}
              onDeleteFile={this.detachFileHandle}
            />
            <List noHairlines form>
              <ListInput
                name="video"
                label={t("Video link").toString()}
                floatingLabel
                type="text"
                placeholder=""
                clearButton
                slot="list"
                onBlur={this.blurInputHandle}
                defaultValue={this.getDefaultValue("video")}
                {...this.getErrorProps("video", {
                  required: false,
                  info: t("Youtube, Vkontakte or Vimeo"),
                })}
              />
              {product.video && product.video.id && (
                <ListItemVideoPreview
                  title={product.name}
                  subtitle={createVideoURLLink(product.video.id, product.video.type.toString())}
                  icon={product.video.type ? videoSocialIcons[product.video.type.toString()] : ""}
                  image={createThumbnailVideoURLLink(
                    product.video.id,
                    product.video.type.toString()
                  )}
                  slot="list"
                />
              )}
              <ListItem
                link="#"
                onClick={this.selectCategoryHandle}
                title={t("Category").toString()}
                footer={t("required").toString()}
                after={category && category.name}
                slot="list"
                {...this.getErrorProps("category")}
              />
              <ListItem
                link="#"
                onClick={this.selectSubCategoryHandle}
                title={t("Subcategory").toString()}
                footer={t("required").toString()}
                after={getSubcategoryNameBySubcategoryId(product.category, categories)}
                slot="list"
                style={!category ? { opacity: 0.43 } : {}}
                {...this.getErrorProps("category")}
              />
            </List>
            <BlockTitle>{t("Type")}</BlockTitle>
            <Block className="product-type-btn-group">
              {[
                { name: "Product", val: "P" },
                { name: "Service", val: "S" },
              ].map((item, i) => (
                <Link key={i} onClick={() => this.selectProductTypeHandle(item.val)}>
                  <Chip
                    className={classNames(item.val === product.type && "select")}
                    text={t(item.name).toString()}
                  />
                </Link>
              ))}
            </Block>
            <List noHairlines form>
              <ListInput
                name="name"
                label={t("Name").toString()}
                floatingLabel
                type="text"
                placeholder=""
                clearButton
                slot="list"
                onBlur={this.blurInputHandle}
                defaultValue={this.getDefaultValue("name")}
                {...this.getErrorProps("name")}
              />
              <ListInput
                name="shortDescription"
                label={t("Summary").toString()}
                floatingLabel
                isShortDescription
                type="text"
                placeholder=""
                clearButton
                maxlength="60"
                slot="list"
                onBlur={this.blurInputHandle}
                onChange={this.changeShortDecriptionValue}
                defaultValue={this.getDefaultValue("shortDescription")}
                value={this.getValue("shortDescription")}
                {...this.getErrorProps("shortDescription")}
              />

              <ListInput
                name="hashtags"
                label={t("Hashtags").toString()}
                floatingLabel
                type="text"
                placeholder=""
                clearButton
                slot="list"
                onBlur={this.blurInputHandle}
                defaultValue={this.getDefaultValue("hashtags")}
              />
              <ListInput
                name="price"
                label={t("Price").toString()}
                floatingLabel
                type="number"
                placeholder=""
                clearButton
                slot="list"
                onBlur={this.blurInputHandle}
                defaultValue={this.getDefaultValue("price")}
                inputmode="decimal"
                min="0"
                step="0.01"
                {...this.getErrorProps("price")}
              />
              <ListInput
                name="discountedPrice"
                label={t("Price with discount").toString()}
                floatingLabel
                type="number"
                placeholder=""
                clearButton
                slot="list"
                onBlur={this.blurInputHandle}
                inputmode="decimal"
                min="0"
                step="0.01"
                defaultValue={this.getDefaultValue("discountedPrice")}
              />
              <ListInput
                name="quantity"
                label={t("Count of product").toString()}
                floatingLabel
                type="number"
                placeholder=""
                clearButton
                slot="list"
                onBlur={this.blurInputHandle}
                defaultValue={this.getDefaultValue("quantity")}
                inputmode="decimal"
                min="0"
                step="0"
                {...this.getErrorProps("quantity")}
              />
              <ListItem
                title={t("Currency").toString()}
                smartSelect
                smartSelectParams={{
                  openIn: "popover",
                  closeOnSelect: true,
                }}
                slot="list"
              >
                <select
                  name="currencyCode"
                  value={product.currencyCode}
                  onChange={this.smartSelectInputChangeHandle}
                >
                  {currencies.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code}
                    </option>
                  ))}
                </select>
              </ListItem>
              <ListItem
                name="inStock"
                checkbox
                title={t("In stock").toString()}
                slot="list"
                onChange={this.blurInputHandle}
                checked={product.inStock}
              />
            </List>
          </div>
        );
      case 2:
        return (
          <>
            <List noHairlines form>
              <ListInput
                name="description"
                type="texteditor"
                className="hide-text-editor-info"
                clearButton
                resizable
                slot="list"
                textEditorParams={{
                  buttons: [
                    ["bold"],
                    ["orderedList", "unorderedList"],
                    ["paragraph"],
                    ["subscript", "superscript"],
                  ],
                }}
                onTextEditorChange={(value) =>
                  this.blurInputHandle({
                    // @ts-ignore
                    target: {
                      name: "description",
                      value,
                      type: "text",
                    },
                  })
                }
                value={this.getDefaultValue("description")}
                placeholder={t("Add product description (required)").toString()}
                {...this.getErrorProps("description")}
              />
            </List>
          </>
        );
      case 3:
        return (
          <>
            <BlockTitle medium>{t("Characteristics")}</BlockTitle>
            <List noHairlines noHairlinesBetween form>
              <ListInput
                name="manufacturer"
                label={t("Manufacturer").toString()}
                floatingLabel
                type="text"
                placeholder=""
                clearButton
                slot="list"
                onBlur={this.blurInputHandle}
                defaultValue={this.getDefaultValue("manufacturer")}
              />
              <ListInput
                name="model"
                label={t("Model").toString()}
                floatingLabel
                type="text"
                placeholder=""
                clearButton
                slot="list"
                onBlur={this.blurInputHandle}
                defaultValue={this.getDefaultValue("model")}
              />
              <ListInput
                name="color"
                label={t("Color").toString()}
                floatingLabel
                type="text"
                placeholder=""
                clearButton
                slot="list"
                onBlur={this.blurInputHandle}
                defaultValue={this.getDefaultValue("color")}
              />
              <ListItem slot="list">
                <Row>
                  <Col className="item-input">
                    <div className="item-title item-label item-floating-label">
                      {t("Size").toString()}
                    </div>
                    <Input
                      className="input-wrap"
                      name="size"
                      type="text"
                      placeholder=""
                      clearButton
                      onBlur={this.blurInputHandle}
                      defaultValue={this.getDefaultValue("size")}
                    />
                  </Col>
                  <Col className="item-input">
                    <div className="item-title item-label item-floating-label">
                      {t("Weight").toString()}
                    </div>
                    <Input
                      className="input-wrap"
                      name="weight"
                      type="number"
                      placeholder=""
                      clearButton
                      onBlur={this.blurInputHandle}
                      defaultValue={this.getDefaultValue("weight")}
                      min={0}
                    />
                  </Col>
                </Row>
              </ListItem>
              <ListItem
                link="#"
                title={t("Location").toString()}
                slot="list"
                after={product && (product.place || product.coordinates)}
                onClick={this.selectLocationHandle}
              />
            </List>
          </>
        );
      case 4:
        return (
          <>
            <BlockTitle medium>{t("Allow purchase from").toString()}</BlockTitle>
            <List noHairlines form className="no-margin-bottom">
              <ListItem name="worldwidePurchase" title={t("Wordlwide").toString()} slot="list">
                <Toggle
                  checked={this.state.worldwidePurchase}
                  onChange={() => {
                    this.setState({
                      worldwidePurchase: !this.state.worldwidePurchase,
                    });
                    this.props.updateProductDraft({
                      ...this.props.product,
                      allowedCountries: [],
                      disallowedCountries: [],
                    });
                  }}
                  slot="after"
                />
              </ListItem>
            </List>
            {!this.state.worldwidePurchase && (
              <List noHairlines className="no-margin-top no-margin-bottom">
                <ListItem
                  className="item-add-link no-margin-bottom"
                  link
                  title={t("Add specific countries").toString()}
                  noChevron
                  onClick={() => {
                    this.setState({
                      chooseCountryPopupOpened: true,
                    });
                  }}
                >
                  <span slot="media">
                    <Icon ios="f7:plus" md="material:add" />
                  </span>
                </ListItem>
              </List>
            )}
            {!this.state.worldwidePurchase && (
              <Block className="no-margin-top">
                {this.props.product.allowedCountries &&
                  this.props.product.allowedCountries.length &&
                  this.props.product.allowedCountries.map((countryCode) => (
                    <Chip
                      key={countryCode}
                      text={
                        this.props.countryClassificator.filter((c) => c.code === countryCode)[0]
                          .name
                      }
                      deleteable
                      onDelete={() => {
                        const { product, updateProductDraft } = this.props;
                        updateProductDraft({
                          ...product,
                          allowedCountries: product.allowedCountries.filter(
                            (item) => item !== countryCode
                          ),
                        });
                      }}
                    />
                  ))}
              </Block>
            )}
          </>
        );
      case 5:
        const productDeliveryMethods = this.getProductDeliveryMethods();
        return (
          <>
            <BlockTitle medium>{t("Delivery options").toString()}</BlockTitle>
            {productDeliveryMethods.length === 0 ? (
              <Block>
                {t(
                  "You can specify different delivery options: delivery methods and pick-up points"
                )}
              </Block>
            ) : null}
            {productDeliveryMethods.length > 0 ? (
              <List
                noHairlines
                noHairlinesBetween
                className="no-margin-top no-margin-bottom delivery-methods"
              >
                {productDeliveryMethods.map((item, i) => (
                  <ListItem key={item.uid || i.toString()} link={false} noChevron>
                    <div slot="title">
                      <strong style={{ marginBottom: 12 }}>{item.name}</strong>
                      {item.options &&
                        item.options.length &&
                        item.options.map((o, i) => (
                          <div
                            key={o.uid || i.toString()}
                            style={{
                              marginBottom: 12,
                            }}
                          >
                            <div>{o.countries && o.countries.map((c) => c.name).join(", ")}</div>
                            <div>{`${o.deliveryTimeDaysMin}-${o.deliveryTimeDaysMax}`}</div>
                            <div>
                              {o.price > 0
                                ? formatPrice(
                                    o.price,
                                    currencies.filter((c) => c.code === o.currencyCode)[0].symbol
                                  )
                                : t("Free shipping")}
                            </div>
                          </div>
                        ))}
                    </div>
                    <div slot="after">
                      <Link
                        iconMaterial="more_vert"
                        iconOnly
                        onClick={() =>
                          this.setState({
                            editDeliveryMethodSheetOpened: true,
                            editedDeliveryMethod: item,
                          })
                        }
                      />
                    </div>
                  </ListItem>
                ))}
              </List>
            ) : null}
            <List noHairlines className="no-margin-top no-margin-bottom">
              <ListItem
                className="item-add-link no-margin-bottom"
                link
                title={t("Add a delivery options").toString()}
                noChevron
                onClick={() =>
                  this.setState({
                    selectDeliveryOptionsSheetOpened: true,
                  })
                }
              >
                <span slot="media">
                  <Icon ios="f7:plus" md="material:add" />
                </span>
              </ListItem>
            </List>
          </>
        );
      case 6:
        return (
          <>
            <BlockTitle medium>{t("Additional information").toString()}</BlockTitle>
            <List noHairlines form>
              <ListItem
                name="returnAccepted"
                checkbox
                title={t("Return allowed").toString()}
                slot="list"
                onChange={this.blurInputHandle}
                checked={product.returnAccepted}
              />
              <ListItem slot="list">
                <Row className="w-100">
                  <Col className="item-input">
                    <div className="item-title item-label item-floating-label">
                      {t("Publication date")}
                    </div>
                    <Input
                      className="input-wrap"
                      name="publishDate"
                      type="date"
                      placeholder=""
                      clearButton
                      onBlur={this.blurInputHandle}
                      defaultValue={
                        product &&
                        product.publishDate &&
                        convertISODateToInputDate(product.publishDate.toString())
                      }
                      {...this.getErrorProps("publishDate", {
                        required: false,
                        errorMessage: t("Publish date must be lower than expiration date."),
                      })}
                    />
                  </Col>
                  <Col className="item-input">
                    <div className="item-title item-label item-floating-label">
                      {t("Expiration date")}
                    </div>
                    <Input
                      className="input-wrap"
                      name="expirationDate"
                      type="date"
                      placeholder=""
                      clearButton
                      onBlur={this.blurInputHandle}
                      defaultValue={
                        product &&
                        product.expirationDate &&
                        convertISODateToInputDate(product.expirationDate.toString())
                      }
                      {...this.getErrorProps("expirationDate", {
                        required: false,
                        errorMessage: t("Expiration date must be upper than publish date."),
                      })}
                    />
                  </Col>
                </Row>
              </ListItem>
            </List>
          </>
        );
      default:
        return null;
    }
  };

  renderNextButton = () => {
    const { step } = this.state;
    return (
      <Fab position="right-bottom" onClick={this.nextStepHandle} slot="fixed">
        <Icon
          ios={step < MAX_STEPS ? "f7:arrow_right" : "f7:checkmark_alt"}
          md={step < MAX_STEPS ? "material:arrow_forward" : "material:check"}
        />
      </Fab>
    );
  };

  closeHandle = (backLink?: boolean) => {
    const { t } = this.props;
    const { step } = this.state;

    if (backLink && step > 1) {
      this.$f7router.back();
      return;
    }

    this.$f7.dialog.confirm(
      t(
        "All changes will be lost_Are you sure you would like to exit screen and discard the changes?"
      ),
      () =>
        this.$f7router.back("/profile/seller-area/my-goods/", {
          ignoreCache: true,
          animate: true,
          force: true,
        })
    );
  };

  setProductLocation = (lat, lng, place, placeId, address) => {
    const { product } = this.props;
    product.coordinates = lat + "," + lng;
    if (place) {
      product.place = place.length > 30 ? place.substring(0, 30) + "..." : place;
    }
    if (placeId) {
      product.placeId = placeId;
    }
    if (address) {
      product.address = address;
    }
  };

  toLatLngLiteral = () => {
    const { product } = this.props;
    try {
      const arr = product.coordinates.split(",");
      return { lat: parseFloat(arr[0]), lng: parseFloat(arr[1]) };
    } catch {}
    return { lat: 0, lng: 0 };
  };

  getProductDeliveryMethods() {
    const { product } = this.props;
    return product.deliveryMethods
      ? product.deliveryMethods.filter(
          (m) =>
            m.options && m.options.filter((o) => o.currencyCode === product.currencyCode).length
        )
      : [];
  }

  getAllDeliveryMethods() {
    const { deliveryMethods, product } = this.props;
    return deliveryMethods.allDeliveryMethods
      ? deliveryMethods.allDeliveryMethods
          .filter(
            (m) =>
              m.options && m.options.filter((o) => o.currencyCode === product.currencyCode).length
          )
          .map((m) => {
            return {
              ...m,
              selected: !!(product.deliveryMethods || []).filter((mm) => mm.uid === m.uid).length,
            };
          })
      : [];
  }

  render() {
    const { product, deliveryMethods, t } = this.props;
    const files = [];
    // eslint-disable-next-line no-undef
    console.log(
      product,
      "product-create -> render*********************************************************"
    );
    const title = product ? (product.uid ? "Edit product" : "New product") : "";
    return (
      <Page
        id="product_create"
        name="product-create"
        onPageInit={this.pageInitHandle}
        onPageBeforeRemove={this.handlePageBeforeRemove}
      >
        <Navbar noHairline noShadow>
          <NavLeft>
            <Link iconOnly onClick={() => this.closeHandle()}>
              <Icon ios="f7:multiply" md="material:close" />
            </Link>
          </NavLeft>
          <NavTitle>{t(title)}</NavTitle>
          <NavRight>
            <Button
              className="next-button"
              fill
              round
              // href='./import-products/'
            >
              {t("Next")}
              <IcArrowRight />
            </Button>
          </NavRight>
        </Navbar>
        <Row resizableFixed>
          <Col width="33" large="25" xlarge="20">
            <List simpleList>
              <ListItem title="General Information"></ListItem>
              <ListItem title="Price"></ListItem>
              <ListItem title="Allow Order from"></ListItem>
              <ListItem title="Delivery Options"></ListItem>
              <ListItem title="Additional Information"></ListItem>
            </List>
          </Col>
          {this.renderSteps()}
          <Col width="66" large="75" xlarge="80"></Col>
        </Row>

        {this.renderSteps()}
        {this.renderNextButton()}

        {product && (
          <ChooseCountryPopup
            opened={this.state.chooseCountryPopupOpened}
            selectedCountries={product.allowedCountries || []}
            onPopupClosed={(selectedCountries) => {
              this.setState({ chooseCountryPopupOpened: false });
              this.props.updateProductDraft({
                ...product,
                allowedCountries: selectedCountries,
              });
            }}
          />
        )}

        {product && (
          <AddDeliveryOptionsSheet
            opened={this.state.selectDeliveryOptionsSheetOpened}
            onSheetOpened={() => {
              if (
                !deliveryMethods.allDeliveryMethods ||
                !deliveryMethods.allDeliveryMethods.length
              ) {
                this.props.getAllDeliveryMethods();
              }
            }}
            onSelectItemClickHandle={(item) => {
              this.setState({
                selectDeliveryOptionsSheetOpened: false,
              });
              setTimeout(() => {
                // TODO
                if (item === "Delivery method")
                  this.setState({
                    addDeliveryMethodPopupOpened: true,
                  });
                else if (item === "Pick-up point")
                  this.setState({
                    addPickupPointPopupOpened: true,
                  });
              }, 380);
            }}
            onSheetClosed={() =>
              this.setState({
                selectDeliveryOptionsSheetOpened: false,
              })
            }
            deliveryMethods={this.getAllDeliveryMethods()}
            onDeliveryMethodClickHandle={(uid) => {
              console.log(uid);
              if (!product.deliveryMethods) product.deliveryMethods = [];
              const method = deliveryMethods.allDeliveryMethods.filter((m) => m.uid === uid)[0];
              const exists = !!product.deliveryMethods.filter((m) => m.uid === uid).length;
              if (exists) {
                product.deliveryMethods = product.deliveryMethods.filter((m) => m.uid !== uid);
              } else {
                product.deliveryMethods.push(method);
              }
              this.props.updateProductDraft(product);
            }}
          />
        )}

        {product && (
          <EditDeliveryOptionsSheet
            opened={this.state.editDeliveryMethodSheetOpened}
            deliveryMethod={this.state.editedDeliveryMethod}
            onSheetClosed={() =>
              this.setState({
                editDeliveryMethodSheetOpened: false,
                editedDeliveryMethod: null,
              })
            }
            onEditClickHandle={() => {
              this.$f7.dialog.confirm(
                t(
                  "This delivery method is also used in other products. Changes to this method will affect all products in which it is specified.Do you want to edit the method?"
                ),
                () => {
                  const uid = this.state.editedDeliveryMethod.uid;
                  // TODO
                  const editedDeliveryMethod = product.deliveryMethods.filter(
                    (m) => m.uid === uid
                  )[0];
                  this.setState({
                    editDeliveryMethodSheetOpened: false,
                  });
                  setTimeout(() => {
                    if (editedDeliveryMethod.type === DeliveryMethod.TypeEnum.DELIVERY) {
                      this.setState({
                        addDeliveryMethodPopupOpened: true,
                        editedDeliveryMethod,
                      });
                    } else if (editedDeliveryMethod.type === DeliveryMethod.TypeEnum.PICKUP) {
                      this.setState({
                        addPickupPointPopupOpened: true,
                        editedDeliveryMethod,
                      });
                    }
                  }, 380);
                }
              );
            }}
            onRemoveClickHandle={() => {
              const uid = this.state.editedDeliveryMethod.uid;
              this.setState({
                editDeliveryMethodSheetOpened: false,
              });
              setTimeout(() => {
                if (!product.deliveryMethods) product.deliveryMethods = [];
                product.deliveryMethods = product.deliveryMethods.filter((m) => m.uid !== uid);
                this.props.updateProductDraft(product);
              }, 380);
            }}
          />
        )}

        {product && (
          <AddDeliveryMethodPopup
            opened={this.state.addDeliveryMethodPopupOpened}
            onPopupClosed={this.onAddDeliveryMethodHandle}
            currency={this.props.currencies.filter((c) => c.code === product.currencyCode)[0]}
            deliveryMethod={this.state.editedDeliveryMethod}
          />
        )}

        {product && (
          <AddPickupPointPopup
            opened={this.state.addPickupPointPopupOpened}
            onPopupClosed={this.onAddDeliveryMethodHandle}
            currency={this.props.currencies.filter((c) => c.code === product.currencyCode)[0]}
            deliveryMethod={this.state.editedDeliveryMethod}
          />
        )}

        <MapPopup
          backdrop={false}
          coordinates={this.toLatLngLiteral()}
          initialized={this.state.mapPopupOpened}
          opened={this.state.mapPopupOpened}
          onPopupClosed={() => this.setState({ mapPopupOpened: false })}
          onLocationSelect={(location, place, placeId, address) =>
            this.setProductLocation(location.lat, location.lng, place, placeId, address)
          }
        />
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  categories: state.categoryReducer.flat,
  category:
    state.rootReducer.localConfig &&
    state.rootReducer.localConfig.categories.filter(
      (item) => item.id === state.productCreateReducer.chosenCategoryId
    )[0],
  chosenCategoryId: state.productCreateReducer.chosenCategoryId,
  loading: state.productCreateReducer.loading,
  saving: state.productCreateReducer.saving,
  error: state.productCreateReducer.error,
  formErrors: state.productCreateReducer.formErrors,
  product: state.productCreateReducer.product,
  files: state.productCreateReducer.files,
  profile: state.sessionReducer.profile,
  countryClassificator: state.classificatorReducer.countryClassificator,
  deliveryMethods: state.deliveryMethodsReducer,
  currentLanguage: state.rootReducer.language,
});

const mapDispatchToProps = (dispatch: any) => ({
  updateProductDraft: (item: IProduct, reset: boolean) => dispatch(updateProductDraft(item, reset)),
  chooseCategory: (catid?: string) => dispatch(chooseCategory(catid)),
  chooseSubCategory: (catid?: string) => dispatch(chooseSubcategory(catid)),
  createSaveProduct: (item: IProduct, files: IProductCreateUploadedFileInfo[]) =>
    dispatch(createSaveProduct(item, files)),
  attachFile: (index: number, file: File) => dispatch(attachFile(index, file)),
  detachFile: (index: number, productUid: string) => dispatch(detachFile(index, productUid)),
  getAllDeliveryMethods: () => dispatch(getAllDeliveryMethods()),
});

export default compose(
  withTranslation(),
  connectCurrencies,
  connect(mapStateToProps, mapDispatchToProps)
)(ProductCreatePage1);
