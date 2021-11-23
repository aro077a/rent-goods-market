import { detectLocation, Location, reverseGeocoding } from "@/utils";

import { changeCountry } from "./customer-location/customerLocationActions";

export const INIT_GEOLOCATION_LOADING = "INIT_GEOLOCATION_LOADING";
export const INIT_GEOLOCATION_SUCCESS = "INIT_GEOLOCATION_SUCCESS";
export const INIT_GEOLOCATION_ERROR = "INIT_GEOLOCATION_ERROR";

const geoLoading = () => ({
  type: INIT_GEOLOCATION_LOADING,
});

const geoLoadingSuccess = (data: Location & { country: string }) => ({
  type: INIT_GEOLOCATION_SUCCESS,
  data,
});

const geoLocationError = (error: unknown) => ({
  type: INIT_GEOLOCATION_ERROR,
  error,
});

export const initGeolocation = () => async (dispatch) => {
  dispatch(geoLoading());
  try {
    const data = await detectLocation();
    const result = await reverseGeocoding(data.latitude, data.longitude);

    let country = null;

    if (result && result.results && result.results.length) {
      const address_components = result.results[0].address_components;
      if (address_components && address_components.length) {
        country = {
          long_name: address_components[0].long_name,
          short_name: address_components[0].short_name,
        };
        dispatch(changeCountry(country.short_name));
      }
    }

    dispatch(geoLoadingSuccess({ ...data, country }));
  } catch (error) {
    console.error("at geolocationActions in initGeolocation", error);

    dispatch(geoLocationError(error.toString()));
  }
};
