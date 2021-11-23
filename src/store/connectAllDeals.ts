import { connect } from "react-redux";

import { loadAllDeals, reloadAllDeals } from "@/actions/allDealsActions";
import { ISearchParams } from "@/actions/productActions";

import { IApplicationStore } from "./rootReducer";

const mapStateToProps = (state: IApplicationStore) => ({
  allDealsLoading: state.allDealsReducer.loading,
  allDealsProducts: state.allDealsReducer.products || [],
  allDealsCount: state.allDealsReducer.count,
  allDealsOffset: state.allDealsReducer.offset,
});

const mapDispatchToProps = (dispatch) => ({
  loadAllDeals: (searchParams: ISearchParams) => dispatch(loadAllDeals(searchParams)),
  reloadAllDeals: () => dispatch(reloadAllDeals()),
});

export default connect(mapStateToProps, mapDispatchToProps);
