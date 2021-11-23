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
import SmallModalHeader from "@/components-ui/small-modal-header";

type Props = WithTranslation &
  IAccountAddressProps & {
    saveInfoByDefault?: boolean;
    onPopupClosed(instance, chooseCountry?: boolean): void;
    country?: Country;
    reset?: boolean;
    onAddOrUpdateInfo?(address: Address): void;
    profile: Profile;
  };

type UserFields = "name" | "surname" | "email";
type AddressFields = "country" | "city" | "firstAddressLine" | "postalCode";
type Fields = UserFields | AddressFields;

type State = Record<UserFields, string> &
  Pick<Address, AddressFields> & {
    formErrors?: Record<Fields, string>;
    formValidFields?: Record<Fields, boolean>;
    formValid: boolean;
    saveInfo?: boolean;
    chooseCountry?: boolean;
  };

const initialState: State = {
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

class DeliveryInfoEditPage extends Component<Props & Omit<Popup.Props, "onPopupClosed">, State> {
  constructor(props: Readonly<WithTranslation & Props & Popup.Props>) {
    super(props);
    this.state = {
      ...cloneDeep(initialState),
      saveInfo: props.saveInfoByDefault,
      country: props.country,
    };
  }

  handlePopupOpen = (instance) => {
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

  handleBlurInput = (e) => this.handleUserInput(e);

  handleUserInput = (e: {
    target: { name: Exclude<Fields, "country">; rawValue?: string; value: string };
  }) => {
    const { name, rawValue = null } = e.target;
    let { value } = e.target;
    // ! WAS: value = rawValue !== null && name !== "expireDate" ? rawValue : value;
    value = rawValue !== null ? rawValue : value;
    this.setState({ [name]: value } as unknown as State, () => this.validateField(name, value));
  };

  handleInputClear = (e: { target: { name: Exclude<Fields, "country"> } }) => {
    const { name } = e.target;
    this.setState({ [name]: "" } as unknown as State, () => this.validateField(name, ""));
  };

  validateField = (fieldName: Fields, value: string | Country) => {
    const { t } = this.props;
    const formValidFields = { ...this.state.formValidFields };
    const fieldValidationErrors = this.state.formErrors;
    let errorText = "";
    const requiredFieldErrorText = t("Please fill out this field.");

    if (typeof value === "string") {
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

  formHasErrors = (formValidFields: Record<Fields, boolean>) => {
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
    if (!this.state.formValid || this.props.accountAddressState.accountAddOrUpdateAddressLoading) {
      Object.keys(this.state.formValidFields).forEach((key: Fields) => {
        this.validateField(key, this.state[key]);
      });
      return;
    }
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
      <Popup
        id="delivery_info_edit__popup"
        swipeToClose
        {...rest}
        onPopupOpen={this.handlePopupOpen}
        onPopupClosed={(instance) => {
          if (this.props.onPopupClosed) {
            this.props.onPopupClosed(instance, this.state.chooseCountry);
          }
          this.setState({ chooseCountry: false });
        }}
      >
        <Page pageContent={false}>
          <SmallModalHeader popupClose title={t("Delivery information")} />
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
                        this.state.country
                          ? this.state.country.name
                          : t("Choose country").toString()
                      }
                      onClick={() => {
                        this.setState({ chooseCountry: true }, () => {
                          this.$f7.popup.close();
                        });
                      }}
                    ></ListItem>
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

const mapDispatchToProps = () => ({});

export default compose(
  withTranslation(),
  connectAccountAddress,
  connectProfile,
  connect(mapStateToProps, mapDispatchToProps)
)(DeliveryInfoEditPage) as React.ComponentClass<
  Omit<Popup.Props, "onPopupClosed"> & {
    saveInfoByDefault?: boolean;
    onAddOrUpdateInfo?(address: Address): void;
    onPopupClosed(instance, chooseCountry?: boolean): void;
    country?: Country;
    reset?: boolean;
  }
>;
