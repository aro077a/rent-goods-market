import { connect } from "react-redux";
import { IApplicationStore } from "./rootReducer";

const mapStateToProps = (state: IApplicationStore) => ({
  categories: state.rootReducer.localConfig
    ? state.rootReducer.localConfig.categories
    : [],
});

export default connect(mapStateToProps);
