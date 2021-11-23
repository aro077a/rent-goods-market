import React, { useState, useEffect } from "react";
import { Page, Navbar, List, ListItem, Icon } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";

import "./my-currencies.style.less";
import { Wallet, Currency } from "../../types/commonapi";
import classNames from "classnames";
import { AddCurrencySheet, EditCurrencySheet } from ".";
import { IApplicationStore } from "../../store/rootReducer";
import { connect } from "react-redux";
import {
  loadMyCurrencies,
  addCurrency,
  setWalletAsPrimary,
  disableWallet,
} from "../../actions/myCurrenciesActions";
import connectF7, { WithFramework7Props } from "../../store/connectF7";

type Props = WithTranslation &
  WithFramework7Props & {
    loading?: boolean;
    error?: any;
    wallets: Wallet[];
    currencies: Currency[];
    loadMyCurrencies?(): void;
    addCurrency?(code: string): void;
    setWalletAsPrimary?(walletUid: string): void;
    disableWallet?(walletUid: string): void;
  };

type State = {
  addCurrencySheetOpened?: boolean;
  editCurrencySheetOpened?: boolean;
  walletUid?: string;
};

const initialState: State = {
  addCurrencySheetOpened: false,
  editCurrencySheetOpened: false,
};

const getCurrencyDescription = (currencies: Currency[], code: string) =>
  currencies.filter((item) => item.code === code)[0].description;

const MyCurrenciesPage = (props: Props) => {
  const {
    currencies,
    wallets,
    loadMyCurrencies,
    disableWallet,
    t,
    $f7,
    loading,
    error,
  } = props;

  const [state, setState] = useState<State>(initialState);

  const toggleSheet = (
    sheetOpenedState: keyof Pick<
      State,
      "addCurrencySheetOpened" | "editCurrencySheetOpened"
    >,
    show: boolean = true,
    walletUid?: string
  ) => setState({ [sheetOpenedState]: show, walletUid });

  const { addCurrencySheetOpened, editCurrencySheetOpened, walletUid } = state;

  useEffect(() => {
    if (error) {
      $f7.dialog.alert(error);
    }
  }, [error]);

  const addCurrencyHandle = (currencyCode: string) => {
    toggleSheet("addCurrencySheetOpened", false);
    props.addCurrency(currencyCode);
  };

  const setCurrencyAsPrimaryHandle = (walletUid: string) => {
    toggleSheet("editCurrencySheetOpened", false);
    props.setWalletAsPrimary(walletUid);
  };

  const deleteCurrencyHandle = (walletUid: string) => {
    toggleSheet("editCurrencySheetOpened", false);
    setTimeout(
      () => $f7.dialog.confirm(t("Continue?"), () => disableWallet(walletUid)),
      380
    );
  };

  return (
    <Page
      id="my_currencies_page"
      name="my-currencies-page"
      onPageInit={() => {
        if (!wallets.length) {
          loadMyCurrencies();
        }
      }}
    >
      <Navbar
        title={t("My currencies")}
        backLink={t("Back").toString()}
        noHairline
        noShadow
      />
      <List noHairlines noChevron>
        {wallets.map((item) => (
          <ListItem
            key={item.uid}
            link
            title={item.balance}
            noChevron
            footer={getCurrencyDescription(currencies, item.currency.code)}
            onClick={() =>
              toggleSheet("editCurrencySheetOpened", true, item.uid)
            }
          >
            <span slot="media">
              <i
                className={classNames(
                  "icon",
                  `ic-currency-${
                    item.currency && item.currency.code.toLowerCase()
                  }`
                )}
              ></i>
            </span>
            {item.primary && (
              <div slot="after">
                <Icon f7="checkmark_alt" />
              </div>
            )}
          </ListItem>
        ))}
        <ListItem
          className="item-add-link"
          link
          title={t("Add currency").toString()}
          noChevron
          onClick={() => toggleSheet("addCurrencySheetOpened")}
        >
          <span slot="media">
            <Icon ios="f7:plus" md="material:add" />
          </span>
        </ListItem>
      </List>

      {/* Sheets */}
      <AddCurrencySheet
        opened={addCurrencySheetOpened}
        onSheetClosed={() => toggleSheet("addCurrencySheetOpened", false)}
        currencies={currencies.filter(
          (c) => !wallets.filter((w) => w.currency.code === c.code).length
        )}
        addCurrencyOnClick={addCurrencyHandle}
      />

      <EditCurrencySheet
        opened={editCurrencySheetOpened}
        walletUid={walletUid}
        onSheetClosed={() => toggleSheet("editCurrencySheetOpened", false)}
        onActionClick={(action) => {
          const { walletUid, type } = action;
          if (type === "Remove") {
            deleteCurrencyHandle(walletUid);
          } else if (type === "SetAsPrimary") {
            setCurrencyAsPrimaryHandle(walletUid);
          }
        }}
      />
    </Page>
  );
};

const mapStateToProps = (
  state: IApplicationStore
): Pick<Props, "wallets" | "currencies" | "error" | "loading"> => ({
  currencies: state.classificatorReducer.currencyClassificator,
  wallets: state.myCurrenciesReducer.currencies,
  error: state.myCurrenciesReducer.error,
  loading: state.myCurrenciesReducer.loading,
});

const mapDispatchToProps = (
  dispatch: any
): Pick<
  Props,
  "loadMyCurrencies" | "addCurrency" | "setWalletAsPrimary" | "disableWallet"
> => ({
  loadMyCurrencies: () => dispatch(loadMyCurrencies()),
  addCurrency: (code: string) => dispatch(addCurrency(code)),
  setWalletAsPrimary: (walletUid: string) =>
    dispatch(setWalletAsPrimary(walletUid)),
  disableWallet: (walletUid: string) => dispatch(disableWallet(walletUid)),
});

export default compose(
  withTranslation(),
  connectF7,
  connect(mapStateToProps, mapDispatchToProps)
)(MyCurrenciesPage);
