import React, { Component } from "react";
import { GoogleApiWrapper, IInfoWindowProps, IMapProps, Map, Marker } from "google-maps-react";
import { Page, Navbar, Icon } from "framework7-react";
import GooglePlacesAutocomplete, { geocodeByPlaceId } from "react-google-places-autocomplete";
import { LatLng } from "react-google-places-autocomplete/build/GooglePlacesAutocomplete.types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";

import {
  allFiltersSetPlace,
  allFiltersUpdatePosition,
  allFiltresClearPlace,
  allFiltresLocationSelected,
} from "@/actions/filterActions";
import { ThemedButton } from "@/components/ThemedButton";
import { IApplicationStore } from "@/store/rootReducer";
import { detectLocation } from "@/utils";

import "./location.less";

type Props = WithTranslation &
  IMapProps &
  IInfoWindowProps & {
    location?: LatLng;
    placeId?: string;
    placeTitle?: string;
    updatePosition?(position: LatLng): void;
    setPlace?(placeId: string, placeTitle: string): void;
    clearPlace?(): void;
    selectLocation?(): void;
  };

type State = {
  position: LatLng;
};

class LocationPage extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      position: {
        lat: 0,
        lng: 0,
      },
    };
  }

  async componentDidMount() {
    await this.updatePosition();
  }

  updatePosition = async () => {
    const location = await detectLocation();
    if (location.latitude !== 0 && location.longitude !== 0) {
      this.setState({
        position: {
          lat: location.latitude,
          lng: location.longitude,
        },
      });
    }
  };

  setPositionHandle = (selected) => {
    const placeId = selected.value.place_id;
    const placeTitle = selected.label;
    this.props.setPlace(placeId, placeTitle);
    geocodeByPlaceId(selected.value.place_id)
      .then((results) => {
        if (results.length > 0) {
          this.setState({
            position: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            },
          });
        }
      })
      .catch((error) => console.error(error));
  };

  fetchPlaces = (mapProps, map) => {
    const { position } = this.state;
    const { google } = mapProps;
    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(
      {
        location: position,
        radius: 10,
      },
      (results) => {
        if (results.length > 0) {
          const firstPlace = results[0];
          this.props.setPlace(firstPlace.place_id, firstPlace.name);
        }
      }
    );
  };

  setLocationHandle = () => {
    console.log("setLocationHandle");
    const { position } = this.state;
    this.props.updatePosition(position);
    setTimeout(() => {
      this.$f7router.back("/all-filtres/", {
        force: true,
        //clearPreviousHistory: true,
      });
    }, 150);
  };

  render() {
    const { position } = this.state;
    const { t } = this.props;
    return (
      <Page id="location" name="location">
        <Navbar title={t("Location")} backLink={t("Back").toString()} noHairline noShadow />
        <Map
          centerAroundCurrentLocation
          disableDefaultUI
          zoom={14}
          google={this.props.google}
          initialCenter={position}
          center={position}
          containerStyle={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
          onReady={this.fetchPlaces}
          {...this.props}
        >
          <GooglePlacesAutocomplete
            selectProps={{
              className: "map-autocomplete",
              classNamePrefix: "google-places",
              onChange: this.setPositionHandle,
            }}
          />
          <Marker position={position} />
        </Map>
        <div className="set-location-container">
          <ThemedButton
            className="set-location-btn"
            fill
            large
            round
            onClick={this.setLocationHandle}
          >
            {t("Set Location")}
          </ThemedButton>
          <ThemedButton className="my-location" fill large round onClick={this.updatePosition}>
            <Icon material="gps_fixed" />
          </ThemedButton>
        </div>
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  location: state.filterReducer.allFiltresLocation,
  placeId: state.filterReducer.allFiltresLocationPlaceId,
  placeTitle: state.filterReducer.allFiltresLocationPlaceTitle,
  apiKey: state.rootReducer.localConfig ? state.rootReducer.localConfig.GoogleMapAPIkey : "",
});

const mapDispatchToProps = (dispatch: any) => ({
  updatePosition: (position: LatLng) => {
    dispatch(allFiltersUpdatePosition(position));
  },
  setPlace: (placeId: string, placeTitle: string) => {
    dispatch(allFiltersSetPlace(placeId, placeTitle));
  },
  clearPlace: () => {
    dispatch(allFiltresClearPlace());
  },
  selectLocation: () => {
    dispatch(allFiltresLocationSelected());
  },
});

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
  GoogleApiWrapper(({ apiKey }) => ({
    apiKey: apiKey,
    libraries: ["places", "geometry"],
  }))
)(LocationPage);
