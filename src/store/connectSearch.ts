import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { searchProducts, searchClear, ISearchParams } from "@/actions/productActions";
import { IProduct } from "@/reducers/productReducer";

import { IApplicationStore } from "./rootReducer";

const mapStateToProps = (state: IApplicationStore) => ({
  searchLoading: state.productReducer.loading,
  searchedProducts: state.productReducer.products,
  searchLoadingAutocomplete: state.productReducer.loadingAutocomplete,
  searchProductsAutocomplete: state.productReducer.productsAutocomplete,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      search: searchProducts,
      clearSearch: searchClear,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps);

export type SearchConnectorProps = ReturnType<typeof mapStateToProps> & {
  search: (params: ISearchParams, autocomplete?: boolean) => Promise<void | IProduct[]>;
  clearSearch: (autocomplete?: boolean) => ReturnType<typeof searchClear>;
};
