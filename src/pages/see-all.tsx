import React, { Component } from "react";
import { Page, Navbar } from "framework7-react";
import { compose } from "redux";
import { ICategory, IApplicationStore } from "../store/rootReducer";
import { IProduct, IProductState } from "../reducers/productReducer";
import { connect } from "react-redux";
import { Catalog } from "../components/Catalog/index";
import {
  ISearchParams,
  searchClear,
  searchProducts,
  addToWishList,
} from "../actions/productActions";
import { withTranslation, WithTranslation } from "react-i18next";

import "./categories.less";
import "./see-all.less";

type Props = WithTranslation & {
  catid?: string;
  category?: ICategory;
  searchLoading?: boolean;
  searchedProducts?: IProduct[];
  search?(searchParams: ISearchParams): void;
  clearSearch?(): void;
  productState?: IProductState;
  addToWish?(uid?: string): void;
};

class SeeAllPage extends Component<Props> {
  componentDidMount() {
    this.search();
  }

  componentWillUnmount() {
    this.props.clearSearch();
  }

  search = () => {
    const { searchLoading, catid } = this.props;
    const { count, offset } = this.props.productState;

    if (!searchLoading && count) {
      this.props.search({ category: catid, count, offset });
    }
  };

  loadMore = () => {
    this.search();
  };

  render() {
    const { category, searchLoading, searchedProducts, t } = this.props;

    return (
      <Page
        id="see_all"
        name="see-all"
        infinite
        infiniteDistance={300}
        infinitePreloader={searchLoading}
        onInfinite={this.loadMore}
      >
        <Navbar
          title={category.name}
          backLink={t("Back").toString()}
          noHairline
          noShadow
        />
        <Catalog
          items={searchedProducts}
          addToWish={this.props.addToWish}
          showFeaturesHiglight
        />
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore, props: Props) => {
  const { catid } = props;
  const category = state.rootReducer.localConfig.categories.filter(
    (item) => item.id === catid
  )[0];

  return {
    category,
    searchLoading: state.productReducer.loading,
    searchedProducts: state.productReducer.products || [],
    productState: state.productReducer,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  clearSearch: () => dispatch(searchClear()),
  search: (searchParams: ISearchParams) =>
    dispatch(searchProducts(searchParams)),
  addToWish: (uid?: string) => dispatch(addToWishList(uid)),
});

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(SeeAllPage);
