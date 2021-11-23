import React from "react";
import { connect } from "react-redux";
import { IApplicationStore } from "../../store/rootReducer";
import { Profile } from "../../reducers/sessionReducer";

import "./style.less";

type Props = {
  status: string;
  type: string;
};

const ProfileStatus = ({ status, type }: Props) => (
  <div className="profile-status">
    <span className="type">{type}</span>
    <span className="status">{status}</span>
  </div>
);

const mapStateToProps = (
  state: IApplicationStore,
  { profile }: { profile: Profile }
): Props => {
  const status =
    state.classificatorReducer.entitiesClassificators.Account_Status.filter(
      (item) => item.code === profile.status
    )[0] || {};
  const type =
    state.classificatorReducer.entitiesClassificators.Account_Type.filter(
      (item) => item.code === profile.type
    )[0] || {};
  return {
    status: status.value,
    type: type.value,
  };
};

export default connect<Props>(mapStateToProps)(ProfileStatus) as React.FC<{
  profile: Profile;
}>;
