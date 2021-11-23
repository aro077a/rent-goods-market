/* eslint-disable no-undef */
import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { compose } from "redux";
import { Slider, SliderType } from "../Slider";
import { Banner } from "../../types/marketplaceapi";
import { loadMarketingBanners, registerBannerClick } from "../../actions/bannersActions";
import { IApplicationStore } from "../../store/rootReducer";
import { connect } from "react-redux";
import { ICategoryClassificator } from "../../reducers/categoryReducer";
import connectCategoriesClassificator from "../../store/connectCategoriesClassificator";
import { getQueryParameterFromURL } from "../../utils";
import { ISearchParams, searchProducts } from "../../actions/productActions";
import { chooseCategorySubcategory } from "../../actions/filterActions";

import "./style.less";
import { Profile } from "../../reducers/sessionReducer";
import connectProfile from "../../store/connectProfile";

type Props = WithTranslation & {
  banners: Banner[];
  count: number;
  categoriesClassificator?: ICategoryClassificator[];
  loadMarketingBanners?(): () => void;
  chooseCategorySubcategory(catid?: string, subcatid?: string): () => void;
  registerBannerClick(bannerUid: string, channel?: string): () => void;
  search(searchParams: ISearchParams): () => void;
  profile: Profile;
  loading: boolean;
};

class BigMarketingBannerSlider extends React.Component<Props> {
  componentDidMount() {
    /* TODO */
    const { banners } = this.props;
    if (!banners?.length) this.props.loadMarketingBanners();
  }

  componentDidUpdate(prevProps: Props) {
    this.handleAllLoading(prevProps);
  }

  handleAllLoading(prevProps: Props) {
    /* TODO */
    const { loading, banners } = this.props;
    if (!loading && loading !== prevProps.loading && !banners?.length) {
      this.props.loadMarketingBanners();
    }
  }

  marketingBannerClickHandle = (item: Banner) => {
    const { targetUrl, uid } = item;
    const { categoriesClassificator } = this.props;
    const catid = getQueryParameterFromURL("Category", targetUrl);
    const category = categoriesClassificator.filter((cat) => cat.categoryCode === catid)[0];

    if (!category) return;

    function getUpperLevelCategory(category: ICategoryClassificator): ICategoryClassificator {
      return category.parent ? getUpperLevelCategory(category.parent) : category;
    }

    const upperLevelCategory = getUpperLevelCategory(category);
    const { categoryCode } = upperLevelCategory;

    this.props.registerBannerClick(uid);
    this.props.chooseCategorySubcategory(categoryCode, catid);
    this.props.search({ category: catid });
  };

  render() {
    const { banners, count } = this.props;
    return banners?.length ? (
      <Slider
        type={SliderType.top}
        slides={banners.map((item) => ({
          image: item.imageUrl,
          uid: item.uid,
          targetUrl: item.targetUrl,
        }))}
        showIfEmpty
        onClick={this.marketingBannerClickHandle}
        className="big-marketing-banner-slider"
      />
    ) : null;
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  loading: state.bannersReducer.loading,
  banners: state.bannersReducer.banners,
  count: state.bannersReducer.count,
});

const mapDispatchToProps = (dispatch: any) => ({
  loadMarketingBanners: () => dispatch(loadMarketingBanners()),
  chooseCategorySubcategory: (catid?: string, subcatid?: string) =>
    dispatch(chooseCategorySubcategory(catid, subcatid)),
  search: (searchParams: ISearchParams) => dispatch(searchProducts(searchParams)),
  registerBannerClick: (bannerUid: string, channel?: string) =>
    dispatch(registerBannerClick(bannerUid, channel)),
});

export default compose<React.FC>(
  withTranslation(),
  connectCategoriesClassificator,
  connect(mapStateToProps, mapDispatchToProps),
  connectProfile
)(BigMarketingBannerSlider);
