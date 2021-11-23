import { Address } from "../types/commonapi";
import { IApplicationStore } from "./rootReducer";
import { connect } from "react-redux";
import { addOrUpdateAddress, removeAddress } from "../actions/profileActions";

export interface IAccountAddressProps {
  accountAddressState: {
    accountAddOrUpdateAddressLoading?: boolean;
    accountAddOrUpdateAddressError?: boolean;
    accountRemoveAddressLoading?: boolean;
    accountRemoveAddressError?: boolean;
    addresses: Address[];
  };
  addOrUpdateAccountAddress?(address: Address, update: boolean): () => void;
  removeAccountAddress?(): (uid: string) => void;
}

const mapStateToProps = (state: IApplicationStore): IAccountAddressProps => ({
  accountAddressState: {
    ...state.profileReducer,
    ...state.sessionReducer.accountAddressState,
    addresses:
      state.sessionReducer.profile && state.sessionReducer.profile.addresses
        ? state.sessionReducer.profile.addresses
        : [],
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  addOrUpdateAccountAddress: (address: Address, update: boolean) =>
    dispatch(addOrUpdateAddress(address, update)),
  removeAccountAddress: (uid: string) => dispatch(removeAddress(uid)),
});

export default connect(mapStateToProps, mapDispatchToProps);
