import { connect } from "react-redux";
import { IApplicationStore } from "./rootReducer";
import { getProfile } from "../selectors/profile";

const mapStateToProps = (state: IApplicationStore) => ({
  profile: getProfile(state),
  updating: state.profileReducer.updating,
  error: state.profileReducer.error,
});

export default connect(mapStateToProps);
