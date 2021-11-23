import { LatLng } from "react-google-places-autocomplete/build/GooglePlacesAutocomplete.types";
import { SortBy } from "../reducers/filterReducer";

export const CHOOSE_CATEGORY = "CHOOSE_CATEGORY";
export const CHOOSE_SUB_CATEGORY = "CHOOSE_SUB_CATEGORY";
export const CHOOSE_CATEGORY_SUB_CATEGORY = "CHOOSE_CATEGORY_SUB_CATEGORY";
export const CHOOSE_SORT_BY = "CHOOSE_SORT_BY";
export const CHOOSE_LOCATION = "CHOOSE_LOCATION";
export const CHOOSE_LOCATION_PLACE = "CHOOSE_LOCATION_PLACE";
export const CLEAR_SORT_BY = "CLEAR_SORT_BY";

export const ALL_FILTERS_CHOOSE_COUNTRY = "ALL_FILTERS_CHOOSE_COUNTRY";
export const ALL_FILTERS_CHOOSE_CITY = "ALL_FILTERS_CHOOSE_CITY";
export const ALL_FILTRES_CHOOSE_CATEGORY = "ALL_FILTRES_CHOOSE_CATEGORY";
export const ALL_FILTRES_CHOOSE_SUB_CATEGORY = "ALL_FILTRES_CHOOSE_SUB_CATEGORY";
export const ALL_FILTRES_CHOOSE_SORT_BY = "ALL_FILTRES_CHOOSE_SORT_BY";
export const ALL_FILTRES_FILL = "ALL_FILTRES_FILL";
export const ALL_FILTRES_CLEAR = "ALL_FILTRES_CLEAR";
export const ALL_FILTRES_CLEAR_CATEGORY = "ALL_FILTRES_CLEAR_CATEGORY";
export const ALL_FILTRES_CLEAR_SUB_CATEGORY = "ALL_FILTRES_CLEAR_SUB_CATEGORY";
export const ALL_FILTRES_APPLY = "ALL_FILTRES_APPLY";
export const ALL_FILTRES_UPDATE_POSITION = "ALL_FILTRES_UPDATE_POSITION";
export const ALL_FILTRES_CLEAR_PLACE = "ALL_FILTRES_CLEAR_PLACE";
export const ALL_FILTRES_SET_PLACE = "ALL_FILTRES_SET_PLACE";
export const ALL_FILTRES_LOCATION_SELECTED = "ALL_FILTRES_LOCATION_SELECTED";

export const allFiltresClearPlace = () => {
  return { type: ALL_FILTRES_CLEAR_PLACE };
};

export const allFiltresLocationSelected = () => {
  return { type: ALL_FILTRES_LOCATION_SELECTED };
};

export const allFiltresFill = () => {
  return { type: ALL_FILTRES_FILL };
};

export const allFiltresClear = () => {
  return { type: ALL_FILTRES_CLEAR };
};

export const allFiltresClearCategory = () => {
  return { type: ALL_FILTRES_CLEAR_CATEGORY };
};

export const allFiltresClearSubcategory = () => {
  return { type: ALL_FILTRES_CLEAR_SUB_CATEGORY };
};

export const applyAllFiltres = () => {
  return { type: ALL_FILTRES_APPLY };
};

const chooseCategoryAction = (catid: string) => ({
  type: CHOOSE_CATEGORY,
  catid,
});

const chooseSubcategoryAction = (catid: string) => ({
  type: CHOOSE_SUB_CATEGORY,
  catid,
});

const chooseCategorySubcategoryAction = (catid: string, subcatid: string) => ({
  type: CHOOSE_CATEGORY_SUB_CATEGORY,
  catid,
  subcatid,
});

const chooseSortByAction = (sortBy: SortBy, refresh?: boolean) => ({
  type: CHOOSE_SORT_BY,
  sortBy,
  refresh,
});

const chooseLocationAction = (location: LatLng | null) => ({
  type: CHOOSE_LOCATION,
  location,
});

const chooseLocationPlaceAction = (locationPlace: string | null) => ({
  type: CHOOSE_LOCATION_PLACE,
  locationPlace,
});

const allFiltersChooseCountryAction = (code: string) => ({
  type: ALL_FILTERS_CHOOSE_COUNTRY,
  code,
});

const allFiltersChooseCityAction = (city: string) => ({
  type: ALL_FILTERS_CHOOSE_CITY,
  city,
});

const allFiltresChooseCategoryAction = (catid: string) => ({
  type: ALL_FILTRES_CHOOSE_CATEGORY,
  catid,
});

const allFiltresChooseSubcategoryAction = (catid: string) => ({
  type: ALL_FILTRES_CHOOSE_SUB_CATEGORY,
  catid,
});

const allFiltresChooseSortByAction = (sortBy: SortBy) => ({
  type: ALL_FILTRES_CHOOSE_SORT_BY,
  sortBy,
});

const allFiltersUpdatePositionAction = (position: LatLng) => ({
  type: ALL_FILTRES_UPDATE_POSITION,
  position,
});

const allFiltersSetPlaceAction = (place: string) => ({
  type: ALL_FILTRES_SET_PLACE,
  place,
});

export const chooseCategory = (catid: string) => {
  return chooseCategoryAction(catid);
};

export const chooseSubcategory = (catid: string) => {
  return chooseSubcategoryAction(catid);
};

export const chooseCategorySubcategory = (catid: string, subcatid: string) => {
  return chooseCategorySubcategoryAction(catid, subcatid);
};

export const chooseSortBy = (sortBy: SortBy, refresh?: boolean) => {
  return chooseSortByAction(sortBy, refresh);
};

export const chooseLocation = (location: LatLng | null) => {
  return chooseLocationAction(location);
};

export const chooseLocationPlace = (locationPlace: string | null) => {
  return chooseLocationPlaceAction(locationPlace);
};

export const clearSortBy = () => {
  return { type: CLEAR_SORT_BY };
};

export const allFiltersChooseCountry = (code: string) => allFiltersChooseCountryAction(code);

export const allFiltersChooseCity = (city: string) => allFiltersChooseCityAction(city);

export const allFiltresChooseCategory = (catid: string) => {
  return allFiltresChooseCategoryAction(catid);
};

export const allFiltresChooseSubcategory = (catid: string) => {
  return allFiltresChooseSubcategoryAction(catid);
};

export const allFiltresChooseSortBy = (sortBy: SortBy) => {
  return allFiltresChooseSortByAction(sortBy);
};

export const allFiltersUpdatePosition = (position: LatLng) => {
  return allFiltersUpdatePositionAction(position);
};

export const allFiltersSetPlace = (place: string) => {
  return allFiltersSetPlaceAction(place);
};
