import { connect } from "react-redux";
import { IApplicationStore } from "./rootReducer";
import { Currency } from "../types/commonapi";

export interface ICurrencyProps {
  currencies: Currency[];
}

const mapStateToProps = (state: IApplicationStore): ICurrencyProps => ({
  currencies: state.classificatorReducer.currencyClassificator,
});

export default connect(mapStateToProps);
