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
  Checkbox,
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
// import SmallModalHeader from "@/components-ui/small-modal-header";
import CountryPopup from "@/pages/checkout/CountryPopup";

type Props = WithTranslation &
  IAccountAddressProps & {
    saveInfoByDefault?: boolean;
    country: Country;
    reset?: boolean;
    onAddOrUpdateInfo?(address: Address): void;
    profile: Profile;
  };

type State = Pick<Address, "country" | "city" | "firstAddressLine" | "postalCode"> & {
  showCountryPopup?: boolean;
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
  showCountryPopup: false,
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

class DeliveryInit extends Component<Props & Omit<Popup.Props, "onPopupClosed">, State> {
  constructor(props: Readonly<WithTranslation & Props & Popup.Props>) {
    super(props);
    this.state = {
      ...cloneDeep(initialState),
      saveInfo: props.saveInfoByDefault,
      country: props.country,
    };
  }

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
    const { city, country, firstAddressLine, postalCode } = this.state;
    this.$f7.preloader.show();
    this.props.addOrUpdateAccountAddress(
      {
        city,
        country,
        postalCode,
        firstAddressLine,
      },
      false
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
      <Page>
        <PageContent>
          <BlockTitle medium>{t("Contacts")}</BlockTitle>
          <List noHairlinesMd form noHairlinesBetweenMd>
            <ListInput
              name="name"
              label={t("First Name").toString()}
              floatingLabel
              type="text"
              placeholder=""
              clearButton
              disabled={accountAddOrUpdateAddressLoading}
              required
              onBlur={this.handleBlurInput}
              onChange={this.handleUserInput}
              onInputClear={this.handleInputClear}
              value={this.state.name}
              slot="list"
              {...this.getErrorMessagesProps("name")}
            />
            <ListInput
              name="surname"
              label={t("Last Name").toString()}
              floatingLabel
              type="text"
              placeholder=""
              clearButton
              disabled={accountAddOrUpdateAddressLoading}
              required
              onBlur={this.handleBlurInput}
              onChange={this.handleUserInput}
              onInputClear={this.handleInputClear}
              value={this.state.surname}
              slot="list"
              {...this.getErrorMessagesProps("surname")}
            />
            <ListInput
              name="email"
              label={t("Email").toString()}
              floatingLabel
              type="text"
              placeholder=""
              clearButton
              disabled={accountAddOrUpdateAddressLoading}
              required={false}
              onBlur={this.handleBlurInput}
              onChange={this.handleUserInput}
              onInputClear={this.handleInputClear}
              value={this.state.email}
              slot="list"
              {...this.getErrorMessagesProps("email")}
            />
            <ListItem slot="list">
              <Row style={{ width: "100%" }}>
                <Col width={100} medium={50}>
                  <ListItem
                    link
                    header={t("Country").toString()}
                    title={
                      this.state.country ? this.state.country.name : t("Choose country").toString()
                    }
                    onClick={() => {
                      this.setState({ showCountryPopup: true });
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
          {!saveInfoByDefault && (
            <Block>
              <Checkbox
                name="save-info"
                value={this.state.saveInfo}
                onChange={() => this.setState({ saveInfo: !this.state.saveInfo })}
              >
                {t("Save Delivery Information")}
              </Checkbox>
            </Block>
          )}

          <Block className="apply-btn-container pure-hidden-xs">
            <ThemedButton round large fill onClick={this.handleAddOrUpdateInfo}>
              {t("Save")}
            </ThemedButton>
          </Block>
        </PageContent>

        <CountryPopup
          opened={this.state.showCountryPopup}
          onSelected={(country) => {
            this.setState({ showCountryPopup: false, country: country });
          }}
          onClose={() => {
            this.setState({ showCountryPopup: false });
          }}
        />

        <Fab
          position="right-bottom"
          onClick={this.handleAddOrUpdateInfo}
          slot="fixed"
          className="pure-visible-xs"
        >
          <Icon ios="f7:checkmark_alt" md="material:check" />
        </Fab>
      </Page>
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
)(DeliveryInit) as React.ComponentClass<
  Omit<Popup.Props, "onPopupClosed"> & {
    saveInfoByDefault?: boolean;
    country?: Country;
    reset?: boolean;
  }
>;
