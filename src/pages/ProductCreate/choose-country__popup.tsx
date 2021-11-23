import React, { Component } from "react";
import {
  Popup,
  PageContent,
  Navbar,
  NavLeft,
  Link,
  Icon,
  NavTitle,
  NavRight,
  Searchbar,
  List,
  ListItem,
  Block,
  Chip,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { IApplicationStore } from "../../store/rootReducer";
import { connect } from "react-redux";
import { createUUID } from "../../utils";
import Flag from "react-world-flags";

type Props = Omit<Popup.Props, "onPopupClosed"> &
  Partial<ReturnType<typeof mapStateToProps>> &
  Partial<ReturnType<typeof mapDispatchToProps>> & {
    selectedCountries?: any[];
    excludedCountries?: any[];
    onPopupClosed?(selectedCountries: any[], instance: any): void;
  };

class ChooseCountryPopup extends Component<WithTranslation & Props, { countries: any }> {
  private _searchbar: any;
  private _uid: string;
  constructor(props: Readonly<WithTranslation & Props>) {
    super(props);
    this.state = {
      countries: {},
    };
    this._uid = createUUID();
  }

  componentDidUpdate(_prevProps) {
    if (!this._searchbar && this.props.opened && this.props.countryClassificator.length) {
      setTimeout(() => {
        this._searchbar = this.$f7.searchbar.create({
          el: ".searchbar-demo-choose_country__popup-" + this._uid,
          searchContainer: ".countries-list-choose_country__popup-" + this._uid,
          searchIn: ".item-title",
          expandable: true,
          foundEl: ".searchbar-found-choose_country__popup-" + this._uid,
          on: {
            // TODO
            enable: () => {
              // @ts-ignore
              this.setState({ d: "flex" }, () => {
                // @ts-ignore
                setTimeout(() => this.setState({ d: "block" }), 0);
              });
            },
          },
        });
      }, 380);
    }
  }

  componentWillUnmount() {
    if (this._searchbar) this._searchbar.destroy();
  }

  isCountryExcluded = (code: string) => {
    const { excludedCountries = [] } = this.props;
    return excludedCountries.filter((item) => item.code === code).length > 0;
  };

  render() {
    const { t, onPopupOpen, onPopupClosed, ...rest } = this.props;
    return (
      <Popup
        id={"choose_country__popup-" + this._uid}
        className="choose-country__popup"
        onPopupOpen={(instance) => {
          const { selectedCountries } = this.props;
          if (selectedCountries) {
            this.setState({
              countries: selectedCountries
                ? selectedCountries.reduce((p, c) => {
                    return { ...p, [c]: true };
                  }, {})
                : {},
            });
          }
          if (onPopupOpen) onPopupOpen(instance);
        }}
        onPopupClosed={(instance) => {
          onPopupClosed(
            Object.keys(this.state.countries).filter((key) => !!this.state.countries[key]),
            instance
          );
          this.setState({ countries: {} });
        }}
        style={
          // @ts-ignore
          this.state.d ? { display: this.state.d } : {}
        }
        {...rest}
      >
        <Navbar backLink={false} noHairline noShadow sliding>
          <NavLeft>
            <Link iconOnly onClick={() => this.$f7.popup.close()}>
              <Icon className="icon-back" />
            </Link>
          </NavLeft>
          <NavTitle>{t("Specific countries")}</NavTitle>
          <NavRight>
            <Link
              href="#"
              searchbarEnable={".searchbar-demo-choose_country__popup-" + this._uid}
              iconIos="f7:search"
              iconAurora="f7:search"
              iconMd="material:search"
            ></Link>
          </NavRight>
          <Searchbar
            init={false}
            className={"searchbar-demo-choose_country__popup-" + this._uid}
            expandable
          ></Searchbar>
        </Navbar>
        <PageContent style={{ paddingTop: 0 }}>
          <Block className="no-margin-top no-margin-bottom">
            {Object.keys(this.state.countries).map(
              (key) =>
                this.state.countries[key] && (
                  <Chip
                    key={key}
                    text={this.props.countryClassificator.filter((c) => c.code === key)[0].name}
                    deleteable
                    onDelete={(_e) => {
                      this.setState({
                        countries: {
                          ...this.state.countries,
                          [key]: undefined,
                        },
                      });
                    }}
                  />
                )
            )}
          </Block>
          <List className="searchbar-not-found" noChevron noHairlines noHairlinesBetween>
            <ListItem title={t("Nothing found").toString()} />
          </List>
          <List
            className={`search-list countries-list countries-list-choose_country__popup-${this._uid} searchbar-found-choose_country__popup-${this._uid} no-margin-top`}
            noChevron
            noHairlines
            noHairlinesBetween
            form
          >
            {this.props.opened /* (fix) TODO: Bug with performance? */ &&
              this.props.countryClassificator.map((val) => {
                let excluded = this.isCountryExcluded(val.code);
                return (
                  <ListItem
                    key={val.code}
                    className={excluded ? "disabled" : ""}
                    checkbox
                    title={val.name}
                    slot="list"
                    onChange={() => {
                      const { countries } = this.state;
                      this.setState({
                        countries: {
                          ...countries,
                          [val.code]: !countries[val.code],
                        },
                      });
                    }}
                    checked={!!this.state.countries[val.code] || excluded}
                    disabled={excluded}
                  >
                    <div slot="media">
                      {" "}
                      <Flag code={val.code} height="16" />
                    </div>
                  </ListItem>
                );
              })}
          </List>
        </PageContent>
      </Popup>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  countryClassificator: state.classificatorReducer.countryClassificator,
});

const mapDispatchToProps = (_dispatch: any) => ({});

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(ChooseCountryPopup) as React.ComponentClass<Props>;
