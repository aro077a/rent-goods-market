import { IApplicationStore } from "./rootReducer";
import { connect } from "react-redux";
import { IProductStatusState } from "../reducers/productStatusReducer";
import { changeProductStatus } from "../actions/productStatusActions";

export interface IProductStatusProps {
  productStatusReducer?: IProductStatusState;
  changeProductStatus?(
    uid: string,
    oldStatus: string,
    newStatus: string,
    quantity?: number
  ): void;
}

const mapStateToProps = (state: IApplicationStore): IProductStatusProps => ({
  productStatusReducer: state.productStatusReducer,
});

const mapDispatchToProps = (dispatch: any): IProductStatusProps => ({
  changeProductStatus: (
    uid: string,
    oldStatus: string,
    newStatus: string,
    quantity?: number
  ) => dispatch(changeProductStatus(uid, oldStatus, newStatus, quantity)),
});

export default connect(mapStateToProps, mapDispatchToProps);
