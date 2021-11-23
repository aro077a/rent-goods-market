import { LatLng } from "react-google-places-autocomplete/build/GooglePlacesAutocomplete.types";
import { AnyAction } from "redux";
import {
  CHOOSE_CATEGORY,
  CHOOSE_SUB_CATEGORY,
  CHOOSE_SORT_BY,
  CHOOSE_CATEGORY_SUB_CATEGORY,
  CLEAR_SORT_BY,
  ALL_FILTRES_CHOOSE_CATEGORY,
  ALL_FILTRES_CHOOSE_SUB_CATEGORY,
  ALL_FILTRES_CHOOSE_SORT_BY,
  ALL_FILTRES_CLEAR,
  ALL_FILTRES_CLEAR_CATEGORY,
  ALL_FILTRES_CLEAR_SUB_CATEGORY,
  ALL_FILTRES_APPLY,
  ALL_FILTRES_FILL,
  ALL_FILTRES_UPDATE_POSITION,
  ALL_FILTRES_SET_PLACE,
  ALL_FILTRES_CLEAR_PLACE,
  ALL_FILTRES_LOCATION_SELECTED,
  CHOOSE_LOCATION,
  CHOOSE_LOCATION_PLACE,
  ALL_FILTERS_CHOOSE_CITY,
  ALL_FILTERS_CHOOSE_COUNTRY,
} from "../actions/filterActions";

export enum SortBy {
  "popular" = 0,
  "sales_first",
  "price_low_to_high",
  "price_high_to_low",
  "what_s_new",
}

export type _SortBy = {
  direction?: "ASC" | "DESC";
  field: string;
  sortingIndex: number;
  groupIndex?: number /* for grouping by row in UI */;
  selected?: boolean;
  displayText?: string;
};

export interface IFilterState {
  city?: string;
  countryCode?: string;
  chosenCategoryId?: string;
  chosenSubcategoryId?: string;
  sortBy?: SortBy[];
  location?: LatLng;
  locationPlace?: string;

  allFiltersChosenCountry?: string;
  allFiltersChosenCity?: string;
  allFiltresChosenCategoryId?: string;
  allFiltresChosenSubcategoryId?: string;
  allFiltresSortBy?: SortBy[];
  allFiltresLocation?: LatLng;
  allFiltresLocationPlace?: string;
}

const initialPosition: LatLng = {
  lat: 0,
  lng: 0,
};

const initialState: IFilterState = {
  city: null,
  countryCode: null,
  chosenCategoryId: null,
  chosenSubcategoryId: null,
  sortBy: [SortBy.popular],
  location: null,
  locationPlace: null,

  allFiltersChosenCountry: null,
  allFiltersChosenCity: null,
  allFiltresChosenCategoryId: null,
  allFiltresChosenSubcategoryId: null,
  allFiltresSortBy: [SortBy.popular],
  allFiltresLocation: initialPosition,
  allFiltresLocationPlace: null,
};

function applySortByToSortMatrix(sortByItem: SortBy, matrix: SortBy[]) {
  let inverted = matrix.includes(sortByItem)
    ? matrix.filter((item) => item !== sortByItem)
    : [...matrix, sortByItem];
  // apply rules
  switch (sortByItem) {
    case SortBy.popular:
      inverted = inverted.filter((item) => item !== SortBy.sales_first);
      break;
    case SortBy.sales_first:
      inverted = inverted.filter((item) => item !== SortBy.popular);
      break;
    case SortBy.price_high_to_low:
      inverted = inverted.filter((item) => item !== SortBy.price_low_to_high);
      break;
    case SortBy.price_low_to_high:
      inverted = inverted.filter((item) => item !== SortBy.price_high_to_low);
      break;
  }
  return inverted;
}

const filterReducer = (
  state = initialState,
  action: AnyAction
): IFilterState => {
  switch (action.type) {
    case CHOOSE_CATEGORY: {
      const { catid } = action;
      return {
        ...state,
        chosenCategoryId: catid,
        chosenSubcategoryId: null,
      };
    }
    case CHOOSE_SUB_CATEGORY: {
      const { catid } = action;
      return {
        ...state,
        chosenSubcategoryId: catid,
      };
    }
    case CHOOSE_CATEGORY_SUB_CATEGORY: {
      const { catid, subcatid } = action;
      return {
        ...state,
        chosenCategoryId: catid,
        chosenSubcategoryId: subcatid,
      };
    }
    case CHOOSE_SORT_BY: {
      const selectedSortBy = action.sortBy;
      const { sortBy } = state;

      if (action.refresh) {
        return {
          ...state,
          sortBy: [selectedSortBy],
        };
      }

      return {
        ...state,
        sortBy: applySortByToSortMatrix(selectedSortBy, sortBy),
      };
    }
    case CHOOSE_LOCATION: {
      const { location } = action;
      return {
        ...state,
        location: location,
      };
    }
    case CHOOSE_LOCATION_PLACE: {
      const { locationPlace } = action;
      return {
        ...state,
        locationPlace: locationPlace,
      };
    }
    case CLEAR_SORT_BY: {
      return {
        ...state,
        sortBy: initialState.sortBy,
      };
    }
    case ALL_FILTERS_CHOOSE_COUNTRY: {
      const { code } = action;
      return {
        ...state,
        allFiltersChosenCountry: code,
      };
    }
    case ALL_FILTERS_CHOOSE_CITY: {
      const { city } = action;
      return {
        ...state,
        allFiltersChosenCity: city,
      };
    }
    case ALL_FILTRES_CHOOSE_CATEGORY: {
      const { catid } = action;
      return {
        ...state,
        allFiltresChosenCategoryId: catid,
        allFiltresChosenSubcategoryId: null,
      };
    }
    case ALL_FILTRES_CHOOSE_SUB_CATEGORY: {
      const { catid } = action;
      return {
        ...state,
        allFiltresChosenSubcategoryId: catid,
      };
    }
    case ALL_FILTRES_CHOOSE_SORT_BY: {
      const selectedSortBy = action.sortBy;
      const { sortBy } = state;

      let allFiltresSortBy = state.allFiltresSortBy;
      if (!allFiltresSortBy) {
        allFiltresSortBy = [...sortBy];
      }

      return {
        ...state,
        allFiltresSortBy: applySortByToSortMatrix(
          selectedSortBy,
          allFiltresSortBy
        ),
      };
    }
    case ALL_FILTRES_FILL: {
      return {
        ...state,
        allFiltresChosenCategoryId: state.chosenCategoryId,
        allFiltresChosenSubcategoryId: state.chosenSubcategoryId,
        allFiltresSortBy: state.sortBy,
        allFiltresLocation: state.location,
        allFiltresLocationPlace: state.locationPlace,
      };
    }
    case ALL_FILTRES_CLEAR: {
      return {
        ...state,
        allFiltersChosenCountry: null,
        allFiltersChosenCity: null,
        allFiltresChosenCategoryId: null,
        allFiltresChosenSubcategoryId: null,
        allFiltresSortBy: initialState.allFiltresSortBy,
        allFiltresLocation: initialPosition,
        allFiltresLocationPlace: null,
      };
    }
    case ALL_FILTRES_CLEAR_CATEGORY: {
      return {
        ...state,
        allFiltresChosenCategoryId: null,
        allFiltresChosenSubcategoryId: null,
      };
    }
    case ALL_FILTRES_CLEAR_SUB_CATEGORY: {
      return {
        ...state,
        allFiltresChosenSubcategoryId: null,
      };
    }
    case ALL_FILTRES_UPDATE_POSITION: {
      const { position } = action;
      return {
        ...state,
        allFiltresLocation: position,
      };
    }
    case ALL_FILTRES_SET_PLACE: {
      const { place } = action;
      return {
        ...state,
        allFiltresLocationPlace: place,
      };
    }
    case ALL_FILTRES_CLEAR_PLACE: {
      return {
        ...state,
        allFiltresLocationPlace: null,
      };
    }
    case ALL_FILTRES_LOCATION_SELECTED: {
      return state;
    }
    case ALL_FILTRES_APPLY: {
      return {
        ...state,
        city: state.allFiltersChosenCity,
        countryCode: state.allFiltersChosenCountry,
        chosenCategoryId: state.allFiltresChosenCategoryId,
        chosenSubcategoryId: state.allFiltresChosenSubcategoryId,
        sortBy: state.allFiltresSortBy,
        location: state.allFiltresLocation,
        locationPlace: state.allFiltresLocationPlace,
      };
    }
    default:
      return state;
  }
};

export default filterReducer;
