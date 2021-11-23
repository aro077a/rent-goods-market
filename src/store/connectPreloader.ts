import { IApplicationStore } from "./rootReducer";
import { connect } from "react-redux";
import { togglePreloader } from "../actions/preloaderActions";

export interface IPreloaderProps {
  preloader?: boolean;
  togglePreloader?(show?: boolean): void;
}

const mapStateToProps = (
  state: IApplicationStore,
  ownProps: Pick<IPreloaderProps, "preloader">
) => ({
  preloader:
    typeof ownProps.preloader === "undefined"
      ? state.preloaderReducer.preloader
      : ownProps.preloader,
});

const mapDispatchToProps = (dispatch: any) => ({
  togglePreloader: (show?: boolean) => dispatch(togglePreloader(show)),
});

export default connect(mapStateToProps, mapDispatchToProps);
