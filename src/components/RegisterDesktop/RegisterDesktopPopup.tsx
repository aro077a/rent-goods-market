import React from "react";
import { withTranslation } from "react-i18next";
import {
  Popup,
  Page,
  Navbar,
  NavRight,
  Link,
  Block,
  List,
  Button,
  ListItem,
  Row,
  Col,
  F7Input,
  F7ListItem,
} from "framework7-react";
import { connect } from "react-redux";
import { compose } from "redux";
import cn from "classnames";

import {
  register,
  validateRequest,
  RequiredRegField,
  changeRegistrationRequest,
} from "@/actions/sessionActions";
import { CreateAccountRequest, CreateAccountField } from "@/reducers/sessionReducer";
import connectFilter from "@/store/connectFilter";
import { IApplicationStore } from "@/store/rootReducer";
import { CustomInput } from "@/components/CustomInput";
import { CustomSelect, CustomSelectValue } from "@/components/CustomSelect";
import { CountrySelectPopup } from "@/components/CountrySelectPopup";
import { IcClose } from "@/components-ui/icons";
import { equalItemsInArrays, isDefined } from "@/utils";
import { phoneCodes } from "@/pages/add-business-account/addCompanyInformation/phone-codes";

import {
  RegisterDesktopPopupMapProps,
  RegisterDesktopPopupProps,
  RegisterDesktopPopupState,
  RegSteps,
} from "./RegisterDesktopPopup.types";
import { authDataFields, personalInfoFields, successMessage } from "./constants";

import "./RegisterDesktopPopup.less";

class RegisterDesktopPopup extends React.Component<
  RegisterDesktopPopupMapProps,
  RegisterDesktopPopupState
> {
  constructor(props: Readonly<RegisterDesktopPopupMapProps>) {
    super(props);
    this.state = {
      step: RegSteps.PERSONAL_INFO,
      nextStep: RegSteps.AUTH_DATA,
      country: undefined,
      isCountrySelectPopupOpened: false,
      phoneCode: undefined,
    };
    this.openCountryPopup.bind(this);
    this.closeCountryPopup.bind(this);
  }

  componentDidUpdate(prevProps: RegisterDesktopPopupMapProps) {
    const { registrationLoading } = this.props;
    if (prevProps.registrationLoading && !registrationLoading) {
      this.$f7.preloader.hide();
    }
    this.handleRegister(prevProps);
  }

  handleRegister = (prevProps: RegisterDesktopPopupMapProps) => {
    const { step, nextStep } = this.state;
    const { registrationLoading, error, formErrors, registered, t } = this.props;

    if (error && error !== prevProps.error) {
      if (registrationLoading) {
        this.$f7.preloader.hide();
      }
      this.$f7.dialog.alert(t(error));
    }

    if (!registrationLoading && prevProps.registrationLoading && formErrors.length) {
      formErrors.forEach((err) => {
        const errorFields = err.parameters;
        switch (true) {
          case equalItemsInArrays(errorFields, authDataFields):
            this.setState({
              step: RegSteps.AUTH_DATA,
              nextStep: RegSteps.AUTH_DATA,
            });
            break;

          case equalItemsInArrays(errorFields, personalInfoFields):
            this.setState({
              step: RegSteps.PERSONAL_INFO,
              nextStep: RegSteps.PERSONAL_INFO,
            });
            break;

          default:
            break;
        }
      });
    }

    if (!registrationLoading && prevProps.registrationLoading && !error && !formErrors.length) {
      if (nextStep > step) {
        this.setState({
          step: nextStep,
          nextStep: nextStep,
        });
      }

      if (registrationLoading) {
        this.$f7.preloader.hide();
      }
    }

    if (!registrationLoading && prevProps.registrationLoading && registered) {
      this.$f7.dialog.alert(t(successMessage), () => {
        this.$f7.popup.close();
      });
    }
  };

  handleRegisterClick = () => {
    const { registrationLoading, request } = this.props;
    if (!registrationLoading) {
      this.$f7.preloader.show();
    }
    this.props.register(request);
  };

  getDefaultValue = (fieldName: RequiredRegField, defaultValue = "") => {
    const { request } = this.props;

    return isDefined(request[fieldName]) ? request[fieldName].toString() : defaultValue;
  };

  handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const request = { ...this.props.request };

    if (!name || !type) {
      throw new Error("Name or type for field is not defined!");
    }

    try {
      switch (type) {
        case "number":
          request[name] = parseFloat(value);
          break;
        case "checkbox":
          request[name] = e.target.checked;
          break;
        default: {
          request[name] = value;
        }
      }
      this.props.changeRequest(request);
    } catch (err) {
      console.error(err);
    }
  };

  handleCountryChange = (country: CustomSelectValue) => {
    this.setState({ country });
    this.props.changeRequest({ ...this.props.request, country: country.value });
  };

  handlePhoneCodeChange = (phoneCode: CustomSelectValue) => {
    this.setState({ phoneCode });
    this.props.changeRequest({
      ...this.props.request,
      mobilePhone: { countryCode: phoneCode.label },
    });
  };

  getErrorProps = (fieldName: RequiredRegField): Partial<F7Input.Props> => {
    const { t, formErrors } = this.props;

    const fieldError = formErrors.find((err) => err.parameters.includes(fieldName));

    const errorMessage = t(fieldError?.message || "Please fill out this field.");

    return {
      info: t("Required").toString(),
      required: true,
      validateOnBlur: true,
      errorMessage,
    };
  };

  handleNextStep = () => {
    const { registrationLoading, request, formErrors } = this.props;
    const { step } = this.state;

    if (!registrationLoading) {
      this.$f7.preloader.show();
    }

    switch (step) {
      case RegSteps.AUTH_DATA:
        this.setState({
          nextStep: RegSteps.PERSONAL_INFO,
        });
        this.props.validateRequest(request, authDataFields);
        break;
      case RegSteps.PERSONAL_INFO:
        this.props.validateRequest(request, personalInfoFields);
        if (!formErrors.length) {
          this.handleRegisterClick();
        }
        break;
    }
  };

  handlePrevStep = () => {
    const { step } = this.state;

    if (step > RegSteps.AUTH_DATA) {
      const prevStep = step - 1;
      this.setState({
        step: prevStep,
        nextStep: prevStep,
      });
    }
  };

  getAcceptLinkUrl = (code: string) => {
    const { urls } = this.props;
    const filtered = urls.filter((u) => u.code === code);
    return filtered.length > 0 ? filtered[0].value : "#";
  };

  openCountryPopup = () => this.setState({ isCountrySelectPopupOpened: true });

  closeCountryPopup = () => this.setState({ isCountrySelectPopupOpened: false });

  render() {
    const { step } = this.state;
    const { className, t, ...props } = this.props;

    return (
      <>
        <Popup {...props} className={cn("register-popup", className)}>
          <Page>
            <Navbar noShadow noHairline>
              <NavRight className={cn("register-popup-close")}>
                <Link popupClose className={cn("register-popup-close__link")}>
                  <IcClose />
                </Link>
              </NavRight>
            </Navbar>
            <Block className="register-form-block">
              <List
                noHairlines
                form
                className={cn("register-form-list", {
                  "form-list-visible": step === RegSteps.AUTH_DATA,
                })}
              >
                <Block className="register-popup__title">{t("Register")}</Block>
                <div className="register-popup__item">
                  <CustomInput
                    name="email"
                    label={t("E-mail").toString()}
                    floatingLabel
                    type="email"
                    clearButton
                    slot="list"
                    onBlur={this.handleInputBlur}
                    defaultValue={this.getDefaultValue("email")}
                    {...this.getErrorProps("email")}
                  />
                </div>
                <div className="register-popup__item phone-inputs">
                  <CustomSelect
                    className="phone-inputs__code"
                    value={this.state.phoneCode}
                    options={phoneCodes}
                    onChange={this.handlePhoneCodeChange}
                    validate
                    label={t("Code")}
                  />
                  <CustomInput
                    className="phone-inputs__number"
                    name="phone"
                    label={t("Mobile Phone").toString()}
                    floatingLabel
                    type="number"
                    // ! autocomplete === "off" because number !== phone
                    autocomplete="off"
                    clearButton
                    slot="list"
                    onBlur={this.handleInputBlur}
                    defaultValue={this.getDefaultValue("phone")}
                    {...this.getErrorProps("phone")}
                  />
                </div>
                <div className="register-popup__item">
                  <CustomInput
                    name="password"
                    label={t("Password").toString()}
                    floatingLabel
                    type="password"
                    clearButton
                    slot="list"
                    onBlur={this.handleInputBlur}
                    defaultValue={this.getDefaultValue("password")}
                    {...this.getErrorProps("password")}
                  />
                </div>
                <div className="register-popup__item">
                  <CustomInput
                    name="passwordRepeat"
                    label={t("Repeat Password").toString()}
                    floatingLabel
                    type="password"
                    clearButton
                    slot="list"
                    onBlur={this.handleInputBlur}
                    defaultValue={this.getDefaultValue("passwordRepeat")}
                    {...this.getErrorProps("passwordRepeat")}
                  />
                </div>
                <ListItem
                  name="accept"
                  checkbox
                  onChange={this.handleInputBlur}
                  checked={this.props.request.accept}
                  className="accept-checkbox"
                  {...(this.getErrorProps("accept") as F7ListItem.Props)}
                >
                  <div className="item-title">
                    {t("You agree with our")}&nbsp;
                    <Link
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        window.open(this.getAcceptLinkUrl("PrivacyPolicy"));
                      }}
                    >
                      {t("PrivacyPolicy")}
                    </Link>
                    &nbsp;
                    {t("and")}&nbsp;
                    <Link
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        window.open(this.getAcceptLinkUrl("TermsAndConditions"));
                      }}
                    >
                      {t("TermsAndConditions")}
                    </Link>
                    &nbsp;
                  </div>
                </ListItem>
              </List>

              <List
                noHairlines
                form
                className={cn("register-form-list", {
                  "form-list-visible": step === RegSteps.PERSONAL_INFO,
                })}
              >
                <div className="register-popup__item">
                  <CustomInput
                    name="firstName"
                    label={t("First Name").toString()}
                    floatingLabel
                    type="text"
                    clearButton
                    slot="list"
                    onBlur={this.handleInputBlur}
                    onInput={(e) => (e.target.errorMessage = null)}
                    defaultValue={this.getDefaultValue("firstName")}
                    {...this.getErrorProps("firstName")}
                  />
                </div>
                <div className="register-popup__item">
                  <CustomInput
                    name="lastName"
                    label={t("Surname").toString()}
                    floatingLabel
                    type="text"
                    clearButton
                    slot="list"
                    onBlur={this.handleInputBlur}
                    defaultValue={this.getDefaultValue("lastName")}
                    {...this.getErrorProps("lastName")}
                  />
                </div>
                <div className="register-popup__item register-popup__country-select">
                  <CustomSelect
                    options={this.props.countries}
                    validate
                    errorMessage={this.getErrorProps("country").errorMessage}
                    value={this.state.country}
                    onChange={this.handleCountryChange}
                    label={t("Country")}
                    openPopup={this.openCountryPopup}
                  />
                </div>
                <div className="register-popup__item">
                  <CustomInput
                    name="referalCode"
                    label={t("Referal Code").toString()}
                    floatingLabel
                    type="text"
                    clearButton
                    slot="list"
                    onBlur={this.handleInputBlur}
                    defaultValue={this.getDefaultValue("referalCode")}
                    {...this.getErrorProps("referalCode")}
                  />
                </div>
              </List>

              <Block className="register-popup__bottom-btns">
                <Row>
                  {step > RegSteps.AUTH_DATA && (
                    <Col>
                      <Button
                        large
                        round
                        raised
                        onClick={this.handlePrevStep}
                        disabled={this.props.registrationLoading}
                      >
                        {t("Back")}
                      </Button>
                    </Col>
                  )}
                  <Col>
                    <Button
                      fill
                      large
                      round
                      raised
                      onClick={this.handleNextStep}
                      disabled={this.props.registrationLoading}
                    >
                      {t("Continue")}
                    </Button>
                  </Col>
                </Row>
              </Block>
            </Block>
          </Page>
        </Popup>
        {this.props.isSmallScreen && (
          <CountrySelectPopup
            opened={this.state.isCountrySelectPopupOpened}
            onCountrySelect={(country) =>
              this.handleCountryChange({ value: country.code, label: country.name })
            }
            onPopupClosed={this.closeCountryPopup}
            closeOnChoose={false}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  countries: state.classificatorReducer.countryClassificator.map(({ code, name }) => ({
    value: code,
    label: name,
  })),
  loading: state.sessionReducer.loading,
  registrationLoading: state.sessionReducer.registrationLoading,
  error: state.sessionReducer.error,
  formErrors: state.sessionReducer.formErrors,
  request: state.sessionReducer.request,
  registered: state.sessionReducer.registered,
  urls: state.classificatorReducer.entitiesClassificators.Url_app,
  isSmallScreen: state.rootReducer.resizeEvent.width < 630,
});

const mapDispatchToProps = (dispatch) => ({
  register: (request: CreateAccountRequest) => dispatch(register(request)),
  validateRequest: (request: CreateAccountRequest, fields: CreateAccountField[]) =>
    dispatch(validateRequest(request, fields)),
  changeRequest: (request: Partial<CreateAccountRequest>) =>
    changeRegistrationRequest(dispatch, request),
});

export default compose<React.FC<RegisterDesktopPopupProps>>(
  connectFilter,
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(RegisterDesktopPopup);
