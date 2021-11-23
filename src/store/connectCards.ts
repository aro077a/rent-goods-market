import { connect } from "react-redux";

import { IPaymentCardsState } from "@/reducers/paymentCardsReducer";
import { loadPaymentCardsList } from "@/actions/paymentCardsActions";

import { IApplicationStore } from "./rootReducer";

export interface ICardsProps extends IPaymentCardsState {
  hasCards?: boolean;
  loadPaymentCardsList(): () => void;
}

const mapStateToProps = (state: IApplicationStore) => ({
  ...state.paymentCardsReducer,
  hasCards: state.paymentCardsReducer.cards && state.paymentCardsReducer.cards.length > 0,
});

const mapDispatchToProps = (dispatch) => ({
  loadPaymentCardsList: () => dispatch(loadPaymentCardsList()),
});

export default connect(mapStateToProps, mapDispatchToProps);
