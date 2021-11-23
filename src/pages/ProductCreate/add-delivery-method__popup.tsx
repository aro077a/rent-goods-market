import React, { Component } from "react";
import {
  Popup,
  Navbar,
  NavLeft,
  Link,
  Icon,
  NavTitle,
  List,
  ListItem,
  Block,
  Page,
  BlockTitle,
  Row,
  Col,
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
import ChooseCountryPopup from "./choose-country__popup";
import { DeliveryMethod } from "../../types/marketplaceapi";
import _ from "lodash";
import { Currency } from "../../types/commonapi";
import { addDeliveryMethods } from "../../actions/deliveryMethodsActions";

type Props = Omit<Popup.Props, "onPopupClosed"> &
  Partial<ReturnType<typeof mapStateToProps>> &
  Partial<ReturnType<typeof mapDispatchToProps>> & {
    onPopupClosed?(instance: any, uid: string | DeliveryMethod): void;
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
  uid?: string;
};

class AddDeliveryMethodPopup extends Component<WithTranslation & Props, State> {
  private _saved: boolean;
  constructor(props: Readonly<WithTranslation & Props>) {
    super(props);
    this.state = {
      formErrors: {},
      isFormValid: false,
      deliveryPriceSheetOpened: false,
      deliveryTimeSheetOpened: false,
      chooseCountryPopupOpened: false,
      deliveryMethod: this.getInitDeliveryMethod(props.currency),
      uid: null,
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
    console.log("init empty delivery method");
    return _.cloneDeep({
      name: null,
      type: DeliveryMethod.TypeEnum.DELIVERY,
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
    this.setState(
      {
        deliveryMethod: deliveryMethod
          ? _.cloneDeep(deliveryMethod)
          : this.getInitDeliveryMethod(this.props.currency), // TODO ->> ,
        uid: null,
      },
      () => {
        this.validate();
      }
    );
    if (onPopupOpen) onPopupOpen(instance);
    this._saved = false;
  };

  blurInputHandle = (e: { target: { name: any; value: any; type: any; checked: boolean } }) => {
    const { name, value } = e.target;
    const { deliveryMethod } = this.state;
    deliveryMethod[name] = value;
    this.setState({ deliveryMethod }, () => this.validate());
  };

  getDefaultValue = (field: string) => this.state.deliveryMethod[field];

  getErrorProps = (fieldName: string, properties?: any) => {
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
    const { deliveryMethod } = this.state;
    let isFormValid = true;

    if (!deliveryMethod.name || deliveryMethod.name.length === 0) {
      isFormValid = false;
    }

    if (deliveryMethod.options && deliveryMethod.options.length) {
      deliveryMethod.options.forEach((item) => {
        if (
          !item.countries ||
          !item.countries.length ||
          item.deliveryTimeDaysMin === 0 ||
          item.deliveryTimeDaysMin === null ||
          item.deliveryTimeDaysMax === 0 ||
          item.deliveryTimeDaysMax === null
        ) {
          isFormValid = false;
        }
      });
    }

    this.setState({ isFormValid });
    return isFormValid;
  };

  submitClickHandle = async () => {
    const { addDeliveryMethods, deliveryMethods } = this.props;
    const { deliveryMethod } = this.state;

    if (deliveryMethods.loading) return;

    let isValid = this.validate();
    if (isValid) {
      this._saved = true;
      addDeliveryMethods(deliveryMethod);
    }
  };

  getExcludedCountries = () => {
    const { deliveryMethod } = this.state;
    const { uid } = this.state;
    if (
      uid &&
      deliveryMethod &&
      deliveryMethod.type === DeliveryMethod.TypeEnum.DELIVERY &&
      deliveryMethod.options
    ) {
      const excludedCountries = deliveryMethod.options
        .filter((item, i) =>
          item.uid ? item.uid.toString() !== uid.toString() : i.toString() !== uid.toString()
        )
        .reduce((p, c) => {
          return [...p, ...(c.countries ? c.countries : [])];
        }, []);
      console.log(uid, excludedCountries);
      return excludedCountries;
    }

    return [];
  };

  render() {
    const { t, onPopupOpen, onPopupClosed, currency, deliveryMethods, ...rest } = this.props;
    const { deliveryMethod, uid, isFormValid } = this.state;
    const deliveryOption = deliveryMethod
      ? deliveryMethod.options.filter((item, i) => item.uid === uid || i.toString() === uid)[0]
      : null;

    const submitButtonStyles = {
      opacity: isFormValid && !deliveryMethods.loading ? 1 : 0.3,
    };

    return (
      <Popup
        id="add_delivery_method__popup"
        className="add_delivery_method__popup"
        {...rest}
        onPopupOpen={this.onPopupOpenHandle}
        onPopupClosed={(instance) => {
          const { deliveryMethod } = this.state;
          const updatedDeliveryMethod = this.props.deliveryMethods.item
            ? this.props.deliveryMethods.item
            : {};
          this.setState({ deliveryMethod: null });
          onPopupClosed(
            instance,
            this._saved ? { ...deliveryMethod, ...updatedDeliveryMethod } : null
          );
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
          <NavTitle>{t("New delivery method")}</NavTitle>
        </Navbar>
        {this.props.opened && (
          <Page style={{ paddingTop: 0 }}>
            <Block>
              {t("You can set different delivery price and delivery period for specific countries")}
            </Block>
            {deliveryMethod && (
              <>
                <List noHairlines form>
                  <ListInput
                    name="name"
                    label={t("Delivery method's Name").toString()}
                    floatingLabel
                    type="text"
                    placeholder="Delivery option"
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
                        <span>{t("Ship to")}</span>
                        {deliveryMethod.options && deliveryMethod.options.length > 1 && (
                          <Link
                            iconMaterial="delete_outline"
                            iconOnly
                            onClick={() => {
                              this.$f7.dialog.confirm(t("Really?"), () => {
                                deliveryMethod.options = deliveryMethod.options.filter(
                                  (_o, _i) => _i !== i
                                );
                                this.setState(
                                  {
                                    uid: null,
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
                              uid: itemKey,
                            })
                          }
                          title={
                            !item.countries || !item.countries.length
                              ? t("Countries").toString()
                              : item.countries.map((item) => item.name).join(", ")
                          }
                          footer={t("required").toString()}
                          slot="list"
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
                                    uid: itemKey,
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
                                    uid: itemKey,
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
                    title={t("Add specific countries & prices").toString()}
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
                          uid: null,
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
                  onSheetClosed={(_instance, value) => {
                    const { price } = value;
                    const { deliveryMethod } = this.state;
                    if (deliveryOption) {
                      deliveryOption.price = price;
                    }

                    this.setState(
                      {
                        uid: null,
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
                  onSheetClosed={(_instance, value) => {
                    const { min, max } = value;
                    const { deliveryMethod } = this.state;
                    if (deliveryOption && min !== 0 && max !== 0) {
                      (deliveryOption.deliveryTimeDaysMin = min),
                        (deliveryOption.deliveryTimeDaysMax = max);
                    }

                    this.setState(
                      {
                        uid: null,
                        deliveryMethod: _.cloneDeep(deliveryMethod),
                        deliveryTimeSheetOpened: false,
                      },
                      () => this.validate()
                    );
                  }}
                />

                <ChooseCountryPopup
                  opened={this.state.chooseCountryPopupOpened}
                  selectedCountries={
                    deliveryOption && deliveryOption.countries
                      ? deliveryOption.countries.map((c) => c.code)
                      : []
                  }
                  excludedCountries={this.getExcludedCountries()}
                  onPopupClosed={(selectedCountries) => {
                    const { deliveryMethod } = this.state;
                    if (deliveryOption) {
                      deliveryOption.countries = [
                        ...selectedCountries.map((code) => {
                          const country = this.props.countryClassificator.filter(
                            (c) => c.code === code
                          )[0];
                          // TODO: typing! ->>>>>>>>>>>>>>>>>>>>>.
                          return {
                            code: country.code,
                            name: country.name,
                            excluded: false,
                          };
                        }),
                      ];
                    }

                    this.setState(
                      {
                        uid: null,
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
)(AddDeliveryMethodPopup) as React.ComponentClass<Props>;
