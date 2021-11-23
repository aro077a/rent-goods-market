import React, { Component } from "react";
import { Page, Navbar, List, ListItem } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";

import "./wallet.less";
import MediaIcon from "../components/MediaIcon";
import connectLocalConfig from "../store/connectLocalConfig";
import { Wallet, Currency } from "../types/commonapi";
import { IApplicationStore, ILocalConfig } from "../store/rootReducer";
import { loadMyCurrencies } from "../actions/myCurrenciesActions";
import { connect } from "react-redux";

type Props = WithTranslation & {
  wallets: Wallet[];
  currencies: Currency[];
  localConfig?: ILocalConfig;
  loadMyCurrencies?(): void;
};

const getPrimaryWalletCurrencySymbol = (wallets: Wallet[] = []) => {
  const primary = wallets.filter((item) => item.primary)[0];
  return primary ? primary.currency.symbol : "";
};

class WalletPage extends Component<Props> {
  menuItemEnabled = (item: string): boolean => {
    const { localConfig } = this.props;
    const profileMenuItems = localConfig.profileMenuItems;
    return (
      profileMenuItems &&
      profileMenuItems.length > 0 &&
      profileMenuItems.includes(item)
    );
  };

  render() {
    const { wallets, loadMyCurrencies, t } = this.props;

    return (
      <Page
        id="wallet_page"
        name="wallet-page"
        onPageInit={() => {
          if (!wallets || !wallets.length) {
            loadMyCurrencies();
          }
        }}
      >
        <Navbar
          title={t("Wallet")}
          backLink={t("Back").toString()}
          noHairline
          noShadow
        />
        <List noHairlines>
          {this.menuItemEnabled("MyWallet_Currencies") && (
            <ListItem
              className="currencies-item"
              link="currencies/"
              title={t("My currencies").toString()}
              after={getPrimaryWalletCurrencySymbol(wallets)}
            >
              <MediaIcon slot="media" icon="ic-euro" color="#7D6AB3" />
            </ListItem>
          )}
          {this.menuItemEnabled("MyWallet_Cards") && (
            <ListItem
              link="cards/"
              title={t("My credit / Debit cards").toString()}
            >
              <span slot="media">
                <i className="icon ic-credit-card" />
              </span>
            </ListItem>
          )}
          {this.menuItemEnabled("MyWallet_Coins") && (
            <ListItem
              link="#"
              title={t("Coins").toString()}
              className="coins-item"
            >
              <span slot="media">
                <i className="icon ic-gem" />
              </span>
            </ListItem>
          )}
        </List>
      </Page>
    );
  }
}

const mapStateToProps = (
  state: IApplicationStore
): Pick<Props, "wallets" | "currencies"> => ({
  currencies: state.classificatorReducer.currencyClassificator,
  wallets: state.myCurrenciesReducer.currencies,
});

const mapDispatchToProps = (
  dispatch: any
): Pick<Props, "loadMyCurrencies"> => ({
  loadMyCurrencies: () => dispatch(loadMyCurrencies()),
});

export default compose(
  withTranslation(),
  connectLocalConfig,
  connect(mapStateToProps, mapDispatchToProps)
)(WalletPage);
