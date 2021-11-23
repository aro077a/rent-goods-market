import { connect } from "react-redux";

import { loadAllGoods } from "@/actions/allGoodsActions";
import { ISearchParams } from "@/actions/productActions";

import { IApplicationStore } from "./rootReducer";

const mapStateToProps = (state: IApplicationStore) => ({
  allGoodsLoading: state.allGoodsReducer.loading,
  allGoodsProducts: state.allGoodsReducer.products || [],
  allGoodsCount: state.allGoodsReducer.count,
  allGoodsOffset: state.allGoodsReducer.offset,
});

const mapDispatchToProps = (dispatch) => ({
  loadAllGoods: (searchParams: ISearchParams) => dispatch(loadAllGoods(searchParams)),
});

export default connect(mapStateToProps, mapDispatchToProps);
