import { connect } from "react-redux";
import { IApplicationStore } from "./rootReducer";
import { Wallet } from "../types/commonapi";

export interface IWalletProps {
  wallets: Wallet[];
}

const mapStateToProps = (state: IApplicationStore): IWalletProps => ({
  wallets: state.myCurrenciesReducer.currencies,
});

export default connect(mapStateToProps);
