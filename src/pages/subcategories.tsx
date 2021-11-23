import React, { Component } from "react";
import {
  Page,
  Navbar,
  List,
  ListItem,
  NavRight,
  Link,
  Icon,
} from "framework7-react";
import { compose, Dispatch } from "redux";
import { IApplicationStore, ICategory } from "../store/rootReducer";
import { ICategoryClassificator } from "../reducers/categoryReducer";
import { connect } from "react-redux";
import { IFilterState } from "../reducers/filterReducer";
import {
  allFiltresChooseCategory,
  allFiltresChooseSubcategory,
  allFiltresClearSubcategory,
} from "../actions/filterActions";
import connectFilter from "../store/connectFilter";
import { withTranslation, WithTranslation } from "react-i18next";

type Props = WithTranslation &
  IFilterState & {
    catid?: string;
    category?: ICategory;
    subcategories?: ICategoryClassificator[];
    chooseCategory?(catid?: string | null): void;
    chooseSubcategory?(catid?: string): void;
    clearFilter?(): void;
  };

class SubcategoriesPage extends Component<Props> {
  clickHandle = (item: ICategoryClassificator) => {
    if (item.children && item.children.length) {
      this.$f7router.navigate(`${item.categoryCode}/`);
    } else {
      const { catid } = this.props;

      this.props.chooseCategory(catid);
      this.props.chooseSubcategory(item.categoryCode);

      setTimeout(() => {
        this.$f7router.back("/all-filtres/", {
          force: true,
          clearPreviousHistory: true,
        });
      }, 150);
    }
  };

  render() {
    const { category, subcategories, chosenSubcategoryId, t } = this.props;

    return (
      <Page id="subcategories" name="subcategories">
        <Navbar
          title={category.name}
          backLink={t("Back").toString()}
          noHairline
          noShadow
        >
          <NavRight>
            <Link
              href="/all-filtres/"
              text={t("Clear")}
              onClick={this.props.clearFilter}
            />
          </NavRight>
        </Navbar>
        <List noHairlines>
          {subcategories.map((item, i) => (
            <ListItem
              key={i}
              link="#"
              title={item.categoryName}
              noChevron
              onClick={() => this.clickHandle(item)}
            >
              {item.categoryCode === chosenSubcategoryId && (
                <div slot="after">
                  <Icon f7="checkmark_alt" />
                </div>
              )}
            </ListItem>
          ))}
        </List>
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore, props: Props) => {
  const { url }: { url: string } = (props as any).$f7route;
  const pathsegs = url.split("/");
  const idsegs = pathsegs
    .filter((s) => s.length)
    .filter((_s, i) => i > pathsegs.indexOf("subcategory"));

  const lastsegCatId = idsegs[idsegs.length - 1];
  const categoryClassificator = state.categoryReducer.flat
    ? state.categoryReducer.flat.filter(
        (item) => item.categoryCode === lastsegCatId
      )[0]
    : null;

  const subcategories = categoryClassificator
    ? categoryClassificator.children
    : [];
  const category: ICategory =
    idsegs.length === 1
      ? state.rootReducer.localConfig.categories.filter(
          (c) => c.id === lastsegCatId
        )[0]
      : {
          id: categoryClassificator.categoryCode,
          name: categoryClassificator.categoryName,
        };

  return {
    category,
    subcategories,
    chosenCategoryId: state.filterReducer.allFiltresChosenCategoryId,
    chosenSubcategoryId: state.filterReducer.allFiltresChosenSubcategoryId,
    sortBy: state.filterReducer.allFiltresSortBy,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  chooseCategory: (catid?: string) => dispatch(allFiltresChooseCategory(catid)),
  chooseSubcategory: (catid?: string) =>
    dispatch(allFiltresChooseSubcategory(catid)),
  clearFilter: () => dispatch(allFiltresClearSubcategory()),
});

export default compose(
  withTranslation(),
  connectFilter,
  connect(mapStateToProps, mapDispatchToProps)
)(SubcategoriesPage);
