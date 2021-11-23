import { IApplicationStore } from "./rootReducer";
import { connect } from "react-redux";

import { share } from "@/actions/shareActions";
import { IShareState } from "@/reducers/shareReducer";

export interface IShareProps {
  shareStore: IShareState;
  share?(title: string, url: string): void;
}

const mapStateToProps = (state: IApplicationStore): IShareProps => ({
  shareStore: state.shareReducer,
});

const mapDispatchToProps = (dispatch) => ({
  share: (title: string, url: string) => dispatch(share(title, url)),
});

export default connect(mapStateToProps, mapDispatchToProps);
