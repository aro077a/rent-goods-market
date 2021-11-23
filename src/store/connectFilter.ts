import { connect } from "react-redux";

import { IFilterState } from "@/reducers/filterReducer";

import { IApplicationStore } from "./rootReducer";

const mapStateToProps = (state: IApplicationStore): IFilterState => ({
  chosenCategoryId: state.filterReducer.chosenCategoryId,
  chosenSubcategoryId: state.filterReducer.chosenSubcategoryId,
  sortBy: state.filterReducer.sortBy,
  location: state.filterReducer.location,
});

export default connect(mapStateToProps);
