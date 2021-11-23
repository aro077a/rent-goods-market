import React from "react";
import {
  Page,
  Navbar,
  Block,
  BlockTitle,
  List,
  ListItem,
  NavRight,
  Link,
  View,
} from "framework7-react";

import "./categories.less";
import { compose } from "redux";
import connectFilter from "../store/connectFilter";
import connectCategories from "../store/connectCategories";
import { IFilterState } from "../reducers/filterReducer";
import { ICategory, IApplicationStore } from "../store/rootReducer";
import { withTranslation, WithTranslation } from "react-i18next";
import { connect } from "react-redux";
import { allFiltresClearCategory } from "../actions/filterActions";

const getItemStyles = (item: ICategory) => ({ backgroundColor: item.color });

type Props = WithTranslation &
  IFilterState & {
    categories?: ICategory[];
    clearFilterHandle?(): void;
  };

const CategoriesPage = ({ categories, clearFilterHandle, t }: Props) => (
  <Page id="categories" name="categories">
    <Navbar
      title={t("Categories")}
      backLink={t("Back").toString()}
      noHairline
      noShadow
    >
      <NavRight>
        <Link
          href="/all-filtres/"
          text={t("Clear")}
          onClick={clearFilterHandle}
        />
      </NavRight>
    </Navbar>
    <List noHairlines>
      {categories
        .filter((item) => item.id !== "all_filtres")
        .map((item, i) => (
          <ListItem
            key={i}
            link={`/all-filtres/categories/subcategories/${item.id}/`}
            title={item.name}
          >
            <span
              slot="media"
              className="category-item"
              style={getItemStyles(item)}
            >
              <i className={`icon ${item.icon}`}></i>
            </span>
          </ListItem>
        ))}
    </List>
  </Page>
);

const mapStateToProps = (state: IApplicationStore, props: Props) => ({
  chosenCategoryId: state.filterReducer.allFiltresChosenCategoryId,
  chosenSubcategoryId: state.filterReducer.allFiltresChosenSubcategoryId,
  sortBy: state.filterReducer.allFiltresSortBy,
});

const mapDispatchToProps = (dispatch: any) => ({
  clearFilterHandle: () => dispatch(allFiltresClearCategory()),
});

export default compose(
  connectFilter,
  connectCategories,
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation()
)(CategoriesPage);
