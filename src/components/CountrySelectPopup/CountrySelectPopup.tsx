import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Flag from "react-world-flags";
import cn from "classnames";
import {
  f7,
  Icon,
  Link,
  List,
  ListItem,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
  Page,
  Popup,
  Searchbar,
  theme,
} from "framework7-react";

import { useAppSelector } from "@/hooks/store";
import { Country } from "@/types/commonapi";
import { createUUID } from "@/utils";

import { CountrySelectPopupProps } from "./CountrySelectPopup.types";

import "./CountrySelectPopup.less";

export const CountrySelectPopup = ({
  opened,
  onPopupClosed,
  onCountrySelect,
  closeOnChoose = true,
}: CountrySelectPopupProps) => {
  const { t } = useTranslation();

  const countries = useAppSelector((state) => state.classificatorReducer.countryClassificator);

  const [popupUid] = useState(createUUID());

  const [isSearch, setIsSearch] = useState(false);
  const [virtualListData, setVirtualListData] = useState<{ items: Country[]; topPosition: number }>(
    {
      items: [],
      topPosition: 0,
    }
  );

  const searchAll = useCallback((query: string, searchItems: { name: string }[]) => {
    if (!query.trim()) {
      return searchItems.map((_, index) => index);
    }

    return searchItems.reduce(
      (found, item, index) =>
        item.name.toLowerCase().indexOf(query.toLowerCase()) >= 0 ? [...found, index] : found,
      []
    );
  }, []);

  const searchbarClassName = useMemo(() => `searchbar-${popupUid}`, [popupUid]);

  const handleCountrySelect = useCallback(
    (country: Country) => {
      f7.searchbar.disable(`.${searchbarClassName}`);
      onCountrySelect(country);
    },
    [onCountrySelect, searchbarClassName]
  );

  const onSearchbarEnable = useCallback(() => setIsSearch(true), []);

  const onSearchbarDisable = useCallback(() => setIsSearch(false), []);

  return (
    <Popup
      id={`country-select-popup-${popupUid}`}
      className="country-select-popup"
      opened={opened}
      onPopupClose={onPopupClosed}
    >
      <Page>
        <Navbar
          backLink={false}
          noHairline
          noShadow
          sliding
          className={cn(isSearch && !f7.device.ios && "shift")}
        >
          <NavLeft>
            <Link iconOnly popupClose>
              <Icon className="icon-back" />
            </Link>
          </NavLeft>
          <NavTitle>{t("Choose country")}</NavTitle>
          <NavRight>
            <Link
              searchbarEnable={`.${searchbarClassName}`}
              iconIos="f7:search"
              iconAurora="f7:search"
              iconMd="material:search"
            />
          </NavRight>
          <Searchbar
            className={searchbarClassName}
            expandable
            searchContainer={`.search-list-${popupUid}`}
            searchItem="li"
            searchIn=".item-title"
            disableButton={!theme.aurora}
            onSearchbarEnable={onSearchbarEnable}
            onSearchbarDisable={onSearchbarDisable}
            placeholder={t("Search")}
          />
        </Navbar>
        <List className="searchbar-not-found">
          <ListItem title={t("Nothing found").toString()} />
        </List>
        <List
          className={`search-list-${popupUid} searchbar-found country-select-popup-list`}
          noChevron
          noHairlines
          noHairlinesBetween
          virtualList
          virtualListParams={{
            items: countries,
            searchAll,
            renderExternal: (_, newData) => setVirtualListData({ ...newData }),
            height: 48,
          }}
        >
          <ul>
            {virtualListData.items.map((country) => (
              <ListItem
                link
                key={country.code}
                title={country.name}
                onClick={() => handleCountrySelect(country)}
                popupClose={closeOnChoose}
                style={{ top: virtualListData.topPosition }}
                virtualListIndex={countries.indexOf(country)}
              >
                <div slot="media">
                  <Flag code={country.code} width="30" />
                </div>
              </ListItem>
            ))}
          </ul>
        </List>
      </Page>
    </Popup>
  );
};
