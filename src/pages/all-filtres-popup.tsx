import React, { Component } from "react";
import { Page, Navbar, Block, BlockTitle, NavRight, Link, ListItem, List } from "framework7-react";
import { LatLng } from "react-google-places-autocomplete/build/GooglePlacesAutocomplete.types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";

import { MapPopup } from "@/components/MapPopup";
import SortByButtonsGroup from "@/components/SortByButtonsGroup";
import { IApplicationStore, ICategory } from "@/store/rootReducer";
import { IFilterState, SortBy } from "@/reducers/filterReducer";
import connectFilter from "@/store/connectFilter";
import {
  allFiltresChooseSortBy,
  allFiltresClear,
  applyAllFiltres,
  allFiltresFill,
  allFiltersUpdatePosition,
  allFiltersSetPlace,
  chooseCategory,
  chooseSubcategory,
  chooseLocation,
  chooseLocationPlace,
  allFiltersChooseCity,
  allFiltersChooseCountry,
} from "@/actions/filterActions";
import { ThemedButton } from "@/components/ThemedButton";
import {
  ISearchParams,
  SortBy as SortByField,
  updateSearchResultCount,
} from "@/actions/productActions";
import connectSearch, { SearchConnectorProps } from "@/store/connectSearch";
import { ProductAddress } from "@/types/marketplaceapi";

import "./all-filtres-popup.less";

type Props = WithTranslation &
  IFilterState &
  SearchConnectorProps & {
    category?: ICategory;
    chooseSortBy?(sortBy: SortBy): void;
    totalCount?: number;
    updateSearchResultCount?(searchParams: ISearchParams): void;
    clearFilter?(): void;
    applyAllFiltres?(): void;
    fillFiltres?(): void;
    locationPlace?: string;
    updatePosition?(position: LatLng): void;
    setPlace?(place: string): void;
    chooseCountryCode?(code?: string | null): void;
    chooseCity?(city?: string | null): void;
    chooseCategory?(catid?: string | null): void;
    chooseSubcategory?(catid?: string): void;
    chooseLocation?(location?: LatLng | null): void;
    chooseLocationPlace?(city: string | null): void;
  };

type State = {
  mapPopupOpened: boolean;
};

const getItemStyles = (item: ICategory) => ({ backgroundColor: item.color });

export const getSortByFields = (sortBy: SortBy[]): SortByField[] => {
  return sortBy.map((item) => {
    return {
      direction: item === SortBy.price_high_to_low ? "DESC" : "ASC",
      field: getFieldNameBySortBy(item),
      sortingIndex: item === SortBy.price_high_to_low || item === SortBy.price_low_to_high ? 1 : 0,
    };
  });
};

const getFieldNameBySortBy = (sortBy: SortBy) => {
  switch (sortBy) {
    case SortBy.popular:
      return "popular";
    case SortBy.price_high_to_low:
      return "price";
    case SortBy.price_low_to_high:
      return "price";
    case SortBy.sales_first:
      return "sales_first";
    case SortBy.what_s_new:
      return "what_s_new";
  }
};

class AllFiltresPopup extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      mapPopupOpened: false,
    };
  }

  openHandle = () => {
    this.props.fillFiltres();
  };

  componentDidUpdate(prevProps: Props) {
    const { chosenSubcategoryId, location } = this.props;
    const categoryOrLocationChanged =
      chosenSubcategoryId !== prevProps.chosenSubcategoryId || location !== prevProps.location;
    if (categoryOrLocationChanged) {
      this.props.updateSearchResultCount({});
    }
  }

  componentWillUnmount() {
    this.props.clearFilter();
  }

  sortByClickHandle = (sortBy: SortBy) => {
    this.props.chooseSortBy(sortBy);
  };

  showGoodsHandle = () => {
    this.props.applyAllFiltres();
    this.props.clearSearch();
    this.props.search({});
    this.$f7router.back();
  };

  clearFilterHandle = () => {
    this.props.clearFilter();
    this.props.applyAllFiltres();
    this.props.clearSearch();
    this.props.chooseCountryCode(null);
    this.props.chooseCity(null);
    this.props.chooseCategory(null);
    this.props.chooseSubcategory(null);
    this.props.chooseLocation(null);
    this.props.chooseLocationPlace(null);
  };

  backLinkHandle = () => {
    this.$f7router.back();
  };

  locationLinkHandle = () => {
    this.setState({ mapPopupOpened: true });
  };

  locationTitle = () => {
    const { locationPlace, t } = this.props;
    return locationPlace || t("Select location");
  };

  setLocation = (lat, lng, place, _, address: ProductAddress) => {
    this.props.chooseCity(address.city);
    this.props.chooseCountryCode(address.countryCode);
    this.props.setPlace(place);
    this.props.chooseLocationPlace(address.city);
    this.props.updatePosition({ lat, lng });
  };

  enableShowGoodsButton = () => {
    const { category, location } = this.props;
    const locationDefined = location && location.lat !== 0;
    return category.id !== "all" || locationDefined;
  };

  render() {
    const { sortBy, category, location, totalCount, t } = this.props;

    return (
      <Page id="all_filtres_popup" className="all-filtres-popup" onPageInit={this.openHandle}>
        <Navbar
          title={t("All Filtres")}
          backLink={t("Back").toString()}
          onClickBack={this.backLinkHandle}
          noHairline
          noShadow
        />
        <BlockTitle>{t("Choose category")}</BlockTitle>
        <List noHairlines>
          <ListItem link="/all-filtres/categories/" title={category.name}>
            <span slot="media" className="category-item" style={getItemStyles(category)}>
              <i className={`icon ${category.icon}`} />
            </span>
          </ListItem>
        </List>
        <BlockTitle>{t("Sort by")}</BlockTitle>
        <Block>
          <SortByButtonsGroup selected={sortBy} onClick={this.sortByClickHandle} />
        </Block>
        <List noHairlines>
          <ListItem
            link="#"
            header={t("Location").toString()}
            title={this.locationTitle()}
            onClick={this.locationLinkHandle}
          />
        </List>
        <Block>
          {this.enableShowGoodsButton() && (
            <ThemedButton
              onClick={this.showGoodsHandle}
              disabled={this.props.searchLoading}
              fill
              large
              raised
              round
            >
              {t("Show goods", { totalCount })}
            </ThemedButton>
          )}
        </Block>

        <MapPopup
          backdrop={false}
          coordinates={location}
          initialized={this.state.mapPopupOpened}
          opened={this.state.mapPopupOpened}
          onPopupClosed={() => this.setState({ mapPopupOpened: false })}
          onLocationSelect={(location, place, placeId, address) => {
            this.setLocation(location.lat, location.lng, place, placeId, address);
          }}
        />
      </Page>
    );
  }
}

const appCategoriesItem = {
  name: "All categories",
  id: "all",
  color: "",
  icon: "ic-all-categories",
};

const mapStateToProps = (state: IApplicationStore, props: Props) => ({
  category: (state.rootReducer.localConfig &&
    state.rootReducer.localConfig.categories.filter(
      (item) => item.id === state.filterReducer.allFiltresChosenCategoryId
    )[0]) || { ...appCategoriesItem, name: props.t(appCategoriesItem.name) },

  chosenCategoryId: state.filterReducer.allFiltresChosenCategoryId,
  chosenSubcategoryId: state.filterReducer.allFiltresChosenSubcategoryId,
  sortBy: state.filterReducer.allFiltresSortBy,
  totalCount: state.productReducer.totalCount,
  location: state.filterReducer.allFiltresLocation,
  locationPlace: state.filterReducer.allFiltresLocationPlace,
});

const mapDispatchToProps = (dispatch: any) => ({
  chooseSortBy: (sortBy: SortBy) => dispatch(allFiltresChooseSortBy(sortBy)),
  clearFilter: () => dispatch(allFiltresClear()),
  updateSearchResultCount: (searchParams: ISearchParams) =>
    dispatch(updateSearchResultCount(searchParams)),
  applyAllFiltres: () => dispatch(applyAllFiltres()),
  fillFiltres: () => dispatch(allFiltresFill()),
  updatePosition: (position: LatLng) => {
    dispatch(allFiltersUpdatePosition(position));
  },
  setPlace: (place: string) => {
    dispatch(allFiltersSetPlace(place));
  },
  chooseCountryCode: (code?: string) => dispatch(allFiltersChooseCountry(code)),
  chooseCity: (city?: string) => dispatch(allFiltersChooseCity(city)),
  chooseCategory: (catid?: string) => dispatch(chooseCategory(catid)),
  chooseSubcategory: (catid?: string) => dispatch(chooseSubcategory(catid)),
  chooseLocation: (location?: LatLng) => dispatch(chooseLocation(location)),
  chooseLocationPlace: (locationPlace?: string) => dispatch(chooseLocationPlace(locationPlace)),
});

export default compose(
  withTranslation(),
  connectFilter,
  connect(mapStateToProps, mapDispatchToProps),
  connectSearch
)(AllFiltresPopup) as React.ComponentType<Props>;
