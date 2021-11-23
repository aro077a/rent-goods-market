import React, { Component } from "react";
import {
  Page,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
  Row,
  Col,
  Block,
  List,
  ListItem,
  Link,
  BlockTitle,
  Icon,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";

import {
  loadPayoutSettings,
  removePayoutSettings,
  updatePayoutSettings,
} from "@/actions/payoutsActions";
import { SellerAreaMenu } from "@/components/SellerAreaMenu";
import { ThemedButton } from "@/components/ThemedButton";
import { IApplicationStore, ResizeEvent } from "@/store/rootReducer";
import { AccountPayoutSettings, Country } from "@/types/commonapi";
import { IcBankAccount, IcBankCard } from "@/components-ui/icons";
import { Toast } from "@/components/Toast";
import { execCopyText, getPlatform, Platform } from "@/utils";
import * as Sentry from "@sentry/react";

import ChoosePayoutSheet from "./choose-payout-sheet";
import EditSettingsSheet from "./edit-settings-sheet";
import EditSettingsPopover from "./edit-settings-popover";
import StripeCard from "./stripe-card";
import PayoutExternalAccountCards from "./bank-cards";

import "./style.less";

type Props = WithTranslation & {
  loading?: boolean;
  updating?: boolean;
  error?: any;
  settings?: AccountPayoutSettings;
  countries?: Country[];
  resizeEvent?: ResizeEvent;
  loadSettings?(): void;
  updateSettings?(settings: AccountPayoutSettings): void;
  removeSettings?(): void;
};

type State = {
  showPayoutDestinationsSheet?: boolean;
  showEditBankAccountSheet?: boolean;
  showEditBankAccountPopover?: boolean;
  showEditBankCardSheet?: boolean;
  showEditBankCardPopover?: boolean;
  toastText?: string;
};

class PayoutSettingsPage extends Component<Props, State> {
  constructor(props: Readonly<Props & WithTranslation>) {
    super(props);
    this.state = {
      showPayoutDestinationsSheet: false,
      showEditBankAccountSheet: false,
      showEditBankAccountPopover: false,
      showEditBankCardSheet: false,
      showEditBankCardPopover: false,
      toastText: null,
    };
  }

  private isDebug = process.env.DEBUG_ENABLED === "true";

  componentDidUpdate(prevProps: Props) {
    const { error, loading, updating } = this.props;
    if (error && error !== prevProps.error) {
      this.$f7.dialog.alert(error);
    }

    if ((loading && !prevProps.loading) || (updating && !prevProps.updating)) {
      this.$f7.preloader.show();
    }

    if ((!loading && prevProps.loading) || (!updating && prevProps.updating)) {
      this.$f7.preloader.hide();
    }

    if (!updating && prevProps.updating && this.emptyPayoutSettings()) {
      this.props.loadSettings();
    }
  }

  pageInitHandle = () => {
    if (this.emptyPayoutSettings()) {
      this.props.loadSettings();
    }
  };

  handleSetupClick = () => {
    this.setState({ showPayoutDestinationsSheet: true });
  };

  handleShowEditBankAccountSheetClick = () => {
    this.setState({ showEditBankAccountSheet: true });
  };

  handleShowEditBankCardSheetClick = () => {
    this.setState({ showEditBankCardSheet: true });
  };

  handleEditBankAccountClick = () => {
    this.$f7router.navigate("edit/bank-account/");
  };

  handleEditBankCardClick = () => {
    this.$f7router.navigate("edit/bank-card/");
  };

  handleRemoveBankAccountClick = () => {
    this.props.removeSettings();
  };

  handleRemoveBankCardClick = () => {
    this.props.removeSettings();
  };

  handleBackLink = () => {
    this.$f7router.navigate("/", {
      clearPreviousHistory: true,
      force: true,
    });
  };

  emptyPayoutSettings = () => {
    return !this.notEmptyBankAccountSettings() && !this.notEmptyBankCardSettings();
  };

  notEmptyBankAccountSettings = () => {
    const { settings } = this.props;
    return (
      settings && settings.interval && settings.bankAccount && settings.bankAccount.bankAccountUid
    );
  };

  notEmptyBankCardSettings = () => {
    const { settings } = this.props;
    return (
      settings &&
      settings.interval &&
      settings.pspCode &&
      settings.externalAccount &&
      settings.externalAccount.url
    );
  };

  getCountryName = (countryCode?: string) => {
    if (!countryCode) return null;
    const countries = this.props.countries.filter((item) => item.code === countryCode);
    return countries.length > 0 ? countries[0].name : null;
  };

  renderSetupPayout = () => {
    const { t } = this.props;
    return (
      <Block className="set-up-payout-block">
        <h1>{t("Set up your payouts")}</h1>
        <p>{t("Add information to withdraw money")}</p>
        <ThemedButton fill large round onClick={this.handleSetupClick} className="pure-visible-xs">
          {t("Set up")}
        </ThemedButton>
        <div className="pure-hidden-xs">
          <p>{t("Choose payout destination:")}</p>
          <div className="payout-destinations-buttons">
            <ThemedButton onClick={this.handleEditBankAccountClick}>
              <IcBankAccount />
              {t("Bank Account")}
            </ThemedButton>
            <ThemedButton onClick={this.handleEditBankCardClick}>
              <IcBankCard />
              {t("Bank Card")}
            </ThemedButton>
          </div>
        </div>
      </Block>
    );
  };

  renderPayoutInterval = () => {
    const { settings, t } = this.props;
    return (
      <List noHairlines className="no-margin-top">
        <ListItem header={t("Payout Interval").toString()}>
          {settings.interval == "weekly" && <div slot="title">{t("Weekly")}</div>}
          {settings.interval == "bi-weekly" && <div slot="title">{t("Bi-weekly")}</div>}
          {settings.interval == "monthly" && <div slot="title">{t("Monthly")}</div>}
        </ListItem>
      </List>
    );
  };

  renderBankAccountPayoutSettings = () => {
    const { settings, t } = this.props;
    return (
      <div className="payout-settings">
        <Block>
          <h2>
            {t("Bank Account")}
            <Link
              href="#"
              iconOnly
              className="edit-button pure-hidden-xs"
              popoverOpen=".edit-bank-account-popover"
            >
              <Icon material="more_vertical" />
            </Link>
          </h2>
        </Block>
        {this.renderPayoutInterval()}
        <BlockTitle>{t("Beneficiary Information")}</BlockTitle>
        <List noHairlines noHairlinesBetween>
          <ListItem
            header={t("Beneficiary Name").toString()}
            title={settings.bankAccount.holderName}
          />
          {settings.bankAccount.holderAddress && (
            <ListItem header={t("Address").toString()} title={settings.bankAccount.holderAddress} />
          )}
          {settings.bankAccount.holderCountryCode && (
            <ListItem
              header={t("Country").toString()}
              title={this.getCountryName(settings.bankAccount.holderCountryCode)}
            />
          )}
          <ListItem header={t("Account").toString()} title={settings.bankAccount.accountNumber} />
        </List>
        <BlockTitle>{t("Beneficiary Bank Details")}</BlockTitle>
        <List noHairlines noHairlinesBetween>
          <ListItem header={t("Bank Name").toString()} title={settings.bankAccount.bankName} />
          <ListItem header={t("Swift Code").toString()} title={settings.bankAccount.swiftCode} />
          <ListItem
            header={t("Bank Country").toString()}
            title={this.getCountryName(settings.bankAccount.countryCode)}
          />
          {settings.bankAccount.correspondentBankDetails && (
            <ListItem
              header={t("Correspondent Bank Details").toString()}
              title={settings.bankAccount.correspondentBankDetails}
            />
          )}
        </List>
      </div>
    );
  };

  copyExternalAccountUrl = () => {
    const { settings, t } = this.props;
    if (!settings.externalAccount || !settings.externalAccount.url) {
      return null;
    }
    const url = settings.externalAccount.url;

    if (this.isDebug) {
      Sentry.captureMessage("PayoutSettings: External URL: " + url);
    }

    const platform = getPlatform();

    if (this.isDebug) {
      Sentry.captureMessage("PayoutSettings: Platform: " + platform);
    }

    try {
      if (platform == Platform.Android) {
        if (this.isDebug) {
          Sentry.captureMessage("PayoutSettings: Action: Android.copyToClipboard");
        }

        // @ts-ignore
        Android.copyToClipboard(url);
      } else if (navigator.clipboard) {
        if (this.isDebug) {
          Sentry.captureMessage("PayoutSettings: Action: navigator.clipboard.writeText");
        }

        navigator.clipboard.writeText(url);
      } else {
        if (this.isDebug) {
          Sentry.captureMessage("PayoutSettings: Action: execCopyText");
        }

        execCopyText(url);
      }
    } catch (err) {
      if (this.isDebug) {
        Sentry.captureException(err);
      }
    }

    this.setState(
      {
        toastText: t("Stripe URL copied"),
      },
      () => {
        setTimeout(() => {
          this.setState({ toastText: null });
        }, 3000);
      }
    );
  };

  renewExternalAccountUrl = () => {
    const { settings } = this.props;
    if (!settings.externalAccount || !settings.externalAccount.url) {
      return null;
    }
    this.props.updateSettings(settings);
  };

  renderBankCardPayoutSettings = () => {
    const { settings, t } = this.props;
    return (
      <div className="payout-settings">
        <Block>
          <h2>
            {t("Bank Card")}
            <Link
              href="#"
              iconOnly
              className="edit-button pure-hidden-xs"
              popoverOpen=".edit-bank-card-popover"
            >
              <Icon material="more_vertical" />
            </Link>
          </h2>
        </Block>
        <Block>
          <StripeCard
            settings={settings}
            onCopyExternalAccountUrl={this.copyExternalAccountUrl}
            onRenewExternalAccountUrl={this.renewExternalAccountUrl}
          />
        </Block>
        {this.renderPayoutInterval()}
        {settings.externalAccount &&
          settings.externalAccount.cards &&
          settings.externalAccount.cards.length > 0 && (
            <PayoutExternalAccountCards cards={settings.externalAccount.cards} />
          )}
      </div>
    );
  };

  handleShowEditSheetClick = () => {
    if (this.notEmptyBankAccountSettings()) {
      this.handleShowEditBankAccountSheetClick();
    } else if (this.notEmptyBankCardSettings()) {
      this.handleShowEditBankCardSheetClick();
    }
  };

  renderNavRight = () => {
    const { loading } = this.props;
    return (
      <NavRight>
        {!loading && !this.emptyPayoutSettings() && (
          <Link
            href="#"
            iconOnly
            onClick={this.handleShowEditSheetClick}
            className="open-edit-sheet pure-visible-xs"
          >
            <Icon material="more_vertical" />
          </Link>
        )}
      </NavRight>
    );
  };

  render() {
    const {
      loading,
      t,
      resizeEvent: { isLG, isMD, isXL },
    } = this.props;
    const isSmallScreen = !isLG && !isMD && !isXL;

    return (
      <Page id="payout_settings_page" name="payout-settings-page" onPageInit={this.pageInitHandle}>
        {isSmallScreen ? (
          <Navbar title={t("Payout Settings")} backLink={t("Back").toString()} noHairline noShadow>
            {this.renderNavRight()}
          </Navbar>
        ) : (
          <Navbar noHairline noShadow>
            <NavLeft>
              <Link iconOnly onClick={this.handleBackLink}>
                <Icon className="icon-back" />
              </Link>
            </NavLeft>
            <NavTitle>{t("Payout Settings")}</NavTitle>
            {this.renderNavRight()}
          </Navbar>
        )}

        <Row resizableFixed>
          <Col
            width="0"
            large="25"
            xlarge="20"
            className="pure-hidden-xs pure-hidden-sm pure-hidden-md"
          >
            <SellerAreaMenu selected="SellerArea_PayoutSettings" />
          </Col>
          <Col width="100" large="75" xlarge="80">
            {!loading && this.emptyPayoutSettings() && this.renderSetupPayout()}
            {!loading &&
              this.notEmptyBankAccountSettings() &&
              this.renderBankAccountPayoutSettings()}
            {!loading && this.notEmptyBankCardSettings() && this.renderBankCardPayoutSettings()}
          </Col>
        </Row>

        <ChoosePayoutSheet
          opened={this.state.showPayoutDestinationsSheet}
          onSheetClosed={() => this.setState({ showPayoutDestinationsSheet: false })}
          onBankAccountClick={this.handleEditBankAccountClick}
          onBankCardClick={this.handleEditBankCardClick}
        />

        <EditSettingsSheet
          opened={this.state.showEditBankAccountSheet}
          onSheetClosed={() => this.setState({ showEditBankAccountSheet: false })}
          onEditClick={this.handleEditBankAccountClick}
          onRemoveClick={this.handleRemoveBankAccountClick}
        />

        <EditSettingsPopover
          backdrop={false}
          className="edit-bank-account-popover"
          opened={this.state.showEditBankAccountPopover}
          onPopoverClosed={() => this.setState({ showEditBankAccountPopover: false })}
          onEditClick={this.handleEditBankAccountClick}
          onRemoveClick={this.handleRemoveBankAccountClick}
        />

        <EditSettingsSheet
          opened={this.state.showEditBankCardSheet}
          onSheetClosed={() => this.setState({ showEditBankCardSheet: false })}
          onEditClick={this.handleEditBankCardClick}
          onRemoveClick={this.handleRemoveBankCardClick}
        />

        <EditSettingsPopover
          backdrop={false}
          className="edit-bank-card-popover"
          opened={this.state.showEditBankCardPopover}
          onPopoverClosed={() => this.setState({ showEditBankCardPopover: false })}
          onEditClick={this.handleEditBankCardClick}
          onRemoveClick={this.handleRemoveBankCardClick}
        />

        <Toast text={this.state.toastText} show={(this.state.toastText !== null).valueOf()} />
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  loading: state.payoutsReducer.loading,
  updating: state.payoutsReducer.updating,
  error: state.payoutsReducer.error,
  settings: state.payoutsReducer.settings,
  countries: state.classificatorReducer.countryClassificator,
  resizeEvent: state.rootReducer.resizeEvent,
});

const mapDispatchToProps = (dispatch: any) => ({
  loadSettings: () => dispatch(loadPayoutSettings()),
  updateSettings: (settings: AccountPayoutSettings) => dispatch(updatePayoutSettings(settings)),
  removeSettings: () => dispatch(removePayoutSettings()),
});

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(PayoutSettingsPage);
