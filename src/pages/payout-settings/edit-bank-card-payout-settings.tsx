import {
  Navbar,
  NavRight,
  Page,
  Block,
  BlockTitle,
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
import { PayoutInterval } from "../../reducers/payoutsReducer";
import connectLocalConfig from "../../store/connectLocalConfig";
import { IApplicationStore } from "../../store/rootReducer";
import { AccountPayoutSettings } from "../../types/commonapi";
import StripeCard from "./stripe-card";
import PayoutIntervalList from "./payout-interval-list";
import PayoutExternalAccountCards from "./bank-cards";

type Props = WithTranslation & {
  loading?: boolean;
  updating?: boolean;
  error?: any;
  settings?: AccountPayoutSettings;
  selectedInterval?: PayoutInterval;
  loadSettings?(): void;
  updateSettings?(settings: AccountPayoutSettings): void;
  selectPayoutInterval?(interval: PayoutInterval): void;
};

type State = {};

class EditBankCardPayoutSettingsPage extends Component<Props, State> {
  constructor(props: Readonly<Props & WithTranslation>) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps: Props) {
    const { updating, error, settings } = this.props;
    if (error && error !== prevProps.error) {
      this.$f7.dialog.alert(error);
    }

    if (!updating && updating !== prevProps.updating && settings.pspCode) {
      this.$f7router.back();
    }
  }

  pageInitHandle = () => {
    const { settings } = this.props;
    if (!settings || !settings.interval || !settings.pspCode) {
      this.props.loadSettings();
    }
  };

  selectInterval = (interval: PayoutInterval) => {
    this.props.selectPayoutInterval(interval);
  };

  submit = () => {
    const { settings, selectedInterval } = this.props;
    settings.pspCode = "stripe-connect";
    settings.interval = selectedInterval;
    this.props.updateSettings(settings);
  };

  copyExternalAccountUrl = () => {
    const { settings, t } = this.props;
    if (!settings.externalAccount || !settings.externalAccount.url) {
      return null;
    }
    navigator.clipboard.writeText(settings.externalAccount.url);
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

  render() {
    const { settings, selectedInterval, t } = this.props;

    return (
      <Page
        id="edit_bank_card_payout_settings_page"
        name="edit-bank-card-payout-settings-page"
        onPageInit={this.pageInitHandle}
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
            <h2>{t("Bank Card")}</h2>
          </Block>
          <Block>
            <StripeCard
              settings={settings}
              onCopyExternalAccountUrl={this.copyExternalAccountUrl}
              onRenewExternalAccountUrl={this.renewExternalAccountUrl}
            />
          </Block>
          <BlockTitle>{t("Payout Interval")}</BlockTitle>
          <PayoutIntervalList
            selectedInterval={selectedInterval}
            onSelectInterval={this.selectInterval}
          />
          {settings.externalAccount &&
            settings.externalAccount.cards &&
            settings.externalAccount.cards.length > 0 && (
              <PayoutExternalAccountCards
                cards={settings.externalAccount.cards}
              />
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
)(EditBankCardPayoutSettingsPage);
