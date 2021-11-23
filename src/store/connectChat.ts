import { IApplicationStore } from "./rootReducer";
import { connect } from "react-redux";
import {
  startChat,
  startChatWithOrder,
  startChatWithProduct,
} from "../actions/chatActions";
import { IChatState } from "../reducers/chatReducer";
import { IProduct } from "../reducers/productReducer";

export interface IChatProps {
  chatReducer: IChatState;
  startChat?(sellerPhone: string, message: string): void;
  startChatWithOrder?(item: IProduct): void;
  startChatWithProduct?(item: IProduct, message?: string): void;
}

const mapStateToProps = (state: IApplicationStore): IChatProps => ({
  chatReducer: state.chatReducer,
});

const mapDispatchToProps = (dispatch: any) => ({
  startChat: (sellerPhone: string, message: string) =>
    dispatch(startChat(sellerPhone, message)),
  startChatWithOrder: (item: IProduct) => dispatch(startChatWithOrder(item)),
  startChatWithProduct: (item: IProduct, message?: string) =>
    dispatch(startChatWithProduct(item, message)),
});

export default connect(mapStateToProps, mapDispatchToProps);
