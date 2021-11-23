import React from "react";
import { connect } from "react-redux";
import { IApplicationStore } from "../store/rootReducer";

import "./SmallMap.less";

const getMapStyle = (
  center: string = "37.798932,-122.4382402",
  apiKey: string
) => {
  return {
    backgroundImage: `url(https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=17&size=600x600&markers=icon:${encodeURI(
      "https://mspace-ba608.firebaseapp.com/static/ic_pin-A.png"
    )}%7C${center}&key=${apiKey})`,
  };
};

const SmallMap = ({ center, apiKey }: { center?: string; apiKey?: string }) => (
  <div className="small-map" style={getMapStyle(center, apiKey)} />
);

const mapStateToProps = (state: IApplicationStore) => ({
  apiKey: state.rootReducer.localConfig
    ? state.rootReducer.localConfig.GoogleMapAPIkey
    : "",
});

export default connect<any>(mapStateToProps)(SmallMap);
