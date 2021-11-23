import React from "react";
import {
  Block,
  F7Popup,
  Icon,
  Link,
  Navbar,
  NavRight,
  NavTitle,
  Page,
  Popup,
} from "framework7-react";
import { GoogleApiWrapper, IInfoWindowProps, IMapProps, Map, Marker } from "google-maps-react";
import GooglePlacesAutocomplete, { geocodeByPlaceId } from "react-google-places-autocomplete";
import { withTranslation, WithTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import cn from "classnames";

import { IcClose } from "@/components-ui/icons";
import { IApplicationStore } from "@/store/rootReducer";
import { ProductAddress } from "@/types/marketplaceapi";
import { detectLocation } from "@/utils";
import { ThemedButton } from "@/components/ThemedButton";

import "./style.less";

type Props = F7Popup.Props &
  IMapProps &
  IInfoWindowProps &
  Pick<WithTranslation, "t"> & {
    apiKey?: string;
    language?: string;
    coordinates?: any;
    initialized: any;
    onLocationSelect: any;
    title?: string;
  };

type State = {
  position?: any;
  place?: string;
  placeId?: string;
  fetchingAddress: boolean;
  address?: ProductAddress;
};

const initialPosition = {
  lat: 0,
  lng: 0,
};

class MapPopup extends React.Component<Props, State> {
  private mounted: boolean;
  private _mapProps: any;
  private _map: any;

  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      position: initialPosition,
      fetchingAddress: false,
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async componentDidUpdate(prevProps: Readonly<Props>) {
    const { initialized, coordinates } = this.props;
    const { position } = this.state;
    if (
      this.mounted &&
      initialized &&
      !prevProps.initialized &&
      position.lat === 0 &&
      position.lng === 0
    ) {
      if (coordinates && coordinates.lat !== 0 && coordinates.lng !== 0) {
        this.setState({ position: coordinates });
      } else {
        await this.setCurrentPosition();
      }
    }
  }

  setCurrentPosition = async () => {
    const location = await detectLocation();
    if (location.latitude !== 0 && location.longitude !== 0) {
      const position = {
        lat: location.latitude,
        lng: location.longitude,
      };
      this.setState({ position });
      this.updateNearbyPlaces(position);
    }
  };

  setPositionHandle = (selected) => {
    this.setState({
      place: selected.label,
      placeId: selected.value.place_id,
    });
    this.setAddress(selected.value.place_id);
  };

  setAddress = (placeId) => {
    geocodeByPlaceId(placeId)
      .then((results) => {
        if (results.length > 0) {
          // TODO
          this.setState({
            position: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            },
          });
          if (results[0].address_components) {
            const address: ProductAddress = {
              firstAddressLine: "",
            };
            results[0].address_components.map((component) => {
              if (component.types.includes("route") || component.types.includes("street_number")) {
                address.firstAddressLine += component.long_name + " ";
              }
              if (component.types.includes("sublocality")) {
                address.secondAddressLine = component.long_name;
              }
              if (component.types.includes("locality")) {
                address.city = component.long_name;
              }
              if (component.types.includes("postal_code")) {
                address.postalCode = component.long_name;
              }
              if (component.types.includes("country")) {
                address.countryCode = component.short_name;
              }
            });
            address.firstAddressLine = address.firstAddressLine.trim();
            this.setState({
              address: address,
            });
          }
        }
      })
      .catch((error) => console.error(error));
  };

  selectPosition = () => {
    const { position, place, placeId, address } = this.state;
    this.props.onLocationSelect(position, place, placeId, address);
  };

  fetchPlaces = (mapProps, map) => {
    this._mapProps = mapProps;
    this._map = map;
    const { position } = this.state;
    this.updateNearbyPlaces(position);
    map.setCenter(position);
  };

  selectPositionOnMap = (mapProps, map, event) => {
    const position = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    this.updateNearbyPlaces(position, 200, "route");
    this.setState({
      position: position,
    });
  };

  updateNearbyPlaces(location, radius = 1000, type: "locality" | "route" = "locality") {
    const { google } = this._mapProps;
    const service = new google.maps.places.PlacesService(this._map);
    this.setState({ fetchingAddress: true });
    service.nearbySearch(
      {
        location,
        radius,
        type,
      },
      (results) => {
        if (results.length > 0) {
          const firstPlace = results[0];
          this.setState({
            place: firstPlace.name,
            placeId: firstPlace.place_id,
          });
          this.setAddress(firstPlace.place_id);
          this.setState({ fetchingAddress: false });
        }
      }
    );
  }

  render() {
    const { initialized, onLocationSelect, className, t, title, ...props } = this.props;
    const { position } = this.state;

    return (
      <Popup {...props} className={cn("map-popup", className)}>
        <Page>
          <Navbar noShadow noHairline>
            {title && <NavTitle>{title}</NavTitle>}
            <NavRight>
              <Link popupClose>
                <IcClose />
              </Link>
            </NavRight>
          </Navbar>
          <Block className="map-container">
            {initialized && (
              <>
                <Map
                  className="google-map"
                  centerAroundCurrentLocation={true}
                  disableDefaultUI={true}
                  zoom={14}
                  initialCenter={position}
                  center={position}
                  google={this.props.google}
                  containerStyle={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                  onReady={this.fetchPlaces}
                  onClick={this.selectPositionOnMap}
                  fullscreenControl={true}
                  fullscreenControlOptions={{
                    position: google.maps.ControlPosition.BOTTOM_LEFT,
                  }}
                  zoomControl={true}
                  zoomControlOptions={{
                    position: google.maps.ControlPosition.BOTTOM_LEFT,
                  }}
                  {...this.props}
                >
                  <GooglePlacesAutocomplete
                    selectProps={{
                      className: "map-autocomplete",
                      classNamePrefix: "google-places",
                      placeholder: t("Select location"),
                      onChange: this.setPositionHandle,
                      noOptionsMessage: () => t("No options").toString(),
                    }}
                  />
                  <Marker position={position} draggable={true} />
                </Map>
                <div className="set-location-container">
                  <ThemedButton
                    className="set-location-btn"
                    fill
                    large
                    round
                    disabled={this.state.fetchingAddress}
                    onClick={this.selectPosition}
                    popupClose
                  >
                    {t("Set Location")}
                  </ThemedButton>
                  <ThemedButton
                    className="my-location"
                    fill
                    large
                    round
                    onClick={this.setCurrentPosition}
                  >
                    <Icon material="gps_fixed" />
                  </ThemedButton>
                </div>
              </>
            )}
          </Block>
        </Page>
      </Popup>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  apiKey: state.rootReducer.localConfig ? state.rootReducer.localConfig.GoogleMapAPIkey : "",
  language: state.rootReducer.language,
});

export default compose<any>(
  withTranslation(),
  connect(mapStateToProps),
  GoogleApiWrapper(({ apiKey, language }) => ({
    apiKey: apiKey,
    libraries: ["places", "geometry"],
    language: language,
  }))
)(MapPopup);
