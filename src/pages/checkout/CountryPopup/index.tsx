import {
  Icon,
  Link,
  List,
  ListItem,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
  PageContent,
  Popup,
  Searchbar,
} from "framework7-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { IApplicationStore } from "../../../store/rootReducer";
import { Country } from "../../../types/commonapi";

interface Props {
  opened: boolean;
  onSelected: (country: Country) => void;
  onClose: () => void;
}

const CountryPopup = ({ opened, onSelected, onClose }: Props) => {
  const { t } = useTranslation();

  const countries = useSelector(
    (state: IApplicationStore) =>
      state.classificatorReducer.countryClassificator
  );
  return (
    <Popup
      id="choose_country__popup"
      className="choose-country__popup"
      opened={opened}
      onPopupClosed={onClose}
    >
      <Navbar backLink={false} noHairline noShadow sliding>
        <NavLeft>
          <Link iconOnly onClick={onClose}>
            <Icon className="icon-back" />
          </Link>
        </NavLeft>
        <NavTitle>{t("Choose country")}</NavTitle>
        <NavRight>
          <Link
            searchbarEnable=".searchbar-demo-1"
            iconIos="f7:search"
            iconAurora="f7:search"
            iconMd="material:search"
          />
        </NavRight>
        <Searchbar
          className="searchbar-demo-1"
          expandable
          searchContainer=".search-list"
          searchIn=".item-title"
          // disableButton={!this.$theme.aurora}
        />
      </Navbar>
      <PageContent style={{ paddingTop: 0 }}>
        <List
          className="searchbar-not-found"
          noChevron
          noHairlines
          noHairlinesBetween
        >
          <ListItem title={t("Nothing found").toString()} />
        </List>
        {/* TODO replace with VirtualList! */}
        <List
          className="search-list searchbar-found"
          noChevron
          noHairlines
          noHairlinesBetween
        >
          {countries.map((val) => (
            <ListItem
              link
              key={val.code}
              title={val.name}
              onClick={() => onSelected(val)}
            />
          ))}
        </List>
      </PageContent>
    </Popup>
  );
};

export default CountryPopup;
