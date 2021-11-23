import React from "react";
import { F7Searchbar, Icon, Preloader } from "framework7-react";
import { Logo } from "../Logo";
import { withTranslation, WithTranslation } from "react-i18next";
import { compose } from "redux";

import "./style.less";
import { Catalog } from "../Catalog/index";
import { IProduct } from "../../reducers/productReducer";

class SearchBar extends React.PureComponent<
  F7Searchbar.Props &
    WithTranslation & {
      autocomplete?: boolean;
      findedProducts?: IProduct[];
      onFindedProductItemClick?(uid: string): void;
      preloader?: boolean;
      searchBarFocus?: boolean;
      isIconShow?: boolean;
    }
> {
  state = {
    enabled: false,
  };

  onSearchbarEnableHandle = () => {
    const { onSearchbarEnable } = this.props;
    this.setState({ enabled: true });
    if (onSearchbarEnable) onSearchbarEnable();
  };

  onSearchbarDisableHandle = () => {
    const { onSearchbarDisable } = this.props;
    this.setState({ enabled: false });
    if (onSearchbarDisable) onSearchbarDisable();
  };

  render() {
    const {
      t,
      findedProducts,
      onFindedProductItemClick,
      preloader,
      autocomplete,
      searchBarFocus,
      isIconShow,
      ...props
    } = this.props;
    const { enabled } = this.state;

    return isIconShow && !searchBarFocus ? (
      <div className="search-bar-icon" onClick={this.onSearchbarEnableHandle}>
        <Icon material="search" />
      </div>
    ) : (
      <F7Searchbar
        className="search-bar"
        {...props}
        onSearchbarEnable={this.onSearchbarEnableHandle}
        onSearchbarDisable={this.onSearchbarDisableHandle}
        placeholder={!searchBarFocus && t("Search")}
      >
        <div slot="input-wrap-end">{!enabled && <Logo />}</div>
        {autocomplete && (
          <div slot="input-wrap-end">
            <div className="autocomplete-search-result">
              {preloader && (
                <div className="preloader-container">
                  <Preloader />
                </div>
              )}
              <Catalog items={findedProducts} onClick={onFindedProductItemClick} />
            </div>
          </div>
        )}
      </F7Searchbar>
    );
  }
}

export default compose(withTranslation())(SearchBar);
