import React, { Component } from "react";
import {
  Page,
  List,
  ListItem,
  Row,
  Col,
  Fab,
  Icon,
  Popup,
  Block,
  BlockTitle,
  PageContent,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { connect } from "react-redux";
import cloneDeep from "lodash/cloneDeep";

import { ListInput } from "@/components/ListInput";
import { IApplicationStore } from "@/store/rootReducer";
import { Address, Country } from "@/types/commonapi";
import connectAccountAddress, { IAccountAddressProps } from "@/store/connectAccountAddress";
import connectProfile from "@/store/connectProfile";
import { Profile } from "@/reducers/sessionReducer";
import { ThemedButton } from "@/components/ThemedButton";
import SmallModalHeader from "@/components-ui/small-modal-header";

type Props = WithTranslation &
  IAccountAddressProps & {
    address: Address;
    saveInfoByDefault?: boolean;
    onPopupClosed(instance?: any, chooseCountry?: boolean): void;
    country?: Country;
    reset?: boolean;
    onAddOrUpdateInfo?(address: Address): void;
    profile: Profile;
  };

type State = Pick<Address, "country" | "city" | "firstAddressLine" | "postalCode"> & {
  initAddress: boolean;
  initCountry: boolean;
  uid: string;
  name?: string;
  surname?: string;
  email?: string;
  formErrors?: any;
  formValidFields?: any;
  formValid: boolean;
  saveInfo?: boolean;
  chooseCountry?: boolean;
};

const initialState: State = {
  initAddress: false,
  initCountry: false,
  uid: null,
  country: null,
  name: "",
  surname: "",
  email: "",
  city: "",
  firstAddressLine: "",
  postalCode: "",
  formErrors: {
    name: "",
    surname: "",
    email: "",
    country: "",
    city: "",
    firstAddressLine: "",
    postalCode: "",
  },
  formValidFields: {
    name: false,
    surname: false,
    email: false,
    country: false,
    city: false,
    firstAddressLine: false,
    postalCode: false,
  },
  formValid: false,
  chooseCountry: false,
};

class DeliveryEdit extends Component<Props & Omit<Popup.Props, "onPopupClosed">, State> {
  constructor(props: Readonly<WithTranslation & Props & Popup.Props>) {
    super(props);
    this.state = {
      ...cloneDeep(initialState),
      ...this.props.address,
      saveInfo: props.saveInfoByDefault,
      country: props.country,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const result = {};

    if (nextProps.address && prevState.uid === null && nextProps.address.uid) {
      result["uid"] = nextProps.address.uid;
    }

    if (nextProps.address && prevState.name === "" && nextProps.address.name) {
      result["name"] = nextProps.address.name;
    }

    if (nextProps.address && prevState.surname === "" && nextProps.address.surname) {
      result["surname"] = nextProps.address.surname;
    }

    if (nextProps.address && prevState.email === "" && nextProps.address.email) {
      result["email"] = nextProps.address.email;
    }

    if (nextProps.address && prevState.city === "" && nextProps.address.city) {
      result["city"] = nextProps.address.city;
    }

    if (
      nextProps.address &&
      prevState.firstAddressLine === "" &&
      nextProps.address.firstAddressLine
    ) {
      result["firstAddressLine"] = nextProps.address.firstAddressLine;
    }

    if (nextProps.address && prevState.postalCode === "" && nextProps.address.postalCode) {
      result["postalCode"] = nextProps.address.postalCode;
    }

    if (nextProps.address && prevState.country === null && nextProps.address.country !== null) {
      result["country"] = nextProps.address.country;
    }

    if (nextProps.country) {
      result["country"] = nextProps.country;
    }

    if (Object.keys(result).length > 0) return result;
    return null;
  }

  handlePopupOpen = (instance: any) => {
    const { profile } = this.props;
    const primaryEmail =
      profile && profile.accountEmails
        ? profile.accountEmails.filter((item) => item.primary)[0]
        : null;

    if (this.props.reset) {
      this.setState({
        ...cloneDeep(initialState),
        country: this.props.country,
        name: profile && profile.person ? profile.person.name : "",
        surname: profile && profile.person ? profile.person.surname : "",
        email: primaryEmail ? primaryEmail.email : "",
      });
    } else {
      this.setState({
        country: this.props.country,
        formValidFields: {
          ...this.state.formValidFields,
          country: !!this.props.country,
        },
      });
    }
    if (this.props.onPopupOpen) this.props.onPopupOpen(instance);
  };

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.accountAddressState.accountAddOrUpdateAddressLoading &&
      !this.props.accountAddressState.accountAddOrUpdateAddressLoading &&
      !this.props.accountAddressState.accountAddOrUpdateAddressError
    ) {
      this.$f7.preloader.hide();
      this.$f7.popup.close();
    }

    if (
      (this.props.accountAddressState.accountAddOrUpdateAddressError &&
        prevProps.accountAddressState.accountAddOrUpdateAddressError !==
          this.props.accountAddressState.accountAddOrUpdateAddressError) ||
      (this.props.accountAddressState.accountRemoveAddressError &&
        prevProps.accountAddressState.accountRemoveAddressError !==
          this.props.accountAddressState.accountRemoveAddressError)
    ) {
      this.$f7.dialog.alert("Error on add/update address!");
      this.$f7.preloader.hide();
    }
  }

  handleBlurInput = (e: any) => this.handleUserInput(e);

  handleUserInput = (e: any) => {
    let { name, value, rawValue = null } = e.target;
    value = rawValue !== null && name !== "expireDate" ? rawValue : value;
    // @ts-ignore
    this.setState({ [name]: value }, () => this.validateField(name, value));
  };

  handleInputClear = (e: any) => {
    let { name } = e.target;
    // @ts-ignore
    this.setState({ [name]: "" }, () => this.validateField(name, ""));
  };

  validateField = (fieldName: keyof State, value: string) => {
    const { t } = this.props;
    let formValidFields = this.state.formValidFields;
    let fieldValidationErrors = this.state.formErrors;
    let errorText = "";
    let requiredFieldErrorText = t("Please fill out this field.");

    if (
      "name, surname, email, city, address, zip, postalCode, firstAddressLine"
        .split(", ")
        .includes(fieldName)
    ) {
      errorText = value.length ? errorText : requiredFieldErrorText;
      fieldValidationErrors[fieldName] = errorText;
      formValidFields[fieldName] = !errorText.length;
    }

    if (fieldName === "country" && !this.state.country) {
      errorText = requiredFieldErrorText;
      fieldValidationErrors[fieldName] = errorText;
      formValidFields[fieldName] = !errorText.length;
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

  handleAddOrUpdateInfo = () => {
    const { city, country, firstAddressLine, postalCode, uid } = this.state;
    this.$f7.preloader.show();
    this.props.addOrUpdateAccountAddress(
      {
        city,
        country,
        postalCode,
        firstAddressLine,
        uid,
      },
      true
    );
  };

  render() {
    const {
      t,
      saveInfoByDefault,
      accountAddressState: { accountAddOrUpdateAddressLoading },
      ...rest
    } = this.props;
    return (
      <Popup
        id="delivery_info_edit__popup"
        swipeToClose
        {...rest}
        onPopupOpen={this.handlePopupOpen}
        onPopupClosed={(instance: any) => {
          if (this.props.onPopupClosed) {
            this.props.onPopupClosed(instance, this.state.chooseCountry);
          }
          this.setState({ chooseCountry: false });
        }}
      >
        <Page pageContent={false}>
          <SmallModalHeader popupClose title={t("Edit Delivery Information")} />
          <PageContent>
            <BlockTitle medium>{t("Contacts")}</BlockTitle>
            <List noHairlinesMd form noHairlinesBetweenMd>
              <ListItem slot="list">
                <Row style={{ width: "100%" }}>
                  <Col width={100} medium={50}>
                    <ListItem
                      link
                      header={t("Country").toString()}
                      title={
                        this.state.country
                          ? this.state.country.name
                          : t("Choose country").toString()
                      }
                      onClick={() => {
                        this.setState({ chooseCountry: true }, () => {
                          this.$f7.popup.close();
                        });
                      }}
                    />
                  </Col>
                  <Col width={100} medium={50}>
                    <ListInput
                      wrap={false}
                      name="city"
                      label={t("City").toString()}
                      floatingLabel
                      type="text"
                      placeholder=""
                      clearButton
                      disabled={accountAddOrUpdateAddressLoading}
                      required
                      onBlur={this.handleBlurInput}
                      onChange={this.handleUserInput}
                      onInputClear={this.handleInputClear}
                      value={this.state.city}
                      {...this.getErrorMessagesProps("city")}
                    />
                  </Col>
                </Row>
              </ListItem>
              <ListInput
                name="firstAddressLine"
                label={t("Address Line").toString()}
                floatingLabel
                type="text"
                placeholder=""
                clearButton
                disabled={accountAddOrUpdateAddressLoading}
                required
                onBlur={this.handleBlurInput}
                onChange={this.handleUserInput}
                onInputClear={this.handleInputClear}
                value={this.state.firstAddressLine}
                slot="list"
                {...this.getErrorMessagesProps("firstAddressLine")}
              />
              <ListInput
                name="postalCode"
                label={t("Postal Code").toString()}
                floatingLabel
                type="text"
                placeholder=""
                clearButton
                disabled={accountAddOrUpdateAddressLoading}
                required
                onBlur={this.handleBlurInput}
                onChange={this.handleUserInput}
                onInputClear={this.handleInputClear}
                value={this.state.postalCode}
                slot="list"
                {...this.getErrorMessagesProps("postalCode")}
              />
            </List>
            <Block className="apply-btn-container pure-hidden-xs">
              <ThemedButton round large fill onClick={this.handleAddOrUpdateInfo}>
                {t("Update")}
              </ThemedButton>
            </Block>
          </PageContent>

          <Fab
            position="right-bottom"
            onClick={this.handleAddOrUpdateInfo}
            slot="fixed"
            className="pure-visible-xs"
          >
            <Icon ios="f7:checkmark_alt" md="material:check" />
          </Fab>
        </Page>
      </Popup>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  ...state.paymentCardsReducer,
});

const mapDispatchToProps = (dispatch: any, props: Props) => ({});

export default compose(
  withTranslation(),
  connectAccountAddress,
  connectProfile,
  connect(mapStateToProps, mapDispatchToProps)
)(DeliveryEdit) as React.ComponentClass<
  Omit<Popup.Props, "onPopupClosed"> & {
    address: Address;
    saveInfoByDefault?: boolean;
    onAddOrUpdateInfo?(address: Address): void;
    onPopupClosed(instance?: any, chooseCountry?: boolean): void;
    country?: Country;
    reset?: boolean;
  }
>;
