import React, { Component } from "react";
import {
  Popup,
  PageContent,
  Navbar,
  NavLeft,
  Link,
  Icon,
  NavTitle,
  NavRight,
  Searchbar,
  List,
  ListItem,
  Block,
  Chip,
  Page,
  BlockTitle,
  Row,
  Col,
  Input,
  Fab,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { bindActionCreators, compose } from "redux";
import { IApplicationStore } from "../../store/rootReducer";
import { connect } from "react-redux";
import {} from "../../utils";
import { ListInput } from "../../components/ListInput";
import DeliveryPriceSheet from "./delivery-price__sheet";
import DeliveryTimeSheet from "./delivery-time__sheet";
import { DeliveryMethod } from "../../types/marketplaceapi";
import _ from "lodash";
import { Currency } from "../../types/commonapi";
import { addDeliveryMethods } from "../../actions/deliveryMethodsActions";
import { MapPopup } from "../../components/MapPopup";

type Props = Omit<Popup.Props, "onPopupClosed"> &
  Partial<ReturnType<typeof mapStateToProps>> &
  Partial<ReturnType<typeof mapDispatchToProps>> & {
    onPopupClosed?(instance: any, deliveryMethodUid: string): void;
    currency: Currency;
    deliveryMethod?: DeliveryMethod;
  };

type State = {
  formErrors?: any;
  isFormValid?: boolean;
  deliveryMethod?: DeliveryMethod;
  deliveryPriceSheetOpened?: boolean;
  deliveryTimeSheetOpened?: boolean;
  chooseCountryPopupOpened?: boolean;
  deliveryOptionUid?: string;
};

class AddPickupPointPopup extends Component<WithTranslation & Props, State> {
  constructor(props: Readonly<WithTranslation & Props>) {
    super(props);
    this.state = {
      formErrors: {},
      isFormValid: false,
      deliveryPriceSheetOpened: false,
      deliveryTimeSheetOpened: false,
      chooseCountryPopupOpened: false,
      deliveryMethod: this.getInitDeliveryMethod(props.currency),
      deliveryOptionUid: null,
    };
  }

  componentDidUpdate(prevProps) {
    const {
      opened,
      deliveryMethods: { loading, error },
    } = this.props;

    if (opened) {
      if (loading) {
        this.$f7.preloader.show();
      } else {
        this.$f7.preloader.hide();
      }

      if (prevProps.deliveryMethods.loading && !loading && error && prevProps.error !== error) {
        this.$f7.dialog.alert(error);
      }
    }

    if (prevProps.deliveryMethods.loading && !loading && !error) {
      this.$f7.popup.close();
    }
  }

  getInitDeliveryMethod = (currency: Currency): DeliveryMethod => {
    return _.cloneDeep({
      name: "",
      type: DeliveryMethod.TypeEnum.PICKUP,
      options: [
        {
          currencyCode: currency.code,
          price: 0,
          countries: [],
          deliveryTimeDaysMax: null,
          deliveryTimeDaysMin: null,
        },
      ],
    });
  };

  onPopupOpenHandle = (instance) => {
    const { onPopupOpen, deliveryMethod } = this.props;
    this.setState({
      deliveryMethod: deliveryMethod || this.getInitDeliveryMethod(this.props.currency), // TODO ->> ,
      deliveryOptionUid: null,
    });
    this.validate();
    if (onPopupOpen) onPopupOpen(instance);
  };

  blurInputHandle = (
    e: {
      target: { name: any; value: any; type: any; checked: boolean };
    },
    optionItemKey?: string
  ) => {
    const { name, value, type } = e.target;
    const { deliveryMethod } = this.state;
    if (optionItemKey !== undefined && optionItemKey !== null) {
      const option = deliveryMethod.options.filter(
        (o, i) => i.toString() === optionItemKey || o.uid === optionItemKey
      )[0];
      if (option) {
        option[name] = value;
      }
    } else {
      deliveryMethod[name] = value;
    }
    this.setState({ deliveryMethod }, () => this.validate());
  };

  getDefaultValue = (field: string, optionItemKey?: string) => {
    if (optionItemKey !== undefined && optionItemKey !== null) {
      const option = this.state.deliveryMethod.options.filter(
        (o, i) => i.toString() === optionItemKey || o.uid === optionItemKey
      )[0];
      if (option) {
        return option[field];
      }
      return "";
    }
    return this.state.deliveryMethod[field];
  };

  getErrorProps = (fieldName: string, properties?: any, optionItemKey?: string) => {
    const { t } = this.props;
    const optionalProps = properties || {};
    let errorMessage = t("Please fill out this field.");
    let errorMessageForce = false;

    const { formErrors } = this.state;
    if (Object.keys(formErrors).includes(fieldName)) {
      errorMessage = t("Please fill out this field.");
      errorMessageForce = true;
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

  validate = () => {
    let { deliveryMethod, formErrors } = this.state;
    let isFormValid = true;

    formErrors = { pickupAddress: {} };

    if (!deliveryMethod.name || deliveryMethod.name.length === 0) {
      isFormValid = false;
    }

    if (deliveryMethod.options && deliveryMethod.options.length) {
      deliveryMethod.options.forEach((item, index) => {
        if (
          item.deliveryTimeDaysMin === 0 ||
          item.deliveryTimeDaysMin === null ||
          item.deliveryTimeDaysMax === 0 ||
          item.deliveryTimeDaysMax === null
        ) {
          isFormValid = false;
        }
        if (item.pickupAddress) {
          "city, coordinates, countryCode, firstAddressLine, placeId, postalCode"
            .split(", ")
            .forEach((k) => {
              if (item.pickupAddress[k] === undefined) {
                isFormValid = false;
                formErrors.pickupAddress[item.uid || index.toString()] = !isFormValid;
              }
            });
        } else {
          isFormValid = false;
        }
      });
    }

    this.setState({ isFormValid, formErrors });

    return isFormValid;
  };

  submitClickHandle = async () => {
    const { addDeliveryMethods, deliveryMethods } = this.props;
    const { deliveryMethod } = this.state;

    if (deliveryMethods.loading) return;

    let isValid = this.validate();
    if (isValid) {
      addDeliveryMethods(deliveryMethod);
    }
  };

  renderPickupAddressErrors = (key: string) => {
    const { t } = this.props;
    const { formErrors } = this.state;
    const error = formErrors.pickupAddress ? formErrors.pickupAddress[key] : false;

    return error ? (
      <div slot="root-end" className="item-input-error-message">
        {t("Please specify full address (including address line)")}
      </div>
    ) : null;
  };

  render() {
    const { t, onPopupOpen, onPopupClosed, currency, deliveryMethods, ...rest } = this.props;
    const { deliveryMethod, deliveryOptionUid, isFormValid } = this.state;
    const deliveryOption = deliveryMethod.options.filter(
      (item, i) => item.uid === deliveryOptionUid || i.toString() === deliveryOptionUid
    )[0];

    const submitButtonStyles = {
      opacity: isFormValid && !deliveryMethods.loading ? 1 : 0.3,
    };

    return (
      <Popup
        id="add_pickup_point__popup"
        className="add_pickup_point__popup"
        {...rest}
        onPopupOpen={this.onPopupOpenHandle}
        onPopupClosed={(instance) => {
          const {
            deliveryMethods: { item },
          } = this.props;
          onPopupClosed(instance, item);
        }}
      >
        <Navbar backLink={false} noHairline noShadow sliding>
          <NavLeft>
            <Link
              iconOnly
              onClick={() => {
                if (!deliveryMethods.loading) this.$f7.popup.close();
              }}
            >
              <Icon className="icon-back" />
            </Link>
          </NavLeft>
          <NavTitle>{t("New Pick-up Point")}</NavTitle>
        </Navbar>
        {this.props.opened && (
          <Page style={{ paddingTop: 0 }}>
            <Block>
              {t("You can specify the addresses of places where the buyer can pick up the product")}
            </Block>
            {deliveryMethod && (
              <>
                <List noHairlines form>
                  <ListInput
                    name="name"
                    label={t("Pick-up Name").toString()}
                    floatingLabel
                    type="text"
                    placeholder="Pick-up Name"
                    clearButton
                    slot="list"
                    onBlur={this.blurInputHandle}
                    defaultValue={this.getDefaultValue("name")}
                    {...this.getErrorProps("name")}
                    disabled={deliveryMethods.loading}
                  />
                </List>
                {deliveryMethod.options.map((item, i) => {
                  const itemKey = item.uid || i.toString();
                  return (
                    <div key={itemKey}>
                      <BlockTitle
                        medium
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>{t("Pick-up from")}</span>
                        {deliveryMethod.options && deliveryMethod.options.length > 1 && (
                          <Link
                            iconMaterial="delete_outline"
                            iconOnly
                            onClick={() => {
                              this.$f7.dialog.confirm(t("Really?"), () => {
                                deliveryMethod.options = deliveryMethod.options.filter(
                                  (o, _i) => _i !== i
                                );
                                this.setState(
                                  {
                                    deliveryOptionUid: null,
                                    deliveryMethod: _.cloneDeep(deliveryMethod),
                                  },
                                  () => this.validate()
                                );
                              });
                            }}
                          ></Link>
                        )}
                      </BlockTitle>
                      <List noHairlines form>
                        <ListItem
                          link="#"
                          onClick={() =>
                            this.setState({
                              chooseCountryPopupOpened: true,
                              deliveryOptionUid: itemKey,
                            })
                          }
                          title={
                            !item.pickupAddress
                              ? t("Address").toString()
                              : Object.keys(item.pickupAddress)
                                  .filter((key) => !"coordinates, placeId".includes(key))
                                  .map((key) => item.pickupAddress[key])
                                  .filter((field) => !!field)
                                  .join(", ")
                          }
                          footer={t("required").toString()}
                          slot="list"
                          className="address-item"
                        >
                          {this.renderPickupAddressErrors(itemKey)}
                        </ListItem>
                        <ListInput
                          name="description"
                          label={t("Comment").toString()}
                          floatingLabel
                          type="textarea"
                          placeholder={t("Comment")}
                          clearButton
                          resizable
                          slot="list"
                          onBlur={(e) => this.blurInputHandle(e, itemKey)}
                          defaultValue={this.getDefaultValue("description", itemKey)}
                          {...this.getErrorProps("description", null, itemKey)}
                          disabled={deliveryMethods.loading}
                        />
                        <ListItem slot="list">
                          <Row style={{ flexGrow: 1 }}>
                            <Col className="item-input">
                              <a
                                className="item-link"
                                href="#"
                                onClick={() =>
                                  this.setState({
                                    deliveryPriceSheetOpened: true,
                                    deliveryOptionUid: itemKey,
                                  })
                                }
                              >
                                <div className="item-content">
                                  <div className="item-inner">
                                    <div className="item-title">
                                      {item.price == 0 ? "Free" : item.price}
                                      <div className="item-footer">required</div>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </Col>
                            <Col className="item-input">
                              <a
                                className="item-link"
                                href="#"
                                onClick={() =>
                                  this.setState({
                                    deliveryTimeSheetOpened: true,
                                    deliveryOptionUid: itemKey,
                                  })
                                }
                              >
                                <div className="item-content">
                                  <div className="item-inner">
                                    <div className="item-title">
                                      {!item.deliveryTimeDaysMax === null ||
                                      item.deliveryTimeDaysMin === null ||
                                      item.deliveryTimeDaysMin === 0 ||
                                      item.deliveryTimeDaysMax === 0
                                        ? "Delivery time"
                                        : t(
                                            `${item.deliveryTimeDaysMin}-${item.deliveryTimeDaysMax} days`
                                          )}
                                      <div className="item-footer">required</div>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </Col>
                          </Row>
                        </ListItem>
                      </List>
                    </div>
                  );
                })}

                <List noHairlines className="no-margin-top no-margin-bottom">
                  <ListItem
                    className="item-add-link no-margin-bottom"
                    link
                    title={t("Add specific addresses & prices").toString()}
                    noChevron
                    onClick={() => {
                      deliveryMethod.options.push({
                        currencyCode: currency.code,
                        countries: [],
                        price: 0,
                        deliveryTimeDaysMax: null,
                        deliveryTimeDaysMin: null,
                      });

                      this.setState(
                        {
                          deliveryOptionUid: null,
                          deliveryMethod: _.cloneDeep(deliveryMethod),
                        },
                        () => this.validate()
                      );
                    }}
                  >
                    <span slot="media">
                      <Icon ios="f7:plus" md="material:add" />
                    </span>
                  </ListItem>
                </List>

                <DeliveryPriceSheet
                  opened={this.state.deliveryPriceSheetOpened}
                  value={
                    deliveryOption
                      ? {
                          isFreeDelivery: deliveryOption.price === 0, // TODO ->> to remove??????????????
                          price: deliveryOption.price,
                        }
                      : null
                  }
                  onSheetClosed={(instance, value) => {
                    const { price } = value;
                    const { deliveryMethod } = this.state;
                    if (deliveryOption) {
                      deliveryOption.price = price;
                    }

                    this.setState(
                      {
                        deliveryOptionUid: null,
                        deliveryMethod: _.cloneDeep(deliveryMethod),
                        deliveryPriceSheetOpened: false,
                      },
                      () => this.validate()
                    );
                  }}
                />

                <DeliveryTimeSheet
                  opened={this.state.deliveryTimeSheetOpened}
                  value={
                    deliveryOption &&
                    deliveryOption.deliveryTimeDaysMin &&
                    deliveryOption.deliveryTimeDaysMax
                      ? {
                          min: deliveryOption.deliveryTimeDaysMin,
                          max: deliveryOption.deliveryTimeDaysMax,
                        }
                      : { min: 0, max: 0 }
                  }
                  onSheetClosed={(instance, value) => {
                    const { min, max } = value;
                    const { deliveryMethod } = this.state;
                    if (deliveryOption && min !== 0 && max !== 0) {
                      (deliveryOption.deliveryTimeDaysMin = min),
                        (deliveryOption.deliveryTimeDaysMax = max);
                    }

                    this.setState(
                      {
                        deliveryOptionUid: null,
                        deliveryMethod: _.cloneDeep(deliveryMethod),
                        deliveryTimeSheetOpened: false,
                      },
                      () => this.validate()
                    );
                  }}
                />

                <MapPopup
                  title={t("Pick-up Address")}
                  initialized={this.state.chooseCountryPopupOpened}
                  opened={this.state.chooseCountryPopupOpened}
                  onPopupClosed={() => {
                    this.setState(
                      {
                        deliveryOptionUid: null,
                        chooseCountryPopupOpened: false,
                      },
                      () => this.validate()
                    );
                  }}
                  onLocationSelect={(position, place, placeId, address) => {
                    const { deliveryMethod } = this.state;
                    if (deliveryOption) {
                      deliveryOption.pickupAddress = {
                        placeId,
                        ...address,
                        coordinates: position.lat + ", " + position.lng,
                      };
                    }
                    this.setState(
                      {
                        deliveryMethod: _.cloneDeep(deliveryMethod),
                        chooseCountryPopupOpened: false,
                      },
                      () => this.validate()
                    );
                  }}
                />
              </>
            )}

            <Fab
              position="right-bottom"
              onClick={this.submitClickHandle}
              style={submitButtonStyles}
              slot="fixed"
            >
              <Icon ios={"f7:checkmark_alt"} md={"material:check"} />
            </Fab>
          </Page>
        )}
      </Popup>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  profile: state.sessionReducer.profile,
  countryClassificator: state.classificatorReducer.countryClassificator,
  deliveryMethods: state.deliveryMethodsReducer,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      addDeliveryMethods,
    },
    dispatch
  );

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(AddPickupPointPopup) as React.ComponentClass<Props>;
