import { connect } from "react-redux";

import { ICategoryClassificator } from "@/reducers/categoryReducer";
import { getCategoriesClassificator } from "@/selectors/getCategoriesClassificator";

export default connect<{ categoriesClassificator: ICategoryClassificator[] }>(
  getCategoriesClassificator
);
