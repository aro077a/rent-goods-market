import React, { Component } from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";
import { IApplicationStore } from "../store/rootReducer";
import { connect } from "react-redux";
import { compose } from "redux";

export class MapContainer extends Component<any> {
  render() {
    const { center, zoom } = this.props;
    return (
      <Map
        centerAroundCurrentLocation
        google={this.props.google}
        zoom={zoom}
        center={center}
        initialCenter={center}
        {...this.props}
        onReady={(mapProps, map) => {
          const latLng = new google.maps.LatLng(
            mapProps.center.lat,
            mapProps.center.lng
          );
          map.setCenter(latLng);
          new google.maps.Circle({
            strokeColor: "#595959",
            strokeOpacity: 0.5,
            strokeWeight: 1,
            fillColor: "#A3A3A3",
            fillOpacity: 0.5,
            map,
            center: latLng,
            radius: 1000,
          });
        }}
      />
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  apiKey: state.rootReducer.localConfig
    ? state.rootReducer.localConfig.GoogleMapAPIkey
    : "",
});

export default compose<any>(
  connect(mapStateToProps),
  GoogleApiWrapper(({ apiKey }) => ({
    apiKey: apiKey,
  }))
)(MapContainer);
