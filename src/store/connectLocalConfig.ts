import { IApplicationStore } from "./rootReducer";
import { connect } from "react-redux";

const mapStateToProps = (state: IApplicationStore) => {
  const { localConfig } = state.rootReducer;
  return {
    localConfig,
  };
};

export default connect(mapStateToProps);
