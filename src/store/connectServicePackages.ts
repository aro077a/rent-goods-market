import { IApplicationStore } from "./rootReducer";
import { connect } from "react-redux";
import { ProductFeatureType, Product } from "../types/marketplaceapi";
import {
  loadServicePackages,
  loadPublishedProducts,
} from "../actions/productPromotionActions";

export interface IServicePackagesProps {
  servicePackagesLoading?: boolean;
  servicePackagesLoadingError?: any;
  servicePackages: ProductFeatureType[];
  loadServicePackages?(): () => Promise<void>;
  publishedProductsLoading?: boolean;
  publishedProductsLoadingError?: any;
  publishedProducts: Product[];
  loadPublishedProducts?(): () => Promise<void>;
}

const mapStateToProps = ({
  productPromotionReducer: {
    servicePackages,
    servicePackagesLoading,
    servicePackagesLoadingError,
    publishedProducts,
    publishedProductsLoading,
    publishedProductsLoadingError,
  },
}: IApplicationStore) => ({
  servicePackages,
  servicePackagesLoading,
  servicePackagesLoadingError,
  publishedProducts,
  publishedProductsLoading,
  publishedProductsLoadingError,
});

const mapDispatchToProps = (dispatch: any) => ({
  loadServicePackages: () => dispatch(loadServicePackages()),
  loadPublishedProducts: () => dispatch(loadPublishedProducts()),
});

export default connect(mapStateToProps, mapDispatchToProps);
