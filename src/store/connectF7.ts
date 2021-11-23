import { IApplicationStore } from "./rootReducer";
import { connect } from "react-redux";
import Framework7 from "framework7";

export interface WithFramework7Props {
  f7: Framework7;
  $f7: Framework7;
}

const mapStateToProps = (state: IApplicationStore): WithFramework7Props => {
  const { f7 } = state.rootReducer;
  return {
    f7,
    $f7: f7,
  };
};

export default connect(mapStateToProps);
