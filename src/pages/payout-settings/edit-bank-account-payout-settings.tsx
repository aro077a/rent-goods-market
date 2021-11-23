import {
  Navbar,
  NavRight,
  Page,
  Block,
  BlockTitle,
  List,
  ListInput,
  Icon,
  Fab,
  Button,
} from "framework7-react";
import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  loadPayoutSettings,
  selectPayoutInterval,
  updatePayoutSettings,
} from "../../actions/payoutsActions";
import { CountrySelectPopup } from "../../components/CountrySelectPopup";
import { PayoutInterval } from "../../reducers/payoutsReducer";
import connectLocalConfig from "../../store/connectLocalConfig";
import { IApplicationStore } from "../../store/rootReducer";
import { AccountPayoutSettings, Country } from "../../types/commonapi";
import PayoutIntervalList from "./payout-interval-list";

type Props = WithTranslation & {
  loading?: boolean;
  updating?: boolean;
  error?: any;
  settings?: AccountPayoutSettings;
  selectedInterval?: PayoutInterval;
  loadSettings?(): void;
  updateSettings?(settings: AccountPayoutSettings): void;
  selectPayoutInterval?(interval: PayoutInterval): void;
  selectHolderCountry?(country?: Country): void;
  selectBankCountry?(country?: Country): void;
  countries?: Country[];
};

type State = {
  holderCountryPopupOpened?: boolean;
  bankCountryPopupOpened?: boolean;
  errorFields?: string[];
};

class EditBankAccountPayoutSettingsPage extends Component<Props, State> {
  constructor(props: Readonly<Props & WithTranslation>) {
    super(props);
    this.state = {
      holderCountryPopupOpened: false,
      bankCountryPopupOpened: false,
      errorFields: [],
    };
  }

  componentDidMount() {
    this.loadSettings();
  }

  componentDidUpdate(prevProps: Props) {
    const { loading, updating, error, settings } = this.props;
    if (error && error !== prevProps.error) {
      this.$f7.dialog.alert(error);
    }

    if (!loading && loading !== prevProps.loading) {
      this.focusInputHandle({ target: { name: "countryCode" } });
    }

    if (
      !updating &&
      updating !== prevProps.updating &&
      settings.bankAccount.bankAccountUid
    ) {
      this.$f7router.back();
    }
  }

  loadSettings = () => {
    const { settings } = this.props;
    if (!settings || !settings.interval || !settings.bankAccount) {
      this.props.loadSettings();
    }
  };

  holderCountrySelectHandle = () => {
    this.setState({ holderCountryPopupOpened: true });
  };

  bankCountrySelectHandle = () => {
    this.setState({ bankCountryPopupOpened: true });
  };

  getCountryName = (countryCode?: string) => {
    if (!countryCode) return null;
    const countries = this.props.countries.filter(
      (item) => item.code === countryCode
    );
    return countries.length > 0 ? countries[0].name : null;
  };

  focusInputHandle = (e: { target: { name: any } }) => {
    const { name } = e.target;
    const { errorFields } = this.state;
    const index = errorFields.indexOf(name, 0);
    if (index > -1) {
      errorFields.splice(index, 1);
      this.setState({ errorFields: errorFields });
    }
  };

  blurInputHandle = (e: { target: { name: any; value: any; type: any } }) => {
    const { name, value, type } = e.target;
    const { settings } = this.props;
    if (!name || !type) {
      throw new Error("Name or type for field is not defined!");
    }

    try {
      if (
        ["holderCountryCode", "countryCode"].includes(name) &&
        value.length !== 2
      ) {
        return;
      }
      settings.bankAccount[name] = value;
    } catch (err) {}
  };

  getDefaultValue = (fieldName: string, defaultValue: any = ""): any => {
    const { settings } = this.props;

    const validValue =
      typeof settings.bankAccount[fieldName] !== "undefined" &&
      settings.bankAccount[fieldName] !== null &&
      settings.bankAccount[fieldName].toString() !== "NaN";

    if (
      validValue &&
      ["holderCountryCode", "countryCode"].includes(fieldName)
    ) {
      return this.getCountryName(settings.bankAccount[fieldName]);
    } else if (validValue) {
      return settings.bankAccount[fieldName];
    } else {
      return defaultValue;
    }
  };

  getErrorProps = (fieldName: string, properties?: any) => {
    const { t } = this.props;
    const optionalProps = properties || {};
    let errorMessage = null;
    let errorMessageForce = false;

    const { errorFields } = this.state;
    if (errorFields.includes(fieldName)) {
      errorMessage = t("Please fill out this field.");
      errorMessageForce = true;
    }

    return {
      info: t("required").toString(),
      required: true,
      validateOnBlur: false,
      errorMessage,
      errorMessageForce,
      ...optionalProps,
    };
  };

  selectInterval = (interval: PayoutInterval) => {
    this.props.selectPayoutInterval(interval);
  };

  selectHolderCountry = (country: any) => {
    const event = {
      target: {
        name: "holderCountryCode",
        value: country.code,
        type: "string",
      },
    };
    this.focusInputHandle(event);
    this.blurInputHandle(event);
  };

  selectBankCountry = (country: any) => {
    const event = {
      target: { name: "countryCode", value: country.code, type: "string" },
    };
    this.blurInputHandle(event);
    this.focusInputHandle(event);
  };

  submit = () => {
    const { settings, t } = this.props;

    this.setState({ errorFields: [] });
    const requiredFields = [
      "holderName",
      "accountNumber",
      "bankName",
      "swiftCode",
      "countryCode",
    ];
    let errorFields = [];
    requiredFields.forEach((fieldName) => {
      if (!this.validBankAccountField(fieldName)) {
        errorFields.push(fieldName);
      }
    });

    if (errorFields.length > 0) {
      this.setState({ errorFields: errorFields });
      this.$f7.dialog.alert(t("Please fill out all required fields."));
      return;
    }

    this.props.updateSettings(settings);
  };

  validBankAccountField = (fieldName): boolean => {
    const { settings } = this.props;
    return (
      typeof settings.bankAccount[fieldName] !== "undefined" &&
      settings.bankAccount[fieldName] !== null &&
      settings.bankAccount[fieldName] !== "" &&
      settings.bankAccount[fieldName].toString() !== "NaN"
    );
  };

  render() {
    const { selectedInterval, settings, t } = this.props;

    return (
      <Page
        id="edit_bank_account_payout_settings_page"
        name="edit-bank-account-payout-settings-page"
      >
        <Navbar
          title={t("Payout Setup")}
          backLink={t("Back").toString()}
          noHairline
          noShadow
        >
          <NavRight>
            <Button
              fill
              large
              round
              onClick={this.submit}
              className="submit-button pure-hidden-xs"
            >
              {t("Save")}
            </Button>
          </NavRight>
        </Navbar>
        <div className="payout-settings">
          <Block>
            <h2>{t("Bank Account")}</h2>
          </Block>
          <Block className="description">
            {t(
              "Payout amount based on completed deals (deals in 45 calendar days after payment)."
            )}
            {t(
              "Payout amount should be greater than 100 USD. 10 USD cost applicable."
            )}
          </Block>
          <BlockTitle>{t("Payout Interval")}</BlockTitle>
          <PayoutIntervalList
            selectedInterval={selectedInterval}
            onSelectInterval={this.selectInterval}
          />
          {settings.bankAccount && (
            <>
              <BlockTitle>{t("Beneficiary Information")}</BlockTitle>
              <List form noHairlines>
                <ListInput
                  name="holderName"
                  label={t("Beneficiary Name").toString()}
                  type="text"
                  placeholder=""
                  slot="list"
                  onFocus={this.focusInputHandle}
                  onBlur={this.blurInputHandle}
                  defaultValue={this.getDefaultValue("holderName")}
                  {...this.getErrorProps("holderName")}
                />
                <ListInput
                  name="holderAddress"
                  label={t("Address (optional)").toString()}
                  type="text"
                  placeholder=""
                  slot="list"
                  onBlur={this.blurInputHandle}
                  defaultValue={this.getDefaultValue("holderAddress")}
                />
                <ListInput
                  name="holderCountryCode"
                  label={t("Country (optional)").toString()}
                  type="text"
                  placeholder=""
                  slot="list"
                  readonly
                  onFocus={this.holderCountrySelectHandle}
                  defaultValue={this.getDefaultValue("holderCountryCode")}
                />
                <ListInput
                  name="accountNumber"
                  label={t("Account").toString()}
                  type="text"
                  placeholder=""
                  slot="list"
                  onFocus={this.focusInputHandle}
                  onBlur={this.blurInputHandle}
                  defaultValue={this.getDefaultValue("accountNumber")}
                  {...this.getErrorProps("accountNumber")}
                />
                <ListInput name="l1" className="pseudo-input pure-visible-xs" />
              </List>
              <BlockTitle>{t("Beneficiary Bank Details")}</BlockTitle>
              <List noHairlines form>
                <ListInput
                  name="bankName"
                  label={t("Bank Name").toString()}
                  type="text"
                  placeholder=""
                  slot="list"
                  onFocus={this.focusInputHandle}
                  onBlur={this.blurInputHandle}
                  defaultValue={this.getDefaultValue("bankName")}
                  {...this.getErrorProps("bankName")}
                />
                <ListInput
                  name="swiftCode"
                  label={t("Swift Code").toString()}
                  type="text"
                  placeholder=""
                  slot="list"
                  onFocus={this.focusInputHandle}
                  onBlur={this.blurInputHandle}
                  defaultValue={this.getDefaultValue("swiftCode")}
                  {...this.getErrorProps("swiftCode")}
                />
                <ListInput
                  name="countryCode"
                  label={t("Bank Country").toString()}
                  type="text"
                  placeholder=""
                  slot="list"
                  readonly
                  onFocus={this.bankCountrySelectHandle}
                  onBlur={this.blurInputHandle}
                  defaultValue={this.getDefaultValue("countryCode")}
                  {...this.getErrorProps("countryCode")}
                />
                <ListInput
                  name="correspondentBankDetails"
                  label={t("Correspondent Bank Details (optional)").toString()}
                  type="text"
                  placeholder=""
                  slot="list"
                  onBlur={this.blurInputHandle}
                  defaultValue={this.getDefaultValue(
                    "correspondentBankDetails"
                  )}
                />
                <ListInput name="l2" className="pseudo-input pure-visible-xs" />
              </List>
            </>
          )}
        </div>

        <Fab
          className="pure-visible-xs"
          position="right-bottom"
          onClick={this.submit}
          slot="fixed"
        >
          <Icon ios="f7:checkmark_alt" md="material:check" />
        </Fab>

        <CountrySelectPopup
          opened={
            this.state.holderCountryPopupOpened ||
            this.state.bankCountryPopupOpened
          }
          onCountrySelect={(country) => {
            if (this.state.holderCountryPopupOpened) {
              this.selectHolderCountry(country);
            }
            if (this.state.bankCountryPopupOpened) {
              this.selectBankCountry(country);
            }
          }}
          onPopupClosed={() => {
            this.setState({
              holderCountryPopupOpened: false,
              bankCountryPopupOpened: false,
            });
          }}
        />
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  loading: state.payoutsReducer.loading,
  updating: state.payoutsReducer.updating,
  error: state.payoutsReducer.error,
  selectedInterval: state.payoutsReducer.interval,
  settings: state.payoutsReducer.settings,
  countries: state.classificatorReducer.countryClassificator,
});

const mapDispatchToProps = (dispatch: any) => ({
  loadSettings: () => dispatch(loadPayoutSettings()),
  updateSettings: (settings: AccountPayoutSettings) =>
    dispatch(updatePayoutSettings(settings)),
  selectPayoutInterval: (interval: PayoutInterval) =>
    dispatch(selectPayoutInterval(interval)),
});

export default compose(
  withTranslation(),
  connectLocalConfig,
  connect(mapStateToProps, mapDispatchToProps)
)(EditBankAccountPayoutSettingsPage);
